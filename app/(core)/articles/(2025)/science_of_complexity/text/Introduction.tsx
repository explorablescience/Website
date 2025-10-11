import { Paragraph, Part } from "../logic/text/Article";
import { Separator } from "../logic/text/TextEffects";
import { Magnet } from "./Part1";
import { Firefly } from "./Part2";
import { Fish } from "./Part3";
import author from "./assets/author.png"
import Image from "next/image";
import styles from "./Introduction.module.css"

function Widgets() {
    function copyLinkToClipboard() {
        navigator.clipboard.writeText(window.location.href);
    }

    return <>
        <div className={styles['header-widgets']}>
            <div className={styles['header-widgets-left']}>
                <div className={styles['hwl-photo']}>
                    <Image src={author} alt="Author" />
                </div>
                <div className={styles['hwl-info']}>
                    <div className={styles['hwl-info-name']}>Maxime Dherbécourt</div>
                    <div className={styles['hwl-info-desc']}>
                        <div className={styles['hwl-info-desc-up']}>
                            <div className={styles['hwl-info-text']}>26 August 2025</div>
                            <a className={styles['hwr-link-up']} onClick={() => copyLinkToClipboard()}>
                                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier"></g>
                                    <g id="SVGRepo_tracerCarrier"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M7.05025 1.53553C8.03344 0.552348 9.36692 0 10.7574 0C13.6528 0 16 2.34721 16 5.24264C16 6.63308 15.4477 7.96656 14.4645 8.94975L12.4142 11L11 9.58579L13.0503 7.53553C13.6584 6.92742 14 6.10264 14 5.24264C14 3.45178 12.5482 2 10.7574 2C9.89736 2 9.07258 2.34163 8.46447 2.94975L6.41421 5L5 3.58579L7.05025 1.53553Z" fill="#000000"></path>
                                        <path d="M7.53553 13.0503L9.58579 11L11 12.4142L8.94975 14.4645C7.96656 15.4477 6.63308 16 5.24264 16C2.34721 16 0 13.6528 0 10.7574C0 9.36693 0.552347 8.03344 1.53553 7.05025L3.58579 5L5 6.41421L2.94975 8.46447C2.34163 9.07258 2 9.89736 2 10.7574C2 12.5482 3.45178 14 5.24264 14C6.10264 14 6.92742 13.6584 7.53553 13.0503Z" fill="#000000"></path>
                                        <path d="M5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071Z" fill="#000000"></path>
                                    </g>
                                </svg>
                            </a>
                        </div>
                        <span>&bull;</span>
                        <div className={styles['hwl-info-text']}>25 minutes read</div>
                        <span>&bull;</span>
                        <div className={styles['header-widgets-right']}>
                            <a className={styles['hwr-link']} onClick={() => copyLinkToClipboard()}>
                                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier"></g>
                                    <g id="SVGRepo_tracerCarrier"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M7.05025 1.53553C8.03344 0.552348 9.36692 0 10.7574 0C13.6528 0 16 2.34721 16 5.24264C16 6.63308 15.4477 7.96656 14.4645 8.94975L12.4142 11L11 9.58579L13.0503 7.53553C13.6584 6.92742 14 6.10264 14 5.24264C14 3.45178 12.5482 2 10.7574 2C9.89736 2 9.07258 2.34163 8.46447 2.94975L6.41421 5L5 3.58579L7.05025 1.53553Z" fill="#000000"></path>
                                        <path d="M7.53553 13.0503L9.58579 11L11 12.4142L8.94975 14.4645C7.96656 15.4477 6.63308 16 5.24264 16C2.34721 16 0 13.6528 0 10.7574C0 9.36693 0.552347 8.03344 1.53553 7.05025L3.58579 5L5 6.41421L2.94975 8.46447C2.34163 9.07258 2 9.89736 2 10.7574C2 12.5482 3.45178 14 5.24264 14C6.10264 14 6.92742 13.6584 7.53553 13.0503Z" fill="#000000"></path>
                                        <path d="M5.70711 11.7071L11.7071 5.70711L10.2929 4.29289L4.29289 10.2929L5.70711 11.7071Z" fill="#000000"></path>
                                    </g>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

function ErrorComponentTest() {
    throw new Error("Test error component");
    return <></>;
}

export function Introduction() {
    return <>
        <Part title="introduction" hideTitle>
            <div style={{ height: '20px', marginTop: '50px' }} />
            <Widgets />
            <Separator style={{ margin: "30px auto" }} />
            <Paragraph>
                On a summer night, you lie in a field looking at <Firefly italic bold>fireflies</Firefly> lighting up the sky. At first, their flashes seem random, <i>erratic</i>. But wait long enough, and you see magic happening: these tiny lanterns start to pulse <strong>in unison</strong>, creating waves of light that ripple through the darkness.
                <br /><div style={{ height: "13px" }}></div>
                Not far from here, <Fish italic bold>school of fishes</Fish> swim through the seas with a similar grace. Each fish moves independently, yet together they form fluid, <strong>coordinated</strong> pattern, almost like a dance.
                <br /><div style={{ height: "13px" }}></div>
                And back in your own hands, even a simple <Magnet italic bold>magnet</Magnet> carries these mysteries: countless atoms inside <strong>cooperate</strong> to create a single, unified magnetism.
            </Paragraph>
            <Paragraph>
                <i>What ties these scenes together?</i> How does order emerge, where we only expect disorder to happen? <i>This</i>, is the story I want to tell you.
                <br /><div style={{ height: "13px" }}></div>
                But there's also a <i>second story</i>, one just as important: how <Fish italic bold>theory</Fish> itself is <Fish italic bold>built</Fish>. We often picture scientists as people who know every answer there is. In reality, theory is a slow and complex process: you build a model, test it against the world, find where it fails, and refine it again. It takes time, patience, and imagination. So let yourself be guided along this article, <strong>ask yourself questions when proposed to</strong>, and step by step you'll discover <i>how science is crafted</i>.
            </Paragraph>
            <Paragraph>
                By the end of this journey, you won't just see <Magnet italic>magnets</Magnet>, <Firefly italic bold>fireflies</Firefly>, and <Fish italic bold>fishes</Fish> differently. You will see patterns, and most importantly, <strong>know why</strong> they happen. You'll also see how <strong>theorists</strong>, <i>and especially physicists</i>, think, and why their work often unfolds in <i>small</i>, <i>steady steps</i> rather than sudden leaps.
                <br /><div style={{ height: "13px" }}></div>
                And without any longer introduction, let's begin.
            </Paragraph>
            <ErrorComponentTest />
        </Part>
    </>;
}
