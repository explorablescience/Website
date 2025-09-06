'use client';

import { MathJax } from "better-react-mathjax";
import SubSection from "../structure/SubSection";
import TextContent from "../structure/TextContent";
import { Cite, Color, EquationOverline, Expandable, HSpace, Landmark, Note, Paragraph, Strong, Underline } from "./APart";
import { ASim3Part1, ASim3Part2, ASim3Part3 } from "../simulations/ASim3";
import { IsDesktop } from "../structure/Section";
import { useContext } from "react";

export default function APart3() {
    const isDesktop = useContext(IsDesktop);

    return (
        <TextContent>
            <SubSection
                title="Geodesics: Moving in straight lines"
                alignSimulation="right"
                simulation={ASim3Part1}>

                <Paragraph>
                    We have already seen how to represent and plot the <Color color="green">trajectory</Color> of an object in space-time.
                    From now on, we will focus only on <Strong>isolated systems</Strong>, such as our falling apple (<i>if it were falling into the void, but you get the idea!</i>).
                    What <Underline>Albert Einstein</Underline> suggested is that objects do not fall because of some mysterious <Strong>force</Strong>, but <Strong>follow a <Color color="green">straight line</Color> in a deformed space-time</Strong>.
                    This "natural" <Color color="green">trajectory</Color> of an object in space-time is what we call a <Strong><Landmark color="green">geodesic</Landmark></Strong>.
                    <Cite>But... We saw earlier that the apple follows a curve, not a line!</Cite>
                    And this is totally true.
                </Paragraph>

                <Paragraph>
                    So far, our apple has followed a <Color color="green">curved line</Color> in a <Strong>square grid</Strong>.
                    However, this is not the way we usually represent space-time in <Color color="purple">general relativity</Color>.
                    Instead, let's try to continuously deform the grid, so that the apple's <Color color="green">trajectory</Color> becomes a <Color color="green">straight line</Color>.
                
                    <HSpace />

                    By doing so, we can see that the apple now follows a <i>natural</i> straight line: its <Strong><Landmark color="green">geodesic</Landmark></Strong>.
                    To do this, however, we had to <Strong>deform the grid</Strong>, which means that the basis vectors <MathJax inline>{`$\\landmarkblue{\\mathbf{e}_\\mu}$`}</MathJax> are no longer the same everywhere in space-time: <MathJax inline>{`$\\landmarkblue{\\mathbf{e}_\\mu} = \\landmarkblue{\\mathbf{e}_\\mu\\,(t,\\,x,\\,y,\\,z)}$`}</MathJax>.
                    <br /><br />
                    <Strong>This is what gravity really does! It deforms the grid of space and time itself!</Strong> We are now ready to understand how objects move in space-time.

                    {isDesktop && <><HSpace /></>}
                </Paragraph>
            </SubSection>

            <SubSection
                title="Space-time velocity"
                alignSimulation="left"
                simulation={ASim3Part2}>

                <Paragraph>
                    Just as the four-vector <MathJax inline>{`$\\mathbf{x}(\\tau)$`}</MathJax> describes the <i><Color color="gray">position</Color></i> of any object in space-time, we can also define a four-vector <MathJax inline>{`$\\landmarkblue{\\,\\mathbf{u}(\\tau)\\,}$`}</MathJax> that measures its <i><Color color="blue">speed</Color></i>.
                    This four-vector is called the <Color color="blue">four-velocity</Color> and is defined as the <Strong>change</Strong> in the four-position with respect to its <Strong>proper time</Strong>:
                        {`$$\\landmarkblue{\\,u^\\mu(\\tau)\\,} = \\frac{\\mathrm{d}}{\\mathrm{d}\\tau}\\landmarkgray{\\,x^\\mu(\\tau)\\,}$$`}
                    It is a four-vector, so it has four components that describe how fast the object is moving in <Color color="purple">space</Color>, but also in <Color color="green">time</Color>, compared to its internal clock.
            
                    <HSpace />

                    In our universe, <Strong>every object always travels</Strong> through <Landmark color="red">space-time</Landmark> at the <Strong>same speed</Strong>: the <Color color="red"><Strong>speed of light</Strong></Color> <MathJax inline>{`$\\color{red}{c}$`}</MathJax>.
                    This is a very important and fundamental property of our universe, which helps us to derive the equations of motion.
                    Mathematically, this means that the <Color color="red">norm</Color> of the <Color color="blue">four-velocity</Color> is a <Color color="red">constant</Color>:
                        <EquationOverline>{`$$|\\mathbf{u}(\\tau)| = \\color{red}{c}.$$`}</EquationOverline>
                    <br />
                    If we recall the previous example of our tree of four-position <MathJax inline>{`$\\,\\mathbf{x}(\\tau)\\, = (x^t(\\tau),\\,0,\\,0,\\,0)$`}</MathJax>, we can derive its four-velocity:
                        {`$$\\mathbf{u}(\\tau) = \\frac{\\mathrm{d}}{\\mathrm{d}\\tau}\\mathbf{x}(\\tau) = \\left(\\frac{\\mathrm{d}}{\\mathrm{d}\\tau}x^t(\\tau),\\,0,\\,0,\\,0\\right).$$`}
                    Since the norm of the <Color color="blue">four-velocity</Color> is always the constant <MathJax inline>{`$c$`}</MathJax>, we can easily deduce that the <Color color="green">time</Color> component of the four-velocity is:
                        {`$$u^t(\\tau) = \\frac{\\mathrm{d}}{\\mathrm{d}\\tau}x^t(\\tau) = \\color{red}{c}.$$`}
                    Therefore, <MathJax inline>{`$\\mathbf{u}(\\tau) = (\\color{red}{c},\\,0,\\,0,\\,0)$`}</MathJax>.
                    As we can see, though the tree is not moving in <Color color="purple">space</Color>, it is moving in <Color color="green">time</Color>, at the <Color color="red">speed of light</Color>.
                    <br /><br />
                    We are now ready to derive the equations of motion of any object in space-time: the <Strong>geodesic equation</Strong>.
                </Paragraph>
            </SubSection>

            <SubSection
                title="The geodesic equation">

                <Paragraph>
                    Let's do a little of maths!
                    As we have just seen, the <Color color="blue">four-velocity</Color> is always <Strong>constant</Strong> in space-time:
                        {`$$|\\mathbf{u}(\\tau)| = \\color{red}{c}.$$`}
                    This means that if we take its <Strong>derivative</Strong> with respect to the <Strong>proper time</Strong>, which gives us the <Color color="blue">four-acceleration</Color>, we get:
                        {`$$\\frac{\\mathrm{d}}{\\mathrm{d}\\tau}|\\mathbf{u}(\\tau)| = 0.$$`}
                    The fact that the <Color color="blue">four-acceleration</Color> is <Strong>zero</Strong> is not really surprising, since we know that objects in the universe always move at the <Color color="red">same speed</Color>.
                
                    <HSpace />

                    We saw in the previous section how we can decompose any four-vector into the basis vectors <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> using the Einstein notation convention.
                    We can do the same for the <Color color="blue">four-velocity</Color>:
                        {`$$\\mathbf{u}(\\tau) = \\color{green}{u^t(\\tau)}\\landmarkgreen{\\mathbf{e}_t} + \\color{purple}{u^x(\\tau)}\\landmarkpurple{\\mathbf{e}_x} + \\color{purple}{u^y(\\tau)}\\landmarkpurple{\\mathbf{e}_y} + \\color{purple}{u^z(\\tau)}\\landmarkpurple{\\mathbf{e}_z} = u^\\mu(\\tau)\\,\\mathbf{e}_\\mu.$$`}
                    However, when we deformed the trajectory of our apple such that it followed a straight line, a <Strong><Landmark color="gray">geodesic</Landmark></Strong>, we saw that the basis vectors <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> are no longer constant.
                    So, we need to add a dependence on the <Strong>proper time</Strong>, or <i>where the object is at on its own trajectory</i>, to the basis vectors:
                    {`$$\\mathbf{u}(\\tau) = u^\\mu(\\tau)\\,\\mathbf{e}_\\mu(\\tau).$$`}

                    <HSpace />

                    Since the derivative of a product is the sum of the product of the derivatives of each term, we can derive the <Color color="blue">four-velocity</Color>:
                        {`$$\\mathbf{0}=\\frac{\\mathrm{d}}{\\mathrm{d}\\tau}\\mathbf{u}(\\tau) = \\frac{\\mathrm{d}}{\\mathrm{d}\\tau}\\left[u^\\mu(\\tau)\\,\\mathbf{e}_\\mu(\\tau)\\right] = \\frac{\\mathrm{d}u^\\mu(\\tau)}{\\mathrm{d}\\tau}\\,\\mathbf{e}_\\mu(\\tau) + \\frac{\\mathrm{d}\\mathbf{e}_\\mu(\\tau)}{\\mathrm{d}\\tau}\\,u^\\mu(\\tau).$$`}
                    We finally get the <Strong>geodesic equation</Strong>:
                        <EquationOverline>{`$$\\frac{\\mathrm{d}u^\\mu}{\\mathrm{d}\\tau}\\,\\mathbf{e}_\\mu = -\\frac{\\mathrm{d}\\mathbf{e}_\\mu}{\\mathrm{d}\\tau}\\,u^\\mu.$$`}</EquationOverline>
                    <Cite>This equation doesn't seem to be easy to solve, could we simplify it?</Cite>
                    To do this, we need to introduce a new concept: the <Strong>Christoffel symbols</Strong>.
                </Paragraph>
            </SubSection>

            <SubSection
                title="A bit of simplifications: The Christoffel symbols"
                alignSimulation="right"
                simulation={ASim3Part3}>

                <Paragraph>
                    To simplify the <Strong>geodesic equation</Strong>, it would be useful to express how much the basis vectors <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> change when we move them.
                    This is exactly what the <Strong>Christoffel symbols</Strong> are for.

                    <HSpace />

                    Let's take the example of the <Color color="green">time</Color> basis vector <MathJax inline>{`$\\color{green}{t}$`}</MathJax> axis <MathJax inline>{`$\\mathbf{e}_\\color{green}{t}$`}</MathJax>.
                    First of all, let's move it along the <Color color="purple">space</Color> <MathJax inline>{`$\\color{purple}{y}$`}</MathJax> axis, by an infinitesimal amount of space <MathJax inline>{`$\\color{purple}{\\mathrm{d}y}$`}</MathJax>. We take:
                        {`$$\\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y,\\,z) \\rightarrow \\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y+\\color{purple}{\\mathrm{d}y},\\,z).$$`}
                    To measure how much it has changed, all we have to do is take the difference between the two vectors and divide it by the infinitesimal space <MathJax inline>{`$\\color{purple}{\\mathrm{d}y}$`}</MathJax>:
                        {`$$\\frac{\\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y+\\color{purple}{\\mathrm{d}y},\\,z) - \\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y,\\,z)}{\\color{purple}{\\mathrm{d}y}}.$$`}
                    We see that this is exactly the definition of the <Color color="blue">partial derivative</Color> of the basis vector <MathJax inline>{`$\\mathbf{e}_\\color{green}{t}$`}</MathJax> with respect to the <Color color="purple">spatial</Color> <MathJax inline>{`$\\color{purple}{y}$`}</MathJax> axis:
                        {`$$\\frac{\\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y+\\color{purple}{\\mathrm{d}y},\\,z) - \\mathbf{e}_\\color{green}{t}(t,\\,x,\\,y,\\,z)}{\\color{purple}{\\mathrm{d}y}} = \\frac{\\partial\\mathbf{e}_\\color{green}{t}}{\\partial \\color{purple}{y}}.$$`}
                    If you don't know what a <Color color="blue">partial derivative</Color> is, don't worry, just remember that it's just a standard a derivative but with respect to only one variable, while keeping the others constant.
                    Finally, to see how much it has changed along <Color color="blue">any axis</Color> (let's take the <Color color="green">time</Color> <MathJax inline>{`$\\color{green}{t}$`}</MathJax> axis), we take:
                        {`$$\\mathbf{e}^\\color{green}{t}\\,\\frac{\\partial\\mathbf{e}_\\color{green}{t}}{\\partial \\color{purple}{y}}.$$`}
                    <Note>The reason why we project onto <MathJax inline>{`$\\mathbf{e}^\\color{green}{t}$`}</MathJax> and not <MathJax inline>{`$\\mathbf{e}_\\color{green}{t}$`}</MathJax> requires more technical background and I won't go into it.</Note>
                    This is the definition of the <Strong>Christoffel symbol</Strong> <MathJax inline>{`$\\,\\Gamma^\\color{green}{t}_{\\,\\,\\color{green}{t}\\color{purple}{y}}$`}</MathJax>.
                </Paragraph>

                <Paragraph>
                    We can now define the 64 <Strong>Christoffel symbols</Strong> (<i>in our simplified 2D scheme we get only 8</i>) as:
                        <EquationOverline>{`$$\\Gamma^\\color{red}{\\mu}_{\\,\\,\\color{green}{\\nu}\\color{purple}{\\rho}} = \\mathbf{e}^\\color{red}{\\mu}\\,\\frac{\\partial\\mathbf{e}_\\color{green}{\\nu}}{\\partial x^\\color{purple}{\\rho}}.$$`}</EquationOverline>
                    For example, the <Strong>Christoffel symbol</Strong> <MathJax inline>{`$\\Gamma^\\color{red}{y}_{\\,\\,\\color{green}{t}\\color{purple}{z}}$`}</MathJax> describes the change of the basis vector <MathJax inline>{`$\\mathbf{e}_\\color{green}{t}$`}</MathJax> along the <MathJax inline>{`$\\color{red}{y}$`}</MathJax> axis, when we move it along the <MathJax inline>{`$\\color{purple}{z}$`}</MathJax> axis.
                    
                    <HSpace />

                    By knowing each of these symbols, we can now describe the shape of the universe everywhere in space-time.
                    In the simulation, each of the 8 <Strong>Christoffel symbols</Strong> is represented by a <Strong>projection</Strong> of the shifted vector onto the initial basis vectors.
                
                    {isDesktop && <><HSpace /></>}
                </Paragraph>
            </SubSection>

            <SubSection
                title="The geodesic equation">
                <Paragraph>
                    To simplify the <Strong>geodesic equation</Strong>, we can now use the <Strong>Christoffel symbols</Strong>.
                    We can first prove that the change of a basis vector along its proper time is:
                        {`$$\\frac{\\mathrm{d}\\mathbf{e}_\\mu}{\\mathrm{d}\\tau} = \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho.$$`}
                    <Cite>Try to prove it yourself before looking at the solution!</Cite>
                    <Expandable
                        title="Proof">
                        
                        First of all, let's remember the definition of the Christoffel symbols: the definition of the <Strong>Christoffel symbols</Strong>:
                            {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\mathbf{e}^\\mu\\,\\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho}.$$`}
                        To prove the equality, we will start from the right side of the equation and try to get to the left side.
                            {`$$
                                \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho
                                = \\mathbf{e}^\\rho\\,\\frac{\\partial\\mathbf{e}_\\mu}{\\partial x^\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho
                            $$`}

                        <br />
                        Firstly, we can rearrange the terms:
                            {`$$
                                \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho
                                = \\mathbf{e}^\\rho\\,\\mathbf{e}_\\rho\\,\\frac{\\partial\\mathbf{e}_\\mu}{\\partial x^\\nu}\\,u^\\nu.
                            $$`}
                        So, we can simplify the equation:
                            {`$$ \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho = \\frac{\\partial\\mathbf{e}_\\mu}{\\partial x^\\nu}\\,u^\\nu.$$`}

                        <br />
                        Second, let's explicitly write the velocity vector <MathJax inline>{`$u^\\nu$`}</MathJax> as the derivative of the position vector <MathJax inline>{`$x^\\nu$`}</MathJax>:
                            {`$$ \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho = \\frac{\\partial\\mathbf{e}_\\mu}{\\partial x^\\nu}\\,\\frac{\\mathrm{d}x^\\nu}{\\mathrm{d}\\tau}.$$`}
                        We can now use the definition of the total derivative
                            {`$$
                                \\frac{\\partial\\mathbf{e}_\\mu}{\\partial x^\\nu}\\,\\frac{\\mathrm{d}x^\\nu}{\\mathrm{d}\\tau}
                                = \\frac{\\mathrm{d}\\mathbf{e}_\\mu}{\\mathrm{d}\\tau}.
                            $$`}
                        And we finally get the equality we wanted to prove:
                            {`$$\\frac{\\mathrm{d}\\mathbf{e}_\\mu}{\\mathrm{d}\\tau} = \\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,\\mathbf{e}_\\rho.$$`}
                    </Expandable>
                    This relationship is actually trivial when we try to understand it physically.
                    As mentioned earlier, the <Strong>Christoffel symbols</Strong> describe <Color color="blue">how much a given vector changes</Color> in a given direction, when we move it in another direction.
                    So to know how much <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> changes, we just need to know <Strong>how much it changes along each individual basis vectors</Strong>, and sum the results.
                    This is exactly what the above equation tells us.

                    <HSpace />

                    As a reminder, the <Strong>geodesic equation</Strong> is:
                        {`$$
                            \\color{blue}{\\frac{\\mathrm{d}u^\\mu}{\\mathrm{d}\\tau}}\\,\\mathbf{e}_\\mu
                            = -\\frac{\\mathrm{d}\\mathbf{e}_\\mu}{\\mathrm{d}\\tau}\\,u^\\mu
                            = \\color{blue}{-\\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu}\\,\\mathbf{e}_\\rho\\,\\color{blue}{u^\\mu}.
                        $$`}
                    We now have an equality of a sum of the vectors <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> on each side.
                    We can therefore simplify the equation by keeping only the <Landmark color="blue">coefficients</Landmark> before each basis vector.
                    
                    <br /> <br />

                    This finally gives us the <Color color="red"><Strong>geodesic equation</Strong></Color>:
                        <EquationOverline>{`$$\\frac{\\mathrm{d}u^\\rho}{\\mathrm{d}\\tau} = -\\Gamma^\\rho_{\\,\\,\\mu\\nu}\\,u^\\nu\\,u^\\mu.$$`}</EquationOverline>
                    Well done! We have just simplified the <Strong>geodesic equation</Strong> a lot!
                    If we want to solve it now, we only need to know the <Strong>Christoffel symbols</Strong>.
                    <Cite>But we do not know these symbols? How do we find them?</Cite>
                    To find them, we need to know the <Strong>metric tensor</Strong>, which is the subject of the next section.
                </Paragraph>
            </SubSection>
        </TextContent>
    )
}