import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";
import { MathJaxContext } from "better-react-mathjax";
import { Metadata } from "next";
import GeneralRelativityApp from "./GeneralRelativityApp";
import { ErrorBoundary } from "react-error-boundary";
import { getArticleById } from "@/app/api/database/articles";

export async function generateMetadata(): Promise<Metadata> {
    const article = await getArticleById("general_relativity");
    if (!article) {
        return {}
    }
    const title = `${article.title}`
    const desc = article.description.replace(/<c>(.*?)<\/c>/g, '$1');

    return {
        title,
        description: desc,
        keywords: [
            "science", "physics", "educational", "explorable", "explorables", "explorable-explanations", "interactive", "article",
            "articles", "simulation", "simulations", "learning", "research", "experiments", "visualization", "data", "technology",
            article.keyword
        ],
        openGraph: {
            title,
            description: desc,
            url: `/articles/${article.id}`,
            images: [
                { url: article.image.url, width: article.image.width, height: article.image.height, alt: article.image.alt },
            ],
            siteName: 'ExplorableScience',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: desc,
            images: [article.image]
        }
    }
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
