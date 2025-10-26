import { ControlType } from "../controls/Control";

export type SimulationState = Record<string, unknown>
type ControlValuesState = Record<string, number | boolean>;

export type SimContext = {
    t: number;
    dt: number;
    controls: ControlValuesState;
    state: SimulationState;
}

export type RenderContext = {
    size: { width: number; height: number };
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

type RecordControlType = { type: string } & ControlType;
export abstract class SimulationInstance<S extends SimulationState> {
    readonly controlsType: RecordControlType[];
    readonly controlValues: ControlValuesState = {};
    readonly id: string;

    constructor(id: string) {
        this.id = id.replace(/\s+/g, '-').toLowerCase();
        this.controlsType = [];
    }

    abstract init(): S;
    abstract update(sim: SimContext): S;
    abstract render(sim: SimContext, render: RenderContext): void;

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


