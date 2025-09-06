import { getSimulationById } from "@/app/api/database/simulations"
import Footer from "@/app/components/footer/footer"
import Navbar from "@/app/components/header/navbar"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import styles from './page.module.css'
import Button from "@/app/components/ui/buttons/button"
import { contentFont, titleFont } from "@/app/fonts"

type Props = {
    params: Promise<{ sim_id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const sim_id = (await params).sim_id
    const sim = await getSimulationById(sim_id)
    if (!sim) {
        return {}
    }

    return {
        title: sim.title,
        description: sim.description,
        keywords: [
            "science", "physics", "educational", "explorable", "explorables", "explorable-explanations", "interactive", "article",
            "articles", "simulation", "simulations", "learning", "research", "experiments", "visualization", "data", "technology",
            sim.keyword
        ],
        openGraph: {
            title: sim.title,
            description: sim.description,
            url: `/simulations/${sim.id}`,
            images: [
                { url: sim.image.url, width: sim.image.width, height: sim.image.height, alt: sim.image.alt },
            ],
            siteName: 'ExplorableScience',
        },
        twitter: {
            card: 'summary_large_image',
            title: sim.title,
            description: sim.description,
            images: [sim.image]
        }
    }
}

export default async function Page({ params }: Props) {
    const { sim_id } = await params
    const sim = await getSimulationById(sim_id)
    if (!sim) {
        notFound()
    }
    const desc = sim.description.replace(/<c>(.*?)<\/c>/g, '<span class="colorNote">$1</span>');

    return <>
        <Navbar small />

        <div className={styles.simulation_container}>
            <div className={styles.simulation_header}>
                <iframe src={"https://simulations.explorablescience.com/" + sim.link} className={styles.simulation_iframe} title={sim.title} />
            </div>
            <div className={styles.simulation_content}>
                <h1 className={`${styles.simulation_title} ${titleFont}`}>{sim.title}</h1>
                <p className={`${styles.simulation_description} ${contentFont}`} dangerouslySetInnerHTML={{ __html: desc }}></p>
                <div className={styles.simulation_links}>
                    <Button content="Fullscreen" link={"https://simulations.explorablescience.com/" + sim.link} size="standard" />
                    <Button content="Source Code" link={sim.github} size="standard" />
                </div>
            </div>
        </div>

        <Footer />
    </>
}
