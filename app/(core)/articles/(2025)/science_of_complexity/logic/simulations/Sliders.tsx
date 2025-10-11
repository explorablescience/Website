'use client'

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Sliders.module.css";

export function SimulationControls(props: JSX.IntrinsicElements['div']) {
    return (
        <div className={styles['simulation-controls']}>
            {props.children}
        </div>
    );
}

export function Slider(props: {
    label: string | JSX.Element;
    value: number;
    onChange: (value: number) => void;
    onFocusStart?: () => void;
    onFocusEnd?: () => void;
    min: number;
    max: number;
    step: number;
    color?: string; // Optional color for the slider
    displayValue?: boolean; // Whether to display the current value
}) {
    const barRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const getPercentage = (value: number) => ((value - props.min) / (props.max - props.min)) * 100;

    const updateValueFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
        const clamp = (value: number) => Math.max(props.min, Math.min(props.max, value));

        if (!barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();

        // Calculate position based on event type
        let clientX: number;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        } else {
            clientX = e.touches[0].clientX;
        }

        // If too far, release the mouse status
        if (clientX < rect.left || clientX > rect.right) {
            setIsDragging(false);
            props.onFocusEnd?.();
            return;
        }
        
        // Convert to slider coordinates
        const val_normalized = clamp((clientX - rect.left) / rect.width);
        const value = props.min + val_normalized * (props.max - props.min);

        // Update the value based on the mouse position
        props.onChange(value);
    }, [props]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        props.onFocusStart?.();
        updateValueFromEvent(e.nativeEvent);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        props.onFocusStart?.();
        updateValueFromEvent(e.nativeEvent);
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging) {
                updateValueFromEvent(e);
            }
        };
        const handleUp = () => {
            setIsDragging(false);
            props.onFocusEnd?.();
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", handleUp);
            window.addEventListener("touchmove", handleMove, { passive: false });
            window.addEventListener("touchend", handleUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", handleUp);
        };
    }, [isDragging, props, updateValueFromEvent]);

    return (
        <div className={styles['simulation-slider']}
            onMouseDown={handleMouseDown}>
            <div className={styles['sim-slider-label']}><p style={{ color: props.color || "#447997" }}>{props.label}</p></div>
            <div className={styles['simulation-slider-bar-container']}>
                <div
                    className={styles['simulation-slider-bar']}
                    ref={barRef}
                    onTouchStart={handleTouchStart}>
                    <div className={styles['sim-slider-left-gutter']} style={{ width: `${getPercentage(props.value)}%`, background: props.color || "#447997" }}></div>
                    <div className={styles['sim-slider-right-gutter']} style={{ width: `${100.0 - getPercentage(props.value)}%`, left: `${getPercentage(props.value)}%` }}></div>
                    <div
                        className={styles['sim-slider-knob']}
                        style={{ left: `${getPercentage(props.value)}%` }}>
                        <div className={styles['sim-slider-knob-inner']} style={{ background: props.color || "#447997" }}></div>
                    </div>
                </div>
            </div>
            {props.displayValue && <div className={styles['sim-slider-value']}><p>{props.value.toFixed(2)}</p></div>}
        </div>
    );
}
