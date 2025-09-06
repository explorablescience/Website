import { extend, ThreeElement } from '@react-three/fiber';
import { JSX } from 'react';
import { FontData, FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';
import fira from './Fira_Sans.json';
import quicksand from './Quicksand_Regular.json';

extend({ TextGeometry })
declare module "@react-three/fiber" {
    interface ThreeElements {
        textGeometry: ThreeElement<typeof TextGeometry>;
    }
}

type TextProps = JSX.IntrinsicElements['group'] & {
    text: string;
    color?: string;
    font?: "fira" | "quicksand";
}

/**
 * Create a 3D text.
 */
export default function Text3d(props: TextProps) {
    const font = new FontLoader().parse((props.font === "quicksand" ? quicksand : fira) as unknown as FontData);

    return (
        <group {...props} dispose={null}>
            <mesh scale={[1.4, 1.4, 0.1]}>
                <textGeometry args={[props.text, { font, size: 0.1, depth: 0.1 }]} />
                <meshBasicMaterial attach="material" color={props.color ?? "black"} />
            </mesh>
        </group>
    );
}