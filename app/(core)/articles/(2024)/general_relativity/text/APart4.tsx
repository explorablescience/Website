import { MathJax } from "better-react-mathjax";
import SubSection from "../structure/SubSection";
import TextContent from "../structure/TextContent";
import { Cite, Color, EquationOverline, Expandable, HSpace, Landmark, Note, Paragraph, Strong, Underline } from "./APart";
import { ASim4Part1, ASim4Part2 } from "../simulations/ASim4";

export default function APart4() {
    return (
        <TextContent>
            <SubSection
                title="From Pythagoras to the metric tensor"
                alignSimulation="left"
                simulation={ASim4Part1}>

                <Paragraph>
                    You learnt at school is that the distance between two points, say <MathJax inline>{`$\\Delta s$`}</MathJax>, is given by the <Underline>Pythagorean theorem</Underline>:
                        {`$$\\Delta s^2 = \\Delta x^2 + \\Delta y^2 + \\Delta z^2.$$`}
                    <Cite>But what if we were in a curved space-time where the basis vectors are not constant everywhere?</Cite>
                    If the grid is stretched in only one direction, the theorem of Pythagoras is still valid, but we must add <Color color="red">multiplicative terms</Color> to account for the <Color color="red">stretching of the grid</Color>:
                        {`$$\\Delta s^2 = \\color{red}{g_1}\\Delta x^2 + \\color{red}{g_2}\\Delta y^2 + \\color{red}{g_3}\\Delta z^2.$$`}
                    Let's add <Color color="green">time</Color> to our measure of distance.
                    This length now describes the distance between two points in <Strong>space-time</Strong>:
                        {`$$\\Delta s^2 = g_0\\color{green}{(c\\Delta t)}^2 + g_1\\color{purple}{\\Delta x}^2 + g_2\\color{purple}{\\Delta y}^2 + g_3\\color{purple}{\\Delta z}^2.$$`}
                    These terms <MathJax inline>{`$g_\\mu$`}</MathJax>, which we just have added allow, us to characterise the expansion of the lattice in each direction.
                    Note that we have added a <MathJax inline>{`$c$`}</MathJax> in the time term to ensure that the units are consistent.
                </Paragraph>

                <Paragraph>
                    If the grid is stretched along <i>more than one axis</i>, so that the basis vectors are <Strong>no longer orthogonal</Strong>, this equation no longer holds.
                    <Cite>Then how do we determine the length of a curve?</Cite>
                    The idea is that if we zoom in enough on a small part of the grid, the lines will appear to be straight.
                    We can then reconstruct the length of the curve by <Strong>summing</Strong> all these small straight lines.
                    Since we are only looking at a small part of the grid, we change the notation from a capital <MathJax inline>{`$\\Delta$`}</MathJax> to a small <MathJax inline>{`$d$`}</MathJax>:
                        {`$$ds^2 = g_0\\,\\color{green}{(c\\,dt)}^2 + g_1\\,\\color{purple}{d x}^2 + g_2\\,\\color{purple}{d y}^2 + g_3\\,\\color{purple}{d z}^2.$$`}
                    In the case of non-orthogonal basis vectors, the Pythagorean theorem is no longer valid.
                    We have to add <Color color="red">cross terms</Color> to take into account the <Color color="red">angles</Color> between each direction:
                        {`$$
                        \\begin{eqnarray} 
                            ds^2 &=& g_{00}\\,\\color{green}{(c\\,dt)}^2 + g_{11}\\,\\color{purple}{dx}^2 + g_{22}\\,\\color{purple}{dy}^2 + g_{33}\\,\\color{purple}{dz}^2 \\\\
                            &+& \\color{red}{g_{01}}\\,\\color{green}{c\\,dt}\\,\\color{purple}{dx} + \\color{red}{g_{02}}\\,\\color{green}{c\\,dt}\\,\\color{purple}{dy} + \\color{red}{g_{03}}\\,\\color{green}{c\\,dt}\\,\\color{purple}{dz} \\\\
                            &+& \\color{red}{g_{10}}\\,\\color{purple}{dx}\\,\\color{green}{c\\,dt} + \\color{red}{g_{12}}\\,\\color{purple}{dx}\\,\\color{purple}{dy} + \\color{red}{g_{13}}\\,\\color{purple}{dx}\\,\\color{purple}{dz} \\\\
                            &+& \\color{red}{g_{20}}\\,\\color{purple}{dy}\\,\\color{green}{c\\,dt} + \\color{red}{g_{21}}\\,\\color{purple}{dy}\\,\\color{purple}{dx} + \\color{red}{g_{23}}\\,\\color{purple}{dy}\\,\\color{purple}{dz} \\\\
                            &+& \\color{red}{g_{30}}\\,\\color{purple}{dz}\\,\\color{green}{c\\,dt} + \\color{red}{g_{31}}\\,\\color{purple}{dz}\\,\\color{purple}{dx} + \\color{red}{g_{32}}\\,\\color{purple}{dz}\\,\\color{purple}{dy}.
                        \\end{eqnarray}
                        $$`}

                    <HSpace />

                    To simplify the notation, we can first use the notation <MathJax inline>{`$dx^\\mu$`}</MathJax> to represent each small displacement: <MathJax inline>{`$\\color{green}{dx^0} = \\color{green}{c\\,dt}$`}</MathJax> for the <Color color="green">time dimension</Color> and <MathJax inline>{`$\\color{purple}{dx^1} = \\color{purple}{dx}$`}</MathJax>, <MathJax inline>{`$\\color{purple}{dx^2} = \\color{purple}{dy}$`}</MathJax>, <MathJax inline>{`$\\color{purple}{dx^3} = \\color{purple}{dz}$`}</MathJax> for the <Color color="purple">spatial dimensions</Color>.
                    The equation then becomes:
                        {`$$
                        \\begin{eqnarray} 
                            ds^2 &=& g_{00}\\,\\color{green}{dx^0}\\color{green}{dx^0} + g_{11}\\,\\color{purple}{dx^1}\\color{purple}{dx^1} + g_{22}\\,\\color{purple}{dx^2}\\color{purple}{dx^2} + g_{33}\\,\\color{purple}{dx^3}\\color{purple}{dx^3} \\\\
                            &+& g_{01}\\,\\color{green}{dx^0}\\,\\color{purple}{dx^1} + g_{02}\\,\\color{green}{dx^0}\\,\\color{purple}{dx^2} + g_{03}\\,\\color{green}{dx^0}\\,\\color{purple}{dx^3} \\\\
                            &+& g_{10}\\,\\color{purple}{dx^1}\\,\\color{green}{dx^0} + g_{12}\\,\\color{purple}{dx^1}\\,\\color{purple}{dx^2} + g_{13}\\,\\color{purple}{dx^1}\\,\\color{purple}{dx^3} \\\\
                            &+& g_{20}\\,\\color{purple}{dx^2}\\,\\color{green}{dx^0} + g_{21}\\,\\color{purple}{dx^2}\\,\\color{purple}{dx^1} + g_{23}\\,\\color{purple}{dx^2}\\,\\color{purple}{dx^3} \\\\
                            &+& g_{30}\\,\\color{purple}{dx^3}\\,\\color{green}{dx^0} + g_{31}\\,\\color{purple}{dx^3}\\,\\color{purple}{dx^1} + g_{32}\\,\\color{purple}{dx^3}\\,\\color{purple}{dx^2}.
                        \\end{eqnarray}
                        $$`}
                    We can then rewrite this term as a sum, using <Color color="blue">Einstein's summation convention</Color> to simplify the notation even further:
                        {`$$ds^2 = \\sum_{\\mu=\\color{green}{0},\\,\\color{purple}{1},\\,\\color{purple}{2},\\,\\color{purple}{3}}\\,\\, \\sum_{\\nu=\\color{green}{0},\\,\\color{purple}{1},\\,\\color{purple}{2},\\,\\color{purple}{3}} g_{\\mu\\nu}\\,dx^\\mu\\,dx^\\nu$$`}
                        <EquationOverline>{`$$ds^2 = g_{\\mu\\nu}\\,dx^\\mu\\,dx^\\nu.$$`}</EquationOverline>

                    All the multiplicative terms are now contained under one symbol: the <Color color="blue"><Strong>metric tensor</Strong></Color> <MathJax inline>{`$\\landmarkblue{g_{\\mu\\nu}}$`}</MathJax>.
                    Physically, each component of the metric tensor measures <Strong>how much</Strong> a given basis vector <MathJax inline>{`$\\color{blue}{e_\\mu}$`}</MathJax> changes with respect to the basis vector <MathJax inline>{`$\\color{red}{e_\\nu}$`}</MathJax>:
                        <EquationOverline>{`$$ g_{\\mu\\nu} = \\color{blue}{e_\\mu} \\cdot \\color{red}{e_\\nu}\\,. $$`}</EquationOverline>
                    The coefficients of this tensor can then be stored in an array, <Strong>or matrix</Strong>, of 16 components:
                         {`$$
                            \\landmarkblue{g_{\\mu\\nu}} = \\begin{pmatrix}
                                g_{00} & g_{01} & g_{02} & g_{03} \\\\
                                g_{10} & g_{11} & g_{12} & g_{13} \\\\
                                g_{20} & g_{21} & g_{22} & g_{23} \\\\
                                g_{30} & g_{31} & g_{32} & g_{33}
                            \\end{pmatrix}.
                        $$`}
                    By knowing all of these coefficients, i.e. the <Color color="blue">metric tensor</Color>, we can calculate the <Strong>distance between any points in space-time</Strong> and measure the length of any path.
                </Paragraph>
            </SubSection>

            <SubSection
                title="Relation between the metric and the Christoffel symbols">

                <Paragraph>
                    Ok, let's summarise what we've so far. We have seen:
                    <ol>
                        <li><Strong>How to describe a change in distances</Strong> in space-time, given the <Color color="blue">metric tensor</Color> <MathJax inline>{`$\\landmarkblue{g_{\\mu\\nu}}$`}</MathJax>.</li>
                        <li><Strong>How to describe a change of coordinates</Strong> in space-time, given the <Color color="green">Christoffel symbols</Color> <MathJax inline>{`$\\landmarkgreen{\\Gamma^\\rho_{\\,\\mu\\nu}}$`}</MathJax>.</li>
                    </ol>
                    <Cite>But what is the relationship between these two concepts?</Cite>
                    Intuitively, since <MathJax inline>{`$\\landmarkblue{g_{\\mu\\nu}}$`}</MathJax> is used to calculate the <Color color="blue">distance between two points</Color> and <MathJax inline>{`$\\landmarkgreen{\\Gamma^\\rho_{\\,\\mu\\nu}}$`}</MathJax> is used to calculate the <Color color="green">change in coordinates between two points</Color>, we can expect that there to be a <Strong>relationship</Strong> between the two.
                    To find it, let's use a common concept common to both of these symbols: the <Color color="purple">basis vector</Color>.
                    <br /><br />
                    The idea is to start with the previous definition of the <Color color="blue">metric tensor</Color>:
                        {`$$ g_{\\mu\\nu} = \\mathbf{e_\\mu} \\cdot \\mathbf{e_\\nu}\\,. $$`}
                    And try to replace it in the definition of the <Color color="green">Christoffel symbols</Color>:
                        {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\mathbf{e}^\\mu\\,\\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho}.$$`}
                    We can then prove the following relation:
                        <EquationOverline>{`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\frac{1}{2}\\,g^{\\mu\\sigma}\\,\\left(\\frac{\\partial g_{\\rho\\sigma}}{\\partial x^\\nu} + \\frac{\\partial g_{\\sigma\\nu}}{\\partial x^\\rho} - \\frac{\\partial g_{\\nu\\rho}}{\\partial x^\\sigma}\\right).$$`}</EquationOverline>
                    In this equation, <MathJax inline>{`$\\landmarkblue{g^{\\mu\\nu}}$`}</MathJax> is the notation for the <Strong>inverse matrix</Strong> of <MathJax inline>{`$\\landmarkblue{g_{\\mu\\nu}}$`}</MathJax>.
                    <br />
                    The proof is a bit long and technical, but it is quite straightforward. 
                    If you are interested, you can find it in the <i>proof</i> section just below.

                    <Expandable title="Proof">
                        To give you a chance to find the proof for yourself, I will guide you through the proof step by step.
                        This proof seem intimidating at first, but if you take the time to understand it and write each sum explicitly, you will see that it is not that complicated.
                        <br />
                        We start with the definition of the <Color color="green">Christoffel symbols</Color>,
                            {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\mathbf{e}^\\mu\\,\\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho}.$$`}
                        and apply the basis vector <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax> on both sides, using the fact that its a vector of <Strong>unit length</Strong>:
                            <EquationOverline>{`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,\\mathbf{e}_\\mu = \\mathbf{e}^\\mu\\,\\mathbf{e}_\\mu\\,\\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho} = \\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho}.$$`}</EquationOverline>

                        Now we replace the <Color color="blue">metric tensor</Color> in the definition of the <Color color="green">Christoffel symbols</Color> and prove how the <Color color="blue">metric tensor</Color> changes with the coordinates:
                            <EquationOverline>{`$$ \\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} = \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda} + \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu}. $$`}</EquationOverline>
                        <Expandable title="Derivation of relation 1">
                            To make the <Color color="blue">metric</Color> appear, let's multiply it by another basis vector <MathJax inline>{`$\\mathbf{e}_\\lambda$`}</MathJax>. We get,
                                {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,\\mathbf{e}_\\mu\\,\\mathbf{e}_\\lambda = \\frac{\\partial\\mathbf{e}_\\nu}{\\partial x^\\rho}\\mathbf{e}_\\lambda.$$`}
                            A little trick is then to use the formula for a <Strong>product of terms</Strong> to rewrite the right part of the equation so that it looks like our first proven equation:
                                {`$$\\begin{eqnarray}
                                    \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,\\mathbf{e}_\\mu\\,\\mathbf{e}_\\lambda &=& \\frac{\\partial}{\\partial x^\\rho}\\left(\\mathbf{e}_\\nu\\mathbf{e}_\\lambda\\right) - \\frac{\\partial \\mathbf{e}_\\lambda}{\\partial x^\\rho}\\mathbf{e}_\\nu \\\\
                                    &=& \\frac{\\partial}{\\partial x^\\rho}\\left(\\mathbf{e}_\\nu\\mathbf{e}_\\lambda\\right) - \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,\\mathbf{e}_\\mu\\mathbf{e}_\\nu.
                                \\end{eqnarray}$$`}
                            Let's now recall the definition of the <Color color="blue">metric tensor</Color>:
                                {`$$ g_{\\mu\\nu} = \\mathbf{e_\\mu} \\cdot \\mathbf{e_\\nu}\\,. $$`}
                            Finally, we replace it in the previous equation and obtain:
                                {`$$ \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda} = \\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} - \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu}. $$`}
                            If we add the second term on the right-hand side of the equation, we finally get the relation.
                        </Expandable>
                        The problem with this equation is that... well, try to solve it! It's not that easy. So let's try to simplify it a little.

                        <br />

                        So now try to get the <Strong>following three equations</Strong> from the first one we just proved (<i>hint: there is a trick to get them easily</i>):
                            <EquationOverline>{`$$\\left\\{\\begin{eqnarray}
                                \\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} &=& \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda} + \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu} \\\\
                                \\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda} &=& \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu} + \\Gamma^\\mu_{\\,\\,\\nu\\lambda}\\,g_{\\mu\\rho} \\\\
                                \\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} &=& \\Gamma^\\mu_{\\,\\,\\nu\\lambda}\\,g_{\\mu\\rho} + \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda}
                            \\end{eqnarray}\\right. $$`}
                            </EquationOverline>

                        <Expandable title="Derivation of relation 2">
                            The trick here is to write this equation three times, each time <Strong>permuating the free indices</Strong> (<i>note that we can't permute the <MathJax inline>{`$\\mu$`}</MathJax> as it is being summed over</i>).
                            <br />
                            For <MathJax inline>{`$\\rho \\rightarrow \\lambda,\\, \\nu \\rightarrow \\rho,\\, \\lambda \\rightarrow \\nu$`}</MathJax>, we get:
                                {`$$\\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda} = \\Gamma^\\mu_{\\,\\,\\rho\\lambda}\\,g_{\\mu\\nu} + \\Gamma^\\mu_{\\,\\,\\nu\\lambda}\\,g_{\\mu\\rho}.$$`}
                            For <MathJax inline>{`$\\rho \\rightarrow \\nu,\\, \\nu \\rightarrow \\lambda,\\, \\lambda \\rightarrow \\rho$`}</MathJax>, it becomes:
                                {`$$\\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} = \\Gamma^\\mu_{\\,\\,\\lambda\\nu}\\,g_{\\mu\\rho} + \\Gamma^\\mu_{\\,\\,\\rho\\nu}\\,g_{\\mu\\lambda}.$$`}
                            <br />
                            Something I didn't mention before is that the <Color color="green">Christoffel symbols</Color> are <Strong>symmetrical</Strong> in their last two indices:
                                {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\Gamma^\\mu_{\\,\\,\\rho\\nu}.$$`}
                            This can be seen physically as the <Color color="green">Christoffel symbols</Color> describe the evolution of a vector along a curve.
                            If we invert the curve, the vector will evolve in the same way.
                            Finally, we get the three <Strong>equations we asked for</Strong>:
                                {`$$\\left\\{\\begin{eqnarray}
                                    \\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} &=& \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda} + \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu} \\\\
                                    \\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda} &=& \\Gamma^\\mu_{\\,\\,\\lambda\\rho}\\,g_{\\mu\\nu} + \\Gamma^\\mu_{\\,\\,\\nu\\lambda}\\,g_{\\mu\\rho} \\\\
                                    \\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} &=& \\Gamma^\\mu_{\\,\\,\\nu\\lambda}\\,g_{\\mu\\rho} + \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda}
                                \\end{eqnarray}\\right. $$`}
                        </Expandable>

                        The last one is easier to get! Try again!
                        The only thing you need to use is the fact that a matrix times its inverse is the identity matrix. In this context,
                            {`$$ g_{\\mu\\lambda}\\,g^{\\sigma\\lambda} = \\delta^\\sigma_\\mu$$`}
                        where <MathJax inline>{`$\\delta^\\sigma_\\mu$`}</MathJax> is the <Color color="blue">Kronecker delta</Color> defined by:
                            {`$$\\delta^\\sigma_\\mu = \\left\\{\\begin{array}{ll}
                                1 & \\text{if } \\sigma = \\mu \\\\
                                0 & \\text{otherwise}
                            \\end{array}\\right.$$`}
                        This is what you need to find exactly:
                        <EquationOverline>
                            {`$$\\Gamma^\\sigma_{\\,\\,\\nu\\rho} = \\frac{1}{2}\\,g^{\\sigma\\lambda}\\left(\\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} + \\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} - \\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda}\\right).$$`}
                        </EquationOverline>
                        <Expandable title="Derivation of relation 3">
                            For this proof, what is usually done is to add the first and third equations of the previous relation, and then subtract the second.
                            By doing this, a lot of terms will cancel out and you will be left with:
                                {`$$\\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} + \\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} - \\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda} = 2\\,\\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g_{\\mu\\lambda}.$$`}
                            Now we just need to multiply both sides by <MathJax inline>{`$g^{\\sigma\\lambda}$`}</MathJax> and divide by 2 to get the result we want:
                                {`$$\\begin{eqnarray}
                                \\frac{1}{2} g^{\\sigma\\lambda}\\frac{\\partial g_{\\nu\\lambda}}{\\partial x^\\rho} + \\frac{\\partial g_{\\lambda\\rho}}{\\partial x^\\nu} - \\frac{\\partial g_{\\rho\\nu}}{\\partial x^\\lambda}
                                &=& \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,g^{\\sigma\\lambda}g_{\\mu\\lambda}\\\\
                                &=& \\Gamma^\\mu_{\\,\\,\\nu\\rho}\\,\\delta^\\sigma_\\mu\\\\
                                &=& \\Gamma^\\sigma_{\\,\\,\\nu\\rho}
                                \\end{eqnarray}$$`}
                        </Expandable>

                        If you've got this far, congratulations! Now let's go back to <Color color="blue">physics</Color> and try to understand this equation.
                        <br />
                    </Expandable>

                    One way I like to express what this equation says is by comparing it to the <Color color="blue">Newtonian</Color> case.
                    As you may know, in classical physics the usual <Color color="blue">gravitational force</Color> follows directly from a <Color color="red">potential</Color> <MathJax inline>{`$\\color{red}{\\Phi}$`}</MathJax>.
                    Mathematically, this is expressed as:
                        {`$$\\mathbf{F} = -m\\left(\\frac{\\partial\\color{red}{\\Phi}}{\\partial x}\\,\\mathbf{e}_x +\\frac{\\partial\\color{red}{\\Phi}}{\\partial y}\\,\\mathbf{e}_y +\\frac{\\partial\\color{red}{\\Phi}}{\\partial z}\\,\\mathbf{e}_z\\right).$$`}
                    If I rewrite the expression of the <Color color="green">Christoffel symbols</Color>, you can see that it is quite similar:
                        {`$$\\Gamma^\\mu_{\\,\\,\\nu\\rho} = \\frac{1}{2}\\,\\color{red}{g^{\\mu\\sigma}}\\,\\left(\\frac{\\partial \\color{red}{g_{\\rho\\sigma}}}{\\partial x^\\nu} + \\frac{\\partial \\color{red}{g_{\\sigma\\nu}}}{\\partial x^\\rho} - \\frac{\\partial \\color{red}{g_{\\nu\\rho}}}{\\partial x^\\sigma}\\right).$$`}
                    The <Strong><Color color="red">metric</Color> itself</Strong> is the <Color color="red">potential</Color> of the <Color color="blue">gravitational force</Color> in general relativity!
                    In fact, if we compute the value of the <Color color="green">Christoffel symbols</Color> for a small <Color color="blue">gravitational field</Color>, we find that these symbols are pretty much the same as the <Color color="blue">gravitational field</Color> of classical physics.
                </Paragraph>
            </SubSection>

            <SubSection
                title="The Earth and an ant"
                alignSimulation="right"
                simulation={ASim4Part2}>

                <Paragraph>
                    Okay, let's pause for a moment and <Strong>try to understand</Strong> what we've just seen.
                    It's a lot of information, so let's try to summarise it and compute some of it in a simple example.
                    <br />
                    Imagine that you are looking at an <Color color="purple">ant</Color> living on the surface of the earth in <Color color="blue">Istanbul</Color>.
                    This <Color color="purple">ant</Color> dreams of visiting <Color color="blue">San Francisco</Color>, and tries to get there by walking (<i>it is a very sporty <Color color="purple">ant</Color></i>).
                    As it is only a tiny little <Color color="purple">ant</Color>, it probably wants to take the shortest possible route, so it follows a <Landmark color="green">geodesic</Landmark>: it walks in a <Strong>straight line</Strong> on the sphere.
                    Doing so, its absolute <Strong>velocity</Strong> is always <Strong>the same</Strong>, but its velocity <Strong>components change</Strong> as it moves around the Earth.

                    <HSpace />

                    But, if we look at its position on a map, we can see that it doesn't go in a <Strong>straight line</Strong>, but follows a <Strong>curved path</Strong>.
                    <Cite>So what's wrong?</Cite>
                    The fact that we see a curved path is due to the fact that we are using the <Strong>wrong coordinate system</Strong> by projecting the Earth on a flat surface.
                    Instead, if we look at the Earth from space, we see that the <Color color="purple">ant</Color> is actually moving in a straight line.
                    However, by doing so, the basis vectors of the <Color color="blue">coordinate system</Color> are not constant anymore, and the <Color color="blue">metric tensor</Color> depends on the position of the <Color color="purple">ant</Color>.

                    <HSpace />

                    If we want to know <i>"how far has the <Color color="purple">ant</Color> walked"</i>, the usual Pythagorean theorem is not enough.
                    We need to use the <Color color="blue">metric tensor</Color> to calculate the distance between two points.
                    Let's use the spherical coordinate system to locate our <Color color="purple">ant</Color> on the Earth at a given angle <MathJax inline>{`$(\\color{green}{\\theta}, \\color{red}{\\varphi})$`}</MathJax>.
                    For a <Strong>sphere</Strong>, the <Color color="blue">metric tensor</Color> (<i>if we ignore the time part</i>) is given by:
                         {`$$
                            \\landmarkblue{g_{\\mu\\nu}} = \\begin{pmatrix}
                                R^2 & 0 \\\\
                                0 & R^2\\sin^2\\color{green}{\\theta}
                            \\end{pmatrix}
                        $$`}
                    where <MathJax inline>{`$R$`}</MathJax> is the radius of the Earth, and <MathJax inline>{`$\\mu = (\\color{green}{\\theta}, \\color{red}{\\varphi})$`}</MathJax>.
                    To get the distance, we compute the <Color color="blue">line element</Color> <MathJax inline>{`$ds$`}</MathJax>:
                        {`$$ \\begin{eqnarray}
                            ds^2 &=& \\landmarkblue{g_{\\mu\\nu}}\\,dx^\\mu\\,dx^\\nu\\\\
                            &=& R^2\\,d\\color{green}{\\theta}^2 + 0\\,d\\color{green}{\\theta}\\,d\\color{red}{\\varphi} + 0\\,d\\color{red}{\\varphi}\\,d\\color{green}{\\theta} + R^2\\sin^2\\color{green}{\\theta}\\,d\\color{red}{\\varphi}^2\\\\
                            &=& R^2\\,d\\color{green}{\\theta}^2 + R^2\\sin^2\\color{green}{\\theta}\\,d\\color{red}{\\varphi}^2
                        \\end{eqnarray}$$`}
                    To finally obtain the distance travelled, we then have to integrate this <Color color="blue">line element</Color> along the <Color color="green">geodesic</Color> using a continuous sum, <Strong>an integral</Strong>:
                        {`$$ S = \\int_{\\text{Istanbul}}^{\\text{San Francisco}} ds$$`}
                </Paragraph>
            </SubSection>

            <SubSection
                title="The geodesics of the ant">
                <Paragraph>
                    One last question remains: <Cite>How do we compute the geodesic, the <b>ant's path</b>?</Cite>
                    Let's assume that our <Color color="purple">ant</Color> is now flying a little above the ground, and cannot turn around, so it can only move along a <Strong>geodesic</Strong>.
                    We saw a few paragraphs ago that to get the geodesic, you can find the <Strong>position components</Strong> by solving the <Color color="green">geodesic equation</Color>:
                        {`$$ \\frac{\\mathrm{d}u^\\rho}{\\mathrm{d}\\tau} = -\\Gamma^{\\rho}_{\\,\\,\\mu\\nu}\\,u^\\nu\\,u^\\mu $$`}
                    To do this, you need to compute the <Color color="green">Christoffel symbols</Color> <MathJax inline>{`$\\Gamma^\\rho_{\\,\\,\\mu\\nu}$`}</MathJax> of the <Color color="blue">metric tensor</Color> <MathJax inline>{`$\\landmarkblue{g_{\\mu\\nu}}$`}</MathJax>.
                    Let's compute one of them, <MathJax inline>{`$\\Gamma^\\color{green}{\\theta}_\\color{green}{\\,\\,\\varphi\\varphi}$`}</MathJax>, for the spherical coordinate system.
                    First we have to compute the <Color color="blue">inverse metric tensor</Color> <MathJax inline>{`$\\landmarkblue{g^{\\mu\\nu}}$`}</MathJax>. It is given by:
                        {`$$
                            \\landmarkblue{g^{\\mu\\nu}} = \\begin{pmatrix}
                                \\frac{1}{R^2} & 0 \\\\
                                0 & \\frac{1}{R^2\\sin^2\\color{green}{\\theta}}
                            \\end{pmatrix}
                        $$`}

                    <br />

                    Then just use the definition of the <Color color="green">Christoffel symbols</Color>:
                        {`$$
                            \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\varphi\\varphi}}
                            = \\sum_{\\sigma = \\color{green}{\\theta,\\,\\varphi}} \\frac{1}{2}\\,g^{\\color{green}{\\theta}\\sigma}\\,\\left(\\frac{\\partial g_{\\color{green}{\\varphi}\\sigma}}{\\partial x^\\color{green}{\\varphi}} + \\frac{\\partial g_{\\sigma\\color{green}{\\varphi}}}{\\partial x^\\color{green}{\\varphi}} - \\frac{\\partial g_{\\color{green}{\\varphi}\\color{green}{\\varphi}}}{\\partial x^\\sigma}\\right)
                        $$`}
                    Since the <Color color="blue">metric tensor</Color> is diagonal, if we keep only the non-zero terms in the brackets, we get:
                        {`$$
                            \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\varphi\\varphi}}
                            = \\frac{1}{2}\\,g^{\\color{green}{\\theta}\\color{green}{\\varphi}}\\,\\frac{\\partial g_{\\color{green}{\\varphi}\\color{green}{\\varphi}}}{\\partial x^\\color{green}{\\varphi}} + \\frac{1}{2}\\,g^{\\color{green}{\\theta}\\color{green}{\\varphi}}\\,\\frac{\\partial g_{\\color{green}{\\varphi}\\color{green}{\\varphi}}}{\\partial x^\\color{green}{\\theta}} - \\frac{1}{2}\\,g^{\\color{green}{\\theta}\\color{green}{\\theta}}\\,\\frac{\\partial g_{\\color{green}{\\theta}\\color{green}{\\varphi}}}{\\partial x^\\color{green}{\\varphi}}\\\\
                        $$`}
                    And finally, by replacing the inverse metric tensor and the metric tensor, we get:
                        {`$$
                            \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\varphi\\varphi}}
                            = \\frac{1}{2}\\,\\frac{1}{R^2}\\,\\frac{\\partial \\left(R^2\\sin^2\\color{green}{\\theta}\\right)}{\\partial \\color{green}{\\theta}} = -\\sin\\color{green}{\\theta}\\,\\cos\\color{green}{\\theta}
                        $$`}
                    We can do the same for all the other Christoffel symbols.
                    <Note>Try to derive some by yourself!</Note>
                    <Expandable title="Christoffel symbols">
                        For <MathJax inline>{`$\\mu = \\color{green}{\\theta}$`}</MathJax>,
                            {`$$ \\begin{eqnarray}
                                \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\theta\\theta}} &=& 0\\\\
                                \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\theta\\varphi}} &=& \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\varphi\\theta}} = 0\\\\
                                \\Gamma^\\color{green}{\\theta}_{\\,\\,\\color{green}{\\varphi\\varphi}} &=& -\\sin\\color{green}{\\theta}\\,\\cos\\color{green}{\\theta}
                            \\end{eqnarray}$$`}

                        For <MathJax inline>{`$\\mu = \\color{green}{\\varphi}$`}</MathJax>,
                            {`$$ \\begin{eqnarray}
                                \\Gamma^\\color{green}{\\varphi}_{\\,\\,\\color{green}{\\theta\\theta}} &=& 0\\\\
                                \\Gamma^\\color{green}{\\varphi}_{\\,\\,\\color{green}{\\theta\\varphi}} &=& \\Gamma^\\color{green}{\\varphi}_{\\,\\,\\color{green}{\\varphi\\theta}} = \\frac{\\cos\\color{green}{\\theta}}{\\sin\\color{green}{\\theta}}\\\\
                                \\Gamma^\\color{green}{\\varphi}_{\\,\\,\\color{green}{\\varphi\\varphi}} &=& 0
                            \\end{eqnarray}$$`}
                    </Expandable>

                    <br />

                    Finally, we can derive the <Color color="green">geodesic equation</Color> for our sphere:
                        {`$$\\left\\{\\begin{eqnarray}
                            \\frac{d^2\\theta}{d\\tau^2} - \\sin\\color{green}{\\theta}\\,\\cos\\color{green}{\\theta}\\,\\left(\\frac{d\\varphi}{d\\tau}\\right)^2 &=& 0\\\\
                            \\frac{d^2\\varphi}{d\\tau^2} + 2\\,\\frac{\\cos\\color{green}{\\theta}}{\\sin\\color{green}{\\theta}}\\,\\frac{d\\theta}{d\\tau}\\,\\frac{d\\varphi}{d\\tau} &=& 0
                        \\end{eqnarray}\\right.$$`}
                    For example, if we consider that the <Color color="purple">ant</Color> moves on the equator, we have <MathJax inline>{`$\\color{green}{\\theta} = \\frac{\\pi}{2}$`}</MathJax>, and we see that both equations are verified.
                    The equator is therefore a <Strong>geodesic</Strong> of the sphere, and so an <Color color="purple">ant</Color> would be able to walk freely on it.
                    <br /><br />
                    If instead we consider that the <Color color="purple">ant</Color> moves on one of the upper latitudes, we have <MathJax inline>{`$\\color{green}{\\theta} = \\frac{\\pi}{4}$`}</MathJax>, and we see that the first equation is verified, but not the second.
                    So the top latitude is <Strong>not a geodesic</Strong> of the sphere, and so an <Color color="purple">ant</Color> would <Strong>not be able</Strong> to walk on it <Strong>without the help of an external force</Strong>.
                </Paragraph>
            </SubSection>
        </TextContent>
    )
}