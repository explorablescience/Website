import { Html, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import styles from './SimulationCanvas.module.css';
import icon_3d from './assets/icon_3d.svg';
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import errorStyles from './SimulationError.module.css';

import type { FallbackProps } from "react-error-boundary";
import { onReactError } from "@/app/api/client/logger";

function ErrorDOM({ resetErrorBoundary }: FallbackProps) {
    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulation.</p>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>;
}

function LoaderDOM() {
    return <div className={styles['loading-simulation']}>Loading simulation....</div>
}

function LoaderCanvas() {
    const { progress } = useProgress();
    const progressFormatted = Math.round(progress);
    return <Html center style={{
        fontFamily: "'Railway', 'Montserrat', Arial'",
        color: 'black',
        fontSize: '30px',
        width: 'max-content'
    }}>Loading simulation... {progressFormatted}% done.</Html>;
}

export function SimulationCanvas(props: {
    visible: boolean; // True if the simulation is visible
    aspectRatio?: string; canvasRef?: React.RefObject<HTMLCanvasElement | null>;
    show3DIcon?: boolean; children: React.ReactNode;
    customErrorComponent?: React.ComponentType<FallbackProps>;
    is2D?: boolean; // Optional prop to indicate if the simulation is 2D
}) {
    const show3DIcon = props.show3DIcon != false && !props.is2D; // Default to true if not specified and not a 2D simulation

    return <>
        <ErrorBoundary FallbackComponent={props.customErrorComponent || ErrorDOM} onError={onReactError}>
            <Suspense fallback={<LoaderDOM />}>
                <div className={styles['simulation-canvas-container']} style={{ aspectRatio: props.aspectRatio || '16/9' }}>
                    <div className={styles['simulation-canvas-icon']}>
                        {show3DIcon && <Image src={icon_3d} className={styles['icon-3d']} alt="3D Icon" />}
                    </div>
                    {!props.is2D && <Canvas frameloop={props.visible ? 'always' : 'never'} ref={props.canvasRef} className={styles['simulation-canvas']} shadows resize={{ scroll: false }} style={{ cursor: show3DIcon ? 'move' : 'default' }}>
                        <Suspense fallback={<LoaderCanvas />}>
                            <group name="core">
                                {props.children}
                            </group>
                        </Suspense>
                    </Canvas>}
                    {props.is2D && <canvas className={styles['simulation-canvas']} ref={props.canvasRef} />}
                </div>
            </Suspense>
        </ErrorBoundary>
    </>
}
