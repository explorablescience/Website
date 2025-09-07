'use client'

import { JSX, useState, createRef, useMemo, useEffect, useRef } from "react";
import { Simulation } from "../logic/simulations/Simulation";
import { Slider } from "../logic/simulations/Sliders";
import logError from "../logic/api_manager";
import "./3_FishSchool.css";

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

function mapValue(value: number[], inMin: number, inMax: number, outMin: number, outMax: number): number[] {
    return value.map(v => (v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

function update(
    simData: { Nx: number; Ny: number; posList: number[][]; thetaList: number[]; velList: number[] },
    temperature: number,
    coupling: number,
    dt: number,
    synchronisation?: number
): [number[][], number[], number[]] {
    const noiseIntensity = 0.1;

    const newPosList = [...simData.posList];
    const newVelList = [...simData.velList];
    const newThetaList = [...simData.thetaList];

    if (synchronisation == null) {
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
    } else {
        // Update angles based on neighbors
        newThetaList.forEach((theta, i) => {
            newThetaList[i] = theta;

            // Keep theta within [0, 2π]
            newThetaList[i] = (newThetaList[i] + 2 * Math.PI) % (2 * Math.PI);
        });
    }
    


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

function draw(
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    simData: { Nx: number; Ny: number; posList: number[][]; velList: number[]; thetaList: number[]; },
    drawFish: boolean,
    synchronisation?: number,
    conclusion?: boolean
) {
    // Clear canvas
    ctx.fillStyle = "#f0f3fdff";
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillRect(0, 0, size.width, size.height);

    if (!drawFish) {
        // Draw individuals
        simData.posList.forEach((val, i) => {
            const pos = toCanvasCoords(val, size);
            const theta = simData.thetaList[i];

            // Draw a circle
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#062758ff';
            const radius = 15;

            // Draw an arrow in the center of the circle
            ctx.lineWidth = 2;
            ctx.fillStyle = '#062758ff';
            const length = radius * 1.0;
            canvasArrow(ctx, pos.x, pos.y, pos.x + length * Math.cos(theta), pos.y + length * Math.sin(theta), 4);
        });
    }
    else {
        const fish = new Path2D("m 0,-55.361361 c -7.233624,0 -10.636408,16.309314 -11.276832,32.038875 0,0 -10.724855,13.7182701 -7.731827,16.9607201 2.298053,2.48955 6.066415,-3.9166901 7.692553,-7.0259301 0.124074,3.6295296 0.402629,7.0012301 0.819589,9.8603801 1.724739,11.82679 4.520187,26.0693599 7.10159,38.7227599 -0.728472,2.83258 -0.274272,5.35692 -2.141686,6.45639 -7.700014,4.53352 -12.889653,4.97487 -12.889653,10.10843 0,5.72617 14.482276,5.31951 18.426266,0.85421 3.94399,4.4653 18.426265,4.87196 18.426265,-0.85421 0,-5.13356 -5.189632,-5.57491 -12.889653,-10.10843 -1.86741,-1.09947 -1.912058,-3.87323 -2.32875,-6.39403 2.5814,-12.6534 5.563913,-26.9583299 7.288654,-38.7851199 0.41696,-2.85915 0.695509,-6.2308505 0.819589,-9.8603801 1.62613,3.10924 5.394503,9.5154801 7.692553,7.0259301 2.99303,-3.24245 -7.731827,-16.9607201 -7.731827,-16.9607201 C 10.636411,-39.052049 7.23363,-55.361361 0,-55.361361 Z");

        // Draw individuals
        simData.posList.forEach((valRaw, i) => {
            const val = mapValue(valRaw, 0, 1, -0.05, 1.05);
            ctx.save();

            const pos = toCanvasCoords(val, size);
            const theta = simData.thetaList[i];

            // Move shapes to the right position and orientation
            ctx.translate(pos.x, pos.y);
            let s = synchronisation == null ? 0.25 : 0.15;
            if (conclusion) s = 0.15;
            ctx.scale(s, s);
            ctx.rotate(theta + 1.7);

            // Draw the firefly
            ctx.fillStyle = "#062758ff";
            ctx.fill(fish);

            ctx.restore();
        });
    }
}

function SimulationLogic({ canvasRef, aspectRatio, temperature, coupling, drawFish, synchronisation, conclusion, isVisible }: {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    aspectRatio: number;
    temperature: number;
    coupling: number;
    drawFish: boolean;
    synchronisation?: number;
    conclusion?: boolean;
    isVisible: boolean;
}): JSX.Element {
    // Parameters
    const v0 = 0.2; // Speed
    let N = synchronisation == null ? 20 : 13; // Number of individuals on width direction
    if (conclusion) N = 16;
    const [Nx, Ny] = [N, Math.floor(N / aspectRatio)];

    const posListRef = useRef(new Array(N).fill(false).map(() => [0, 0]));
    const velListRef = useRef(new Array(N).fill(false).map(() => 0));
    const thetaListRef = useRef(new Array(N).fill(false).map(() => 0));
    const randAngle = useMemo(() => Math.random() * 2 * Math.PI, []);

    useMemo(() => {
        // Create individuals
        const posList = new Array(Nx * Ny).fill(false).map(() => [Math.random(), Math.random()]); // Random positions
        const velList = new Array(Nx * Ny).fill(false).map(() => v0 * (0.4 + Math.random() * 0.4)); // Initial velocities

        posListRef.current = posList;
        velListRef.current = velList;
    }, [Nx, Ny]);

    useMemo(() => {
        const thetaList = new Array(Nx * Ny).fill(false).map(() => {
            if (synchronisation == null) {
                return Math.random() * 2 * Math.PI; // Random angle
            } else {
                if (Math.random() < synchronisation) {
                    return randAngle; // Aligned angle
                }
                return Math.random() * 2 * Math.PI; // Random angle
            }
        }); // Random orientations

        thetaListRef.current = thetaList;
    }, [Nx, Ny, randAngle, synchronisation]);

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
            [posListRef.current, velListRef.current, thetaListRef.current] = update({
                Nx, Ny, posList: posListRef.current, thetaList: thetaListRef.current, velList: velListRef.current
            }, temperature, coupling, dt, synchronisation);
            draw(ctx, { width, height }, { Nx, Ny, posList: posListRef.current, velList: velListRef.current, thetaList: thetaListRef.current }, drawFish, synchronisation, conclusion);

            // Request next frame
            animationFrameId = window.requestAnimationFrame(tick);
        };
        tick();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [Nx, Ny, canvasRef, conclusion, coupling, drawFish, isVisible, synchronisation, temperature]);

    return <></>;
}

export function FishSchool(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    showSliders: boolean; // Whether to show sliders or not
    synchronisation?: number; // Optional synchronisation value to set the state of the simulation
    conclusion?: boolean; // Whether we are in the conclusion part or not
}): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [temperature, setTemperature] = useState(10);
    const [drawFish, setDrawFish] = useState(true);
    const [coupling, setCoupling] = useState(0.3);
    const canvasRef = createRef<HTMLCanvasElement>();
    const aspectRatio = useMemo(() => 16 / 9, []);

    // If hide sliders and in simulation mode, init parameters to get synchronisation
    useMemo(() => {
        if (!props.showSliders) {
            setTemperature(7);
            setCoupling(1.5);
        }
    }, [props.showSliders]);

    const controls = <>
        <div className="fish-custom-check-g-container">
            <div className="fish-custom-check-container">
                <label htmlFor="show-arrows">Arrows</label>
                <input type="checkbox" checked={!drawFish} onChange={e => setDrawFish(!e.target.checked)} />
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
            max={20}
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
        <SimulationLogic canvasRef={canvasRef} aspectRatio={aspectRatio} temperature={temperature} coupling={coupling / 50.0} drawFish={drawFish} synchronisation={props.synchronisation} conclusion={props.conclusion} isVisible={visible} />
    </>
}
