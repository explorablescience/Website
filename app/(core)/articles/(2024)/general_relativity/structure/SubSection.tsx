'use client'

import React, { useContext, useEffect, useRef, useState } from 'react';
import { MathJax } from 'better-react-mathjax';
import { IsDesktop, ScrollAmount, SimulationSide } from './Section';
import Image from 'next/image';
import styles from './SubSection.module.css';

export default function SubSection(props: {
    children?: React.ReactNode,
    title: string,
    alignSimulation?: "left" | "right",
    simulation?: (props: { t: number; visible: boolean; isDesktop: boolean; }) => React.ReactNode,
}) {
    const isDesktop = useContext(IsDesktop);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [simulationPercentage, setSimulationPercentage] = useState(0);
    const [isShown, setIsShown] = useState(false);
    const [showAnchor, setShowAnchor] = useState(false);
    const [simulationSide] = useState<"left" | "right">(props.alignSimulation ?? "left");

    // Calculate scroll percentage of section
    
    useEffect(() => {
        if (isDesktop) {
            const handleScroll = () => {
                if (!contentRef.current) return;
                const rect = contentRef.current.getBoundingClientRect();
                const scrollPer = Math.max(0, Math.min(1,
                    -rect.top / (rect.height - window.innerHeight * 1.0)
                ));
                setScrollPercentage(scrollPer);

                const simPer = Math.max(0, Math.min(1,
                    (-rect.top + window.innerHeight * 0.5) / (rect.height - window.innerHeight * 0.6 + window.innerHeight * 0.5)
                ));
                setSimulationPercentage(simPer);
                

                if (document.body.scrollTop + window.innerHeight < rect.top) setIsShown(false);
                else if (document.body.scrollTop > rect.top + rect.height) setIsShown(false);
                else setIsShown(true);
            };
            setTimeout(handleScroll, 100);

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
        else {
            setScrollPercentage(1);
            setSimulationPercentage(1);

            if (!contentRef.current) return;
            const rect = contentRef.current.getBoundingClientRect();
            if (document.body.scrollTop + window.innerHeight < rect.top) setIsShown(false);
            else if (document.body.scrollTop > rect.top + rect.height) setIsShown(false);
            else setIsShown(true);
        }
    }, [isDesktop]);

    const sectionIndex = ("sub " + props.title).toLowerCase().replaceAll(' ', '-');
    const [currentUrl, setCurrentUrl] = useState("");
    useEffect(() => {
        setCurrentUrl(window.location.href.split("#")[0]);
    }, []);
    const simFunc: (props: { t: number; visible: boolean; isDesktop: boolean; }) => React.ReactNode = props.simulation ?? (() => <></>);

    return (
        <div ref={contentRef} className={`${styles['article-section-content']} ${props.alignSimulation == "left" ? styles['asim-content-left'] : styles['asim-content-right']}`}>
            <div className={`${styles['article-subsection']} ${props.alignSimulation == undefined ? styles['article-subsection-center'] : ""}`} id={sectionIndex}>
                <div className={styles['article-subsection-title']} onMouseEnter={() => setShowAnchor(true)} onMouseLeave={() => setShowAnchor(false)}>
                    <h3>
                        <span>{props.title}</span>
                        <a href={currentUrl + "#" + sectionIndex} className={
                            `anchor-click-sub ${showAnchor ? "anchor-click-sub-show" : ""}`
                        }>
                            <Image src="/articles/general_relativity/images/anchor.png" width={24} height={12} alt="Anchor" />
                        </a>
                    </h3>
                </div>

                <div className="article-subsection-content">
                    <MathJax>
                        {props.children}
                    </MathJax>
                </div>
            </div>

            <SimulationSide.Provider value={simulationSide}>
                <ScrollAmount.Provider value={scrollPercentage}>
                    {simFunc({ t: simulationPercentage, visible: isShown, isDesktop: isDesktop })}
                </ScrollAmount.Provider>
            </SimulationSide.Provider>
        </div>
    );
}