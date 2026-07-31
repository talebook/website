import { useEffect, useRef, useState } from 'react'

const DOCS_URL = '../docs/'
const GITHUB_URL = 'https://github.com/talebook/talebook'
const DOCKER_COMMAND = 'docker run -d --name talebook -p 8080:80 -v /localdata:/data talebook/talebook'
const GITHUB_STATS_API = 'https://api.github.com/repos/talebook/talebook'
const DOCKER_STATS_API = 'https://img.shields.io/docker/pulls/talebook/talebook.json'
const STATS_REFRESH_MS = 30 * 60 * 1000

const NAV_ITEMS = [
  { label: '界面', href: '#product' },
  { label: '能力', href: '#features' },
  { label: '部署', href: '#deploy' },
  { label: '文档', href: DOCS_URL },
]

const MOBILE_SHOTS = [
  {
    src: 'mobile-library.png',
    kicker: 'LIBRARY / 01',
    title: '响应式书库',
    desc: '封面书墙自动适配手机，随时翻看自己的完整收藏。',
  },
  {
    src: 'read.png',
    kicker: 'READER / 02',
    title: '沉浸阅读',
    desc: '在手机上直接阅读 EPUB、PDF 与常见电子书格式。',
  },
  {
    src: 'mobile-themes.png',
    kicker: 'THEMES / 03',
    title: '六套主题',
    desc: '默认、黄铜、石墨、浅灰、暖红与极简，明暗皆可切换。',
  },
  {
    src: 'settings.png',
    kicker: 'CONTROL / 04',
    title: '丰富设置',
    desc: '站点、用户、服务与系统配置，手机上也能清晰管理。',
  },
  {
    src: 'meta.png',
    kicker: 'METADATA / 05',
    title: '智能补全',
    desc: '从多个内容源匹配封面、作者、出版社与图书简介。',
  },
]

const CONTROL_SHOWCASES = [
  {
    src: 'themes.png',
    kicker: 'THEME LAB / 01',
    title: '六套主题，明暗两色',
    desc: '从纸页般温暖的暖红，到冷静克制的石墨与极简；主题即时生效，整套界面一起改变。',
    tags: ['默认', '黄铜', '石墨', '浅灰', '暖红', '极简'],
  },
  {
    src: 'settings-wide.png',
    kicker: 'CONTROL CENTER / 02',
    title: '设置丰富，但秩序清楚',
    desc: '用四个配置域收纳站点、权限、集成与系统能力，不必在散落的配置文件之间来回寻找。',
    tags: ['站点', '访问与用户', '服务与集成', '系统'],
  },
]

const FEATURES = [
  {
    icon: 'reader',
    title: '在线阅读',
    desc: '内置 candle-reader，自适应桌面与手机，支持 EPUB、PDF、MOBI、AZW3 等格式。',
    meta: 'MULTI-FORMAT',
    featured: true,
  },
  {
    icon: 'spark',
    title: '智能元数据',
    desc: '多源并行搜索图书信息，并支持 AI 大模型自动识别与补全。',
    meta: 'AI ENRICHED',
  },
  {
    icon: 'users',
    title: '多用户与 SSO',
    desc: '面向家庭或小团队共享，支持社交登录、权限管理与安全密码存储。',
    meta: 'FAMILY READY',
  },
  {
    icon: 'send',
    title: 'Kindle 推送',
    desc: '维护多个设备，后台自动转换格式，把想读的书送到手边。',
    meta: 'ONE-CLICK',
  },
  {
    icon: 'signal',
    title: 'OPDS 生态',
    desc: '兼容 KyBooks 等阅读 App，也可接入外部 OPDS 书库。',
    meta: 'OPEN PROTOCOL',
  },
  {
    icon: 'server',
    title: '随处部署',
    desc: 'Docker 一行启动，适配群晖、UNAS、家庭服务器与常见云主机。',
    meta: 'SELF-HOSTED',
  },
  {
    icon: 'desktop',
    title: '跨平台桌面端',
    desc: 'Moke 桌面客户端内嵌阅读器，支持离线下载与本地阅读。',
    meta: 'MOKE CLIENT',
  },
  {
    icon: 'palette',
    title: '主题与控制中心',
    desc: '六套主题与明暗模式即时切换；邮件、元数据、OPDS、WebDAV、数据库、SSL 与更新检查集中配置。',
    meta: '6 THEMES / 4 DOMAINS',
  },
]

const TECH_ITEMS = [
  ['CORE', 'Calibre'],
  ['DEPLOY', 'Docker'],
  ['READER', 'Candle Reader'],
  ['API', 'OPDS'],
  ['LICENSE', 'Apache-2.0'],
]

const PROJECT_STATS = [
  { id: 'github', value: 5624, suffix: '+', label: 'GitHub Stars' },
  { id: 'docker', value: 1036805, divisor: 10000, suffix: '万+', label: 'Docker 下载' },
  { id: 'opensource', value: 100, suffix: '%', label: '开源免费' },
]

function parseCompactNumber(value) {
  const match = String(value).trim().match(/^([\d.]+)\s*([kmb])?$/i)
  if (!match) return null

  const multipliers = { k: 1000, m: 1000000, b: 1000000000 }
  const multiplier = multipliers[match[2]?.toLowerCase()] || 1
  const parsed = Math.round(Number(match[1]) * multiplier)
  return Number.isFinite(parsed) ? parsed : null
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  return reduced
}

function useProjectStats() {
  const [stats, setStats] = useState(PROJECT_STATS)

  useEffect(() => {
    let active = true

    const refresh = async () => {
      const [githubResult, dockerResult] = await Promise.allSettled([
        fetch(GITHUB_STATS_API, {
          headers: { Accept: 'application/vnd.github+json' },
        }).then((response) => {
          if (!response.ok) throw new Error(`GitHub stats: ${response.status}`)
          return response.json()
        }),
        // Docker Hub's repository API has no browser CORS header. Shields mirrors
        // that pull count and exposes a browser-readable JSON response.
        fetch(DOCKER_STATS_API).then((response) => {
          if (!response.ok) throw new Error(`Docker stats: ${response.status}`)
          return response.json()
        }),
      ])

      if (!active) return

      setStats((current) => current.map((stat) => {
        if (stat.id === 'github' && githubResult.status === 'fulfilled') {
          const value = Number(githubResult.value.stargazers_count)
          return Number.isFinite(value) ? { ...stat, value } : stat
        }

        if (stat.id === 'docker' && dockerResult.status === 'fulfilled') {
          const value = parseCompactNumber(
            dockerResult.value.value || dockerResult.value.message,
          )
          return value && value > stat.value ? { ...stat, value } : stat
        }

        return stat
      }))
    }

    refresh()
    const intervalId = window.setInterval(refresh, STATS_REFRESH_MS)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  return stats
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradient" x1="3" y1="4" x2="37" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#63E6FF" />
          <stop offset=".52" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#FF4FD8" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logo-gradient)" strokeWidth="1.5" />
      <path d="M11 12.5c4.2 0 7.2 1 9 3v14c-1.8-2-4.8-3-9-3v-14Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M29 12.5c-4.2 0-7.2 1-9 3v14c1.8-2 4.8-3 9-3v-14Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="30.5" cy="9.5" r="2" fill="#63E6FF" />
    </svg>
  )
}

function Icon({ name }) {
  const paths = {
    reader: (
      <>
        <path d="M4 5.5c3.6 0 6.3.9 8 2.8v11.8c-1.7-1.9-4.4-2.8-8-2.8V5.5Z" />
        <path d="M20 5.5c-3.6 0-6.3.9-8 2.8v11.8c1.7-1.9 4.4-2.8 8-2.8V5.5Z" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.1 4.1L17 9l-3.9 1.9L12 15l-1.1-4.1L7 9l3.9-1.9L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
        <path d="m5 14 .6 1.9 1.9.6-1.9.6L5 19l-.6-1.9-1.9-.6 1.9-.6L5 14Z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.4-3.3 2.2-5 5.5-5s5.1 1.7 5.5 5" />
        <path d="M15.5 5.5a3 3 0 0 1 0 5.7M16 14c2.7.2 4.2 1.9 4.5 5" />
      </>
    ),
    send: (
      <>
        <path d="m21 3-8.2 18-2.1-7.7L3 10.2 21 3Z" />
        <path d="m10.7 13.3 4.8-4.8" />
      </>
    ),
    signal: (
      <>
        <path d="M5.6 18.4a9 9 0 0 1 12.8-12.8" />
        <path d="M8.4 15.6a5 5 0 0 1 7.2-7.2" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    server: (
      <>
        <rect x="3" y="4" width="18" height="6" rx="2" />
        <rect x="3" y="14" width="18" height="6" rx="2" />
        <path d="M7 7h.01M7 17h.01M11 7h7M11 17h7" />
      </>
    ),
    desktop: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.4a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18A3 3 0 0 0 21 11c-.5-4.5-4.1-8-9-8Z" />
        <circle cx="7.5" cy="11" r=".8" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="7" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        <circle cx="17" cy="9.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    github: (
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.5 2-5-2-7-2" />
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function CosmosBackground() {
  const canvasRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameId
    let particles = []
    const pointer = { x: 0, y: 0 }

    const createParticles = () => {
      const count = window.innerWidth < 720 ? 34 : 68
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0.5 + Math.random() * 1.25,
        speed: 0.06 + Math.random() * 0.18,
        alpha: 0.18 + Math.random() * 0.5,
        phase: index * 0.37,
      }))
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      createParticles()
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)

      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.y -= particle.speed * ratio
          particle.x += pointer.x * particle.speed * 0.08
          if (particle.y < -4) particle.y = canvas.height + 4
          if (particle.x < -4) particle.x = canvas.width + 4
          if (particle.x > canvas.width + 4) particle.x = -4
        }

        const pulse = reducedMotion ? 1 : 0.72 + Math.sin(time * 0.0008 + particle.phase) * 0.28
        context.beginPath()
        context.fillStyle = `rgba(163, 230, 255, ${particle.alpha * pulse})`
        context.arc(particle.x, particle.y, particle.radius * ratio, 0, Math.PI * 2)
        context.fill()
      })

      if (!reducedMotion) frameId = requestAnimationFrame(draw)
    }

    const onPointerMove = (event) => {
      pointer.x = event.clientX / window.innerWidth - 0.5
      pointer.y = event.clientY / window.innerHeight - 0.5
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className="cosmos-canvas" aria-hidden="true" />
}

function ScrollProgress() {
  const progressRef = useRef(null)

  useEffect(() => {
    let frame
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      progressRef.current?.style.setProperty('--progress', progress)
      frame = null
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-shell">
        <a className="brand" href="." aria-label="Talebook 首页">
          <LogoMark />
          <span className="brand-word">Tale<span>book</span></span>
          <span className="brand-version">OSS</span>
        </a>

        <nav className="desktop-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <a className="nav-github" href={GITHUB_URL} target="_blank" rel="noreferrer">
          <Icon name="github" />
          <span>GitHub</span>
        </a>

        <button className="menu-button" type="button" aria-label="切换菜单" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
        ))}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub</a>
      </div>
    </header>
  )
}

function BrowserFrame({ src, alt, className = '' }) {
  return (
    <div className={`browser-frame ${className}`}>
      <div className="browser-toolbar">
        <div className="browser-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="browser-address"><span className="status-light" /> library.local</div>
        <div className="browser-signal" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <img src={src} alt={alt} />
    </div>
  )
}

function LibraryCore() {
  return (
    <div className="library-core-wrap" data-parallax="0.045">
      <div className="core-orbit orbit-a" aria-hidden="true" />
      <div className="core-orbit orbit-b" aria-hidden="true" />
      <div className="core-aura" aria-hidden="true" />
      <div className="orbit-chip orbit-chip-a"><span /> EPUB</div>
      <div className="orbit-chip orbit-chip-b"><span /> OPDS</div>
      <div className="orbit-chip orbit-chip-c"><span /> AI META</div>
      <div className="core-label">
        <span>LIBRARY CORE</span>
        <b>ONLINE</b>
      </div>
      <BrowserFrame src="home.png" alt="Talebook 深色模式首页" className="hero-browser" />
      <div className="core-telemetry">
        <div><span>INDEX</span><b>Calibre</b></div>
        <div><span>ACCESS</span><b>Private</b></div>
        <div><span>SYNC</span><b>Ready</b></div>
      </div>
    </div>
  )
}

function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...props }) {
  return (
    <Tag className={`reveal ${className}`} data-reveal style={{ '--reveal-delay': `${delay}ms` }} {...props}>
      {children}
    </Tag>
  )
}

function SectionHeading({ eyebrow, title, body, align = 'left' }) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-centered' : ''}`}>
      <div className="eyebrow"><span />{eyebrow}</div>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  )
}

function ThemeShowcase() {
  const [theme, setTheme] = useState('night')
  const current = theme === 'night'
    ? { src: 'night.png', label: '暖红 · 深色', copy: '同一座书库，在夜间保持克制的对比度与清晰层级。' }
    : { src: 'screenshot.png', label: '暖红 · 明亮', copy: '出版社、作者、标签、格式与连载状态都能快速筛选。' }

  return (
    <div className="theme-showcase">
      <div className="theme-controls" role="group" aria-label="切换界面主题">
        <button type="button" className={theme === 'night' ? 'is-active' : ''} onClick={() => setTheme('night')}>
          <span className="theme-dot night" /> 暖红 · 深色
        </button>
        <button type="button" className={theme === 'light' ? 'is-active' : ''} onClick={() => setTheme('light')}>
          <span className="theme-dot light" /> 暖红 · 明亮
        </button>
      </div>
      <BrowserFrame key={current.src} src={current.src} alt={`Talebook ${current.label}界面`} className="product-browser" />
      <div className="showcase-caption">
        <span>UI / RESPONSIVE</span>
        <p>{current.copy}</p>
      </div>
    </div>
  )
}

function ControlShowcase({ item, index }) {
  return (
    <Reveal className="control-showcase-card" delay={index * 90}>
      <div className="control-card-signal">
        <span>{item.kicker}</span>
        <i>LIVE CAPTURE / 3000</i>
      </div>
      <BrowserFrame src={item.src} alt={`${item.title}界面截图`} className="control-browser" />
      <div className="control-card-copy">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
      <div className="control-card-tags">
        {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </Reveal>
  )
}

function GlowCard({ className = '', children }) {
  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
  }

  return <div className={`glow-card ${className}`} onPointerMove={onPointerMove}>{children}</div>
}

function MobileShot({ shot, index }) {
  return (
    <Reveal className="mobile-shot" delay={index * 70}>
      <div className="shot-meta">
        <span>{shot.kicker}</span>
        <i>{String(index + 1).padStart(2, '0')}</i>
      </div>
      <div className="phone-shell">
        <div className="phone-speaker" />
        <img src={shot.src} alt={`${shot.title}界面截图`} loading="lazy" />
      </div>
      <h3>{shot.title}</h3>
      <p>{shot.desc}</p>
    </Reveal>
  )
}

function FeatureCard({ feature, index }) {
  return (
    <Reveal className={`feature-reveal ${feature.featured ? 'is-featured' : ''}`} delay={(index % 4) * 55}>
      <GlowCard className={`feature-card ${feature.featured ? 'is-featured' : ''}`}>
        <div className="feature-topline">
          <span className="feature-icon"><Icon name={feature.icon} /></span>
          <span className="feature-meta">{feature.meta}</span>
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.desc}</p>
        {feature.featured && (
          <div className="format-stream" aria-label="支持的格式">
            {['EPUB', 'PDF', 'MOBI', 'AZW3'].map((format) => <span key={format}>{format}</span>)}
          </div>
        )}
      </GlowCard>
    </Reveal>
  )
}

function CopyCommand() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    let success = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(DOCKER_COMMAND)
        success = true
      }
    } catch {
      success = false
    }

    if (!success) {
      const textarea = document.createElement('textarea')
      textarea.value = DOCKER_COMMAND
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      success = document.execCommand('copy')
      textarea.remove()
    }

    setCopied(success)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div><i /><i /><i /></div>
        <span>talebook — deploy</span>
        <b>bash</b>
      </div>
      <div className="terminal-body">
        <span className="terminal-comment"># 启动你的私人书库</span>
        <div className="terminal-command">
          <code><em>$</em> {DOCKER_COMMAND}</code>
          <button type="button" onClick={copy} aria-label="复制 Docker 命令">
            <Icon name={copied ? 'check' : 'copy'} />
            <span>{copied ? '已复制' : '复制'}</span>
          </button>
        </div>
        <div className="terminal-output">
          <span>✓</span> service talebook started on <b>localhost:8080</b>
        </div>
      </div>
    </div>
  )
}

function CountUpStat({ value, divisor = 1, suffix, label, delay }) {
  const statRef = useRef(null)
  const valueRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)
  const targetValue = Math.floor(value / divisor)

  useEffect(() => {
    let observer

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          setIsVisible(true)
        }
      }, { threshold: 0.35 })
      observer.observe(statRef.current)
    } else {
      setIsVisible(true)
    }

    return () => observer?.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return undefined

    if (reducedMotion) {
      valueRef.current = targetValue
      setDisplayValue(targetValue)
      return undefined
    }

    let frameId
    let delayId
    const startValue = valueRef.current

    if (startValue === targetValue) return undefined

    const animate = () => {
      const startedAt = performance.now()
      const duration = 1700
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        const nextValue = Math.round(
          startValue + (targetValue - startValue) * eased,
        )
        valueRef.current = nextValue
        setDisplayValue(nextValue)
        if (progress < 1) frameId = requestAnimationFrame(tick)
      }
      frameId = requestAnimationFrame(tick)
    }

    delayId = window.setTimeout(animate, startValue === 0 ? delay : 0)

    return () => {
      cancelAnimationFrame(frameId)
      clearTimeout(delayId)
    }
  }, [delay, isVisible, reducedMotion, targetValue])

  const number = displayValue.toLocaleString('zh-CN')

  return (
    <div ref={statRef} className="impact-stat" aria-label={`${targetValue.toLocaleString('zh-CN')}${suffix} ${label}`}>
      <div className="impact-value" aria-hidden="true">
        <span>{number}</span><b>{suffix}</b>
      </div>
      <span className="impact-label">{label}</span>
    </div>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const projectStats = useProjectStats()

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('[data-reveal]')]
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return undefined
    const targets = [...document.querySelectorAll('[data-parallax]')]
    let frame
    const update = () => {
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect()
        const speed = Number(target.dataset.parallax || 0.04)
        const offset = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) * speed
        target.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`)
      })
      frame = null
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reducedMotion])

  return (
    <div className="site">
      <CosmosBackground />
      <ScrollProgress />
      <Nav />

      <main>
        <section className="hero">
          <div className="hero-grid section-shell">
            <div className="hero-copy">
              <Reveal className="status-pill">
                <span className="pulse-dot" />
                OPEN SOURCE · APACHE-2.0
              </Reveal>
              <Reveal as="h1" delay={70}>
                <span className="hero-title-line">把你的藏书，</span>
                <span className="hero-title-line">点亮成一座</span>
                <span className="hero-title-line hero-title-gradient">数字宇宙。</span>
              </Reveal>
              <Reveal as="p" className="hero-lead" delay={140}>
                Talebook 是基于 Calibre 构建的开源个人图书管理系统。
                在自己的服务器上管理、阅读、检索和分享每一本书，数据始终由你掌控。
              </Reveal>
              <Reveal className="hero-actions" delay={210}>
                <a className="button button-primary" href={DOCS_URL}>
                  开始部署 <Icon name="arrow" />
                </a>
                <a className="button button-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                  <Icon name="github" /> 查看源码
                </a>
              </Reveal>
              <Reveal className="hero-proof" delay={280}>
                <span>CALIBRE CORE</span>
                <i />
                <span>DOCKER READY</span>
                <i />
                <span>YOUR DATA</span>
              </Reveal>
            </div>

            <Reveal className="hero-visual" delay={100}>
              <LibraryCore />
            </Reveal>
          </div>
          <div className="hero-scanline" aria-hidden="true" />
        </section>

        <section className="impact-section" aria-label="项目数据">
          <div className="section-shell">
            <Reveal className="impact-panel">
              <div className="impact-kicker"><span />PROJECT SIGNALS</div>
              {projectStats.map((stat, index) => (
                <CountUpStat key={stat.id} {...stat} delay={index * 130} />
              ))}
              <div className="impact-orbit" aria-hidden="true"><i /><i /><i /></div>
            </Reveal>
          </div>
        </section>

        <section id="features" className="features-section section-pad">
          <div className="section-shell">
            <Reveal>
              <SectionHeading
                eyebrow="CAPABILITY MATRIX"
                title={<>不是一个书架，<span>是一套完整的阅读系统。</span></>}
                body="收藏、整理、阅读、同步与分享集中在一个可以完全自托管的空间里。"
              />
            </Reveal>
            <div className="features-grid">
              {FEATURES.map((feature, index) => <FeatureCard key={feature.title} feature={feature} index={index} />)}
            </div>
          </div>
        </section>

        <section id="product" className="product-section section-pad">
          <div className="section-shell">
            <Reveal>
              <SectionHeading
                eyebrow="PRODUCT INTERFACE"
                title={<>同一座书库，<span>昼夜都清楚。</span></>}
                body="新版暖红主题的真实书库界面：完整筛选、卡片书目与响应式布局，在明暗模式间即时切换。"
              />
            </Reveal>
            <Reveal className="product-stage" delay={100}>
              <ThemeShowcase />
            </Reveal>
          </div>
        </section>

        <section className="control-section section-pad">
          <div className="section-shell">
            <Reveal>
              <SectionHeading
                eyebrow="THEME LAB / CONTROL CENTER"
                title={<>主题有选择，<span>设置有秩序。</span></>}
                body="不只是换一个背景色。Talebook 把整套视觉风格与复杂系统能力，都做成了看得见、摸得着的界面。"
              />
            </Reveal>
            <div className="control-showcase-grid">
              {CONTROL_SHOWCASES.map((item, index) => (
                <ControlShowcase key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="screens-section section-pad">
          <div className="section-shell">
            <Reveal>
              <SectionHeading
                eyebrow="WORKFLOW IN YOUR POCKET"
                title={<>从书库到后台，<span>手机也能掌控。</span></>}
                body="真实手机界面覆盖书库、阅读、主题、系统设置与元数据，让管理和阅读不再依赖一块大屏幕。"
              />
            </Reveal>
            <div className="mobile-shots">
              {MOBILE_SHOTS.map((shot, index) => <MobileShot key={shot.title} shot={shot} index={index} />)}
            </div>
          </div>
        </section>

        <section id="deploy" className="deploy-section section-pad">
          <div className="section-shell deploy-grid">
            <Reveal className="deploy-copy">
              <SectionHeading
                eyebrow="DEPLOYMENT SIGNAL"
                title={<>一条命令，<span>书库上线。</span></>}
                body="无需把私人藏书交给第三方。把 Talebook 部署在 NAS、家庭服务器或云主机，随时迁移，长期拥有。"
              />
              <div className="tech-stack">
                {TECH_ITEMS.map(([label, value]) => (
                  <div key={label}><span>{label}</span><b>{value}</b></div>
                ))}
              </div>
              <a className="text-link" href={DOCS_URL}>阅读安装文档 <Icon name="arrow" /></a>
            </Reveal>
            <Reveal className="deploy-terminal" delay={120}>
              <CopyCommand />
              <div className="deploy-radar" aria-hidden="true">
                <span />
                <span />
                <span />
                <i />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="community-section section-pad">
          <div className="section-shell">
            <Reveal className="community-panel">
              <div className="community-copy">
                <div className="eyebrow"><span />OPEN SOURCE NETWORK</div>
                <h2>一群爱书的人，<br /><span>共同维护这座书库。</span></h2>
                <p>提交 Issue、改进代码、完善文档，或只是点亮一颗 Star。每一种参与都会让 Talebook 走得更远。</p>
                <div className="community-actions">
                  <a className="button button-primary" href={GITHUB_URL} target="_blank" rel="noreferrer">
                    <Icon name="github" /> 加入 GitHub 社区
                  </a>
                  <a className="text-link" href="https://demo.talebook.org" target="_blank" rel="noreferrer">
                    查看在线 Demo <Icon name="arrow" />
                  </a>
                </div>
              </div>
              <div className="community-data">
                <a className="contributors" href={`${GITHUB_URL}/graphs/contributors`} target="_blank" rel="noreferrer">
                  <span>COMMUNITY CONSTELLATION</span>
                  <img src="https://contrib.rocks/image?repo=talebook/talebook" alt="Talebook 项目贡献者" loading="lazy" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-orbit" aria-hidden="true" />
          <Reveal className="section-shell final-cta-inner">
            <div className="eyebrow"><span />YOUR LIBRARY / YOUR RULES</div>
            <h2>下一页，从自己的书库开始。</h2>
            <p>让沉睡在硬盘里的藏书，重新成为每天都能打开的知识空间。</p>
            <div className="hero-actions">
              <a className="button button-primary" href={DOCS_URL}>立即开始 <Icon name="arrow" /></a>
              <a className="button button-secondary" href="https://hub.docker.com/r/talebook/talebook" target="_blank" rel="noreferrer">Docker Hub</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="section-shell footer-grid">
          <div className="footer-brand">
            <a className="brand" href="."><LogoMark /><span className="brand-word">Tale<span>book</span></span></a>
            <p>开源、可自托管的个人图书管理系统。</p>
          </div>
          <div>
            <span className="footer-label">PRODUCT</span>
            <a href="#product">界面</a>
            <a href="#features">功能</a>
            <a href="https://demo.talebook.org">Demo</a>
          </div>
          <div>
            <span className="footer-label">BUILD</span>
            <a href={DOCS_URL}>文档</a>
            <a href="https://hub.docker.com/r/talebook/talebook">Docker</a>
            <a href="https://github.com/talebook/moke">Moke 桌面端</a>
          </div>
          <div>
            <span className="footer-label">COMMUNITY</span>
            <a href={GITHUB_URL}>GitHub</a>
            <a href={`${GITHUB_URL}/issues`}>反馈问题</a>
            <a href="https://afdian.net/@talebook">支持项目</a>
          </div>
        </div>
        <div className="section-shell footer-bottom">
          <span>© 2016–{new Date().getFullYear()} Talebook</span>
          <span>Built with Calibre · Apache-2.0</span>
        </div>
      </footer>
    </div>
  )
}
