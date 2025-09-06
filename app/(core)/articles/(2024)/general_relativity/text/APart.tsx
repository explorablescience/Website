'use client'

import { useState } from 'react';
import styles from './APart.module.css'

/**
 * Paragraph of text.
 */
export function Paragraph(props: { children: React.ReactNode }) {
    return (
        <div className={`${styles["paragraph"]}`}>
            {props.children}
        </div>
    );
}

/**
 * A text with a background color.
 * @param color Background color
 */
export function Landmark(props: { color: string, children: React.ReactNode }) {
    return (
        <span className={`${styles["landmark"]} ${styles[`landmark-${props.color}`]}`}>
            {props.children}
        </span>
    );
}

/**
 * Changes the color of the text.
 */
export function Color(props: { color: string, children: React.ReactNode }) {
    return (
        <span className={`${styles["color"]} ${styles[`color-${props.color}`]}`}>
            {props.children}
        </span>
    );
}

/**
 * Horizontal space between paragraphs
 * @param s Size in pixels
 */
export function HSpace() {
    return (
        <>
            <br />
            <span className={`${styles["separator"]}`} />
        </>
    );
}

/**
 * Text citation.
 */
export function Cite(props: { children: React.ReactNode }) {
    return (
        <blockquote className={`${styles["blockquote"]}`}>
            {props.children}
        </blockquote>
    );
}

/**
 * Text note.
 */
export function Note(props: { children: React.ReactNode }) {
    return (
        <div className={`${styles["note"]}`}>
            {props.children}
        </div>
    );
}

/**
 * Text error box.
 */
export function Error(props: { children: React.ReactNode }) {
    return (
        <div className={`${styles["error"]}`}>
            {props.children}
        </div>
    );
}

/**
 * Underlined text.
 * @param href Optional link
 */
export function Underline(props: { children: React.ReactNode, href?: string }) {
    if (props.href === undefined) {
        return (
            <div className={`${styles["underline"]}`}>
                {props.children}
            </div>
        )
    }
    return (
        <div className={`${styles["underline"]} ${styles["underline-href"]}`}>
            <a href={props.href ?? "#"}>
                {props.children}
            </a>
        </div>
    )
}

/**
 * Overline an equation.
 */
export function EquationOverline(props: { children: React.ReactNode }) {
    return (
        <div className={`${styles["equation-overline"]}`}>
            {props.children}
        </div>
    )
}

/**
 * A part that needs to be expanded.
 */
export function Expandable(props: { children: React.ReactNode, title: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`${styles["expandable"]}`} style={{ height: expanded ? "auto" : "3rem" }}>
            <div className={`${styles["expandable-title"]}`} onClick={() => setExpanded(!expanded)}>
                <div className={`${styles["expandable-title-icon"]}`}>
                    {expanded && <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20">
                        <path fill="currentColor" d="M19 6.25l-1.5-1.5-7.5 7.5-7.5-7.5L1 6.25l9 9 9-9z"/>
                    </svg>}
                    {!expanded && <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" style={{transform: "rotate(90deg)"}}>
                        <path fill="currentColor" d="M19 6.25l-1.5-1.5-7.5 7.5-7.5-7.5L1 6.25l9 9 9-9z"/>
                    </svg>}
                </div>
                <div className={`${styles["expandable-title-text"]}`}>
                    {props.title}
                </div>
            </div>

            <div className={`${styles["expandable-box"]}`} style={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : "0px", overflow: "hidden" }}>
                {props.children}
            </div>
        </div>
    )
}

/**
 * Strong text.
 */
export function Strong(props: { children: React.ReactNode }) {
    return (
        <span className={`${styles["strong"]}`}>
            {props.children}
        </span>
    );
}
