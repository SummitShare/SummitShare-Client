/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/drum.glb -t -r public 
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    BODY: THREE.Mesh;
    COVERS: THREE.Mesh;
    MID_PATTERN: THREE.Mesh;
    SIDERS: THREE.Mesh;
    TOP_OBJ: THREE.Mesh;
  };
  materials: {
    ['MAT -  Drum']: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>
>;

export function Drum(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/drum.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.BODY.geometry}
        material={materials['MAT -  Drum']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.9}
      />
      <mesh
        geometry={nodes.COVERS.geometry}
        material={materials['MAT -  Drum']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.9}
      />
      <mesh
        geometry={nodes.MID_PATTERN.geometry}
        material={materials['MAT -  Drum']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.9}
      />
      <mesh
        geometry={nodes.SIDERS.geometry}
        material={materials['MAT -  Drum']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.9}
      />
      <mesh
        geometry={nodes.TOP_OBJ.geometry}
        material={materials['MAT -  Drum']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.9}
      />
    </group>
  );
}

useGLTF.preload('/models/drum.glb');
