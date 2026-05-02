const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
})

export const checkAPIKey = async () => {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) {
    console.error('[API] MISSING: VITE_ANTHROPIC_API_KEY is not set in .env')
    return false
  }
  if (!key.startsWith('sk-ant-')) {
    console.error('[API] INVALID: Key does not start with sk-ant-')
    return false
  }
  console.log('[API] Key found and looks valid')
  return true
}

export async function callClaude(prompt, maxTokens = 1200) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!key) {
    throw new Error('API key missing. Add VITE_ANTHROPIC_API_KEY to your .env file and restart the dev server.')
  }

  if (!key.startsWith('sk-ant-')) {
    throw new Error('API key looks wrong. It should start with sk-ant-')
  }

  console.log('[API] Calling Claude...', { promptLength: prompt.length, maxTokens, keyPresent: true })

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  console.log('[API] Response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[API] Error response:', errorText)
    throw new Error(`API call failed (${response.status}): ${errorText.slice(0, 300)}`)
  }

  const data = await response.json()
  console.log('[API] Success. Content blocks:', data.content?.length)

  return data.content.map(c => c.text || '').join('')
}

export async function callClaudeConversation(messages, maxTokens = 200) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY

  console.log('[API] callClaudeConversation')
  console.log('[API] Key:', key ? 'present ✅' : 'MISSING ❌')
  console.log('[API] Messages:', messages.length)
  console.log('[API] Last message:', messages[messages.length - 1]?.content?.slice(0, 60))

  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY missing from .env')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages }),
  })

  console.log('[API] Status:', response.status)

  if (!response.ok) {
    const err = await response.text()
    console.error('[API] Error:', response.status, err)
    throw new Error(`API ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.content.map(c => c.text || '').join('').trim()
  console.log('[API] Response:', text.slice(0, 80))
  return text
}

export function parseJSON(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch (e2) {
        console.error('[API] JSON parse failed. Raw text:', text)
        throw new Error('Response was not valid JSON. Raw: ' + text.slice(0, 200))
      }
    }
    console.error('[API] JSON parse failed. Raw text:', text)
    throw new Error('Response was not valid JSON. Raw: ' + text.slice(0, 200))
  }
}

export async function generatePitch(product, industry, framework, audience, keywords, language, customBrain = {}) {
  const brainCtx = customBrain?.offer
    ? `\nSeller context: ${customBrain.offer}. Target customer: ${customBrain.icp}.`
    : ''

  const prompt = `You are a world class sales pitch writer trained on the real documented techniques of Andy Elliott, Jordan Belfort, Grant Cardone, Alex Hormozi, and Zig Ziglar.

Write a sales pitch for:
- Product: ${product}
- Industry: ${industry}
- Framework: ${framework}
- Audience: ${audience || 'general prospect'}
- Keywords to include: ${keywords || 'none specified'}
${brainCtx}

REQUIREMENTS:
- Opening line must be a pattern interrupt — NOT "Hi my name is"
- Build value before mentioning price or commitment
- Include one specific result, number, or proof element
- Close must be assumptive — use "when we get started" not "if you decide"
- Avoid weak words: maybe, might, could, hope, try, think
- Use power words: proven, guaranteed, results, transformation, protect
- Length: 150-200 words
- Sound like a real human wrote this, not AI

Respond with ONLY a raw JSON object.
No markdown. No backticks. No explanation before or after.
Start your response with { and end with }

{"pitch":"the full pitch text here","hook_score":85,"confidence_score":82,"close_score":79,"closer_blend":["Andy Elliott","Grant Cardone"],"technique_used":"Assumptive Close + Pattern Interrupt","feedback":"2-3 sentence coaching note on what makes this pitch hit","strength_tags":["Strong Hook","Assumptive Close","Social Proof"],"power_moments":["first strongest line from the pitch","second strongest line","third strongest line"]}

CRITICAL: Write the ENTIRE pitch and ALL JSON field values in ${language}. Every single word of the pitch, feedback, strength_tags, and power_moments must be in ${language}. This is non-negotiable.`

  console.log('[PITCH] Generating pitch for:', product, 'using', framework)

  const raw = await callClaude(prompt, 1400)
  const result = parseJSON(raw)
  if (!Array.isArray(result.closer_blend)) result.closer_blend = [result.closer_blend].filter(Boolean)
  if (!Array.isArray(result.power_moments)) result.power_moments = []
  result.power_moments = result.power_moments.map(pm => typeof pm === 'string' ? pm : pm.line || JSON.stringify(pm))
  return result
}

export async function improvePitch(existingPitch, industry, framework, language) {
  const prompt = `You are an elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone, Alex Hormozi, Zig Ziglar, Tony Robbins, and Chris Voss.

STEP 1 — DIAGNOSE this pitch for these 8 specific weaknesses:
1. Weak or missing hook (no pattern interrupt)
2. No pain amplification (inaction doesn't hurt)
3. Missing certainty (sounds hesitant)
4. No urgency driver (prospect can sleep on it)
5. Feature dumping (benefits not tied to outcomes)
6. Weak close (no assumptive language)
7. Missing social proof or authority
8. No tonality direction (reads flat)

STEP 2 — REBUILD using ${framework} patterns. Inject real closer power.

Original pitch: "${existingPitch}"
Industry: ${industry}

Respond with ONLY a raw JSON object. No markdown. No backticks. Start with { end with }

{"pitch":"completely rebuilt 150-200 word pitch","hook_score":0,"confidence_score":0,"close_score":0,"feedback":"what framework was applied and how","strength_tags":["tag1","tag2","tag3"],"framework_applied":"${framework}","what_was_wrong":["specific weakness 1","specific weakness 2","specific weakness 3"],"what_was_fixed":["exactly how fix 1 was applied","exactly how fix 2","exactly how fix 3"],"power_moments":["exact quote from rebuilt pitch showing elite technique 1","exact quote showing technique 2","exact quote showing technique 3"]}

CRITICAL: Write EVERYTHING — the pitch, feedback, all tags, all analysis — entirely in ${language}. Every single word must be in ${language}.`

  console.log('[improvePitch] framework:', framework, '| industry:', industry)
  const raw = await callClaude(prompt, 1400)
  const result = parseJSON(raw)
  if (!Array.isArray(result.power_moments)) result.power_moments = []
  result.power_moments = result.power_moments.map(pm => typeof pm === 'string' ? pm : pm.line || JSON.stringify(pm))
  return result
}

export async function getBrutalFeedback(userText, language = 'English') {
  const prompt = `Brutal sales coach Andy Elliott style. Find the biggest mistake in: "${userText}". 1-2 sentence brutal callout with the elite version. Start with "BLITZ:". Respond in ${language}.`
  return callClaude(prompt, 120)
}

export async function getReframes(objection, language) {
  const prompt = `Sales coach. Prospect said: "${objection}". 3 elite reframes — Elliott (empathy+certainty), Belfort (logical certainty), Cardone (bold). Under 2 sentences each. Language: ${language}. Respond with ONLY raw JSON, no markdown: {"r1":"Elliott reframe","r2":"Belfort reframe","r3":"Cardone reframe"}`
  const raw = await callClaude(prompt, 380)
  return parseJSON(raw)
}

export async function getRebuttal(objection, industry, language, customBrain = {}) {
  const brainCtx = customBrain.offer
    ? `Company context: ${customBrain.offer}. ICP: ${customBrain.icp}.`
    : ''
  const prompt = `Elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone. Industry: "${industry}". Objection: "${objection}". ${brainCtx} Respond with ONLY raw JSON, no markdown: {"soft":{"script":"Andy Elliott empathize-then-close rebuttal","tone":"warm but certain","closer":"Andy Elliott — Soft Close","followup":"follow-up line"},"direct":{"script":"Jordan Belfort direct confident rebuttal","tone":"certain and belief-driven","closer":"Jordan Belfort — Direct","followup":"follow-up line"},"aggressive":{"script":"Grant Cardone bold aggressive rebuttal","tone":"high energy and bold","closer":"Grant Cardone — Aggressive","followup":"follow-up line"}}

CRITICAL: You MUST write every single word of every JSON value in ${language}. The "script", "tone", "closer", and "followup" fields must all be written entirely in ${language}. Do not use English if ${language} is not English. Every word must be in ${language}.`
  const raw = await callClaude(prompt, 1200)
  return parseJSON(raw)
}

export async function generateProspectProfile(industry, difficulty) {
  const prompt = `Generate a realistic sales prospect for a ${industry} cold call. Difficulty: ${difficulty}. Respond with ONLY raw JSON, no markdown:
{"name":"Full Name","age":42,"occupation":"specific job title","location":"City, State","personality":"2-sentence personality description","mood_today":"brief current mood affecting how they answer","main_objection":"their most likely specific objection","trigger_to_buy":"what would make them say yes","speech_pattern":"how they talk — pace, formality, verbal habits","backstory":"2-sentence personal context","opening_line":"exactly how they answer this unexpected call"}`
  const raw = await callClaude(prompt, 500)
  return parseJSON(raw)
}

export async function runAutopsy(transcript, closePct, dealValue) {
  const prompt = `You are Blitz, elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone. Analyze this call:\n${transcript}\n\nClose probability: ${closePct}%. Deal value: $${dealValue}.\n\nRespond with ONLY raw JSON, no markdown:\n{"result":"${closePct >= 70 ? 'Close' : 'No Close'}","score":${closePct},"close_probability":${closePct},"potential_value":${dealValue},"value_lost":${closePct < 70 ? dealValue : 0},"overall_feedback":"2-3 sentence Blitz coaching referencing Elliott/Belfort/Cardone","key_moments":[{"time":"0:45","type":"bad","what_said":"weak moment","better_version":"elite script"},{"time":"1:20","type":"good","what_said":"what they did right","build_on":"how to amplify"},{"time":"2:10","type":"bad","what_said":"another weak moment","better_version":"elite version"}],"biggest_mistake":"#1 thing that hurt this call","top_strength":"what they did well","blitz_coaching":"one line from Blitz referencing a real closer"}`
  const raw = await callClaude(prompt, 1300)
  return parseJSON(raw)
}

const ELEVEN_LANG_MAP = {
  'English': 'en', 'Spanish': 'es', 'Portuguese': 'pt', 'French': 'fr',
  'German': 'de', 'Italian': 'it', 'Mandarin Chinese': 'zh',
  'Japanese': 'ja', 'Arabic': 'ar', 'Hindi': 'hi',
}

export async function elevenLabsSpeak(text, gender, language = 'English') {
  const FEMALE_VOICE = 'g6xIsTj2HwM6VR4iXFCw'
  const MALE_VOICE = 'UgBBYS2sOqTuMpoF3BR0'
  const voiceId = gender === 'male' ? MALE_VOICE : FEMALE_VOICE
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const langCode = ELEVEN_LANG_MAP[language] || 'en'

  console.log('[ELEVEN] gender:', gender, '| voiceId:', voiceId, '| language_code:', langCode)
  console.log('[ELEVEN] apiKey length:', apiKey?.length)

  if (!text?.trim()) { console.error('[ELEVEN] Empty text'); return null }
  if (!apiKey || apiKey.length < 10) { console.error('[ELEVEN] Missing API key'); return null }

  let response
  try {
    response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_turbo_v2',
        language_code: langCode,
        voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
      }),
    })
  } catch (err) {
    console.error('[ELEVEN] Network error:', err.message)
    return null
  }

  console.log('[ELEVEN] Status:', response.status)

  if (!response.ok) {
    let body = ''
    try { body = await response.text() } catch (e) {}
    console.error('[ELEVEN] Failed:', response.status, body)
    return null
  }

  let blob
  try { blob = await response.blob() } catch (err) {
    console.error('[ELEVEN] Blob error:', err.message)
    return null
  }

  if (!blob || blob.size === 0) {
    console.error('[ELEVEN] Empty blob')
    return null
  }

  try {
    const url = URL.createObjectURL(blob)
    console.log('[ELEVEN] ✅ Audio URL ready, blob size:', blob.size)
    return url
  } catch (err) {
    console.error('[ELEVEN] URL error:', err.message)
    return null
  }
}

export function playElevenLabsAudio(url, textLength) {
  return new Promise((resolve) => {
    if (!url) { resolve(); return }
    const audio = new Audio(url)
    const maxMs = Math.max((textLength || 100) * 100, 8000)
    let done = false
    const finish = (reason) => {
      if (done) return
      done = true
      console.log('[ELEVEN PLAY] Done:', reason)
      try { URL.revokeObjectURL(url) } catch (e) {}
      resolve()
    }
    const timeout = setTimeout(() => finish('timeout'), maxMs)
    audio.onended = () => { clearTimeout(timeout); finish('ended') }
    audio.onerror = () => { clearTimeout(timeout); finish('error') }
    audio.load()
    audio.play()
      .then(() => console.log('[ELEVEN PLAY] ✅ Playing'))
      .catch(err => {
        console.error('[ELEVEN PLAY] play() blocked:', err.name, err.message)
        clearTimeout(timeout)
        finish('play blocked')
      })
  })
}
