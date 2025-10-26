import { ControlType } from "../controls/Control";
import { Drawer2d } from "../draw/Drawer2d";

// Define types for simulation state and control values
export type SimulationState = Record<string, unknown>
type ControlValuesState = Record<string, number | boolean>;
type RecordControlType = { type: string } & ControlType;

// Selected RenderContext type from draw module
export type RenderContext = Drawer2d;

/**
 * Context provided to the simulation during update and render phases.
 * @property t - Current time in seconds.
 * @property dt - Time delta since last update in seconds.
 * @property controls - Hash map of current control values. Keys are control IDs, values are their current values.
 * @property state - Current state of the simulation. Defined by the user by extending SimulationInstance.
 */
export type SimContext = {
    t: number;
    dt: number;
    controls: ControlValuesState;
    state: SimulationState;
}

/**
 * Abstract base class for creating 2D simulations.
 * Users should extend this class and implement the init, update, and render methods.
 * @typeParam S - Type of the simulation state, defined by the user. This type will be stored and passed to update and render methods.
 */
export abstract class SimulationInstance<S extends SimulationState> {
    readonly controlsType: RecordControlType[];
    readonly controlValues: ControlValuesState = {};
    readonly id: string;

    constructor(id: string) {
        this.id = id.replace(/\s+/g, '-').toLowerCase();
        this.controlsType = [];
    }

    /**
     * Create the initial state of the simulation.
     * @returns The initial simulation state.
     */
    abstract init(): S;
    /**
     * Update the simulation state based on the provided context.
     * @param sim - The simulation context containing time, controls, and current state.
     * @returns The updated simulation state.
     */
    abstract update(sim: SimContext): S;
    /**
     * Render the simulation onto the canvas based on the provided context.
     * @param sim - The simulation context containing time, controls, and current state.
     * @param render - The render context containing canvas size, canvas element, and rendering context.
     */
    abstract render(sim: SimContext, render: RenderContext): void;


    /**
     * Add a slider control to the simulation.
     * @param id Unique identifier for the control.
     * @param data Slider parameters including initial value, min, max, and step.
     * @param label Optional label for the control.
     */
    addControlSlider(id: string, data: { value: number, min?: number; max?: number; step?: number }, label?: string): void {
        this.controlsType.push({
            type: 'slider',
            id,
            label: label || id,
            value: data.value,
            min: data.min || 0,
            max: data.max || 1,
            step: data.step || 0.01,
            onChange: (newValue: number) => { this.controlValues[id] = newValue; }
        });
        this.controlValues[id] = data.value;
    }

    /**
     * Add a checkbox control to the simulation.
     * @param id Unique identifier for the control.
     * @param value Initial boolean value for the checkbox.
     * @param label Optional label for the control.
     */
    addControlCheckbox(id: string, value: boolean, label?: string): void {
        this.controlsType.push({
            type: 'checkbox',
            id,
            label: label || id,
            value,
            onChange: (newValue: boolean) => { this.controlValues[id] = newValue; }
        });
        this.controlValues[id] = value;
    }
}


