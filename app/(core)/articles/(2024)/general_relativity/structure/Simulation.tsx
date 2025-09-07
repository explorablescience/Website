'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { IsDesktop, ScrollAmount, SimulationSide } from './Section';
import { useInView } from "react-intersection-observer";
import styles from './Section.module.css'
import { ErrorBoundary } from "react-error-boundary";

export default function Simulation(props: {
    children?: React.ReactNode,
}) {
    // If canvas is in view
    const { ref, inView } = useInView();

    // Get scroll percentage and simulation side from context
    const isDesktop = useContext(IsDesktop);
    const scrollPercentage = useContext(ScrollAmount);
    const simulationSide = useContext(SimulationSide);

    // Calculate elements bounding boxes
    const articleRef = useRef<HTMLDivElement>(null);
    const [cssType, setCssType] = useState(1); // 0: top, 1: fixed, 2: bottom
    useEffect(() => {
        const elementBoundingBox = articleRef.current?.getBoundingClientRect();
        const parentBoundingBox = articleRef.current?.parentElement?.getBoundingClientRect();

        // Find canvas css type
        setCssType(1);
        if (scrollPercentage == 0 && isDesktop) // User scrolling before
            setCssType(0);
        else if (scrollPercentage == 1 && isDesktop) { // User scrolling after
            const topPixels = (parentBoundingBox?.height ?? 0) - (elementBoundingBox?.height ?? 0);
            articleRef.current?.style.setProperty("margin-top", topPixels + "px");
            setCssType(2);
        }
    }, [scrollPercentage, isDesktop]);

    // Get and set client dimensions
    const [clientDim, setClientDim] = useState({ width: 0, height: 0 });
    useEffect(() => {
        setClientDim({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        });
    }, []);

    return (
        <ErrorBoundary fallback={<div style={{ width: (isDesktop ? "654px" : clientDim.width * 0.9 + "px"), height: clientDim.height * (isDesktop ? 1.0 : 0.6), display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#111111', color: 'white' }}>
            <p>Failed to load the 3D simulation.</p>
        </div>}>
            <div ref={articleRef} className={`${(simulationSide == "left" ? styles['article-simulation-left'] : styles['article-simulation-right'])} ${(cssType == 0 ? styles['asim-top'] : cssType == 1 ? styles['asim-fixed'] : (simulationSide == "right" ? styles['asim-bottom-left'] : styles['asim-bottom-right']))}`}>
                <div ref={ref} style={{
                    width: (isDesktop ? "654px" : clientDim.width * 0.9 + "px"),
                    height: clientDim.height * (isDesktop ? 1.0 : 0.6)
                }}>
                    <Canvas shadows resize={{ scroll: false }}>
                        <Suspense fallback={null}>
                            <group position={[0, -1.5, 0]} scale={[1, 1, 1]}>
                                {inView && props.children}
                            </group>
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </ErrorBoundary>
    );
}
