import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import '../index.css'

// <OrbitControls onChange={(e) => console.log(e.target.object.position)} />

const sphereLinks = {
    'Cube017': { type: 'link', url: 'https://www.linkedin.com/in/tray-chen/' },
    'Cube018': { type: 'download', url: '/Tray Chen Design Resume.pdf' },
    'Cube019': { type: 'link', url: 'https://www.artstation.com/tray_chen' },
    'Cube020': { type: 'link', url: 'https://github.com/lunchtray-chen' }
}
const sphereNames = Object.keys(sphereLinks)

const eyeNames = ['Sphere001']  // replace with your actual Blender names

function Model() {
    const { scene } = useGLTF('/caterpillar.glb')
    const [hoveredName, setHoveredName] = useState(null)
    const [headClicked, setHeadClicked] = useState(false)
    const [headHovered, setHeadHovered] = useState(false)
    const meshRefs = useRef({})
    const originalPositions = useRef({})
    const isScrolling = useRef(false)
    const scrollTimeout = useRef(null)
    const scrollTime = useRef(0)
    const eyeRefs = useRef({})
    const originalEyeRotations = useRef({})

    useEffect(() => {
        scene.traverse((child) => {
            if (eyeNames.includes(child.name)) {
                eyeRefs.current[child.name] = child
                // store original rotation
                originalEyeRotations.current[child.name] = child.rotation.x
            }

            // skip head children — only store the Head empty and body meshes
            if (child.name === 'Head') {
                // store the head parent empty
                meshRefs.current['Head'] = child
                originalPositions.current['Head'] = child.position.x
            } else if (child.isMesh && child.parent?.name !== 'Head') {
                // store all other meshes that aren't parented to Head
                meshRefs.current[child.name] = child
                originalPositions.current[child.name] = child.position.x
            }
        })
    }, [scene])

    useEffect(() => {
        const handleScroll = () => {
            isScrolling.current = true
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
            scrollTimeout.current = setTimeout(() => {
                isScrolling.current = false
            }, 70)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
        }
    }, [])

    useFrame((state, delta) => {
        // move whole scene when head clicked
        // tune the target position until only the head is visible
        const targetY = headClicked ? 8.5 : 0
        scene.position.y += (targetY - scene.position.y) * 0.05  // smooth lerp

        if (isScrolling.current && !headClicked) {
            scrollTime.current += delta
        }

        eyeNames.forEach(name => {
            const eye = eyeRefs.current[name]
            if (!eye) return
            const originalRot = originalEyeRotations.current[name]
            const targetRotation = headClicked ? originalRot + Math.PI / 8 : originalRot
            eye.rotation.x += (targetRotation - eye.rotation.x) * 0.05
        })

        let index = 0
        Object.entries(meshRefs.current).forEach(([name, mesh]) => {
            const original = originalPositions.current[name]
            const phaseOffset = index * 0.9
            const amplitude = 0.5
            const speed = 4.5

            if (isScrolling.current && !headClicked) {
                const targetX = original + Math.sin(scrollTime.current * speed + phaseOffset) * amplitude
                mesh.position.x += (targetX - mesh.position.x) * 0.3
            }

            index++
        })

        sphereNames.forEach(name => {
            const mesh = meshRefs.current[name]
            if (!mesh) return
            const targetScale = hoveredName === name ? 1.15 : 1
            mesh.scale.setScalar(
                mesh.scale.x + (targetScale - mesh.scale.x) * 0.2
            )
        })

        const headMesh = meshRefs.current['Head']
        if (headMesh) {
            const targetScale = headHovered ? 1.15 : 1
            headMesh.scale.setScalar(
                headMesh.scale.x + (targetScale - headMesh.scale.x) * 0.2
            )
        }
    })

    return (
        <primitive
            object={scene}
            onClick={(event) => {
                // head click
                if (event.object.parent?.name === 'Head' || event.object.name === 'Head') {
                    event.stopPropagation()
                    setHeadClicked(prev => !prev)  // toggle
                    return
                }

                // sphere links
                const sphere = sphereLinks[event.object.name]
                if (sphere) {
                    event.stopPropagation()

                    if (sphere.type === 'link') {
                        window.open(sphere.url, '_blank')
                    } else if (sphere.type === 'mailto') {
                        window.location.href = sphere.url  // opens email client
                    } else if (sphere.type === 'download') {
                        const a = document.createElement('a')
                        a.href = sphere.url
                        a.download = 'Tray Chen Design Resume.pdf'  // filename the user sees when downloading
                        a.click()
                    }
                }
            }}

            onPointerOver={(event) => {
                if (sphereNames.includes(event.object.name)) {
                    event.stopPropagation()
                    setHoveredName(event.object.name)
                    document.body.style.cursor = 'pointer'
                }
                if (event.object.parent?.name === 'Head' || event.object.name === 'Head') {
                    setHeadHovered(true)
                    document.body.style.cursor = 'pointer'
                }
            }}
            onPointerOut={(event) => {
                if (sphereNames.includes(event.object.name)) {
                    setHoveredName(null)
                }
                if (event.object.parent?.name === 'Head' || event.object.name === 'Head') {
                    setHeadHovered(false)
                }
                document.body.style.cursor = 'auto'
            }}
        />
    )
}

function NavBar() {
    return (
        <div className='navbar'>
            <Canvas camera={{ position: [0, 20, 9], fov: 30 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={6} color='#ffdfca' />
                    <directionalLight position={[10, 20, 10]} intensity={0.5} color='#fff1ea' />
                    <Model />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default NavBar