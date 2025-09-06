import Simulation from "../structure/Simulation";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import * as THREE from 'three'

function invertMatrix(m0: number[][]) {
    // Reformat m0
    const m = new Array(16);
    for (let i = 0; i < 4; i++) {
        m[i * 4 + 0] = m0[i][0];
        m[i * 4 + 1] = m0[i][1];
        m[i * 4 + 2] = m0[i][2];
        m[i * 4 + 3] = m0[i][3];
    }

    const inv = new Array(16);

    inv[0] = m[5] * m[10] * m[15] -
        m[5] * m[11] * m[14] -
        m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] +
        m[13] * m[6] * m[11] -
        m[13] * m[7] * m[10];

    inv[4] = -m[4] * m[10] * m[15] +
        m[4] * m[11] * m[14] +
        m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] -
        m[12] * m[6] * m[11] +
        m[12] * m[7] * m[10];

    inv[8] = m[4] * m[9] * m[15] -
        m[4] * m[11] * m[13] -
        m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] +
        m[12] * m[5] * m[11] -
        m[12] * m[7] * m[9];

    inv[12] = -m[4] * m[9] * m[14] +
        m[4] * m[10] * m[13] +
        m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] -
        m[12] * m[5] * m[10] +
        m[12] * m[6] * m[9];

    inv[1] = -m[1] * m[10] * m[15] +
        m[1] * m[11] * m[14] +
        m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] -
        m[13] * m[2] * m[11] +
        m[13] * m[3] * m[10];

    inv[5] = m[0] * m[10] * m[15] -
        m[0] * m[11] * m[14] -
        m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] +
        m[12] * m[2] * m[11] -
        m[12] * m[3] * m[10];

    inv[9] = -m[0] * m[9] * m[15] +
        m[0] * m[11] * m[13] +
        m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] -
        m[12] * m[1] * m[11] +
        m[12] * m[3] * m[9];

    inv[13] = m[0] * m[9] * m[14] -
        m[0] * m[10] * m[13] -
        m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] +
        m[12] * m[1] * m[10] -
        m[12] * m[2] * m[9];

    inv[2] = m[1] * m[6] * m[15] -
        m[1] * m[7] * m[14] -
        m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] +
        m[13] * m[2] * m[7] -
        m[13] * m[3] * m[6];

    inv[6] = -m[0] * m[6] * m[15] +
        m[0] * m[7] * m[14] +
        m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] -
        m[12] * m[2] * m[7] +
        m[12] * m[3] * m[6];

    inv[10] = m[0] * m[5] * m[15] -
        m[0] * m[7] * m[13] -
        m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] +
        m[12] * m[1] * m[7] -
        m[12] * m[3] * m[5];

    inv[14] = -m[0] * m[5] * m[14] +
        m[0] * m[6] * m[13] +
        m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] -
        m[12] * m[1] * m[6] +
        m[12] * m[2] * m[5];

    inv[3] = -m[1] * m[6] * m[11] +
        m[1] * m[7] * m[10] +
        m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] -
        m[9] * m[2] * m[7] +
        m[9] * m[3] * m[6];

    inv[7] = m[0] * m[6] * m[11] -
        m[0] * m[7] * m[10] -
        m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] +
        m[8] * m[2] * m[7] -
        m[8] * m[3] * m[6];

    inv[11] = -m[0] * m[5] * m[11] +
        m[0] * m[7] * m[9] +
        m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] -
        m[8] * m[1] * m[7] +
        m[8] * m[3] * m[5];

    inv[15] = m[0] * m[5] * m[10] -
        m[0] * m[6] * m[9] -
        m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] +
        m[8] * m[1] * m[6] -
        m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det == 0)
        return new Array(16).fill(0);
    det = 1.0 / det;

    let invOut = new Array(16);
    for (let i = 0; i < 16; i++)
        invOut[i] = inv[i] * det;

    // Reformat to 4x4 matrix
    invOut = [
        [invOut[0], invOut[4], invOut[8], invOut[12]],
        [invOut[1], invOut[5], invOut[9], invOut[13]],
        [invOut[2], invOut[6], invOut[10], invOut[14]],
        [invOut[3], invOut[7], invOut[11], invOut[15]]
    ];

    return invOut;
}

function getMetric(pos: number[]): number[][] {
    const x = pos[2];
    const y = pos[3];

    return [
        [-1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, x ** 2, 0],
        [0, 0, 0, x ** 2 * Math.sin(y) ** 2]
    ];
}

// Utility functions
function getMetricInterpolated(percentage: number, pos: number[], shouldInvert?: boolean): number[][] {
    const inverse = shouldInvert ?? false;

    if (!inverse) {
        // Matrix for p = 0
        const g0 = [
            [-1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        // Matrix for p = 1
        const g1 = getMetric(pos);

        // Interpolate matrix
        const g = new Array(4).fill(0).map(() => new Array(4).fill(0));
        for (let mu = 0; mu < 4; mu++) {
            for (let nu = 0; nu < 4; nu++) {
                g[mu][nu] = (1 - percentage) * g0[mu][nu] + percentage * g1[mu][nu];
            }
        }
        return g;
    }

    // Inverse metric
    return invertMatrix(getMetricInterpolated(percentage, pos));
}
function getMetricDerivative(percentage: number, pos0: number[], rho: number, mu: number, nu: number) {
    // d/drho g_(mu_nu)
    const dDerivative = 0.01;

    const pos = [...pos0];
    pos[rho] += dDerivative;
    return (getMetricInterpolated(percentage, pos)[mu][nu] - getMetricInterpolated(percentage, pos0)[mu][nu]) / dDerivative;
}
function getChristoffelSymbol(percentage: number, pos: number[], rho: number, mu: number, nu: number) {
    let christ = 0;
    for (let sigma = 0; sigma < 4; sigma++) {
        const dnu = getMetricDerivative(percentage, pos, nu, rho, sigma);
        const drho = getMetricDerivative(percentage, pos, rho, sigma, nu);
        const dsigma = getMetricDerivative(percentage, pos, sigma, nu, rho);
        christ += 0.5 * getMetricInterpolated(percentage, pos, true)[mu][sigma] * (dnu + drho - dsigma);
    }
    return christ;
}


function solveGeodesicEquation(pos0: number[], vel0: number[], per?: number) {
    console.log("Solving geodesic equation for position", pos0, "and velocity", vel0);

    // Constants
    const percentage = per ?? 1;
    const dtau = 0.1;
    const iterationsCount = 100;


    // Store values
    const positions = [pos0];

    // Solve geodesic equation
    const pos = [...pos0];
    let vel = [...vel0];
    for (let it = 0; it < iterationsCount; it++) {
        // Update velocities
        const vNew = [...vel];
        for (let rho = 0; rho < 4; rho++) {
            // Iterate into geodesic equation
            for (let mu = 0; mu < 4; mu++) {
                for (let nu = 0; nu < 4; nu++) {
                    vNew[rho] -= dtau * getChristoffelSymbol(percentage, pos, rho, mu, nu) * vel[mu] * vel[nu];
                }
            }
        }
        vel = [...vNew];

        // Update position using Euler method
        for (let rho = 2; rho < 4; rho++) { // for (let rho = 0; rho < 4; rho++) { (only care about rho = 2, 3)
            pos[rho] += dtau * vel[rho];
        }

        // Store position
        positions.push([...pos]);
    }

    // Return positions
    return positions;
}

function getGridPoints(p: number) {
    console.log("\n\nCOMPUTING GRID POINTS");

    // Sizes
    const GRID_EXTENT = 5;  // Extent of the grid (from -GRID_EXTENT to GRID_EXTENT)
    const GRID_SUBDIVISIONS = 3;  // Number of subdivisions of the grid (on each axis)
    const COLOR = { R: 0.1, G: 0.1, B: 0.1 };
    const POINTS_COUNT = 20; // Number of points on each axis
    const vi = 0.4; // Initial velocity

    // Iterating distances
    const extent = 2 * GRID_EXTENT / (GRID_SUBDIVISIONS - 1);

    // Inner grid
    const l = GRID_SUBDIVISIONS * 2 * POINTS_COUNT * 3;
    const positionsGrid = new Float32Array(l).fill(1000); // Positions of the points
    const colorsGrid = new Float32Array(l).fill(0); // Colors of the points
    for (let it = 0; it < GRID_SUBDIVISIONS * 2; it++) {
        // Get initial conditions
        const i = it % GRID_SUBDIVISIONS;
        const x0 = it < GRID_SUBDIVISIONS ? 0 : -GRID_EXTENT + extent * i;
        const y0 = it < GRID_SUBDIVISIONS ? -GRID_EXTENT + extent * i : 0;
        const vx0 = it < GRID_SUBDIVISIONS ? vi : 0;
        const vy0 = it < GRID_SUBDIVISIONS ? 0 : vi;

        // Solve geodesic equation
        const vNorm = Math.sqrt(vx0 ** 2 + vy0 ** 2);
        const positions = solveGeodesicEquation([0, 0, x0, y0], [1 - vNorm ** 2, 0, vx0, vy0], p);

        // Store positions
        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Set points
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsGrid[ind + 0] = positions[tau][2];
            positionsGrid[ind + 1] = 0;
            positionsGrid[ind + 2] = positions[tau][3];

            // Set colors
            colorsGrid[ind + 0] = COLOR.R;
            colorsGrid[ind + 1] = COLOR.G;
            colorsGrid[ind + 2] = COLOR.B;
        }
    }

    console.log("\n\nCOMPUTING AXIS POINTS");
    // Axis
    const positionsAxis = new Float32Array(POINTS_COUNT * 2 * 3 + POINTS_COUNT * 3).fill(1000); // Positions of the points
    const colorsAxis = new Float32Array(POINTS_COUNT * 2 * 3 + POINTS_COUNT * 3).fill(0); // Colors of the points
    for (let it = 0; it < 2; it++) {
        // Get initial conditions
        const x0 = it < GRID_SUBDIVISIONS ? 0 : -GRID_EXTENT + extent * 2;
        const y0 = it < GRID_SUBDIVISIONS ? -GRID_EXTENT + extent * 2 : 0;
        const vx0 = it == 0 ? vi : 0;
        const vy0 = it == 0 ? 0 : vi;

        // Solve geodesic equation
        const vNorm = Math.sqrt(vx0 ** 2 + vy0 ** 2);
        const positions = solveGeodesicEquation([0, 0, x0, y0], [1 - vNorm ** 2, 0, vx0, vy0], p);

        for (let tau = 0; tau < POINTS_COUNT; tau++) {
            // Position
            const ind = (it * POINTS_COUNT + tau) * 3;
            positionsAxis[ind + 0] = positions[tau][2];
            positionsAxis[ind + 1] = 0.01;
            positionsAxis[ind + 2] = positions[tau][3];

            // Color
            colorsAxis[ind + 0] = it == 1 ? 47 / 255 / 1.4 : 181 / 255 / 1.6;
            colorsAxis[ind + 1] = it == 1 ? 171 / 255 / 1.4 : 31 / 255 / 1.6;
            colorsAxis[ind + 2] = it == 1 ? 34 / 255 / 1.4 : 181 / 255 / 1.6;
        }
    }

    console.log("\n\nDONE");

    return { positionsGrid, colorsGrid, positionsAxis, colorsAxis };
}

function Grid2D() {
    const { p } = useControls({
        p: { value: 0, min: 0, max: 1, step: 0.1 }
    });

    const { positionsGrid, colorsGrid, positionsAxis, colorsAxis } = useMemo(() => {
        return getGridPoints(p);
    }, [p]);

    // Create geometries and materials
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

    // Deform grid
    useEffect(() => {
        // Deform grid
        const points = getGridPoints(p);

        // Update buffer geometry
        geomGrid.setAttribute('position', new THREE.BufferAttribute(points.positionsGrid, 3));
        geomGrid.attributes.position.needsUpdate = true;
        geomAxis.setAttribute('position', new THREE.BufferAttribute(points.positionsAxis, 3));
        geomAxis.attributes.position.needsUpdate = true;
    }, [geomAxis, geomGrid, p]);

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


export function ExactGeodesicSolution() {
    return <Simulation>
        <PerspectiveCamera makeDefault position={[2, 9, 0]} fov={60} />
        <OrbitControls />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Grid2D />
    </Simulation>
}
