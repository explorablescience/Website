import { JSX, useState } from "react";
import { Slider } from "@/app/(core)/articles/(2025)/science_of_complexity/logic/simulations/Sliders";
import { ControlTypeParams } from "./Control";

export type SliderParams = ControlTypeParams<number> & {
    min: number;
    max: number;
    step: number;
}

export function SSlider({ control }: { control: SliderParams }): JSX.Element {
    const { label, min, max, step } = control;
    const [value, setValue] = useState(control.value);

    return <>
        <Slider
            label={label}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(value) => {
                setValue(value);
                control.onChange(value);
            }}
        />
    </>;
}
