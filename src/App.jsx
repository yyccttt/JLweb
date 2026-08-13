import React, { Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GithubLogo, X } from '@phosphor-icons/react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment, Html, useGLTF, useProgress } from '@react-three/drei'

const MODEL_URL = `${import.meta.env.BASE_URL}models/yuan-cheng.glb`

const views = {
  profile: {
    label: '个人简介',
    hint: '专业方向',
    className: 'nav-profile',
    camera: [0, 0.18, 3.35],
    target: [0, 0.08, 0],
    eyebrow: 'COMPUTER SCIENCE STUDENT',
    title: '计算机专业，\n也做完整产品。',
    body: '以软件开发为核心，正在把课程知识、工程实践和个人项目整理成可验证的作品。',
    facts: ['软件开发', '产品实践', '3D Web', '持续学习'],
  },
  skills: {
    label: '技术能力',
    hint: '工具与语言',
    className: 'nav-skills',
    camera: [1.45, 0.42, 2.15],
    target: [0, 0.22, 0],
    eyebrow: 'TECHNICAL SKILLS',
    title: '从代码基础，\n到浏览器里的 3D。',
    body: '围绕前端开发和计算机专业基础构建能力，并使用版本控制完成真实项目。',
    facts: ['JavaScript / React', 'Three.js / WebGL', 'Git / GitHub', '数据结构与算法'],
  },
  projects: {
    label: '项目经历',
    hint: '做过什么',
    className: 'nav-projects',
    camera: [-1.55, 0.12, 2.25],
    target: [0, 0.04, 0],
    eyebrow: 'PROJECT EXPERIENCE',
    title: '项目不只展示结果，\n也展示解决过程。',
    body: 'JLweb 是当前核心项目，将优化后的 3D 模型、响应式界面和镜头交互整合为个人简历网站。',
    facts: ['React + Three.js', 'GLB 模型优化', '响应式交互', 'GitHub 持续同步'],
  },
  education: {
    label: '教育背景',
    hint: '学习路径',
    className: 'nav-education',
    camera: [1.2, 0.72, 2.05],
    target: [0, 0.38, 0],
    eyebrow: 'EDUCATION',
    title: '计算机专业课程，\n连接工程实践。',
    body: '学习内容覆盖编程基础、算法、数据库和计算机网络，并通过个人项目持续实践。',
    facts: ['程序设计基础', '数据库系统', '计算机网络', '软件工程'],
  },
  contact: {
    label: '联系方式',
    hint: '保持联系',
    className: 'nav-contact',
    camera: [0.18, 0.78, 1.82],
    target: [0, 0.47, 0],
    eyebrow: 'CONTACT',
    title: '查看代码，\n也欢迎交流。',
    body: '项目源码和后续更新会持续发布在 GitHub，目前可以通过主页了解我的公开项目。',
    facts: ['GitHub：@yyccttt'],
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
      camera={{ position: views.profile.camera, fov: 34, near: 0.1, far: 100 }}
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
      {item.facts && (
        <ul className="resume-facts" aria-label={`${item.label}要点`}>
          {item.facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      )}
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
  const [activeView, setActiveView] = useState('profile')
  const [panelOpen, setPanelOpen] = useState(true)

  const handleViewChange = (view) => {
    setActiveView(view)
    setPanelOpen(true)
  }

  return (
    <main className="experience-shell">
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => handleViewChange('profile')}>
          YUAN<span>CHENG</span>
        </button>
        <p>计算机专业 / 个人简历</p>
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
