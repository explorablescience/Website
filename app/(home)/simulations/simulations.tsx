'use client'

import Button from '@/app/components/ui/buttons/button';
import styles from './simulations.module.css'
import Card from '@/app/components/ui/cards/card';
import { contentFont, titleFont } from '@/app/fonts';
import { getSimulations } from '@/app/api/database/app';
import { JSX, Suspense, useEffect, useState } from 'react';
import React from 'react';

export default function SimulationsList(props: { count?: number, inverted?: boolean }) {
    const inverted = props.inverted ?? false;
    const moreButton = props.count ? true : false;
    
    const [cards, setCards] = useState<JSX.Element[]>([]);
    useEffect(() => {
        async function fetchData() {
            // Get list of articles
            const allSimulations = await getSimulations();
            const simulations = props.count ? allSimulations.slice(0, props.count) : allSimulations;

            // Create cards
            const cards = simulations.map((article, index) => {
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
                        color={inverted ? "#21365b" : "#eee"}
                        key={index} />
                )
            });
            setCards(cards);
        }
        fetchData();
    }, [props.count, props.inverted]);

    return (
        <section id="simulations" className={`${inverted ? '' : styles.simulations}`}>
            <div className={`${styles.transition} ${inverted ? styles.transitionLight : styles.transitionDark} ${inverted ? styles.rotationLow : styles.rotationHigh}`}></div>

            <div className={`${styles.animationsContainer} ${inverted ? styles.animationsContainerLight : styles.animationsContainerDark}`}>
                <div className={styles.animations}>
                    <div className={`${styles.title} ${inverted ? styles.titleLight : styles.titleDark} ${titleFont.className}`}>
                        <p>{ inverted ? "Interactive Simulations" : "Latest Simulations" }</p>
                    </div>

                    <div className={`${styles.content} ${contentFont.className}`}>
                        { cards.length == 0 ? <p className={styles.loadingText}>Loading...</p> : cards }
                    </div>

                    <div className={styles.more}>
                        {moreButton && <Button content='&nbsp;All Simulations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' link='/simulations' padding='24' size='large' /> }
                    </div>
                </div>
            </div>
        </section>
    )
}
