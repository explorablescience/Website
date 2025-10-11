'use client'

import { JSX, useState, createRef, useMemo, useEffect, useRef } from "react";
import logError from "../logic/api_manager";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useIsVisible } from "../logic/utils";
import styles from "./0_HeaderSimulation.module.css";
import errorStyles from '../logic/simulations/SimulationError.module.css';

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
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

function mapValue(value: number[], inMin: number, inMax: number, outMin: number, outMax: number): number[] {
    return value.map(v => (v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

function updateFireflies(
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; velList: number[][]; omegaList: number[]; tickingList: number[] },
    temperature: number,
    coupling: number,
    dt: number
): [number[][], number[][], number[], number[]] {
    const noiseIntensity = 0.1;
    const decayRate = 2.0;

    const newPosList = [...simData.posList];
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

    // Update positions based on new angles
    const vNoise = 0.02;
    newPosList.forEach((pos, i) => {
        const vel = simData.velList[i];

        // Update position
        pos[0] += vel[0] * dt;
        pos[1] += vel[1] * dt;

        // Periodic boundary conditions
        pos[0] = (pos[0] + 1) % 1;
        pos[1] = (pos[1] + 1) % 1;

        // Update velocity with random noise
        const velNorm = Math.hypot(vel[0], vel[1]);
        vel[0] += vNoise * sampleGaussian(0, 3) * dt;
        vel[1] += vNoise * sampleGaussian(0, 3) * dt;
        vel[0] = (vel[0] / Math.hypot(vel[0], vel[1])) * velNorm;
        vel[1] = (vel[1] / Math.hypot(vel[0], vel[1])) * velNorm;
    });

    return [newPosList, newVelList, newThetaList, newTickingList];
}
function drawFireflies(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; velList: number[][]; thetaList: number[]; },
    tickingFireflies: number[]
) {
    const upperBody = new Path2D("m 0.39546563,-39.40837 c -9.57057903,0 -14.44356163,12.57643 -14.44356163,17.99942 0,5.42298 2.843754,8.37028 2.843754,13.8467 0,4.63847 -2.013608,6.81601 -2.629813,10.68152 A 44.659756,27.601246 0 0 1 2.9198556,1.10337 44.659756,27.601246 0 0 1 14.398746,2.03097 c -0.77399,-3.22107 -2.40295,-5.41183 -2.40295,-9.59322 0,-5.47642 2.84375,-8.42372 2.84375,-13.8467 0,-5.42299 -4.8735204,-17.99942 -14.44408037,-17.99942 z");
    const rightWing = new Path2D("m 39.748406,-28.316643 c -11.32277,0.02642 -27.75261,9.453673 -27.75261,20.754393 0,0 38.20213,1.30358 38.20213,-13.491184 0,-5.085698 -4.51856,-7.27705 -10.44952,-7.263209 z M 17.931616,-7.70243 c -3.58518,0.019 -5.93582,0.14018 -5.93582,0.14018 0,17.220131 38.20213,26.967329 38.20213,12.172561 0,-11.096071 -21.51073,-12.369591 -32.26631,-12.312741 z");
    const leftWing = new Path2D("m -38.956948,-28.31664 c 11.322765,0.02642 27.752606,9.453673 27.752606,20.75439 0,0 -38.202132,1.303581 -38.202132,-13.491181 0,-5.085698 4.518562,-7.27705 10.449526,-7.263209 z m 21.816786,20.61421 c 3.585183,0.01898 5.93582,0.14018 5.93582,0.14018 0,17.220132 -38.202132,26.967329 -38.202132,12.172563 0,-11.096074 21.510737,-12.369586 32.266312,-12.312743 z");
    const lowerBody = new Path2D("m 2.9100356,1.10234 a 44.659756,27.601246 0 0 0 -16.7540096,2.0159 c -0.11137,0.69844 -0.17674,1.4515 -0.17674,2.28462 0,5.443609 1.52538,34.031929 14.40687963,34.772549 C 13.267656,39.434789 14.793036,10.846469 14.793036,5.40286 c 0,-1.28289 -0.15595,-2.37701 -0.39429,-3.37189 A 44.659756,27.601246 0 0 0 2.9100356,1.10234 Z");


    // Draw individuals
    simData.posList.forEach((valRaw, i) => {
        const val = mapValue(valRaw, 0, 1, -0.05, 1.05);
        ctx.save();

        const pos = toCanvasCoords(val, size);
        const vel = simData.velList[i];
        const velDir = Math.atan2(vel[1], vel[0]);
        const isTicking = tickingFireflies[i] > 0;
        const tickingFill = `rgba(255, 190, 14, ${tickingFireflies[i] * 1.0})`;
        const blackColor = 'rgba(10, 10, 10, 1.0)';

        // Move shapes to the right position and orientation
        ctx.translate(pos.x, pos.y);
        const s = 0.3;
        ctx.scale(s, s);
        ctx.rotate(velDir + 1.5);

        // If ticking, draw small blured circle around
        if (isTicking) {
            ctx.beginPath();
            ctx.filter = "blur(12px)";
            ctx.arc(0, 0, 70, 0, 2 * Math.PI);
            ctx.fillStyle = tickingFill;
            ctx.fill();
        }
        ctx.filter = "none";

        // Draw the firefly
        ctx.fillStyle = blackColor;
        ctx.strokeStyle = blackColor;
        ctx.stroke(upperBody);
        ctx.fill(upperBody);

        ctx.lineWidth = 2;
        ctx.strokeStyle = blackColor;
        ctx.fillStyle = "#dfdfdf25";
        ctx.stroke(rightWing);
        ctx.stroke(leftWing);
        ctx.fill(rightWing);
        ctx.fill(leftWing);

        ctx.fillStyle = isTicking ? tickingFill : 'rgba(175, 172, 172, 0.2)';
        ctx.strokeStyle = blackColor;
        ctx.stroke(lowerBody);
        ctx.fill(lowerBody);

        ctx.restore();
    });
}


function updateFishes(
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; velList: number[] },
    temperature: number,
    coupling: number,
    dt: number
): [number[][], number[], number[]] {
    const noiseIntensity = 0.1;

    const newPosList = [...simData.posList];
    const newVelList = [...simData.velList];
    const newThetaList = [...simData.thetaList];

    // Create neighbor list
    const interactionRadius = 0.1;
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
            newThetaList[i] = theta + coupling * sinSum + Math.sqrt(temperature) * noiseIntensity * sampleGaussian(0, 10) * dt;
        }

        // Keep theta within [0, 2π]
        newThetaList[i] = (newThetaList[i] + 2 * Math.PI) % (2 * Math.PI);
    });

    // Update positions based on new angles
    newPosList.forEach((pos, i) => {
        const vel = simData.velList[i];
        const theta = newThetaList[i];

        // Update position
        pos[0] += vel * dt * Math.cos(theta);
        pos[1] += vel * dt * Math.sin(theta);

        // Periodic boundary conditions
        pos[0] = (pos[0] + 1) % 1;
        pos[1] = (pos[1] + 1) % 1;
    });

    return [newPosList, newVelList, newThetaList];
}
function drawFishes(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; velList: number[]; thetaList: number[]; }
) {
    const fish = new Path2D("m 0,-55.361361 c -7.233624,0 -10.636408,16.309314 -11.276832,32.038875 0,0 -10.724855,13.7182701 -7.731827,16.9607201 2.298053,2.48955 6.066415,-3.9166901 7.692553,-7.0259301 0.124074,3.6295296 0.402629,7.0012301 0.819589,9.8603801 1.724739,11.82679 4.520187,26.0693599 7.10159,38.7227599 -0.728472,2.83258 -0.274272,5.35692 -2.141686,6.45639 -7.700014,4.53352 -12.889653,4.97487 -12.889653,10.10843 0,5.72617 14.482276,5.31951 18.426266,0.85421 3.94399,4.4653 18.426265,4.87196 18.426265,-0.85421 0,-5.13356 -5.189632,-5.57491 -12.889653,-10.10843 -1.86741,-1.09947 -1.912058,-3.87323 -2.32875,-6.39403 2.5814,-12.6534 5.563913,-26.9583299 7.288654,-38.7851199 0.41696,-2.85915 0.695509,-6.2308505 0.819589,-9.8603801 1.62613,3.10924 5.394503,9.5154801 7.692553,7.0259301 2.99303,-3.24245 -7.731827,-16.9607201 -7.731827,-16.9607201 C 10.636411,-39.052049 7.23363,-55.361361 0,-55.361361 Z");

    // Draw individuals
    simData.posList.forEach((valRaw, i) => {
        const val = mapValue(valRaw, 0, 1, -0.05, 1.05);
        ctx.save();

        const pos = toCanvasCoords(val, size);
        const theta = simData.thetaList[i];

        // Move shapes to the right position and orientation
        ctx.translate(pos.x, pos.y);
        const s = 0.25;
        ctx.scale(s, s);
        ctx.rotate(theta + 1.7);

        // Draw the firefly
        ctx.fillStyle = "#4e678bff";
        ctx.fill(fish);

        ctx.restore();
    });
}



function SimulationLogic({ canvasRef, aspectRatio, isVisible }: { canvasRef: React.RefObject<HTMLCanvasElement | null>, aspectRatio: number, isVisible: boolean }) {
    // Fireflies data
    const temperature = 7;
    const coupling = 1.5 / 50.0;
    const ffv0 = 0.15; // Speed
    const ffN = 10; // Number of individuals on width direction
    const [ffNx, ffNy] = [ffN, Math.floor(ffN / aspectRatio)];

    // Fishes data
    const fiv0 = 0.15; // Speed
    const fiN = 30; // Number of individuals on width direction
    const [fiNx, fiNy] = [fiN, Math.floor(fiN / aspectRatio)];

    // Fireflies initial data
    const ffposListRef = useRef(new Array(ffN).fill(false).map(() => [0, 0]));
    const ffvelListRef = useRef(new Array(ffN).fill(false).map(() => [0, 0]));
    const ffomegaListRef = useRef(new Array(ffN).fill(false).map(() => 0));
    const ffthetaListRef = useRef(new Array(ffN).fill(false).map(() => 0));
    const fftickingListRef = useRef(new Array(ffN).fill(false).map(() => 0));
    useMemo(() => {
        const posList = new Array(ffNx * ffNy).fill(false).map(() => [Math.random(), Math.random()]); // Random positions
        const velList = new Array(ffNx * ffNy).fill(false).map(() => [ffv0 * Math.random(), ffv0 * Math.random()]); // Initial velocities
        const omegaList = new Array(ffNx * ffNy).fill(false).map(() => sampleGaussian(3, 0.2)); // Natural frequencies
        const thetaList = new Array(ffNx * ffNy).fill(false).map(() => Math.random() * 2 * Math.PI); // Random orientations
        const tickingList = new Array(ffNx * ffNy).fill(0); // If the firefly is currently ticking

        ffposListRef.current = posList;
        ffvelListRef.current = velList;
        ffomegaListRef.current = omegaList;
        ffthetaListRef.current = thetaList;
        fftickingListRef.current = tickingList;
    }, [ffNx, ffNy]);

    // Fishes initial data
    const fiposListRef = useRef(new Array(fiN).fill(false).map(() => [0, 0]));
    const fivelListRef = useRef(new Array(fiN).fill(false).map(() => 0));
    const fithetaListRef = useRef(new Array(fiN).fill(false).map(() => 0));
    useMemo(() => {
        // Create individuals
        const posList = new Array(fiNx * fiNy).fill(false).map(() => [Math.random(), Math.random()]); // Random positions
        const velList = new Array(fiNx * fiNy).fill(false).map(() => fiv0 * (0.5 + Math.random() * 0.6)); // Initial velocities
        const thetaList = new Array(fiNx * fiNy).fill(false).map(() => Math.random() * 2 * Math.PI); // Random orientations

        fiposListRef.current = posList;
        fivelListRef.current = velList;
        fithetaListRef.current = thetaList;
    }, [fiNx, fiNy]);

    // Simulate
    useEffect(() => {
        // If not visible, do not run the simulation
        if (!isVisible) return;

        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logError(new Error("Canvas reference is null (Header simulation)"));
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
        if (!context) logError(new Error("Canvas context is null (Header simulation)"));
        const ctx = context!;

        // Tick loop
        let animationFrameId: number;
        let lastTime: number = new Date().getTime();
        const tick = () => {
            // Calculate delta time
            const time = new Date().getTime();
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            // Clear canvas
            ctx.fillStyle = "#070124ff";
            ctx.clearRect(0, 0, width, height);
            ctx.fillRect(0, 0, width, height);

            // Update and draw fishes
            [fiposListRef.current, fivelListRef.current, fithetaListRef.current] = updateFishes({
                Nx: fiNx, Ny: fiNy, posList: fiposListRef.current, thetaList: fithetaListRef.current, velList: fivelListRef.current
            }, temperature, coupling, dt);
            drawFishes(ctx, { width, height }, { Nx: fiNx, Ny: fiNy, posList: fiposListRef.current, velList: fivelListRef.current, thetaList: fithetaListRef.current });

            // Update and draw fireflies
            [ffposListRef.current, ffvelListRef.current, ffthetaListRef.current, fftickingListRef.current] = updateFireflies({
                Nx: ffNx, Ny: ffNy, posList: ffposListRef.current, thetaList: ffthetaListRef.current, velList: ffvelListRef.current, omegaList: ffomegaListRef.current, tickingList: fftickingListRef.current
            }, temperature, coupling, dt);
            drawFireflies(ctx, { width, height }, { Nx: ffNx, Ny: ffNy, posList: ffposListRef.current, velList: ffvelListRef.current, thetaList: ffthetaListRef.current }, fftickingListRef.current);

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, coupling, ffNx, ffNy, fiNx, fiNy, isVisible]);

    return <></>
}

export function HeaderSimulation(): JSX.Element {
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16 / 6, []);
    const simulationRef = createRef<HTMLDivElement>();
    const [visible, setVisible] = useState(false);
    useIsVisible(simulationRef, (isVisible) => setVisible(isVisible));

    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <SimulationLogic canvasRef={canvasRef} aspectRatio={aspectRatio} isVisible={visible} />
            <div className={styles['simulation-header-canvas-container']} ref={simulationRef}>
                <canvas className={styles['simulation-header-canvas']} ref={canvasRef} />
            </div>
        </ErrorBoundary>
    </>
}
