'use client';

import { JSX } from "react";
import { SimulationInstance, SimContext, RenderContext } from "../src/core/Simulation";
import { SimulationDOM } from "../src/core/SimulationDOM";

// Helpers
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

// Simulation state type
type State = {
    posList: number[][];
    velList: number[][];
    omegaList: number[];
    thetaList: number[];
    tickingList: number[];
}

// Fireflies Simulation
class Simulation extends SimulationInstance<State> {
    private N = 12;
    private v0 = 0.15;

    private interactionRadius = 0.3;
    private tickingTheta = (3 * Math.PI) / 2;
    private tickingDTheta = 0.1;
    private tickingDecayRate = 2.0;
    private thetaNoiseIntensity = 0.1;
    private velocityNoiseIntensity = 0.5;

    constructor() {
        super("Fireflies Simulation");

        this.addControlSlider("k", { value: 0.3, min: 0, max: 2 }, "Interactions");
        this.addControlSlider("nu", { value: 1 }, "Noise");
        this.addControlCheckbox("showArrows", true, "Arrows");
    }

    init(): State {
        const posList = new Array(this.N).fill(0).map(() => [Math.random(), Math.random()]);
        const velList = new Array(this.N).fill(0).map(() => [this.v0 * Math.random(), this.v0 * Math.random()]);
        const omegaList = new Array(this.N).fill(0).map(() => sampleGaussian(3, 0.2));
        const thetaList = new Array(this.N).fill(0).map(() => Math.random() * 2 * Math.PI);
        const tickingList = new Array(this.N).fill(0);

        return { posList, velList, omegaList, thetaList, tickingList };
    }

    update(sim: SimContext): State {
        const state = sim.state as State;
        const dt = sim.dt;
        const coupling = Number(sim.controls['k']);
        const noise = Number(sim.controls['nu']);

        // Neighbor list
        const neighborThetaList: number[][] = new Array(this.N).fill(0).map(() => []);
        state.posList.forEach((p1: number[], i: number) => {
            state.posList.forEach((p2: number[], j: number) => {
                if (i === j) return;

                let dx = Math.abs(p1[0] - p2[0]);
                let dy = Math.abs(p1[1] - p2[1]);
                dx = dx > 0.5 ? 1 - dx : dx;
                dy = dy > 0.5 ? 1 - dy : dy;
                const dist = Math.hypot(dx, dy);
                if (dist < this.interactionRadius)
                    neighborThetaList[i].push(state.thetaList[j]);
            });
        });

        // Angles
        for (let i = 0; i < this.N; i++) {
            const theta = state.thetaList[i];
            const omega = state.omegaList[i];
            const neighbors = neighborThetaList[i];
            if (neighbors.length > 0) {
                const sinSum = neighbors.reduce((sum, thetaJ) => sum + Math.sin(thetaJ - theta), 0) / neighbors.length;
                state.thetaList[i] = theta + omega * dt + coupling * sinSum + Math.sqrt(noise) * this.thetaNoiseIntensity * sampleGaussian(0, 10) * dt;
            }

            // Keep angle within [0, 2π]
            state.thetaList[i] = (state.thetaList[i] + 2 * Math.PI) % (2 * Math.PI);

            // Check for ticking
            if (
                state.thetaList[i] > this.tickingTheta - this.tickingDTheta &&
                state.thetaList[i] < this.tickingTheta + this.tickingDTheta
            ) state.tickingList[i] = 1;

            // Decrease ticking value over time
            if (state.tickingList[i] > 0) {
                state.tickingList[i] -= this.tickingDecayRate * dt;
                if (state.tickingList[i] < 0) state.tickingList[i] = 0;
            }
        }

        // Update positions and velocities based on new angles and add noise
        for (let i = 0; i < this.N; i++) {
            const pos = state.posList[i];
            const vel = state.velList[i];

            // Update position with PBC
            pos[0] = (pos[0] + vel[0] * dt + 1) % 1;
            pos[1] = (pos[1] + vel[1] * dt + 1) % 1;

            // Small random walk for velocity direction (preserve speed)
            const vNorm = Math.hypot(vel[0], vel[1]);
            vel[0] += this.velocityNoiseIntensity * sampleGaussian(0, 3) * dt;
            vel[1] += this.velocityNoiseIntensity * sampleGaussian(0, 3) * dt;
            const n = Math.hypot(vel[0], vel[1]);
            vel[0] = (vel[0] / n) * vNorm;
            vel[1] = (vel[1] / n) * vNorm;
        }
        return state;
    }

    render(sim: SimContext, render: RenderContext): void {
        // Firefly shapes
        const fireflyUpperBody = new Path2D("m 0.39546563,-39.40837 c -9.57057903,0 -14.44356163,12.57643 -14.44356163,17.99942 0,5.42298 2.843754,8.37028 2.843754,13.8467 0,4.63847 -2.013608,6.81601 -2.629813,10.68152 A 44.659756,27.601246 0 0 1 2.9198556,1.10337 44.659756,27.601246 0 0 1 14.398746,2.03097 c -0.77399,-3.22107 -2.40295,-5.41183 -2.40295,-9.59322 0,-5.47642 2.84375,-8.42372 2.84375,-13.8467 0,-5.42299 -4.8735204,-17.99942 -14.44408037,-17.99942 z");
        const fireflyRightWing = new Path2D("m 39.748406,-28.316643 c -11.32277,0.02642 -27.75261,9.453673 -27.75261,20.754393 0,0 38.20213,1.30358 38.20213,-13.491184 0,-5.085698 -4.51856,-7.27705 -10.44952,-7.263209 z M 17.931616,-7.70243 c -3.58518,0.019 -5.93582,0.14018 -5.93582,0.14018 0,17.220131 38.20213,26.967329 38.20213,12.172561 0,-11.096071 -21.51073,-12.369591 -32.26631,-12.312741 z");
        const fireflyLeftWing = new Path2D("m -38.956948,-28.31664 c 11.322765,0.02642 27.752606,9.453673 27.752606,20.75439 0,0 -38.202132,1.303581 -38.202132,-13.491181 0,-5.085698 4.518562,-7.27705 10.449526,-7.263209 z m 21.816786,20.61421 c 3.585183,0.01898 5.93582,0.14018 5.93582,0.14018 0,17.220132 -38.202132,26.967329 -38.202132,12.172563 0,-11.096074 21.510737,-12.369586 32.266312,-12.312743 z");
        const fireflyLowerBody = new Path2D("m 2.9100356,1.10234 a 44.659756,27.601246 0 0 0 -16.7540096,2.0159 c -0.11137,0.69844 -0.17674,1.4515 -0.17674,2.28462 0,5.443609 1.52538,34.031929 14.40687963,34.772549 C 13.267656,39.434789 14.793036,10.846469 14.793036,5.40286 c 0,-1.28289 -0.15595,-2.37701 -0.39429,-3.37189 A 44.659756,27.601246 0 0 0 2.9100356,1.10234 Z");

        const ctx = render.ctx;
        const state = sim.state as State;

        // Background
        ctx.fillStyle = "#070124ff";
        ctx.fillRect(0, 0, render.size.width, render.size.height);

        // Draw individuals as circles with an arrow
        const drawArrows = Boolean(sim.controls['showArrows']);
        for (let i = 0; i < state.posList.length; i++) {
            if (drawArrows) {
                const pos = toCanvasCoords(state.posList[i], render.size);
                const theta = state.thetaList[i];
                const isTicking = state.tickingList[i] > 0;

                const tickingStrokeColor = interpolateArray([216, 216, 216], [255, 49, 49], state.tickingList[i]);
                const tickingStroke = `rgba(${tickingStrokeColor[0]}, ${tickingStrokeColor[1]}, ${tickingStrokeColor[2]}, 1.0)`;
                const tickingFill = `rgba(255, 126, 126, ${state.tickingList[i] * 0.9})`;

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
            } else {
                const val = mapValue(state.posList[i], 0, 1, -0.05, 1.05);
                const pos = toCanvasCoords(val, render.size);
                const vel = state.velList[i];
                const velDir = Math.atan2(vel[1], vel[0]);
                const isTicking = state.tickingList[i] > 0;

                const tickingFill = `rgba(255, 190, 14, ${state.tickingList[i] * 1.0})`;
                const blackColor = 'rgba(10, 10, 10, 1.0)';

                // Move shapes to the right position and orientation
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.scale(0.3, 0.3);
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
                ctx.stroke(fireflyUpperBody);
                ctx.fill(fireflyUpperBody);

                ctx.lineWidth = 2;
                ctx.strokeStyle = blackColor;
                ctx.fillStyle = "#b4b4b425";
                ctx.stroke(fireflyRightWing);
                ctx.stroke(fireflyLeftWing);
                ctx.fill(fireflyRightWing);
                ctx.fill(fireflyLeftWing);

                ctx.fillStyle = isTicking ? tickingFill : 'rgba(77, 77, 77, 0.2)';
                ctx.strokeStyle = blackColor;
                ctx.stroke(fireflyLowerBody);
                ctx.fill(fireflyLowerBody);

                ctx.restore();
            }
        }
    }
}

export function FirefliesSimulation({title, description}: {title?: string | JSX.Element; description?: string | JSX.Element;}) {
    return <SimulationDOM title={title} description={description} simulation={new Simulation()} />;
}
