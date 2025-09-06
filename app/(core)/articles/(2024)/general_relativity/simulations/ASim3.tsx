'use client'

import { JSX, useEffect, useMemo, useState } from "react";
import Simulation from "../structure/Simulation";
import { Box, OrbitControls, PerspectiveCamera, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from 'three'
import Text3d from "../models/Text3d";
import { Apple } from "../models/Apple";
import { smooth, smoothc } from "./SimulationHelpers";
import { Arrow3d } from "../models/Arrow3d";

function pointAt(x: number, y: number, vx: number, vy: number, def: number) {
    const theta = 0.04 * Math.PI / 2;
    const deformation = Math.min(1, Math.max(0, def));
    const christoffelStart = [ // Gamma^i_jk, ordered as [i][j][k]
        [[0, 0], [0, 0]],
        [[0, 0], [0, 0]]
    ];
    let christoffelEnd = [ // Gamma^i_jk, ordered as [i][j][k]
        [[0, 0], [0, -Math.sin(theta) * Math.cos(theta)]],
        [[0.03, Math.atan(theta)], [Math.atan(theta), 0]]
    ];
    if (def == 2) {
        const theta2 = 0.10 * Math.PI / 2;
        christoffelEnd = [ // Gamma^i_jk, ordered as [i][j][k]
            [[-0.1, 0], [0, -Math.sin(theta2) * Math.cos(theta2) - 0.03]],
            [[0.03, Math.atan(theta2)], [Math.atan(theta2), 0.15]]
        ];
    }
    const christoffel = [
        [
            [smooth(christoffelStart[0][0][0], christoffelEnd[0][0][0], deformation), smooth(christoffelStart[0][0][1], christoffelEnd[0][0][1], deformation)],
            [smooth(christoffelStart[0][1][0], christoffelEnd[0][1][0], deformation), smooth(christoffelStart[0][1][1], christoffelEnd[0][1][1], deformation)]
        ],
        [
            [smooth(christoffelStart[1][0][0], christoffelEnd[1][0][0], deformation), smooth(christoffelStart[1][0][1], christoffelEnd[1][0][1], deformation)],
            [smooth(christoffelStart[1][1][0], christoffelEnd[1][1][0], deformation), smooth(christoffelStart[1][1][1], christoffelEnd[1][1][1], deformation)]
        ]
    ];

    const dtau = 0.02;
    vx += dtau * christoffel[0][0][0] * vx * vx + dtau * christoffel[0][0][1] * vx * vy
        + dtau * christoffel[0][1][0] * vy * vx + dtau * christoffel[0][1][1] * vy * vy;
    vy += dtau * christoffel[1][0][0] * vx * vx + dtau * christoffel[1][0][1] * vx * vy
        + dtau * christoffel[1][1][0] * vy * vx + dtau * christoffel[1][1][1] * vy * vy;

    x += dtau * vx;
    y += dtau * vy;

    // Test out of bounds
    const m = 5;
    if (x < -m || x > m || y < -m || y > m) {
        return { x: 1000, y: 0, vx: vx, vy: vy };
    }
    return { x, y, vx, vy };
}

function setPoints(deformation: number, showLine: boolean) {
    // Sizes
    const GRID_EXTENT = 5;  // Extent of the grid (from -GRID_EXTENT to GRID_EXTENT)
    const GRID_SUBDIVISIONS = deformation == 2 ? 4 : 11;  // Number of subdivisions of the grid (on each axis)
    const COLOR = { R: 0.1, G: 0.1, B: 0.1 };
    const POINTS_COUNT = 500; // Number of points on each axis

    // Iterating distances
    const extent = 2 * GRID_EXTENT / GRID_SUBDIVISIONS;

    // Inner grid
    const l = GRID_SUBDIVISIONS * POINTS_COUNT * 3 * 2;
    const positionsGrid = new Float32Array(l); // Positions of the points
    const colorsGrid = new Float32Array(l); // Colors of the points
    
    

    // Grid
    for (let it = 0; it < GRID_SUBDIVISIONS*2; it++) {
        const i = it % GRID_SUBDIVISIONS;
        let curX = it < GRID_SUBDIVISIONS ? -GRID_EXTENT + extent * i : -GRID_EXTENT;
        let curY = it < GRID_SUBDIVISIONS ? -GRID_EXTENT : -GRID_EXTENT + extent * i;
        let vx = it < GRID_SUBDIVISIONS ? 0 : 1;
        let vy = it < GRID_SUBDIVISIONS ? 1 : 0;

        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Set points
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsGrid[ind + 0] = curX < (deformation == 2 ? 2 : 3) ? curX : 1000; 
            positionsGrid[ind + 1] = 0;
            positionsGrid[ind + 2] = curY < (deformation == 2 ? 2 : 3.7) ? curY : 1000;

            // Set colors
            colorsGrid[ind + 0] = COLOR.R;
            colorsGrid[ind + 1] = COLOR.G;
            colorsGrid[ind + 2] = COLOR.B;

            // Update
            const res = pointAt(curX, curY, vx, vy, deformation);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }

    // Axis
    const positionsAxis = new Float32Array(POINTS_COUNT * 2 * 3 + POINTS_COUNT * 3); // Positions of the points
    const colorsAxis = new Float32Array(POINTS_COUNT * 2 * 3 + POINTS_COUNT * 3); // Colors of the points
    for (let it = 0; it < 2; it++) {
        let curX = it == 0 ? -GRID_EXTENT + extent * 1 : -GRID_EXTENT;
        let curY = it == 0 ? -GRID_EXTENT : -GRID_EXTENT + extent * 2;
        let vx = it == 0 ? 0 : 1;
        let vy = it == 0 ? 1 : 0;
        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Position
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsAxis[ind + 0] = curX < (deformation == 2 ? 2 : 3) ? curX : 1000;
            positionsAxis[ind + 1] = 0.01;
            positionsAxis[ind + 2] = curY < (deformation == 2 ? 2 : 3.7) ? curY : 1000;

            // Color
            colorsAxis[ind + 0] = it == 1 ? 47 / 255 / 1.4 : 181 / 255 / 1.6;
            colorsAxis[ind + 1] = it == 1 ? 171 / 255 / 1.4 : 31 / 255 / 1.6;
            colorsAxis[ind + 2] = it == 1 ? 34 / 255 / 1.4 : 181 / 255 / 1.6;

            // Update
            const res = pointAt(curX, curY, vx, vy, deformation);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }

    // Trajectory
    if (showLine) {
        let curX = 1.31;
        let curY = -5;
        let vx = 0;
        let vy = 1;
        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Position
            const ind = (POINTS_COUNT * 2 + tau) * 3;
            const x = curX + (-curY + 6) ** 2 * 0.03 - 3.7;
            const y = curY;
            positionsAxis[ind + 0] = x < (deformation == 2 ? 2 : 3) ? x : 1000;
            positionsAxis[ind + 1] = 0.02;
            positionsAxis[ind + 2] = y < (deformation == 2 ? 2 : 3.7) ? y : 1000;

            // Color
            colorsAxis[ind + 0] = 0.1;
            colorsAxis[ind + 1] = 0.1;
            colorsAxis[ind + 2] = 0.1;

            // Update
            const res = pointAt(curX, curY, vx, vy, deformation);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }
    else {
        for (let i = 0; i < POINTS_COUNT; i++) {
            positionsAxis[POINTS_COUNT * 2 * 3 + i * 3 + 0] = 1000;
            positionsAxis[POINTS_COUNT * 2 * 3 + i * 3 + 1] = 1000;
            positionsAxis[POINTS_COUNT * 2 * 3 + i * 3 + 2] = 1000;
        }
    }

    return { positionsGrid, colorsGrid, positionsAxis, colorsAxis };
}

function Grid2D(props: { deformation: number, showLine: boolean }) {
    const [ deformation, setDeformation ] = useState(props.deformation);

    // Set initial parameters
    const { positionsGrid, colorsGrid, positionsAxis, colorsAxis } = useMemo(() => {
        return setPoints(props.deformation, props.showLine);
    }, [props.deformation, props.showLine]);

    // Deform grid
    useEffect(() => {
        if (deformation == props.deformation) return;
        setDeformation(props.deformation);

        // Deform grid
        const points = setPoints(props.deformation, props.showLine);

        // Update buffer geometry
        geomGrid.setAttribute('position', new THREE.BufferAttribute(points.positionsGrid, 3));
        geomGrid.attributes.position.needsUpdate = true;
        geomAxis.setAttribute('position', new THREE.BufferAttribute(points.positionsAxis, 3));
        geomAxis.attributes.position.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deformation, props.deformation, props.showLine]);


    const { geomGrid, materialGrid, geomAxis, materialAxis } = useMemo(() => {
        // Create buffer geometry
        const geomGrid = new THREE.BufferGeometry();
        geomGrid.setAttribute('position', new THREE.BufferAttribute(positionsGrid, 3));
        geomGrid.setAttribute('color', new THREE.BufferAttribute(colorsGrid, 3));

        const geomAxis = new THREE.BufferGeometry();
        geomAxis.setAttribute('position', new THREE.BufferAttribute(positionsAxis, 3));
        geomAxis.setAttribute('color', new THREE.BufferAttribute(colorsAxis, 3));

        // Create material
        const materialGrid = new THREE.PointsMaterial({ vertexColors: true, size: 0.01 });
        const materialAxis = new THREE.PointsMaterial({ vertexColors: true, size: deformation == 2 ? 0.08 : 0.15 });

        return { geomGrid, materialGrid, geomAxis, materialAxis };
    }, [colorsAxis, colorsGrid, deformation, positionsAxis, positionsGrid]);

    // Create segments
    return (
        <group dispose={null}>
            <points>
                <bufferGeometry attach="geometry" {...geomGrid} />
                <pointsMaterial attach="material" {...materialGrid} />
            </points>

            <points>
                <bufferGeometry attach="geometry" {...geomAxis} />
                <pointsMaterial attach="material" {...materialAxis} />
            </points>
        </group>
    );
}

function getApplePos(t: number, appleTraj: THREE.Curve<THREE.Vector3>) {
    const p1 = appleTraj.getPoint(t * 0.8);
    const p2 = new THREE.LineCurve3(
        new THREE.Vector3(appleTraj.getPoint(0.4).x, 0, appleTraj.getPoint(0.4).z - 0.5),
        new THREE.Vector3(-5.1, 0, 4.25)
    ).getPointAt((t - 0.5) / 0.6);

    if (t < 0.6) {
        return p1;
    }
    else if (t < 0.7) {
        return new THREE.Vector3(
            p1.x + (p2.x - p1.x) * (t - 0.6) / 0.1,
            0,
            p1.z + (p2.z - p1.z) * (t - 0.6) / 0.1,
        )
    }
    else {
        return p2;
    }
}


export function ASim3Part1(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t : 0.8;

    const deformation = smoothc(0, 1, t, 0.5, 0.8);

    const { appleTraj } = useMemo(() => {
        const appleTraj = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(1.31, 0, -5),
            new THREE.Vector3(-1.91, 0, -0.66),
            new THREE.Vector3(-2.24, 0, 5),
        );
        return { appleTraj };
    }, []);

    return <Simulation>
        <PerspectiveCamera makeDefault position={[1.26, 11, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <group name="Diagram">
            <Text3d
                position={[-3.47, 0, -3.43]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Time" color={"green"} />
            <Text3d
                position={[smoothc(-2.69, -2.83, t, 0.5, 0.8), 0, smoothc(-1.78, -1.85, t, 0.55, 0.75)]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Space" color={"purple"} />

            <Grid2D deformation={deformation} showLine={true} />
        </group>

        <group name="Apple">
            <group position={getApplePos(t, appleTraj)}>
                <Apple rotation={[0, -0.13, 1.47]} scale={0.2} />

                <group position={[0.15, 0.1, 0]}>
                    <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                    <Text3d position={[0.5 + 0.02, 0, 0.14 - 0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                        (t * 10 - 0.1).toFixed(1)
                    } color={"#eee"} />
                    <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                        <meshStandardMaterial color={"#333"} />
                    </Box>
                </group>
            </group>
        </group>
    </Simulation>
}

export function ASim3Part2(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t*0.5 + 0.1 : 0.4;
    
    const { appleTraj, velRotation, velRotationSpace, velRotationTime } = useMemo(() => {
        const appleTraj = new THREE.LineCurve3(
            new THREE.Vector3(1.21, 0, -5),
            new THREE.Vector3(-5.0, 0, 4.37),
        )

        const vr = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        const velRotation = vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), smooth(0.56, 0.67, t)));
        const velRotationSpace = vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), smooth(0.1, 0.6, t)));
        const velRotationTime = vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 1.69));

        return { appleTraj, velRotation, velRotationSpace, velRotationTime };
    }, [t]);

    return <Simulation>
        <PerspectiveCamera makeDefault position={[1.26, 11, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <group name="Diagram">
            <Text3d
                position={[-3.47, 0, -3.43]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Time" color={"green"} />
            <Text3d
                position={[-2.83, 0, -1.85]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Space" color={"purple"} />

            <Grid2D deformation={1} showLine={true} />
        </group>

        <group name="Apple">
            <group position={appleTraj.getPointAt(t)}>
                <Apple rotation={[0, -0.13, 1.47]} scale={0.2} />

                <Text3d position={[-0.6, 0, 0.65]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.8} text={"c"} color={"#ff5252"} font="fira" />
                <group name={"main"} rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(velRotation)}>
                    <Arrow3d position={[0, 0.75, 0]} scale={[2, 3, 2]} arrowScale={1.5} color={"#ff5252"} />
                </group>

                <group name={"time_proj"} position={[smoothc(0.23, -0.05, t, 0.1, 0.6), -0.05, smoothc(1.61, 1.53, t, 0.1, 0.6)]}>
                    <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(velRotationTime)}>
                        <Arrow3d position={[0, 0.75, 0]} scale={[1.5, smoothc(1.44, 0.76, t, 0.1, 0.6), 1.5]} arrowScale={1.1} color={"#2fab22"} />
                    </group>
                </group>

                <group name={"space_proj"} rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(velRotationSpace)}>
                    <Arrow3d position={[0, 0.75, 0]} scale={[1.5, 2.5, 1.5]} arrowScale={1.1} color={"#b51fb5"} />
                </group>

                <group position={[0.15, 0.1, 0]}>
                    <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                    <Text3d position={[0.5 + 0.02, 0, 0.14 - 0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                        (t * 10 - 0.1).toFixed(1)
                    } color={"#eee"} />
                    <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                        <meshStandardMaterial color={"#333"} />
                    </Box>
                </group>
            </group>
        </group>
    </Simulation>
}

function linear3c(a1: number, a2: number, a3: number, t: number, t1: number, t3: number) {
    // First, linearly interpolate between a1 and a2 and a2 and a3
    if (t < t1) return a1;
    if (t > t3) return a3;
    const t2 = (t1 + t3) / 2;
    const a12 = a1 * (t2 - t) / (t2 - t1) + a2 * (t - t1) / (t2 - t1);
    const a23 = a2 * (t3 - t) / (t3 - t2) + a3 * (t - t2) / (t3 - t2);

    // Then, linearly interpolate between a12 and a23
    const a13 = a12 * (t3 - t) / (t3 - t1) + a23 * (t - t1) / (t3 - t1);

    return a13;
}

type GammaS = { symb1: "t" | "y", symb2: "t" | "y", symb3: "t" | "y" } & JSX.IntrinsicElements['group'];
function GammaSymbol(props: GammaS) { 
    return <group {...props}>
        <Text3d position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2.5} text={"Γ"} color={"#333"} font="fira" />
        <Text3d position={[-0.23, 0, -0.3]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={props.symb1} color={props.symb1 == "t" ? "green" : "purple"} font="fira" />
        <Text3d position={[0.11, 0, -0.38]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={props.symb2} color={props.symb2 == "t" ? "green" : "purple"} font="fira" />
        <Text3d position={[0.12, 0, -0.53]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={props.symb3} color={props.symb3 == "t" ? "green" : "purple"} font="fira" />
    </group>
}

export function ASim3Part3(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t : 1;

    const tInitStartCh = 0.25;
    const tInitEndCh = 0.48;
    const tInitSizeCh0 = 0.54;
    const tInitSizeCh1 = 0.59;
    const tInitVecFinStart = 0.5;
    const tInitVecFinEnd = 0.56;
    const tInitDashStart = 0.2;
    const tInitDashEnd = 0.3;

    const tStartCh = 0.7;
    const tEndCh = 0.82;
    const tVecFinStart = 0.75;
    const tVecFinEnd = 0.83;
    const tSizeCh0 = 0.76;
    const tSizeCh1 = 0.84;
    const tDashStart = 0.7;
    const tDashEnd = 0.81;

    const vr = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    return <Simulation>
        <PerspectiveCamera makeDefault position={[2, 9, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <group name="Diagram" position={[1, -0.05, 1.5]}>
            <Text3d
                position={[-4.04, 0, 1.19]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Time" color={"green"} />
            <Text3d
                position={[-4.53, 0, -0.5]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Space" color={"purple"} />

            <Grid2D deformation={2} showLine={false} />
        </group>


        {/* MOVING ALONG SPACE AXIS */}
        <>
            <group name={"Time Moving Along Space"} position={[linear3c(0.29, 1.12, 1.91, t, tInitStartCh, tInitEndCh), 0, linear3c(2.04, 1.41, 0.64, t, tInitStartCh, tInitEndCh)]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(
                    vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), linear3c(1.91, 2.16, 2.31, t, tInitStartCh, tInitEndCh)))
                )}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(20, 180, 20)"} />
                </group>
            </group>
            <GammaSymbol symb1="t" symb2="t" symb3="y" position={[1.11, 0, 0.47]} scale={0.7 * smoothc(0, 1, t, tInitSizeCh0, tInitSizeCh1)} />
            <GammaSymbol symb1="y" symb2="t" symb3="y" position={[1.54, 0, 0]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />
            <group name={"Space Moving Along Space"} position={[linear3c(0.29, 1.12, 1.91, t, tStartCh, tEndCh), 0, linear3c(2.04, 1.41, 0.64, t, tStartCh, tEndCh)]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(
                    vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), linear3c(4.15, 3.97, 3.8, t, tStartCh, tEndCh)))
                )}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(190, 20, 190)"} />
                </group>
            </group>
            <GammaSymbol symb1="y" symb2="y" symb3="y" position={[-2.65 + 5.45, 0, 1.07 + -1]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />
            <GammaSymbol symb1="t" symb2="y" symb3="y" position={[-3.08 + 5.45, 0, 0.93 + -1]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />

            <QuadraticBezierLine
                start={[0.27, 0, 2.03]}
                mid={[1.22, 0, 1.45]}
                end={[1.94, 0, 0.63]}
                color={"purple"}
                gapSize={0.6 * smoothc(30, 1, t, tInitDashStart, tInitDashEnd)}
                lineWidth={5}
                dashScale={8}
                dashed />
            <Text3d position={[1.65, 0, 1.57]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.4 * smoothc(0, 1, t, tInitDashStart, tInitDashEnd)} text={"dy"} color={"purple"} font="fira" />
       </>

        {/* MOVING ALONG TIME AXIS */}
        <>
            <group name={"Time Moving Along Time"} position={[linear3c(0.29, -0.6, -1.63, t, tStartCh, tEndCh), 0, linear3c(2.04, 1.77, 1.61, t, tStartCh, tEndCh)]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(
                    vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), linear3c(1.91, 1.73, 1.63, t, tStartCh, tEndCh)))
                )}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(20, 180, 20)"} />
                </group>
            </group>
            <GammaSymbol symb1="t" symb2="t" symb3="t" position={[-2.43, 0, 1.45]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />
            <GammaSymbol symb1="y" symb2="t" symb3="t" position={[-1.93, 0, 1.23]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />
            <group name={"Space Moving Along Time"} position={[linear3c(0.29, -0.6, -1.63, t, tStartCh, tEndCh), 0, linear3c(2.04, 1.77, 1.61, t, tStartCh, tEndCh)]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(
                    vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), linear3c(4.15, 4.07, 3.99, t, tStartCh, tEndCh)))
                )}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(190, 20, 190)"} />
                </group>
            </group>
            <GammaSymbol symb1="y" symb2="y" symb3="t" position={[-0.65, 0, 1.07]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />
            <GammaSymbol symb1="t" symb2="y" symb3="t" position={[-1.08, 0, 0.93]} scale={0.7 * smoothc(0, 1, t, tSizeCh0, tSizeCh1)} />

            <QuadraticBezierLine
                start={[0.27, 0, 2.03]}
                mid={[0, 0, 1.87]}
                end={[-1.6, 0, 1.6]}
                color={"green"}
                gapSize={0.6 * smoothc(30, 1, t, tDashStart, tDashEnd)}
                lineWidth={5}
                dashScale={8}
                dashed />
            <Text3d position={[-0.94, 0, 2.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5 * smoothc(0, 1, t, tDashStart, tDashEnd)} text={"dt"} color={"green"} font="fira" />
        </>



        {/* INITIAL AXIS MOVED */}
        <>
            {/* AT INITIAL POSITION */}
            <group name={"Initial Time Axis"} position={[0.29, 0, 2.04]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 1.91)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(20, 180, 20)"} />
                </group>
            </group>
            <group position={[-0.19, 0, 2.25]}>
                <Text3d rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.4} text={"e"} color={"#333"} font="fira" />
                <Text3d position={[0.08, 0, -0.13]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.1} text={"t"} color={"green"} font="fira" />
            </group>
            <group name={"Initial Space Axis"} position={[0.29, 0, 2.04]}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 4.15)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={1.1} color={"rgb(190, 20, 190)"} />
                </group>
            </group>
            <group position={[0.84, 0, 2.1]}>
                <Text3d rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.4} text={"e"} color={"#333"} font="fira" />
                <Text3d position={[0.08, 0, -0.13]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.1} text={"y"} color={"purple"} font="fira" />
            </group>
        </>
        <group position={[-1.92, 0, -0.43]}>
            {/* AT FINAL TIME POSITION */}
            <group name={"Initial Time Axis"} position={[0.29, 0, 2.04]} scale={0.9 * smoothc(0, 1, t, tVecFinStart, tVecFinEnd)}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 1.91)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={0.9} color={"green"} />
                </group>
            </group>
            <group name={"Initial Space Axis"} position={[0.29, 0, 2.04]} scale={0.9 * smoothc(0, 1, t, tVecFinStart, tVecFinEnd)}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 4.15)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={0.9} color={"purple"} />
                </group>
            </group>
        </group>
        <group position={[1.62, 0, -1.39]}>
            {/* AT FINAL SPATIAL POSITION */}
            <group name={"Initial Time Axis"} position={[0.29, 0, 2.04]} scale={0.9 * smoothc(0, 1, t, tInitVecFinStart, tInitVecFinEnd)}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 1.91)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={0.9} color={"green"} />
                </group>
            </group>
            <group name={"Initial Space Axis"} position={[0.29, 0, 2.04]} scale={0.9 * smoothc(0, 1, t, tVecFinStart, tVecFinEnd)}>
                <group rotation={new THREE.Euler(0, 0, 0).setFromQuaternion(vr.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 4.15)))}>
                    <Arrow3d position={[0, 0.3, 0]} scale={[1.5, 1.5, 1.5]} arrowScale={0.9} color={"purple"} />
                </group>
            </group>
        </group>
    </Simulation>
}
