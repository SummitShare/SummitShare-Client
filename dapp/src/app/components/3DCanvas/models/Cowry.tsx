/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/cowry.glb -t -r public 
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    band: THREE.Mesh
    beeds: THREE.Mesh
    rope: THREE.Mesh
  }
  materials: {
    ['MAT_Cowery Beads']: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function Cowry(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/cowry.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.band.geometry} material={materials['MAT_Cowery Beads']} scale={0.9} />
      <mesh geometry={nodes.beeds.geometry} material={materials['MAT_Cowery Beads']} scale={0.9} />
      <mesh geometry={nodes.rope.geometry} material={materials['MAT_Cowery Beads']} scale={0.9} />
    </group>
  )
}

useGLTF.preload('/models/cowry.glb')
