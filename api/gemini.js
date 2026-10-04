import { SYSTEM, scrub } from './prompt'

// Calls Gemini directly from the browser. Returns the scrubbed JSON object or throws a friendly Error.
export async function callGemini({ decision, reasoning, context }, key, signal, model = 'gemini-2.5-flash') {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 40000)
  signal?.addEventListener('abort', () => ctrl.abort())
  let r
  try {
    r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: `<decision>${decision.slice(0, 300)}</decision>\n<reasoning>${reasoning.slice(0, 2000)}</reasoning>\n<context>${(context || 'none').slice(0, 1500)}</context>` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      }),
    })
  } catch (e) {
    if (signal?.aborted) throw e
    throw new Error(e.name === 'AbortError' ? 'The analysis took too long. Please retry.' : 'Network problem. Check your connection and retry.')
  } finally {
    clearTimeout(timer)
  }
  if (r.status === 429) throw new Error('The AI is busy right now. Wait a few seconds and retry.')
  if (r.status === 400 || r.status === 403) throw new Error('The API key was rejected. Check VITE_GEMINI_API_KEY in your .env file.')
  if (!r.ok) throw new Error('The AI service returned an error. Please retry.')
  const j = await r.json().catch(() => null)
  const text = j?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  try { return scrub(JSON.parse(text.replace(/^```json|```$/g, '').trim())) } catch { throw new Error('The AI reply was malformed. Please retry.') }
}
