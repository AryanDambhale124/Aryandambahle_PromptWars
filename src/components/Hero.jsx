import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
      <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
        THINK BEFORE
        <br />
        <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">YOU DECIDE.</span>
      </h1>
      <p className="mt-6 max-w-md text-xl text-white/80">
        AI that challenges your reasoning,<br />not your right to decide.
      </p>
      <p className="mt-4 max-w-md text-white/55">
        Five AI perspectives. One clearer view of what you might be missing.
      </p>
    </motion.div>
  )
}
