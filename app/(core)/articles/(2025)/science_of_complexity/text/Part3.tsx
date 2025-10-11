import { GradientText, IColor, IMath, IMathBlock, MoreInformations, Note, Question, Separator, TheoristQuestions } from "../logic/text/TextEffects";
import { Paragraph, Part, Section } from "../logic/text/Article";
import { Firefly } from "./Part2";
import { FishSchool } from "../simulations/3_FishSchool";
import { FishGraph } from "../simulations/3_FishGraph";

export function Fish(props: { children: string, bold?: boolean, italic?: boolean }) {
    return <GradientText from={[50, 92, 180]} to={[189, 56, 219]} bold={props.bold} italic={props.italic}>{props.children}</GradientText>;
}

export function Part3() {
    return <Part title="...to the coordinated swimming of fishes">
        <Section title="Fish schools">
            <Paragraph>
                Let me start by telling you that <Fish>fishes</Fish> and <Firefly>fireflies</Firefly> are the... <strong>same thing</strong>!
            </Paragraph>
            <Question>
                Wait, what? I'm not really sure about that...
            </Question>
            <Paragraph>
                Okay, <i>not really</i>, I agree. Still, let's look at their similarities. In nature, fishes in oceans often travel in <strong>schools</strong>, meaning that they move together in a coordinated manner.
            </Paragraph>
            <FishSchool showSliders={false} />
            <TheoristQuestions>
                Now, you guessed it, how can we modify our previous model to describe this behavior?
                <br />
                And how can we characterize the <i>schooliness</i> of fishes?
            </TheoristQuestions>
        </Section>

        <Section title="The Vicsek model">
            <Paragraph>
                Let's start by recalling what the two previous models were about. Each atom's spin  or firefly was an <IColor type="electron" bold>arrow</IColor> that wanted to <IColor type="electron" italic>align</IColor> with its neighbors. It however also had to fight against <IColor type="temperature" bold>noise</IColor> that randomly changed its orientation. Note that in the Kuramoto model, these arrows were also constantly <i>rotating</i>.
            </Paragraph>
            <Paragraph>
                Reinterpreting these models, we introduce the Vicsek model:
                <ul>
                    <li>The <IColor type="electron" bold>arrows</IColor> are no longer spins of atoms or fireflies, but rather <Fish bold italic>fishes</Fish>, and they do no longer rotate anymore over time. The <IColor type="magnet-north">head</IColor> of the arrow is the <IColor type="magnet-north">fish head</IColor>, and the <IColor type="magnet-south">tail</IColor> is... its <IColor type="magnet-south">tail</IColor>.</li>
                    <li>The <Fish bold>fishes</Fish> can move freely in space.</li>
                    <li>The <IColor type="temperature" bold>noise</IColor> again represents <i>how much the arrows is shaken</i> around, that is how much the fishes are <IColor type="temperature">independent</IColor>.</li>
                    <li>The <IColor type="coupling" bold>interaction strength</IColor> is now how strongly a given fish wants to <IColor type="coupling">align</IColor> with its neighbors.</li>
                </ul>
                Finally, the equation that describes how the angle <IMath>{`\\color{electron}{\\theta}_j`}</IMath> of a given fish <IMath>j</IMath> evolves over time is
                <IMathBlock>{`\\frac{\\mathrm{d}\\color{electron}{\\theta}_j}{\\mathrm{d}t} = \\color{coupling}{K} \\sum_{j' \\mathrm{\\ that\\ are}\\atop \\mathrm{\\ neighbors\\  of\\ } j} \\sin(\\color{electron}{\\theta}_{j'} - \\color{electron}{\\theta}_j) + \\eta(t) \\sqrt{\\color{temperature}{T}}.`}</IMathBlock>
            </Paragraph>
            <Note>
                Note how we only changed our view again, and that the <strong>equation stayed</strong> (<i>almost</i>) <strong>exactly the same</strong>!
            </Note>
            <MoreInformations title="Velocity and position update">
                <Paragraph>
                    The way we handle the <IColor type="magnet" bold>movement</IColor> of the fishes is a bit more complex than just updating their angle. At each time, we first update each <IMath>{`\\color{electron}{\\theta}_j`}</IMath> of every fish, and then update their <IColor type="magnet" bold>position</IColor> <IMath>{`\\color{magnet}{\\mathbf{r}}_j`}</IMath>, according to the relation
                    <IMathBlock>{`\\color{magnet}{\\mathbf{r}}_j(t + \\Delta t) = \\color{magnet}{\\mathbf{r}}_j(t) + v_0 \\Delta t \\left( \\cos \\color{electron}{\\theta}_j(t),\\, \\sin \\color{electron}{\\theta}_j(t) \\right),`}</IMathBlock>
                    where we assume that each fish swims at a constant speed <IMath>v_0</IMath>. Without entering into too many details, this update scheme is very typical in simulations. It is called the <i>Euler method</i>, and can be directly derived from Newton's laws of motion.
                </Paragraph>
            </MoreInformations>
            <FishSchool showSliders={true} title="Fish schools" description={<>
                <Paragraph>
                    Here is a simulation of the <i>Vicsek model</i>. You can change the <IColor type="coupling">interaction strength</IColor> and <IColor type="temperature">noise</IColor> using the sliders. You can also toggle the display of the internal structure of the fishes (the <IColor type="electron">arrows</IColor>) using the checkbox.
                </Paragraph>
            </>} />
            <TheoristQuestions>
                Time from your last job of the day! Try to change the <i>interaction strength</i> and see how it affects the behavior of the fish school. How could we <i>characterize</i> this effect more precisely?
            </TheoristQuestions>
        </Section>

        <Section title="Characterizing the schooliness of fishes">
            <Paragraph>
                As you can see, the fishes start to swim in a <strong>coordinated</strong> manner when the <IColor type="coupling" bold>interaction strength</IColor> is <IColor type="coupling" italic>above</IColor> a certain threshold. To characterize this flocking behavior, we can take a look at the <IColor type="electron">average direction</IColor> of the fishes, the same way as before.
            </Paragraph>
            <Paragraph>
                We again define a <IColor type="electron" bold>mean arrow</IColor> following the same procedure that we already did two times! The  <IColor type="electron">length</IColor> of the arrow now tells us how coordinated the fishes are:
                <ul>
                    <li>If the length is close to <IColor type="magnet-north">one</IColor>, they are all swimming in the <IColor type="magnet-north" italic>same direction</IColor>.</li>
                    <li>If the length is close to <IColor type="magnet-south">zero</IColor>, they are swimming <IColor type="magnet-south" italic>independently</IColor>.</li>
                </ul>
                Finally, you know the deal, let's plot how this <strong>order parameter</strong> evolves as a function of the interaction strength.
            </Paragraph>
            <Note>
                We could also plot it as a function of the noise strength: the two values are directly related!
            </Note>
            <div style={{ height: "25px" }}></div>
            <FishGraph />
            <Paragraph>
                What we observe is a sudden change in the coordination amount at a certain amount of interaction strength... again! <IColor type="magnet-south">Above</IColor> this threshold, fishes swim in a <IColor type="magnet-south" italic>coordinated</IColor> manner, while <IColor type="magnet-north">below</IColor> it, they swim <IColor type="magnet-north" italic>independently</IColor>... again!
            </Paragraph>
        </Section>

        <Separator />
        
        <Section>
            <Paragraph>
                This, is a <strong>phase transition</strong>... again! With just a slightly different model, but with a new physical interpretation, how awesome is that?
                Alright, we could go on with other variations or model applications, but I think you get the point: it's time to wrap up this article.
            </Paragraph>
        </Section>
    </Part>;
}
