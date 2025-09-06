'use client';

import React, { useContext } from 'react';
import { SimulationSide } from './Section';
import styles from './Section.module.css'

export default function TextContent(props: {
    children?: React.ReactNode,
}) {
    // Get simulation side from context
    const simulationSide = useContext(SimulationSide);

    return (
        <div className={`${styles['article-text']} ${simulationSide == "left" ? styles['article-text-left'] : styles['article-text-right']}`}>
            {props.children}
        </div>
    );
}