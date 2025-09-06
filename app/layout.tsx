import type { Metadata } from "next";
import styles from './layout.module.css'
import { inter } from "./fonts.ts";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: '%s | ExplorableScience',
        default: 'ExplorableScience | Explore Science Through Interactive Simulations'
    },
    description: "Discover and learn science concepts interactively with explorable articles and hands-on simulations covering physics, technology, and more.",
    keywords: [
        "science", "physics", "educational", "explorable", "explorables", "explorable-explanations", "interactive", "article",
        "articles", "simulation", "simulations", "learning", "research", "experiments", "visualization", "data", "technology"
    ],
    authors: [{ name: "ExplorableScience", url: "https://explorablescience.com" }],
    creator: "ExplorableScience",
    publisher: "ExplorableScience",
    category: "Science",
    applicationName: "ExplorableScience",
    openGraph: {
        title: "ExplorableScience | Explore Science Through Interactive Simulations",
        description: "Explorable articles and interactive simulations on various scientific topics.",
        url: "/",
        siteName: "ExplorableScience",
        images: [
            {
                url: "/imgs/logo.png",
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
        site: "/",
        creator: "@ExplorableSci",
        images: [
            "https://explorablescience.com/imgs/logo.png"
        ]
    },
    robots: "index, follow",
    alternates: {
        canonical: "/",
        languages: {
            "en-US": "/"
        }
    }
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
