import React, { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  Buildings,
  ChatCircleDots,
  Code,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
  IdentificationCard,
  LockKey,
  Phone,
  PaperPlaneTilt,
  Play,
  X,
} from '@phosphor-icons/react'
const Scene3D = lazy(() => import('./Scene3D.jsx'))
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://jlweb-resume-ai.onrender.com/api/chat'
const GITHUB_ACCESS_API_URL = import.meta.env.VITE_GITHUB_ACCESS_API_URL || 'https://jlweb-resume-ai.onrender.com/api/github-access'

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <button className="model-retry" type="button" onClick={this.props.onRetry}>
          3D 加载中断，点击重试
        </button>
      )
    }
    return this.props.children
  }
}

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
  experience: {
    label: '实习经历',
    hint: '工作实践',
    icon: Buildings,
    className: 'nav-experience',
    camera: [-1.15, 0.58, 2.12],
    target: [0, 0.3, 0],
    kicker: 'WORK EXPERIENCE',
    title: '走进生产现场，\n再把需求做成产品。',
    intro: '在同一企业体系内完成生产学习、业务系统开发、客户项目交付与 AI 内容制作。',
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
    type: '制造企业一体化业务管理平台',
    summary: '参与制造企业内部管理平台的需求分析、功能开发与持续维护，围绕生产、采购、销售、财务、质量、仓储、安全及绩效等业务场景，推进原有 Excel 与人工协作流程的数字化改造。',
    role: '全栈开发 · 需求对接 · 系统维护',
    showcase: {
      src: `${import.meta.env.BASE_URL}images/zlwebapp-receivables-anonymized.png`,
      alt: 'ZLWEBAPP 应收账款管理页面脱敏截图',
      title: '财务应收与催款工作台',
      caption: '面向财务人员的日常业务场景，将记账、收支登记、应收核对、客户账期维护、催款跟进与出纳操作集中到统一工作台，减少多份 Excel 往返核对，让财务数据更清晰、催款进度更容易追踪。截图中的企业与金额信息已脱敏。',
    },
    work: [
      '重点参与出纳与应收管理，完成收支明细、客户账期、应收余额、业务应催款、订单收款及 Excel 导入导出等功能。',
      '对接用友 U8 ERP 与钉钉开放平台，实现发货、总账、组织、审批及考勤等业务数据的自动汇总与协同。',
      '参与生产执行、采购询价、样品台账、安全闭环和 KPI 考核等模块建设，将多部门业务规则落地为可追踪的系统流程。',
      '负责线上问题定位与持续迭代，通过查询合并、缓存、异步加载和分页等方式优化复杂业务页面性能。',
    ],
    outcomes: [
      '覆盖生产、采购、销售、财务、质量、仓储、安全与绩效等核心场景',
      '形成约 400 条可追溯 Git 提交，持续完成需求交付、修复与性能优化',
      '减少重复录入与人工统计，让业务数据能够查询、提醒、导出和闭环追踪',
    ],
    stack: ['Python', 'Flask', 'SQL Server', 'JavaScript', 'Vue 2', 'U8 ERP', '钉钉开放平台', 'Git / Gitee'],
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
    name: '酒酿智能检测系统',
    type: '软硬件结合的 AIoT 数据分析平台',
    summary: '面向酒酿发酵过程的环境与品质监测，通过 ESP32 和多类传感器持续采集数据，由软件平台完成数据汇总、可视化、AI 分析与智能问答。',
    work: [
      '使用 ESP32 连接温度、酒精浓度与 pH 传感器，完成关键发酵指标的数据采集。',
      '负责软件端数据接收、整理与可视化，为发酵状态观察和趋势判断提供直观依据。',
      '结合 AI 能力实现检测数据分析与智能问答，辅助理解指标变化及异常情况。',
      '项目曾用于全国大学生计算机设计大赛及“挑战杯”竞赛。',
    ],
    stack: ['ESP32', '温度传感器', '酒精浓度传感器', 'pH 传感器', '数据可视化', 'AI 数据分析', '智能问答'],
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
    videos: [
      {
        title: '末日补给',
        description: 'AI 短视频成片',
        duration: '00:42',
        poster: 'videos/apocalypse-supply.webp',
        src: 'videos/apocalypse-supply.mp4',
      },
      {
        title: '吃多了',
        description: 'AI 短视频成片',
        duration: '00:36',
        poster: 'videos/ate-too-much.webp',
        src: 'videos/ate-too-much.mp4',
      },
    ],
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

const certificates = [
  {
    title: '全国高校计算机能力挑战赛',
    award: '人工智能挑战赛全国决赛本科组三等奖',
    date: '2024 年 12 月',
    image: 'certificates/previews/computer-ability-2024.webp',
    file: 'certificates/computer-ability-challenge-2024.pdf',
  },
  {
    title: '中国机器人及人工智能大赛',
    award: '全国总决赛三等奖',
    date: '2026 年 7 月',
    image: 'certificates/previews/craic-national-2026.webp',
    file: 'certificates/craic-2026-national-third-prize.pdf',
  },
  {
    title: '中国机器人及人工智能大赛',
    award: '贵州赛区一等奖',
    date: '2026 年 6 月',
    image: 'certificates/previews/craic-guizhou-2026.webp',
    file: 'certificates/craic-2026-guizhou-first-prize.pdf',
  },
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

function VideoShowcase({ videos }) {
  const [activeVideo, setActiveVideo] = useState('')

  return (
    <section className="video-showcase" aria-labelledby="video-showcase-title">
      <div className="video-showcase-heading">
        <h2 id="video-showcase-title">AI 短视频作品</h2>
        <p>点击作品后才加载视频</p>
      </div>
      <div className="video-grid">
        {videos.map((video) => {
          const isActive = activeVideo === video.src
          const posterUrl = `${import.meta.env.BASE_URL}${video.poster}`
          return (
            <figure className="video-card" key={video.src}>
              <div className="video-frame">
                {isActive ? (
                  <video
                    src={`${import.meta.env.BASE_URL}${video.src}`}
                    poster={posterUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    aria-label={`播放${video.title}`}
                  />
                ) : (
                  <button type="button" onClick={() => setActiveVideo(video.src)} aria-label={`播放${video.title}`}>
                    <img src={posterUrl} alt={`${video.title}视频封面`} loading="lazy" decoding="async" />
                    <span className="video-play"><Play size={18} weight="fill" aria-hidden="true" /></span>
                  </button>
                )}
              </div>
              <figcaption>
                <span><strong>{video.title}</strong><small>{video.description}</small></span>
                <time>{video.duration}</time>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}

function ProjectList() {
  const [expanded, setExpanded] = useState(-1)
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
                {project.role && <div className="project-role">{project.role}</div>}
                <h4>项目介绍</h4>
                <p>{project.summary}</p>
                <h4>个人职责</h4>
                <ul>{project.work.map((item) => <li key={item}>{item}</li>)}</ul>
                {project.outcomes && (
                  <>
                    <h4>项目成果</h4>
                    <ul className="project-outcomes">{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
                  </>
                )}
                {project.showcase && (
                  <figure className="project-showcase">
                    <img src={project.showcase.src} alt={project.showcase.alt} loading="lazy" decoding="async" />
                    <figcaption>
                      <strong>{project.showcase.title}</strong>
                      <span>{project.showcase.caption}</span>
                    </figcaption>
                  </figure>
                )}
                <h4>技术栈</h4>
                <div className="tech-row" aria-label="项目技术栈">
                  {project.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
                {project.videos && <VideoShowcase videos={project.videos} />}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function PanelContent({ activeView }) {
  const [githubGateOpen, setGithubGateOpen] = useState(false)
  const [githubPassword, setGithubPassword] = useState('')
  const [githubGateStatus, setGithubGateStatus] = useState({ loading: false, error: '' })

  const unlockGithub = async (event) => {
    event.preventDefault()
    if (!githubPassword || githubGateStatus.loading) return
    setGithubGateStatus({ loading: true, error: '' })
    try {
      const response = await fetch(GITHUB_ACCESS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: githubPassword }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.url) throw new Error(data.error || '验证服务暂时不可用')
      window.location.assign(data.url)
    } catch (error) {
      setGithubGateStatus({ loading: false, error: error.message || '验证服务暂时不可用' })
    }
  }

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
        <div className="profile-focus" aria-label="个人特质">
          <span><strong>理解能力强</strong><small>快速抓住需求重点</small></span>
          <span><strong>动手能力强</strong><small>用实践验证想法</small></span>
          <span><strong>善于解决实际问题</strong><small>关注真正可落地的结果</small></span>
        </div>
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
  if (activeView === 'experience') {
    return (
      <div className="work-experience">
        <section className="work-entry">
          <header><div><span>生产一线学习</span><strong>15 天</strong></div><h2>遵义中立精工制造有限公司</h2></header>
          <ul>
            <li>深入第一生产线学习制造流程，为后续软件开发和企业需求对接建立业务基础。</li>
            <li>通过现场观察及与一线人员沟通，理解实际生产环节中的问题与真实需求，提升业务分析和跨岗位沟通能力。</li>
          </ul>
        </section>
        <section className="work-entry">
          <header><div><span>软件开发与 AI 内容制作</span><strong>5 个月</strong></div><h2>贵州艾立科技有限公司</h2></header>
          <ul>
            <li>面向兄弟公司开展业务系统开发与维护，主要参与企业内部管理平台 ZLWEBAPP，具体成果见项目经历。</li>
            <li>独立负责外部客户项目 LifeNuva 会员官网，从客户沟通、需求梳理到完整开发交付全程推进。</li>
            <li>使用生成式 AI 制作员工入职培训视频，并通过 LibTV 完成吉他配件宣传视频。</li>
          </ul>
        </section>
      </div>
    )
  }
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
        <div className="certificate-section">
          <h2>荣誉证书</h2>
          <div className="certificate-list">
            {certificates.map((certificate) => (
              <a
                className="certificate-card"
                href={`${import.meta.env.BASE_URL}${certificate.file}`}
                target="_blank"
                rel="noreferrer"
                key={`${certificate.title}-${certificate.award}`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${certificate.image}`}
                  alt={`${certificate.title}${certificate.award}证书预览`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="certificate-copy">
                  <strong>{certificate.award}</strong>
                  <small>{certificate.title}</small>
                  <em>{certificate.date} / 查看原件</em>
                </span>
                <ArrowUpRight size={17} weight="bold" />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="contact-content">
      <div className="contact-list">
        <a href="tel:15772200132">
          <Phone size={19} weight="bold" />
          <span><small>电话</small><strong>157 7220 0132</strong></span>
        </a>
        <a href="mailto:yc2164241187@qq.com">
          <EnvelopeSimple size={19} weight="bold" />
          <span><small>邮箱</small><strong>yc2164241187@qq.com</strong></span>
        </a>
      </div>
      {!githubGateOpen ? (
        <button className="contact-link" type="button" onClick={() => setGithubGateOpen(true)}>
          <GithubLogo size={20} weight="bold" />查看公开项目<LockKey size={17} weight="bold" />
        </button>
      ) : (
        <form className="github-gate" onSubmit={unlockGithub}>
          <label htmlFor="github-access-password"><LockKey size={16} weight="bold" />访问密码</label>
          <div>
            <input
              id="github-access-password"
              type="password"
              value={githubPassword}
              onChange={(event) => setGithubPassword(event.target.value)}
              placeholder="请输入密码"
              autoComplete="current-password"
              maxLength={128}
              autoFocus
            />
            <button type="submit" disabled={!githubPassword || githubGateStatus.loading}>
              {githubGateStatus.loading ? '验证中' : '解锁'}
            </button>
          </div>
          {githubGateStatus.error && <p role="alert">{githubGateStatus.error}</p>}
        </form>
      )}
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

function ResumeChat({ activeView, panelOpen }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好，我是袁诚的 AI 分身。你可以问我项目经历、技术能力或求职方向。' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [answerError, setAnswerError] = useState(false)
  const requestController = useRef(null)

  useEffect(() => {
    requestController.current?.abort()
    requestController.current = null
    setOpen(false)
    setInput('')
    setAnswer('')
    setAnswerError(false)
    setLoading(false)
  }, [activeView, panelOpen])

  const sendMessage = async (event) => {
    event.preventDefault()
    const content = input.trim()
    if (!content || loading) return
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setAnswer('')
    setAnswerError(false)
    const controller = new AbortController()
    requestController.current?.abort()
    requestController.current = controller
    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
        signal: controller.signal,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '服务暂时不可用')
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
      setAnswer(data.reply)
    } catch (error) {
      if (error.name === 'AbortError') return
      const errorMessage = error.message || '连接失败，请稍后再试。'
      setMessages((current) => [...current, { role: 'assistant', content: errorMessage }])
      setAnswer(errorMessage)
      setAnswerError(true)
    } finally {
      if (requestController.current === controller) {
        requestController.current = null
        setLoading(false)
      }
    }
  }

  return (
    <>
      {open && (loading || answer) && (
        <aside className={`model-answer ${answerError ? 'is-error' : ''} ${panelOpen ? 'is-panel-open' : ''}`} aria-live="polite">
          <small>袁诚的 AI 分身</small>
          <p>{loading ? '我想一下…' : answer}</p>
        </aside>
      )}
      <div className={`resume-chat ${open ? 'is-open' : ''} ${panelOpen ? 'is-panel-open' : ''}`}>
        {open && <form className="chat-composer" onSubmit={sendMessage}>
          <ChatCircleDots size={19} weight="fill" aria-hidden="true" />
          <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} placeholder="问问我的项目或能力…" aria-label="输入问题" autoFocus />
          <button className="chat-send" type="submit" disabled={!input.trim() || loading} aria-label="发送"><PaperPlaneTilt size={17} weight="fill" /></button>
          <button className="chat-close" type="button" onClick={() => { setOpen(false); setAnswer('') }} aria-label="关闭对话"><X size={15} weight="bold" /></button>
        </form>}
        {!open && <button className="chat-trigger" type="button" onClick={() => setOpen(true)}><ChatCircleDots size={20} weight="fill" /><span>和我聊聊</span></button>}
      </div>
    </>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('profile')
  const [panelOpen, setPanelOpen] = useState(false)
  const [loadScene, setLoadScene] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [sceneAttempt, setSceneAttempt] = useState(0)
  const handleViewChange = (view) => { setActiveView(view); setPanelOpen(true) }

  useEffect(() => {
    const timerId = window.setTimeout(() => setLoadScene(true), 50)
    return () => window.clearTimeout(timerId)
  }, [])

  const retryScene = () => {
    setSceneReady(false)
    setSceneAttempt((attempt) => attempt + 1)
  }

  return (
    <main className="experience-shell">
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => handleViewChange('profile')}>YUAN<span>CHENG</span></button>
        <p>计算机专业 / 全栈开发 / 3D WEB</p>
      </header>
      <div className="scene-layer" aria-label="袁诚的 3D 人物模型">
        <div className="scene-placeholder" aria-hidden="true" />
        {!sceneReady && <div className="model-progress" role="status">3D 人物正在加载</div>}
        {loadScene && (
          <SceneErrorBoundary key={sceneAttempt} onRetry={retryScene}>
            <Suspense fallback={null}>
              <Scene3D activeView={activeView} views={views} onReady={() => setSceneReady(true)} />
            </Suspense>
          </SceneErrorBoundary>
        )}
      </div>
      <FloatingNav activeView={activeView} onChange={handleViewChange} />
      {panelOpen && <InfoPanel activeView={activeView} onClose={() => setPanelOpen(false)} />}
      <ResumeChat activeView={activeView} panelOpen={panelOpen} />
      <div className="model-caption" aria-hidden="true"><span>拖动模型查看视角</span></div>
      <div className="grain" aria-hidden="true" />
    </main>
  )
}
