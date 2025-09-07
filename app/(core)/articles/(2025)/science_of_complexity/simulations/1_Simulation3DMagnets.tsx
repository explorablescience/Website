'use client'

import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Magnet3D } from "./models/Magnet";
import { JSX, useEffect, useRef, useState } from "react";
import { useInterval } from "../logic/utils";
import { Slider } from "../logic/simulations/Sliders";
import { Simulation } from "../logic/simulations/Simulation";

export function Simulation3DMagnets(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
}): JSX.Element {
    const [dist, setDist] = useState(0.1); // Distance between the two magnets, from 0 to 1
    const [visible, setVisible] = useState(true); // Whether the simulation is visible
    const [isDragging, setIsDragging] = useState(false); // Whether the slider is being dragged
    const [magnetOrientation1, setMagnetOrientation1] = useState(1); // 0 if north, 1 if south
    const [magnetOrientation2, setMagnetOrientation2] = useState(0); // 0 if north, 1 if south

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveringMagnet, setHoveringMagnet] = useState(false); // Track when a magnet is being hovered
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = hoveringMagnet ? 'pointer' : 'unset';
        }
    }, [hoveringMagnet])

    useInterval(() => {
        if (!visible)
            return;

        // If user is dragging the slider, do not update the simulation
        if (isDragging)
            return;

        setDist(prevDist => {
            const dir = magnetOrientation1 === magnetOrientation2 ? 1 : -1; // If 1 attracts, -1 repels
            const newDist = prevDist - 0.01 * dir / Math.pow(prevDist + 0.5, 2) * 1.3;

            // Ensure the distance stays within bounds
            return Math.max(0, Math.min(1, newDist));
        });
    }, 20);

    const simulation = <>
        {/** Camera setup */}
        <group name="camera">
            <PerspectiveCamera makeDefault position={[7.0, 3.8, 2.5]} fov={55} />
            <OrbitControls />
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
                position={[0, 0, -12]}
                onClick={() => setMagnetOrientation1(magnetOrientation1 === 0 ? 1 : 0)}
                onPointerOver={() => setHoveringMagnet(true)}
                onPointerOut={() => setHoveringMagnet(false)}
                orientation={magnetOrientation1} />
            <Magnet3D
                position={[0, 0, 4 - 11 * (1 - dist)]}
                onClick={() => setMagnetOrientation2(magnetOrientation2 === 0 ? 1 : 0)}
                onPointerOver={() => setHoveringMagnet(true)}
                onPointerOut={() => setHoveringMagnet(false)}
                orientation={magnetOrientation2} />
        </group>
    </>;

    const controls = <>
        <Slider
            label={"Separation"}
            value={dist}
            onChange={setDist}
            onFocusStart={() => setIsDragging(true)}
            onFocusEnd={() => setIsDragging(false)}
            min={0}
            max={1}
            step={0.01}
            color="#746cc0ff"
            displayValue={false} />
    </>;

    return <Simulation
        aspectRatio={"21/9"}
        canvasRef={canvasRef}
        title={props.title}
        description={props.description}
        simulation={simulation}
        controls={controls}
        onChangeVisibleState={setVisible} />
}