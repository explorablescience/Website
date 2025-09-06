'use client'

import Button from '@/app/components/ui/buttons/button';
import styles from './simulations.module.css'
import Card from '@/app/components/ui/cards/card';
import { contentFont, titleFont } from '@/app/fonts';
import { JSX, useEffect, useState } from 'react';
import React from 'react';
import { getSimulationsByPinned, getSimulationsByYear } from '@/app/api/database/simulations';

export default function SimulationsList(props: { count?: number, inverted?: boolean }) {
    const inverted = props.inverted ?? false;
    const moreButton = props.count ? true : false;
    
    const [cards, setCards] = useState<JSX.Element[]>([]);
    useEffect(() => {
        async function fetchData() {
            // Get list of simulations
            const simulations = moreButton ? await getSimulationsByPinned(props.count) : await getSimulationsByYear(props.count);

            // Create cards
            const cards = simulations.map((sim, index) => {
                const formatDescription = sim.description.replace(/<c>(.*?)<\/c>/g, '<span class="colorNote">$1</span>');
                return (
                    <Card
                        alignText={index % 2 == 0 ? 'right' : 'left'}
                        title={sim.title}
                        description={formatDescription}
                        image={sim.image.url}
                        link={`/simulations/${sim.id}`}
                        keyword={sim.keyword}
                        year={sim.year}
                        color={inverted ? "#21365b" : "#eee"}
                        key={index} />
                )
            });
            setCards(cards);
        }
        fetchData();
    }, [inverted, moreButton, props.count, props.inverted]);

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
