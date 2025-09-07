import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { JSX } from 'react'

type GLTFResult = GLTF & {
    nodes: {
        Cube008: THREE.Mesh
        Cube007: THREE.Mesh
        Cube006: THREE.Mesh
        Cube005: THREE.Mesh
        Cube004: THREE.Mesh
        Cube003: THREE.Mesh
        Cube001: THREE.Mesh
        Cube: THREE.Mesh
        Vert: THREE.Mesh
    }
}

export function Tree(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/articles/general_relativity/models/tree/tree.gltf') as unknown as GLTFResult

    // Set materials
    const materials = {
        Leafs: new THREE.MeshStandardMaterial({ color: new THREE.Color("#9CDE1A"), metalness: 0.5, roughness: 0.5 }),
        Leafs2: new THREE.MeshStandardMaterial({ color: new THREE.Color("#355524"), metalness: 0.5, roughness: 0.5 }),
        Trunc: new THREE.MeshStandardMaterial({ color: new THREE.Color("#433B24"), metalness: 0.5, roughness: 0.5 }),
    };

    return (
        <group name='Tree' {...props} dispose={null}>
            <mesh geometry={nodes.Cube008.geometry} material={materials.Leafs} position={[-0.913, 7.244, -0.66]} rotation={[1.604, -0.316, -3.141]} scale={-136.287} castShadow />
            <mesh geometry={nodes.Cube007.geometry} material={materials.Leafs2} position={[-0.488, 5.376, -0.208]} rotation={[-Math.PI / 2, -0.611, 0]} scale={102.762} castShadow />
            <mesh geometry={nodes.Cube006.geometry} material={materials.Leafs2} position={[0.834, 4.535, -0.62]} rotation={[-Math.PI / 2, -0.611, 0]} scale={43.845} castShadow />
            <mesh geometry={nodes.Cube005.geometry} material={materials.Leafs} position={[0.079, 6.204, 0.588]} rotation={[-0.924, 0.576, 1.308]} scale={-136.287} castShadow />
            <mesh geometry={nodes.Cube004.geometry} material={materials.Leafs} position={[-0.071, 6.348, -1.631]} rotation={[Math.PI / 2, -0.047, -Math.PI]} scale={159.695} castShadow />
            <mesh geometry={nodes.Cube003.geometry} material={materials.Leafs2} position={[-1.248, 4.091, 0.552]} rotation={[-2.884, -0.901, -0.26]} scale={-28.354} castShadow />
            <mesh geometry={nodes.Cube001.geometry} material={materials.Leafs} position={[-1.863, 5.914, 0.602]} rotation={[Math.PI / 2, -0.047, -Math.PI]} scale={159.695} castShadow />
            <mesh geometry={nodes.Cube.geometry} material={materials.Leafs} position={[1.131, 5.64, -0.571]} rotation={[-Math.PI / 2, -0.611, 0]} scale={133.525} castShadow />
            <mesh geometry={nodes.Vert.geometry} material={materials.Trunc} rotation={[-Math.PI / 2, 0, 0]} scale={100} castShadow />
        </group>
    )
}

export function TreeLeaves(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/articles/general_relativity/models/tree/tree.gltf') as unknown as GLTFResult

    // Set materials
    const materials = {
        Leafs: new THREE.MeshStandardMaterial({ color: new THREE.Color("#9CDE1A"), metalness: 0.5, roughness: 0.5 }),
        Leafs2: new THREE.MeshStandardMaterial({ color: new THREE.Color("#355524"), metalness: 0.5, roughness: 0.5 }),
        Trunc: new THREE.MeshStandardMaterial({ color: new THREE.Color("#433B24"), metalness: 0.5, roughness: 0.5 }),
    };

    return (
        <group name='Tree' {...props} dispose={null}>
            <mesh geometry={nodes.Cube008.geometry} material={materials.Leafs} position={[-0.913, 7.244, -0.66]} rotation={[1.604, -0.316, -3.141]} scale={-136.287} castShadow />
            <mesh geometry={nodes.Cube007.geometry} material={materials.Leafs2} position={[-0.488, 5.376, -0.208]} rotation={[-Math.PI / 2, -0.611, 0]} scale={102.762} castShadow />
            <mesh geometry={nodes.Cube006.geometry} material={materials.Leafs2} position={[0.834, 4.535, -0.62]} rotation={[-Math.PI / 2, -0.611, 0]} scale={43.845} castShadow />
            <mesh geometry={nodes.Cube005.geometry} material={materials.Leafs} position={[0.079, 6.204, 0.588]} rotation={[-0.924, 0.576, 1.308]} scale={-136.287} castShadow />
            <mesh geometry={nodes.Cube004.geometry} material={materials.Leafs} position={[-0.071, 6.348, -1.631]} rotation={[Math.PI / 2, -0.047, -Math.PI]} scale={159.695} castShadow />
            <mesh geometry={nodes.Cube001.geometry} material={materials.Leafs} position={[-1.863, 5.914, 0.602]} rotation={[Math.PI / 2, -0.047, -Math.PI]} scale={159.695} castShadow />
            <mesh geometry={nodes.Cube.geometry} material={materials.Leafs} position={[1.131, 5.64, -0.571]} rotation={[-Math.PI / 2, -0.611, 0]} scale={133.525} castShadow />
        </group>
    )
}

useGLTF.preload('/articles/general_relativity/models/tree/tree.gltf')
