'use client';

import { Header } from "./text/Header";
import { Article } from "./logic/text/Article";
import { CommentsForm } from "./text/CommentsForm";
import { Conclusion } from "./text/Conclusion";
import { Introduction } from "./text/Introduction";
import { Part1 } from "./text/Part1";
import { Part2 } from "./text/Part2";
import { Part3 } from "./text/Part3";
import './page.module.css'
import { ReactNode, useLayoutEffect, useState } from "react";
import { MathJaxContext } from "better-react-mathjax";

const DefaultOnSSR: React.FC = () => null

export const NoSSR: React.FC<{ children: ReactNode; onSSR?: ReactNode }> = ({ children, onSSR = <DefaultOnSSR /> }) => {
    const [onBrowser, setOnBrowser] = useState(false)
    useLayoutEffect(() => {
        setOnBrowser(true)
    }, [])
    return <>{onBrowser ? children : onSSR}</>
}

export default function ScienceComplexityApp() {
    // Custom MathJax macros
    const macros = {
        // Color text
        color: ['\\class{texcolor-#1}{#2}', 2],
    };
    
    return <NoSSR>
        <MathJaxContext config={{
            loader: { load: ['[tex]/html'] },
            tex: {
                inlineMath: [['$', '$']],
                macros: macros
            },
            options: {
                renderActions: {
                    addMenu: []
                }
            }
        }}>
            <Article>
                <Header />
                <Introduction />
                <Part1 />
                <Part2 />
                <Part3 />
                <Conclusion />
                <CommentsForm />
            </Article>
        </MathJaxContext>
    </NoSSR>
}