import type { MetadataRoute } from 'next'
import { getAllSimulations } from './api/database/simulations';
import { getAllArticles } from './api/database/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Define the base URL of your website
    const url = 'https://www.explorablescience.com';

    // Static roots of the sitemap statically defined
    const sitemap = [
        {
            url: url,
            priority: 1.0,
        },
        {
            url: `${url}/articles`,
            priority: 0.4,
        },
        {
            url: `${url}/simulations`,
            priority: 0.4,
        },
        {
            url: `${url}/about`,
            priority: 0.2,
        }
    ];

    // Articles from the database
    const articles = (await getAllArticles()).map((article) => ({
        url: `${url}/articles/${article.id}`,
        priority: 0.8,
    }));
    sitemap.push(...articles);

    // Simulations from the database
    const simulations = (await getAllSimulations()).map((sim) => ({
        url: `${url}/simulations/${sim.id}`,
        priority: 0.6,
    }));
    sitemap.push(...simulations);

    // Return the sitemap
    return sitemap;
}
