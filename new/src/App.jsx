import { useState, useEffect, useRef } from 'react'

const WORDS = ['简洁强大的', '开箱即用的', '美观易用的', '功能丰富的', '轻松上手的', '全家共享的', '全平台覆盖的', '安全可靠的']

const NAV = [
  { label: '文档', href: 'docs/' },
  { label: 'Demo', href: 'https://demo.talebook.org' },
]

const FEATURES = [
  { title: '在线阅读', desc: '内置 candle-reader，支持 EPUB、PDF、MOBI、AZW3 等多种格式，自适应 PC 和手机端。', icon: '📖' },
  { title: '多用户系统', desc: '支持 QQ、微博、微信、GitHub 社交登录，完善的权限管理，bcrypt 加密存储。', icon: '👥' },
  { title: '智能元数据', desc: '多源并行搜索（豆瓣、百度百科、新华书店、番茄小说），支持 AI 大模型自动识别。', icon: '🤖' },
  { title: 'Kindle 推送', desc: '管理多个 Kindle 设备，一键推送书籍，后台自动批量格式转换。', icon: '📧' },
  { title: 'OPDS 支持', desc: '兼容 KyBooks 等阅读 APP，支持外部 OPDS 书库导入。', icon: '📡' },
  { title: '一键部署', desc: '一行 Docker 命令即可启动，支持群晖、UNAS 等 NAS 平台，开箱即用。', icon: '🐳' },
  { title: '桌面客户端', desc: 'Moke 跨平台桌面端，内嵌 readest 阅读器，支持离线下载阅读。', icon: '🖥️' },
  { title: '网络书库', desc: '导入 Legado 风格书源，在线搜索阅读网络小说。', icon: '🌐' },
]

function formatNum(n) {
  if (n >= 1000) return Math.round(n / 100) / 10 + 'k'
  return String(n)
}

function CommunityStats() {
  const [stars, setStars] = useState(null)
  const [pulls, setPulls] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/talebook/talebook')
      .then(r => r.json()).then(d => setStars(d.stargazers_count)).catch(() => {})
    fetch('https://hub.docker.com/v2/repositories/talebook/talebook/')
      .then(r => r.json()).then(d => setPulls(d.pull_count)).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
      <div className="bg-slate-50 rounded-2xl py-8 px-4">
        <div className="text-3xl md:text-4xl font-bold text-brand-500">{stars ? formatNum(stars) + '+' : '...'}</div>
        <div className="text-gray-500 text-sm mt-2">GitHub Stars</div>
      </div>
      <div className="bg-slate-50 rounded-2xl py-8 px-4">
        <div className="text-3xl md:text-4xl font-bold text-brand-500">{pulls ? formatNum(pulls) + '+' : '...'}</div>
        <div className="text-gray-500 text-sm mt-2">Docker Pulls</div>
      </div>
    </div>
  )
}

function CyclingTitle() {
  const [text, setText] = useState('')
  const wordIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    let id
    const tick = () => {
      if (deleting.current) {
        charIdx.current--
        setText(WORDS[wordIdx.current].slice(0, charIdx.current))
        if (charIdx.current <= 0) {
          deleting.current = false
          wordIdx.current = (wordIdx.current + 1) % WORDS.length
          id = setTimeout(tick, 200)
          return
        }
      } else {
        charIdx.current++
        setText(WORDS[wordIdx.current].slice(0, charIdx.current))
        if (charIdx.current >= WORDS[wordIdx.current].length) {
          id = setTimeout(() => { deleting.current = true; tick() }, 2000)
          return
        }
      }
      id = setTimeout(tick, deleting.current ? 60 : 120)
    }
    id = setTimeout(tick, 200)
    return () => clearTimeout(id)
  }, [])

  return (
    <span className="block w-full">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [stars, setStars] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('https://api.github.com/repos/talebook/talebook')
      .then(r => r.json()).then(d => setStars(d.stargazers_count)).catch(() => {})
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur border-b border-gray-100 text-gray-900 shadow-sm' : 'bg-transparent text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="." className="flex items-center gap-2 text-xl font-bold">
          <img src="favicon.ico" className="w-8 h-8" alt="" />
          <span>Talebook</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
            }`}>
              {item.label}
              <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          ))}
          <a href="https://github.com/talebook/talebook" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-gray-700 hover:scale-105 transition-all ml-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            GitHub {stars && <span className="text-sm">{formatNum(stars)}</span>}
          </a>
        </div>

        <button className={`md:hidden p-2 rounded-lg transition-colors ${
          scrolled ? 'hover:bg-gray-100' : 'hover:bg-gray-100/50'
        }`} onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t px-6 py-4 space-y-2 ${scrolled ? 'border-gray-100 bg-white' : 'border-gray-200 bg-white/60'}`}>
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a href="https://github.com/talebook/talebook" target="_blank" rel="noopener noreferrer"
            className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}>GitHub</a>
        </div>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-brand-200 blur-[80px] opacity-30 mix-blend-multiply" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-200 blur-[80px] opacity-30 mix-blend-multiply" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-600 font-semibold text-sm mb-8 border border-brand-200">
            Open Source Book Management System
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            <div className="h-[1.2em] relative mb-1">
              <CyclingTitle />
            </div>
            <span className="text-brand-600">个人图书管理系统</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Talebook 是一个基于 Calibre 构建的开源个人图书管理系统。
            支持在线阅读、多用户管理、Kindle 推送和 AI 智能元数据识别，
            一行 Docker 命令即可在你的 NAS 或服务器上运行。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="docs/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 hover:scale-105 transition-all">
              立即开始
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="https://github.com/talebook/talebook" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-gray-700 font-semibold hover:scale-105 transition-all shadow-sm border border-gray-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              查看 GitHub
            </a>
          </div>

          <div className="mt-16">
            <img src="screenshot.png" alt="Talebook 界面预览"
              className="rounded-xl shadow-2xl border border-gray-200 mx-auto" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-600 font-semibold text-sm mb-6">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">强大的功能特性</h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl">
            Talebook 提供全方位的图书管理能力，满足从个人收藏到家庭共享的多样化需求。
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">加入开源社区</h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Talebook 由全球开发者共同维护，欢迎提交 Issue 或 PR，一起把项目做得更好。
          </p>
          <a href="https://github.com/talebook/talebook/graphs/contributors" target="_blank" rel="noopener noreferrer">
            <img src="https://contrib.rocks/image?repo=talebook/talebook" alt="贡献者" className="mx-auto" />
          </a>
          <div className="mt-12">
            <CommunityStats />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-white">
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-brand-100 blur-[100px] opacity-60 mix-blend-multiply" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-200 blur-[120px] opacity-50 mix-blend-multiply" />
          <div className="absolute top-[30%] left-[30%] hidden md:block w-[50vw] h-[50vw] rounded-full bg-brand-50 blur-[90px] opacity-60 mix-blend-multiply" />
          <div className="absolute top-[10%] right-[10%] hidden lg:block w-[40vw] h-[40vw] rounded-full bg-brand-200 blur-[110px] opacity-40 mix-blend-multiply" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full min-h-[50vh] flex flex-col justify-center items-center">
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-16 tracking-tight leading-tight">
            即刻部署你的<br /><span className="text-brand-500">私人图书馆</span>
          </h2>
          <a href="docs/"
            className="group relative inline-flex items-center gap-3 bg-brand-500 text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-brand-600 hover:scale-105 transition-all shadow-xl shadow-brand-500/20 overflow-hidden">
            <span className="relative z-10">立即开始</span>
            <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-[#1e293b] py-20 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-3">资源</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="docs/" className="block hover:text-gray-900">文档</a>
              <a href="https://demo.talebook.org" className="block hover:text-gray-900">Demo</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">社区</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="https://github.com/talebook/talebook" className="block hover:text-gray-900">GitHub</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">支持</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="https://github.com/talebook/talebook/issues" className="block hover:text-gray-900">反馈问题</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">友情链接</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <a href="https://calibre-ebook.com/" className="block hover:text-gray-900">Calibre</a>
              <a href="https://github.com/talebook/moke" className="block hover:text-gray-900">Moke 桌面端</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Talebook. Built with Calibre + Vue. Apache-2.0 License.
        </div>
      </footer>
    </div>
  )
}
