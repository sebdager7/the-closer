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

const CLOSER_KB = {
  Elliott:  { tech: ['10-step conviction transfer', 'tie-down questions', 'assumptive close', 'mirror rapport'], pattern: 'Build massive rapport → amplify pain → stack value → close with absolute certainty' },
  Belfort:  { tech: ['Straight Line control', 'certainty looping', 'tonality mastery', 'logical+emotional+urgency stack'], pattern: 'Take control of the line → build certainty on product/you/company → loop objections until bought in' },
  Cardone:  { tech: ['10X close', 'agree-and-overwhelm', 'price stacking', 'never-leave-without-a-deal'], pattern: 'Dominate with energy → agree with everything then reframe → make price irrelevant → never accept first no' },
  Hormozi:  { tech: ['Grand Slam Offer stacking', 'dream outcome framing', 'risk reversal', 'ROI anchoring'], pattern: 'Define dream outcome → stack insane value → crush risk with guarantees → make NOT buying seem stupid' },
  Ziglar:   { tech: ['sincere warmth disarm', 'story selling', 'benefit stacking', 'assumptive questioning'], pattern: 'Disarm with genuine trust → mirror their situation in a story → paint a vivid better future → assume the sale' },
  Robbins:  { tech: ['state elevation', 'values elicitation', 'future pacing', 'pain-pleasure reframe'], pattern: 'Match and lead emotional state → elicit core identity values → future pace into ideal life → make inaction hurt' },
  Voss:     { tech: ['tactical empathy', 'mirroring', 'emotion labeling', 'calibrated how/what questions'], pattern: 'Label their hesitation to defuse it → mirror words back → guide to yes with questions → no pressure close' },
}

export async function generatePitch(product, industry, framework, audience, keywords, language, customBrain = {}) {
  const names = Object.keys(CLOSER_KB)
  const shuffled = [...names].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2))
  const blend = selected.join(' × ')
  const closerDetail = selected.map(n => `${n}: ${CLOSER_KB[n].tech.slice(0, 3).join(', ')}. Pattern: ${CLOSER_KB[n].pattern}.`).join('\n')
  const brainCtx = customBrain.offer ? `\nCustom offer: ${customBrain.offer}. ICP: ${customBrain.icp}.` : ''
  const prompt = `You are an elite pitch writer fusing the exact techniques of: ${blend}.

CLOSER TECHNIQUES TO BLEND:
${closerDetail}

Framework: ${framework} | Product: ${product} | Industry: ${industry} | Audience: ${audience} | Keywords: ${keywords}${brainCtx}
Language: ${language}

Write a 150-250 word pitch that authentically blends these styles. Identify 2-3 POWER MOMENTS — exact lines where a specific closer technique fires at maximum impact.

Return ONLY valid JSON with no markdown:
{"pitch":"full pitch text","hook_score":85,"confidence_score":78,"close_score":82,"feedback":"how the closer blend was applied","strength_tags":["tag1","tag2","tag3"],"closer_blend":"${blend}","technique_used":"primary technique name","power_moments":[{"line":"exact quote from pitch","technique":"closer name + technique","impact":"why this line closes"}]}`
  const raw = await callClaude(prompt, 1700)
  return parseJSON(raw)
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

STEP 2 — REBUILD using ${framework} patterns. Inject real closer power. Language: ${language}.

Original pitch: "${existingPitch}"
Industry: ${industry}

Return ONLY valid JSON with no markdown:
{"pitch":"completely rebuilt 150-250 word pitch","hook_score":90,"confidence_score":85,"close_score":88,"feedback":"what framework was applied and how","strength_tags":["tag1","tag2","tag3"],"framework_applied":"${framework}","what_was_wrong":["specific weakness 1","specific weakness 2","specific weakness 3"],"what_was_fixed":["exactly how fix 1 was applied","exactly how fix 2","exactly how fix 3"],"power_moments":[{"line":"exact quote from rebuilt pitch","technique":"specific technique","impact":"why this now works"}]}`
  const raw = await callClaude(prompt, 1700)
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
