import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import '../index.css'

function CaterModel() {
  const { scene } = useGLTF('/footer caterpillar.glb')
  const headRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    scene.position.y = -0.3

    // find and store the Head empty
    headRef.current = scene.getObjectByName('Head001')

    // track mouse position normalized to -1 to 1
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [scene])

  useFrame(() => {
    if (!headRef.current) return

    // lerp rotation toward mouse position
    const targetX = -mouse.current.y * 0.7  // up/down
    const targetY = mouse.current.x * 0.9   // left/right

    headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.1
    headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1
  })

  return <primitive object={scene} />
}


function Footer() {
  return (
    <div className='footer'>
      <div className='footer-text flex-col'>
        <h3>
          <a href="mailto:gtchen2@stanford.edu"> gtchen2@stanford.edu </a>
           | 
          <a href='/Tray Chen Design Resume.pdf' download> Resume </a>
           | 
          <a href='https://www.linkedin.com/in/tray-chen/' target='_blank'> Linkedin </a>
           | 
          <a href='https://www.artstation.com/tray_chen' target='_blank'> Artstation </a>
        </h3>
        <p>Made with React, React Three Fiber, Blender, and the power of friendship✨</p>
      </div>
      <Canvas
        camera={{ position: [0, -0.4191, 3.5], fov: 45 }}
        style={{ width: '100%', height: '40vh' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={5} color='#ffefe5' />
          <directionalLight position={[10, 10, 5]} intensity={5} color='#ffefe5' />
          <CaterModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Footer