'use client'

import { createRef, JSX, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "../logic/simulations/Sliders";
import { Simulation } from "../logic/simulations/Simulation";
import logError from "../logic/api_manager";

// Draw a big arrow on the right for total magnetization
function canvas_arrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, r: number) {
    const x_center = tox;
    const y_center = toy;

    let angle;
    let x;
    let y;

    // Draw line
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();

    // Draw arrow
    context.beginPath();

    angle = Math.atan2(toy - fromy, tox - fromx)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1 / 3) * (2 * Math.PI)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1 / 3) * (2 * Math.PI)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

function computeEnergy(simData: { Nx: number; Ny: number; spins: boolean[] }, index: number, magneticFieldSign: number, temperature: number, useTemperature?: boolean): number {
    const { Nx, Ny, spins } = simData;
    
    // Check neighboring spins (up, down, left, right)
    const x = index % Nx;
    const y = Math.floor(index / Nx);
    const neighbors = [
        { x: x - 1, y },   // left
        { x: x + 1, y },   // right
        { x, y: y - 1 },   // up
        { x, y: y + 1 },   // down
    ];

    // Nearest neighbor interaction
    let energy = 0;
    neighbors.forEach(({ x, y }) => {
        // If out of range, use PBC
        if (x < 0) x += Nx;
        if (x >= Nx) x -= Nx;
        if (y < 0) y += Ny;
        if (y >= Ny) y -= Ny;

        // Add energy contribution
        const neighborIndex = y * Nx + x;
        energy += spins[neighborIndex] ? 1 : -1;
    });
    energy = -energy * (spins[index] ? 1 : -1);

    // Adding constant magnetic field to speed up convergence
    if (useTemperature) {
        const magneticField = magneticFieldSign * (temperature < 2 ? 0.05 : 0); // Arbitrary small value
        energy -= magneticField * (spins[index] ? 1 : -1);
    }

    return energy;
}

function update(simData: { Nx: number; Ny: number; spins: boolean[], magFieldSign: number }, temperature: number, useTemperature?: boolean, customT?: number): [boolean[], number] {
    const ITERATIONS = 3000; // Number of iterations to perform in each tick

    const newSpins = [...simData.spins];
    for (let i = 0; i < ITERATIONS; i++) {
        // Select random spin
        const index = Math.floor(Math.random() * simData.spins.length);

        // Compute old and new energy
        const oldEnergy = 2.0 * computeEnergy({ Nx: simData.Nx, Ny: simData.Ny, spins: newSpins }, index, simData.magFieldSign, temperature, useTemperature);
        newSpins[index] = !newSpins[index]; // Flip the spin
        const newEnergy = 2.0 * computeEnergy({ Nx: simData.Nx, Ny: simData.Ny, spins: newSpins }, index, simData.magFieldSign, temperature, useTemperature);

        // DeltaE <= 0
        const deltaE = newEnergy - oldEnergy;
        if (deltaE <= 0.0) // Change accepted
            continue;

        if (useTemperature || customT != null) {
            // DeltaE >= 0
            const invertProba = Math.random();
            const beta = 1.0 / temperature;
            if (invertProba <= Math.exp(-beta * deltaE)) // P < exp(-beta * deltaE) : Change accepted
                continue;
            newSpins[index] = !newSpins[index]; // Change rejected
        }
        if (!useTemperature) {
            newSpins[index] = !newSpins[index]; // Change rejected
        }
    }

    // Compute total magnetization in the right area
    let totalMagnetization = 0;
    newSpins.forEach((spin) => {
        totalMagnetization += spin ? 1 : -1;
    });
    totalMagnetization /= newSpins.length;

    return [newSpins, totalMagnetization];
}

function draw(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; spins: boolean[], totalMagnetization: number }
) {
    // Clear canvas
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, size.width, size.height);

    // Draw spins
    const epsilon = 1;
    simData.spins.forEach((spin, i) => {
        const x = (i % simData.Nx) * (size.width / simData.Nx);
        const y = Math.floor(i / simData.Nx) * (size.height / simData.Ny);
        if (spin) {
            ctx.fillStyle = "#ff3235"; // Spin up
        } else {
            ctx.fillStyle = "#2939e2"; // Spin down
        }
        ctx.fillRect(x, y, size.width / simData.Nx + epsilon, size.height / simData.Ny + epsilon);
    });

    // Add total magnetization arrow
    const mag = simData.totalMagnetization;
    const magAbs = Math.min(0.8, Math.abs(mag * 0.9) + 0.05);
    const arrowSize = 5 + 25 * magAbs;
    const heightEnd = Math.sign(mag) == 1 ? size.height * (0.5 - magAbs / 2.0) : size.height - size.height * (0.5 - magAbs / 2.0);

    ctx.lineWidth = arrowSize;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white'; // for the triangle fill
    ctx.lineJoin = 'bevel';
    canvas_arrow(ctx, size.width - 30, size.height / 2, size.width - 30, heightEnd, arrowSize * 1.1);
}

function SimulationLogic({ canvasRef, aspectRatio, temperature, useTemperature, customT, isVisible }: {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    aspectRatio: number;
    temperature: number;
    useTemperature?: boolean;
    customT?: number;
    isVisible?: boolean;
}): JSX.Element {
    // Create simulation data
    const simData = useMemo(() => {
        // Create spins states
        const N = 150; // Number of spins on width direction
        const [Nx, Ny] = [N, Math.floor(N / aspectRatio)];
        const spins = new Array(Nx * Ny).fill(false).map(() => Math.random() < 0.5 ? true : false);
        const magFieldSign = Math.random() < 0.5 ? 1 : -1; // Randomly choose magnetic field direction
        return {
            Nx,
            Ny,
            spins,
            magFieldSign
        };
    }, [aspectRatio]);
    const spinsRef = useRef(simData.spins);
    const totalMagnetization = useRef(0);

    useEffect(() => {
        // If not visible, do not run the simulation
        if (!isVisible) return;

        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logError(new Error("Canvas reference is null (Ising simulation)"));
        const cv = canvas!;

        // Set canvas dimensions based on target
        const dpr = window.devicePixelRatio || 1;
        const rect = cv.getBoundingClientRect();
        const width = rect.width * dpr;
        const height = rect.height * dpr;
        cv.width = width;
        cv.height = height;

        // Get context
        const context = cv.getContext("2d");
        if (!context) logError(new Error("Canvas context is null (Ising simulation)"));
        const ctx = context!;

        // Tick loop
        let animationFrameId: number;
        const tick = () => {
            // Update and draw
            [spinsRef.current, totalMagnetization.current] = update({ Nx: simData.Nx, Ny: simData.Ny, spins: spinsRef.current, magFieldSign: simData.magFieldSign }, temperature, useTemperature, customT);
            draw(ctx, { width, height }, { Nx: simData.Nx, Ny: simData.Ny, spins: spinsRef.current, totalMagnetization: totalMagnetization.current });

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, customT, isVisible, simData.Nx, simData.Ny, simData.magFieldSign, temperature, useTemperature]);

    return <></>;
}

export function IsingSimulation(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    useTemperature?: boolean; // Optional prop to indicate if temperature should be used in the simulation
    customT?: number; // Optional custom temperature value
}): JSX.Element {
    const [visible] = useState(false);
    const [temperature, setTemperature] = useState(props.customT == null ? 7 : props.customT);
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16/9, []);

    const controls = <>
        <Slider
            label={"Temperature"}
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={10}
            step={0.01}
            color="#6a5ff7"
            displayValue={false} />
    </>;

    return <>
        <Simulation
            aspectRatio={`${aspectRatio}`}
            title={props.title}
            description={props.description}
            controls={props.useTemperature ? controls : <></>}
            canvasRef={canvasRef}
        />
        <SimulationLogic
            canvasRef={canvasRef}
            aspectRatio={aspectRatio}
            temperature={temperature}
            useTemperature={props.useTemperature}
            customT={props.customT}
            isVisible={visible} />
    </>;
}
