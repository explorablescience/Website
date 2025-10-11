'use client';

import { Header } from "./text/Header";
import { Article } from "./logic/text/Article";
import { CommentsForm } from "./text/CommentsForm";
import { Conclusion } from "./text/Conclusion";
import { Introduction } from "./text/Introduction";
import { Part1 } from "./text/Part1";
import { Part2 } from "./text/Part2";
import { Part3 } from "./text/Part3";
import styles from './page.module.css'
import { MathJaxContext } from "better-react-mathjax";

export default function ScienceComplexityApp() {
    // Custom MathJax macros
    const macros = {
        // Color text
        color: [`\\class{soc-texcolor-#1}{#2}`, 2],
    };
    
    return <>
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
            <style jsx global>
                {`.soc-texcolor-magnet {
                    color: #aa51df;
                }

                .soc-texcolor-magnets-slider {
                    color: #746cc0;
                }

                .soc-texcolor-temperature {
                    color: #6a5ff7;
                }

                .soc-texcolor-electron {
                    color: #e9b109;
                }

                .soc-texcolor-magnet-north {
                    color: #ff3235;
                }

                .soc-texcolor-magnet-south {
                    color: #2939e2;
                }

                .soc-texcolor-particle {
                    color: #1ea2ee;
                }

                .soc-texcolor-coupling {
                    color: #12a02a;
                }`}
            </style>
            <Article className={`${styles['science_of_complexity']}`}>
                <Header />
                <Introduction />
                <Part1 />
                <Part2 />
                <Part3 />
                <Conclusion />
                <CommentsForm />
            </Article>
        </MathJaxContext>
    </>
}