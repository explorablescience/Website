'use client'

import * as d3 from "d3";
import { JSX, useEffect, useRef, useState } from "react";
import logError from "../logic/api_manager";
import styles from './1_IsingMagnetizationGraph.module.css';
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import errorStyles from '../logic/simulations/SimulationError.module.css';

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

// Draw a big arrow on the right for total magnetization
function canvas_arrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, r: number) {
    const x_center = tox;
    const y_center = toy;

    let angle;
    let x;
    let y;

    // Draw line
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();

    // Draw arrow
    context.beginPath();

    angle = Math.atan2(toy - fromy, tox - fromx)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1 / 3) * (2 * Math.PI)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1 / 3) * (2 * Math.PI)
    x = r * Math.cos(angle) + x_center;
    y = r * Math.sin(angle) + y_center;

    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

function CanvasSimulation(props: { magnetization: number }): JSX.Element {
    const magnetization = props.magnetization;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logError(new Error("Canvas reference is null (Ising Magnetization simulation)"));
        const cv = canvas!;

        // Set canvas dimensions based on target
        const dpr = window.devicePixelRatio || 1;
        const rect = cv.getBoundingClientRect();
        const width = rect.width * dpr;
        const height = rect.height * dpr;
        cv.width = width;
        cv.height = height;

        // Get context
        const context = cv.getContext("2d");
        if (!context) logError(new Error("Canvas context is null (Ising Magnetization simulation)"));
        const ctx = context!;

        // Conditions
        const N = 80; // Number of spins on width direction
        const [Nx, Ny] = [N, Math.floor(N / (16 / 9))];
        const upProportion = Math.sign(magnetization) == 1 ? Math.abs(magnetization) : 1.0 - Math.abs(magnetization);
        const spins = new Array(Nx * Ny).fill(false).map(() => Math.random() < (Math.abs(magnetization) < 0.3 ? 0.5 : upProportion) ? true : false);

        // Clear canvas
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, width, height);

        // Draw spins
        const epsilon = 1;
        spins.forEach((spin, i) => {
            const x = (i % Nx) * (width / Nx);
            const y = Math.floor(i / Nx) * (height / Ny);
            if (spin) {
                ctx.fillStyle = "#ff3235"; // Spin up
            } else {
                ctx.fillStyle = "#2939e2"; // Spin down
            }
            ctx.fillRect(x, y, width / Nx + epsilon, height / Ny + epsilon);
        });

        // Add total magnetization arrow
        let mag = magnetization;
        if (Math.abs(mag) < 1e-5) {
            mag = Math.random() < 0.5 ? 1e-5 : -1e-5;
        }
        const magAbs = Math.abs(mag * 0.75) * 0.95 + 0.1;
        const arrowSize = 7 / 3 + 25 / 3 * magAbs;
        const heightEnd = Math.sign(mag) == 1 ? height * (0.5 - magAbs / 2.0) : height - height * (0.5 - magAbs / 2.0);

        ctx.lineWidth = arrowSize;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white'; // for the triangle fill
        ctx.lineJoin = 'bevel';
        canvas_arrow(ctx, width - 20, height / 2, width - 20, heightEnd, arrowSize * 1.1);
    }, [canvasRef, magnetization]);

    return <>
        <canvas className={styles['simulation-canvas']} ref={canvasRef} />
    </>
}

function setSVG(refCanvas: React.RefObject<SVGSVGElement | null>, refCanvasParent: React.RefObject<HTMLDivElement | null>, setMagnetizationValue: (value: number[]) => void) {
    // Clear previous SVG
    if (!refCanvas.current || !refCanvasParent.current) return;
    d3.select(refCanvas.current).selectAll("*").remove();
    
    // set the dimensions and margins of the graph
    const widthRaw = refCanvasParent.current?.clientWidth || 100;
    const aspectRatio = 0.8; // 4/5
    const heightRaw = Math.min(widthRaw * aspectRatio, 380); // Maintain aspect ratio
    refCanvas.current!.setAttribute("width", widthRaw.toString());
    refCanvas.current!.setAttribute("height", heightRaw.toString());

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 45, left: 50 },
        width = widthRaw - margin.left - margin.right,
        height = heightRaw - margin.top - margin.bottom;

    // Append svg to the div
    const svg = d3
        .select(refCanvas.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw tanh(x) from -1 to 1
    const func = (x: number, pm: number) => {
        if (x < 1.0) {
            const xl = -((-x-1) / 2 * 2 + 1); // Scale to [0, 1]
            return pm * Math.sqrt(1 - xl * xl);
        }
        return 0;
    };

    // Axis
    const x = d3
        .scaleLinear()
        .domain([0, 2])
        .range([0, width])
        .nice();
    const y = d3
        .scaleLinear()
        .domain([-1.05, 1.05])
        .range([height, 0])
        .nice();
    svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    svg.append("g").call(d3.axisLeft(y).ticks(height / 100).tickSizeOuter(0));

    // X Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("fill", "#6a5ff7")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Temperature");

    // Y Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("fill", "#aa51df")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .text("Total Magnetization");

    // Plot data
    const line = d3
        .line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y));
    svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#aa51df")
        .attr("stroke-width", 4.5)
        .attr("d", line(d3.range(0, 2, 0.001).map((x) => ({ x: x, y: func(x, 1) }))));
    svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#aa51df")
        .attr("stroke-width", 4.5)
        .attr("d", line(d3.range(0, 2, 0.001).map((x) => ({ x: x, y: func(x, -1) }))));

    // Add a transparent rect over the axis area
    const mx = 200;
    const xValue = x.invert(mx);
    const circleRefUp = svg.append("circle")
        .attr("class", "hover-point")
        .attr("display", "none")
        .attr("r", 8)
        .attr("fill", "#6a5ff7")
        .attr("display", "unset")
        .attr("cx", mx)
        .attr("cy", y(func(xValue, 1.0)));
    const circleRefDown = svg.append("circle")
        .attr("class", "hover-point")
        .attr("display", "none")
        .attr("r", 8)
        .attr("fill", "#6a5ff7")
        .attr("display", "unset")
        .attr("cx", mx)
        .attr("cy", y(func(xValue, -1.0)));
    setMagnetizationValue([func(xValue, 1.0), func(xValue, -1.0)]);
    const hoverLine = svg.append("line")
        .attr("class", "hover-line")
        .attr("stroke", "#6a5ff7")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5,5")
        .attr("x1", mx)
        .attr("y1", 0)
        .attr("x2", mx)
        .attr("y2", height);
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .on("mousemove", function (event) {
            const [mx, my] = d3.pointer(event);
            const yValue = y.invert(my);

            // Check if intersection
            if (yValue >= -1 && yValue <= 1) {
                const xValue = x.invert(mx);
                hoverLine
                    .attr("x1", mx)
                    .attr("y1", 0)
                    .attr("x2", mx)
                    .attr("y2", height);
                const yDownValue = func(xValue, 1.0);
                circleRefUp
                    .attr("display", "unset")
                    .attr("cx", mx)
                    .attr("cy", y(yDownValue));
                const yUpValue = func(xValue, -1.0);
                circleRefDown
                    .attr("display", "unset")
                    .attr("cx", mx)
                    .attr("cy", y(yUpValue));
                setMagnetizationValue([Math.abs(yDownValue) < 0.001 ? Math.random() * 0.00001 : yDownValue, Math.abs(yUpValue) < 0.001 ? Math.random() * 0.00001 : yUpValue]);
            }
        });
}

export function IsingMagnetizationGraph(props: { title?: string, description?: JSX.Element }) {
    const refCanvasParent = useRef<HTMLDivElement>(null);
    const refCanvas = useRef<SVGSVGElement>(null);
    const [magnetizationValue, setMagnetizationValue] = useState([0, 0]);

    // Set up the SVG
    useEffect(() => {
        setSVG(refCanvas, refCanvasParent, setMagnetizationValue);
    }, [refCanvas]);

    // HTML Content
    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <div className={styles['ising-simulation-container']}>
                {props.title && props.description && <div className={styles['simulation-description']}>
                    <div className={styles['simulation-description-title']}>{props.title}</div>
                    <div className={styles['simulation-description-content']}>
                        {props.description}
                    </div>
                </div>}
                <div className={styles['ising-graph-simulation-container']}>
                    <div className={styles['ising-graph-canvas-container-up']}>
                        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
                            <CanvasSimulation magnetization={magnetizationValue[0]} />
                        </ErrorBoundary>
                    </div>
                    <div ref={refCanvasParent} className={styles['ising-graph-canvas-container-svg']}>
                        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
                            <svg width={460} height={400} ref={refCanvas} />
                        </ErrorBoundary>
                    </div>
                    <div className={styles['ising-graph-canvas-container-down']}>
                        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
                            <CanvasSimulation magnetization={magnetizationValue[1]} />
                        </ErrorBoundary>
                    </div>
                    <div className={styles['ising-graphs-touch-icon']}>
                        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g fill="#aa51df" transform="translate(85.333333, 42.666667)">
                                <path
                                    d="M206.413257,215.447893 L206.413257,130.666667 C206.413257,99.7915733 181.28835,74.6666667 150.413257,74.6666667 C119.538163,74.6666667 94.4132566,99.7915733 94.4132566,130.666667 L94.4132566,250.096427 C84.0473899,241.401173 71.1085099,236.468907 57.5200299,236.468907 C41.3429632,236.468907 25.8116566,243.323093 14.9470166,255.281493 C-6.06205009,278.304853 -4.69501009,313.828267 17.6045099,335.429973 C17.6330966,335.45856 17.6435499,335.48992 17.6721366,335.518507 L112,426.666667 L320,426.666667 L320,250.666667 L206.413257,215.447893 Z M277.333333,384 C277.333333,384 128.393387,384 128,384 C128,384 53.2621099,313.552 45.9912832,306.927147 C37.7177899,299.39072 37.1202432,286.573013 44.6579499,278.29696 C52.1969366,270.023467 65.0146432,269.4272 73.2894166,276.963627 C78.8286166,282.010453 115.241417,312 115.241417,312 L131.74659,303.46624 L131.74659,130.666667 C131.74659,120.356693 140.104563,112 150.413257,112 C160.72323,112 169.079923,120.356693 169.079923,130.666667 L169.079923,248.541653 L277.333333,282.666667 L277.333333,384 Z M24.1438166,163.708373 C21.3728299,153.1328 19.7465899,142.098987 19.7465899,130.666667 C19.7465899,58.6250667 78.3612032,7.10542736e-15 150.413257,7.10542736e-15 C222.46531,7.10542736e-15 281.079923,58.6250667 281.079923,130.666667 C281.079923,142.098987 279.453683,153.1328 276.682697,163.708373 L236.211443,149.69792 C237.574643,143.552 238.413257,137.218773 238.413257,130.666667 C238.413257,82.1431467 198.936777,42.6666667 150.413257,42.6666667 C101.889737,42.6666667 62.4132566,82.1431467 62.4132566,130.666667 C62.4132566,137.218773 63.2518699,143.552 64.6150699,149.69792 L24.1438166,163.708373 Z"
                                    id="Shape">
                                </path>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    </>
}

