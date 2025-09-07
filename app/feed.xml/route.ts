import RSS from 'rss';
import { getArticlesByYear } from '../api/database/articles';
import { getSimulationsByYear } from '../api/database/simulations';

export async function GET() {
    // Define the base URL of your website
    const url = 'https://www.explorablescience.com';

    // Create the RSS main feed
    const feed = new RSS({
        title: 'ExplorableScience',
        description: 'Discover and learn science concepts interactively with explorable articles and hands-on simulations covering physics, technology, and more.',
        site_url: url,
        feed_url: `${url}/feed.xml`,
        copyright: `${new Date().getFullYear()} ExplorableScience`,
        language: 'en',
        pubDate: new Date(),
    });

    // Articles from the database
    const articles = (await getArticlesByYear()).map((article) => ({
        title: article.title,
        guid: `${url}/articles/${article.id}`,
        url: `${url}/articles/${article.id}`,
        date: new Date(article.date),
        description: article.description.replace(/<c>(.*?)<\/c>/g, '$1'),
        author: 'ExplorableScience',
        categories: article.keyword ? [article.keyword] : []
    }));

    // Simulations from the database
    const simulations = (await getSimulationsByYear()).map((sim) => ({
        title: sim.title,
        guid: `${url}/simulations/${sim.id}`,
        url: `${url}/simulations/${sim.id}`,
        date: new Date(sim.date),
        description: sim.description.replace(/<c>(.*?)<\/c>/g, '$1'),
        author: 'ExplorableScience',
        categories: sim.keyword ? [sim.keyword] : []
    }));

    // Combine and sort by date (newest first)
    const posts = [...articles, ...simulations].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Add each post to the feed
    posts.forEach(post => feed.item(post));

    // Return the RSS feed as XML
    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8',
        },
    });
}
