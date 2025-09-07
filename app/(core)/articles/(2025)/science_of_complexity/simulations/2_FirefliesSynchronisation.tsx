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

function interpolateArray(arr1: number[], arr2: number[], t: number) {
    return arr1.map((d, i) => d + (arr2[i] - d) * t);
}

function mapValue(value: number[], inMin: number, inMax: number, outMin: number, outMax: number): number[] {
    return value.map(v => (v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

function update(
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; velList: number[][]; omegaList: number[]; tickingList: number[] },
    temperature: number,
    coupling: number,
    omegaActivated: boolean,
    dt: number,
    fakeSynchronisation?: number
): [number[][], number[][], number[], number[]] {
    const noiseIntensity = 0.1;
    const decayRate = 2.0;

    const newPosList = [...simData.posList];
    const newVelList = [...simData.velList];
    const newThetaList = [...simData.thetaList];
    const newTickingList = [...simData.tickingList];

    // Create neighbor list
    if (fakeSynchronisation == null) {
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
                if (!omegaActivated) {
                    newThetaList[i] = 0;
                }
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
    }
    else {
        // Update angles based on neighbors
        newThetaList.forEach((theta, i) => {
            // Compute new angle based on omega
            const omega = simData.omegaList[i];
            newThetaList[i] = theta + omega * dt;

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
    }
    

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

function draw(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; velList: number[][]; thetaList: number[]; },
    tickingFireflies: number[],
    drawFireflies: boolean,
    fakeSynchronisation?: number,
    conclusion?: boolean
) {
    // Clear canvas
    ctx.fillStyle = "#070124ff";
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillRect(0, 0, size.width, size.height);

    if (!drawFireflies) {
        // Draw individuals
        simData.posList.forEach((val, i) => {
            const pos = toCanvasCoords(val, size);
            const theta = simData.thetaList[i];
            const isTicking = tickingFireflies[i] > 0;

            const tickingStrokeColor = interpolateArray([216, 216, 216], [255, 49, 49], tickingFireflies[i]);
            const tickingStroke = `rgba(${tickingStrokeColor[0]}, ${tickingStrokeColor[1]}, ${tickingStrokeColor[2]}, 1.0)`;
            const tickingFill = `rgba(255, 126, 126, ${tickingFireflies[i] * 0.9})`;

            // Draw a circle
            ctx.lineWidth = 2;
            ctx.strokeStyle = isTicking ? tickingStroke : 'rgba(216, 216, 216, 1)';
            ctx.fillStyle = isTicking ? tickingFill : 'rgba(255, 255, 255, 0.0)';
            ctx.beginPath();
            const radius = 15;
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            // Draw an arrow in the center of the circle
            ctx.lineWidth = 1;
            ctx.fillStyle = isTicking ? tickingStroke : 'white';
            const length = radius * 0.81;
            canvasArrow(ctx, pos.x, pos.y, pos.x + length * Math.cos(theta), pos.y + length * Math.sin(theta), 3);
        });
    }
    else {
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
            let s = fakeSynchronisation != null ? 0.2 : 0.3;
            if (conclusion) s = 0.15;
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
            ctx.fillStyle = "#b4b4b425";
            ctx.stroke(rightWing);
            ctx.stroke(leftWing);
            ctx.fill(rightWing);
            ctx.fill(leftWing);

            ctx.fillStyle = isTicking ? tickingFill : 'rgba(77, 77, 77, 0.2)';
            ctx.strokeStyle = blackColor;
            ctx.stroke(lowerBody);
            ctx.fill(lowerBody);

            ctx.restore();
        });
    }
}

function SimulationLogic({ canvasRef, aspectRatio, temperature, coupling, drawFireflies, omegaActivated, fakeSynchronisation, conclusion, isVisible }: {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    aspectRatio: number;
    temperature: number;
    coupling: number;
    showSliders: boolean;
    drawFireflies: boolean;
    omegaActivated: boolean;
    fakeSynchronisation?: number;
    conclusion?: boolean;
    isVisible?: boolean;
}): JSX.Element {
    // Simulation parameters
    const v0 = 0.15; // Speed
    let N = fakeSynchronisation == null ? 12 : 10; // Number of individuals on width direction
    if (conclusion) N = 9;
    const [Nx, Ny] = [N, Math.floor(N / aspectRatio)];

    const posListRef = useRef(new Array(N).fill(false).map(() => [0, 0]));
    const velListRef = useRef(new Array(N).fill(false).map(() => [0, 0]));
    const omegaListRef = useRef(new Array(N).fill(false).map(() => 0));
    const thetaListRef = useRef(new Array(N).fill(false).map(() => 0));
    const tickingListRef = useRef(new Array(N).fill(false).map(() => 0));

    useMemo(() => {
        // Create individuals
        const posList = new Array(Nx * Ny).fill(false).map(() => [Math.random(), Math.random()]); // Random positions
        const velList = new Array(Nx * Ny).fill(false).map(() => [v0 * Math.random(), v0 * Math.random()]); // Initial velocities

        posListRef.current = posList;
        velListRef.current = velList;
    }, [Nx, Ny]);

    useMemo(() => {
        // Create individuals
        const omegaList = new Array(Nx * Ny).fill(false).map(() => {
            if (fakeSynchronisation == null) {
                return omegaActivated ? sampleGaussian(3, 0.2) : 0; // Sampled from a Gaussian distribution
            }
            else {
                if (Math.random() < fakeSynchronisation) {
                    return 4; // Synchronized frequency
                }
                return Math.random() * 6; // Random frequency
            }
        }); // Natural frequencies
        const thetaList = new Array(Nx * Ny).fill(false).map(() => {
            if (fakeSynchronisation == null) {
                return Math.random() * 2 * Math.PI; // Random angle
            }
            else {
                if (Math.random() < fakeSynchronisation) {
                    return 0.2; // Synchronized angle
                }
                return Math.random() * 2 * Math.PI; // Random angle
            }
        }); // Random orientations
        const tickingList = new Array(Nx * Ny).fill(0); // If the firefly is currently ticking

        omegaListRef.current = omegaList;
        thetaListRef.current = thetaList;
        tickingListRef.current = tickingList;
    }, [Nx, Ny, fakeSynchronisation, omegaActivated]);

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
                Nx, Ny, posList: posListRef.current, thetaList: thetaListRef.current, velList: velListRef.current, omegaList: omegaListRef.current, tickingList: tickingListRef.current
            }, temperature, coupling, omegaActivated, dt, fakeSynchronisation);
            draw(ctx, { width, height }, { Nx, Ny, posList: posListRef.current, velList: velListRef.current, thetaList: thetaListRef.current }, tickingListRef.current, drawFireflies, fakeSynchronisation, conclusion);

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, isVisible, fakeSynchronisation, Nx, Ny, temperature, coupling, omegaActivated, drawFireflies, conclusion]);

    return <></>;
}

export function FirefliesSynchronisation(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    showSliders: boolean; // Whether to show sliders or not
    omegaActivated: boolean; // Whether to include omega in the simulation
    fakeSynchronisation?: number; // A number that forces a fake synchronisation amount
    conclusion?: boolean; // Whether this simulation is in the conclusion section
}): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [temperature, setTemperature] = useState(7);
    const [drawFireflies, setDrawFireflies] = useState(true);
    const [coupling, setCoupling] = useState(0.3);
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16/9, []);

    // If hide sliders and in simulation mode, init parameters to get synchronisation
    useMemo(() => {
        if (!props.showSliders) {
            setTemperature(7);
            setCoupling(1.5);
        }
    }, [props.showSliders]);

    const controls = <>
        <div className="custom-check-g-container">
            <div className="custom-check-container">
                <label htmlFor="show-arrows">Arrows</label>
                <input type="checkbox" checked={!drawFireflies} onChange={e => setDrawFireflies(!e.target.checked)} />
            </div>
        </div>
        <Slider
            label={<>Interaction</>}
            value={coupling}
            onChange={setCoupling}
            min={0}
            max={2}
            step={0.001}
            color="#12a02a"
            displayValue={false} />
        <Slider
            label={<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Noise</>}
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={15}
            step={0.01}
            color="#6a5ff7"
            displayValue={false} />
    </>;

    return <>
        <Simulation
            aspectRatio={`${aspectRatio}`}
            title={props.title}
            description={props.description}
            controls={props.showSliders ? controls : <></>}
            canvasRef={canvasRef}
            onChangeVisibleState={setVisible}
            is2D />
        <SimulationLogic canvasRef={canvasRef} aspectRatio={aspectRatio} temperature={temperature} coupling={coupling / 50.0} showSliders={props.showSliders} drawFireflies={drawFireflies} omegaActivated={props.omegaActivated} fakeSynchronisation={props.fakeSynchronisation} conclusion={props.conclusion} isVisible={visible} />
    </>;
}
