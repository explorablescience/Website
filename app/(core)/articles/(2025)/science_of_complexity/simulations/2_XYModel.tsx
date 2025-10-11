'use client'

import { JSX, useState, createRef, useMemo, useEffect, useRef } from "react";
import { Simulation } from "../logic/simulations/Simulation";
import { Slider } from "../logic/simulations/Sliders";
import logger from "@/app/api/client/logger";

// Draw an arrow
function canvasArrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, r: number) {
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

function toCanvasCoords(pos: number[], size: { width: number; height: number }) {
    return { x: pos[0] * size.width, y: pos[1] * size.height };
}

function sampleGaussian(mean: number, stdev: number) {
    // Using Box-Muller transform to get a normal distribution
    const u = 1 - Math.random(); // Converting [0,1) to (0,1)
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Transform to the desired mean and standard deviation
    return z * stdev + mean;
}

function update(
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; },
    temperature: number,
    coupling: number,
    dt: number,
    showTSlider: boolean
): number[] {
    const noiseIntensity = 0.1;

    const newPosList = [...simData.posList];
    const newThetaList = [...simData.thetaList];

    // Create neighbor list
    const interactionRadius = 0.3;
    const neighborList: number[][] = new Array(newPosList.length).fill(0).map(() => []);
    newPosList.forEach((pos1, i) => {
        newPosList.forEach((pos2, j) => {
            if (i !== j) {
                // Compute distance with periodic boundary conditions (PBC)
                const dx = Math.abs(pos1[0] - pos2[0]);
                const dy = Math.abs(pos1[1] - pos2[1]);
                const wrappedDx = dx > 0.5 ? 1 - dx : dx;
                const wrappedDy = dy > 0.5 ? 1 - dy : dy;
                const dist = Math.hypot(wrappedDx, wrappedDy);
                if (dist < interactionRadius) {
                    neighborList[i].push(j);
                }
            }
        });
    });

    // Update angles based on neighbors
    newThetaList.forEach((theta, i) => {
        const neighbors = neighborList[i];
        if (neighbors.length > 0) {
            const sinSum = neighbors.reduce((sum, j) => {
                const thetaJ = newThetaList[j];
                return sum + Math.sin(thetaJ - theta);
            }, 0) / neighbors.length;
            newThetaList[i] = theta + coupling * sinSum + (showTSlider ? Math.sqrt(temperature) * noiseIntensity * sampleGaussian(0, 10) * dt : 0);
        }

        // Keep theta within [0, 2π]
        newThetaList[i] = (newThetaList[i] + 2 * Math.PI) % (2 * Math.PI);
    });

    return newThetaList;
}

function draw(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; }
) {
    // Clear canvas
    ctx.fillStyle = "#070124ff";
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillRect(0, 0, size.width, size.height);

    // Draw individuals
    simData.posList.forEach((val, i) => {
        const pos = toCanvasCoords(val, size);
        const theta = simData.thetaList[i];

        // Draw the arrow
        const radius = 30;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        const length = radius * 0.81;
        const sx = length * Math.cos(theta);
        const sy = length * Math.sin(theta);
        canvasArrow(ctx, pos.x - sx / 2, pos.y - sy / 2, pos.x + sx / 2, pos.y + sy / 2, 5);
    });
}

function SimulationLogic({ canvasRef, aspectRatio, temperature, coupling, showTSlider, isVisible }: {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    aspectRatio: number;
    temperature: number;
    coupling: number;
    showTSlider: boolean;
    isVisible: boolean;
}) {
    // Simulation parameters
    const N = 16; // Number of individuals on width direction
    const [Nx, Ny] = [N, Math.floor(N / aspectRatio)];

    const posListRef = useRef(new Array(N).fill(false).map(() => [0, 0]));
    const thetaListRef = useRef(new Array(N).fill(false).map(() => 0));

    useMemo(() => {
        // Create individuals
        const posList = new Array(Nx * Ny).fill(false).map((_val, index) => [
            (index % Nx + 0.5) / Nx,
            (Math.floor(index / Nx) + 0.5) / Ny
        ]);
        const thetaList = new Array(Nx * Ny).fill(false).map(() => {
            return Math.random() * 2 * Math.PI;
        }); // Random orientations

        posListRef.current = posList;
        thetaListRef.current = thetaList;
    }, [Nx, Ny]);

    useEffect(() => {
        // If not visible, do not run the simulation
        if (!isVisible) return;

        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logger.error(new Error("Canvas reference is null in the XY Model simulation (Science of Complexity article)"));
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
        if (!context) logger.error(new Error("Canvas context is null in the XY Model simulation (Science of Complexity article)"));
        const ctx = context!;

        // Tick loop
        let animationFrameId: number;
        let lastTime: number = new Date().getTime();
        const tick = () => {
            // Calculate delta time
            const time = new Date().getTime();
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            // Update and draw
            thetaListRef.current = update({ Nx, Ny, posList: posListRef.current, thetaList: thetaListRef.current }, temperature, coupling, dt, showTSlider);
            draw(ctx, { width, height }, { Nx, Ny, posList: posListRef.current, thetaList: thetaListRef.current });

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [Nx, Ny, canvasRef, coupling, isVisible, showTSlider, temperature]);

    return <></>;
}

export function XYModel(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    showTSlider: boolean; // Whether to show sliders or not
}): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [temperature, setTemperature] = useState(7);
    const [coupling, setCoupling] = useState(0.3);
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16/9, []);

    const controls = <>
        {props.showTSlider && <Slider
            label={"Temperature"}
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={15}
            step={0.01}
            color="#6a5ff7"
            displayValue={false} />}
        <Slider
            label={<>&nbsp;&nbsp;&nbsp;Interaction</>}
            value={coupling}
            onChange={setCoupling}
            min={0}
            max={2}
            step={0.001}
            color="#12a02a"
            displayValue={false} />
    </>;

    return <>
        <Simulation
            aspectRatio={`${aspectRatio}`}
            title={props.title}
            description={props.description}
            controls={controls}
            canvasRef={canvasRef}
            onChangeVisibleState={setVisible}
            is2D />
        <SimulationLogic canvasRef={canvasRef} aspectRatio={aspectRatio} temperature={temperature} coupling={coupling / 50.0} showTSlider={props.showTSlider} isVisible={visible} />
    </>;
}
