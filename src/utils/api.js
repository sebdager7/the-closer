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

export async function callClaude(prompt, maxTokens = 1200, system = null) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!key) {
    throw new Error('API key missing. Add VITE_ANTHROPIC_API_KEY to your .env file and restart the dev server.')
  }

  if (!key.startsWith('sk-ant-')) {
    throw new Error('API key looks wrong. It should start with sk-ant-')
  }

  console.log('[API] Calling Claude...', { promptLength: prompt.length, maxTokens, keyPresent: true })

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  }
  if (system) body.system = system

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
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

export async function callClaudeConversation(messages, maxTokens = 200, system = null) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY

  console.log('[API] callClaudeConversation')
  console.log('[API] Key:', key ? 'present ✅' : 'MISSING ❌')
  console.log('[API] Messages:', messages.length)
  console.log('[API] System:', system ? 'present ✅' : 'none')
  console.log('[API] Last message:', messages[messages.length - 1]?.content?.slice(0, 60))

  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY missing from .env')

  const body = { model: MODEL, max_tokens: maxTokens, messages }
  if (system) body.system = system

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
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
    ? `Seller context: ${customBrain.offer}. Target customer: ${customBrain.icp}.`
    : ''

  const system = `You are an elite sales pitch writer trained on Andy Elliott, Jordan Belfort, Grant Cardone, Alex Hormozi, and Zig Ziglar. You MUST write your entire response in ${language}. Every word must be in ${language}. Do not use any other language.`

  const prompt = `Product: ${product}
Industry: ${industry}
Framework: ${framework}
Audience: ${audience || 'general prospect'}
Keywords: ${keywords || 'none'}
${brainCtx}

MANDATORY LANGUAGE RULE:
Write the ENTIRE pitch and ALL fields in ${language}.
Every single word must be in ${language}.
This overrides everything else.

Write a sales pitch with:
- Pattern interrupt opening (NOT "Hi my name is")
- Value before price or commitment
- One specific result or proof element
- Assumptive close ("when we get started" not "if you decide")
- 150-200 words
- No weak words: maybe, might, could, hope, try, think

Return ONLY raw JSON, no markdown, no backticks, start with {:
{"pitch":"full pitch in ${language}","hook_score":85,"confidence_score":82,"close_score":79,"closer_blend":["Andy Elliott","Grant Cardone"],"technique_used":"technique name in ${language}","feedback":"coaching note in ${language}","strength_tags":["tag in ${language}","tag in ${language}","tag in ${language}"],"power_moments":["strongest line in ${language}","second line in ${language}","third line in ${language}"]}

FINAL REMINDER: Every word in the pitch, feedback, strength_tags, and power_moments must be in ${language}.`

  console.log('[API] generatePitch language:', language)

  const raw = await callClaude(prompt, 1400, system)
  const result = parseJSON(raw)
  if (!Array.isArray(result.closer_blend)) result.closer_blend = [result.closer_blend].filter(Boolean)
  if (!Array.isArray(result.power_moments)) result.power_moments = []
  result.power_moments = result.power_moments.map(pm => typeof pm === 'string' ? pm : pm.line || JSON.stringify(pm))
  return result
}

export async function improvePitch(existingPitch, industry, framework, language) {
  const system = `You are an elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone, Alex Hormozi, and Zig Ziglar. You MUST write your entire response in ${language}. Every word must be in ${language}. Do not use any other language.`

  const prompt = `Rebuild this sales pitch using ${framework}.

Original pitch: "${existingPitch}"
Industry: ${industry}

MANDATORY LANGUAGE RULE:
Rewrite entirely in ${language}.
Every single word of every field must be in ${language}.
If ${language} is Spanish — write in Spanish.
If ${language} is French — write in French.
This overrides everything else.

Diagnose weaknesses, then rebuild with elite closer power.

Return ONLY raw JSON, no markdown, no backticks, start with {:
{"pitch":"rebuilt 150-200 word pitch in ${language}","hook_score":85,"confidence_score":82,"close_score":79,"framework_applied":"${framework}","what_was_wrong":["weakness in ${language}","weakness in ${language}","weakness in ${language}"],"what_was_fixed":["fix in ${language}","fix in ${language}","fix in ${language}"],"feedback":"coaching in ${language}","strength_tags":["tag in ${language}","tag in ${language}"],"power_moments":["line in ${language}","line in ${language}","line in ${language}"]}

FINAL REMINDER: Every word in every field must be in ${language}.`

  console.log('[API] improvePitch language:', language)
  const raw = await callClaude(prompt, 1400, system)
  const result = parseJSON(raw)
  if (!Array.isArray(result.power_moments)) result.power_moments = []
  result.power_moments = result.power_moments.map(pm => typeof pm === 'string' ? pm : pm.line || JSON.stringify(pm))
  return result
}

export async function getBrutalFeedback(userText, language = 'English') {
  const system = `You are a brutal sales coach. Respond entirely in ${language}. Every word must be in ${language}.`
  const prompt = `Find the biggest mistake in this sales line: "${userText}". Give a 1-2 sentence brutal callout with the elite version. Start with "BLITZ:". Write entirely in ${language}.`
  return callClaude(prompt, 120, system)
}

export async function getReframes(objection, language) {
  const system = `You are an elite sales coach. Respond entirely in ${language}. Every word must be in ${language}.`
  const prompt = `Prospect said: "${objection}". Give 3 elite reframes — Elliott (empathy+certainty), Belfort (logical certainty), Cardone (bold). Under 2 sentences each. Write entirely in ${language}. Respond with ONLY raw JSON, no markdown: {"r1":"Elliott reframe in ${language}","r2":"Belfort reframe in ${language}","r3":"Cardone reframe in ${language}"}`
  const raw = await callClaude(prompt, 380, system)
  return parseJSON(raw)
}

export async function getRebuttal(objection, industry, language, customBrain = {}) {
  const brainCtx = customBrain?.offer
    ? `Seller context: ${customBrain.offer}. ICP: ${customBrain.icp}.`
    : ''

  const system = `You are an elite sales coach. You MUST respond entirely in ${language}. Every single word of your response must be in ${language}. Do not use any other language.`

  const prompt = `Industry: "${industry}"
Objection: "${objection}"
${brainCtx}

Generate 3 rebuttal scripts:
- soft: Andy Elliott empathy-then-close style
- direct: Jordan Belfort logical certainty style
- aggressive: Grant Cardone bold energy style

MANDATORY LANGUAGE RULE:
Write every word of every field in ${language}.
If ${language} is Spanish — write in Spanish.
If ${language} is French — write in French.
If ${language} is Portuguese — write in Portuguese.
Do not include any English words if ${language} is not English.

Return ONLY raw JSON, no markdown, no backticks:
{"soft":{"script":"rebuttal in ${language}","tone":"tone in ${language}","closer":"Andy Elliott","followup":"follow-up in ${language}"},"direct":{"script":"rebuttal in ${language}","tone":"tone in ${language}","closer":"Jordan Belfort","followup":"follow-up in ${language}"},"aggressive":{"script":"rebuttal in ${language}","tone":"tone in ${language}","closer":"Grant Cardone","followup":"follow-up in ${language}"}}

FINAL REMINDER: All text values must be in ${language}.`

  console.log('[API] getRebuttal language:', language)
  const raw = await callClaude(prompt, 1100, system)
  return parseJSON(raw)
}

export async function generateProspectProfile(industry, difficulty, hints = {}) {
  const { name, gender, personalityType, mood } = hints

  const nameLine = name ? `Name: ${name} (use this exact name)` : 'Generate a realistic full name'
  const genderLine = gender ? `Gender: ${gender}` : 'Pick a gender'
  const personalityLine = personalityType
    ? `Personality archetype: ${personalityType.type}. Speech style: ${personalityType.speech}.`
    : 'Give them a distinct personality'
  const moodLine = mood ? `Mood today: ${mood}` : 'Give them a realistic current mood'

  const prompt = `Generate a realistic and unique sales prospect for a ${industry} cold call. Difficulty: ${difficulty}.
${nameLine}
${genderLine}
${personalityLine}
${moodLine}

Make this person feel completely real — specific job, specific life situation, specific reason they would or would not be interested in ${industry}.

Respond with ONLY raw JSON, no markdown:
{"name":"${name || 'Full Name'}","gender":"${gender || 'female'}","age":42,"occupation":"specific job title","location":"City, State","personality":"2-sentence personality description","mood_today":"brief current mood affecting how they answer","main_objection":"their most likely specific objection","trigger_to_buy":"what would make them say yes","speech_pattern":"how they talk — pace, formality, verbal habits","backstory":"2-sentence personal context","opening_line":"exactly how they answer this unexpected call"}`

  const raw = await callClaude(prompt, 550)
  return parseJSON(raw)
}

export async function runAutopsy(transcript, closePct, dealValue) {
  const prompt = `You are Blitz, elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone. Analyze this call:\n${transcript}\n\nClose probability: ${closePct}%. Deal value: $${dealValue}.\n\nRespond with ONLY raw JSON, no markdown:\n{"result":"${closePct >= 70 ? 'Close' : 'No Close'}","score":${closePct},"close_probability":${closePct},"potential_value":${dealValue},"value_lost":${closePct < 70 ? dealValue : 0},"overall_feedback":"2-3 sentence Blitz coaching referencing Elliott/Belfort/Cardone","key_moments":[{"time":"0:45","type":"bad","what_said":"weak moment","better_version":"elite script"},{"time":"1:20","type":"good","what_said":"what they did right","build_on":"how to amplify"},{"time":"2:10","type":"bad","what_said":"another weak moment","better_version":"elite version"}],"biggest_mistake":"#1 thing that hurt this call","top_strength":"what they did well","blitz_coaching":"one line from Blitz referencing a real closer"}`
  const raw = await callClaude(prompt, 1300)
  return parseJSON(raw)
}

// ─── HARDCODED VOICE IDs ─────────────────────────────────────────────────────
const FEMALE_ID = 'g6xIsTj2HwM6VR4iXFCw'
const MALE_ID   = 'UgBBYS2sOqTuMpoF3BR0'

const LANG_CODE = {
  'English': 'en',
  'Spanish': 'es',
  'Portuguese': 'pt',
  'French': 'fr',
  'German': 'de',
  'Italian': 'it',
  'Mandarin Chinese': 'zh',
  'Japanese': 'ja',
  'Arabic': 'ar',
  'Hindi': 'hi',
}

export async function getElevenLabsAudio(text, gender, language) {
  const voiceId = (gender === 'male') ? MALE_ID : FEMALE_ID
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const langCode = LANG_CODE[language] || 'en'

  console.log('[ELEVEN] ─────────────────────────')
  console.log('[ELEVEN] text:', text?.slice(0, 60))
  console.log('[ELEVEN] gender:', gender)
  console.log('[ELEVEN] voiceId:', voiceId)
  console.log('[ELEVEN] language:', language, '→', langCode)
  console.log('[ELEVEN] key:', apiKey ? `present (${apiKey.length} chars)` : 'MISSING ❌')
  console.log('[ELEVEN] ─────────────────────────')

  if (!text || !text.trim()) {
    console.error('[ELEVEN] Empty text — aborting')
    return null
  }

  if (!apiKey || apiKey.length < 10) {
    console.error('[ELEVEN] No API key — add to .env file')
    return null
  }

  let response
  try {
    response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
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
          voice_settings: {
            stability: 0.50,
            similarity_boost: 0.85,
            style: 0.30,
            use_speaker_boost: true,
          },
        }),
      }
    )
  } catch (networkErr) {
    console.error('[ELEVEN] Network error:', networkErr.message)
    return null
  }

  console.log('[ELEVEN] status:', response.status)

  if (!response.ok) {
    let body = ''
    try { body = await response.text() } catch (e) {}
    console.error('[ELEVEN] FAILED:', response.status)
    console.error('[ELEVEN] body:', body)
    if (response.status === 401) console.error('[ELEVEN] → Wrong API key')
    if (response.status === 404) {
      console.error('[ELEVEN] → Voice ID not found in account')
      console.error('[ELEVEN] → female:', FEMALE_ID)
      console.error('[ELEVEN] → male:', MALE_ID)
    }
    if (response.status === 429) console.error('[ELEVEN] → Rate limit hit')
    return null
  }

  let blob
  try {
    blob = await response.blob()
  } catch (blobErr) {
    console.error('[ELEVEN] Blob error:', blobErr.message)
    return null
  }

  if (!blob || blob.size < 100) {
    console.error('[ELEVEN] Empty blob:', blob?.size)
    return null
  }

  console.log('[ELEVEN] ✅ Success:', blob.size, 'bytes')

  try {
    return URL.createObjectURL(blob)
  } catch (urlErr) {
    console.error('[ELEVEN] URL error:', urlErr.message)
    return null
  }
}

export function playAudioUrl(url, textLength) {
  return new Promise((resolve) => {
    if (!url) {
      console.error('[AUDIO] No URL provided')
      resolve()
      return
    }

    console.log('[AUDIO] Creating audio element')
    const audio = new Audio()

    let finished = false
    const finish = (reason) => {
      if (finished) return
      finished = true
      console.log('[AUDIO] Done:', reason)
      try { URL.revokeObjectURL(url) } catch (e) {}
      resolve()
    }

    const maxMs = Math.max((textLength || 60) * 100, 6000)
    const timeout = setTimeout(() => {
      console.warn('[AUDIO] Timeout after', maxMs, 'ms')
      finish('timeout')
    }, maxMs)

    audio.onended = () => { clearTimeout(timeout); finish('ended naturally') }

    audio.onerror = () => {
      clearTimeout(timeout)
      console.error('[AUDIO] Error code:', audio.error?.code, audio.error?.message)
      finish('audio error')
    }

    audio.oncanplaythrough = () => console.log('[AUDIO] Ready to play')

    audio.src = url
    audio.load()

    const playResult = audio.play()
    if (playResult) {
      playResult
        .then(() => console.log('[AUDIO] ✅ Playing'))
        .catch(err => {
          console.error('[AUDIO] play() blocked:', err.name)
          console.error('[AUDIO] Message:', err.message)
          if (err.name === 'NotAllowedError') {
            console.error('[AUDIO] Browser blocked autoplay. User must interact with page first.')
          }
          clearTimeout(timeout)
          finish('play blocked')
        })
    }
  })
}
