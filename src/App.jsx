import React, { Suspense, useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  Code,
  GithubLogo,
  GraduationCap,
  IdentificationCard,
  X,
} from '@phosphor-icons/react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment, Html, useGLTF, useProgress } from '@react-three/drei'

const MODEL_URL = `${import.meta.env.BASE_URL}models/yuan-cheng.glb`

const views = {
  profile: {
    label: '个人简介',
    hint: '关于我',
    icon: IdentificationCard,
    className: 'nav-profile',
    camera: [0, 0.18, 3.35],
    target: [0, 0.08, 0],
    kicker: 'PROFILE',
    title: '理解业务，\n也交付完整产品。',
    intro: '计算机相关专业背景，具备企业业务系统与 Web 应用开发实践。',
  },
  skills: {
    label: '技术能力',
    hint: '技术栈',
    icon: Code,
    className: 'nav-skills',
    camera: [1.45, 0.42, 2.15],
    target: [0, 0.22, 0],
    kicker: 'CAPABILITIES',
    title: '从数据和接口，\n到浏览器里的 3D。',
    intro: '围绕真实业务持续扩展全栈开发、系统集成与交互表达能力。',
  },
  projects: {
    label: '项目经历',
    hint: '实践项目',
    icon: Briefcase,
    className: 'nav-projects',
    camera: [-1.55, 0.12, 2.25],
    target: [0, 0.04, 0],
    kicker: 'SELECTED PROJECTS',
    title: '项目展示结果，\n也呈现解决过程。',
    intro: '聚焦企业业务系统、商业 Web 产品与 3D 交互体验。',
  },
  education: {
    label: '教育背景',
    hint: '学习路径',
    icon: GraduationCap,
    className: 'nav-education',
    camera: [1.2, 0.72, 2.05],
    target: [0, 0.38, 0],
    kicker: 'EDUCATION',
    title: '专业基础，\n连接工程实践。',
    intro: '计算机相关专业学习，并通过企业项目与个人作品持续实践。',
  },
  contact: {
    label: '联系方式',
    hint: '保持联系',
    icon: GithubLogo,
    className: 'nav-contact',
    camera: [0.18, 0.78, 1.82],
    target: [0, 0.47, 0],
    kicker: 'CONTACT',
    title: '查看代码，\n也欢迎交流。',
    intro: '公开项目与后续更新将持续发布在 GitHub。',
  },
}

const projects = [
  {
    name: 'ZLWEBAPP',
    type: '企业内部业务管理平台',
    summary: '面向制造业企业，覆盖销售、采购、财务、库存、质量与安全巡检等业务，并连接用友 U8 与钉钉。',
    work: [
      '参与应收账款、客户账期、出纳催款及回款匹配等财务模块开发。',
      '完善采购询价、订单跟踪、销售发货和库存分析等业务流程。',
      '定位 SQL 查询、数据过滤与业务规则问题，支持 Excel 报表导出。',
      '参与 Issue 开发、Pull Request 审查、冲突处理与功能合并。',
    ],
    stack: ['Python', 'Flask', 'SQL Server', 'U8 ERP', '钉钉开放平台', 'Pandas'],
  },
  {
    name: 'LifeNuva',
    type: '会员与团队管理平台',
    summary: '围绕会员、邀请关系、团队管理和财务审核场景建设的商业 Web 平台。',
    work: [
      '参与会员码激活、邀请码、团队关系与成员管理功能开发。',
      '完善提现申请、财务审核及后台管理流程。',
      '处理 Shopify 商城入口、环境配置和部署相关问题。',
    ],
    stack: ['React', 'Next.js', 'Node.js', 'Shopify', 'Render', 'GitHub Issues'],
  },
  {
    name: 'JLweb',
    type: '3D 交互式个人简历',
    summary: '以全屏数字人物模型为视觉主体，通过镜头切换展示个人能力与项目经历。',
    work: [
      '完成 GLB 模型加载、灯光调校、拖动观察和响应式页面布局。',
      '为不同简历模块设置独立镜头，实现导航与视角联动。',
      '配置 GitHub Actions 和 GitHub Pages 自动构建部署。',
    ],
    stack: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Drei', 'GLB'],
  },
  {
    name: 'AI 内容工作流',
    type: '视频与数字内容实践',
    summary: '探索使用代码和生成式 AI 制作产品广告、机械演示及企业宣传内容。',
    work: [
      '根据产品结构和卖点设计脚本、分镜与结构化生成提示词。',
      '研究 HTML 视频框架及可复用的动画内容生产方式。',
    ],
    stack: ['HyperFrames', 'HTML / CSS', 'JavaScript', 'AI 视频', '提示词设计'],
  },
]

const skillGroups = [
  { name: '后端与数据', items: ['Python', 'Flask', 'SQL Server', 'SQLAlchemy', 'Pandas', 'OpenPyXL'] },
  { name: '前端与 3D', items: ['JavaScript', 'React', 'Next.js', 'Three.js', 'HTML', 'CSS'] },
  { name: '系统集成', items: ['用友 U8 ERP', '钉钉开放平台', 'Shopify', 'REST API'] },
  { name: '工程协作', items: ['Git', 'GitHub', 'Gitee', 'Issue / PR', 'GitHub Actions', 'Render'] },
]

function Model() {
  const { scene } = useGLTF(MODEL_URL, true)
  return <primitive object={scene} position={[0.03, -1.09, 0]} rotation={[0, -0.03, 0]} scale={1.95} />
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
  return <Html center><span className="canvas-loading">读取模型</span></Html>
}

function Scene({ activeView }) {
  return (
    <Canvas
      camera={{ position: views.profile.camera, fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 0.78 }}
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
      <span>正在建立 3D 空间</span><strong>{Math.round(progress)}%</strong>
      <div className="loading-line" style={{ '--progress': `${progress}%` }} />
    </div>
  )
}

function FloatingNav({ activeView, onChange }) {
  return (
    <nav className="floating-nav" aria-label="简历导航">
      {Object.entries(views).map(([key, item]) => {
        const Icon = item.icon
        return (
          <button
            className={`view-button ${item.className} ${activeView === key ? 'is-active' : ''}`}
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={activeView === key}
          >
            <Icon size={18} weight={activeView === key ? 'fill' : 'regular'} />
            <span><strong>{item.label}</strong><small>{item.hint}</small></span>
          </button>
        )
      })}
    </nav>
  )
}

function ProjectList() {
  const [expanded, setExpanded] = useState(0)
  return (
    <div className="project-list">
      {projects.map((project, index) => {
        const isOpen = expanded === index
        return (
          <article className={`project-item ${isOpen ? 'is-open' : ''}`} key={project.name}>
            <button className="project-heading" type="button" onClick={() => setExpanded(isOpen ? -1 : index)} aria-expanded={isOpen}>
              <span><strong>{project.name}</strong><small>{project.type}</small></span>
              <span className="project-toggle">{isOpen ? '收起' : '展开'}</span>
            </button>
            {isOpen && (
              <div className="project-detail">
                <p>{project.summary}</p>
                <ul>{project.work.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="tech-row" aria-label="项目技术栈">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function PanelContent({ activeView }) {
  if (activeView === 'profile') {
    return (
      <div className="profile-copy">
        <p>参与制造业内部管理平台、会员管理平台及 3D Web 项目开发，能够将财务、采购、销售等业务需求转化为数据查询、后端功能和前端页面。</p>
        <p>熟悉 Python、Flask、SQL Server、JavaScript 与 React，具备用友 U8、钉钉等系统集成经验。注重从实际问题出发，并持续探索 AI 辅助开发与 Web 3D 技术。</p>
        <div className="profile-focus"><span>业务型全栈开发</span><span>企业系统集成</span><span>3D Web 实践</span></div>
      </div>
    )
  }
  if (activeView === 'skills') {
    return <div className="skill-groups">{skillGroups.map((group) => <section key={group.name}><h2>{group.name}</h2><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></section>)}</div>
  }
  if (activeView === 'projects') return <ProjectList />
  if (activeView === 'education') {
    return (
      <div className="education-layout">
        <section><h2>学习方向</h2><p>编程基础、数据结构与算法、数据库系统、计算机网络及软件工程。</p></section>
        <section><h2>实践方式</h2><p>以真实业务需求和个人项目验证所学内容，持续积累代码实现、问题排查与工程协作经验。</p></section>
      </div>
    )
  }
  return (
    <div className="contact-content">
      <p>GitHub <strong>@yyccttt</strong></p>
      <a className="contact-link" href="https://github.com/yyccttt" target="_blank" rel="noreferrer">
        <GithubLogo size={20} weight="bold" />查看公开项目<ArrowUpRight size={17} weight="bold" />
      </a>
    </div>
  )
}

function InfoPanel({ activeView, onClose }) {
  const item = views[activeView]
  return (
    <aside className={`info-panel panel-${activeView}`} key={activeView} aria-live="polite">
      <button className="panel-close" type="button" onClick={onClose} aria-label="关闭介绍"><X size={18} weight="bold" /></button>
      <header className="panel-header">
        <p className="kicker">{item.kicker}</p>
        <h1>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="panel-intro">{item.intro}</p>
      </header>
      <div className="panel-body"><PanelContent activeView={activeView} /></div>
    </aside>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('profile')
  const [panelOpen, setPanelOpen] = useState(true)
  const handleViewChange = (view) => { setActiveView(view); setPanelOpen(true) }

  return (
    <main className="experience-shell">
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => handleViewChange('profile')}>YUAN<span>CHENG</span></button>
        <p>计算机专业 / 全栈开发 / 3D WEB</p>
      </header>
      <div className="scene-layer" aria-label="袁程的 3D 人物模型"><Scene activeView={activeView} /></div>
      <LoadingOverlay />
      <FloatingNav activeView={activeView} onChange={handleViewChange} />
      {panelOpen && <InfoPanel activeView={activeView} onClose={() => setPanelOpen(false)} />}
      <div className="model-caption" aria-hidden="true"><span>拖动模型查看视角</span></div>
      <div className="grain" aria-hidden="true" />
    </main>
  )
}

useGLTF.preload(MODEL_URL, true)
