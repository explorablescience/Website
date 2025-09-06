import ASimTemplate from "../simulations/ASimTemplate";
import SubSection from "../structure/SubSection";
import TextContent from "../structure/TextContent";
import { Paragraph } from "./APart";
import Lorem from "./Lorem";

export default function APartTemplate() {
    return (
        <TextContent>
            <SubSection
                title="First sub section"
                alignSimulation="right"
                simulation={ASimTemplate}>

                <Paragraph>
                    <Lorem />
                </Paragraph>
            </SubSection>


            <SubSection
                title="Second sub section">

                <Paragraph>
                    <Lorem />
                </Paragraph>
            </SubSection>
        </TextContent>
    )
}
