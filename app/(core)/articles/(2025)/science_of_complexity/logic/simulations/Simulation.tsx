'use client'

import { createRef, JSX, useState } from "react";
import { SimulationCanvas } from "./SimulationCanvas";
import { SimulationControls } from "./Sliders";
import styles from "./Simulation.module.css";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useIsVisible } from "../utils";
import errorStyles from './SimulationError.module.css';
import { onReactError } from "@/app/api/client/logger";

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

export function Simulation(props: {
    aspectRatio?: string; // Optional aspect ratio for the simulation canvas
    canvasRef?: React.RefObject<HTMLCanvasElement | null>; // Optional ref for the canvas
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
    simulation?: JSX.Element;
    controls: JSX.Element;
    onChangeVisibleState?: (visible: boolean) => void; // Optional callback to change visibility state
    is2D?: boolean;
}) {
    const simulationRef = createRef<HTMLDivElement>();
    const [visible, setVisible] = useState(false);
    useIsVisible(simulationRef, (isVisible) => {
        props.onChangeVisibleState?.(isVisible);
        setVisible(isVisible);
    });

    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
            <div className={styles['simulation-container']} ref={simulationRef}>
                {props.description && <div className={styles['simulation-description']}>
                    <div className={styles['simulation-description-title']}>{props.title}</div>
                    <div className={styles['simulation-description-content']}>{props.description}</div>
                </div>}
                <SimulationCanvas aspectRatio={props.aspectRatio} canvasRef={props.canvasRef} is2D={props.is2D} visible={visible}>
                    {props.simulation}
                </SimulationCanvas>
                <SimulationControls>
                    {props.controls}
                </SimulationControls>
            </div>
        </ErrorBoundary>
    </>
}
