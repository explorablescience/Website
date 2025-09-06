import { getSimulationById } from "@/app/api/database/simulations"
import Footer from "@/app/components/footer/footer"
import Navbar from "@/app/components/header/navbar"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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

    return <>
        <Navbar small />

        <div style={{ margin: '100px auto' }}>
            <h1>{sim.title}</h1>
            <p>{sim.description}</p>
            <iframe src={"https://simulations-one.vercel.app/" + sim.link} style={{ width: '100%', height: '80vh', border: 'none' }} title={sim.title} />
        </div>
        
        <Footer />
    </>
}
