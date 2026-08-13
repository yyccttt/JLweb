import React, { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Html, useGLTF, useProgress } from '@react-three/drei'

function Model({ url, useMeshOpt, onReady }) {
  const { scene } = useGLTF(url, false, useMeshOpt)

  useEffect(() => {
    onReady()
  }, [onReady, scene])

  return <primitive object={scene} position={[0.03, -1.09, 0]} rotation={[0, -0.03, 0]} scale={1.95} />
}

function CameraRig({ activeView, views }) {
  const controls = useRef(null)
  const view = views[activeView]

  useEffect(() => {
    if (!controls.current) return
    controls.current.setLookAt(...view.camera, ...view.target, true)
  }, [view])

  return <CameraControls ref={controls} makeDefault minDistance={1.45} maxDistance={4.5} />
}

function ModelProgress() {
  const { progress } = useProgress()
  return <Html center><span className="model-status">载入人物 {Math.round(progress)}%</span></Html>
}

export default function Scene3D({ activeView, views, onReady }) {
  const isMobile = useMemo(() => window.matchMedia('(max-width: 767px)').matches, [])
  const modelUrl = `${import.meta.env.BASE_URL}models/${isMobile ? 'yuan-cheng-mobile-safe.glb' : 'yuan-cheng-optimized.glb'}`

  return (
    <Canvas
      camera={{ position: views.profile.camera, fov: 34, near: 0.1, far: 100 }}
      dpr={isMobile ? [1, 1.15] : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 0.78 }}
    >
      <ambientLight intensity={0.72} color="#ffffff" />
      <hemisphereLight args={['#fff7f1', '#798b81', 0.55]} />
      <directionalLight position={[4, 5, 4]} intensity={1.9} color="#fff4ed" />
      <directionalLight position={[-4, 2, 1]} intensity={0.48} color="#ffffff" />
      <pointLight position={[0, 0.45, 2.2]} intensity={0.62} distance={4} decay={2} color="#ffc6b5" />
      <Suspense fallback={<ModelProgress />}>
        <Model url={modelUrl} useMeshOpt={!isMobile} onReady={onReady} />
      </Suspense>
      <CameraRig activeView={activeView} views={views} />
    </Canvas>
  )
}
