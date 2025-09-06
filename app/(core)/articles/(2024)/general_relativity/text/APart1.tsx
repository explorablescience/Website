import { MathJax } from "better-react-mathjax";
import SubSection from "../structure/SubSection";
import TextContent from "../structure/TextContent";
import { Cite, Color, HSpace, Landmark, Paragraph, Strong, Underline } from "./APart";
import { ASim1Part1, ASim1Part2 } from "../simulations/ASim1";

export default function APart1() {
    return (
        <TextContent>
            <SubSection
                title="Gravity in Classical Mechanics: The Force Perspective"
                alignSimulation="right"
                simulation={ASim1Part1}>

                <Paragraph>
                    Imagine you're walking peacefully in the woods and you decide to have a seat under a tree in a nice clearing.
                    Your eyes begin to lose themselves in the vastness and you begin to drift into the realm of the dream...
                    
                    <HSpace />

                    Suddenly you feel a sharp pain in your head: it's an apple that has fallen from the tree!
                    You swear:
                    <Cite>Why did that apple have to fall on <Strong>me</Strong>?</Cite>
                    I mean, really, why the hell did it have to fall, especially on <Strong>your</Strong> head?
                </Paragraph>

                <Paragraph>
                    Legend has it that a British scientist called <Underline>Isaac Newton</Underline> asked himself the same question around 1687 and a few apples.
                    His answer was that the apple fell because it was under the influence of a force that was pulling it to the ground, the force of <Strong>gravity</Strong>.
                    
                    <HSpace />
                    
                    In his <i>Philosophiae Naturalis Principia Mathematica</i>, Newton proposed a relationship between this <Landmark color="red">force <MathJax inline>{`$\\v{F}$`}</MathJax></Landmark>
                    and the <Landmark color="blue">acceleration <MathJax inline>{`$\\v{a}$`}</MathJax></Landmark> of the apple, the famous <Strong>second law of motion</Strong>:
                        {`$$\\v{\\landmarkred{F}} = \\color{green}{m} \\v{\\landmarkblue{a}}$$`}
                    in which he introduced the <Color color="green">mass of the apple <MathJax inline>{`$m$`}</MathJax></Color> as a proportionality constant between the force and the acceleration.
                    He stated that, in the context of gravity, the force is proportional to the <Color color="green">mass of the apple <MathJax inline>{`$m$`}</MathJax></Color> and the <Color color="green">mass of the Earth <MathJax inline>{`$M$`}</MathJax></Color>:
                        {`$$|\\v{\\landmarkred{F}}| \\simeq \\frac{\\color{green}{m} \\color{green}{M}}{r^2}.$$`}
                    According to Newton, the strength of this force depends on the distance <MathJax inline>{`$r$`}</MathJax> between the apple and the Earth.
                    But something doesn't feel right.
                    <Cite>Isn't it strange that the earth acts on the apple without touching it? Does the force propagate instantly? In what does it propagate?</Cite>
                    <Underline>Michael Faraday</Underline>, who had a similar question, answered it in the context of electromagnetism.
                </Paragraph>
            </SubSection>

            <SubSection
                title="Faraday's idea: fields!"
                alignSimulation="left"
                simulation={ASim1Part2}>

                <Paragraph>
                    Before we talk about Faraday's answer, we need to remember what <Strong>electromagnetism</Strong> is.
                    Just like our apple, which had mass, take a <Color color="green">particles</Color> that has an <Color color="green">electric charge <MathJax inline>{`$q$`}</MathJax></Color>. An <i>electron</i>, for example.
                    Now put two <i>electrons</i> next to each other: they repel each other!
                    If we think like Newton, then banco: there is a <Landmark color="red">force</Landmark> between the two electrons that acts at a distance:
                        {`$$|\\v{\\landmarkred{F_{elec}}}| \\simeq \\frac{\\color{green}{q_1} \\color{green}{q_2}}{r^2}.$$`}
                    But Faraday intuited something different:
                    <Cite>What if everywhere around us is an entity... a <Color color="red">field</Color>?</Cite>
                    The two <i>electrons</i> don't interact directly, they just locally modify the field around them.
                    This change then propagates through it and is felt by the other electron: this is what we call an <i>interaction</i>!

                    <HSpace />

                    In Faraday's interpretation, there are not <Strong>only</Strong> <Color color="green">particles</Color> but there are <Strong>two</Strong> interacting entities: the <Color color="red">field</Color> <Strong>and</Strong> the <Color color="green">particles</Color>.
                    <Cite>Ok. Great. But what is this <Color color="red">field</Color>? Can we visualise it? How does it evolve?</Cite>
                </Paragraph>

                <Paragraph>
                    Faraday imagined the <Color color="red">field</Color> as a kind of <Color color="red">fluid</Color> that fills all space and flows around us.
                    <Color color="green"> Particles</Color> are like little <Color color="green">boats</Color> that sail on this fluid modifying it locally.
                    The heavier their boat, the more they change the fluid.
                    So now, what we really want to know is how this <Color color="red">fluid</Color> evolves, and how the <Color color="green">boats</Color> move in it.

                    <HSpace />

                    Here, the <Color color="red">field</Color> is called the <Landmark color="blue">electric field <MathJax inline>{`$\\v{E}$`}</MathJax></Landmark>.
                    At any point <MathJax inline>{`$\\v{r}$`}</MathJax> in space, <MathJax inline>{`$\\landmarkblue{\\v{E(\\v{r})}}$`}</MathJax> gives us a vector representing the direction and intensity of that <i><Color color="red">fluid</Color></i> at this point.
                    On the left is a simulation of it with two <Color color="green">particles</Color> in it.
                    In fact, we almost already know how the <Color color="green">particles</Color> move in it: it's their <Color color="green">charge <MathJax inline>{`$q$`}</MathJax></Color>, <i>the weight of the boat</i>, times the intensity of the <Color color="red">field</Color>, <i>the flow of the fluid</i>, at their position:
                        {`$$|\\v{\\landmarkred{F_{elec}}}| = \\color{green}{q} |\\v{\\landmarkblue{E}}|.$$`}
                    Following the dynamics of this discovery, scientists realised that the same thing happened with <Color color="green">magnets</Color>.
                    So they introduced a second <Color color="red">field</Color>, the <Landmark color="purple">magnetic field <MathJax inline>{`$\\v{B}$`}</MathJax></Landmark> such that for magnets:
                        {`$$|\\v{\\landmarkred{F_{mag}}}| \\simeq \\color{green}{q} v |\\v{\\landmarkpurple{B}}|$$`}
                    where <MathJax inline>{`$v$`}</MathJax> is the velocity of the <Color color="green">particle</Color>.
                    <Cite>Ok. So now we have two fields that tell the particles how to move. But how do these fields change when we add or remove particles?</Cite>
                    
                    <HSpace />
                    
                    Enter <Underline>James Clerk Maxwell</Underline>.
                    Around 1860, he unified the two fields into one, the <Strong>electromagnetic field</Strong>.
                    He wrote down a set of equations that describe how this new field evolves in time and space, the <Strong>Maxwell equations</Strong>:
                        {`$$\\begin{cases}
                            \\landmarkblue{\\nabla \\cdot \\v{E}} &= \\frac{1}{\\epsilon_0}\\color{green}{\\v{\\rho}} \\\\
                            \\landmarkpurple{\\nabla \\cdot \\v{B}} &= 0 \\\\
                            \\landmarkblue{\\nabla \\times \\v{E}} &= \\landmarkpurple{-\\frac{\\partial}{\\partial t}\\v{B}} \\\\
                            \\landmarkpurple{\\nabla \\times \\v{B}} &= \\frac{1}{c^2} \\landmarkblue{\\frac{\\partial}{\\partial t}\\v{E}} + \\mu_0\\color{green}{\\v{J}}
                        \\end{cases}$$`}
                    where <MathJax inline>{`$\\rho$`}</MathJax> and <MathJax inline>{`$\\v{J}$`}</MathJax> describes how the charges are distributed in space and how they move.
                </Paragraph>
            </SubSection>

            <SubSection
                title="The fundamental idea of General Relativity">

                <Paragraph>
                    As we've just seen, <Color color="red">fields</Color> are a very powerful concept.
                    They provide a way of describing how <Color color="green">particles</Color> interact with each other without having to introduce a <Color color="red">force</Color> that acts at a distance.
                    <Cite>So... what if we could do the same thing for gravity?</Cite>
                    In fact, this is exactly what Einstein did. He asked himself the same question: what if there is a <Color color="red">field</Color> that fills all space and that is modified by the presence of <Color color="green">masses</Color>, a <Strong>gravitational field</Strong>?
                    
                    <HSpace />

                    In the following sections, we will see how this idea leads to the concept of <Strong>general relativity</Strong>.
                    First, we will find an equation that describes how the <Color color="green">masses</Color>, <i>the boats</i>, move in this <Color color="red">field</Color>, <i>the fluid</i>: this is the <Strong>geodesic equation</Strong>.
                    Then we'll see how this <Color color="red">field</Color> behaves in time and space when we change its composition by understanding <Strong>Einstein's equation</Strong>.
                    Finally, we will solve these equations in a simple case and see how the concept of a <Landmark color="gray">black hole</Landmark> emerges.
                </Paragraph>
            </SubSection>
        </TextContent>
    )
}
