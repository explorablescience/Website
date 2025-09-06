import { Cite, Color, Landmark, Note, Strong, Underline } from "./APart";

export default function AConclusion() {
    return (
        <>
            As we conclude this first stage of our exploration, our expedition into the realm of <Color color="blue">geodesics</Color> and <Color color="blue">metric tensors</Color> has allowed us to gain a deeper understanding of our <Strong>universe</Strong>.
            We now have a firm grasp of how objects behave in space-time: they follow <Strong>straight lines at the speed of light in <Color color="purple"><Strong>curved</Strong></Color> space-time</Strong>.
            <Cite>A <Color color="purple"><Strong>curved</Strong></Color> space-time? You said <Color color="purple"><Strong>curved</Strong></Color>?</Cite>
            Yes, <Color color="purple"><Strong>curved</Strong></Color>.
            So far we have only explored the realm of <Strong>flat space-time</Strong>, where the lattice that defines the geometry of space-time changes from one point to another.
            But, in the realm of general relativity, this changing grid is directly related to the <Color color="purple"><Strong>curvature of space-time</Strong></Color>.
            In the last example we looked at the difference between a <Strong>flat surface</Strong> surface and a <Strong>curved survace</Strong>, a sphere.
            This example will be the starting point for our next journey.

            <br /><br />
            
            In the second part of our journey, we&apos;ll delve deeper into this concept, which will drive us to the heart of <Landmark color="red">Einstein&apos;s equation</Landmark> in <Color color="red">vacuum</Color>.
            <Cite>But where is <Color color="green"><Strong>mass</Strong></Color>? We didn&apos;t even talk about <Color color="green"><Strong>mass</Strong></Color> yet!</Cite>
            In fact, we haven&apos;t talked about <Color color="green"><Strong>mass</Strong></Color> yet, but it will be the subject of the next topic: the <Strong>stress-energy tensor</Strong>.
            This concept will finally guide us through the world of <Landmark color="gray">black holes</Landmark>, where we will explore the <Strong>Schwarzschild metric</Strong>.
            This journey will continue in the second part of this article.
            I hope you enjoyed this first part, and I hope to see you again in the second part and conclusion of this article.

            <br /><br />

            <Note>
                <Strong>Feedback</Strong>: I&apos;m always looking for feedback.
                I&apos;m always looking for feedback, so if you&apos;ve found something wrong, please tell me on Twitter <Underline href="https://twitter.com/MecanicaSci">@MecanicaSci</Underline> or by email at <Underline href="mailto:mecanicascience@gmail.com">mecanicascience@gmail.com</Underline>.
                Thank you for reading and see you soon!
            </Note>
        </>
    )
}