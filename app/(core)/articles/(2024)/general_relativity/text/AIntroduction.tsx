'use client'

import { useEffect, useState } from "react";
import { Color, Landmark, Note, Error, Strong } from "./APart";

export default function AIntroduction() {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        setIsDesktop(window.innerWidth > 1120);
    }, []);

    return (
        <>
            In the realm of physics, there are concepts that challenge our intuitive <Strong>understanding of the universe</Strong>, unveiling layers of complexity that lie beneath the surface of everyday experience.
            Some concepts, such as the <Landmark color="blue"><Strong>curvature of <Color color="purple">space-time</Color></Strong></Landmark> and the concept of <Landmark color="purple"><Strong>gravity</Strong></Landmark>, are so abstract that they defy our ability to visualise them.
            Yet, despite their abstract nature, these concepts are essential to our <Strong>understanding of the universe</Strong>, and I believe that they are worth exploring.

            <br /><br />

            <Note>
                In this article I will take a slightly <Strong>different approach to most of the resources</Strong> I have come across.
                Firstly, you will find <Strong>interactive 3D animations</Strong> to help you visualise the concepts we will be exploring.
                Secondly, I believe that the best way to really understand a concept is to explore it through its <Color color="green">equations</Color> and hear what they have to say.
                <Color color="green"> Mathematics</Color> is at first and foremost a tool, but it can also be a source of <Strong>beauty</Strong>.

                <br /><br />
            
                To understand the <Strong>core concepts</Strong> of this article, you will need a basic understanding of what a <Color color="blue">vector</Color> and a <Color color="blue">derivative</Color> are, although I will try to remind you of these concepts as we go along.
                However, if you want to understand <Strong>each equation and proof</Strong>, a <Color color="blue">more advanced knowledge</Color> of mathematics would be beneficial.
            </Note>

            <br />

            This article will be divided into <Strong>two parts</Strong>, as I feel that the concepts we will be exploring are too vast to be covered in a single article.
            In this article, we will embark on a journey through the mathematical landscapes of <Landmark color="red"><Strong>geodesics</Strong></Landmark> and <Landmark color="red"><Strong>metric tensors</Strong></Landmark>.
            We will trace the evolution of these concepts, from the notions of <Color color="blue">forces</Color> to the revolutionary insights that reshaped our understanding of <Color color="purple">space-time</Color>.
            By the <i>end of this article</i>, you will have a solid understanding of <Strong>how objects behave</Strong> in <Color color="purple">space-time</Color>.
            <i> So, without further ado, let us begin our journey.</i>

            {!isDesktop && 
                <Error>
                    <Color color="red"><Strong>Warning:</Strong></Color> This article is not optimized for mobile devices.
                    For a better experience, please use a <Strong>wider screen device</Strong>, as this article uses <Strong>scroll</Strong> to animate some of its content.
                    Everything will still be working, but <Color color="red"><Strong>every animation will be frozen</Strong></Color>.
                </Error>
            }
        </>
    )
}