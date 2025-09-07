'use client'

import { ReactNode, useLayoutEffect, useState } from "react";
import Article from "./structure/Article";
import Conclusion from "./structure/Conclusion";
import Introduction from "./structure/Introduction";
import Section from "./structure/Section";
import AConclusion from "./text/AConclusion";
import AIntroduction from "./text/AIntroduction";
import APart1 from "./text/APart1";
import APart2 from "./text/APart2";
import APart3 from "./text/APart3";
import APart4 from "./text/APart4";

const DefaultOnSSR: React.FC = () => null

export const NoSSR: React.FC<{ children: ReactNode; onSSR?: ReactNode }> = ({ children, onSSR = <DefaultOnSSR /> }) => {
    const [onBrowser, setOnBrowser] = useState(false)
    useLayoutEffect(() => {
        setOnBrowser(true)
    }, [])
    return <>{onBrowser ? children : onSSR}</>
}

export default function GeneralRelativityApp() {
    return <NoSSR>
        <Article
            title="Exploring General Relativity"
            subtitle="A Mathematical Journey">
            <Introduction>
                <AIntroduction />
            </Introduction>

            <Section
                index={1}
                title="From particles to fields">

                <APart1 />
            </Section>

            <Section
                index={2}
                title="Time as a fourth dimension">

                <APart2 />
            </Section>

            <Section
                index={3}
                title="Moving through Space-Time">

                <APart3 />
            </Section>

            <Section
                index={4}
                title="Distances and the metric tensor">

                <APart4 />
            </Section>

            <Conclusion>
                <AConclusion />
            </Conclusion>
        </Article>
    </NoSSR>;
};
