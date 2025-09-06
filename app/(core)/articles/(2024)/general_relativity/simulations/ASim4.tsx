'use client'

import Simulation from "../structure/Simulation";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from 'three'
import { smoothc } from "./SimulationHelpers";
import Text3d from "../models/Text3d";
import { useLoader } from "@react-three/fiber";

function linearc(a1: number, a3: number, t: number, t1: number, t3: number) {
    // First, linearly interpolate between a1 and a2 and a2 and a3
    if (t < t1) return a1;
    if (t > t3) return a3;
    const a2 = (a3 - a1) / 2 + a1;
    const t2 = (t1 + t3) / 2;
    const a12 = a1 * (t2 - t) / (t2 - t1) + a2 * (t - t1) / (t2 - t1);
    const a23 = a2 * (t3 - t) / (t3 - t2) + a3 * (t - t2) / (t3 - t2);

    // Then, linearly interpolate between a12 and a23
    const a13 = a12 * (t3 - t) / (t3 - t1) + a23 * (t - t1) / (t3 - t1);

    return a13;
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

// Utility functions
function pointAt(x: number, y: number, vx: number, vy: number, t: number) {
    const def = Math.min(1, Math.max(0, t));
    const christoffelStart = [ // Gamma^i_jk, ordered as [i][j][k]
        [[0, 0], [0, 0]],
        [[0, 0], [0, 0]]
    ];
    const theta = 0.05 * Math.PI / 2;
    const christoffelEnd = [ // Gamma^i_jk, ordered as [i][j][k]
        [[0, 0], [0, -Math.sin(theta) * Math.cos(theta)]],
        [[0, Math.atan(theta)], [Math.atan(theta), 0]]
    ];
    const christoffel = [
        [
            [smoothc(christoffelStart[0][0][0], christoffelEnd[0][0][0], def, 0.1, 0.52), smoothc(christoffelStart[0][0][1], christoffelEnd[0][0][1], def, 0.1, 0.52)],
            [smoothc(christoffelStart[0][1][0], christoffelEnd[0][1][0], def, 0.1, 0.52), smoothc(christoffelStart[0][1][1], christoffelEnd[0][1][1], def, 0.1, 0.52)]
        ],
        [
            [smoothc(christoffelStart[1][0][0], christoffelEnd[1][0][0], def, 0.1, 0.52), smoothc(christoffelStart[1][0][1], christoffelEnd[1][0][1], def, 0.1, 0.52)],
            [smoothc(christoffelStart[1][1][0], christoffelEnd[1][1][0], def, 0.1, 0.52), smoothc(christoffelStart[1][1][1], christoffelEnd[1][1][1], def, 0.1, 0.52)]
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

function setPoints(t: number) {
    // Sizes
    const GRID_EXTENT = 5;  // Extent of the grid (from -GRID_EXTENT to GRID_EXTENT)
    const GRID_SUBDIVISIONS = 8;  // Number of subdivisions of the grid (on each axis)
    const COLOR = { R: 0.1, G: 0.1, B: 0.1 };
    const POINTS_COUNT = 500; // Number of points on each axis

    // Iterating distances
    const extent = 2 * GRID_EXTENT / GRID_SUBDIVISIONS;
    const dx = 0.8;
    const dy = 1.5;

    // Inner grid
    const l = GRID_SUBDIVISIONS * POINTS_COUNT * 3 * 2;
    const positionsGrid = new Float32Array(l); // Positions of the points
    const colorsGrid = new Float32Array(l); // Colors of the points

    // Grid
    for (let it = 0; it < GRID_SUBDIVISIONS * 2; it++) {
        const i = it % GRID_SUBDIVISIONS;
        let curX = it < GRID_SUBDIVISIONS ? -GRID_EXTENT + extent * i : -GRID_EXTENT;
        let curY = it < GRID_SUBDIVISIONS ? -GRID_EXTENT : -GRID_EXTENT + extent * i;
        let vx = it < GRID_SUBDIVISIONS ? 0 : linear3c(1.0, 1.5, 1.5, t, 0.28, 0.52);
        let vy = it < GRID_SUBDIVISIONS ? 1.0 : linear3c(0, 0, 0.06, t, 0.28, 0.52);

        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Set points
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsGrid[ind + 0] = curX < 2 ? curX + dx : 1000;
            positionsGrid[ind + 1] = 0;
            positionsGrid[ind + 2] = curY < 2 ? curY + dy : 1000;

            // Set colors
            colorsGrid[ind + 0] = COLOR.R;
            colorsGrid[ind + 1] = COLOR.G;
            colorsGrid[ind + 2] = COLOR.B;

            // Update
            const res = pointAt(curX, curY, vx, vy, t);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }

    // Axis
    const POINTS_COUNT2 = 400;
    const l2 = POINTS_COUNT * 2 * 3 + POINTS_COUNT2 * 2 * 3 + POINTS_COUNT2 * 3;
    const positionsAxis = new Float32Array(l2); // Positions of the points
    const colorsAxis = new Float32Array(l2); // Colors of the points
    for (let it = 0; it < 2; it++) {
        let curX = it == 0 ? -GRID_EXTENT + extent * 1 : -GRID_EXTENT;
        let curY = it == 0 ? -GRID_EXTENT : -GRID_EXTENT + extent * 4;
        let vx = it == 0 ? 0 : linear3c(1.0, 1.5, 1.5, t, 0.28, 0.52);
        let vy = it == 0 ? 1.0 : linear3c(0, 0, 0.06, t, 0.28, 0.52);
        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Position
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsAxis[ind + 0] = curX < 2 ? curX + dx : 1000;
            positionsAxis[ind + 1] = 0.01;
            positionsAxis[ind + 2] = curY < 2 ? curY + dy : 1000;

            // Color
            colorsAxis[ind + 0] = it == 1 ? 47 / 255 / 1.4 : 181 / 255 / 1.6;
            colorsAxis[ind + 1] = it == 1 ? 171 / 255 / 1.4 : 31 / 255 / 1.6;
            colorsAxis[ind + 2] = it == 1 ? 34 / 255 / 1.4 : 181 / 255 / 1.6;

            // Update
            const res = pointAt(curX, curY, vx, vy, t);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }

    let startX = 100;
    let startY = 0;
    let endX = -100;
    let endY = 0;

    // Delta t and delta x
    for (let it = 0; it < 2; it++) {
        let curX = it == 0 ? -GRID_EXTENT + extent * 2 : -GRID_EXTENT;
        let curY = it == 0 ? -GRID_EXTENT : -GRID_EXTENT + extent * 3;
        let vx = it == 0 ? 0 : linear3c(1.0, 1.5, 1.5, t, 0.28, 0.52);
        let vy = it == 0 ? 1.0 : linear3c(0, 0, 0.06, t, 0.28, 0.52);
        for (let tau = 0; tau < POINTS_COUNT2; tau++) {
            // Position
            const ind = (POINTS_COUNT * 2 + it * POINTS_COUNT2 + tau) * 3;

            let posX = curX + dx;
            let posY = curY + dy;

            if (it == 0 && !( // Space axis
                   curY > linear3c(-3.74, -3.74, -3.62, t, 0.28, 0.52)
                && curY < linear3c(-1.25, -1.25, -1.15, t, 0.28, 0.52)
            )) {
                posX = 1000;
                posY = 1000;
            }
            else if (it == 1) { // Time axis
                const t2 = 0.28;
                if (t < t2 && !(
                    curX > linearc(-2.5, -2.7, t, 0.12, t2)
                    && curX < linearc(1.23, 1.02, t, 0.12, t2)
                )) {
                    posX = 1000;
                    posY = 1000;
                }
                else if (t >= t2 && !(
                    curX > smoothc(-2.7, -3.1, t, t2, 0.52)
                    && curX < smoothc(1.02, 0.55, t, t2, 0.52)
                )) {
                    posX = 1000;
                    posY = 1000;
                }
            }

            // Set max and min
            if (it == 0 && posX != 1000 && posY != 1000) {
                if (posY < startY) {
                    startX = posX;
                    startY = posY;
                }
            }
            if (it == 1 && posX != 1000 && posY != 1000) {
                if (posX > endX) {
                    endX = posX;
                    endY = posY;
                }
            }

            positionsAxis[ind + 0] = posX;
            positionsAxis[ind + 1] = 0.01;
            positionsAxis[ind + 2] = posY;

            // Color
            colorsAxis[ind + 0] = (it == 1 ? 47 / 255 / 1.4 : 181 / 255 / 1.6) * 0.6;
            colorsAxis[ind + 1] = (it == 1 ? 171 / 255 / 1.4 : 31 / 255 / 1.6) * 0.6;
            colorsAxis[ind + 2] = (it == 1 ? 34 / 255 / 1.4 : 181 / 255 / 1.6) * 0.6;

            // Update
            const res = pointAt(curX, curY, vx, vy, t);
            curX = res.x;
            curY = res.y;
            vx = res.vx;
            vy = res.vy;
        }
    }

    // Delta s
    for (let tau = 0; tau < POINTS_COUNT2; tau++) {
        // Position
        const ind = (POINTS_COUNT * 2 + POINTS_COUNT2 * 2 + tau) * 3;

        positionsAxis[ind + 0] = (endX - startX) / POINTS_COUNT2 * tau + startX;
        positionsAxis[ind + 1] = 0.01;
        positionsAxis[ind + 2] = (endY - startY) / POINTS_COUNT2 * tau + startY;

        // Color
        colorsAxis[ind + 0] = 0.1;
        colorsAxis[ind + 1] = 0.1;
        colorsAxis[ind + 2] = 0.1;
    }

    return { positionsGrid, colorsGrid, positionsAxis, colorsAxis };
}

function Grid2D(props: { t: number }) {
    const [t, setT] = useState(props.t);

    // Set initial parameters
    const { positionsGrid, colorsGrid, positionsAxis, colorsAxis } = useMemo(() => {
        return setPoints(props.t);
    }, [props.t]);

    // Deform grid
    useEffect(() => {
        if (t == props.t) return;
        setT(props.t);

        // Deform grid
        const points = setPoints(props.t);

        // Update buffer geometry
        geomGrid.setAttribute('position', new THREE.BufferAttribute(points.positionsGrid, 3));
        geomGrid.attributes.position.needsUpdate = true;
        geomAxis.setAttribute('position', new THREE.BufferAttribute(points.positionsAxis, 3));
        geomAxis.attributes.position.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.t, t]);


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
        const materialAxis = new THREE.PointsMaterial({ vertexColors: true, size: 0.08 });

        return { geomGrid, materialGrid, geomAxis, materialAxis };
    }, [colorsAxis, colorsGrid, positionsAxis, positionsGrid]);

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

export function ASim4Part1(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t : 1;

    return <Simulation>
        <PerspectiveCamera makeDefault position={[1.3, 7, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Grid2D t={t} />

        <Text3d position={[smoothc(-1.85, -2.09, t, 0.1, 0.52), 0.1, smoothc(-0.93, -0.74, t, 0.1, 0.52)]} text="Δx" color="#b51fb5" font="fira" rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.3} />
        <Text3d position={[smoothc(0, -0.42, t, 0.1, 0.52), 0.1, smoothc(0.62, 0.84, t, 0.1, 0.52)]} text="Δt" color="#2fab22" font="fira" rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.3} />
        <Text3d position={[smoothc(0.09, -0.04, t, 0.1, 0.52), 0.1, smoothc(-1.33, -0.94, t, 0.1, 0.52)]} text="Δs" color="#333" font="fira" rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1.3} />
    </Simulation>
}


function getMapVertices(deformation: number, heightSegments: number, widthSegments: number, R: number) {
    const vertices: number[] = [];
    const tStart1 = 0.27;
    const tEnd1 = 0.4;
    const tStart2 = 0.48;
    const tEnd2 = 0.65;

    for (let iy = 0; iy <= heightSegments; iy++) {
        const v = iy / heightSegments;
        for (let ix = 0; ix <= widthSegments; ix++) {
            const u = ix / widthSegments;

            const vertexSphere = new THREE.Vector3(...getSpherePointFromUV(u, v, R));
            const vertexPlane = new THREE.Vector3(...getPlanePointFromUV(u, v, R));

            if (deformation < tStart2) {
                vertices.push(
                    smoothc(vertexSphere.x, vertexPlane.x, deformation, tStart1, tEnd1),
                    smoothc(vertexSphere.y, vertexPlane.y, deformation, tStart1, tEnd1),
                    smoothc(vertexSphere.z, vertexPlane.z, deformation, tStart1, tEnd1)
                );
            }
            else {
                vertices.push(
                    smoothc(vertexPlane.x, vertexSphere.x, deformation, tStart2, tEnd2),
                    smoothc(vertexPlane.y, vertexSphere.y, deformation, tStart2, tEnd2),
                    smoothc(vertexPlane.z, vertexSphere.z, deformation, tStart2, tEnd2)
                );
            }
        }
    }

    return { vertices };
}

function MapBuffer(props: { deformation: number }) {
    const [deformation, setDeformation] = useState(props.deformation);
    const heightSegments = 32;
    const widthSegments = 32;
    const R = 2;

    // Deform grid
    useEffect(() => {
        if (deformation == props.deformation) return;
        setDeformation(props.deformation);

        // Deform grid
        const points = getMapVertices(props.deformation, heightSegments, widthSegments, R);

        // Update buffer geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.vertices, 3));
        geometry.attributes.position.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deformation, props.deformation]);

    // Generate vertices
    const { vertices } = useMemo(() => {
        return getMapVertices(deformation, heightSegments, widthSegments, R);
    }, [deformation]);


    // Generate indices, normals and uvs
    const { indices, normals, uvs } = useMemo(() => {
        let index = 0;
        const normal = new THREE.Vector3();
        
        const grid = [];
        const indices = [];
        const normals = [];
        const uvs = [];

        // Normals and uvs
        for (let iy = 0; iy <= heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / heightSegments;

            // Special case for the poles
            let uOffset = 0;
            if (iy == 0) {
                uOffset = 0.5 / widthSegments;
            }
            else if (iy == heightSegments) {
                uOffset = -0.5 / widthSegments;
            }

            for (let ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;

                // Vertex
                const vertex = new THREE.Vector3(...getSpherePointFromUV(u, v, R));

                // Normal
                normal.copy(vertex).normalize();
                normals.push(normal.x, normal.y, normal.z);

                // Uv
                uvs.push(u + uOffset, 1 - v);

                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }

        // Indices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];

                if (iy != 0) indices.push(a, b, d);
                if (iy != heightSegments - 1) indices.push(b, c, d);
            }
        }

        return { indices, normals, uvs };
    }, []);

    // Build geometry
    const earthTexture = useLoader(THREE.TextureLoader, '/articles/general_relativity/images/earth.png');
    const { geometry } = useMemo(() => {
        const geometry = new THREE.BufferGeometry();

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        return { geometry, earthTexture };
    }, [indices, vertices, normals, uvs, earthTexture]);

    // Create mesh
    return (
        <>
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <bufferGeometry attach="geometry" {...geometry} />
                <meshStandardMaterial map={earthTexture} />
            </mesh>
        </>
    )
}


function getPlaneTrajectoryPoints(deformation: number) {
    const POINTS = 200;
    const R = 2;
    const tStart1 = 0.27;
    const tEnd1 = 0.4;
    const tStart2 = 0.48;
    const tEnd2 = 0.65;

    const l = POINTS * 3;
    const positions = new Float32Array(l); // Positions of the points
    const colors = new Float32Array(l); // Colors of the points
    for (let i = 0; i < POINTS; i++) {
        const uv = getTrajectoryUV(i / (POINTS-1));
        
        const planePos = getPlanePointFromUV(uv[0], uv[1], R);
        const spherePos = getSpherePointFromUV(uv[0], uv[1], R);

        if (deformation < tStart2) {
            positions[i * 3 + 0] = smoothc(spherePos[0], planePos[0], deformation, tStart1, tEnd1)
            positions[i * 3 + 1] = smoothc(spherePos[1], planePos[1] + 0.04, deformation, tStart1, tEnd1)
            positions[i * 3 + 2] = smoothc(spherePos[2], planePos[2], deformation, tStart1, tEnd1)
        }
        else {
            positions[i * 3 + 0] = smoothc(planePos[0], spherePos[0], deformation, tStart2, tEnd2)
            positions[i * 3 + 1] = smoothc(planePos[1] + 0.04, spherePos[1], deformation, tStart2, tEnd2)
            positions[i * 3 + 2] = smoothc(planePos[2], spherePos[2], deformation, tStart2, tEnd2)
        }

        const cs = 1.7;
        colors[i * 3 + 0] = 255 / 255 / cs;
        colors[i * 3 + 1] = 82 / 255 / cs;
        colors[i * 3 + 2] = 82 / 255 / cs;
    }

    return { positions, colors };
}

function getTrajectoryUV(p: number) {
    const traj = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.163, 0.29, 0),
        new THREE.Vector3(0.371, 0.12, 0),
        new THREE.Vector3(0.58, 0.27, 0)
    );

    const point = traj.getPointAt(p);
    return [ point.x, point.y ];
}

function getPlanePointFromUV(u: number, v: number, R: number) {
    return [
        (u - 0.5) * 2 * R * Math.PI / 2,
        0,
        (v - 0.5) * 2 * R
    ];
}
function getSpherePointFromUV(u: number, v: number, R: number) {
    return [
        -R * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI),
        R * Math.cos(v * Math.PI),
        R * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI)
    ];
}

function TrajectoryLine(props: { deformation: number }) {
    const [deformation, setDeformation] = useState(props.deformation);

    const { positions, colors } = useMemo(() => {
        return getPlaneTrajectoryPoints(props.deformation);
    }, [props.deformation]);

    // Deform grid
    useEffect(() => {
        if (deformation == props.deformation) return;
        setDeformation(props.deformation);

        // Deform grid
        const points = getPlaneTrajectoryPoints(props.deformation);

        // Update buffer geometry
        geometry.setAttribute('position', new THREE.BufferAttribute(points.positions, 3));
        geometry.attributes.position.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deformation, props.deformation]);

    const { geometry, material } = useMemo(() => {
        // Create buffer geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.PointsMaterial({ vertexColors: true, size: 0.1 });

        return { geometry, material };
    }, [colors, positions]);

    // Create segments
    return (
        <group dispose={null} rotation={[0, Math.PI / 2, 0]}>
            <points>
                <bufferGeometry attach="geometry" {...geometry} />
                <pointsMaterial attach="material" {...material} />
            </points>
        </group>
    );
}

export function ASim4Part2(props: { t: number, visible: boolean, isDesktop: boolean }) {
    const t = props.isDesktop ? props.t : 1;

    return <Simulation>
        <PerspectiveCamera makeDefault position={[1.3, 7.5, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <group rotation={[0, 0, 0.3]}>
            <MapBuffer deformation={t} />
            <TrajectoryLine deformation={t} />
        </group>
    </Simulation>
}
