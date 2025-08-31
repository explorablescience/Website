import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ExplorableScience | Explore Science Through Interactive Simulations",
    description: "Discover and learn science concepts interactively with explorable articles and hands-on simulations covering physics, technology, and more.",
    keywords: [
        "science", "physics", "education", "explorable", "explorables", "interactive", "article",
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
                url: "https://explorablescience.com/og-image.png",
                width: 1200,
                height: 630,
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
        creator: "@ExplorableSci",
        images: [
            "https://explorablescience.com/og-image.png"
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
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <body>{children}</body>
        </html>
    );
}
