'use client';

import { JSX } from "react";
import { SimulationInstance, SimContext, RenderContext } from "../src/simulation/Simulation";
import { SimulationDOM } from "../src/simulation/SimulationDOM";

// Define the state type for the simulation
// This will hold the position of the object at each time step
type State = {
    pos: number[];
}

// Here, we create a simple simulation where an object moves horizontally across the canvas
class Simulation extends SimulationInstance<State> {
    constructor() {
        super("Sample Simulation");

        // Add a slider control to adjust the speed of the object
        this.addControlSlider("v", { value: 1.0, min: 0, max: 2, step: 0.1 }, "Speed");
    }

    init(): State {
        // Initial position at the center of the canvas
        return { pos: [0.5, 0.5] };
    }

    update(sim: SimContext): State {
        const { pos } = sim.state as State;
        const v = sim.controls["v"] as number;

        // Update position based on velocity (Euler integration)
        return {
            pos: [
                (pos[0] + v * sim.dt) % 1,
                pos[1]
            ]
        };
    }

    render(sim: SimContext, render: RenderContext): void {
        // Get the current position from the state
        const { pos } = sim.state as State;

        // Clear canvas with black background (default)
        render.clear();

        // Draw an ellipse at the current position
        render
            .circle()
            .translate(pos[0], pos[1])
            .draw();
    }
}

// The main component to render the simulation. To use it, simply include <SampleSimulation /> in your React app.
export function SampleSimulation({ title, description }: { title?: string | JSX.Element; description?: string | JSX.Element; }) {
    // Render the simulation using SimulationDOM
    return <SimulationDOM title={title} description={description} simulation={new Simulation()} />;
}
