'use client'

import Simulation from "../structure/Simulation";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Tree } from "../models/Tree";
import { Apple } from "../models/Apple";
import { Arrow3d } from "../models/Arrow3d";
import { lerpc, smooth, smoothc } from "./SimulationHelpers";
import Text3d from "../models/Text3d";
import * as THREE from 'three'
import { JSX, useMemo } from "react";
import { randFloat } from "three/src/math/MathUtils.js";

export function ASim1Part1(props: { t: number, visible: boolean, isDesktop: boolean }) {
    return (
        <Simulation>
            <PerspectiveCamera makeDefault position={[0.05, 2.39, 5.18]} fov={60} />
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight intensity={1} position={[1.82, 5.03, 2.68]} rotation={[0.7, 0.4, -0.4]} scale={100} castShadow />

            <>
                <Tree position={[0, 0, 0]} scale={0.5} />
                <mesh name="Floor" rotation-x={-Math.PI / 2} receiveShadow>
                    <circleGeometry args={[2]} />
                    <meshStandardMaterial />
                </mesh>

                <group name="Apple" position={[-0.64, smoothc(2.32, 1.2, props.t, 0.2, 1), 0.72]}>
                    <Apple rotation={[-0.48, -0.40, -0.24]} scale={0.1} />
                    <Text3d
                        text="F"
                        position={[smoothc(-0.08, 0.05, props.t, 0.6, 0.75), smoothc(-0.04, -0.28, props.t, 0.6, 0.75), -0.02]} />
                </group>
                
                <Arrow3d
                    position={[-0.67, smoothc(2.25, 1.05, props.t, 0.2, 1), 0.71]}
                    rotation={[Math.PI, 0, 0]}
                    scale={[1.0, lerpc(0.0, 1.0, props.t, 0.6, 0.7), 1.0]} />
            </>
        </Simulation>
    )
}


function Proton(props: JSX.IntrinsicElements['group']) {
    return (
        <group {...props} >
            <mesh>
                <sphereGeometry args={[0.97, 10, 10]} />
                <meshStandardMaterial color="red" metalness={0.2} roughness={0.5} />
            </mesh>
        </group>
    )
}

function electricField(r1: THREE.Vector3, r2: THREE.Vector3) {
    const strength = 10.0;
    const r = r1.distanceTo(r2);
    const rhat = r1.clone().sub(r2).normalize();
    const E = rhat.multiplyScalar(strength / (4 * Math.PI * r * r));
    return E;
}

function LinesField(props: {
    p1pos: THREE.Vector3,
    p2pos: THREE.Vector3,
    t: number,
    visible: boolean,
    isDesktop: boolean
}) {
    // Constants
    const PARTICLES_COUNT = 9000;
    const START_RANGE = 8;

    const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
        return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }
    
    // Set initial parameters
    const { positions, velocities, colors } = useMemo(() => {
        const positions = new Float32Array(PARTICLES_COUNT * 3*2);
        const velocities = new Float32Array(PARTICLES_COUNT * 3);
        const colors = new Float32Array(PARTICLES_COUNT * 3*2);
        for (let i = 0; i < PARTICLES_COUNT; i++) {
            const x = randFloat(-START_RANGE, START_RANGE);
            const y = randFloat(-START_RANGE, START_RANGE);
            const z = randFloat(-START_RANGE, START_RANGE);

            positions[i * 6 + 0] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z;
            positions[i * 6 + 3] = positions[i * 6 + 0];
            positions[i * 6 + 4] = positions[i * 6 + 1];
            positions[i * 6 + 5] = positions[i * 6 + 2];

            velocities[i * 3 + 0] = 0;
            velocities[i * 3 + 1] = 0;
            velocities[i * 3 + 2] = 0;

            colors[i * 6 + 0] = 0xf8;
            colors[i * 6 + 1] = 0xf8;
            colors[i * 6 + 2] = 0xf8;
            colors[i * 6 + 3] = 0xf8;
            colors[i * 6 + 4] = 0xf8;
            colors[i * 6 + 5] = 0xf8;
        }
        return { positions, velocities, colors };
    }, []);

    // Update positions and colors every frame
    const fieldShow = 0.4;
    const fieldShowLength = 0.1;
    const update = () => {
        // If not visible, do not update
        if (!props.visible && props.isDesktop || props.t < fieldShow - fieldShowLength)
            return;
        
        for (let i = 0; i < PARTICLES_COUNT; i++) {
            // For t < fieldShow, do not show field
            if (props.t < fieldShow) {
                positions[i * 6 + 3] = positions[i * 6 + 0];
                positions[i * 6 + 4] = positions[i * 6 + 1];
                positions[i * 6 + 5] = positions[i * 6 + 2];
                continue;
            }

            // Calculate electric field
            const x = positions[i * 6 + 0];
            const y = positions[i * 6 + 1];
            const z = positions[i * 6 + 2];

            const r = new THREE.Vector3(x, y, z);
            const E = electricField(props.p1pos, r);
            const E2 = electricField(props.p2pos, r);

            const Etotal = E.add(E2);

            // If too close to proton, E too strong, reset position
            if (r.distanceTo(props.p1pos) < 0.5 || r.distanceTo(props.p2pos) < 0.5 || Etotal.length() > 0.3) {
                positions[i * 6 + 0] = randFloat(-START_RANGE, START_RANGE);
                positions[i * 6 + 1] = randFloat(-START_RANGE, START_RANGE);
                positions[i * 6 + 2] = randFloat(-START_RANGE, START_RANGE);
                positions[i * 6 + 3] = positions[i * 6 + 0];
                positions[i * 6 + 4] = positions[i * 6 + 1];
                positions[i * 6 + 5] = positions[i * 6 + 2];

                velocities[i * 3 + 0] = 0;
                velocities[i * 3 + 1] = 0;
                velocities[i * 3 + 2] = 0;
            }
            else {
                const dv = 0.1;
                const vmag = 20;
                const mv = 1;

                // Update positions
                positions[i * 6 + 0] += Etotal.x;
                positions[i * 6 + 1] += Etotal.y;
                positions[i * 6 + 2] += Etotal.z;
                positions[i * 6 + 3] = positions[i * 6 + 0] + velocities[i * 3 + 0] * dv;
                positions[i * 6 + 4] = positions[i * 6 + 1] + velocities[i * 3 + 1] * dv;
                positions[i * 6 + 5] = positions[i * 6 + 2] + velocities[i * 3 + 2] * dv;

                // Update velocities
                velocities[i * 3 + 0] = Etotal.x * vmag;
                velocities[i * 3 + 1] = Etotal.y * vmag;
                velocities[i * 3 + 2] = Etotal.z * vmag;

                // Limit velocities
                if (velocities[i * 3 + 0] > mv) velocities[i * 3 + 0] = mv;
                if (velocities[i * 3 + 1] > mv) velocities[i * 3 + 1] = mv;
                if (velocities[i * 3 + 2] > mv) velocities[i * 3 + 2] = mv;
                if (velocities[i * 3 + 0] < -mv) velocities[i * 3 + 0] = -mv;
                if (velocities[i * 3 + 1] < -mv) velocities[i * 3 + 1] = -mv;
                if (velocities[i * 3 + 2] < -mv) velocities[i * 3 + 2] = -mv;

                // Update colors
                const color1 = new THREE.Color(0xff0000);
                const color2 = new THREE.Color(0x0000ff);
                const vMag = velocities[i * 3 + 0] * velocities[i * 3 + 0]
                    + velocities[i * 3 + 1] * velocities[i * 3 + 1]
                    + velocities[i * 3 + 2] * velocities[i * 3 + 2];
                let vMagNorm = map(Math.log(Math.pow(Math.sqrt(vMag), 0.5) / mv), -0.1, 0.1, 0, 1);
                if (vMagNorm < 0) vMagNorm = 0;
                if (vMagNorm > 1.7) vMagNorm = 1;
                colors[i * 6 + 0] = color1.r * vMagNorm + color2.r * (1 - vMagNorm);
                colors[i * 6 + 1] = color1.g * vMagNorm + color2.g * (1 - vMagNorm);
                colors[i * 6 + 2] = color1.b * vMagNorm + color2.b * (1 - vMagNorm);
                colors[i * 6 + 3] = color1.r * vMagNorm + color2.r * (1 - vMagNorm);
                colors[i * 6 + 4] = color1.g * vMagNorm + color2.g * (1 - vMagNorm);
                colors[i * 6 + 5] = color1.b * vMagNorm + color2.b * (1 - vMagNorm);
            }

            // If t > fieldShow but t < fieldShow + fieldShowLength, blend colors
            if (props.t >= fieldShow && props.t < fieldShow + fieldShowLength) {
                const blend = map(props.t, fieldShow, fieldShow + fieldShowLength, 0, 1);
                colors[i * 6 + 0] = colors[i * 6 + 0] * blend + 1 * (1 - blend);
                colors[i * 6 + 1] = colors[i * 6 + 1] * blend + 1 * (1 - blend);
                colors[i * 6 + 2] = colors[i * 6 + 2] * blend + 1 * (1 - blend);
                colors[i * 6 + 3] = colors[i * 6 + 3] * blend + 1 * (1 - blend);
                colors[i * 6 + 4] = colors[i * 6 + 4] * blend + 1 * (1 - blend);
                colors[i * 6 + 5] = colors[i * 6 + 5] * blend + 1 * (1 - blend);
            }
        }

        geom.attributes.position.needsUpdate = true;
        geom.attributes.color.needsUpdate = true;
    }

    const { geom, material } = useMemo(() => {
        // Create buffer geometry
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.LineBasicMaterial({ vertexColors: true });

        return { geom, material };
    }, [colors, positions]);

    // Create points
    return (
        <group dispose={null}>
            <lineSegments onBeforeRender={update}>
                <bufferGeometry attach="geometry" {...geom} />
                <pointsMaterial attach="material" {...material} />
            </lineSegments>
        </group>
    );
}

export function ASim1Part2(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const p1pos = new THREE.Vector3(smooth(-1.8, -3.3, props.t), 1.1, 0);
    const p2pos = new THREE.Vector3(smooth(1.8, 3.3, props.t), 1.1, 0);

    return (
        <Simulation>
            <PerspectiveCamera makeDefault position={[-2.79, 9.02, 11.75]} fov={60} />
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight intensity={1} position={[1.82, 5.03, 2.68]} rotation={[0.7, 0.4, -0.4]} scale={100} castShadow />

            <>
                <Proton position={p1pos} scale={0.5} rotation={[1.12, 0.88, 2.76]} />
                <Arrow3d
                    position={[smooth(-2.3, -3.9, props.t), 1.15, 0]}
                    rotation={[0, 0, Math.PI/2]}
                    scale={[2, 1.5, 2]} />


                <Proton position={p2pos} scale={0.5} rotation={[0.65, 1.12, 0.41]} />
                <Arrow3d
                    position={[smooth(2.3, 3.9, props.t), 1.15, 0]}
                    rotation={[0, 0, -Math.PI / 2]}
                    scale={[2, 1.5, 2]} />


                <LinesField p1pos={p1pos} p2pos={p2pos} t={props.t} visible={props.visible} isDesktop={props.isDesktop} />
            </>
        </Simulation>
    );
}
