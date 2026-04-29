const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export async function callClaude(prompt, maxTokens = 1200) {
  console.log('[callClaude] maxTokens:', maxTokens, '| prompt length:', prompt.length)
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
  console.log('[callClaude] response status:', response.status, '| has content:', !!data.content)
  const text = data.content?.[0]?.text || ''
  if (!text) throw new Error(data.error?.message || `API error ${response.status}: ${JSON.stringify(data).slice(0, 200)}`)
  return text
}

export async function callClaudeConversation(messages, maxTokens = 200) {
  console.log('[callClaudeConversation] msgs:', messages.length, '| maxTokens:', maxTokens)
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
  console.log('[callClaudeConversation] status:', response.status, '| has content:', !!data.content)
  const text = data.content?.[0]?.text || ''
  if (!text) throw new Error(data.error?.message || `API error ${response.status}: ${JSON.stringify(data).slice(0, 200)}`)
  return text
}

export function parseJSON(text) {
  const cleaned = text.replace(/```json\n?|```/g, '').trim()
  // Extract the JSON object even if the model wraps it in explanatory text
  const match = cleaned.match(/\{[\s\S]*\}/)
  return JSON.parse(match ? match[0] : cleaned)
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

const FRAMEWORK_DETAIL = {
  'Andy Elliott 10-Step': `Andy Elliott 10-Step: (1) EXPLOSIVE pattern-interrupt opener — something they've never heard, stops them cold. (2) Sincere explosive rapport — genuine personal connection in 10 seconds. (3) Pain discovery — "What's the biggest frustration you have right now with X?" (4) Amplify pain — make staying the same cost more emotionally than changing. (5) Credibility stack — one specific client result story with a number. (6) Bridge to dream outcome. (7) Assumptive present-tense pitch — talk as if they already own it. (8) Tie-down questions after every benefit — "makes sense, right?" / "you'd agree that...?" (9) Pre-close — "If I could solve X for you today, what would stop you from moving forward?" (10) Hard assumptive close — "So when do we get started?" — no question mark energy.`,
  'Belfort Straight Line': `Jordan Belfort Straight Line: Open with certainty — zero stumble, zero hesitation, own the call in 4 seconds. Gather intel fast with sharp targeted questions. Build the THREE certainties in order: (1) Product is the best solution for their problem, (2) You personally are an expert they can trust, (3) Your company is solid and will deliver. Loop any objection back into certainty — never get knocked off the line. Use loaded tonality throughout: enthusiastic but never pushy. Signature pattern: "I know you're probably a bit skeptical — and that's exactly why I want to show you..."`,
  'Cardone Tonality': `Grant Cardone: Agree with EVERYTHING, then overwhelm with stacked value. Never reduce price — always add more. 10X energy from word one — match their energy and then raise it. Price stack: "It's not $X — it's $X that gives you A, B, C, D, and E." After every objection: "You're absolutely right — and here's exactly WHY that's the reason most people in your situation end up..." Never accept the first no — treat it as a request for more information. Make inaction feel like the real financial risk.`,
  'Ziglar Story-Close': `Zig Ziglar Story-Close: Genuine warmth and interest in THEM first — they must feel truly seen. Build real trust through sincere curiosity. Tell a specific client story: someone who had their exact same hesitation, almost said no, and ended up grateful they moved forward. Future-pace vividly with sensory detail: "Picture yourself 90 days from now..." Assume the sale with quiet unshakeable confidence: "So when would work best to get you started?" — zero pressure, total certainty.`,
  'Hormozi Value Stack': `Alex Hormozi Grand Slam Offer: Lead with DREAM OUTCOME, not product features. Stack every benefit as a separate line-item value. Anchor each item with a dollar figure. Then reverse the risk completely with a guarantee that makes saying no feel stupid. ROI anchor: "What would it honestly be worth to you if we could get you [specific outcome] in [timeframe]?" Make NOT buying feel like the irrational, expensive choice.`,
  'Problem/Agitate/Solve': `Problem/Agitate/Solve: Open by naming their exact problem so precisely they feel you read their mind — specificity creates instant trust. Agitate: paint the full cost of staying stuck — time lost, money left on the table, stress compounding, regret building. Then solve: present your solution as the only logical escape from that trap. Close before they can overthink it — momentum is everything.`,
}

export async function generatePitch(product, industry, framework, audience, keywords, language, customBrain = {}) {
  const names = Object.keys(CLOSER_KB)
  const shuffled = [...names].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2))
  const closerDetail = selected.map(n => {
    const kb = CLOSER_KB[n]
    return `${n}:\n  Techniques: ${kb.tech.join(', ')}\n  Pattern: ${kb.pattern}`
  }).join('\n\n')
  const brainCtx = customBrain.offer ? `\nCustom offer context: ${customBrain.offer}. Target ICP: ${customBrain.icp}.` : ''
  const fwDetail = FRAMEWORK_DETAIL[framework] || `Apply ${framework} principles throughout.`

  const prompt = `You are the world's most elite pitch writer, trained on the exact systems of ${selected.join(', ')}.

PRIMARY FRAMEWORK: ${framework}
${fwDetail}

CLOSER BLEND TO WEAVE THROUGHOUT:
${closerDetail}

PITCH SPECS:
- Product/service: ${product}
- Industry: ${industry}
- Audience: ${audience || 'prospects'}
- Power keywords to include: ${keywords || 'value, results, now'}${brainCtx}
- Language: ${language}

MANDATORY REQUIREMENTS:
1. Open with a PATTERN INTERRUPT — an unexpected question or bold statement that stops them cold, not "Hi, how are you"
2. Include pain amplification — the emotional cost of NOT acting, not just product features
3. Use an ASSUMPTIVE close — treat yes as the natural inevitable outcome
4. Include at least 2 tie-down moments ("...makes sense, right?" / "you'd agree that..." style)
5. EXACTLY 180-250 words — count carefully
6. Sound like a real elite human salesperson speaking live, not a marketing script

Identify exactly 3 POWER MOMENT lines from your pitch where a specific closer technique fires at maximum impact — copy the exact line from the pitch.

Return ONLY valid JSON, no markdown, no extra text, starting with {:
{"pitch":"complete pitch text 180-250 words","hook_score":number 1-100,"confidence_score":number 1-100,"close_score":number 1-100,"feedback":"specific explanation of how each closer's techniques appear in this exact pitch","strength_tags":["tag1","tag2","tag3"],"closer_blend":["${selected.join('","')}"],"technique_used":"name of the single most dominant technique in this pitch","power_moments":["exact line from pitch showing closer technique 1","exact line showing technique 2","exact line showing technique 3"]}`

  console.log('[generatePitch] product:', product, '| blend:', selected.join(' × '))
  const raw = await callClaude(prompt, 1900)
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

STEP 2 — REBUILD using ${framework} patterns. Inject real closer power. Language: ${language}.

Original pitch: "${existingPitch}"
Industry: ${industry}

Return ONLY valid JSON with no markdown, starting with {:
{"pitch":"completely rebuilt 180-250 word pitch","hook_score":number,"confidence_score":number,"close_score":number,"feedback":"what framework was applied and how","strength_tags":["tag1","tag2","tag3"],"framework_applied":"${framework}","what_was_wrong":["specific weakness 1","specific weakness 2","specific weakness 3"],"what_was_fixed":["exactly how fix 1 was applied","exactly how fix 2","exactly how fix 3"],"power_moments":["exact quote from rebuilt pitch showing elite technique 1","exact quote showing technique 2","exact quote showing technique 3"]}`
  console.log('[improvePitch] framework:', framework, '| industry:', industry)
  const raw = await callClaude(prompt, 1900)
  const result = parseJSON(raw)
  if (!Array.isArray(result.power_moments)) result.power_moments = []
  result.power_moments = result.power_moments.map(pm => typeof pm === 'string' ? pm : pm.line || JSON.stringify(pm))
  return result
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
