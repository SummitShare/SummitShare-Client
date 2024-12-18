/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/calabash.glb -t -r public --draco 
*/


import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    calabash_base: THREE.Mesh
    calabash_nest: THREE.Mesh
  }
  materials: {
    POT: THREE.MeshStandardMaterial
    wire_224198087: THREE.MeshStandardMaterial
  }
}


// Create proper Euler rotation
const ROTATION = new THREE.Euler(Math.PI / 2, 0, 0);

export function Calabash(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/models/calabash.glb') as GLTFResult

  // Optimize materials if they're not going to change
  React.useMemo(() => {
    materials.POT.roughness = 0.7
    materials.POT.envMapIntensity = 1
    materials.wire_224198087.roughness = 0.5
    materials.wire_224198087.envMapIntensity = 1
  }, [materials])

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.calabash_base.geometry}
        material={materials.POT}
        rotation={ROTATION}
        castShadow
        receiveShadow
        matrixAutoUpdate={false}
        onUpdate={(self) => {
          self.updateMatrix()
        }}
      />
      <mesh
        geometry={nodes.calabash_nest.geometry}
        material={materials.wire_224198087}
        rotation={ROTATION}
        castShadow
        receiveShadow
        matrixAutoUpdate={false}
        onUpdate={(self) => {
          self.updateMatrix()
        }}
      />
    </group>
  )
}

// Only preload if this is the primary model being displayed
const modelPath = '/models/calabash.glb'
if (typeof window !== 'undefined') {
  useGLTF.preload(modelPath)
}