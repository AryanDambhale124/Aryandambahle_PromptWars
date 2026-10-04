import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  RefreshCw,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react'

const loadingCards = [
  { icon: CheckCircle2, label: 'THE ADVOCATE', title: 'Building the strongest case', copy: 'Looking for the practical reasons your current direction could work.', tone: 'text-cyan' },
  { icon: Search, label: 'THE SKEPTIC', title: 'Testing your assumptions', copy: 'Searching for risks, trade-offs, and evidence you may be underweighting.', tone: 'text-violet' },
  { icon: Scale, label: 'THE MODERATOR', title: 'Finding the real tension', copy: 'Separating a meaningful uncertainty from a passing concern.', tone: 'text-amber-300' },
]

function Detail({ label, children }) {
  return (
    <div className="border-b border-white/10 py-5 last:border-0">
      <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/85">{children}</p>
    </div>
  )
}

function DebateCard({ icon: Icon, label, title, copy, tone, loading }) {
  return (
    <article data-room-card className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
      <p className={`mt-5 font-display text-[10px] font-extrabold tracking-[0.16em] ${tone}`}>{label}</p>
      <h2 className="mt-2 font-display text-lg font-extrabold">{title}</h2>
      <p className={`mt-3 text-sm leading-6 ${loading ? 'text-white/45' : 'text-white/75'}`}>{copy}</p>
      {loading && <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet to-cyan" /></div>}
    </article>
  )
}

export default function Analysis({ session, onStartOver }) {
  const root = useRef(null)
  const [room, setRoom] = useState({ status: 'loading', debate: null, error: '' })
  const [requestNumber, setRequestNumber] = useState(0)
  const hasContext = session.context.trim().length > 0

  useEffect(() => {
    const controller = new AbortController()
    async function startDebate() {
      try {
        const response = await fetch('/api/debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session),
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) throw new Error(payload.error || 'The debate room could not be started.')
        setRoom({ status: 'ready', debate: payload.debate, error: '' })
      } catch (error) {
        if (error.name === 'AbortError') return
        setRoom({ status: 'error', debate: null, error: error.message || 'The debate room could not be started.' })
      }
    }

    startDebate()
    return () => controller.abort()
  }, [session, requestNumber])

  function retryDebate() {
    setRoom({ status: 'loading', debate: null, error: '' })
    setRequestNumber((number) => number + 1)
  }

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.fromTo('[data-room-intro]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      gsap.fromTo('[data-room-card]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.12, ease: 'power3.out' })
      gsap.fromTo('[data-room-orbit]', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.25, ease: 'back.out(1.4)' })
    }, root)

    return () => context.revert()
  }, [room.status, room.debate])

  const debateCards = room.debate && [
    { icon: CheckCircle2, label: 'THE ADVOCATE', title: 'The case for your direction', copy: room.debate.advocate, tone: 'text-cyan' },
    { icon: Search, label: 'THE SKEPTIC', title: 'The challenge to examine', copy: room.debate.skeptic, tone: 'text-violet' },
  ]

  return (
    <section ref={root} className="mx-auto w-full max-w-6xl px-5 pb-16 pt-7 sm:pt-12">
      <div data-room-intro>
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm font-semibold text-white/60 transition hover:text-cyan"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          NEW DECISION
        </button>

        <div className="mt-7 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-xs font-extrabold tracking-[0.2em] text-cyan">BALANCED PERSPECTIVES, ONE DECISION</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
              DEBATE ROOM<br />
              <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">POWERED BY AI.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/55">
            <span className={`h-2 w-2 rounded-full ${room.status === 'loading' ? 'animate-pulse bg-amber-300' : room.status === 'ready' ? 'bg-cyan shadow-[0_0_12px_#5ce1e6]' : 'bg-rose-300'}`} />
            {room.status === 'loading' ? 'AI panel is joining' : room.status === 'ready' ? 'AI debate complete' : 'AI panel unavailable'}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-5">
          <article data-room-card className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-white/45">THE DECISION ON THE TABLE</p>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">{session.decision}</h2>
              </div>
              <div data-room-orbit className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
                <Bot className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            {room.status === 'ready' && <p className="mt-5 max-w-2xl border-l-2 border-cyan/50 pl-4 text-sm leading-6 text-white/70">{room.debate.summary}</p>}
          </article>

          {room.status === 'loading' && (
            <div className="grid gap-5 md:grid-cols-2">
              {loadingCards.slice(0, 2).map((card) => <DebateCard key={card.label} {...card} loading />)}
            </div>
          )}

          {room.status === 'ready' && (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {debateCards.map((card) => <DebateCard key={card.label} {...card} />)}
              </div>

              <article data-room-card className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-300/10 p-2.5 text-amber-300"><Scale className="h-5 w-5" aria-hidden="true" /></div>
                  <div>
                    <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-white/45">THE MODERATOR</p>
                    <h2 className="mt-1 font-display text-xl font-extrabold">What the room agrees is worth testing</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/75">{room.debate.moderator}</p>
              </article>

              <article data-room-card className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet/15 p-2.5 text-violet"><Lightbulb className="h-5 w-5" aria-hidden="true" /></div>
                  <div>
                    <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-white/45">NEXT BEST QUESTIONS</p>
                    <h2 className="mt-1 font-display text-xl font-extrabold">Take these back to the real world</h2>
                  </div>
                </div>
                <ol className="mt-6 space-y-4">
                  {room.debate.questions.slice(0, 3).map((question, index) => (
                    <li key={`${index}-${question}`} className="flex gap-4 rounded-xl bg-white/[0.025] p-4 text-sm leading-6 text-white/80">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan/40 font-display text-xs font-extrabold text-cyan">0{index + 1}</span>
                      {question}
                    </li>
                  ))}
                </ol>
              </article>
            </>
          )}

          {room.status === 'error' && (
            <article data-room-card className="rounded-3xl border border-rose-300/20 bg-rose-300/5 p-6 sm:p-8">
              <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-rose-200">THE ROOM COULDN'T START</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">{room.error}</p>
              <div className="mt-5 max-w-xl rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/70">
                <p className="font-semibold text-white">Add your Gemini API key</p>
                <p className="mt-2">Open <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan">api/key.txt</code> in your project folder, paste your key into that file, and save it. Keep the key in this file; do not paste it into the app or share it.</p>
                <p className="mt-2">Then restart the dev server and choose Try Again. You can get a key from Google AI Studio.</p>
              </div>
              <button onClick={retryDebate} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 font-display text-sm font-extrabold transition hover:border-cyan/50 hover:text-cyan">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                TRY AGAIN
              </button>
            </article>
          )}
        </div>

        <aside data-room-card className="glass rounded-3xl p-6 lg:sticky lg:top-6">
          <div className="flex items-center gap-2">
            <CircleHelp className="h-4 w-4 text-cyan" aria-hidden="true" />
            <p className="font-display text-[11px] font-extrabold tracking-[0.18em] text-white/55">THE BRIEF</p>
          </div>
          <div className="mt-3">
            <Detail label="YOUR REASONING">{session.reasoning}</Detail>
            {hasContext && <Detail label="CONTEXT & CONSTRAINTS">{session.context}</Detail>}
          </div>
          <p className="mt-5 rounded-xl border border-cyan/15 bg-cyan/5 p-4 text-sm leading-6 text-white/65">
            <Sparkles className="mr-2 inline h-4 w-4 text-cyan" aria-hidden="true" />
            The panel challenges your thinking. You still make the call.
          </p>
        </aside>
      </div>
    </section>
  )
}
