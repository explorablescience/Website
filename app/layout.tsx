import type { Metadata } from "next";
import styles from './layout.module.css'
import { inter } from "./fonts.ts";
import "./globals.css";

export const metadata: Metadata = {
    title: "ExplorableScience | Explore Science Through Interactive Simulations",
    description: "Discover and learn science concepts interactively with explorable articles and hands-on simulations covering physics, technology, and more.",
    keywords: [
        "science", "physics", "educational", "explorable", "explorables", "explorable-explanations", "interactive", "article",
        "articles", "simulation", "simulations", "learning", "research", "experiments", "visualization", "data", "technology"
    ],
    authors: [{ name: "ExplorableScience", url: "https://explorablescience.com" }],
    openGraph: {
        title: "ExplorableScience | Explore Science Through Interactive Simulations",
        description: "Explorable articles and interactive simulations on various scientific topics.",
        url: "https://explorablescience.com",
        siteName: "ExplorableScience",
        images: [
            {
                url: "https://explorablescience.com/logo.png",
                width: 1000,
                height: 1000,
                alt: "ExplorableScience - Explore Science Through Interactive Simulations"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "ExplorableScience | Explore Science Through Interactive Simulations",
        description: "Discover and learn science concepts interactively with explorable articles and hands-on simulations covering physics, technology, and more.",
        site: "https://explorablescience.com",
        creator: "ExplorableScience",
        images: [
            "https://explorablescience.com/logo.png"
        ]
    },
    robots: "index, follow",
    alternates: {
        canonical: "https://explorablescience.com",
        languages: {
            "en-US": "https://explorablescience.com"
        }
    },
    category: "Science",
    applicationName: "ExplorableScience"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.className} antialiased`}>
            <body className={styles.body}>{children}</body>
        </html>
    );
}
