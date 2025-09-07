'use server';

import { cache } from "react";

/** Articles data type */
export type ArticleData = {
    id: string;
    title: string;
    description: string;
    image: { url: string; width: number; height: number; alt: string };
    keyword: string;
    year: string;
    pinned: boolean;
}

/**
 * Get articles from the database
 * Returns an object with:
 * - by_id: a mapping from article id to its index in the data array
 * - by_display: an array of indices in the data array, sorted by pinned and year
 * - data: an array of all articles
 */
const getArticles = cache(async function () {
    // Get articles from database
    const articles: ArticleData[] = [
        {
            id: 'science_of_complexity',
            title: 'The Science of Complexity',
            description: 'Discover how complex systems emerge from simple interactions. Explore concepts like phase transitions, self-organization, and emergence through interactive simulations.',
            image: {
                url: '/articles/science_of_complexity/imgs/logo.webp',
                width: 640,
                height: 360,
                alt: 'The Science of Complexity',
            },
            keyword: 'Complex Systems',
            year: '2025',
            pinned: true
        },
        {
            id: 'general_relativity',
            title: 'General Relativity',
            description: 'Explore the fundamental principles of General Relativity and how they shape our understanding of gravity and the universe.',
            image: {
                url: '/articles/general_relativity/images/logo.webp',
                width: 640,
                height: 360,
                alt: 'General Relativity',
            },
            keyword: 'Relativity',
            year: '2023',
            pinned: false
        }
    ];

    // Sort by id for faster access
    const articles_by_id: { [key: string]: number } = {};
    articles.forEach((sim, idx) => {
        articles_by_id[sim.id] = idx;
    });

    // Sort by pinned, then year
    const articles_by_pinned: number[] = [];
    articles.forEach((sim, idx) => {
        if (sim.pinned) {
            articles_by_pinned.unshift(idx);
        } else {
            articles_by_pinned.push(idx);
        }
    });
    articles_by_pinned.sort((a, b) => {
        const sim_a = articles[a];
        const sim_b = articles[b];
        if (sim_a.pinned && !sim_b.pinned) return -1;
        if (!sim_a.pinned && sim_b.pinned) return 1;
        if (sim_a.year > sim_b.year) return -1;
        if (sim_a.year < sim_b.year) return 1;
        return 0;
    });

    // Sort by year
    const articles_by_year: number[] = [];
    articles.forEach((_, idx) => {
        articles_by_year.push(idx);
    });
    articles_by_year.sort((a, b) => {
        const sim_a = articles[a];
        const sim_b = articles[b];
        if (sim_a.year > sim_b.year) return -1;
        if (sim_a.year < sim_b.year) return 1;
        return 0;
    });

    // Return all data
    return {
        by_id: articles_by_id,
        by_pinned: articles_by_pinned,
        by_year: articles_by_year,
        data: articles
    };
});

/** Get articles sorted by pinned and year
 * @param max Maximum number of articles to return
 * @returns An array of articles
 */
export async function getArticlesByPinned(max?: number): Promise<ArticleData[]> {
    const articles = await getArticles();
    const sorted = articles.by_pinned.map(idx => articles.data[idx]);
    return max ? sorted.slice(0, max) : sorted;
}

/** Get articles sorted by year
 * @param max Maximum number of articles to return
 * @returns An array of articles
 */
export async function getArticlesByYear(max?: number): Promise<ArticleData[]> {
    const articles = await getArticles();
    const sorted = articles.by_year.map(idx => articles.data[idx]);
    return max ? sorted.slice(0, max) : sorted;
}

/** Get a article by its id
 * @param sim_id Article id
 * @returns The article data, or null if not found
 */
export async function getArticleById(sim_id: string): Promise<ArticleData | null> {
    const articles = await getArticles();
    const idx = articles.by_id[sim_id];
    if (idx === undefined) {
        return null;
    }
    return articles.data[idx];
}

