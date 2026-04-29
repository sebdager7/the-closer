const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export async function callClaude(prompt, maxTokens = 1200) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
},
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await response.json()
  return data.content.map(c => c.text || '').join('')
}

export async function callClaudeConversation(messages, maxTokens = 200) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
},
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages }),
  })
  const data = await response.json()
  return data.content.map(c => c.text || '').join('')
}

export function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

export async function getRebuttal(objection, industry, language, customBrain = {}) {
  const brainCtx = customBrain.offer
    ? `Company context: ${customBrain.offer}. ICP: ${customBrain.icp}.`
    : ''
  const prompt = `Elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone. Industry: "${industry}". Objection: "${objection}". ${brainCtx} Language: ${language}. Return ONLY valid JSON: {"soft":{"script":"Andy Elliott empathize-then-close rebuttal","tone":"warm but certain","closer":"Andy Elliott — Soft Close","followup":"follow-up line"},"direct":{"script":"Jordan Belfort direct confident rebuttal","tone":"certain and belief-driven","closer":"Jordan Belfort — Direct","followup":"follow-up line"},"aggressive":{"script":"Grant Cardone bold aggressive rebuttal","tone":"high energy and bold","closer":"Grant Cardone — Aggressive","followup":"follow-up line"}}`
  const raw = await callClaude(prompt)
  return parseJSON(raw)
}

export async function generatePitch(product, industry, framework, audience, keywords, language, customBrain = {}) {
  const brainCtx = customBrain.offer
    ? `\nCustom offer: ${customBrain.offer}. ICP: ${customBrain.icp}.`
    : ''
  const prompt = `Elite pitch writer using the ${framework} framework. Product: ${product}. Industry: ${industry}. Audience: ${audience}. Keywords: ${keywords}. ${brainCtx} Language: ${language}. Apply REAL ${framework} patterns. Return ONLY valid JSON: {"pitch":"150-250 word pitch","hook_score":85,"confidence_score":78,"close_score":82,"feedback":"how ${framework} was applied","strength_tags":["Elliott Hook","Belfort Certainty","Cardone Close"]}`
  const raw = await callClaude(prompt, 1400)
  return parseJSON(raw)
}

export async function improvePitch(existingPitch, industry, framework, language) {
  const prompt = `Rebuild this pitch using ${framework} patterns: "${existingPitch}". Industry: ${industry}. Language: ${language}. Inject real closer power. Return ONLY valid JSON: {"pitch":"rebuilt pitch","hook_score":88,"confidence_score":82,"close_score":79,"feedback":"what was wrong and how ${framework} fixed it","strength_tags":["tag1","tag2"]}`
  const raw = await callClaude(prompt, 1400)
  return parseJSON(raw)
}

export async function getBrutalFeedback(userText) {
  const prompt = `Brutal sales coach Andy Elliott style. Find the biggest mistake in: "${userText}". 1-2 sentence brutal callout with the elite version. Start with "BLITZ:".`
  return callClaude(prompt, 110)
}

export async function getReframes(objection, language) {
  const prompt = `Sales coach. Prospect said: "${objection}". 3 elite reframes — Elliott (empathy+certainty), Belfort (logical certainty), Cardone (bold). Under 2 sentences each. Language: ${language}. Return ONLY JSON: {"r1":"Elliott reframe","r2":"Belfort reframe","r3":"Cardone reframe"}`
  const raw = await callClaude(prompt, 380)
  return parseJSON(raw)
}

export async function generateProspectProfile(industry, difficulty) {
  const prompt = `Generate a realistic sales prospect for a ${industry} cold call. Difficulty: ${difficulty}. Return ONLY valid JSON with no markdown or extra text:
{"name":"Full Name","age":42,"occupation":"specific job title","location":"City, State","personality":"2-sentence personality description","mood_today":"brief current mood affecting how they answer","main_objection":"their most likely specific objection","trigger_to_buy":"what would make them say yes","speech_pattern":"how they talk — pace, formality, verbal habits","backstory":"2-sentence personal context","opening_line":"exactly how they answer this unexpected call"}`
  const raw = await callClaude(prompt, 500)
  return parseJSON(raw)
}

export async function runAutopsy(transcript, closePct, dealValue) {
  const prompt = `You are Blitz, elite sales coach trained on Andy Elliott, Jordan Belfort, Grant Cardone. Analyze this call:\n${transcript}\n\nClose probability: ${closePct}%. Deal value: $${dealValue}.\n\nReturn ONLY valid JSON:\n{"result":"${closePct >= 70 ? 'Close' : 'No Close'}","score":${closePct},"close_probability":${closePct},"potential_value":${dealValue},"value_lost":${closePct < 70 ? dealValue : 0},"overall_feedback":"2-3 sentence Blitz coaching referencing Elliott/Belfort/Cardone","key_moments":[{"time":"0:45","type":"bad","what_said":"weak moment","better_version":"elite script"},{"time":"1:20","type":"good","what_said":"what they did right","build_on":"how to amplify"},{"time":"2:10","type":"bad","what_said":"another weak moment","better_version":"elite version"}],"biggest_mistake":"#1 thing that hurt this call","top_strength":"what they did well","blitz_coaching":"one line from Blitz referencing a real closer"}`
  const raw = await callClaude(prompt, 1300)
  return parseJSON(raw)
}
