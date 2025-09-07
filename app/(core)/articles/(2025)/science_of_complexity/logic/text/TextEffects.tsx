'use client'

import { JSX, useRef, useState } from 'react';
import './TextEffects.css';
import quote_open from './assets/quote_open.svg';
import quote_closed from './assets/quote_closed.svg';
import { MathJax } from 'better-react-mathjax';
import { Paragraph } from './Article';
import Image from 'next/image';

const ASidesData = {
    question: {
        svg: {
            viewBox: "0 0 1024 1024",
            paths: ["M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z", "M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7c0-19.7 12.4-37.7 30.9-44.8 59-22.7 97.1-74.7 97.1-132.5 0.1-39.3-17.1-76-48.3-103.3z", "M512 732m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"]
        },
        title: "Question",
        color: "#746cc0"
    },
    note: {
        svg: {
            viewBox: "0 0 1024 1024",
            paths: ["M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z", "M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z", "M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"]
        },
        title: "Note",
        color: "#4b4b4b"
    }
}

export function Question(props: JSX.IntrinsicElements['div']) {
    return <ASide {...props} data={ASidesData.question}>{props.children}</ASide>
}

export function Note(props: JSX.IntrinsicElements['div']) {
    return <ASide {...props} data={ASidesData.note}>{props.children}</ASide>
}

export function ASide(props: JSX.IntrinsicElements['div'] & { data: typeof ASidesData[keyof typeof ASidesData] }) {
    const data = props.data;
    return (
        <div className={`aside ${data.title.toLowerCase()}`} style={{ borderLeft: `4px solid ${data.color}` }}>
            <div className="aside-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={data.svg.viewBox} fill={data.color}>
                    {data.svg.paths.map((path, index) => (
                        <path key={index} d={path} />
                    ))}
                </svg>
                <span style={{ color: data.color }}>{data.title}</span>
            </div>
            <div className="aside-content">
                {props.children}
            </div>
        </div>
    );
}

export function Citation(props: JSX.IntrinsicElements['div']) {
    return (
        <div className="citation">
            <div className="citation-left">
                <Image src={quote_open} alt="Open quote" />
            </div>
            <div className="citation-text">
                {props.children}
            </div>
            <div className="citation-right">
                <Image src={quote_closed} alt="Close quote" />
            </div>
        </div>
    );
}

export function IColor(props: { type: string, bold?: boolean, italic?: boolean, children: React.ReactNode }) {
    return <>
        <span className={`text-color-${props.type} ${props.bold ? 'text-color-bold' : ''} ${props.italic ? 'text-color-italic' : ''}`}>
            {props.children}
        </span>
    </>
}

export function VSpace() {
    return <div style={{ height: "4px" }} />;
}

export function GradientText(props: { from: [number, number, number], to: [number, number, number], bold?: boolean, italic?: boolean, children: string }) {
    const gradientLetters = [];
    const interpolateColor = (from: [number, number, number], to: [number, number, number], factor: number) => {
        return [
            Math.round(from[0] + (to[0] - from[0]) * factor),
            Math.round(from[1] + (to[1] - from[1]) * factor),
            Math.round(from[2] + (to[2] - from[2]) * factor),
        ];
    };
    for (let i = 0; i < props.children.length; i++) {
        const char = props.children[i];
        const color = `rgba(${interpolateColor(props.from, props.to, i / props.children.length)[0]}, ${interpolateColor(props.from, props.to, i / props.children.length)[1]}, ${interpolateColor(props.from, props.to, i / props.children.length)[2]}, 1)`;
        gradientLetters.push(
            <span key={i} style={{ color: color }}>
                {char}
            </span>
        );
    }
    return (
        <span className={`gradient-text ${props.bold ? "gradient-text-bold" : ""} ${props.italic ? "gradient-text-italic" : ""}`}>
            {gradientLetters}
        </span>
    );
}




export function MoreInformations(props: { title: string, children: React.ReactNode }) {
    const moreInfosRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const expandToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <section className="more-informations">
            <div className="more-informations-title">
                <div className="more-informations-label">
                    <span>For more informations...</span>
                </div>
                <h3 className="more-informations-title-content">{props.title}</h3>
                <div className="more-informations-icon" onClick={expandToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.3s ease-in-out" }}>
                        <path fill="currentColor" d="M19 6.25l-1.5-1.5-7.5 7.5-7.5-7.5L1 6.25l9 9 9-9z"></path>
                    </svg>
                </div>
            </div>
            {isExpanded && <div className="more-informations-bar" />}
            <div className={`more-informations-content ${isExpanded ? "more-informations-content-open" : ""}`} ref={moreInfosRef} style={{ height: isExpanded ? `100%` : "0px" }}>
                {props.children}
            </div>
        </section>
    );
}

export function TheoristQuestions(props: { children: React.ReactNode }) {
    return (
        <section className="theorist-questions">
            <div className="theorist-questions-title-bar theorist-questions-title-bar-up"></div>
            <div className="theorist-questions-title">
                <div className="theorist-questions-title-content">Theorist Corner</div>
            </div>
            <div className="theorist-questions-content">
                {props.children}
            </div>
            <div className="theorist-questions-title-bar theorist-questions-title-bar-down"></div>
        </section>
    );
}

export function Separator(props: JSX.IntrinsicElements['div']) {
    return <div className="separator" {...props} />;
}

export function CheckList(props: { items: { label: string, checked: boolean, description?: string }[] }) {
    const items = [];
    for (const item of props.items) {
        const color = item.checked ? '#2eb632' : '#ff5151';
        items.push(
            <li key={item.label} className="checkbox-item">
                <div className={item.checked ? 'checkbox-yes' : 'checkbox-no'}>
                    {item.checked ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM404.4 268.7L324.4 396.7C320.2 403.4 313 407.6 305.1 408C297.2 408.4 289.6 404.8 284.9 398.4L236.9 334.4C228.9 323.8 231.1 308.8 241.7 300.8C252.3 292.8 267.3 295 275.3 305.6L302.3 341.6L363.7 243.3C370.7 232.1 385.5 228.6 396.8 235.7C408.1 242.8 411.5 257.5 404.4 268.8z" /></svg> : <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM9.76 20.256q0 0.832 0.576 1.408t1.44 0.608 1.408-0.608l2.816-2.816 2.816 2.816q0.576 0.608 1.408 0.608t1.44-0.608 0.576-1.408-0.576-1.408l-2.848-2.848 2.848-2.816q0.576-0.576 0.576-1.408t-0.576-1.408-1.44-0.608-1.408 0.608l-2.816 2.816-2.816-2.816q-0.576-0.608-1.408-0.608t-1.44 0.608-0.576 1.408 0.576 1.408l2.848 2.816-2.848 2.848q-0.576 0.576-0.576 1.408z"></path></svg>}
                </div>
                <div>
                    {!item.checked && <div className="crossbar" />}
                    <span style={{ color }}>{item.label}</span>
                    {item.description && <span className="description"> - <i>{item.description}</i></span>}
                </div>
            </li>
        );
    }
    return <>
        <ul>
            {items}
        </ul>
    </>
}

export function IMath(props: { children: string, type?: string }) {
    if (!props.type) {
        return <MathJax inline>{`\$${props.children}\$`}</MathJax>;
    }
    return <IColor type={props.type}><MathJax inline>{`\$${props.children}\$`}</MathJax></IColor>;
}

export function GraphList(props: { items: JSX.Element[], customWidth?: { arrow: string, bar: string } }) {
    return <>
        <div className="graph-list">
            <div className="graph-list-arrow" style={props.customWidth ? { width: props.customWidth.arrow } : {}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill={"#6a5ff7"}>
                    <polygon points="50 15, 100 100, 0 100" />
                </svg>
            </div>
            <div className="graph-list-bar" style={props.customWidth ? { width: props.customWidth.bar } : {}}></div>
            <ol>
                {props.items.map((item, index) => (
                    <li key={index} className="graph-list-item">
                        {item}
                    </li>
                ))}
            </ol>
        </div>
    </>
}

export function Sources(props: { list: [string, string, string][] }) {
    const moreInfosRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const expandToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <section className="more-informations">
            <div className="more-informations-title">
                <div className="more-informations-label">
                    <span></span>
                </div>
                <h3 className="more-informations-title-content">Sources</h3>
                <div className="more-informations-icon" onClick={expandToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.3s ease-in-out" }}>
                        <path fill="currentColor" d="M19 6.25l-1.5-1.5-7.5 7.5-7.5-7.5L1 6.25l9 9 9-9z"></path>
                    </svg>
                </div>
            </div>
            {isExpanded && <div className="more-informations-bar" />}
            <div className={`more-informations-content ${isExpanded ? "more-informations-content-open" : ""}`} ref={moreInfosRef} style={{ height: isExpanded ? `100%` : "0px" }}>
                <Paragraph>
                    <ul>
                        {props.list.map(([title, link, description], index) => (
                            <li key={index} className="source-item">
                                <div className="source-item-content">
                                    <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
                                    <p>{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Paragraph>
                
            </div>
        </section>
    );
}

