import { MathJax } from "better-react-mathjax";
import { Paragraph, Part, Section } from "../logic/text/Article";
import { GradientText, IColor, IMath, MoreInformations, Note, Question, Separator, TheoristQuestions, VSpace } from "../logic/text/TextEffects";
import { Magnet } from "./Part1";
import { Fish } from "./Part3";
import { FirefliesSynchronisation } from "../simulations/2_FirefliesSynchronisation";
import { OneFirefly } from "../simulations/2_OneFirefly";
import { FirefliesOrderParameter } from "../simulations/2_FirefliesOrderParameter";
import { KuramotoGraph } from "../simulations/2_KuramotoGraph";
import { XYModel } from "../simulations/2_XYModel";

export function Firefly(props: { children: string, bold?: boolean, italic?: boolean }) {
    return <GradientText from={[29, 157, 242]} to={[224, 2, 161]} bold={props.bold} italic={props.italic}>{props.children}</GradientText>;
}

export function Part2() {
    return <Part title="...through the synchronized flashing of fireflies...">
        <Section title="Fireflies?">
            <Question>
                Did you ever see <Firefly bold>fireflies</Firefly> <i>flashing in the night</i>? If so, did you notice anything special about them?
            </Question>
            <Paragraph>
                If you did, you might have noticed that their <IColor type="electron" bold>light</IColor> seems to <IColor type="electron" italic>blink</IColor> in a <strong>synchronized</strong> manner, almost like a <i>dance</i>.
            </Paragraph>
            <FirefliesSynchronisation showSliders={false} omegaActivated={true} />
            <Paragraph>
                What if I told you that, using just a <strong>very slightly modified version</strong> of what we just saw, we can explain this synchronized flashing of fireflies?
            </Paragraph>
        </Section>

        <Section title="Extending the Ising model">
            <TheoristQuestions>
                So far, we saw how to describe <Magnet italic bold>magnets</Magnet> using the <i>Ising model</i>.
                <br />
                But I just told you that using a <strong>generalization</strong> of this model, we could also describe <Firefly italic bold>fireflies</Firefly>. Try to think about how we could do this.
            </TheoristQuestions>
            <Paragraph>
                Let's first talk about the Ising model, <i>again</i>. Trust me on this. A core approximation that we did was to consider the <IColor type="electron" bold italic>spins</IColor> of every atoms (their tiny <IColor type="electron" italic>arrows</IColor>) only either pointing <IColor type="magnet-north">up</IColor> or <IColor type="magnet-south">down</IColor>, that is <IMath>S_j = \pm 1</IMath>. However, in real life, spins are not limited to just two values: they can point in <i>any direction</i>.
            </Paragraph>
            <Note>
                Here, we represent 2D spins to simplify the simulations, but the model can be extended to 3D spins.
            </Note>
            <Paragraph>
                To simplify a bit, instead of talking about vectors, we describe each atom by an <IColor type="electron" bold>angle</IColor> to, let's say, the <i>horizontal axis</i>. Therefore, instead of using <IMath>{`\\color{electron}{S}_j`}</IMath> to describe the atom <IMath>j</IMath>, we use the angle <IMath>{`\\color{electron}{\\theta}_j`}</IMath>. What is nice about this, is that now this angle is no longer just <IMath type="magnet-north">\pi/2</IMath> (<IColor type="magnet-north" italic>up</IColor> where <IMath>S_j =\,</IMath><IMath type="magnet-north">+1</IMath>) or <IMath type="magnet-south">-\pi/2</IMath> (<IColor type="magnet-south" italic>down</IColor> where <IMath>S_j =\,</IMath><IMath type="magnet-south">-1</IMath>), but can take <strong>any value</strong> in between, making it continuous.
            </Paragraph>
            <Paragraph>
                We can now rewrite our earlier algorithm as the equation
                <MathJax>{`$$ \\frac{\\mathrm{d}\\color{electron}{\\theta}_j}{\\mathrm{d}t} = \\color{coupling}{K} \\sum_{j' \\mathrm{\\ that\\ are}\\atop \\mathrm{\\ neighbors\\  of\\ } j} \\sin(\\color{electron}{\\theta}_{j'} - \\color{electron}{\\theta}_j). $$`}</MathJax>

                Let's break this down:
                <ul>
                    <li>The notation <IMath>{`\\mathrm{d}\\color{electron}{\\theta}_j/\\mathrm{d}t`}</IMath> means that we are looking at how the <IColor type="electron">angle</IColor> of <IMath>j</IMath> <strong>changes over time</strong>.</li>
                    <li>The term <IMath>{`\\sin(\\color{electron}{\\theta}_{j'} - \\color{electron}{\\theta}_j)`}</IMath> tells us about the <strong>interactions</strong>:
                    <ul>
                        <li>If the angle of <IMath>j</IMath> is <IColor type="magnet-north" bold>larger</IColor> than the angle of <IMath>j'</IMath> (<IMath>j</IMath> is <IColor type="magnet-north" italic>ahead</IColor> of <IMath>j'</IMath>), the sinus is <i>negative</i>, so <IMath>{`\\color{electron}{\\theta}_j`}</IMath> will tend to <IColor type="magnet-north" italic>decrease</IColor>: <IMath>j</IMath> will try to <IColor type="magnet-north" bold>slow down</IColor> for <IMath>j'</IMath>.</li>
                        <li>Conversely, if the angle of <IMath>j</IMath> is <IColor type="magnet-south" bold>lower</IColor> compared to the one of <IMath>j'</IMath> (<IMath>j</IMath> is <IColor type="magnet-south" italic>behind</IColor> <IMath>j'</IMath>), the sinus is <i>positive</i>, so <IMath>{`\\color{electron}{\\theta}_j`}</IMath> will tend to <IColor type="magnet-south" italic>increase</IColor>: <IMath>j</IMath> will try to <IColor type="magnet-south" bold>catch up</IColor> with <IMath>j'</IMath>.</li>
                    </ul></li>
                    <li>The <i>positive</i> <IColor type="coupling" italic bold>interaction strength constant</IColor> <IMath>{`\\color{coupling}{K}`}</IMath> measures how strongly the neighbors <IColor type="coupling" italic>influence</IColor> each other. If <IMath>K</IMath> is large, the arrows will tend to align more quickly than if it's small.</li>
                </ul>
            </Paragraph>
            <XYModel showTSlider={false} title="2D Ising Model" description={<>
                <Paragraph>
                    Here below is the simulation of this <i>2D Ising model</i>, where each atom is represented as an <IColor type="electron" italic>arrow</IColor>.
                    Try to change the <IColor type="coupling" italic>interaction strength</IColor> <IMath type="coupling">K</IMath> using the <IColor type="coupling" italic>slider</IColor>, and see what happens.
                </Paragraph>
            </>} />
            <Paragraph>
                And... I think that we forgot about our last, and most important, ingredient!
            </Paragraph>
            <Question>
                Where is the <IColor type="temperature">temperature</IColor>?
            </Question>
            <Paragraph>
                To add it, we can simply add a term in <IMath>{`\\sqrt{\\color{temperature}{T}}`}</IMath> times a factor <IMath>\eta(t)</IMath>. This <IMath>\eta(t)</IMath> term will <IColor type="electron">randomly</IColor> change the <IColor type="electron">angle</IColor> of each atom at each time <IMath>t</IMath>, simulating the effect of <IColor type="temperature" italic>thermal fluctuation</IColor>.
            </Paragraph>
            <MoreInformations title="Temperature dependence">
                <Paragraph>
                    The fact that we took the <i>square root</i> of the temperature is a bit technical, but it is a common way to model thermal fluctuations in physics. These types of equations are called <strong>stochastic spin dynamics</strong>, and here more particularly, the <i>Langevin-Landau-Gilbert</i> equation.
                </Paragraph>
            </MoreInformations>
            <Paragraph>
                So our final equation becomes the so-called <strong>XY model</strong>
                <MathJax>{`$$ \\frac{\\mathrm{d}\\color{electron}{\\theta}_j}{\\mathrm{d}t} = \\color{coupling}{K} \\sum_{j' \\mathrm{\\ that\\ are}\\atop \\mathrm{\\ neighbors\\  of\\ } j} \\sin(\\color{electron}{\\theta}_{j'} - \\color{electron}{\\theta}_j) + \\eta(t) \\sqrt{\\color{temperature}{T}}. $$`}</MathJax>
            </Paragraph>
            <XYModel showTSlider={true} title="XY Model" description={<>
                <Paragraph>
                    The same model as before, but now with the <IColor type="temperature" italic>temperature</IColor> <IMath type="temperature">T</IMath>. Try to play with these <i>two sliders</i>. Now, the arrows should be <IColor type="temperature" italic>moving around</IColor>.
                </Paragraph>
            </>} />
            <Paragraph>
                As I don't want to go into too much detail in this article, let's continue by <i>finally</i> talking about... <Firefly italic bold>fireflies</Firefly>!
            </Paragraph>
            <MoreInformations title="BKT transition">
                <Paragraph>
                    The main difference with the previous 1D Ising model is that the XY model has a <i>continuous symmetry</i>, meaning that the arrows can point in <strong>any direction</strong>, not just up or down.
                </Paragraph>
                <Paragraph>
                    A mathematical theorem known as the <i>Mermin-Wagner theorem</i>, explains why this continuous symmetry is important:
                    <ul>
                        <li>For <IColor type="electron" italic>3D spins</IColor>, we recover a phase transition <i>pretty similar</i> to the Ising one.</li>
                        <li>For <IColor type="electron" italic>2D spins</IColor>, however, a new phase transition appears, called the <i>Berezinski-Kosterlitz-Thouless</i> (BKT) transition, which is a bit more subtle than the one we saw in the Ising model. It is no longer a simple change from <IColor type="coupling" italic>ordered</IColor> to <IColor type="coupling" italic>disordered</IColor>, but rather a <strong>change in the nature of the order itself</strong>.</li>
                    </ul>
                </Paragraph>
            </MoreInformations>
        </Section>

        <Section title="The synchronisation of fireflies">
            <TheoristQuestions>
                That's very nice, but <i>what does it have to do with fireflies?</i>
                <br />
                Let's start by thinking about it for a bit.
            </TheoristQuestions>
            <Paragraph>
                First let's change our perspective a little. Instead of thinking of a <Firefly>firefly</Firefly> as a complex organism, we can think of it as a little <IColor type="electron" bold>arrow</IColor> that constantly rotates. When it is, let's say, pointing <IColor type="electron" italic>up</IColor>, the firefly <IColor type="electron" italic>flashes</IColor>.
            </Paragraph>
            <Paragraph>
                So now, synchronisation of flashes of fireflies can be seen as if the little <IColor type="electron" italic>arrows</IColor> of the fireflies are <IColor type="electron" bold>trying to align</IColor> with each other... And this is exactly what the <strong>XY model</strong> describes!
            </Paragraph>
            <Note>
                Biologically, fireflies try to <strong>mimic</strong> the flashing rate of their neighbors. This occurs to be a strategy to maximize the chances of <strong>finding a mate</strong>, or reduce <strong>predation risk</strong>: a predator seeing a whole group of flashing fireflies might be confused, and not be able to focus on a single one.
            </Note>
            <OneFirefly title="One Firefly" description={<>
                <Paragraph>
                    One firefly is represented by a <IColor type="electron" italic>rotating arrow</IColor>. When the arrow is <i>up</i>, it <i>flashes</i>.
                    <br />
                    Try to change the <IColor type="temperature" italic>noise</IColor> <IMath type="temperature">T</IMath> using the slider to see how much the arrow is <IColor type="temperature" italic>shaken around</IColor>.
                </Paragraph>
            </>} />
            <Paragraph>
                We can then use the same model as for <Magnet>magnetism</Magnet>, with a slight change of perspective:
                <ul>
                    <li><Firefly bold>Fireflies</Firefly> are not atoms arranged in a regular grid. They can <strong>freely move</strong> in all directions. Moreover, a neighbor of a firefly is now described as any other firefly that is <strong>close enough</strong> to it.</li>
                    <li>The <IColor type="temperature" italic bold>noise</IColor> <IMath type="temperature">T</IMath>, previously represented <i>how much the arrows were shaken</i> around due to <IColor type="temperature" italic>temperature</IColor> fluctuations. Now, this <IColor type="temperature" italic>noise</IColor> describes how much the fireflies are <IColor type="temperature" bold>independent</IColor>.</li>
                    <li>The <IColor type="coupling" bold>interaction strength</IColor> <IMath type="coupling">K</IMath> now describes <IColor type="coupling" italic>how strongly</IColor> a given firefly wants to <IColor type="coupling" italic>align</IColor> with its neighbors.</li>
                </ul>
                And... that's it! Just a change of interpretation, nothing more.
            </Paragraph>
            <FirefliesSynchronisation showSliders={true} omegaActivated={false} title="Fireflies Synchronisation" description={<>
                <Paragraph>
                    Here is the simulation of the fireflies described by our model.
                    <br />
                    You can change the <IColor type="temperature" italic>noise</IColor> and the <IColor type="coupling" italic>interaction strength</IColor> using the two sliders, and <IColor type="electron" italic>tick the box</IColor> to show the individual <IColor type="electron" italic>arrows</IColor> of each firefly.
                </Paragraph>
            </>} />
            <Question>
                Hum... why are they never flashing?
            </Question>
            <Paragraph>
                Oops! We forgot to add in our equation that each little arrow now <IColor type="electron" italic>rotates continuously</IColor> over time. We write the  <IColor type="electron" bold>speed</IColor> of the rotation of each firefly as <IMath>{`\\color{electron}{\\omega}_j`}</IMath>. So let's add this to our model that becomes
                <MathJax>{`$$ \\frac{\\mathrm{d}\\color{electron}{\\theta}_j}{\\mathrm{d}t} = \\color{electron}{\\omega}_j + \\color{coupling}{K} \\sum_{j' \\mathrm{\\ that\\ are}\\atop \\mathrm{\\ neighbors\\  of\\ } j} \\sin(\\color{electron}{\\theta}_{j'} - \\color{electron}{\\theta}_j) + \\eta(t) \\sqrt{\\color{temperature}{T}}.$$`}</MathJax>
            </Paragraph>
            <Note>
                Here, we took the frequency <IMath>\omega_j</IMath> of each firefly from a <i>Gaussian distribution</i>.
            </Note>
            <FirefliesSynchronisation showSliders={true} omegaActivated={true} title="Fireflies Synchronisation" description={<>
                <Paragraph>
                    The same as before, but now with the <IColor type="electron" italic>intrinsic rotation</IColor> of each firefly activated.
                    <br />
                    Try to play with the <IColor type="coupling" italic>interaction strength slider</IColor> and see what happens!
                </Paragraph>
            </>} />
            <Note>
                In this simulation, the <i>constant displacement</i> of each firefly isn't relevant. I just added it to make the simulation more visually appealing.
            </Note>
            <Paragraph>
                If you paid attention, you just saw that the fireflies start to flash in <IColor type="magnet-north">unison</IColor> when the <IColor type="coupling" italic>interaction strength</IColor> is <IColor type="magnet-north">large</IColor> enough. However, <IColor type="magnet-south">below</IColor> a certain threshold, they suddenly stop synchronizing and flash <IColor type="magnet-south">independently</IColor>. Does this remind you of something? Again, a <strong>phase transition</strong>!
            </Paragraph>
            <TheoristQuestions>
                So now, how do we <i>characterize</i> this?
                <br />
                How do we know when the fireflies are <i>synchronized</i> or <i>not</i>?
            </TheoristQuestions>
            <Paragraph>
                The first thing that we can do is put <IColor type="electron">each arrow</IColor> on one big circle, to see how they are distributed.
            </Paragraph>
            <FirefliesOrderParameter drawOrderParameter={false} title="Order parameter" description={<>
                <Paragraph>
                    The same simulation as before, but we now only draw the <IColor type="electron">arrows</IColor> of each firefly on a <strong>circle</strong>. This allows us to see how the arrows are distributed.
                    <br />
                    Try to change the <IColor type="coupling">interaction strength</IColor> using the slider.
                </Paragraph>
            </>} />
            <Paragraph>
                To measure the amount of synchronisation, we can use the same idea as before and define a sort of <IColor type="electron" italic>mean arrow</IColor>. The length of the arrow now tells us <i>how synchronized the fireflies</i> are: if it is close to <IMath type="magnet-north">1</IMath>, they are all flashing in <IColor type="magnet-north" bold italic>unison</IColor>. However, if it is closer to <IMath type="magnet-south">0</IMath>, they are flashing <IColor type="magnet-south" bold italic>independently</IColor>.
            </Paragraph>
            
            <MoreInformations title="Mathematical definition">
                <Paragraph>
                    Mathematically, we can define this <IColor type="electron" bold>mean arrow</IColor> as a <strong>complex number</strong> <MathJax inline>{`$\\color{electron}{R} \\mathrm{e}^{\\mathrm{i}\\Phi}$`}</MathJax>, where <IMath type="electron">R</IMath> is the length of the arrow and <IMath>\Phi</IMath> is its angle
                    <MathJax>{`$$\\color{electron}{R} \\mathrm{e}^{\\mathrm{i}\\Phi} = \\frac{1}{N} \\sum_{j=1}^N e^{\\mathrm{i} \\color{electron}{\\theta}_j}.$$`}</MathJax>
                </Paragraph>
                <Paragraph>
                    So why not simply take the <IColor type="electron" italic>average of the angles</IColor>? Because angles are <IColor type="electron" bold>periodic</IColor>, meaning that if we take the <i>average</i> of two angles that are close to <IMath>0</IMath> and <IMath>2\pi</IMath>, we would get something close to <IMath>\pi</IMath>, which is <i>not what we want</i>. Instead, we use <strong>complex numbers</strong> to represent the angles, which allows us to take into account this <IColor type="electron" bold>periodic nature</IColor>.
                </Paragraph>
            </MoreInformations>
            <VSpace />
            <FirefliesOrderParameter drawOrderParameter={true} title="Order parameter" description={<>
                <Paragraph>
                    Same as before, but now we also draw the <strong>mean arrow</strong> in white that represents the <i>amount of synchronisation</i>.
                </Paragraph>
            </>} />
            <Paragraph>
                Then, you guessed it, let's measure this <strong>synchronisation amount</strong> (the length of the mean arrow) for different values of the <IColor type="coupling">interaction strength</IColor>.
            </Paragraph>
            <Note>
                You can also do this for the <i>noise</i>, but will see that it is not as interesting. Here, the main parameter that drives the phase transition, the order parameter, is the <i>interaction strength</i>.
            </Note>
            <div style={{ height: "35px" }}></div>
            <KuramotoGraph title="Synchronisation measurement" description={<Paragraph>
                <strong>Try clicking</strong> on the graph to see how the fireflies synchronisation amount changes varies with the <IColor type="coupling">interaction strength</IColor>.
            </Paragraph>} />
            <Paragraph>
                Again, what you see is what we observed earlier. There is a <strong>sudden change</strong> in the synchronisation amount at a certain interaction strength. <IColor type="magnet-south" italic>Below</IColor> this value, the fireflies are <IColor type="magnet-south" italic>not synchronized</IColor>, while <IColor type="magnet-north" italic>above</IColor> it, they <IColor type="magnet-north" italic>flash in unison</IColor>.
            </Paragraph>
            <Paragraph>
                What we observe is then another... <strong>phase transition</strong>! You guessed it.
            </Paragraph>
            <Note>
                This model, called the Kuramoto model, can also be used to describe many other systems, such as neurons firing in the brain, or even the synchronisation of power grids.
            </Note>
        </Section>
        
        <Separator />

        <Section>
            <Paragraph>
                Let's recap what we have learned so far. Magnets, fireflies, neurons, power grids... all these systems can be described by a very similar model. And they all exhibit something called a <strong>phase transition</strong> for a certain parameter (<i><IColor type="temperature">temperature</IColor>, <IColor type="coupling" italic>interaction strength</IColor>, etc.</i>) which consist of a sudden change in their behavior.
            </Paragraph>
            <Paragraph>
                To finish with this article, let's take a look at one last example, which is for me the most visually striking one, <Fish bold>fishes</Fish>.
            </Paragraph>
        </Section>
    </Part>
}
