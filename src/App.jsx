import React, { Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GithubLogo, X } from '@phosphor-icons/react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment, Html, useGLTF, useProgress } from '@react-three/drei'

const MODEL_URL = '/models/yuan-cheng.glb'

const views = {
  hello: {
    label: '你好',
    hint: '先看正面',
    className: 'nav-hello',
    camera: [0, 0.18, 3.35],
    target: [0, 0.08, 0],
    eyebrow: 'HELLO, I AM YUAN CHENG',
    title: '把想法做成\n可以体验的东西。',
    body: '我关注产品、视觉和代码之间的连接。这个空间用一个 3D 的我，替代一张普通头像。',
  },
  about: {
    label: '关于我',
    hint: '靠近一点',
    className: 'nav-about',
    camera: [1.45, 0.42, 2.15],
    target: [0, 0.22, 0],
    eyebrow: 'ABOUT ME',
    title: '设计感觉，\n也设计系统。',
    body: '我喜欢清晰的结构，也喜欢不那么规矩的表达。目标始终一样，让复杂的东西变得自然。',
  },
  work: {
    label: '项目',
    hint: '换个角度',
    className: 'nav-work',
    camera: [-1.55, 0.12, 2.25],
    target: [0, 0.04, 0],
    eyebrow: 'SELECTED WORK',
    title: '网页、产品，\n还有实验。',
    body: '这里会放进真实项目、过程和结果。不是项目清单，而是我如何思考和解决问题的现场。',
  },
  contact: {
    label: '联系我',
    hint: '面对面聊',
    className: 'nav-contact',
    camera: [0.18, 0.78, 1.82],
    target: [0, 0.47, 0],
    eyebrow: 'LET US TALK',
    title: '有好玩的事，\n一起做。',
    body: '如果你正在做一个值得投入的产品、品牌或数字体验，欢迎把想法发给我。',
  },
}

function Model() {
  const { scene } = useGLTF(MODEL_URL, true)

  return (
    <primitive
      object={scene}
      position={[0.03, -1.09, 0]}
      rotation={[0, -0.03, 0]}
      scale={1.95}
    />
  )
}

function CameraRig({ activeView }) {
  const controls = useRef(null)
  const view = views[activeView]

  useEffect(() => {
    if (!controls.current) return
    controls.current.setLookAt(...view.camera, ...view.target, true)
  }, [view])

  return <CameraControls ref={controls} makeDefault minDistance={1.45} maxDistance={4.5} />
}

function LoadingScene() {
  return (
    <Html center>
      <span className="canvas-loading">读取模型</span>
    </Html>
  )
}

function Scene({ activeView }) {
  return (
    <Canvas
      camera={{ position: views.hello.camera, fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 0.78
      }}
    >
      <ambientLight intensity={0.62} color="#ffffff" />
      <directionalLight position={[4, 5, 4]} intensity={1.9} color="#fff4ed" />
      <directionalLight position={[-4, 2, 1]} intensity={0.48} color="#ffffff" />
      <pointLight position={[0, 0.45, 2.2]} intensity={0.62} distance={4} decay={2} color="#ffc6b5" />
      <Suspense fallback={<LoadingScene />}>
        <Model />
        <Environment preset="studio" environmentIntensity={0.24} />
      </Suspense>
      <CameraRig activeView={activeView} />
    </Canvas>
  )
}

function LoadingOverlay() {
  const { active, progress } = useProgress()
  if (!active && progress === 100) return null

  return (
    <div className="loading-overlay" aria-live="polite">
      <span>正在建立 3D 空间</span>
      <strong>{Math.round(progress)}%</strong>
      <div className="loading-line" style={{ '--progress': `${progress}%` }} />
    </div>
  )
}

function FloatingNav({ activeView, onChange }) {
  return (
    <nav className="floating-nav" aria-label="3D 视角导航">
      {Object.entries(views).map(([key, item]) => (
        <button
          className={`view-button ${item.className} ${activeView === key ? 'is-active' : ''}`}
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={activeView === key}
        >
          <span>{item.label}</span>
          <small>{item.hint}</small>
        </button>
      ))}
    </nav>
  )
}

function InfoPanel({ activeView, onClose }) {
  const item = views[activeView]
  const isContact = activeView === 'contact'

  return (
    <aside className="info-panel" key={activeView} aria-live="polite">
      <button className="panel-close" type="button" onClick={onClose} aria-label="关闭介绍">
        <X size={18} weight="bold" />
      </button>
      <p className="eyebrow">{item.eyebrow}</p>
      <h1>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
      <p className="panel-copy">{item.body}</p>
      {isContact && (
        <a className="contact-link" href="https://github.com/yyccttt" target="_blank" rel="noreferrer">
          <GithubLogo size={19} weight="bold" />
          在 GitHub 联系
          <ArrowUpRight size={17} weight="bold" />
        </a>
      )}
    </aside>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('hello')
  const [panelOpen, setPanelOpen] = useState(true)

  const handleViewChange = (view) => {
    setActiveView(view)
    setPanelOpen(true)
  }

  return (
    <main className="experience-shell">
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => handleViewChange('hello')}>
          YUAN<span>CHENG</span>
        </button>
        <p>个人作品集 / 2026</p>
      </header>

      <div className="scene-layer" aria-label="袁程的 3D 人物模型">
        <Scene activeView={activeView} />
      </div>

      <LoadingOverlay />
      <FloatingNav activeView={activeView} onChange={handleViewChange} />
      {panelOpen && <InfoPanel activeView={activeView} onClose={() => setPanelOpen(false)} />}

      <div className="model-caption" aria-hidden="true">
        <span>拖动视角</span>
        <span>点击文字切换镜头</span>
      </div>
      <div className="grain" aria-hidden="true" />
    </main>
  )
}

useGLTF.preload(MODEL_URL, true)
