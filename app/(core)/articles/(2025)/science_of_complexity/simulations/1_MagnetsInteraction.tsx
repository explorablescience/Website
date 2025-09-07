'use client'

import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { createRef, JSX, useMemo, useState } from "react";
import { Slider } from "../logic/simulations/Sliders";
import { Simulation } from "../logic/simulations/Simulation";
import { Spin } from "./models/Spin";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";

//Two arrows with a blurred sphere around symbolizing the electron that possesses a spin. The color of the arrow is a gradient from red (+) to blue (-) with +- written below each direction. Using a slider, the user can change the orientation of the arrow of one spin. The other arrow will then update its orientation to match the first one.

function SpinsElement(props: { rotation: number, visible: boolean }): JSX.Element {
    const [Nx, Ny] = [11, 5]; // Must be odd
    const s = 2.3; // Spin dist
    const off = 1.0; // Offset to center the spins
    const minOrientationSpeed = 0.8;
    const maxOrientationSpeed = 5;
    const [spins, refPrimary, refs, spinsTargets, spinsOrientationSpeed]: [JSX.Element[], React.RefObject<Object3D | null>, React.RefObject<Object3D | null>[], number[], number[]] = useMemo(() => {
        // Dynamical parameters
        const spins: JSX.Element[] = [];
        const refPrimary = createRef<Object3D | null>();
        const refs: React.RefObject<Object3D | null>[] = [];
        const spinsTargets = new Array(9).fill(props.rotation);
        const spinsOrientationSpeed = [];

        // Create list of secondary spins
        for (let i = 0; i < Nx; i++) {
            for (let j = 0; j < Ny; j++) {
                const ref = createRef<Object3D>();
                spins.push(
                    <Spin
                        ref={ref}
                        key={`secondary-${i}-${j}`}
                        position={[(i - Nx / 2) * s + off, 0, (j - Ny / 2) * s + off]}
                        rotation={[0, props.rotation, 0]} />
                );
                refs.push(ref);
        
                // Pick random orientation speed
                spinsOrientationSpeed.push(Math.random() * (maxOrientationSpeed - minOrientationSpeed) + minOrientationSpeed);
            }
        }
        spins[Math.floor(Nx / 2) * Ny + Math.floor(Ny / 2)] = <Spin
            ref={refPrimary}
            key={`primary`}
            position={[-0.15, 0, 0]}
            rotation={[0, props.rotation, 0]} />;

        return [spins, refPrimary, refs, spinsTargets, spinsOrientationSpeed];
    }, [Nx, Ny, props.rotation]);

    useFrame((_callback, dt) => {
        if (!props.visible) return;

        // Update primary spin
        const primarySpin = refPrimary.current;
        if (primarySpin) {
            primarySpin.rotation.set(0, props.rotation, 0);
        }

        // Update targets
        refs.forEach((ref, i) => {
            const spin = ref.current;
            if (spin) {
                // Update target
                spinsTargets[i] = props.rotation;

                // Update rotation
                const diff = spinsTargets[i] - spin.rotation.y;
                spin.rotation.set(0, spin.rotation.y + diff * spinsOrientationSpeed[i] * dt, 0);
            }
        });
    });

    return <>{spins}</>;
}

export function MagnetsInteraction(props: {
    title?: string; // Optional title for the simulation
    description?: JSX.Element; // Optional description of the simulation
}): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [rotation, setRotation] = useState(0.5);

    // Create spins
    const spins = <SpinsElement rotation={rotation} visible={visible} />;

    const simulation = <>
        {/** Camera setup */}
        <group name="camera">
            <PerspectiveCamera makeDefault position={[0.0, 13.5, 0.0]} fov={40} />
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
            {spins}
        </group>
    </>;

    const controls = <>
        <Slider
            label={"Rotation"}
            value={rotation}
            onChange={setRotation}
            min={0}
            max={Math.PI * 2}
            step={0.01}
            color="#746cc0ff"
            displayValue={false} />
    </>;

    return <Simulation
        aspectRatio={"21/9"}
        title={props.title}
        description={props.description}
        simulation={simulation}
        controls={controls}
        onChangeVisibleState={setVisible} />
}