'use client';

import Lorem from "../(core)/articles/(2024)/general_relativity/text/Lorem";
import { Article, Paragraph, Part, Section } from "../(core)/articles/(2025)/science_of_complexity/logic/text/Article";
import { FirefliesSimulation } from "../lib/explorable_simlib/examples/FirefliesSimulation";
import { IsingSimulation } from "../lib/explorable_simlib/examples/IsingSimulation";
import { SampleSimulation } from "../lib/explorable_simlib/examples/SampleSimulation";

export default function TestPage() {
    return <>
        <Article>
            <Section>
                <Part title={"Fireflies Simulation"}>
                    <Lorem />
                    <SampleSimulation />
                    <Lorem />
                    <FirefliesSimulation title="Firefly simulation" description={<Paragraph>Hi</Paragraph>} />
                    <Lorem />
                    <IsingSimulation title="Ising Model Simulation" description={<Paragraph>Hi</Paragraph>} />
                    <Lorem />
                </Part>
            </Section>
        </Article>
    </>
}
