import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useMemo ,useState,useRef} from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { Physics, useBox, usePlane } from 'use-cannon'
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

function Cube(color, ...props) {
  const [ref] = useBox(() => ({ mass: 1, position: [10, 15, 20], ...props }))
  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color={'red'} />
    </mesh>
  )
}

function Extrusion({start = [0,0], paths, color, ...props }) {
  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo( ...start );
    paths.forEach(path=>{
      shape.lineTo( ...path);
    })  
    return shape
  }, [])


  return (
    <mesh receiveShadow castShadow>
      <extrudeGeometry attach="geometry" args={[shape, props]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  )
}

function App() {

  return (
    <Canvas concurrent shadowMap sRGB gl={{ alpha: false }}  camera={{ position: [0, -25, 50], fov: 50}} >
    <hemisphereLight intensity={0.25} />
    <pointLight position={[-30, 0, 30]} intensity={0.3} />
    <pointLight position={[30, 30, 30]} intensity={0.3} />

      <spotLight intensity={0.2} position={[30, 40, 50]} angle={0.5} penumbra={1} castShadow />

    <Physics gravity={[0, 0, -10]}>
      <Plane color={niceColors[17][1]} />
      <Cube />
      <Suspense fallback={null}>
      <Extrusion start={[0,0,20]} paths={[[10,10],[20,0],[0,0]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'#697689'}/>
      <Extrusion start={[0,0]} paths={[[0,20],[10,10],[0,0]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'#f47373'}/>
      <Extrusion start={[15,5]} paths={[[15,15],[20,10],[20,0],[15,5]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'hotpink'}/>
      <Extrusion start={[10,10]} paths={[[15,15],[15,5],[10,10]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'orange'}/>
      <Extrusion start={[0,20]} paths={[[5,15],[10,20],[0,20]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'red'}/>
      <Extrusion start={[10,10]} paths={[[15,15],[10,20],[5,15],[10,10]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'green'}/>
      <Extrusion start={[20,10]} paths={[[20,20],[10,20],[20,10]]} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={'blue'}/>
      </Suspense>
    </Physics>
  </Canvas>
  );
}

export default App;
