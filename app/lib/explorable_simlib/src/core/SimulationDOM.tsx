'use client'

import logger, { onReactError } from "@/app/api/client/logger";
import { createRef, JSX, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { Checkbox, CheckboxParams } from "../controls/Checkbox";
import { SSlider, SliderParams } from "../controls/Slider";
import { SimContext, RenderContext, SimulationState, SimulationInstance } from "./Simulation";
import { useIsVisible } from "./useIsVisible";
import styles from "./ISimulation.module.css";

function ErrorDOM() {
    const { resetBoundary } = useErrorBoundary();
    return <>
        <div className={styles['error-simulation']}>
            <p>Something went wrong with the simulation.</p>
            <button onClick={resetBoundary}>Try again</button>
        </div>
    </>;
}

function LoaderDOM() {
    return <div className={styles['loading-simulation']}>Loading simulation...</div>
}

/**
 * Renders a simulation instance within a DOM structure, including canvas and controls.
 * @param title Title of the simulation. Can be a string or JSX element.
 * @param description Short description of the simulation. Can be a string or JSX element. Usually, wrapped in a <Paragraph>.
 * @param simulation The simulation instance to render.
 * @returns A JSX element containing the simulation DOM structure.
 */
export function SimulationDOM({ title, description, simulation }: {
    title?: string | JSX.Element;
    description?: string | JSX.Element;
    simulation: SimulationInstance<SimulationState>;
}) {
    const simulationContainerRef = createRef<HTMLDivElement>();
    const [visible, setVisible] = useState(false);
    useIsVisible(simulationContainerRef, (v) => setVisible(v));

    // Create controls and bind their events to the simulation instance
    const controls = simulation.controlsType.map((control) => <div key={control.id} style={{ marginBottom: '8px' }}>
        {/* Render control based on its type */}
        {control.type === 'slider' ? (
            <SSlider control={control as SliderParams} />
        ) : control.type === 'checkbox' ? (
            <Checkbox control={control as CheckboxParams} />
        ) : null}
    </div>);

    // Initialize simulation state
    const initialState = useMemo<SimulationState>(() => simulation.init(), [simulation]);
    const state = useRef<SimulationState>(initialState);

    // Main simulation loop
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        // If not visible, do not run the simulation
        if (!visible) return;

        // Get canvas
        const canvas = canvasRef.current;
        if (!canvas) logger.error(new Error("Couldn't get canvas reference."));
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
        if (!context) logger.error(new Error("Couldn't get canvas context."));
        const ctx = context!;

        // Performance settings
        const MAX_UPDATE_FPS = 120;
        const MAX_RENDER_FPS = 60;
        let lastTime = performance.now();
        let lastUpdateTime = lastTime;
        let lastRenderTime = lastTime;

        let animationFrameId: number;
        const loop = (time: number) => {
            lastTime = time;

            // Update
            const sinceLastUpdate = time - lastUpdateTime;
            if (sinceLastUpdate >= 1000 / MAX_UPDATE_FPS) {
                const dt = sinceLastUpdate / 1000;
                const simContext: SimContext = {
                    t: time / 1000,
                    dt,
                    controls: simulation.controlValues,
                    state: state.current,
                };
                state.current = simulation.update(simContext);
                lastUpdateTime = time;
            }

            // Render
            const sinceLastRender = time - lastRenderTime;
            if (sinceLastRender >= 1000 / MAX_RENDER_FPS) {
                const dt = sinceLastRender / 1000;
                const renderContext: RenderContext = {
                    size: { width: cv.width, height: cv.height },
                    canvas: cv,
                    ctx,
                };
                ctx.clearRect(0, 0, cv.width, cv.height);
                simulation.render({ t: time / 1000, dt, controls: simulation.controlValues, state: state.current }, renderContext);
                lastRenderTime = time;
            }

            // Request next frame
            animationFrameId = requestAnimationFrame(loop);
        };
        loop(lastTime);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, simulation, visible]);

    return <>
        <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
            <div id={`simulation-container-${simulation.id}`} className={styles['simulation-container']} ref={simulationContainerRef}>
                {/* Description */}
                {description && <div className={styles['simulation-description']}>
                    <div className={styles['simulation-description-title']}>{title}</div>
                    <div className={styles['simulation-description-content']}>{description}</div>
                </div>}

                {/* Canvas */}
                <ErrorBoundary FallbackComponent={ErrorDOM} onError={onReactError}>
                    <Suspense fallback={<LoaderDOM />}>
                        <div className={styles['simulation-canvas-container']} style={{ aspectRatio: '16/9' }}>
                            <canvas id={`simulation-canvas-${simulation.id}`} className={styles['simulation-canvas']} ref={canvasRef} />
                        </div>
                    </Suspense>
                </ErrorBoundary>

                {/* Controls */}
                <div id={`simulation-controls-${simulation.id}`}>
                    {controls}
                </div>
            </div>
        </ErrorBoundary>
    </>;
}
