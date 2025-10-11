import { Paragraph, Part, Section } from "../logic/text/Article";
import { IsingSimulation } from "../simulations/1_IsingSimulation";
import { FirefliesSynchronisation } from "../simulations/2_FirefliesSynchronisation";
import { FishSchool } from "../simulations/3_FishSchool";
import styles from "./Conclusion.module.css";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { IColor, Separator, Sources } from "../logic/text/TextEffects";
import { Firefly } from "./Part2";
import { Fish } from "./Part3";
import { Magnet } from "./Part1";
import errorStyles from '../logic/simulations/SimulationError.module.css';
import { onReactError } from "@/app/api/client/logger";

function ConclusionSimulationsDivError() {
    const { resetBoundary } = useErrorBoundary();

    return <div className={errorStyles['error-simulation']}>
        <p>Something went wrong with the simulations.</p>
        <button onClick={resetBoundary}>Try again</button>
    </div>;
}

function ConclusionSimulationsDiv() {
    return <ErrorBoundary FallbackComponent={ConclusionSimulationsDivError} onError={onReactError}>
        <div className={styles['conclusion-simulations-div']}>
            <IsingSimulation />
            <FirefliesSynchronisation omegaActivated={true} showSliders={false} conclusion />
            <FishSchool showSliders={false} conclusion />
        </div>
    </ErrorBoundary>;
}

export function Conclusion() {
    return <Part title="Conclusion" className={styles['conclusion-part']}>
        <Section>
            <Paragraph>
                In this article, we explored three different examples of systems in nature: <Magnet>magnets</Magnet>, <Firefly>fireflies</Firefly> and <Fish>fishes</Fish>. A priori, these systems are very different and do not have much in common. Every individual in a system should behave in a completely <strong>independent</strong> manner, and should have its own specific <i>rules</i> and <i>behavior</i>.
            </Paragraph>
            <ConclusionSimulationsDiv />
            <Paragraph>
                However, if we vary a given parameter (<IColor type="temperature" italic>temperature</IColor>, <IColor type="coupling" italic>interactions</IColor>, <IColor type="temperature" italic>noise</IColor>), we observe that below (or above) a certain value, the individuals behave <IColor type="magnet-north">independently</IColor>, while above (or below), they <IColor type="magnet-south">coordinate</IColor> with each other. This common phenomenon is what we call a <strong>phase transition</strong>. It is a universal behavior that is found everywhere in nature, with magnets, fireflies, fishes, birds, herds of animals, and even humans!
            </Paragraph>
            <Paragraph>
                And what we did in this article is pretty impressive! Using a common set of rules and a common mathematical model, we were able to explain very different behaviors of very different systems by <strong>very similar mechanisms</strong>. <i>This</i> is the power of <Fish>theoretical physics</Fish>!
            </Paragraph>
            <Paragraph>
                I also hope that you understand a bit more the <i>scientific method</i> and especially <strong>how theorists work</strong>, as it is often a gray zone for many: they build models for a given phenomenon, test them, try to understand the results, see where they match reality... and then notice where they don't! They then try to modify their model to better fit reality, and explore <strong>other phenomena</strong> that could be explained by their model. This never-ending process is what takes <Magnet bold>lots of time</Magnet>, but it is also what leads to a <i>deeper understanding</i> of the world around us.
            </Paragraph>
            <Sources list={[
                ["Bartosz Ciechanowski", "https://ciechanow.ski", "Bartosz Ciechanowski is an awesome science communicator. You really should check this if you liked this article! I am a long time fan of his work, that really inspired me."],
                ["Nicky Case", "https://ncase.me", "Another big inspiration is Nicky Case who makes amazing interactive explanations of complex topics."],
                ["Nicky Case (Fireflies)", "https://ncase.me/fireflies/", "Here is Nicky Case's interactive explanation of the synchronization of fireflies, that inspired my own simulation."],
                ["Femto physique (Ising model) - In French", "https://femto-physique.fr/simulations/ising2D.php", "Femto physique is a French website dedicated to physics teaching by simulations. It has a lot of great simulations, including this page on the Ising model!"],
                ["Femto physique (Kuramoto model) - In French", "https://femto-physique.fr/physique_statistique/modele-de-kuramoto.php", "Again, the same website, but for the Kuramoto model."],
                ["Vicsek Model of self-propelled particles", "https://web.mit.edu/8.334/www/grades/projects/projects10/Hernandez-Lopez-Rogelio/dynamics_2.html", "More insights on the Vicsek model and its applications."],
                ["Stochastic Spin Dynamics by G.M. Wysin", "https://www.phys.ksu.edu/personal/wysin/notes/stochastic.pdf", "A very technical resource for those who want to go deeper in the subject. It explains how we can derive stochastic Langevin equations from quantum Hamiltonians."],
            ]} />
        </Section>
        <Separator />
        <Section>
            <Paragraph>
                <Fish bold>Thank you for reading this article!</Fish> I hope you enjoyed it and learned something new, please share it online or to some friends!
            </Paragraph>
            <Paragraph>
                If you want to see more content like this, sneak peeks of my work, tutorials or behind the scenes content, you can consider <Magnet>supporting me</Magnet> on my <a href="https://www.patreon.com/mecanicascience">Patreon</a>. And if you have any question, suggestion or feedback, feel free to reach out to me using the form below or on the <a href="https://www.patreon.com/mecanicascience">Patreon</a>.
            </Paragraph>
        </Section>
    </Part>;
}
