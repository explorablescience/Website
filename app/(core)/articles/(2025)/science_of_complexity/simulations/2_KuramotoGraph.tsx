'use client'

import * as d3 from "d3";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import logError from "../logic/api_manager";
import styles from './2_KuramotoGraph.module.css';
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { FirefliesSynchronisation } from "./2_FirefliesSynchronisation";
import errorStyles from '../logic/simulations/SimulationError.module.css';

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

function setSVG(refCanvas: React.RefObject<SVGSVGElement | null>, refCanvasParent: React.RefObject<HTMLDivElement | null>, setSynchronisationValue: (value: number) => void) {
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
    const func = (x: number) => {
        if (x > 1.0) {
            const xl = (x - 1.0) * 0.8 - 1; // Scale to [0, 1]
            return Math.sqrt(1 - xl * xl);
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
        .domain([-0.05, 1.05])
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
        .attr("fill", "#12a02a")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Interaction strength");

    // Y Axis Label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("fill", "#2c2c2cff")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .text("Synchronisation amount");

    // Plot data
    const line = d3
        .line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y));
    svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#2c2c2cff")
        .attr("stroke-width", 4.5)
        .attr("d", line(d3.range(0, 2, 0.001).map((x) => ({ x: x, y: func(x) }))));

    // Add a transparent rect over the axis area
    const mx = 200;
    const xValue = x.invert(mx);
    const circleRef = svg.append("circle")
        .attr("class", "hover-point")
        .attr("display", "none")
        .attr("r", 8)
        .attr("fill", "#12a02a")
        .attr("display", "unset")
        .attr("cx", mx)
        .attr("cy", y(func(xValue)));
    setSynchronisationValue(func(xValue));
    const hoverLine = svg.append("line")
        .attr("class", "hover-line")
        .attr("stroke", "#12a02a")
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

            // Plot circle
            if (yValue >= -1 && yValue <= 1) {
                const xValue = x.invert(mx);
                hoverLine
                    .attr("x1", mx)
                    .attr("y1", 0)
                    .attr("x2", mx)
                    .attr("y2", height);
                const yValue = func(xValue);
                circleRef
                    .attr("display", "unset")
                    .attr("cx", mx)
                    .attr("cy", y(yValue));
                setSynchronisationValue(yValue < 0.001 ? Math.random() * 0.00001 : yValue);
            }
        });
}

export function KuramotoGraph(props: { title?: string, description?: JSX.Element }) {
    const refCanvasParent = useRef<HTMLDivElement>(null);
    const refCanvas = useRef<SVGSVGElement>(null);
    const [synchronisation, setSynchronisationValue] = useState(0);
    const ffSync = useMemo(() => {
        return <FirefliesSynchronisation showSliders={false} omegaActivated={true} fakeSynchronisation={synchronisation} />;
    }, [synchronisation]);

    // Set up the SVG
    useEffect(() => {
        setSVG(refCanvas, refCanvasParent, setSynchronisationValue);
    }, [refCanvas]);

    // HTML Content
    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
            <div className={styles['kuramoto-simulation-container']}>
                {props.title && props.description && <div className={styles['simulation-description']}>
                    <div className={styles['simulation-description-title']}>{props.title}</div>
                    <div className={styles['simulation-description-content']}>
                        {props.description}
                    </div>
                </div>}
                <div className={styles['kuramoto-graph-simulation-container']}>
                    <div ref={refCanvasParent} className={styles['kuramoto-graph-canvas-container-svg']}>
                        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
                            <svg width={460} height={400} ref={refCanvas} />
                        </ErrorBoundary>
                    </div>
                    <div className={styles['kuramoto-graph-canvas-container']}>
                        <ErrorBoundary FallbackComponent={ErrorDOM} onError={logError}>
                            { ffSync }
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    </>
}

