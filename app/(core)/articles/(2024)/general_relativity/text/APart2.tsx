'use client';

import { MathJax } from "better-react-mathjax";
import SubSection from "../structure/SubSection";
import TextContent from "../structure/TextContent";
import { Cite, Color, EquationOverline, HSpace, Landmark, Note, Paragraph, Strong, Underline } from "./APart";
import { ASim2Part1, ASim2Part2 } from "../simulations/ASim2";
import { IsDesktop } from "../structure/Section";
import { useContext } from "react";

export default function APart2() {
    const isDesktop = useContext(IsDesktop);

    return (
        <TextContent>
            <SubSection
                title="Unifying Space and Time">

                <Paragraph>
                    In classical mechanics, we usually think of an object as a <b>point in <Color color="purple">space</Color></b> moving through <Color color="green">time</Color>.
                    <Color color="purple"> Space</Color> is <Color color="purple"><i>where</i></Color> the object moves, and <Color color="green">time</Color> is a measure of the <Color color="green"><i>duration</i></Color> between these moves.
                    In the world of physics, however, time and space are more intertwined than we might first think.
                    <Cite>What if <Color color="green">time</Color> is also a dimension ?</Cite>
                    A revolution in physics came with the realisation that <Color color="purple">space</Color> and <Color color="green">time</Color> are not separate entities, but rather two interconnected aspects of a unified four-dimensional structure: the <Landmark color="red">space-time</Landmark>.
                    This fundamental idea lies at the heart of <Underline>Albert Einstein</Underline>'s theory of relativity and is the key to understanding the nature of gravity.
                </Paragraph>
            </SubSection>

            <SubSection
                title="World lines"
                alignSimulation="right"
                simulation={ASim2Part1}>

                <Paragraph>
                    To imagine this concept, let's look at the previous example of an apple falling from a tree.
                    Instead of thinking of these two objects as moving in <Strong>three-dimensional</Strong> <Color color="purple">space</Color>, we can think of them as moving through <Strong>four-dimensional</Strong> <Landmark color="red">space-time</Landmark>.
                    Usually we only show a two-dimensional version of this space as a grid, with one axis representing <Color color="purple">space</Color> (<i>the horizontal axis</i>) and the other representing <Color color="green">time</Color> (<i>the vertical axis</i>).
                    
                    <HSpace />
                    
                    In our usual <i>three-dimensional representation</i>, the tree <Strong>doesn't move</Strong> around the diagram and is represented by a point.
                    In this <i><Landmark color="red">space-time</Landmark> representation</i>, however, the tree is still moving through the <Color color="green">time</Color> dimension and is <Strong>no longer static</Strong>.
                    Its path is now described as a straight line.
                    If we now add up all the points along the apple's falling path, we get a <Strong>curve</Strong> that shows to us the effect of gravity.
                    Each of these lines, which describe the life of every object in the universe, is called a <Landmark color="gray">world line</Landmark>.

                    <HSpace />

                    Let us now cut these <Landmark color="gray">world lines</Landmark> at fixed intervals and label them with numbers.
                    The apple and the trees now move through <Color color="purple">space</Color> and <Color color="green">time</Color> along this curve, and the numbers describe their relative positions along this curve.
                    These different numbers are called <Strong>proper times</Strong> and are denoted by the letter <MathJax inline>{`$\\tau$`}</MathJax>.
                    Physically they measure the <Strong>age</Strong> of the object, or the <Strong>duration</Strong> of its existence, relatively to its own clock.

                    {isDesktop && <><HSpace /><HSpace /></>}
                </Paragraph>
            </SubSection>

            <SubSection
                title="Four-vectors"
                alignSimulation="left"
                simulation={ASim2Part2}>

                <Paragraph>
                    In classical mechanics, we would describe the position of an object at a given time by a <Strong>three-dimensional vector</Strong> <MathJax inline>{`$\\vec{x}(t)$`}</MathJax>.
                    However, this representation is no longer sufficient because <Color color="green">time</Color> is now a dimension.
                    We therefore need to use a <Strong>four-dimensional vector</Strong>, called the <Strong>four-position</Strong> <MathJax inline>{`$\\landmarkgray{\\,\\mathbf{x}(\\tau)\\,}$`}</MathJax>, which is described by its four components:
                        {`$$\\\{\\,x^\\mu(\\tau)\\,\\\}_{\\mu} \\quad\\text{ with  } \\,\\mu = \\color{green}{0}, \\color{purple}{1}, \\color{purple}{2}, \\color{purple}{3}.$$`}
                    The Greek letter <MathJax inline>{`$\\mu$`}</MathJax> describes the different components of this four-vector: <MathJax inline>{`$\\mu=\\color{green}{0}$`}</MathJax> for the <Color color="green">time</Color> coordinate and <MathJax inline>{`$\\mu=\\color{purple}{1}, \\color{purple}{2}, \\color{purple}{3}$`}</MathJax> for the <Color color="purple">space</Color> coordinate.
                    This four-vector describes the position of the object in <Landmark color="red">space-time</Landmark> at a given <Strong>proper time</Strong>, <i>or age</i>, <MathJax inline>{`$\\tau$`}</MathJax>.
                </Paragraph>

                <Paragraph>
                    For example, if we consider our previous tree at the origin of our coordinate system, its <Landmark color="gray">world line</Landmark> is described by the four-vector <MathJax inline>{`$\\,\\mathbf{x}(\\tau)\\, = (x^t(\\tau),\\,0,\\,0,\\,0)$`}</MathJax>, where <MathJax inline>{`$x^t$`}</MathJax> is its non-zero <Color color="green">time</Color> coordinate.
                    Instead, the apple falls on one <Color color="purple">space</Color> dimension, so its four-position is given by <MathJax inline>{`$\\,\\mathbf{x}(\\tau)\\, = (x^t(\\tau),\\,0,\\,x^y(\\tau),\\,0)$`}</MathJax>. 
                    
                    <HSpace />

                    In a more general way, we can write any four-position vector as the sum of its components in <Color color="green">time</Color> and <Color color="purple">space</Color> of the basis vectors <MathJax inline>{`$\\mathbf{e}_\\mu$`}</MathJax>:
                        {`$$\\mathbf{x}(\\tau) = \\color{green}{x^t(\\tau)}\\,\\landmarkgreen{\\,\\mathbf{e}_t\\,} + \\sum_{i=\\color{purple}{1}, \\color{purple}{2}, \\color{purple}{3}} \\color{purple}{x^i(\\tau)}\\,\\landmarkpurple{\\,\\mathbf{e}_i\\,}.$$`}
                    Using the notation <MathJax inline>{`$\\mu = \\color{green}{0}, \\color{purple}{1}, \\color{purple}{2}, \\color{purple}{3}$`}</MathJax>, we can write it as:
                        {`$$\\mathbf{x}(\\tau) = \\sum_{\\mu=\\color{green}{0}, \\color{purple}{1}, \\color{purple}{2}, \\color{purple}{3}} x^\\mu(\\tau)\\,\\mathbf{e}_\\mu.$$`}
                    <Note>Note that we have used <MathJax inline>{`$\\mu$`}</MathJax> as a <b>subscript</b> for <b>basis vectors</b> and as an <b>exponent</b> for <b>components</b>.
                    In this article we'll keep the same interpretation for both and ignore the implications of these differences.</Note>
                    To simplify the notation, we will often use the <Strong>Einstein summation convention</Strong> and omit the summation symbol when a variable is repeated in a product, so that the above equation finally becomes:
                        <EquationOverline>{`$$\\mathbf{x}(\\tau) = x^\\mu(\\tau)\\,\\mathbf{e}_\\mu.$$`}</EquationOverline>

                    <Cite>Ok! So now we know how to describe the position of an object in space-time. But can we know more? Can we know how it moves through it?</Cite>
                    In the next section, we will answer this question by deriving the <Strong>geodesic equation</Strong>.
                </Paragraph>
            </SubSection>
        </TextContent>
    )
}