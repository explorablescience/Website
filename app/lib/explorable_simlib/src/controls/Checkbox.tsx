import { ControlTypeParams } from "./Control";
import styles from './Checkbox.module.css';
import { JSX, useState } from "react";

export type CheckboxParams = ControlTypeParams<boolean>;

export function Checkbox({ control }: { control: CheckboxParams }): JSX.Element {
    const { id, label } = control;
    const [ value, setValue ] = useState(control.value);
    
    return <>
        <div className={styles['check-g-container']}>
            <div className={styles['check-container']}>
                <label htmlFor={id}>{label}</label>
                <input id={id} type="checkbox" checked={!value} onChange={e => {
                    setValue(!e.target.checked);
                    control.onChange(!e.target.checked);
                }} />
            </div>
        </div>
    </>;
}
