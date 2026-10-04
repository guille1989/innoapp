import { useEffect, useState } from 'react'

const WHATSAPP_PHONE = '34627981146'

const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`

const CONTACT_URL = buildWhatsAppUrl(
  'Hola, quiero más información sobre InnoApp y solicitar una demo.',
)

const navLinks = [
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Datos', href: '#datos' },
  { label: 'Casos de uso', href: '#casos-de-uso' },
  { label: 'Precios', href: '#precios' },
]

// ── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Ir al inicio">
          <div className="w-7 h-7 rounded-lg bg-[#0a84ff] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="7" cy="7" r="2.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <span className="font-display font-700 text-[17px] tracking-tight text-white">InnoApp</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-[#86868b] hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[14px] font-medium text-[#86868b] hover:text-white transition-colors px-3 py-1.5"
          >
            Hablar con ventas
          </a>
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[14px] font-semibold bg-[#0a84ff] hover:bg-[#0070d8] text-white px-4 py-2 rounded-full transition-colors duration-200"
          >
            Empieza gratis
          </a>
        </div>

        <button
          type="button"
          className="md:hidden text-[#86868b] hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`h-0.5 bg-current rounded transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}/>
            <span className={`h-0.5 bg-current rounded transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
            <span className={`h-0.5 bg-current rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}/>
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.06] px-6 pb-6 pt-4 flex flex-col gap-4">
          {navLinks.map(item => (
            <a key={item.label} href={item.href} className="text-white font-medium text-[16px]" onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="mt-2 bg-[#0a84ff] text-white font-semibold py-3 rounded-xl text-center" onClick={() => setMenuOpen(false)}>
            Empieza gratis
          </a>
        </div>
      )}
    </header>
  )
}

// ── Ticker ─────────────────────────────────────────────────────────────────
const tickerItems = [
  '2.4M datos procesados/día',
  'Decisiones 3× más rápidas',
  '+180 integraciones nativas',
  'ROI promedio: 340%',
  'Uptime 99.99%',
  'ISO 27001 certificado',
  '$1.2B en oportunidades identificadas',
  'Análisis en tiempo real',
]

function Ticker() {
  const items = [...tickerItems, ...tickerItems]
  return (
    <div className="overflow-hidden border-y border-white/[0.06] py-3.5 bg-[#0d0d0f]">
      <div className="ticker-track flex gap-12 w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-[13px] font-mono-data text-[#86868b]">
            <span className="w-1 h-1 rounded-full bg-[#0a84ff] inline-block" style={{animation:'pulse-dot 2s ease infinite', animationDelay:`${i*0.2}s`}}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="inicio" className="relative pt-32 pb-24 px-6 overflow-hidden hero-gradient">
      <div className="noise-overlay absolute inset-0"/>

      {/* Grid lines subtle */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize:'80px 80px'}}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 border border-[#0a84ff]/30 bg-[#0a84ff]/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" style={{animation:'pulse-dot 1.5s ease infinite'}}/>
          <span className="font-mono-data text-[12px] text-[#0a84ff] font-medium tracking-wide uppercase">
            Plataforma de Innovación Basada en Datos
          </span>
        </div>

        <h1 className="animate-fade-up animate-fade-up-delay-1 font-display font-900 text-[clamp(44px,8vw,96px)] leading-[0.96] tracking-[-0.04em] text-white mb-8">
          Los datos<br/>
          <span className="shimmer-text">son tu ventaja</span><br/>
          competitiva.
        </h1>

        <p className="animate-fade-up animate-fade-up-delay-2 text-[clamp(16px,2vw,20px)] text-[#86868b] leading-relaxed max-w-2xl mx-auto mb-12 font-light">
          InnoApp convierte la complejidad de tus datos en decisiones estratégicas.
          Simple. Eficiente. Transformador.
        </p>

        <div className="animate-fade-up animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 bg-[#0a84ff] hover:bg-[#0070d8] text-white font-semibold text-[15px] px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            Empieza gratis
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#demo"
            className="flex items-center gap-2 text-white/70 hover:text-white font-medium text-[15px] px-6 py-4 rounded-full border border-white/[0.1] hover:border-white/20 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" fillOpacity="0"/>
              <path d="M6.5 5.5l4 2.5-4 2.5V5.5z"/>
            </svg>
            Ver demo en vivo
          </a>
        </div>

        <p className="animate-fade-up animate-fade-up-delay-4 mt-6 text-[13px] text-[#86868b]">
          Sin tarjeta de crédito · 14 días gratis · Cancela cuando quieras
        </p>
      </div>

      {/* Dashboard preview */}
      <div className="animate-fade-up animate-fade-up-delay-4 relative max-w-5xl mx-auto mt-20" id="demo">
        <div className="glow-border rounded-2xl overflow-hidden bg-[#0d0d0f]">
          <DashboardPreview />
        </div>
        {/* Glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-[#0a84ff]/20 blur-3xl"/>
      </div>
    </section>
  )
}

// ── Dashboard Preview (inline visual) ─────────────────────────────────────
function DashboardPreview() {
  const [active, setActive] = useState(0)
  const bars = [42, 68, 55, 80, 63, 91, 74, 88, 57, 76, 95, 83]

  return (
    <div className="bg-[#0d0d0f] p-0">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#111114]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
        <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
        <div className="flex-1 mx-4 h-5 rounded-md bg-white/[0.04] flex items-center justify-center">
          <span className="font-mono-data text-[10px] text-[#86868b]">app.innoapp.com/dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-12 min-h-[420px]">
        {/* Sidebar */}
        <div className="col-span-2 border-r border-white/[0.06] p-3 hidden md:block">
          <div className="space-y-1">
            {['Resumen','Análisis','Datos','IA Insights','Reportes','Alertas'].map((item, i) => (
              <button
                type="button"
                key={item}
                onClick={() => setActive(i)}
                className={`w-full text-left text-[11px] px-2.5 py-2 rounded-lg font-medium transition-colors ${
                  active === i ? 'bg-[#0a84ff]/20 text-[#0a84ff]' : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
                }`}
                aria-pressed={active === i}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-12 md:col-span-10 p-4 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Ingresos', value: '$2.4M', delta: '+18.2%', up: true },
              { label: 'Usuarios activos', value: '84,231', delta: '+6.7%', up: true },
              { label: 'Conversión', value: '3.84%', delta: '-0.3%', up: false },
              { label: 'LTV promedio', value: '$1,240', delta: '+22.1%', up: true },
            ].map(kpi => (
              <div key={kpi.label} className="data-card rounded-xl p-3">
                <div className="font-mono-data text-[10px] text-[#86868b] mb-1 uppercase tracking-wider">{kpi.label}</div>
                <div className="font-display font-700 text-[20px] text-white leading-none mb-1">{kpi.value}</div>
                <div className={`font-mono-data text-[11px] ${kpi.up ? 'text-[#30d158]' : 'text-[#ff375f]'}`}>
                  {kpi.delta} vs mes anterior
                </div>
              </div>
            ))}
          </div>

          {/* Chart + AI insight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="col-span-1 sm:col-span-2 data-card rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-mono-data text-[10px] text-[#86868b] uppercase tracking-wider">Ingresos 2024</div>
                  <div className="font-display font-600 text-[14px] text-white">Tendencia mensual</div>
                </div>
                <span className="font-mono-data text-[10px] bg-[#30d158]/10 text-[#30d158] px-2 py-0.5 rounded">+18.2%</span>
              </div>
              <div className="flex items-end gap-1 h-24">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-0.5">
                    <div
                      className="w-full rounded-sm chart-bar"
                      style={{
                        height: `${h}%`,
                        background: i === 11
                          ? 'linear-gradient(to top, #0a84ff, #5ac8fa)'
                          : 'rgba(255,255,255,0.07)'
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['E','F','M','A','M','J','J','A','S','O','N','D'].map((m, monthIndex) => (
                  <span key={`${m}-${monthIndex}`} className="flex-1 text-center font-mono-data text-[8px] text-[#86868b]">{m}</span>
                ))}
              </div>
            </div>

            <div className="col-span-1 data-card rounded-xl p-3 flex flex-col gap-2">
              <div className="font-mono-data text-[10px] text-[#86868b] uppercase tracking-wider">IA Insight</div>
              <div className="flex-1 flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0a84ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v3l2 1-2 1v3" stroke="#0a84ff" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-mono-data text-[10px] text-[#86868b] leading-relaxed line-clamp-3">
                  Diciembre supera proyección en 12%. Segmento Enterprise crece 34% QoQ. Acción recomendada: escalar canal directo.
                </p>
              </div>
              <div className="h-px bg-white/[0.05]"/>
              <div className="font-mono-data text-[10px] text-[#0a84ff] cursor-pointer hover:underline">
                Ver análisis completo →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stats strip ────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '3×', label: 'más rápido en tomar decisiones' },
    { value: '340%', label: 'ROI promedio en 12 meses' },
    { value: '2.4M', label: 'datos procesados cada día' },
    { value: '180+', label: 'integraciones nativas' },
  ]
  return (
    <section id="datos" className="scroll-mt-16 border-y border-white/[0.06] bg-[#0d0d0f] py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/[0.06]">
        {stats.map(s => (
          <div key={s.label} className="text-center md:px-8">
            <div className="font-display font-800 text-[clamp(40px,6vw,64px)] leading-none text-white tracking-tight mb-2">
              {s.value}
            </div>
            <div className="text-[14px] text-[#86868b] leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features ───────────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="2" fill="#0a84ff" fillOpacity="0.2" stroke="#0a84ff" strokeWidth="1.2"/>
        <rect x="12" y="2" width="8" height="8" rx="2" fill="#0a84ff" fillOpacity="0.1" stroke="#0a84ff" strokeWidth="1.2"/>
        <rect x="2" y="12" width="8" height="8" rx="2" fill="#0a84ff" fillOpacity="0.1" stroke="#0a84ff" strokeWidth="1.2"/>
        <rect x="12" y="12" width="8" height="8" rx="2" fill="#0a84ff" fillOpacity="0.05" stroke="#0a84ff" strokeWidth="1.2"/>
      </svg>
    ),
    tag: 'Unificación',
    title: 'Todos tus datos, una sola verdad',
    body: 'Conecta CRM, ERP, redes sociales, analytics y más de 180 fuentes. InnoApp unifica todo en un repositorio semántico que habla el idioma de tu negocio.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 15 L7 9 L11 12 L15 5 L19 8" stroke="#30d158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="19" cy="8" r="2" fill="#30d158"/>
      </svg>
    ),
    tag: 'IA Predictiva',
    title: 'Anticipa el futuro antes que la competencia',
    body: 'Modelos de machine learning entrenados con tus propios datos predicen churn, oportunidades de upsell y disrupciones operativas con semanas de anticipación.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v2M11 17v2M3 11h2M17 11h2" stroke="#ff9f0a" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="4" stroke="#ff9f0a" strokeWidth="1.2"/>
        <circle cx="11" cy="11" r="1.5" fill="#ff9f0a"/>
      </svg>
    ),
    tag: 'Tiempo real',
    title: 'Decisiones al ritmo de tu negocio',
    body: 'Alertas inteligentes y dashboards que se actualizan en milisegundos. No más reportes del lunes para decisiones del viernes.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="6" width="16" height="11" rx="2" stroke="#bf5af2" strokeWidth="1.2"/>
        <path d="M7 6V5a4 4 0 0 1 8 0v1" stroke="#bf5af2" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="11" cy="11.5" r="1.5" fill="#bf5af2"/>
      </svg>
    ),
    tag: 'Seguridad',
    title: 'Datos soberanos, arquitectura confiable',
    body: 'ISO 27001, SOC 2 Type II, GDPR. Cifrado end-to-end, control granular de accesos y auditoría completa. Tus datos no van a ninguna parte que no apruebes.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 11h14M4 7h10M4 15h7" stroke="#5ac8fa" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'No-code',
    title: 'Innovación sin barreras técnicas',
    body: 'Construye pipelines de datos, define métricas personalizadas y diseña dashboards sin escribir una sola línea de código. El poder de datos para todos en tu equipo.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3 L20 8 V14 L11 19 L2 14 V8 Z" stroke="#ff375f" strokeWidth="1.2"/>
        <path d="M11 3 V19M2 8 L11 13 L20 8" stroke="#ff375f" strokeWidth="1.2" strokeOpacity="0.4"/>
      </svg>
    ),
    tag: 'Colaboración',
    title: 'Toda la organización alineada al dato',
    body: 'Workspace compartido donde CEO, Data team y Marketing hablan el mismo idioma. Anotaciones, versiones, y flujos de aprobación integrados.',
  },
]

function Features() {
  return (
    <section id="plataforma" className="scroll-mt-16 py-28 px-6 section-gradient-left">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono-data text-[12px] text-[#0a84ff] uppercase tracking-[0.15em] mb-4">Plataforma</div>
          <h2 className="font-display font-800 text-[clamp(32px,5vw,56px)] leading-[1.0] tracking-tight text-white mb-5">
            Diseñado para quienes<br/>toman decisiones que importan.
          </h2>
          <p className="text-[17px] text-[#86868b] leading-relaxed">
            Cada funcionalidad existe porque resuelve un problema real de negocio. Sin ruido. Sin complejidad innecesaria.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {features.map(f => (
            <div key={f.tag} className="data-card p-7 flex flex-col gap-4 group cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.07] transition-colors">
                  {f.icon}
                </div>
                <span className="font-mono-data text-[11px] text-[#86868b] uppercase tracking-wider">{f.tag}</span>
              </div>
              <h3 className="font-display font-700 text-[18px] text-white leading-snug">{f.title}</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed flex-1">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Conecta tus fuentes',
      body: 'Un clic para integrar tus herramientas existentes. Sin migraciones complejas ni proyectos de meses.',
    },
    {
      num: '02',
      title: 'InnoApp unifica y enriquece',
      body: 'Nuestra IA limpia, normaliza y cruza tus datos automáticamente. El modelo de datos se adapta a tu negocio.',
    },
    {
      num: '03',
      title: 'Descubre y actúa',
      body: 'Dashboards, alertas y recomendaciones listas desde el día uno. Tu equipo toma mejores decisiones desde la primera semana.',
    },
  ]
  return (
    <section id="como-funciona" className="scroll-mt-16 py-28 px-6 bg-[#0d0d0f] section-gradient-right">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono-data text-[12px] text-[#0a84ff] uppercase tracking-[0.15em] mb-4">Cómo funciona</div>
          <h2 className="font-display font-800 text-[clamp(32px,5vw,52px)] leading-tight tracking-tight text-white">
            De datos en silos a<br/>ventaja competitiva.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"/>

          {steps.map(s => (
            <div key={s.num} className="text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full glow-border flex items-center justify-center bg-[#0d0d0f]">
                <span className="font-mono-data font-600 text-[22px] text-[#0a84ff]">{s.num}</span>
              </div>
              <h3 className="font-display font-700 text-[20px] text-white">{s.title}</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed max-w-xs">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ───────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: 'InnoApp nos permitió identificar $4M en ingresos ocultos que no veíamos. En 6 semanas.',
    name: 'Ana García',
    role: 'CEO, Retail Group MX',
    avatar: 'AG',
    color: '#0a84ff',
  },
  {
    quote: 'Por fin nuestros datos de marketing, ventas y operaciones hablan el mismo idioma. Transformador.',
    name: 'Carlos Reyes',
    role: 'CDO, FinTech Latam',
    avatar: 'CR',
    color: '#30d158',
  },
  {
    quote: 'Redujimos el churn en un 31% en tres meses usando los modelos predictivos de InnoApp.',
    name: 'María Torres',
    role: 'VP Product, EdTech Scale-up',
    avatar: 'MT',
    color: '#bf5af2',
  },
]

function Testimonials() {
  return (
    <section id="casos-de-uso" className="scroll-mt-16 py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono-data text-[12px] text-[#0a84ff] uppercase tracking-[0.15em] mb-4">Casos reales</div>
          <h2 className="font-display font-800 text-[clamp(32px,5vw,52px)] leading-tight tracking-tight text-white">
            Resultados que hablan<br/>por sí solos.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="data-card rounded-2xl p-7 flex flex-col gap-5">
              <div className="text-[20px] leading-none text-[#86868b]">"</div>
              <p className="font-display font-500 text-[17px] text-white leading-snug flex-1">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-mono-data font-600 text-[12px] text-white"
                  style={{ background: `${t.color}33`, border: `1px solid ${t.color}55` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-display font-600 text-[14px] text-white">{t.name}</div>
                  <div className="font-mono-data text-[11px] text-[#86868b]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Integrations ───────────────────────────────────────────────────────────
const integrations = [
  'Salesforce','HubSpot','Stripe','Google Analytics','BigQuery','Snowflake',
  'PostgreSQL','Shopify','Slack','Notion','Zendesk','SAP',
]

function Integrations() {
  return (
    <section id="integraciones" className="scroll-mt-16 py-20 px-6 bg-[#0d0d0f] border-y border-white/[0.06]">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-mono-data text-[12px] text-[#86868b] uppercase tracking-widest mb-10">
          Conectado con las herramientas que ya usas
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map(name => (
            <div
              key={name}
              className="data-card rounded-full px-5 py-2.5 text-[13px] font-medium text-[#86868b] hover:text-white transition-colors cursor-default"
            >
              {name}
            </div>
          ))}
          <div className="data-card rounded-full px-5 py-2.5 text-[13px] font-medium text-[#0a84ff]">
            +168 más →
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(true)
  const plans = [
    {
      name: 'Starter',
      price: annual ? '$149' : '$189',
      period: annual ? '/mes · facturado anual' : '/mes',
      desc: 'Para equipos que empiezan su journey data-driven.',
      features: ['5 fuentes de datos','Hasta 500K eventos/mes','3 usuarios','Dashboards ilimitados','Soporte por email'],
      cta: 'Empieza gratis',
      highlight: false,
    },
    {
      name: 'Growth',
      price: annual ? '$399' : '$499',
      period: annual ? '/mes · facturado anual' : '/mes',
      desc: 'Para empresas que quieren ventaja competitiva real.',
      features: ['30 fuentes de datos','Hasta 10M eventos/mes','Usuarios ilimitados','IA predictiva incluida','Alertas en tiempo real','SLA 99.9%','Soporte prioritario'],
      cta: 'Empieza prueba gratuita',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Infraestructura dedicada y acompañamiento estratégico.',
      features: ['Fuentes ilimitadas','Volumen ilimitado','SSO + SAML','Contrato privado de datos','Data Scientist dedicado','SLA 99.99%','Onboarding ejecutivo'],
      cta: 'Hablar con ventas',
      highlight: false,
    },
  ]

  return (
    <section id="precios" className="scroll-mt-16 py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="font-mono-data text-[12px] text-[#0a84ff] uppercase tracking-[0.15em] mb-4">Precios</div>
          <h2 className="font-display font-800 text-[clamp(32px,5vw,52px)] leading-tight tracking-tight text-white mb-6">
            Transparente. Predecible.<br/>Sin sorpresas.
          </h2>
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all ${!annual ? 'bg-white text-black' : 'text-[#86868b]'}`}
              aria-pressed={!annual}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all ${annual ? 'bg-white text-black' : 'text-[#86868b]'}`}
              aria-pressed={annual}
            >
              Anual <span className="text-[#30d158]">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl p-7 flex flex-col gap-6 relative overflow-hidden ${
                p.highlight
                  ? 'bg-[#0a84ff] border border-[#0a84ff]'
                  : 'data-card'
              }`}
            >
              {p.highlight && (
                <div className="absolute top-0 inset-x-0 h-px bg-white/30"/>
              )}
              <div>
                <div className={`font-mono-data text-[12px] uppercase tracking-wider mb-2 ${p.highlight ? 'text-white/60' : 'text-[#86868b]'}`}>
                  {p.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-display font-800 text-[40px] leading-none ${p.highlight ? 'text-white' : 'text-white'}`}>
                    {p.price}
                  </span>
                </div>
                {p.period && (
                  <div className={`font-mono-data text-[11px] mt-1 ${p.highlight ? 'text-white/60' : 'text-[#86868b]'}`}>
                    {p.period}
                  </div>
                )}
                <p className={`text-[13px] mt-3 leading-relaxed ${p.highlight ? 'text-white/80' : 'text-[#86868b]'}`}>
                  {p.desc}
                </p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill={p.highlight ? 'rgba(255,255,255,0.2)' : 'rgba(10,132,255,0.15)'}/>
                      <path d="M5 8l2 2 4-4" stroke={p.highlight ? 'white' : '#0a84ff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`text-[13px] leading-snug ${p.highlight ? 'text-white' : 'text-[#86868b]'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={buildWhatsAppUrl(`Hola, quiero más información sobre el plan ${p.name} de InnoApp.`)}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3 rounded-full font-semibold text-[14px] transition-all ${
                  p.highlight
                    ? 'bg-white text-[#0a84ff] hover:bg-white/90'
                    : 'border border-white/15 text-white hover:border-[#0a84ff]/50 hover:bg-[#0a84ff]/10'
                } text-center`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Final ──────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="cta" className="scroll-mt-16 py-28 px-6 bg-[#0d0d0f] border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient"/>
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="font-mono-data text-[12px] text-[#0a84ff] uppercase tracking-[0.15em] mb-6">Empieza hoy</div>
        <h2 className="font-display font-900 text-[clamp(40px,6vw,72px)] leading-[0.96] tracking-tight text-white mb-6">
          Tu competencia ya<br/>
          <span className="shimmer-text">usa sus datos.</span>
        </h2>
        <p className="text-[18px] text-[#86868b] leading-relaxed mb-10 max-w-xl mx-auto">
          14 días gratis. Sin límites. Sin tarjeta de crédito. Solo resultados.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 bg-[#0a84ff] hover:bg-[#0070d8] text-white font-semibold text-[16px] px-10 py-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            Empieza gratis ahora
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="text-[#86868b] hover:text-white text-[15px] font-medium transition-colors">
            Hablar con un experto →
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: 'Producto',
      links: [
        { label: 'Plataforma', href: '#plataforma' },
        { label: 'Integraciones', href: '#integraciones' },
        { label: 'Seguridad', href: '#plataforma' },
        { label: 'Precios', href: '#precios' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Casos de uso', href: '#casos-de-uso' },
        { label: 'Cómo funciona', href: '#como-funciona' },
        { label: 'Contacto', href: '#cta' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Demo', href: '#demo' },
        { label: 'Datos', href: '#datos' },
        { label: 'Dashboard', href: '#demo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacidad', href: '#cta' },
        { label: 'Términos', href: '#cta' },
        { label: 'Cookies', href: '#cta' },
      ],
    },
  ]
  return (
    <footer className="bg-black border-t border-white/[0.06] px-6 pt-16 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#0a84ff] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="7" cy="7" r="2.5" fill="white" fillOpacity="0.3"/>
                </svg>
              </div>
              <span className="font-display font-700 text-[17px] text-white">InnoApp</span>
            </div>
            <p className="text-[13px] text-[#86868b] leading-relaxed mb-5">
              Simple. Eficiente. Transformador. Los datos son el negocio.
            </p>
            <div className="flex gap-3">
              {['Twitter','LinkedIn','GitHub'].map(s => (
                <span key={s} title={s} className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-[#86868b] text-[11px] font-mono-data">
                  {s[0]}
                </span>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div className="font-mono-data text-[11px] text-[#86868b] uppercase tracking-widest mb-4">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[13px] text-[#86868b] hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono-data text-[12px] text-[#86868b]">
            © {new Date().getFullYear()} InnoApp. Todos los derechos reservados.
          </p>
          <p className="font-mono-data text-[12px] text-[#86868b]">
            Hecho con datos. Potenciado por innovación.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="bg-black font-display">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <Features />
        <HowItWorks />
        <Integrations />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
