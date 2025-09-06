'use client'

import { contentFont, titleFont } from '@/app/fonts';
import Button from '../../components/ui/buttons/button';
import Card from '../../components/ui/cards/card';
import styles from './articles.module.css'
import { getArticles } from '@/app/api/database/app';
import { JSX, useEffect, useState } from 'react';

export default function ArticlesList(props: { count?: number, inverted?: boolean }) {
    const [cards, setCards] = useState<JSX.Element[]>([]);
        useEffect(() => {
            async function fetchData() {
                // Get list of articles
                const allArticles = await getArticles();
                const articles = props.count ? allArticles.slice(0, props.count) : allArticles;

                // Create cards
                const cards = articles.map((article, index) => {
                    const formatDescription = article.description.replace(/<c>(.*?)<\/c>/g, '<span class="colorNote">$1</span>');
                    return (
                        <Card
                            alignText={index % 2 == 0 ? 'right' : 'left'}
                            title={article.title}
                            description={formatDescription}
                            image={article.image}
                            link={article.link}
                            keyword={article.keyword}
                            year={article.year}
                            color={"#21365b"}
                            key={index} />
                    )
                });
                setCards(cards);
            }
            fetchData();
        }, [props.count, props.inverted]);

    const inverted = props.inverted ?? false;
    const moreButton = props.count ? true : false;

    return (
        <section id="articles">
            <div className={`${styles.transition} ${inverted ? styles.rotationLow : styles.rotationHigh}`}></div>

            <div className={styles.animations}>
                <div className={`${styles.title} ${titleFont.className}`}>
                    <p>{ inverted ? "Interactive Articles" : "Latest Articles" }</p>
                </div>

                <div className={`${styles.content} ${contentFont.className}`}>
                    {cards.length == 0 ? <p className={styles.loadingText}>Loading...</p> : cards}
                </div>

                <div className={styles.more}>
                    {moreButton && <Button content='&nbsp;All Articles&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' link='/articles' padding='18' size='standard' /> }
                </div>
            </div>
        </section>
    )
}