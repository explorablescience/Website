import { CheckboxParams } from "./Checkbox";
import { SliderParams } from "./Slider";

export type ControlTypeParams<T> = {
    id: string;
    label: string;
    onChange: (newValue: T) => void;
    value: T;
}

export type ControlType = CheckboxParams | SliderParams;
