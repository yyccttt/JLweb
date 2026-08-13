import React, { lazy, Suspense, useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  Code,
  GithubLogo,
  GraduationCap,
  IdentificationCard,
  X,
} from '@phosphor-icons/react'
const Scene3D = lazy(() => import('./Scene3D.jsx'))

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
    intro: '信息与计算科学专业，聚焦 AI 软件开发、AI 短视频制作与相关应用。',
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
    intro: '以 Python 和 AI 工具为核心，覆盖软件开发、内容制作与企业应用集成。',
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
    intro: '遵义医科大学信息与计算科学专业，预计 2027 年毕业。',
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
  { name: 'AI 编程工具', items: ['Codex', 'Cursor', 'Grok', 'ZCode', 'Claude Code'] },
  { name: 'AI 内容制作', items: ['LibTV', '即梦', '可灵', 'AI 短视频', '提示词设计'] },
  { name: '开发与数据', items: ['Python', 'Flask', 'SQL Server', 'SQLAlchemy', 'Pandas', 'OpenPyXL'] },
  { name: '前端与 3D', items: ['JavaScript', 'React', 'Next.js', 'Three.js', 'HTML', 'CSS'] },
  { name: '企业应用', items: ['钉钉后台管理', '钉钉应用开发', '用友 U8 ERP', 'Shopify', 'REST API'] },
  { name: '工程协作', items: ['Git', 'GitHub', 'Gitee', 'Issue / PR', 'GitHub Actions', 'Render'] },
]

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
        <p>我叫袁诚，毕业于遵义医科大学信息与计算科学专业，预计 2027 年毕业。具备企业业务系统、会员管理平台及 3D Web 项目开发实践。</p>
        <p>理解能力和动手能力较强，重视需求分析与实际解决问题的能力。希望将对 AI 工具和开发流程的熟悉转化为可落地的产品，用 AI 解决身边的真实问题。</p>
        <div className="career-grid">
          <section>
            <h2>求职方向</h2>
            <p>AI 软件开发、AI 短视频制作及 AI 相关岗位</p>
          </section>
          <section>
            <h2>职业目标</h2>
            <p>在 AI 时代持续做出有实际价值、能够被验证的成果。</p>
          </section>
        </div>
        <div className="profile-focus"><span>理解能力强</span><span>动手能力强</span><span>善于解决实际问题</span></div>
      </div>
    )
  }
  if (activeView === 'skills') {
    return (
      <div className="skills-content">
        <p>熟练使用 Codex、Cursor、Grok、ZCode 与 Claude Code 等 AI 工具辅助需求分析、编码、调试和代码审查，并能使用多种生成工具完成 AI 短视频内容制作。</p>
        <div className="skill-groups">{skillGroups.map((group) => <section key={group.name}><h2>{group.name}</h2><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></section>)}</div>
      </div>
    )
  }
  if (activeView === 'projects') return <ProjectList />
  if (activeView === 'education') {
    return (
      <div className="education-layout">
        <section className="education-primary">
          <p className="education-year">2027 年毕业</p>
          <h2>遵义医科大学</h2>
          <strong>信息与计算科学专业</strong>
        </section>
        <section><h2>专业与实践</h2><p>学习数学与计算机相关课程，并通过企业项目与个人作品持续积累软件开发、数据处理、问题排查和工程协作经验。</p></section>
        <section><h2>发展方向</h2><p>重点关注 AI 软件开发、生成式 AI 工具应用和 AI 短视频内容制作。</p></section>
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
  const [loadScene, setLoadScene] = useState(false)
  const handleViewChange = (view) => { setActiveView(view); setPanelOpen(true) }

  useEffect(() => {
    let idleId
    let timerId
    const begin = () => setLoadScene(true)
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(begin, { timeout: 1200 })
      } else {
        timerId = window.setTimeout(begin, 150)
      }
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      if (idleId) window.cancelIdleCallback(idleId)
      if (timerId) window.clearTimeout(timerId)
    }
  }, [])

  return (
    <main className="experience-shell">
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => handleViewChange('profile')}>YUAN<span>CHENG</span></button>
        <p>计算机专业 / 全栈开发 / 3D WEB</p>
      </header>
      <div className="scene-layer" aria-label="袁诚的 3D 人物模型">
        <div className="scene-placeholder" aria-hidden="true" />
        {loadScene && (
          <Suspense fallback={<div className="model-status">正在载入 3D 人物</div>}>
            <Scene3D activeView={activeView} views={views} />
          </Suspense>
        )}
      </div>
      <FloatingNav activeView={activeView} onChange={handleViewChange} />
      {panelOpen && <InfoPanel activeView={activeView} onClose={() => setPanelOpen(false)} />}
      <div className="model-caption" aria-hidden="true"><span>拖动模型查看视角</span></div>
      <div className="grain" aria-hidden="true" />
    </main>
  )
}
