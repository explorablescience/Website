import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";
import { MathJaxContext } from "better-react-mathjax";
import { Metadata } from "next";
import GeneralRelativityApp from "./GeneralRelativityApp";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
    title: 'Exploring General Relativity'
}

export default function Page() {
    // Custom MathJax macros
    const macros = {
        // Vectors
        v: ['\\mathbf{#1}', 1],
        // Highlighting
        landmarkred: ['\\class{landmark-math}{\\class{landmark-red}{#1}}', 1],
        landmarkblue: ['\\class{landmark-math}{\\class{landmark-blue}{#1}}', 1],
        landmarkgreen: ['\\class{landmark-math}{\\class{landmark-green}{#1}}', 1],
        landmarkgray: ['\\\class{landmark-math}{\\class{landmark-gray}{#1}}', 1],
        landmarkpurple: ['\\class{landmark-math}{\\class{landmark-purple}{#1}}', 1],
        // Color text
        color: ['\\class{color-#1}{#2}', 2],
    };
    
    return <>
        <Navbar small />

        <ErrorBoundary fallback={<div className="error">An error occurred while loading the article.</div>}>
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
                <GeneralRelativityApp />
            </MathJaxContext>
        </ErrorBoundary>

        <Footer />
    </>
}
