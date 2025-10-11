'use client'

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Magnet3D } from "./models/Magnet";
import { SimulationControls, Slider } from "../logic/simulations/Sliders";
import { JSX, useRef, useState } from "react";
import { SimulationCanvas } from "../logic/simulations/SimulationCanvas";
import styles from "./1_ZommingOnMagnet.module.css";
import { SpinsLattice } from "./models/SpinsLattice";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import logError from "../logic/api_manager";
import { useIsVisible } from "../logic/utils";

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={styles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}
function ErrorDOMSmall() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={styles['error-simulation custom-simulation-error']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

export function ZoomingOnMagnet(props: { title: string, description: JSX.Element, zoomDataLevel: [number, JSX.Element, number][]}) {
    const [zoom, setZoom] = useState(0);
    const [zoomDescriptionLevel, setZoomDescriptionLevel] = useState(0);
    const [cameraHeight, setCameraHeight] = useState(props.zoomDataLevel[0][2]);

    function updateZoom(value: number) {
        setZoom(value);
        const level = props.zoomDataLevel.findIndex(([threshold]) => value < Number(threshold));
        setZoomDescriptionLevel(level === -1 ? props.zoomDataLevel.length - 1 : level);
        const t = (value - props.zoomDataLevel[level - 1][0]) / (props.zoomDataLevel[level][0] - props.zoomDataLevel[level - 1][0]);
        const zoom = t * (props.zoomDataLevel[level][2] - props.zoomDataLevel[level - 1][2]) + props.zoomDataLevel[level - 1][2];
        setCameraHeight(zoom);
    }

    const simulation = <>
        {/** Camera setup */}
        <group name="camera">
            <PerspectiveCamera
                makeDefault
                position={[0.0, cameraHeight, 0.0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fov={55} near={0.001} />
        </group>

        {/** Lights */}
        <group name="lights">
            <Environment
                files="/articles/science_of_complexity/imgs/environmental_map.hdr"
                background
                backgroundBlurriness={0.6} />
        </group>

        {/** Simulation */}
        <group name="simulation" >
            <Magnet3D
                position={[0.1, 0, 0.3]}
                rotation={[0, Math.PI * (-0.8), 0]}
                orientation={0} />
            <SpinsLattice
                position={[0, 0.32, 0.004]}
                rotation={[0, Math.PI / 2, 0]}
                scale={0.02} />
        </group>
    </>;

    const controls = <>
        <Slider
            label={"Zoom"}
            value={zoom}
            onChange={updateZoom}
            min={0}
            max={1}
            step={0.01}
            color="#555555ff"
            displayValue={false} />
    </>;

    // This is a special simulation, reimplement Simulation "manually"
    const simulationRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useIsVisible(simulationRef, (isVisible) => {
        setVisible(isVisible);
    });
    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <div className={styles['simulation-container']} ref={simulationRef}>
                {props.description && <div className={styles['simulation-description']}>
                    <div className={styles['simulation-description-title']}>{props.title}</div>
                    <div className={styles['simulation-description-content']}>{props.description}</div>
                </div>}
                <div className={styles['simulation-info-container']}>
                    <SimulationCanvas aspectRatio={"11/9"} show3DIcon={false} customErrorComponent={ErrorDOMSmall} visible={visible}>
                        {simulation}
                    </SimulationCanvas>
                    <div className={styles['simulation-info-text']}>
                        <div><p>{props.zoomDataLevel[zoomDescriptionLevel][1]}</p></div>
                    </div>
                </div>
                <SimulationControls>
                    {controls}
                </SimulationControls>
            </div>
        </ErrorBoundary>
    </>
}