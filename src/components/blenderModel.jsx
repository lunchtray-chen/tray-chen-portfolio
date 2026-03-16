import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function OtherModel({modelname}) {
  const { scene } = useGLTF(modelname) 
  scene.position.y = -1.5

  return <primitive object={scene} />
}

function BlenderModel({modelname}) {
  return (
    <div className='model'>
    <Canvas
      camera={{ position: [0, 0, 5], fov: 30 }}
      style={{ width: '100%', height: '60vh' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} color='#f8deff' />
        <directionalLight position={[10, 10, 10]} intensity={3} color='#eceeff' />
        <OtherModel modelname={modelname}/>
        <OrbitControls />
      </Suspense>
    </Canvas>
    </div>
  )
}

export default BlenderModel