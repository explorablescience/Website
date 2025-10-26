'use client';

import { JSX } from "react";
import { SimulationInstance, SimContext, RenderContext } from "../src/core/Simulation";
import { SimulationDOM } from "../src/core/SimulationDOM";

// Helpers
function computeEnergy(simData: { Nx: number; Ny: number; spins: boolean[] }, index: number, temperature: number): number {
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
    const magneticField = 1.0 * (temperature < 2 ? 0.05 : 0); // Arbitrary small value
    energy -= magneticField * (spins[index] ? 1 : -1);

    return energy;
}

// Simulation state type
type State = {
    Nx: number;
    Ny: number;
    spins: boolean[];
}

// Fireflies Simulation
class Simulation extends SimulationInstance<State> {
    private N = 100;
    private aspectRatio = 16 / 9;
    private iterationsPerFrame = 3000;

    constructor() {
        super("Ising Simulation");

        this.addControlSlider("T", { value: 2.5, min: 0.1, max: 5, step: 0.1 }, "Temperature");
    }

    init(): State {
        const [Nx, Ny] = [this.N, Math.floor(this.N / this.aspectRatio)];
        const spins = new Array(Nx * Ny).fill(false).map(() => Math.random() < 0.5 ? true : false);

        return { Nx, Ny, spins };
    }

    update(sim: SimContext): State {
        const simData = sim.state as State;
        const temperature = sim.controls["T"] as number;

        const newSpins = [...simData.spins];
        for (let i = 0; i < this.iterationsPerFrame; i++) {
            // Select random spin
            const index = Math.floor(Math.random() * simData.spins.length);

            // Compute old and new energy
            const oldEnergy = 2.0 * computeEnergy({ Nx: simData.Nx, Ny: simData.Ny, spins: newSpins }, index, temperature);
            newSpins[index] = !newSpins[index]; // Flip the spin
            const newEnergy = 2.0 * computeEnergy({ Nx: simData.Nx, Ny: simData.Ny, spins: newSpins }, index, temperature);

            // DeltaE <= 0
            const deltaE = newEnergy - oldEnergy;
            if (deltaE <= 0.0) // Change accepted
                continue;

            // DeltaE >= 0
            const invertProba = Math.random();
            const beta = 1.0 / temperature;
            if (invertProba <= Math.exp(-beta * deltaE)) // P < exp(-beta * deltaE) : Change accepted
                continue;
            newSpins[index] = !newSpins[index]; // Change rejected
        }

        return { ...simData, spins: newSpins };
    }

    render(sim: SimContext, render: RenderContext): void {
        const ctx = render.ctx;
        const { Nx, Ny, spins } = sim.state as State;
        const { width, height } = render.size;

        // Clear canvas
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, width, height);

        // Draw spins
        const epsilon = 1;
        spins.forEach((spin, i) => {
            const x = (i % Nx) * (width / Nx);
            const y = Math.floor(i / Nx) * (height / Ny);
            if (spin) {
                ctx.fillStyle = "#ff3235"; // Spin up
            } else {
                ctx.fillStyle = "#2939e2"; // Spin down
            }
            ctx.fillRect(x, y, width / Nx + epsilon, height / Ny + epsilon);
        });
    }
}

export function IsingSimulation({ title, description }: { title?: string | JSX.Element; description?: string | JSX.Element; }) {
    return <SimulationDOM title={title} description={description} simulation={new Simulation()} />;
}
