import { validateAnalysis } from './validation'
import { callGemini } from './gemini'

const KEY = import.meta.env?.VITE_GEMINI_API_KEY
const MODEL = import.meta.env?.VITE_GEMINI_MODEL || undefined

async function viaServer(input, signal) {
  let res
  try {
    res = await fetch('/api/analyze', { method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new Error('Network problem. Check your connection and retry.')
  }
  let body = null
  try { body = await res.json() } catch { /* not JSON */ }
  if (!res.ok || !body) throw new Error(body?.message || 'No AI key found. Add VITE_GEMINI_API_KEY to .env, restart, or use the demo.')
  return body.data
}

export async function analyze({ decision, reasoning, context }, signal) {
  const input = { decision, reasoning, context }
  const data = KEY ? await callGemini(input, KEY, signal, MODEL) : await viaServer(input, signal)
  try { return validateAnalysis(data) } catch { throw new Error('The AI reply was incomplete. Please retry.') }
}
