import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useMemo ,useState,useRef} from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Physics, useBox, usePlane } from 'use-cannon'
import niceColors from 'nice-color-palettes'
import './styles.css'


function Model(props) {
  const group = useRef()
  const { nodes, materials } = useLoader(GLTFLoader, '/triangle2.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.render_camera_n3d} />
      <mesh material={materials.Gelatin} geometry={nodes.unnamed.geometry} position={[25.18, 0, -5]} />
    </group>
  )
}

function Plane({ color, ...props }) {
  const [ref, api] = usePlane(() => ({mass: 0, ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial attach="material" color={color} />
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
  }, [start,paths])

  const [ref] = useBox(() => ({ mass: 1 }))

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <extrudeGeometry attach="geometry" args={[shape, props]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  )
}
const shapes = [
  { start:[0,0] ,paths:[[10,10],[20,0],[0,0]] ,color:'#697689'},
  { start:[0,0] ,paths:[[0,20],[10,10],[0,0]] ,color:'#f47373'},
  { start:[15,5],paths:[[15,15],[20,10],[20,0],[15,5]] ,color:'hotpink'},
   /* { start:[10,10] ,paths:[[15,15],[15,5],[10,10]] ,color:'orange'},
  { start:[0,20] ,paths:[[5,15],[10,20],[0,20]] ,color:'red'},
  { start:[10,10] ,paths:[[15,15],[10,20],[5,15],[10,10]] ,color:'green'},
  { start:[20,10] ,paths:[[20,20],[10,20],[20,10]] ,color:'blue'},
  */

]
function App() {

  return (
    <Canvas colorManagement concurrent shadowMap sRGB gl={{ alpha: false }}  camera={{ position: [0, -25, 200], fov: 50}} >
    <hemisphereLight intensity={0.2} />
    <pointLight position={[-30, 0, 30]} intensity={0.5} />
    <pointLight position={[30, 30, 30]} intensity={0.5} />
      <spotLight intensity={0.2} position={[30, 40, 50]} angle={0.5} penumbra={1} castShadow />
    <Physics gravity={[0, 0, -30]}>
    <Plane color={niceColors[17][1]} />
 {shapes.map((shape)=>
      <Extrusion start={shape.start} paths={shape.paths} steps={6} bevelEnabled depth={1} bevelSize={0.5}bevelThickness={1} bevelOffset={-0.5} amount={2} color={shape.color} />
          
        )} 
      <Suspense fallback={null}>
      <Model/>
       </Suspense>
    </Physics>
  </Canvas>
  );
}

export default App;
