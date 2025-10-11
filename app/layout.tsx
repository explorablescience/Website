import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import styles from './layout.module.css'
import { inter } from "./fonts.ts";
import "./globals.css";
import Script from "next/script";
import { CustomAnalytics } from './api/client/analytics.tsx';

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
    authors: [{ name: "ExplorableScience", url: "https://www.explorablescience.com" }],
    creator: "ExplorableScience",
    publisher: "ExplorableScience",
    category: "Science",
    applicationName: "ExplorableScience",
    openGraph: {
        title: "ExplorableScience | Explore Science Through Interactive Simulations",
        description: "Explorable articles and interactive simulations on various scientific topics.",
        url: "https://www.explorablescience.com/",
        siteName: "ExplorableScience",
        images: [
            {
                url: "https://www.explorablescience.com/imgs/og-image.png",
                width: 686,
                height: 335,
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
        site: "https://www.explorablescience.com/",
        creator: "@ExplorableSci",
        images: [
            "https://www.explorablescience.com/imgs/og-image.png"
        ]
    },
    robots: "index, follow",
    alternates: {
        canonical: "https://www.explorablescience.com/",
        languages: {
            "en-US": "https://www.explorablescience.com/"
        },
        types: {
            "application/rss+xml": "https://www.explorablescience.com/feed.xml"
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
            <head>
                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-FLV6EYV4NL"
                    strategy="afterInteractive"
                />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-FLV6EYV4NL');
                    `}
                </Script>

                {/* Google site verification */}
                <meta name="google-site-verification" content="ZdIYOR1_E0-R6QFq4Y2P3EK4esoYPZnbwaB376vQj7M" />
            </head>
            <body className={styles.body}>
                {children}

                <CustomAnalytics />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
