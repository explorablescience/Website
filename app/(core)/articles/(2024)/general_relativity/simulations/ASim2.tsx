'use client'

import { JSX, useMemo } from "react";
import Simulation from "../structure/Simulation";
import { Box, Line, OrbitControls, PerspectiveCamera, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from 'three'
import { Arrow3d } from "../models/Arrow3d";
import Text3d from "../models/Text3d";
import { Tree, TreeLeaves } from "../models/Tree";
import { Apple } from "../models/Apple";
import { smoothc } from "./SimulationHelpers";

function Grid2D() {
    // Constants
    const GRID_EXTENT = 5;  // Extent of the grid (from -GRID_EXTENT to GRID_EXTENT)
    const GRID_SUBDIVISIONS = 15;  // Number of subdivisions of the grid (on each axis)
    const COLOR = { R: 0.1, G: 0.1, B: 0.1 };

    // Set initial parameters
    const { positions, colors } = useMemo(() => {
        const POINTS_COUNT = GRID_SUBDIVISIONS + 1; // Number of points on each axis
        const positions = new Float32Array(2 * POINTS_COUNT * POINTS_COUNT * 3*2); // Positions of the points
        const colors = new Float32Array(2 * POINTS_COUNT * POINTS_COUNT * 3*2); // Colors of the points
        
        for (let i = 0; i < POINTS_COUNT; i++) {
            for (let j = 0; j < POINTS_COUNT; j++) {
                const ind_g = (j * POINTS_COUNT + i) * 6;

                // Create horizontal lines
                {
                    const ind = ind_g;
                    
                    // Set positions
                    positions[ind + 0] = -GRID_EXTENT + (2 * GRID_EXTENT / POINTS_COUNT) * j;
                    positions[ind + 1] = 0;
                    positions[ind + 2] = -GRID_EXTENT + (2 * GRID_EXTENT / POINTS_COUNT) * i + 2 * GRID_EXTENT / POINTS_COUNT * 0.5;
                    positions[ind + 3] = positions[ind + 0] + 2 * GRID_EXTENT / POINTS_COUNT;
                    positions[ind + 4] = 0;
                    positions[ind + 5] = positions[ind + 2];

                    // Set colors
                    colors[ind + 0] = COLOR.R;
                    colors[ind + 1] = COLOR.G;
                    colors[ind + 2] = COLOR.B;
                    colors[ind + 3] = COLOR.R;
                    colors[ind + 4] = COLOR.G;
                    colors[ind + 5] = COLOR.B;

                    // Border
                    if (j === POINTS_COUNT - 1) {
                        positions[ind + 3] = positions[ind + 0];
                    }
                }

                // Create vertical lines
                {
                    const ind = ind_g + 6 * POINTS_COUNT * POINTS_COUNT;

                    // Set positions
                    positions[ind + 0] = -GRID_EXTENT + (2 * GRID_EXTENT / POINTS_COUNT) * j;
                    positions[ind + 1] = 0;
                    positions[ind + 2] = -GRID_EXTENT + (2 * GRID_EXTENT / POINTS_COUNT) * i + 2 * GRID_EXTENT / POINTS_COUNT * 0.5;
                    positions[ind + 3] = positions[ind + 0];
                    positions[ind + 4] = 0;
                    positions[ind + 5] = positions[ind + 2] + 2 * GRID_EXTENT / POINTS_COUNT;

                    // Set colors
                    colors[ind + 0] = COLOR.R;
                    colors[ind + 1] = COLOR.G;
                    colors[ind + 2] = COLOR.B;
                    colors[ind + 3] = COLOR.R;
                    colors[ind + 4] = COLOR.G;
                    colors[ind + 5] = COLOR.B;

                    // Border
                    if (i === POINTS_COUNT - 1) {
                        positions[ind + 5] = positions[ind + 2];
                    }
                }
            }
        }

        return { positions, colors };
    }, [COLOR.B, COLOR.G, COLOR.R]);


    const { geom, material } = useMemo(() => {
        // Create buffer geometry
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.LineBasicMaterial({ vertexColors: true });

        return { geom, material };
    }, [colors, positions]);

    // Create segments
    return (
        <group dispose={null}>
            <lineSegments>
                <bufferGeometry attach="geometry" {...geom} />
                <pointsMaterial attach="material" {...material} />
            </lineSegments>
        </group>
    );
}

function TrajectoryPlane(props: { t: number, traj1: THREE.Curve<THREE.Vector3>, traj2: THREE.Curve<THREE.Vector3>, color: string, invertNormals?: boolean }) {
    const LINES_COUNT = 100; // Subdivision of the trajectory along an axis
    const vertices = useMemo(() => {
        const v = new Float32Array(LINES_COUNT * 18);
        for (let i = 0; i < LINES_COUNT; i++) {
            const ind = i * 18;
            const off = 0.02;

            const tstart = i / LINES_COUNT;
            const tend = (i + 1) / LINES_COUNT;

            const p1start = props.traj1.getPoint(tstart);
            const p1end = props.traj1.getPoint(tend);
            const p2start = props.traj2.getPoint(tstart);
            const p2end = props.traj2.getPoint(tend);

            // First triangle
            v[ind + 0] = p1start.x;
            v[ind + 1] = p1start.y - off;
            v[ind + 2] = p1start.z;
            v[ind + 3] = p2start.x;
            v[ind + 4] = p2start.y - off;
            v[ind + 5] = p2start.z;
            v[ind + 6] = p1end.x;
            v[ind + 7] = p1end.y - off;
            v[ind + 8] = p1end.z;

            // Second triangle
            v[ind + 9] = p1end.x;
            v[ind + 10] = p1end.y - off;
            v[ind + 11] = p1end.z;
            v[ind + 12] = p2start.x;
            v[ind + 13] = p2start.y - off;
            v[ind + 14] = p2start.z;
            v[ind + 15] = p2end.x;
            v[ind + 16] = p2end.y - off;
            v[ind + 17] = p2end.z;

            // Invert normals
            if (props.invertNormals) {
                // First triangle
                v[ind + 3] = p1end.x;
                v[ind + 4] = p1end.y - off;
                v[ind + 5] = p1end.z;
                v[ind + 6] = p2start.x;
                v[ind + 7] = p2start.y - off;
                v[ind + 8] = p2start.z;

                // Second triangle
                v[ind + 12] = p2end.x;
                v[ind + 13] = p2end.y - off;
                v[ind + 14] = p2end.z;
                v[ind + 15] = p2start.x;
                v[ind + 16] = p2start.y - off;
                v[ind + 17] = p2start.z;
            }
        }

        return v;
    }, [props.invertNormals, props.traj1, props.traj2]);

    const { geom } = useMemo(() => {
        // Create buffer geometry
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        return { geom };
    }, [vertices]);

    return <mesh>
        <bufferGeometry attach="geometry" { ...geom } />
        <meshBasicMaterial attach="material" color={props.color} />
    </mesh>
}

function TrajectoryTicks(props: { t: number, traj1: THREE.Curve<THREE.Vector3>, traj2: THREE.Curve<THREE.Vector3>, color: string, offset: number, scale: number, special?: boolean }) {
    const LINES_COUNT = 11; // Subdivision of the trajectory along an axis

    // Create ticks
    const vertices = useMemo(() => {
        const v = new Float32Array(LINES_COUNT * 3 * 4);
        for (let i = 0; i < LINES_COUNT; i++) {
            const ind = i * 3*4;
            const off = 0.0;

            const tstart = i / LINES_COUNT;
            const p1start = props.traj1.getPoint(tstart);
            const p2start = props.traj2.getPoint(tstart);

            v[ind + 0] = p1start.x;
            v[ind + 1] = p1start.y - off;
            v[ind + 2] = p1start.z;
            v[ind + 3] = p2start.x;
            v[ind + 4] = p2start.y - off;
            v[ind + 5] = p2start.z;
        }

        return v;
    }, [props.traj1, props.traj2]);
    const { geom } = useMemo(() => {
        // Create buffer geometry
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        return { geom };
    }, [vertices]);

    // Create texts
    const texts = useMemo(() => {
        const texts = new Array<JSX.Element>();
        for (let i = 1; i < LINES_COUNT; i++) {
            const tstart = i / LINES_COUNT;
            const p1 = props.traj1.getPoint(tstart);
            const p2 = props.traj2.getPoint(tstart);

            const u = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize();
            const ds = new THREE.Vector3(0, 0, 0);
            const pos = new THREE.Vector3(p1.x + 0.1 + (u.x - ds.x) * props.offset, p1.y, p1.z + (u.z - ds.z) * props.offset);

            const numText = (props.special && i > 6) ? `${i - 1}/${i - 1 - 5 + 9}` : (props.special ? `  ${i - 1}` : `${i - 1}`);
            
            texts[i] = <group>
                <Text3d
                    key={"t1_" + i}
                    position={pos}
                    rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                    scale={1.3}
                    text={(props.special && i <= 6) ? `  τ=` : `τ=`}
                    color={props.color}
                    font="fira" />
                <Text3d
                    key={"t2_" + i}
                    position={[pos.x+0.02, pos.y, pos.z - 0.25]}
                    rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                    scale={1.3}
                    text={numText}
                    color={props.color} />
            </group>
        }

        return texts;
    }, [props.color, props.offset, props.special, props.traj1, props.traj2]);

    return <group dispose={null} scale={props.scale}>
        <lineSegments>
            <bufferGeometry attach="geometry" { ...geom } />
            <lineBasicMaterial attach="material" color={props.color} />
        </lineSegments>

        {...texts}
    </group>
}

export function ASim2Part1(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? (props.t + 0.1) / (0.9) : 0.8;

    const { trajPlane1Apple, trajPlane2Apple, trajPlane1Tree, trajPlane2Tree, trajPlane1Ground, trajPlane2Ground } = useMemo(() => {
        const trajPlane1Apple = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0, -2.23),
            new THREE.Vector3(-0.11, 0, 1.0),
            new THREE.Vector3(-1.7 + 1.07, 0, 4.71 - 1.88),
        );
        const trajPlane2Apple = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0, -3.23),
            new THREE.Vector3(-0.1, 0, -0.64),
            new THREE.Vector3(-2.59 + 1.07, 0, 4.71 - 1.88),
        );

        const off = 0.45;
        const trajPlane1Tree = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83 - off),
            new THREE.Vector3(-4.99, 0, -2.83 - off),
        );
        const trajPlane2Tree = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83 + off),
            new THREE.Vector3(-4.99, 0, -2.83 + off),
        );

        const offG = 0.45;
        const trajPlane1Ground = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83 - offG),
            new THREE.Vector3(-4.99, 0, 2.83 - offG),
        );
        const trajPlane2Ground = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83 + offG),
            new THREE.Vector3(-4.99, 0, 2.83 + offG),
        );

        return { trajPlane1Apple, trajPlane2Apple, trajPlane1Tree, trajPlane2Tree, trajPlane1Ground, trajPlane2Ground };
    }, []);

    const { appleTraj, appleTraj2, treeTraj, groundTraj } = useMemo(() => {
        const appleTraj = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0.05, -2.76),
            new THREE.Vector3(-0.27, 0.05, 0.37),
            new THREE.Vector3(-1.08, 0.05, 2.83),
        );
        const appleTraj2 = new THREE.LineCurve3(
            new THREE.Vector3(4.37 - 0.4, 0, 2.83),
            new THREE.Vector3(-2.37 - 0.4, 0, 2.83),
        );
        const treeTraj = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83),
            new THREE.Vector3(-2.37, 0, -2.83),
        );
        const groundTraj = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83),
            new THREE.Vector3(-2.37, 0, 2.83),
        );
        return { appleTraj, appleTraj2, treeTraj, groundTraj };
    }, []);

    return (
        <Simulation>
            <PerspectiveCamera makeDefault position={[1.26, 12.95, 0]} fov={60} />
            <OrbitControls />

            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <>
                <group name="Diagram">
                    <group name="Vertical axis">
                        <Arrow3d position={[-0.48, 0, 4.68]} rotation={[0, 0, Math.PI / 2]} length={21.5} arrowOffset={152} arrowScale={2} color={"green"} />
                        <Text3d position={[-5.21, 0, 4.45]} rotation={[-Math.PI/2, 0, Math.PI/2]} scale={2} text="Time" color={"green"} />
                    </group>
                    
                    <group name="Horizontal axis">
                        <Arrow3d position={[4.38, 0, -0.16]} rotation={[-Math.PI / 2, 0, 0]} length={21.5} arrowOffset={152} arrowScale={2} color={"purple"} />
                        <Text3d position={[4.86, 0, -3.64]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Space" color={"purple"} />
                    </group>

                    <Grid2D />
                </group>

                <group name="Tree">
                    <group position={treeTraj.getPoint(t)}>
                        <Tree position={[0, 0, 5.62]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.57, 0.87, 0.57]} />
                        
                        <group position={[1.1, 0, 0]} scale={
                            t <= 0.68 ? 0 : smoothc(0, 1, t, 0.65, 0.74)
                        }>
                            <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                            <Text3d position={[0.5+0.02, 0, 0.14-0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                                (t * 8 - 1.1).toFixed(1)
                            } color={"#eee"} />
                            <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                                <meshStandardMaterial color={"#333"} />
                            </Box>
                        </group>
                    </group>

                    <TrajectoryPlane t={t} traj1={trajPlane1Tree} traj2={trajPlane2Tree} color={"#aaaabb"} invertNormals />
                    <QuadraticBezierLine
                        start={[treeTraj.getPoint(0).x, treeTraj.getPoint(0).y - 0.015, treeTraj.getPoint(0).z]}
                        end={[-4.99, treeTraj.getPoint(1).y - 0.015, treeTraj.getPoint(1).z]} />
                    {t > 0.68 &&
                        <TrajectoryTicks t={t} traj1={trajPlane1Tree} traj2={trajPlane2Tree} color={"#333"} offset={-0.17} scale={
                            t <= 0.68 ? 0 : smoothc(0, 1, t, 0.68, 0.71)
                        } />}

                    <Text3d position={[4.76, 0, -2.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"LEAVES"} color={"#333"} font="fira" />
                </group>

                <group name="Ground">
                    <TrajectoryPlane t={t} traj1={trajPlane1Ground} traj2={trajPlane2Ground} color={"#aaaabb"} invertNormals />
                    <QuadraticBezierLine
                        start={[groundTraj.getPoint(0).x, groundTraj.getPoint(0).y - 0.015, groundTraj.getPoint(0).z]}
                        end={[-4.99, groundTraj.getPoint(1).y - 0.015, groundTraj.getPoint(1).z]} />
                    {t > 0.68 &&
                        <TrajectoryTicks t={t} traj1={trajPlane1Ground} traj2={trajPlane2Ground} color={"#333"} offset={1.7} scale={
                            t <= 0.68 ? 0 : smoothc(0, 1, t, 0.68, 0.71)
                        } special={true} />}

                    <Text3d position={[4.76, 0, 3.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"GROUND"} color={"#333"} font="fira" />
                </group>

                <group name="Apple">
                    <group position={t < 0.78 ? appleTraj.getPoint((t - 0.1) / 0.7) : appleTraj2.getPoint(t)}>
                        <Apple position={[0, 0.3, 0]} rotation={[-1.37, -2.12, 0]} scale={0.2} />

                        <group position={[-1.1, 0, 0]} scale={
                            t <= 0.68 ? 0 : smoothc(0, 1, t, 0.65, 0.74)
                        }>
                            <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                            <Text3d position={[0.5 + 0.02, 0, 0.14 - 0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                                (t * 8 - 0.1 + 3.6).toFixed(1)
                            } color={"#eee"} />
                            <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                                <meshStandardMaterial color={"#333"} />
                            </Box>
                        </group>
                    </group>

                    <TrajectoryPlane t={t} traj1={trajPlane1Apple} traj2={trajPlane2Apple} color={"#aaaabb"} />
                    <QuadraticBezierLine
                        start={[appleTraj.getPoint(0).x, appleTraj.getPoint(0).y - 0.035, appleTraj.getPoint(0).z]}
                        end={[appleTraj.getPoint(1).x, appleTraj.getPoint(1).y - 0.035, appleTraj.getPoint(1).z]}
                        mid={[-0.27, -0.035, 0.37]}
                        color={"#333"} />
                    {t > 0.65 &&
                        <TrajectoryTicks t={t} traj1={trajPlane1Apple} traj2={trajPlane2Apple} color={"#333"} offset={-0.5} scale={
                            t <= 0.65 ? 0 : smoothc(0, 1, t, 0.65, 0.69)
                        } />}
                </group>
            </>
        </Simulation>
    );
}


export function ASim2Part2(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t : 0.8;

    const { trajPlane1Apple, trajPlane2Apple, trajPlane1Tree, trajPlane2Tree, trajPlane1Ground, trajPlane2Ground } = useMemo(() => {
        const trajPlane1Apple = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0, -2.23),
            new THREE.Vector3(-0.11, 0, 1.0),
            new THREE.Vector3(-1.7 + 1.07, 0, 4.71 - 1.88),
        );
        const trajPlane2Apple = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0, -3.23),
            new THREE.Vector3(-0.1, 0, -0.64),
            new THREE.Vector3(-2.59 + 1.07, 0, 4.71 - 1.88),
        );

        const off = 0.45;
        const trajPlane1Tree = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83 - off),
            new THREE.Vector3(-4.99, 0, -2.83 - off),
        );
        const trajPlane2Tree = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83 + off),
            new THREE.Vector3(-4.99, 0, -2.83 + off),
        );

        const offG = 0.45;
        const trajPlane1Ground = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83 - offG),
            new THREE.Vector3(-4.99, 0, 2.83 - offG),
        );
        const trajPlane2Ground = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83 + offG),
            new THREE.Vector3(-4.99, 0, 2.83 + offG),
        );

        return { trajPlane1Apple, trajPlane2Apple, trajPlane1Tree, trajPlane2Tree, trajPlane1Ground, trajPlane2Ground };
    }, []);

    const { appleTraj, treeTraj, groundTraj } = useMemo(() => {
        const appleTraj = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(4.37, 0.05, -2.76),
            new THREE.Vector3(-0.27, 0.05, 0.37),
            new THREE.Vector3(-1.08, 0.05, 2.83),
        );
        const treeTraj = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, -2.83),
            new THREE.Vector3(-2.37, 0, -2.83),
        );
        const groundTraj = new THREE.LineCurve3(
            new THREE.Vector3(4.37, 0, 2.83),
            new THREE.Vector3(-2.37, 0, 2.83),
        );
        return { appleTraj, treeTraj, groundTraj };
    }, []);

    return (
        <Simulation>
            <PerspectiveCamera makeDefault position={[1.26, 12.95, 0]} fov={60} />
            <OrbitControls />

            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <>
                <group name="Diagram">
                    <group name="Vertical axis">
                        <Arrow3d position={[-0.48, 0, 4.68]} rotation={[0, 0, Math.PI / 2]} length={21.5} arrowOffset={152} arrowScale={2} color={"green"} />
                        <Text3d position={[-5.21, 0, 4.45]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Time (µ = 0)" color={"green"} />
                    </group>

                    <group name="Horizontal axis">
                        <Arrow3d position={[4.38, 0, -0.16]} rotation={[-Math.PI / 2, 0, 0]} length={21.5} arrowOffset={152} arrowScale={2} color={"purple"} />
                        <Text3d position={[4.86, 0, -3.64]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="Space" color={"purple"} />
                        <Text3d position={[5.3, 0, -3.64]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text="(µ = 2)" color={"purple"} />
                    </group>

                    <Grid2D />
                </group>

                <group name="Tree">
                    <group position={treeTraj.getPoint(t * 0.8)}>
                        <TreeLeaves position={[1.6, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={0.35} />

                        <>
                            <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                            <Text3d position={[0.5 + 0.02, 0, 0.14 - 0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                                (t * 8 - 1.1).toFixed(1)
                            } color={"#eee"} />
                            <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                                <meshStandardMaterial color={"#333"} />
                            </Box>
                        </>
                    </group>

                    <TrajectoryPlane t={t * 0.8} traj1={trajPlane1Tree} traj2={trajPlane2Tree} color={"#aaaabb"} invertNormals />
                    <QuadraticBezierLine
                        start={[treeTraj.getPoint(0).x, treeTraj.getPoint(0).y - 0.015, treeTraj.getPoint(0).z]}
                        end={[-4.99, treeTraj.getPoint(1).y - 0.015, treeTraj.getPoint(1).z]} />

                    <Text3d position={[4.76, 0, -2.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"LEAVES"} color={"#333"} font="fira" />
                </group>

                <group name="Ground">
                    <TrajectoryPlane t={t} traj1={trajPlane1Ground} traj2={trajPlane2Ground} color={"#aaaabb"} invertNormals />
                    <QuadraticBezierLine
                        start={[groundTraj.getPoint(0).x, groundTraj.getPoint(0).y - 0.015, groundTraj.getPoint(0).z]}
                        end={[-4.99, groundTraj.getPoint(1).y - 0.015, groundTraj.getPoint(1).z]} />

                    <Text3d position={[4.76, 0, 3.4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"GROUND"} color={"#333"} font="fira" />
                </group>

                <group name="Apple">
                    <group position={appleTraj.getPoint(t * 0.8)}>
                        <Apple rotation={[0, -0.13, 1.47]} scale={0.2} />

                        <group position={[0.15, 0, 0]}>
                            <Text3d position={[0.5, 0, 0.2 + 0.14]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={"τ="} color={"#eee"} font="fira" />
                            <Text3d position={[0.5 + 0.02, 0, 0.14 - 0.1]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.5} text={
                                (t * 10 - 0.1).toFixed(1)
                            } color={"#eee"} />
                            <Box position={[0.45, -0.01, 0]} args={[0.5, 0.01, 0.9]}>
                                <meshStandardMaterial color={"#333"} />
                            </Box>
                        </group>
                    </group>

                    <TrajectoryPlane t={t * 0.8} traj1={trajPlane1Apple} traj2={trajPlane2Apple} color={"#aaaabb"} />
                    <QuadraticBezierLine
                        start={[appleTraj.getPoint(0).x, appleTraj.getPoint(0).y - 0.035, appleTraj.getPoint(0).z]}
                        end={[appleTraj.getPoint(1).x, appleTraj.getPoint(1).y - 0.035, appleTraj.getPoint(1).z]}
                        mid={[-0.27, -0.035, 0.37]}
                        color={"#333"} />

                    <>
                        <Line
                            points={[
                                [appleTraj.getPoint(t * 0.8).x, 0, appleTraj.getPoint(t * 0.8).z],
                                [4.39, 0, appleTraj.getPoint(t * 0.8).z],
                            ]}
                            lineWidth={3}
                            color={"purple"} />

                        <group position={[4.8, 0, appleTraj.getPoint(t * 0.8).z+0.4]}>
                            <Text3d rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text={"x"} color={"purple"} />
                            <Text3d position={[-0.15, 0, -0.18]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.6} text={"y"} color={"purple"} />
                            <Text3d position={[0, 0, -0.38]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.7} text={"(τ)"} color={"purple"} font="fira" />
                        </group>


                        <Line
                            points={[
                                [appleTraj.getPoint(t * 0.8).x, 0, appleTraj.getPoint(t * 0.8).z],
                                [appleTraj.getPoint(t * 0.8).x, 0, 4.69],
                            ]}
                            lineWidth={3}
                            color={"green"} />

                        <group position={[appleTraj.getPoint(t * 0.8).x - 0.2, 0, 4.5]}>
                            <Text3d rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={2} text={"x"} color={"green"} />
                            <Text3d position={[-0.15, 0, -0.18]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.6} text={"t"} color={"green"} />
                            <Text3d position={[0, 0, -0.35]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.7} text={"(τ)"} color={"green"} font="fira" />
                        </group>
                    </>
                </group>
            </>
        </Simulation>
    );
}