'use client'

import { JSX, useState, createRef, useMemo, useEffect, useRef } from "react";
import { Simulation } from "../logic/simulations/Simulation";
import { Slider } from "../logic/simulations/Sliders";
import logError from "../logic/api_manager";
import "./2_FirefliesSynchronisation.css";

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
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; velList: number[][]; omegaList: number[]; tickingList: number[] },
    temperature: number,
    coupling: number,
    dt: number
): [number[][], number[][], number[], number[]] {
    const noiseIntensity = 0.1;
    const decayRate = 2.0;

    const newPosList = simData.posList;
    const newVelList = [...simData.velList];
    const newThetaList = [...simData.thetaList];
    const newTickingList = [...simData.tickingList];

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
        const omega = simData.omegaList[i];
        if (neighbors.length > 0) {
            const sinSum = neighbors.reduce((sum, j) => {
                const thetaJ = newThetaList[j];
                return sum + Math.sin(thetaJ - theta);
            }, 0) / neighbors.length;
            newThetaList[i] = theta + omega * dt + coupling * sinSum + Math.sqrt(temperature) * noiseIntensity * sampleGaussian(0, 10) * dt;
        }

        // Keep theta within [0, 2π]
        newThetaList[i] = (newThetaList[i] + 2 * Math.PI) % (2 * Math.PI);

        // Check if ticking
        const eta = 0.1;
        const targetTheta = (3 * Math.PI) / 2; // -Math.PI/2 mapped to [0, 2π]
        if (
            newThetaList[i] > targetTheta - eta &&
            newThetaList[i] < targetTheta + eta
        ) {
            newTickingList[i] = 1;
        }

        // Decay ticking state
        if (newTickingList[i] > 0) {
            newTickingList[i] -= decayRate * dt;
            if (newTickingList[i] < 0) newTickingList[i] = 0;
        }
    });

    return [newPosList, newVelList, newThetaList, newTickingList];
}

function draw(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; velList: number[][]; thetaList: number[]; },
    drawOrderParameter: boolean
) {
    // Clear canvas
    ctx.fillStyle = "#070124ff";
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillRect(0, 0, size.width, size.height);

    // Draw individuals
    const length = 150;
    const center = toCanvasCoords([0.5, 0.5], size);
    simData.posList.forEach((val, i) => {
        const theta = simData.thetaList[i];

        // Draw an arrow in the center of the circle
        ctx.lineWidth = 8;
        ctx.fillStyle = 'rgba(214, 182, 0, 0.23)';
        ctx.strokeStyle = ctx.fillStyle;
        canvasArrow(ctx, center.x, center.y, center.x + length * Math.cos(theta), center.y + length * Math.sin(theta), 15);
    });

    if (drawOrderParameter) {
        // Compute parameters
        const orderParam = simData.thetaList.reduce((sum, theta) => {
            return [sum[0] + Math.cos(theta), sum[1] + Math.sin(theta)];
        }, [0, 0]);
        const R = Math.hypot(orderParam[0], orderParam[1]) / simData.thetaList.length;
        const Rs = R * 0.95;
        const avgTheta = Math.atan2(orderParam[1], orderParam[0]);

        // Draw arrow
        ctx.lineWidth = (1 - R) * 3 + R * 12;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        const arrowX = center.x + length * Rs * Math.cos(avgTheta);
        const arrowY = center.y + length * Rs * Math.sin(avgTheta);
        canvasArrow(ctx, center.x, center.y, arrowX, arrowY, (1 - R) * 5 + R * 21);
    }

    // Draw outer circle
    const radius = length * 1.10;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw inner circle
    const radiusI = 6;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radiusI, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();
}

function SimulationLogic({ canvasRef, aspectRatio, temperature, coupling, drawOrderParameter, isVisible }: {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    aspectRatio: number;
    temperature: number;
    coupling: number;
    drawOrderParameter: boolean;
    isVisible?: boolean;
}): JSX.Element {
    // Simulation parameters
    const v0 = 0.15; // Speed
    const simData = useMemo(() => {
        // Create individuals
        const N = 15; // Number of individuals on width direction
        const [Nx, Ny] = [N, Math.floor(N / aspectRatio)];
        const posList = new Array(Nx * Ny).fill(false).map(() => [Math.random(), Math.random()]); // Random positions
        const velList = new Array(Nx * Ny).fill(false).map(() => [v0 * Math.random(), v0 * Math.random()]); // Initial velocities
        const omegaList = new Array(Nx * Ny).fill(false).map(() => {
            return sampleGaussian(1, 0.1);
        }); // Natural frequencies
        const thetaList = new Array(Nx * Ny).fill(false).map(() => {
            return Math.random() * 2 * Math.PI;
        }); // Random orientations
        const tickingList = new Array(Nx * Ny).fill(0); // If the firefly is currently ticking
        return {
            Nx,
            Ny,
            posList,
            velList,
            omegaList,
            thetaList,
            tickingList
        };
    }, [aspectRatio]);
    const posListRef = useRef(simData.posList);
    const velListRef = useRef(simData.velList);
    const omegaListRef = useRef(simData.omegaList);
    const thetaListRef = useRef(simData.thetaList);
    const tickingListRef = useRef(simData.tickingList);

    useEffect(() => {
        // If not visible, do not run the simulation
        if (!isVisible) return;

        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logError(new Error("Canvas reference is null (Kuramoto simulation)"));
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
        if (!context) logError(new Error("Canvas context is null (Kuramoto simulation)"));
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
            [posListRef.current, velListRef.current, thetaListRef.current, tickingListRef.current] = update({
                Nx: simData.Nx, Ny: simData.Ny, posList: posListRef.current, thetaList: thetaListRef.current, velList: velListRef.current, omegaList: omegaListRef.current, tickingList: tickingListRef.current
            }, temperature, coupling, dt);
            draw(ctx, { width, height }, { Nx: simData.Nx, Ny: simData.Ny, posList: posListRef.current, velList: velListRef.current, thetaList: thetaListRef.current }, drawOrderParameter);

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, coupling, drawOrderParameter, isVisible, simData.Nx, simData.Ny, temperature]);

    return <></>
}

export function FirefliesOrderParameter(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    drawOrderParameter: boolean; // Whether to draw the order parameter arrow
}): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [temperature, setTemperature] = useState(2);
    const [coupling, setCoupling] = useState(0.1);
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16 / 10, []);

    const controls = <>
        <Slider
            label={<>Interaction</>}
            value={coupling}
            onChange={setCoupling}
            min={0}
            max={1.0}
            step={0.001}
            color="#12a02a"
            displayValue={false} />
        <Slider
            label={<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Noise</>}
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={6}
            step={0.01}
            color="#6a5ff7"
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
        <SimulationLogic canvasRef={canvasRef} aspectRatio={aspectRatio} temperature={temperature} coupling={coupling / 50.0 * 0.9} drawOrderParameter={props.drawOrderParameter} isVisible={visible} />
    </>;
}
