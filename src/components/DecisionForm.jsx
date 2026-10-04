import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const field = 'mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/35 transition focus:border-cyan/60'

export default function DecisionForm({ onSubmit, demoSlot }) {
  const [v, setV] = useState({ decision: '', reasoning: '', context: '' })
  const [err, setErr] = useState({})
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const errors = {}
    if (v.decision.trim().length < 5) errors.decision = 'Describe the decision you are considering.'
    if (v.reasoning.trim().length < 10) errors.reasoning = 'Share your current thinking so it can be challenged.'
    setErr(errors)
    if (Object.keys(errors).length) return
    onSubmit({ ...v, demo: false })
  }

  return (
    <motion.form onSubmit={submit} noValidate className="glass rounded-3xl p-6 sm:p-8"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
      <label htmlFor="decision" className="font-display text-sm font-bold">Decision</label>
      <input id="decision" maxLength={300} value={v.decision} onChange={set('decision')}
        aria-invalid={!!err.decision} aria-describedby={err.decision ? 'decision-err' : undefined}
        placeholder="What decision are you considering? e.g. Should I accept a 6-month internship?" className={field} />
      {err.decision && <p id="decision-err" role="alert" className="mt-1 text-sm text-rose-300">{err.decision}</p>}

      <label htmlFor="reasoning" className="mt-5 block font-display text-sm font-bold">Your reasoning</label>
      <textarea id="reasoning" rows={4} maxLength={2000} value={v.reasoning} onChange={set('reasoning')}
        aria-invalid={!!err.reasoning} aria-describedby={err.reasoning ? 'reasoning-err' : undefined}
        placeholder={'What are you currently thinking about?\nWhat matters most to you?'} className={field} />
      {err.reasoning && <p id="reasoning-err" role="alert" className="mt-1 text-sm text-rose-300">{err.reasoning}</p>}

      <label htmlFor="context" className="mt-5 block font-display text-sm font-bold">
        Optional context
      </label>
      <textarea id="context" rows={2} maxLength={1500} value={v.context} onChange={set('context')}
        placeholder="Add context, constraints, goals, or concerns..." className={field} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 font-display font-bold text-ink transition hover:brightness-110 active:scale-[.98]">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> START AI DEBATE
        </button>
        {demoSlot}
      </div>
      <p className="mt-5 text-sm text-white/50">
        BLINDSPOT doesn't decide for you.<br />It challenges the way you're thinking.
      </p>
    </motion.form>
  )
}
