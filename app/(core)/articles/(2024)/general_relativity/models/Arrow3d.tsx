import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { JSX } from 'react'

type GLTFResult = GLTF & {
    nodes: {
        Cone: THREE.Mesh
        Cylinder: THREE.Mesh
    }
}

type Props = JSX.IntrinsicElements['group'] & {
    length?: number,
    arrowOffset?: number,
    arrowScale?: number,
    color?: string,
}

/**
 * 3D Arrow
 * @param props.length Length of the line of the arrow
 * @param props.arrowOffset Position of the arrow on the line
 * @param props.arrowScale Scale of the arrow
 * @param props.color Color of the arrow
 */
export function Arrow3d(props: Props) {
    const { nodes } = useGLTF('/articles/general_relativity/models/arrow_3d/arrow_3d.gltf') as unknown as GLTFResult
    const materials = {
        arrow: new THREE.MeshStandardMaterial({ color: props.color ?? new THREE.Color("#121213"), metalness: 0.4, roughness: 0.5 }),
    };

    return (
        <group {...props} dispose={null}>
            <group dispose={null} scale={[0.03, 0.03, 0.03]}>
                <mesh geometry={nodes.Cone.geometry} material={materials.arrow} position={[0, 9.405 + (props.arrowOffset ?? 0), 0]} rotation={[-Math.PI / 2, 0, 0]} scale={201.34 * (props.arrowScale ?? 1)} castShadow />
                <mesh geometry={nodes.Cylinder.geometry} material={materials.arrow} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 753.528 * (props.length ?? 1)]} castShadow />
            </group>
        </group>
    )
}

useGLTF.preload('/articles/general_relativity/models/arrow_3d/arrow_3d.gltf')
