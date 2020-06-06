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

  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo( ...start );
    paths.forEach(path=>{
      shape.lineTo( ...path);
    })
    
    return shape
  }, [])

  return (
    <mesh>
      <extrudeGeometry attach="geometry" args={[shape, props]} />
      <meshBasicMaterial color="#0f0"/>
    </mesh>
  )
}

function App() {

  return (
    <Canvas concurrent shadowMap sRGB gl={{ alpha: false }} camera={{ position: [0, 0, 35] }}>
    <hemisphereLight intensity={0.35} />
    <spotLight position={[30, 0, 30]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, 0, -30]}>
      <Plane color={niceColors[17][1]} />
 
      <Suspense fallback={null}>
      <Extrusion start={[0,0]} paths={[[10,10],[20,0],[0,0]]} step={2} bevelEnabled depth={16} bevelSize={1}bevelThickness={1} bevelOffset={0} amount={0}/>
      </Suspense>
    </Physics>
  </Canvas>
  );
}

export default App;
