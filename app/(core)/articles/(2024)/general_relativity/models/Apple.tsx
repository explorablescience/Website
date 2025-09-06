import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { JSX } from 'react'

type GLTFResult = GLTF & {
    nodes: {
        Apple: THREE.Mesh
        Trunc: THREE.Mesh
        Leaf: THREE.Mesh
        Connect: THREE.Mesh
    }
    materials: {
        Apple: THREE.MeshStandardMaterial
        Trunc: THREE.MeshStandardMaterial
        Leaf: THREE.MeshStandardMaterial
    }
}

export function Apple(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/articles/general_relativity/models/apple/apple.gltf') as unknown as GLTFResult
    return (
        <group name='Apple' {...props} dispose={null}>
            <mesh geometry={nodes.Apple.geometry} material={materials.Apple} position={[-0.142, -0.047, 0.064]} scale={[1.18, 1.174, 1.257]} castShadow />
            <mesh geometry={nodes.Trunc.geometry} material={materials.Trunc} position={[-0.2, 1.21, 0.129]} rotation={[0.254, -0.139, 0.204]} scale={[0.047, 0.241, 0.055]} castShadow />
            <mesh geometry={nodes.Leaf.geometry} material={materials.Leaf} position={[-0.265, 1.921, -0.601]} rotation={[-2.751, 0.132, -0.869]} scale={[-0.421, -0.012, -0.961]} castShadow />
            <mesh geometry={nodes.Connect.geometry} material={materials.Trunc} position={[-0.285, 1.533, 0.142]} rotation={[-1.253, -0.043, 0.585]} scale={[0.008, 0.085, 0.005]} castShadow />
        </group>
    )
}

useGLTF.preload('/articles/general_relativity/models/apple/apple.gltf')
