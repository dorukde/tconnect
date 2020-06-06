import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useMemo ,useState,useRef} from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Physics, useBox, usePlane, useSphere } from 'use-cannon'
import niceColors from 'nice-color-palettes'
import './styles.css'

function Plane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  )
}

function Extrusion({ start = [0,0], paths, ...props }) {
  var length = 12, width = 8;
  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo( 0,0 );
    shape.lineTo( 10, 10 );
    shape.lineTo( 20, 0 );
   // shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );
    return shape
  }, [])
  var extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
  };
  return (
    <mesh>
      <extrudeGeometry attach="geometry" args={[shape, extrudeSettings]} />
      <meshBasicMaterial color="#0f0"/>
    </mesh>
  )
}

function App() {
  var length = 12, width = 8;
  return (
    <Canvas concurrent shadowMap sRGB gl={{ alpha: false }} camera={{ position: [0, 0, 35] }}>
    <hemisphereLight intensity={0.35} />
    <spotLight position={[30, 0, 30]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, 0, -30]}>
      <Plane color={niceColors[17][1]} />
      <Plane color={niceColors[17][1]} position={[-6, 0, 0]} rotation={[0, 0.9, 0]} />
      <Plane color={niceColors[17][2]} position={[6, 0, 0]} rotation={[0, -0.9, 0]} />
      <Plane color={niceColors[17][3]} position={[0, 6, 0]} rotation={[0.9, 0, 0]} />
      <Plane color={niceColors[17][0]} position={[0, -6, 0]} rotation={[-0.9, 0, 0]} /> 
     
      <Suspense fallback={null}>
      <Extrusion paths={[[0,width],[length,width],[length,length],[0,0]]}  amount={0}/>
      </Suspense>
    </Physics>
  </Canvas>
  );
}

export default App;
