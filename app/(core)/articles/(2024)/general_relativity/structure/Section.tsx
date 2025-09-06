'use client'

import React, { createContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from './Section.module.css'

const sectionNumList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// True if the screen is wider a desktop (> 1120px)
export const IsDesktop = createContext(true);

// Context for scroll percentage of section
export const ScrollAmount = createContext(0);

// Has this section the text on the left or right?
export const SimulationSide = createContext<"left" | "right">("left");

export default function Section(props: {
    children?: React.ReactNode,
    index: number,
    title: string,
}) {
    const [showAnchor, setShowAnchor] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        setIsDesktop(window.innerWidth > 1120);
    }, []);
    
    const sectionIndex = (sectionNumList[props.index - 1] + " " + props.title).toLowerCase().replaceAll(' ', '-');
    const [currentUrl, setCurrentUrl] = useState("");
    useEffect(() => {
        setCurrentUrl(window.location.href.split("#")[0]);
    }, []);
    return (
        <section id={sectionIndex} className={`${styles["article-section"]}`}>
            <div className={`${styles["article-section-title"]}`}>
                <hr className={`${styles["ast-hr-title"]}`} />
                <h2 className={`${styles["ast-h2-1"]}`}><span className={`${styles["ast-num"]}`}>Section {sectionNumList[props.index - 1]}</span></h2><br />
                <h2 className={`${styles["ast-h2-2"]}`} onMouseEnter={() => setShowAnchor(true)} onMouseLeave={() => setShowAnchor(false)}>
                    <span className={`${styles["ast-text"]}`}>{props.title}</span>
                    <a href={currentUrl + "#" + sectionIndex} className={
                        "anchor-click " + (showAnchor ? "anchor-click-show" : "")
                    }>
                        <Image src="/articles/general_relativity/images/anchor.png" width={32} height={16} alt="Anchor" />
                    </a>
                </h2>
                <hr />
            </div>

            <IsDesktop.Provider value={isDesktop}>
                {props.children}
            </IsDesktop.Provider>
        </section>
    );
}
