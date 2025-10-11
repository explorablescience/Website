import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";
import { Metadata } from "next";
import React from "react";
import ScienceComplexityApp from "./ScienceComplexityApp";
import { getArticleById } from "@/app/api/database/articles";

export async function generateMetadata(): Promise<Metadata> {
    const article = await getArticleById("science_of_complexity");
    if (!article) {
        return {}
    }
    const title = `${article.title} | ExplorableScience`
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
    return <>
        <Navbar small />

        <React.StrictMode>
            <ScienceComplexityApp />
        </React.StrictMode>

        <Footer />
    </>
}
