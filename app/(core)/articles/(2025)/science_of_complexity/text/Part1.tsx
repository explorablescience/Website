import { Simulation3DMagnets } from "../simulations/1_Simulation3DMagnets";
import { CheckList, Citation, GradientText, GraphList, IMath, MoreInformations, Note, Question, Separator, IColor, TheoristQuestions, VSpace, IMathBlock } from "../logic/text/TextEffects";
import { Paragraph, Part, Section } from "../logic/text/Article";
import { ZoomingOnMagnet } from "../simulations/1_ZommingOnMagnet";
import { MagnetsInteraction } from "../simulations/1_MagnetsInteraction";
import { IsingSimulation } from "../simulations/1_IsingSimulation";
import { IsingMagnetizationGraph } from "../simulations/1_IsingMagnetizationGraph";

export function Magnet(props: { children: string, bold?: boolean, italic?: boolean }) {
    return <GradientText from={[255, 50, 53]} to={[41, 57, 226]} bold={props.bold} italic={props.italic}>{props.children}</GradientText>;
}

export function Part1() {
    return <Part title="From the physics of magnetism...">
        <Section title="What is a magnet?">
            <Paragraph>
                Before diving into the <strong>science of complexity</strong>, let's start by exploring a simple yet fascinating example: <Magnet bold>magnets</Magnet>. You will see that this example is not only interesting in itself, but also serves as a perfect introduction.
            </Paragraph>
            <Question>
                What is a magnet? Really, try to give a definition.
            </Question>
            <Paragraph>
                Your first instinct might be something like
            </Paragraph>
            <Citation>
                A magnet is an object with a <IColor type="magnet-north" italic>north</IColor> and a <IColor type="magnet-south" italic>south</IColor> pole that attracts or repels other magnets.
            </Citation>
            <Simulation3DMagnets
                title={"Magnets attraction and repulsion"}
                description={
                    <>
                        <Paragraph>Here below is the first <strong>interactive simulation</strong> of this article.
                        <br />
                        Use the <IColor type="magnets-slider" bold>slider</IColor> to change the <IColor type="magnets-slider" italic>distance between the magnets</IColor>, and release it to see the effect. You can also <Magnet bold>click on a magnet</Magnet> to change its <Magnet italic>orientation</Magnet>.</Paragraph>
                    </>
                }/>
            <Question>
                But let's ask again: What is a magnet, really?
            </Question>
            <Paragraph>
                I'm not sure about you, but I find this definition a bit unsatisfactory. Moreover, this definition doesn't explain some properties:
                <ul>
                    <li>Do you know that, when you <i><strong>cut a magnet in half</strong></i>, you don't end up with a <i>positive half</i> and a <i>negative half</i>? Instead, you get <Magnet italic>two smaller magnets</Magnet>, each with its own positive and negative pole. Why is that?</li>
                    <li>Have you noticed that when a <Magnet>magnet</Magnet> gets <IColor type="temperature" bold>hot</IColor>, it stops working? Why does this happen?</li>
                </ul>
            </Paragraph>
            <Paragraph>
                In this first part, we'll explore all of these. As you'll see, the explanation is more subtle than it might appear, and it will lead us into some fascinating concepts in physics.
            </Paragraph>
        </Section>

        <Section title="Zooming into matter">
            <ZoomingOnMagnet
                title="Zooming on a magnet"
                description={<Paragraph>
                    Let's try to discover the secrets of a magnet by <i>zooming in</i> to uncover what lies inside.
                    Use the <IColor type="zoom-slider" bold>slider</IColor> below to zoom in and out.
                </Paragraph>}
                zoomDataLevel={[
                    [0.0, <>A simple <Magnet bold>magnet</Magnet> with a <IColor type="magnet-north" italic>positive</IColor> and <IColor type="magnet-south" italic>negative</IColor> pole.</>, 6.0],
                    [0.3, <>A simple <Magnet bold>magnet</Magnet> with a <IColor type="magnet-north" italic>positive</IColor> and <IColor type="magnet-south" italic>negative</IColor> pole.</>, 0.65],
                    [0.5, <>Each <Magnet italic>magnet</Magnet> is made of atoms arranged in a <strong>very specific, orderly way</strong>.</>, 0.65],
                    [0.7, <>Each <strong>atom</strong> in the magnet can be seen as a <strong>tiny arrow-like <Magnet>magnet</Magnet></strong>, where the <IColor type="magnet-north" bold italic>tip</IColor> of the arrow indicates the <IColor type="magnet-north" bold italic>north</IColor>.</>, 0.38],
                    [1.0, <>Each <strong>atom</strong> in the magnet can be seen as a <IColor type="electron" bold italic>tiny arrow-like</IColor> magnet, where the <i>tip</i> of the arrow indicates the <i>north</i>.</>, 0.38],
                ]} />
            <Question>
                So... are atoms really tiny magnets?
            </Question>
            <Paragraph>
                I mean... <i>sort of!</i> In fact, there are two different sources of magnetism in an atom:
                <ul>
                    <li>Each <strong>electron</strong> has a property called <IColor type="electron" bold>spin</IColor>. Imagine it as a <IColor type="electron" bold italic>tiny arrow</IColor> attached to the electron, pointing in a certain direction <i>... although the electron doesn't literally spin</i>. This arrow is then capable of producing its <i>own magnetism</i>, just like a tiny magnet.</li>
                    <li><strong>Electrons</strong> also <IColor type="electron" bold italic>move around</IColor> the nucleus. Since a <i>moving electric charge</i> creates <i>magnetism</i> (this is what's called <i>induction</i>), this motion also contributes to the atom's overall magnetism.</li>
                </ul>

                In short, let's simplify and think of <strong>atoms</strong> as <strong>tiny arrow-shaped magnets</strong>. The <IColor type="magnet-north" bold italic>tip</IColor> of the arrow points to the <IColor type="magnet-north" bold italic>north</IColor>, and the <IColor type="magnet-south" bold italic>tail</IColor> points to the <IColor type="magnet-south" bold italic>south</IColor>.
            </Paragraph>
            <Paragraph>
                Now, a magnet contains an enormous number of atoms... and even more electrons! So the real question is
            </Paragraph>
            <Question>
                How do all these <strong>tiny arrows</strong> end up <strong>working together</strong>? Shouldn't they just point in random directions, canceling each other out? And this is where the magic starts.
            </Question>
            <MagnetsInteraction title="Magnets Interaction" description={<>
                <Paragraph>
                    Try to change the orientation of the <IColor type="electron" bold>central atom's spin</IColor> using the <IColor type="electron-slider" italic>slider</IColor> below, and see how the other spins react.
                </Paragraph>
            </>} />
            <Paragraph>
                As you can see, <IColor type="electron" bold italic>atom's spins</IColor> prefer to point in the <IColor type="electron" italic bold>same direction</IColor> as their neighbors.
            </Paragraph>
            <MoreInformations title="A deeper look">
                <Paragraph>
                    To understand why, we need to dip into the realm of <i>quantum physics</i>. At very small scales, <IColor type="particle" bold>particules</IColor> are not just tiny balls: they are described by a mathematical object called a <IColor type="particle" bold>wave function</IColor>. Think of it as a sort of fuzzy cloud that represents the <IColor type="particle" italic>probability</IColor> of finding the particle at a certain place. Like water waves, two wave functions can interfere, combining to form bigger waves or canceling each other out.
                </Paragraph>

                <Paragraph>
                    Since <IColor type="electron" bold>electrons</IColor> all carry the same <IColor type="electron" italic>negative charge</IColor>, they repel each other. In a solid, the <strong>Pauli exclusion principle</strong> forces their wave functions into certain arrangements. In some cases, the lowest-energy state occurs when neighboring <IColor type="electron" bold>spins are aligned</IColor>. This effect is called the <i>exchange interactions</i>. It is not a new "fundamental" force, but rather a consequence of the wave nature of particles and their interactions.
                </Paragraph>
            </MoreInformations>
            <TheoristQuestions>
                Ok, that's a lot to take in. Let's put on our theorist hat. <i>How could we <strong>summarise</strong> what we have learnt so far, simplifying as much as possible, without loosing the essence of the physics behind?</i>
                <VSpace />
                Try to think about it a bit. These parts are the real challenge of this article!
            </TheoristQuestions>
            <Paragraph>
                Let's strip this down to its essence.
                A <Magnet bold>magnet</Magnet> consists of <i>many atoms</i> arranged in a <i>regular pattern</i>.
                <ul>
                    <li>Suppose we have <i><IMath>N</IMath> atoms</i>, that we identify using the letter <IMath>j</IMath> that runs from <IMath>1</IMath> to <IMath>N</IMath>.</li>
                    <li>To simplify, we model each atom as a single arrow pointing in a given direction. We call this the atom's <IColor type="electron" bold>spin</IColor>, and write it as <IMath type="electron">S_j</IMath>.</li>
                    <li>Let's make it even simpler: Suppose each arrow can only point <IColor type="magnet-north" bold>up</IColor> that we write as <IMath>S_j =\,</IMath><IColor type="magnet-north"><IMath>+1</IMath></IColor>, or <IColor type="magnet-south" bold>down</IColor> where <IMath>S_j =\,</IMath><IMath type="magnet-south">-1</IMath>.</li>
                    <li>Finally, we describe the evolution of our system over time by saying that each spin prefers to <strong>align</strong> with its nearest neighbors.</li>
                </ul>
            </Paragraph>
            <MoreInformations title="Energy minimization">
                <Paragraph>
                    In physics, a core principle is that systems tend to <i>minimize their energy</i>. In our case, the <strong>energy</strong> of a given atom <IMath>j</IMath> can be written as
                    <IMathBlock>{`E_j = - J \\sum_{j'\\ \\in\\ \\mathrm{neighbors\\  of\\ } j} S_j\\, S_{j'},`}</IMathBlock>
                    where <IMath>J</IMath> is a positive constant that represents the <i>strength of the interaction between neighboring arrows</i>. From this relation, if <IMath>S_j</IMath> and <IMath>{`S_\{j'\}`}</IMath> are aligned (both <IMath type="magnet-north">+1</IMath> or both <IMath type="magnet-south">-1</IMath>), the energy is <i>negative</i>, meaning that this configuration is <i>better for the system</i>. If they are opposite, the energy is <i>positive</i>. This means that, as we wanted, the system <strong>prefers to align</strong> the <IColor type="electron" bold>spins</IColor>.
                </Paragraph>

                <Paragraph>
                    In quantum mechanics, <strong>energy minimization</strong> is a fundamental principle. Instead of talking about the total energy <IMath>E</IMath> of the system, we use the letter <IColor type="electron" bold>H</IColor> and call it the <IColor type="electron" bold>Hamiltonian</IColor>. Here, it is the sum of the energies of all the atoms in the system:
                    <IMathBlock>{`H = - J \\sum_{j=1}^N \\sum_{j'\\, \\in\\, \\mathrm{neighbors\\  of\\ } j} S_j\\, S_{j'}.`}</IMathBlock>
                </Paragraph>
            </MoreInformations>
            <Question>
                But how do we actually <strong>measure</strong> the magnetism of a magnet?
            </Question>
            <Paragraph>
                For this, we need to define the <Magnet italic>total magnetization</Magnet> that we write as <IMath>M</IMath>, which is what we usually mean when we talk about <strong>how strong</strong> a magnet is and in <strong>which direction</strong> it is pointing. It is simply the average of all the spins' orientations, <i>a sort of average arrow</i>, defined as
                <IMathBlock>{`M = \\frac{1}{N} \\sum_{j=1}^N S_j.`}</IMathBlock>
            </Paragraph>
            <Note>
                The division by <IMath>N</IMath> keeps <IMath>M</IMath> between <IMath type="magnet-north">+1</IMath> and <IMath type="magnet-south">-1</IMath>, making it easy to interpret.  Again, the <IColor type="magnet-north" bold italic>tip</IColor> of the arrow points to the <IColor type="magnet-north" bold italic>north</IColor>, and the <IColor type="magnet-south" bold italic>tail</IColor> points to the <IColor type="magnet-south" bold italic>south</IColor>.
            </Note>
            <Paragraph>
                <strong>And... voilà!</strong> We can now summarize our model into a simple algorithm:
                <GraphList items={[
                    <><strong>Pick</strong> a random atom <IMath>j</IMath> anywhere in the grid.</>,
                    <><strong>Consider flipping its arrow</strong>, but don't actually do it yet. First, check how this change would affect the system.
                        <ul>
                            <li>If the flip <i>increases</i> alignment with neighbors, <strong>accept</strong> it.</li>
                            <li>If it <i>decreases</i> alignment, <strong>reject</strong> it.</li>
                        </ul></>,
                    <><strong>Repeat</strong> many times.</>
                ]} customWidth={{ arrow: "24px", bar: "37px" }} />
            </Paragraph>
            <IsingSimulation title="Magnets simulation" description={<Paragraph>
                This is a <strong>simulation</strong> of the model we just built. It shows a grid of arrows, each representing an <i>atom's spin</i>. A <IColor type="magnet-north">red</IColor> arrow represents a spin pointing <IColor type="magnet-north" bold>up</IColor> (<IMath>{`S_j =\\,`}</IMath><IMath type="magnet-north">+1</IMath>), while a <IColor type="magnet-south">blue</IColor> arrow represents a spin pointing <IColor type="magnet-south" bold>down</IColor> (<IMath>{`S_j =\\,`}</IMath><IMath type="magnet-south">-1</IMath>).
                <VSpace />
                Finally, the <strong>big arrow</strong> on the side represents the <Magnet italic bold>total magnetization</Magnet> <IMath>M</IMath> of the system, which is the average of all the spins' orientations. The <i>bigger</i> it is, the <i>stronger</i> the magnet.
            </Paragraph>} />

            <Paragraph>
                Nice, we have our model... <strong>or do we really?</strong> Let's look at our <Magnet>checklist</Magnet> of what we wanted to simulate:
                <CheckList items={[
                    { label: "North and south poles.", checked: true, description: "The magnetization, represented by the big arrow." },
                    { label: "Attraction and repulsion between magnets.", checked: true, description: "If we had another magnet, their big arrows would tend to align together." },
                    { label: "Cutting a magnet in two.", checked: true, description: "Each half still has its own big arrow, so each is still a magnet." },
                    { label: "Magnets stop working when hot.", checked: false }
                ]}></CheckList>
            </Paragraph>
            <Paragraph>
                Shoot! We still have one thing to explain.
            </Paragraph>
            <Question>
                Why does <IColor type="temperature">heating</IColor> destroy magnetism?
            </Question>
            <TheoristQuestions>
                <i>That's how theory works!</i>
                <br />
                You build a model, see where it matches reality, and then notice where it doesn't. You then try to <strong>fix</strong> the model by <strong>adding new elements</strong> that you think will help.
                <VSpace /><VSpace />
                So here's your challenge: <i>How would you add <IColor type="temperature">temperature</IColor> to our model? What effect would it have on each arrow?</i>
            </TheoristQuestions>
        </Section>

        <Section title="The crucial role of temperature">
            <Paragraph>
                <IColor type="temperature" bold>Temperature</IColor>, that we will write using the letter <IMath type="temperature">T</IMath>, can be thought of as <i>shaking the arrows</i>. In this article, we will call it, more generally, <IColor type="temperature" bold>noise</IColor>. The <i>higher the temperature</i>, the more the <i>spins jostle</i>.
            </Paragraph>
            <Paragraph>
                In our model, to include temperature, we imagine the system evolving according to the following steps:
                <GraphList items={[
                    <><strong>Pick</strong> a random atom <IMath>j</IMath> anywhere in the grid.</>,
                    <><strong>Consider flipping its arrow</strong>, but don't actually do it yet. First, check how this change would affect the system.
                    <ul>
                        <li>If the flip <i>increases</i> alignment with neighbors, <strong>accept</strong> it.</li>
                            <li>If it <i>decreases</i> alignment, don't reject it outright. Instead, generate a <IColor type="temperature">random number</IColor> that depends on <IMath type="temperature">T</IMath>. At <i>higher</i> temperatures, this number is more likely to be <i>large</i>. If the random number exceeds a threshold, <i>accept it.</i> This represents the effect of <IColor type="temperature" bold italic>thermal fluctuations</IColor> that can sometimes overcome the alignment.</li>
                    </ul></>,
                    <><strong>Repeat</strong> many times.</>
                ]} />
            </Paragraph>
            <Note>
                These algorithms are called Monte-Carlo simulations, powerful methods in physics.
            </Note>
            <Paragraph>
                <i>Enough theory!</i> Let's see what happens with temperature in practice.
            </Paragraph>
            <IsingSimulation title="Ising Model" description={<Paragraph>
                The implementation of the above algorithm.
                <br />
                Try to change the <IColor type="temperature" italic>temperature</IColor> using the <IColor type="temperature" italic>slider</IColor> below. 
            </Paragraph>} useTemperature />
            <Paragraph>
                That's better! At <i>high</i> temperature, the arrows are jumbled, and the total magnetization is <i>zero</i> as before. However, <i>below</i> a certain <IColor type="temperature" italic bold>critical temperature</IColor>, the arrows suddenly align, and the total magnetization becomes large: <IColor type="temperature" italic bold>we have a magnet</IColor>!
            </Paragraph>
            <Note>
                We also observe <strong>patches</strong> of aligned spins below this critical value. These patches are called <strong>magnetic domains</strong>,  and are a <a href="https://en.wikipedia.org/wiki/Magnetic_domain">key feature of real magnets</a>. Our model even made a new prediction that is experimentally found!
            </Note>
            <Paragraph>
                Now, let's try to better characterize what's happening. To do this, we will measure the <IColor type="magnet" italic>total magnetization</IColor> more precisely for different <IColor type="temperature" italic>temperatures</IColor> and plot it on a graph.
            </Paragraph>
            <IsingMagnetizationGraph title="Magnetization temperature variation" description={<Paragraph>
                <strong>Try clicking</strong> on the graph to see how the magnets internal structure changes and how the total magnetization varies with temperature.
            </Paragraph>} />
            <Paragraph>
                We observe what we saw earlier: there is a <strong>sudden change</strong> in the magnetization starting from a certain <IColor type="temperature" bold italic>critical temperature</IColor>:
                <ul>
                    <li><IColor type="temperature" bold>Below</IColor>, the magnet is <IColor type="magnet" italic>ordered</IColor>, and <IMath type="magnet">M \simeq \pm 1</IMath>. This means that the arrows are aligned, and the magnet <i>works</i>.</li>
                    <li><IColor type="temperature" bold>Above</IColor>, it is <IColor type="magnet" italic>disordered</IColor>, and <IMath type="magnet">M \simeq 0</IMath>. This means that the arrows are jumbled, and the magnet <i>doesn't work</i>.</li>
                </ul>

                This process is called a <strong>phase transition</strong>, and it is a fundamental concept in physics.
                Here, it explains why magnets stop working when overheated: the <IColor type="temperature" italic>thermal fluctuations</IColor> become so strong that they win compared to the <IColor type="magnet" italic>alignment of the arrows</IColor>, leading to a <i>disordered</i> state and killing the magnetism.
            </Paragraph>
            <Note>
                The model we used here is called the <strong>Ising model</strong>. Despite its simplicity, it is a <strong>cornerstone</strong> of statistical physics and complexity science. A lot of research has been and continues to be conducted on this model and its variants.
            </Note>
            <Paragraph>
                There are <i>a lot</i> of phase transitions in nature, as we will see in the rest of this article: <strong>You even know one!</strong> It occurs while boiling water: At 100°C, when the water <i>abruptly</i> changes from liquid to a gas.
            </Paragraph>
        </Section>

        <Separator />

        <Section>
            <Paragraph>
                To finish this first part, let me insist again on what we just saw. <Magnet>Magnets</Magnet> are made of countless atoms, each with its own tiny magnetic <IColor type="electron" bold>arrow</IColor> that we call <IColor type="electron" bold>spin</IColor>.
                <VSpace />
                <VSpace />
                A priori, we expected that these arrows would point in <strong>random directions</strong>, canceling each other out.
                However, this is only what happens at <IColor type="temperature" bold>high</IColor> temperature. <IColor type="temperature" bold>Below</IColor> a certain temperature, the atoms' spins suddenly start to <strong>cooperate and work together</strong>, aligning themselves in the same direction and as a result producing what we usually call <Magnet italic bold>magnets</Magnet>. This sudden change is called a <strong>phase transition</strong> and is a fundamental concept in physics.
            </Paragraph>
            <IsingSimulation title="Ising Model" useTemperature />
            <Paragraph>
                We saw that even with constant <IColor type="temperature" italic>noise</IColor>, a <strong>collective order</strong> can emerge. This is a key idea in the <i>science of complexity</i>:
            </Paragraph>
            <Citation>
                <Magnet bold>Simple rules</Magnet> at the scale of a <i>few individuals</i> can give rise to rich and <Magnet bold>complex</Magnet> organizational patterns at <i>large scales</i>.
            </Citation>
        </Section>
    </Part>;
}
