import { useEffect, useId, useReducer, useRef, useState, type ReactNode } from 'react'

// ── Datos de demostración (ficticios y deterministas) ──────────────────────
type StepId = 'captura' | 'analisis' | 'asistente'

const steps: { id: StepId; label: string; short: string; duration: number }[] = [
  { id: 'captura', label: 'Captura automática', short: 'Captura', duration: 4500 },
  { id: 'analisis', label: 'Dashboard', short: 'Dashboard', duration: 4500 },
  { id: 'asistente', label: 'Asistente IA', short: 'Asistente IA', duration: 5500 },
]

const TICK_MS = 100
const RESUME_AFTER_MS = 8000

// Momentos clave de cada paso, en ms desde que empieza
const timeline = {
  ticketIn: 300,
  ticketCloud: 900,
  ticketCaptured: 1900,
  metricsUpdate: 200,
  metricsMessage: 800,
  questionStart: 300,
  questionSent: 1700,
  answerStart: 2600,
  highlight: 3200,
}

const NBSP = String.fromCharCode(160)

const QUESTION = '¿Cuál es la sucursal que más vende?'
const ANSWER = `Gran Vía lidera las ventas de hoy con 3.240${NBSP}€, un 18${NBSP}% más que ayer.`

const totals = {
  before: { sales: 8420, tickets: 327 },
  after: { sales: 8458, tickets: 328 },
}

const newTicket = { id: '0328', branch: 'Gran Vía', terminal: 'TPV 2', items: 3, amount: 38, time: 'ahora' }

const recentTickets = [
  { id: '0327', branch: 'Malasaña', terminal: 'TPV 1', items: 2, amount: 18.9, time: 'hace 1 min' },
  { id: '0326', branch: 'Chamberí', terminal: 'TPV 1', items: 5, amount: 42.1, time: 'hace 2 min' },
  { id: '0325', branch: 'Gran Vía', terminal: 'TPV 3', items: 2, amount: 27.4, time: 'hace 4 min' },
  { id: '0324', branch: 'Malasaña', terminal: 'TPV 2', items: 3, amount: 31.2, time: 'hace 5 min' },
]

type BranchStatus = 'online' | 'sending' | 'slow'

const branches: { name: string; before: number; after: number; yesterday: number; status: BranchStatus }[] = [
  { name: 'Gran Vía', before: 3202, after: 3240, yesterday: 2746, status: 'online' },
  { name: 'Malasaña', before: 2946, after: 2946, yesterday: 2703, status: 'online' },
  { name: 'Chamberí', before: 2272, after: 2272, yesterday: 2367, status: 'slow' },
]

// Ventas acumuladas del día; el último punto es el total en directo
const hours = ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h']
const todayUntilNow = [310, 980, 1890, 3020, 4560, 5710, 7180]
const yesterdayCumulative = [290, 900, 1750, 2820, 4210, 5280, 6630, 7816]
const CHART_MAX = 9000

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const formatEuro = (value: number, decimals = 0) => {
  const [int, dec] = value.toFixed(decimals).split('.')
  return `${groupThousands(int)}${dec ? `,${dec}` : ''}${NBSP}€`
}

const formatPercent = (value: number, decimals = 1) =>
  `${value > 0 ? '+' : ''}${value.toFixed(decimals).replace('.', ',')}${NBSP}%`

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Reloj de la demo ───────────────────────────────────────────────────────
type DemoState = { step: number; elapsed: number; run: number }
type DemoAction = { type: 'tick'; advance: boolean } | { type: 'select'; step: number }

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  if (action.type === 'select') {
    return { step: action.step, elapsed: 0, run: state.run + 1 }
  }
  const elapsed = state.elapsed + TICK_MS
  if (action.advance && elapsed >= steps[state.step].duration) {
    return { step: (state.step + 1) % steps.length, elapsed: 0, run: state.run + 1 }
  }
  return { ...state, elapsed }
}

// ── Hooks ──────────────────────────────────────────────────────────────────
function useViewport<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setHasEntered(true)
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView, hasEntered }
}

function useElementSize<T extends Element>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, ...size }
}

// Sube con suavidad hacia el nuevo valor; al bajar (reinicio del bucle) salta directamente
function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    const from = valueRef.current
    if (from === target) return
    let frame = 0

    if (target < from || prefersReducedMotion()) {
      frame = requestAnimationFrame(() => {
        valueRef.current = target
        setValue(target)
      })
      return () => cancelAnimationFrame(frame)
    }

    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const next = from + (target - from) * (1 - Math.pow(1 - progress, 3))
      valueRef.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

// Se activa un instante después para que la transición CSS arranque desde el estado inicial
function useGrow(active: boolean) {
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setGrown(true), 60)
    return () => window.clearTimeout(timer)
  }, [active])

  return grown
}

// ── Iconos ─────────────────────────────────────────────────────────────────
function Icon({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

const receiptIcon = <><path d="M4 1.5h8v13l-2-1.2-2 1.2-2-1.2-2 1.2z"/><path d="M6 5.5h4M6 8.5h4"/></>
const cloudIcon = <path d="M4.6 12.5h6.9a3 3 0 0 0 .3-6A4 4 0 0 0 4.2 7.4a2.6 2.6 0 0 0 .4 5.1z"/>
const chartIcon = <path d="M2.5 13.5h11M4.5 11V8M8 11V4.5M11.5 11V6.5"/>
const checkIcon = <path d="M3.5 8.5l3 3 6-7"/>
const sendIcon = <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/>
const lockIcon = <><rect x="3.5" y="7" width="9" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></>
const sparkIcon = <path d="M8 1.5l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" fill="currentColor" stroke="none"/>

function Spinner({ className = 'w-3 h-3' }: { className?: string }) {
  return <span className={`${className} inline-block rounded-full border-[1.5px] border-brand-primary/25 border-t-brand-primary animate-spin`} aria-hidden="true"/>
}

// ── Piezas comunes ─────────────────────────────────────────────────────────
function Panel({ focused, className = '', children }: { focused: boolean; className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border transition-[opacity,border-color,box-shadow] duration-500 ${
        focused
          ? 'border-brand-primary/30 bg-white/[0.035] shadow-[0_0_0_3px_rgba(140,244,238,0.05),0_18px_40px_-20px_rgba(140,244,238,0.4)]'
          : 'border-white/[0.07] bg-white/[0.025] md:opacity-[0.62]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

function PanelTitle({ children }: { children: ReactNode }) {
  return <div className="font-display font-600 text-[12px] md:text-[13px] text-white">{children}</div>
}

function Typewriter({ text, speed, instant, rich }: { text: string; speed: number; instant: boolean; rich?: ReactNode }) {
  const [count, setCount] = useState(() => (instant ? text.length : 0))

  useEffect(() => {
    if (count >= text.length) return
    const timer = window.setTimeout(() => setCount(c => c + 1), speed)
    return () => window.clearTimeout(timer)
  }, [count, text.length, speed])

  if (count >= text.length && rich) return <>{rich}</>
  return <>{text.slice(0, count)}</>
}

// ── Regiones del panel ─────────────────────────────────────────────────────
function WindowChrome() {
  return (
    <div className="shrink-0 h-10 flex items-center gap-3 px-3 md:px-4 border-b border-white/[0.06] bg-white/[0.02]">
      <div className="flex gap-1.5 shrink-0" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]"/>
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]"/>
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]"/>
      </div>
      <div className="flex-1 min-w-0 flex justify-center">
        <div className="flex items-center justify-center gap-1.5 w-full max-w-[240px] h-6 rounded-md bg-white/[0.04] px-2.5 text-[#86868b]">
          <Icon className="w-3 h-3 shrink-0">{lockIcon}</Icon>
          <span className="font-mono-data text-[10px] truncate">app.innoapp.com/panel</span>
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-brand-primary/25 bg-brand-primary/[0.07] px-2 py-0.5 font-mono-data text-[9px] md:text-[10px] text-brand-light">
        <span className="w-1 h-1 rounded-full bg-brand-primary"/>
        Demo interactiva
      </span>
    </div>
  )
}

function AppHeader() {
  return (
    <div className="shrink-0 flex items-center justify-between gap-3 px-3 md:px-4 pt-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <img src="/images/innoapp-logo-header.svg" alt="" className="h-4 w-auto shrink-0"/>
        <span className="h-3.5 w-px bg-white/10 shrink-0"/>
        <span className="text-[12px] text-white/80 font-medium truncate">Panel de ventas</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline font-mono-data text-[10px] text-[#86868b]">Hoy · datos ficticios</span>
        <span className="inline-flex items-center gap-1.5 font-mono-data text-[10px] text-[#30d158]">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[#30d158] animate-ping opacity-60"/>
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#30d158]"/>
          </span>
          En directo
        </span>
      </div>
    </div>
  )
}

function MetricsPanel({ sales, tickets, focused, flash, className }: {
  sales: number
  tickets: number
  focused: boolean
  flash: boolean
  className: string
}) {
  const metrics = [
    { label: 'Ventas de hoy', short: 'Ventas hoy', value: formatEuro(sales), delta: formatPercent(7.7) },
    { label: 'Tickets procesados', short: 'Tickets', value: groupThousands(String(Math.round(tickets))), delta: formatPercent(5.1) },
    { label: 'Ticket medio', short: 'Ticket medio', value: formatEuro(sales / tickets, 2), delta: formatPercent(2.5) },
  ]

  return (
    <Panel focused={focused} className={`grid grid-cols-3 divide-x divide-white/[0.06] ${className}`}>
      {metrics.map(metric => (
        <div key={metric.label} className="min-w-0 px-2.5 py-2.5 md:px-4 md:py-3">
          <div className="font-mono-data text-[9px] md:text-[10px] text-[#86868b] uppercase tracking-wider truncate">
            <span className="lg:hidden">{metric.short}</span>
            <span className="hidden lg:inline">{metric.label}</span>
          </div>
          <div className={`font-display font-700 text-[15px] md:text-[22px] leading-tight mt-1 tabular-nums transition-colors duration-700 ${flash ? 'text-brand-primary' : 'text-white'}`}>
            {metric.value}
          </div>
          <div className="font-mono-data text-[9px] md:text-[10px] text-[#30d158] mt-0.5 truncate">
            {metric.delta}<span className="hidden md:inline"> vs ayer</span>
          </div>
        </div>
      ))}
    </Panel>
  )
}

function SalesChart({ total, drawable, chip, focused, className }: {
  total: number
  drawable: boolean
  chip: boolean
  focused: boolean
  className: string
}) {
  const gradientId = `demo-area-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const { ref, width, height } = useElementSize<HTMLDivElement>()
  const drawn = useGrow(drawable && width > 0)

  const pad = { top: 14, right: 14, bottom: 20, left: 6 }
  const innerW = Math.max(width - pad.left - pad.right, 0)
  const innerH = Math.max(height - pad.top - pad.bottom, 0)
  const x = (i: number) => pad.left + (innerW * i) / (hours.length - 1)
  const y = (value: number) => pad.top + innerH * (1 - value / CHART_MAX)
  const today = [...todayUntilNow, total].map((value, i): [number, number] => [x(i), y(value)])
  const yesterday = yesterdayCumulative.map((value, i): [number, number] => [x(i), y(value)])
  const line = smoothPath(today)
  const area = `${line} L${x(hours.length - 1)},${pad.top + innerH} L${x(0)},${pad.top + innerH} Z`
  const [endX, endY] = today[today.length - 1]

  return (
    <Panel focused={focused} className={`flex-col min-h-0 p-3 md:p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <PanelTitle>Evolución de ventas</PanelTitle>
          <div className="font-mono-data text-[10px] text-[#86868b] mt-0.5 truncate">Acumulado del día · {formatPercent(7.7)} vs ayer</div>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono-data text-[10px] text-[#86868b]">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-brand-primary"/>Hoy</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 border-t border-dashed border-white/40"/>Ayer</span>
        </div>
      </div>

      <div ref={ref} className="relative flex-1 min-h-[120px] mt-2">
        {width > 0 && (
          <>
            <svg width={width} height={height} className="absolute inset-0" aria-hidden="true">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8cf4ee" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#8cf4ee" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map(fraction => (
                <line
                  key={fraction}
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={pad.top + innerH * fraction}
                  y2={pad.top + innerH * fraction}
                  stroke="rgba(255,255,255,0.05)"
                />
              ))}
              <path d={smoothPath(yesterday)} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeDasharray="3 4"/>
              <path
                d={area}
                fill={`url(#${gradientId})`}
                style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}
              />
              <path
                d={line}
                fill="none"
                stroke="#8cf4ee"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              {hours.map((hour, i) => (
                <text
                  key={hour}
                  x={x(i)}
                  y={height - 4}
                  textAnchor={i === 0 ? 'start' : i === hours.length - 1 ? 'end' : 'middle'}
                  className="font-mono-data"
                  fontSize="9"
                  fill="#86868b"
                >
                  {hour}
                </text>
              ))}
            </svg>

            <span
              className={`absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${drawn ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: endX, top: endY }}
            >
              <span className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-50"/>
              <span className="absolute inset-0 rounded-full bg-brand-primary shadow-[0_0_12px_rgba(140,244,238,0.8)]"/>
            </span>
            <span
              className={`absolute -translate-x-full -translate-y-full pr-2 pb-2 font-display font-700 text-[12px] md:text-[13px] text-white tabular-nums whitespace-nowrap transition-opacity duration-500 ${drawn ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: endX, top: endY }}
            >
              {formatEuro(total)}
            </span>
            {chip && (
              <span
                className="demo-float-up absolute -translate-x-full whitespace-nowrap rounded-full border border-brand-primary/30 bg-brand-dark/90 px-2 py-0.5 font-mono-data text-[10px] text-brand-primary"
                style={{ left: endX - 8, top: endY + 10 }}
              >
                +{formatEuro(newTicket.amount)} · {newTicket.branch}
              </span>
            )}
          </>
        )}
      </div>
    </Panel>
  )
}

// Curva suave (Catmull-Rom) que pasa por todos los puntos
function smoothPath(points: [number, number][]) {
  return points.reduce((d, [px, py], i, arr) => {
    if (i === 0) return `M${px},${py}`
    const [x0, y0] = arr[i - 2] ?? arr[i - 1]
    const [x1, y1] = arr[i - 1]
    const [x3, y3] = arr[i + 1] ?? [px, py]
    const c1x = x1 + (px - x0) / 6
    const c1y = y1 + (py - y0) / 6
    const c2x = px - (x3 - x1) / 6
    const c2y = py - (y3 - y1) / 6
    return `${d} C${c1x},${c1y} ${c2x},${c2y} ${px},${py}`
  }, '')
}

const statusStyles: Record<BranchStatus, { label: string; dot: string; text: string }> = {
  online: { label: 'En línea', dot: 'bg-[#30d158]', text: 'text-[#30d158]' },
  sending: { label: 'Enviando…', dot: 'bg-brand-primary', text: 'text-brand-primary' },
  slow: { label: 'Ritmo bajo', dot: 'bg-[#ff9f0a]', text: 'text-[#ff9f0a]' },
}

function Branches({ granVia, sending, highlight, focused, className }: {
  granVia: number
  sending: boolean
  highlight: boolean
  focused: boolean
  className: string
}) {
  const data = branches.map(branch => ({
    ...branch,
    value: branch.name === 'Gran Vía' ? granVia : branch.before,
  }))
  const leader = Math.max(...data.map(branch => branch.value))

  return (
    <div className={`grid-cols-3 gap-2 md:gap-3 ${className}`}>
      {data.map(branch => {
        const isGranVia = branch.name === 'Gran Vía'
        const status = statusStyles[isGranVia && sending ? 'sending' : branch.status]
        const isTop = highlight && isGranVia
        const delta = (branch.value / branch.yesterday - 1) * 100
        return (
          <div
            key={branch.name}
            className={`relative min-w-0 rounded-xl border p-2.5 md:p-3 transition-[opacity,border-color,background-color,box-shadow] duration-500 ${
              isTop
                ? 'border-brand-primary/50 bg-brand-primary/[0.08] shadow-[0_0_0_3px_rgba(140,244,238,0.06),0_18px_40px_-18px_rgba(140,244,238,0.5)]'
                : highlight
                  ? 'border-white/[0.06] bg-white/[0.02] opacity-50'
                  : isGranVia && sending
                    ? 'border-brand-primary/30 bg-white/[0.035]'
                    : `border-white/[0.07] bg-white/[0.025] ${focused ? '' : 'md:opacity-[0.62]'}`
            }`}
          >
            {isTop && (
              <span className="demo-pop absolute -top-2 right-2 rounded-full bg-brand-primary px-1.5 py-px font-mono-data text-[9px] font-semibold text-brand-dark">
                Top ventas
              </span>
            )}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] md:text-[12px] font-medium text-white truncate">{branch.name}</span>
              <span className={`inline-flex items-center gap-1 shrink-0 font-mono-data text-[9px] md:text-[10px] ${status.text}`}>
                <span className={`relative flex w-1.5 h-1.5`}>
                  {isGranVia && sending && <span className={`absolute inset-0 rounded-full ${status.dot} animate-ping`}/>}
                  <span className={`relative w-1.5 h-1.5 rounded-full ${status.dot}`}/>
                </span>
                <span className="hidden lg:inline">{status.label}</span>
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-1.5">
              <span className="font-display font-700 text-[14px] md:text-[17px] text-white tabular-nums whitespace-nowrap">{formatEuro(branch.value)}</span>
              <span className={`hidden lg:inline font-mono-data text-[10px] ${delta >= 0 ? 'text-[#30d158]' : 'text-[#ff375f]'}`}>
                {formatPercent(delta, 0)}
              </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width,background-color] duration-700"
                style={{ width: `${(branch.value / leader) * 100}%`, backgroundColor: isTop ? '#8cf4ee' : '#448481' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

type CapturePhase = 'idle' | 'pos' | 'cloud' | 'done'

function Pipeline({ phase }: { phase: CapturePhase }) {
  const order: CapturePhase[] = ['idle', 'pos', 'cloud', 'done']
  const current = order.indexOf(phase)
  const nodes = [
    { label: 'TPV', icon: receiptIcon },
    { label: 'Nube', icon: cloudIcon },
    { label: 'Panel', icon: chartIcon },
  ]

  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {nodes.map((node, i) => {
        const reached = current >= i + 1
        const working = current === i + 1 && phase !== 'done'
        return (
          <div key={node.label} className="contents">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 transition-colors duration-300 ${
                reached ? 'border-brand-primary/35 bg-brand-primary/10 text-brand-primary' : 'border-white/[0.08] text-[#86868b]'
              }`}
            >
              {working ? <Spinner className="w-3 h-3"/> : <Icon className="w-3 h-3">{node.icon}</Icon>}
              <span className="font-mono-data text-[9px] md:text-[10px]">{node.label}</span>
            </div>
            {i < nodes.length - 1 && (
              <div className="relative flex-1 h-px bg-white/[0.08] overflow-hidden">
                <div className={`absolute inset-0 bg-brand-primary/40 transition-opacity duration-300 ${current > i + 1 ? 'opacity-100' : 'opacity-0'}`}/>
                {current === i + 1 && phase !== 'done' && (
                  <span className="demo-flow absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#8cf4ee]"/>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

type Ticket = typeof newTicket

function TicketRow({ ticket, state }: { ticket: Ticket; state: 'processing' | 'captured' | 'normal' }) {
  const processing = state === 'processing'
  return (
    <div
      className={`relative overflow-hidden flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors duration-500 ${
        processing
          ? 'border-brand-primary/30 bg-brand-primary/[0.07]'
          : state === 'captured'
            ? 'border-white/[0.09] bg-white/[0.04]'
            : 'border-transparent'
      }`}
    >
      {processing && <span className="demo-shimmer absolute inset-0" aria-hidden="true"/>}
      <span className={`relative w-7 h-7 shrink-0 rounded-md flex items-center justify-center ${processing ? 'bg-brand-primary/15 text-brand-primary' : 'bg-white/[0.05] text-[#86868b]'}`}>
        {processing ? <Spinner/> : <Icon>{receiptIcon}</Icon>}
      </span>
      <div className="relative flex-1 min-w-0">
        <div className="text-[12px] text-white font-medium truncate">
          Ticket #{ticket.id} <span className="text-[#86868b] font-normal">· {ticket.branch}</span>
        </div>
        <div className={`font-mono-data text-[10px] truncate ${processing ? 'text-brand-primary' : 'text-[#86868b]'}`}>
          {processing ? 'Procesando en la nube…' : `${ticket.terminal} · ${ticket.items} artículos · ${ticket.time}`}
        </div>
      </div>
      <div className="relative shrink-0 text-right">
        <div className={`text-[12px] font-semibold tabular-nums transition-opacity ${processing ? 'text-white/50' : 'text-white'}`}>
          {formatEuro(ticket.amount, 2)}
        </div>
        {state === 'captured' && (
          <span className="demo-pop inline-flex items-center gap-0.5 font-mono-data text-[9px] text-[#30d158]">
            <Icon className="w-2.5 h-2.5">{checkIcon}</Icon>
            Capturado
          </span>
        )}
      </div>
    </div>
  )
}

function ActivityFeed({ phase, ticketShown, highlightNew, focused, className }: {
  phase: CapturePhase
  ticketShown: boolean
  highlightNew: boolean
  focused: boolean
  className: string
}) {
  const newState = phase === 'pos' || phase === 'cloud' ? 'processing' : highlightNew ? 'captured' : 'normal'

  return (
    <Panel focused={focused} className={`flex-col min-h-0 p-3 md:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <PanelTitle>Actividad reciente</PanelTitle>
        <span className="md:hidden lg:inline font-mono-data text-[10px] text-[#86868b] truncate">Tickets en tiempo real</span>
      </div>
      <Pipeline phase={phase}/>
      <ul className="mt-2.5 flex-1 min-h-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        {ticketShown && (
          <li key={newTicket.id} className="demo-ticket-in pb-1">
            <TicketRow ticket={newTicket} state={newState}/>
          </li>
        )}
        {recentTickets.map(ticket => (
          <li key={ticket.id} className="pb-1">
            <TicketRow ticket={ticket} state="normal"/>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function AssistantAvatar() {
  return (
    <span className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-brand-dark2 to-brand-secondary flex items-center justify-center text-white">
      <Icon className="w-3 h-3">{sparkIcon}</Icon>
    </span>
  )
}

function Assistant({ active, t, run, instant, onAsk, focused, className }: {
  active: boolean
  t: number
  run: number
  instant: boolean
  onAsk: () => void
  focused: boolean
  className: string
}) {
  const idle = !active || t < timeline.questionStart
  const typing = active && t >= timeline.questionStart && t < timeline.questionSent
  const sent = active && t >= timeline.questionSent
  const thinking = sent && t < timeline.answerStart
  const answered = active && t >= timeline.answerStart

  const richAnswer = (
    <>
      <strong className="font-semibold text-brand-primary">Gran Vía</strong> lidera las ventas de hoy con{' '}
      <strong className="font-semibold text-white">3.240&nbsp;€</strong>, un{' '}
      <span className="text-[#30d158]">18&nbsp;% más</span> que ayer.
    </>
  )

  return (
    <Panel focused={focused} className={`flex-col min-h-0 p-3 md:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-brand-primary"><Icon className="w-3.5 h-3.5">{sparkIcon}</Icon></span>
          <PanelTitle>Asistente IA</PanelTitle>
        </div>
        <span className="md:hidden lg:inline font-mono-data text-[10px] text-[#86868b] truncate">Pregunta a tus datos</span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-end gap-2 overflow-hidden py-2.5">
        {idle && (
          <button
            type="button"
            onClick={onAsk}
            className="self-start max-w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-brand-primary/40 hover:bg-brand-primary/[0.06] px-2.5 py-1.5 text-[11px] text-white/80 transition-colors"
          >
            <span className="text-brand-primary">Prueba: </span>{QUESTION}
          </button>
        )}
        {sent && (
          <div className="demo-fade-in self-end max-w-[88%] rounded-2xl rounded-br-md border border-brand-primary/20 bg-brand-primary/[0.14] px-3 py-1.5 text-[12px] text-white">
            {QUESTION}
          </div>
        )}
        {thinking && (
          <div className="demo-fade-in self-start flex items-center gap-2">
            <AssistantAvatar/>
            <span className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-3 py-2.5" aria-label="El asistente está escribiendo">
              {[0, 0.15, 0.3].map(delay => (
                <span key={delay} className="demo-typing-dot w-1.5 h-1.5 rounded-full bg-white/70" style={{ animationDelay: `${delay}s` }}/>
              ))}
            </span>
          </div>
        )}
        {answered && (
          <div className="demo-fade-in self-start flex items-start gap-2 max-w-[94%]">
            <AssistantAvatar/>
            <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-[12px] leading-relaxed text-white/85">
              <Typewriter key={`answer-${run}`} text={ANSWER} speed={16} instant={instant} rich={richAnswer}/>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 py-1.5 pl-3 pr-1.5">
        <span className="flex-1 min-w-0 truncate text-[12px]">
          {typing ? (
            <span className="text-white">
              <Typewriter key={`question-${run}`} text={QUESTION} speed={34} instant={instant}/>
              <span className="inline-block w-px h-3 ml-px align-middle bg-brand-primary animate-pulse"/>
            </span>
          ) : (
            <span className="text-[#86868b]">Pregunta a tus datos…</span>
          )}
        </span>
        <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center transition-colors ${typing ? 'bg-brand-primary text-brand-dark' : 'bg-white/[0.06] text-[#86868b]'}`}>
          <Icon className="w-3 h-3">{sendIcon}</Icon>
        </span>
      </div>
    </Panel>
  )
}

function PlayPauseButton({ paused, onToggle, className }: { paused: boolean; onToggle: () => void; className: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? 'Reproducir demo' : 'Pausar demo'}
      title={paused ? 'Reproducir' : 'Pausar'}
      className={`w-7 h-7 shrink-0 items-center justify-center rounded-full border border-white/[0.1] text-[#86868b] hover:text-white hover:border-white/25 transition-colors ${className}`}
    >
      <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M5 3.5v9l7.5-4.5z"/> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z"/>}
      </svg>
    </button>
  )
}

function DemoControls({ message, stepIndex, elapsed, paused, onSelect, onTogglePause }: {
  message: { text: string; done: boolean }
  stepIndex: number
  elapsed: number
  paused: boolean
  onSelect: (index: number) => void
  onTogglePause: () => void
}) {
  return (
    <div className="shrink-0 flex flex-col gap-2 border-t border-white/[0.06] bg-black/30 px-3 py-2.5 md:flex-row md:items-center md:gap-4 md:px-4">
      <div className="flex items-center gap-2 min-w-0 md:flex-1">
        <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${message.done ? 'bg-brand-primary/15 text-brand-primary' : 'text-brand-primary'}`}>
          {message.done ? <Icon className="w-3 h-3">{checkIcon}</Icon> : <Spinner/>}
        </span>
        <span key={message.text} className="demo-fade-in text-[12px] md:text-[13px] font-medium text-white/90 truncate">
          {message.text}
        </span>
        <PlayPauseButton paused={paused} onToggle={onTogglePause} className="flex ml-auto md:hidden"/>
      </div>

      <div role="group" aria-label="Pasos de la demo" className="grid grid-cols-3 gap-1.5 md:flex">
        {steps.map((step, i) => {
          const selected = i === stepIndex
          const progress = i < stepIndex ? 1 : i > stepIndex ? 0 : Math.min(elapsed / step.duration, 1)
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={selected}
              className={`relative overflow-hidden flex items-center justify-center md:justify-start gap-1.5 rounded-lg border px-2 md:px-3 pt-1.5 pb-2 text-[11px] md:text-[12px] font-medium whitespace-nowrap transition-colors ${
                selected
                  ? 'border-brand-primary/35 bg-brand-primary/[0.08] text-white'
                  : 'border-white/[0.07] text-[#86868b] hover:text-white hover:border-white/15'
              }`}
            >
              <span className={`hidden sm:flex w-4 h-4 shrink-0 rounded-full items-center justify-center font-mono-data text-[9px] ${selected ? 'bg-brand-primary text-brand-dark' : 'bg-white/[0.08]'}`}>
                {i + 1}
              </span>
              <span className="md:hidden">{step.short}</span>
              <span className="hidden md:inline">{step.label}</span>
              <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-white/[0.08] overflow-hidden" aria-hidden="true">
                <span className="block h-full rounded-full bg-brand-primary transition-[width] duration-100 ease-linear" style={{ width: `${progress * 100}%` }}/>
              </span>
            </button>
          )
        })}
      </div>

      <PlayPauseButton paused={paused} onToggle={onTogglePause} className="hidden md:flex"/>
    </div>
  )
}

function getMessage(step: StepId, t: number) {
  if (step === 'captura') {
    return t < timeline.ticketCaptured
      ? { text: 'Recibiendo ticket de TPV Gran Vía…', done: false }
      : { text: 'Ticket capturado automáticamente', done: true }
  }
  if (step === 'analisis') {
    return t < timeline.metricsMessage
      ? { text: 'Actualizando métricas…', done: false }
      : { text: 'Datos convertidos en información útil', done: true }
  }
  return t < timeline.answerStart
    ? { text: 'Pregunta a tus datos en lenguaje natural', done: false }
    : { text: 'Respuesta generada a partir de tus tickets', done: true }
}

// ── Demo ───────────────────────────────────────────────────────────────────
export default function InnoAppDemo() {
  const [reducedMotion] = useState(prefersReducedMotion)
  const [{ step: stepIndex, elapsed, run }, dispatch] = useReducer(demoReducer, { step: 0, elapsed: 0, run: 0 })
  const [userPaused, setUserPaused] = useState(reducedMotion)
  const [interactionPause, setInteractionPause] = useState(0)
  const [hovered, setHovered] = useState(false)
  const { ref, inView, hasEntered } = useViewport<HTMLDivElement>()

  const step = steps[stepIndex]
  // Avanza solo si nadie está interactuando; la secuencia del paso actual siempre termina
  const autoplay = inView && !userPaused && interactionPause === 0 && !hovered
  const sequencing = inView && !reducedMotion && elapsed < step.duration
  const clockRunning = autoplay || sequencing

  useEffect(() => {
    if (!clockRunning) return
    const interval = window.setInterval(() => dispatch({ type: 'tick', advance: autoplay }), TICK_MS)
    return () => window.clearInterval(interval)
  }, [clockRunning, autoplay])

  useEffect(() => {
    if (interactionPause === 0) return
    const timer = window.setTimeout(() => setInteractionPause(0), RESUME_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [interactionPause])

  const selectStep = (index: number) => {
    dispatch({ type: 'select', step: index })
    setInteractionPause(token => token + 1)
  }

  const t = reducedMotion ? Number.POSITIVE_INFINITY : elapsed
  const isCapture = step.id === 'captura'
  const isAnalysis = step.id === 'analisis'
  const isAssistant = step.id === 'asistente'

  const capturePhase: CapturePhase = !isCapture
    ? 'done'
    : t < timeline.ticketIn ? 'idle' : t < timeline.ticketCloud ? 'pos' : t < timeline.ticketCaptured ? 'cloud' : 'done'
  const metricsUpdated = isAssistant || (isAnalysis && t >= timeline.metricsUpdate)
  const flash = isAnalysis && t >= timeline.metricsUpdate && t < timeline.metricsUpdate + 1600

  const sales = useAnimatedNumber(metricsUpdated ? totals.after.sales : totals.before.sales)
  const tickets = useAnimatedNumber(metricsUpdated ? totals.after.tickets : totals.before.tickets)
  const granVia = useAnimatedNumber(metricsUpdated ? branches[0].after : branches[0].before)

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Demo interactiva de InnoApp con datos ficticios"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      className="relative flex flex-col lg:aspect-[16/10] overflow-hidden rounded-2xl border border-brand-primary/15 bg-[linear-gradient(180deg,#131b2a_0%,#0c111b_50%,#090d14_100%)] text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(140,244,238,0.04)]"
    >
      <WindowChrome/>
      <AppHeader/>

      {/* En móvil se muestra solo la región del paso activo; en escritorio, todo el panel */}
      <div className="flex-none h-[400px] md:h-[460px] lg:flex-1 lg:h-auto min-h-0 flex flex-col gap-2.5 p-3 md:grid md:grid-cols-12 md:gap-3 md:p-4">
        <div className="contents md:col-span-7 lg:col-span-8 md:flex md:flex-col md:gap-3 md:min-h-0">
          <MetricsPanel
            sales={sales}
            tickets={tickets}
            focused={isAnalysis}
            flash={flash}
            className="order-1 shrink-0"
          />
          <SalesChart
            total={sales}
            drawable={hasEntered}
            chip={isAnalysis && t >= timeline.metricsUpdate && Number.isFinite(t)}
            focused={isAnalysis}
            className={`order-3 flex-1 ${isAnalysis ? 'flex' : 'hidden'} md:flex`}
          />
          <Branches
            granVia={granVia}
            sending={capturePhase === 'pos' || capturePhase === 'cloud'}
            highlight={isAssistant && t >= timeline.highlight}
            focused={isCapture || isAssistant}
            className={`order-5 shrink-0 ${isAssistant ? 'grid' : 'hidden'} md:grid`}
          />
        </div>

        <div className="contents md:col-span-5 lg:col-span-4 md:flex md:flex-col md:gap-3 md:min-h-0">
          <ActivityFeed
            phase={capturePhase}
            ticketShown={!isCapture || t >= timeline.ticketIn}
            highlightNew={isCapture}
            focused={isCapture}
            className={`order-2 flex-1 ${isCapture ? 'flex' : 'hidden'} md:flex`}
          />
          <Assistant
            active={isAssistant}
            t={t}
            run={run}
            instant={reducedMotion}
            onAsk={() => selectStep(2)}
            focused={isAssistant}
            className={`order-4 flex-1 ${isAssistant ? 'flex' : 'hidden'} md:flex`}
          />
        </div>
      </div>

      <DemoControls
        message={getMessage(step.id, t)}
        stepIndex={stepIndex}
        elapsed={elapsed}
        paused={userPaused}
        onSelect={selectStep}
        onTogglePause={() => setUserPaused(paused => !paused)}
      />
    </div>
  )
}
