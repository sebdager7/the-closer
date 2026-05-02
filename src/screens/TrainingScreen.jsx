import React, { useState, useRef, useEffect } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { callClaudeConversation, getBrutalFeedback, getReframes, generateProspectProfile, elevenLabsSpeak, playElevenLabsAudio } from '../utils/api'
import { TRAINING_MODES, DIFFICULTY_MAP, INDUSTRIES, PROSPECTS, PROSPECT_NAMES } from '../data/constants'
import { vibrateBlitz, zapSound } from '../utils/blitz'
import { TrophyEmoji, LightningEmoji } from '../components/icons/CustomEmoji'

// ─── PROSPECT PREVIEW ─────────────────────────────────────────────────────────
function ProspectPreview({ profile, onStart }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 bg-navy-950">
      <div className="text-center mb-5 pt-2">
        <p className="text-[10px] font-bubble text-gold-400 uppercase tracking-widest mb-3">
          📋 Know Your Prospect
        </p>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
          style={{ background: profile.gender === 'male' ? '#1a6bbf' : '#8b5cf6' }}>
          {profile.name?.charAt(0) || '?'}
        </div>
        <h2 className="text-xl font-bubble text-white">{profile.name}</h2>
        <p className="text-sm text-white/60">{profile.age} · {profile.occupation}</p>
        <p className="text-xs text-white/40">{profile.location || ''}</p>
      </div>
      <div className="w-full bg-navy-800/70 border border-white/10 rounded-2xl p-4 space-y-3 max-w-xs mx-auto">
        <div>
          <div className="text-[8px] font-bubble text-gold-400 uppercase tracking-wider mb-1">Today's mood</div>
          <p className="text-xs text-white/80 leading-relaxed">{profile.mood_today || profile.mood}</p>
        </div>
        <div>
          <div className="text-[8px] font-bubble text-white/40 uppercase tracking-wider mb-1">Personality</div>
          <p className="text-[11px] text-white/60 leading-relaxed">{profile.personality}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            <div className="text-[8px] font-bubble text-red-400 uppercase tracking-wider mb-1">Will object to</div>
            <p className="text-[10px] text-red-300/80 leading-tight">{profile.main_objection}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
            <div className="text-[8px] font-bubble text-green-400 uppercase tracking-wider mb-1">Will buy if</div>
            <p className="text-[10px] text-green-300/80 leading-tight">{profile.trigger_to_buy}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-2">
          <div className="text-[8px] font-bubble text-closer-blue uppercase tracking-wider mb-1">Speech pattern</div>
          <p className="text-[10px] text-white/60 italic">"{profile.speech_pattern || profile.speech}"</p>
        </div>
      </div>
      <div className="max-w-xs mx-auto w-full mt-5">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-[#1a6bbf] to-[#1557a0] text-white tracking-wide shadow-lg shadow-closer-blue/30 hover:shadow-xl hover:shadow-closer-blue/40 active:scale-[0.98] transition-all duration-200 border border-closer-blue/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
          <div className="flex items-center justify-center gap-3 relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Start Call</span>
          </div>
        </button>
      </div>
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INDUSTRY_OBJECTIONS = {
  'Solar': [
    "I rent this house so I can't install anything",
    "My neighbor got solar and had nothing but problems",
    "I just locked in a new rate with my electric company",
    "I don't plan on staying here long enough to see the savings",
    "I've heard the real savings never add up like they promise",
  ],
  'Life Insurance': [
    "I already have coverage through my employer",
    "My wife handles all finances — I'd have to run it by her first",
    "I'm young and healthy, I don't think I need it yet",
    "The last time I looked the premiums were way too high",
    "Honestly I don't trust insurance companies to actually pay out",
  ],
  'Door-to-Door': [
    "I never buy from people who knock on my door, that's a firm rule",
    "I need to research this myself online before any decision",
    "I bought something similar about six months ago",
    "Can you just leave some information and I'll look at it later",
    "I'm really just not interested today",
  ],
  'Car Sales': [
    "I'm just browsing, not ready to make any decisions today",
    "I need to bring my husband before I commit to anything",
    "I want to check two or three other dealerships first",
    "That monthly payment is honestly over my budget",
    "I'm going to wait and see what the new models look like",
  ],
  'Real Estate': [
    "The market is too unpredictable right now",
    "I need to sell my current place before I can buy",
    "I'm waiting for rates to come back down",
    "My credit took a hit last year, I need to fix that first",
    "I'm still not sure this neighborhood is right for us",
  ],
  'B2B / SaaS': [
    "We already have a solution in place that's working fine",
    "Our budget is locked for the rest of this fiscal year",
    "I'd need sign-off from IT and that takes months",
    "We tried something like this two years ago and it failed",
    "Send me some information and I'll look when I have bandwidth",
  ],
  'Financial Services': [
    "I already have a financial advisor and I'm happy with them",
    "I don't make financial decisions without my accountant",
    "I've been burned before and not looking to make changes",
    "My portfolio is fine, I'm not looking to touch anything",
    "What's your fee structure? The last guy nickel-and-dimed me",
  ],
}

const REAL_BUYER_PATTERNS = {
  skeptical_homeowner: {
    resistance: ["Yeah I've heard this before", "What's the catch", "I don't make decisions like this at the door"],
    warming: ["Okay what kind of savings are we talking", "And there's no upfront cost you said"],
    buying: ["Alright look what do I need to sign", "Yeah let's just get it done"],
  },
  busy_business_owner: {
    resistance: ["I've got two minutes, what do you need", "We already have something in place for that", "Send me an email"],
    warming: ["What kind of results are other companies seeing", "How long to implement"],
    buying: ["Okay put together a proposal", "Alright let's see the numbers"],
  },
  price_sensitive: {
    resistance: ["That's way out of our budget", "We found something cheaper that does the same thing"],
    warming: ["So what exactly is included in that price", "Is there a payment plan"],
    buying: ["If you can do that price we have a deal", "Alright that's fair let's go"],
  },
  friendly_but_hesitant: {
    resistance: ["It sounds interesting but I don't know", "I'd love to but it's just not a great time"],
    warming: ["Oh wow that's actually really good", "That makes me feel a lot better about it"],
    buying: ["You know what just sign me up", "Alright you've convinced me"],
  },
}

const MOOD_MAP = [
  { pattern: /take me off your list|never call me again|don't ever call|stop bothering me/i, emoji: '😡' },
  { pattern: /annoyed|frustrated|gotta go|got to go|busy right now|waste.*time/i, emoji: '😤' },
  { pattern: /not sure|expensive|think about|budget|spouse|not ready|maybe later/i, emoji: '🤨' },
  { pattern: /hmm|interesting|tell me more|how does|could be|possibly|not bad/i, emoji: '🤔' },
  { pattern: /sounds good|i like|makes sense|could work|sure|okay.*give/i, emoji: '😊' },
  { pattern: /let's do|i'll take|sign me up|ready|how do we|yes.*deal|alright.*let|okay.*let|you've made|good case/i, emoji: '🤑' },
]

function analyzeMood(text) {
  for (const { pattern, emoji } of MOOD_MAP) {
    if (pattern.test(text)) return emoji
  }
  return '😐'
}

// ─── STANDALONE HELPERS ────────────────────────────────────────────────────────

const cleanAIResponse = (text) => {
  if (!text) return ''
  let clean = text
  clean = clean.replace(/\*[^*]{1,60}\*/g, '')
  clean = clean.replace(/\[[^\]]{1,60}\]/g, '')
  clean = clean.replace(
    /\((sighs?|pauses?|laughs?|chuckles?|hesitates?|clears? throat|thinks?|speaks? \w+ly)[^)]{0,40}\)/gi, ''
  )
  clean = clean.replace(
    /^(pauses?|sighs?|laughs?|chuckles?|clears? throat|takes? a \w+)[,.]?\s*/gi, ''
  )
  clean = clean.replace(
    /(speaks? (slowly|quickly|quietly|firmly)|in a \w+ tone|with a \w+ voice)[,.]?\s*/gi, ''
  )
  clean = clean.replace(/\s{2,}/g, ' ').trim()
  if (!clean || clean.length < 2) return 'Yeah?'
  return clean
}

const buildSystemPrompt = (profile, industry, difficulty, language, mode, persona, customBrain) => {
  const levels = {
    'Beginner': `Start skeptical but warm up after 3-4 solid rep responses. Buy around exchange 5-6.`,
    'Beginner+': `Cautious but fair. Need 2 objections handled properly. Buy after 7-8 solid exchanges.`,
    'Intermediate': `Real skeptic. Test them. Push back on price, timing, and need. Need specific answers not fluff. Buy after 9-10 great exchanges.`,
    'Advanced': `Tough and experienced. You have heard every pitch before. Call out vague or scripted lines. Only 11-13 genuinely compelling exchanges wins you.`,
    'Elite Closer': `Hardest prospect alive. You know exactly what sales tricks sound like. Every cliche gets called out immediately. Only 14+ exchanges of genuine connection wins you.`,
  }

  const pKey = (() => {
    const str = (persona + ' ' + industry).toLowerCase()
    if (str.includes('b2b') || str.includes('saas') || str.includes('business') || str.includes('executive')) return 'busy_business_owner'
    if (str.includes('solar') || str.includes('insurance') || str.includes('financial') || str.includes('price')) return 'price_sensitive'
    if (str.includes('friendly') || str.includes('hesitant') || str.includes('car') || str.includes('auto')) return 'friendly_but_hesitant'
    return 'skeptical_homeowner'
  })()
  const patterns = REAL_BUYER_PATTERNS[pKey] || REAL_BUYER_PATTERNS.skeptical_homeowner

  const modeExtras = {
    bru: '\nBRUTAL MODE: Be extremely skeptical. Call out every weak or vague word immediately.',
    one: '\nONE SHOT MODE: Highly resistant. If they blow the opening you shut it down fast.',
    std: '', rfm: '',
  }

  const brainCtx = customBrain?.offer
    ? `\nThe rep sells: ${customBrain.offer}. Their ideal customer: ${customBrain.icp}.`
    : ''

  return `MANDATORY LANGUAGE RULE — READ THIS FIRST:
You must speak ONLY in ${language} for this entire call.
Every single word you say must be in ${language}.
Never switch to English unless ${language} is English.
If ${language} is Spanish — speak only Spanish.
If ${language} is French — speak only French.
If ${language} is Portuguese — speak only Portuguese.
This is the most important instruction in this entire prompt.

You are ${profile.name}, ${profile.age} years old.
Job: ${profile.occupation}
Mood today: ${profile.mood_today || profile.mood || 'neutral'}
How you talk: ${profile.speech_pattern || profile.speech || 'conversational'}
Your main resistance: ${profile.main_objection}
What would make you buy: ${profile.trigger_to_buy}
${profile.backstory ? 'Backstory: ' + profile.backstory : ''}${brainCtx}${modeExtras[mode] || ''}

${levels[difficulty] || levels['Intermediate']}

You are receiving an unexpected phone call about ${industry}.

RULES — never break these:
- You are a REAL HUMAN. Never admit you are AI.
- Maximum 2 sentences per response. Real phone call pace.
- NEVER write *pauses* or (sighs) or [thinking] — ever.
- NEVER describe your emotions or actions. Only say what you say out loud.
- Natural filler when it fits: "Uh", "I mean", "Look", "Yeah", "Right", "Hmm"
- React to EXACTLY what they just said — not a generic response.
- Remember everything said in this conversation.
- Never repeat an objection you already accepted an answer to.
- Your resistance shifts based on rep quality:
  Vague or pushy = stay skeptical or get shorter
  Specific with real proof = warm up one level
  Handles your exact objection = warm up more
  Great sustained conversation = start asking buying questions
  All concerns addressed = say yes like a real person says yes
- YES sounds like: "Alright fine how do we do this" or "Okay you got me what do I need to do" or "Yeah alright let's just do it"
- WRONG: "I appreciate your compelling pitch and I am now convinced"
- RIGHT: "Okay yeah, let's do it"
- Keep the conversation going naturally.
- Ask follow-up questions when curious.
- Give specific objections not generic ones.

Real phrases for your personality:
Resistance: ${patterns.resistance.join(' | ')}
Warming: ${patterns.warming.join(' | ')}
Ready to buy: ${patterns.buying.join(' | ')}

Your opening line when you answer: "${profile.opening_line}"

FINAL REMINDER — MOST IMPORTANT RULE:
Speak ONLY in ${language}. Every single word must be in ${language}.`
}

const analyzeUserTone = (text) => {
  const t = text.toLowerCase()
  const wordCount = t.split(' ').length
  let score = 50
  if (t.includes('i know') || t.includes('guaranteed') || t.includes('proven') || t.includes('results')) score += 12
  if (t.includes('imagine') || t.includes('picture this') || t.includes('what if')) score += 8
  if (t.includes('most people') || t.includes('our clients') || t.includes('last month')) score += 10
  if (/\$[\d,]+|\d+%|\d+ (days|weeks|months|years)/.test(t)) score += 10
  if (t.includes('when we') || t.includes('once you') || t.includes('when you start')) score += 8
  if (t.includes('um ') || t.includes('uh ') || t.includes('like uh') || t.includes('you know')) score -= 8
  if (t.includes('maybe') || t.includes('might') || t.includes('i think') || t.includes('probably')) score -= 10
  if (wordCount < 5) score -= 5
  if (wordCount > 60) score -= 8
  return Math.max(10, Math.min(90, score))
}

// ─── CALL SCREEN ──────────────────────────────────────────────────────────────
function CallScreen({ mode, industry, persona, difficulty, dealValue, language, customBrain, onEnd }) {
  const { dispatch } = useApp()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [secs, setSecs] = useState(0)
  const [closePct, setClosePct] = useState(30)
  const [moodEmoji, setMoodEmoji] = useState('😐')
  const [oneShotSecs, setOneShotSecs] = useState(90)
  const [reframeOpen, setReframeOpen] = useState(false)
  const [reframeLoading, setReframeLoading] = useState(false)
  const [reframes, setReframes] = useState(null)
  const [lastObjection, setLastObjection] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [prospectProfile, setProspectProfile] = useState(null)
  const [showPreview, setShowPreview] = useState(true)
  const [generatingProfile, setGeneratingProfile] = useState(true)
  const [callConnected, setCallConnected] = useState(false)
  const [lastBotText, setLastBotText] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [resultsData, setResultsData] = useState(null)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [voicesReady, setVoicesReady] = useState(false)

  const chatRef = useRef([])
  const systemPromptRef = useRef(null)
  const timerRef = useRef(null)
  const oneshotRef = useRef(null)
  const muteRef = useRef(false)
  const isSpeakingRef = useRef(false)
  const isListeningRef = useRef(false)
  const isProcessingRef = useRef(false)
  const callActiveRef = useRef(false)
  const voicesRef = useRef([])
  const audioCtxRef = useRef(null)
  const staticRef = useRef(null)
  const profileRef = useRef(null)
  const recognitionRef = useRef(null)
  const voicePersonalityRef = useRef(null)
  const exchangeCountRef = useRef(0)
  const closePctRef = useRef(30)
  const callMsgRef = useRef([])
  const secsRef = useRef(0)
  const audioRef = useRef(null)

  // ── Phone static ──────────────────────────────────────────────
  const startPhoneStatic = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.006
      const src = ctx.createBufferSource()
      src.buffer = buf; src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'; filter.frequency.value = 2200; filter.Q.value = 0.8
      const gain = ctx.createGain(); gain.gain.value = 0.012
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      src.start()
      staticRef.current = src
    } catch (e) {}
  }

  const stopPhoneStatic = () => {
    try { staticRef.current?.stop() } catch (e) {}
    try { audioCtxRef.current?.close() } catch (e) {}
  }

  // ── Voice loading ─────────────────────────────────────────────
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) {
        voicesRef.current = v
        setVoicesReady(true)
        const en = v.filter(x => x.lang.startsWith('en'))
        console.log('[VOICE] Loaded', v.length, 'voices. English:', en.map(x => x.name).join(', '))
      }
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    setTimeout(load, 500)
    setTimeout(load, 1500)
    return () => { window.speechSynthesis.cancel() }
  }, [])

  // ── Sync secs to ref ──────────────────────────────────────────
  useEffect(() => { secsRef.current = secs }, [secs])

  // ── Browser check ─────────────────────────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) alert('Voice training requires Chrome or Safari. Please open in Google Chrome.')
    else console.log('[VOICE] Browser: SpeechRecognition ✓ speechSynthesis ✓')
  }, [])

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      console.log('[CALL] Cleanup on unmount')
      callActiveRef.current = false
      window.speechSynthesis.cancel()
      if (audioRef.current) {
        try { audioRef.current.pause() } catch (e) {}
        audioRef.current = null
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
      }
      clearInterval(timerRef.current)
      clearInterval(oneshotRef.current)
      stopPhoneStatic()
    }
  }, [])

  // ── Voice helpers ─────────────────────────────────────────────
  const generateVoicePersonality = (gender) => {
    if (gender === 'male') {
      return { baseRate: 0.84 + Math.random() * 0.1, basePitch: 0.88 + Math.random() * 0.1 }
    }
    return { baseRate: 0.90 + Math.random() * 0.1, basePitch: 1.04 + Math.random() * 0.14 }
  }

  const getBestBrowserVoice = (gender = 'female') => {
    const fresh = window.speechSynthesis.getVoices()
    const voices = [...voicesRef.current, ...fresh].filter(
      (v, i, arr) => arr.findIndex(x => x.name === v.name) === i
    )
    if (!voices.length) return null

    const femaleNames = [
      'Google US English', 'Microsoft Aria Online (Natural)', 'Microsoft Jenny Online (Natural)',
      'Samantha (Enhanced)', 'Samantha', 'Karen (Enhanced)', 'Karen',
      'Nicky (Enhanced)', 'Nicky', 'Allison (Enhanced)', 'Allison',
      'Ava (Enhanced)', 'Ava', 'Moira', 'Tessa',
    ]
    const maleNames = [
      'Google UK English Male', 'Microsoft Guy Online (Natural)', 'Microsoft Davis Online (Natural)',
      'Daniel (Enhanced)', 'Daniel', 'Alex (Enhanced)', 'Alex',
      'Aaron (Enhanced)', 'Aaron', 'Tom (Enhanced)', 'Tom', 'Oliver (Enhanced)', 'Oliver', 'Gordon',
    ]

    const list = gender === 'male' ? maleNames : femaleNames
    for (const name of list) {
      const v = voices.find(x => x.name === name || x.name.toLowerCase().startsWith(name.toLowerCase().split(' ')[0]))
      if (v) { console.log('[BROWSER TTS] Using:', v.name); return v }
    }
    return voices.find(v =>
      v.lang.startsWith('en') &&
      !v.name.match(/Zarvox|Trinoids|Cellos|Pipe|Whisper|Zira|David|Mark|Kyoko|Amelie|Bahh|Bells|Boing|Junior|Kathy|Organ|Princess|Ralph/i)
    ) || voices[0] || null
  }

  // ── Browser TTS fallback ──────────────────────────────────────
  const fallbackBrowserTTS = (text, gender) => {
    return new Promise((resolve) => {
      const processed = text
        .replace(/\. ([A-Z])/g, '.  $1')
        .replace(/Well, /gi, 'Well... ')
        .replace(/Look, /gi, 'Look... ')
        .replace(/Yeah, /gi, 'Yeah... ')
        .replace(/I mean, /gi, 'I mean... ')
        .replace(/Hmm/gi, 'Hmm...')

      const utter = new SpeechSynthesisUtterance(processed)
      const voice = getBestBrowserVoice(gender)
      if (voice) utter.voice = voice

      utter.rate = gender === 'male' ? 0.85 + Math.random() * 0.06 : 0.88 + Math.random() * 0.08
      utter.pitch = gender === 'male' ? 0.86 + Math.random() * 0.08 : 1.02 + Math.random() * 0.1
      utter.volume = 1.0

      let done = false
      const finish = () => { if (done) return; done = true; resolve() }

      const maxMs = Math.max(text.length * 75, 4000)
      const safety = setTimeout(finish, maxMs)

      const keep = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause()
          window.speechSynthesis.resume()
        } else {
          clearInterval(keep)
        }
      }, 8000)

      utter.onend = () => { clearTimeout(safety); clearInterval(keep); finish() }
      utter.onerror = () => { clearTimeout(safety); clearInterval(keep); finish() }

      window.speechSynthesis.speak(utter)
    })
  }

  // ── speakText ─────────────────────────────────────────────────
  const speakText = async (text, gender = 'female', lang = language) => {
    console.log('[SPEAK] ====== SPEAK CALLED ======')
    console.log('[SPEAK] Gender:', gender, '| Language:', lang)
    console.log('[SPEAK] Text:', text?.slice(0, 60))
    console.log('[SPEAK] Muted:', muteRef.current)

    if (!text?.trim()) {
      console.log('[SPEAK] Empty — skipping')
      isSpeakingRef.current = false
      setIsSpeaking(false)
      return
    }

    if (muteRef.current) {
      console.log('[SPEAK] Muted — skipping')
      isSpeakingRef.current = false
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    if (audioRef.current) {
      try { audioRef.current.pause() } catch (e) {}
      audioRef.current = null
    }

    isSpeakingRef.current = true
    setIsSpeaking(true)

    try {
      const audioUrl = await elevenLabsSpeak(text, gender, lang)
      if (audioUrl) {
        await playElevenLabsAudio(audioUrl, text.length)
        console.log('[SPEAK] ElevenLabs done ✅')
      } else {
        console.error('[SPEAK] ❌ ElevenLabs failed — using browser fallback')
        await fallbackBrowserTTS(text, gender)
      }
    } catch (err) {
      console.error('[SPEAK] Unexpected error:', err)
      try { await fallbackBrowserTTS(text, gender) } catch (e) {}
    } finally {
      isSpeakingRef.current = false
      setIsSpeaking(false)
    }
  }

  // ── Mic permission ────────────────────────────────────────────
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
      return true
    } catch (err) {
      console.error('[MIC] Permission denied:', err)
      alert(
        'Microphone access is required for voice training.\n\n' +
        'On iPhone: Settings → Safari → Microphone → Allow\n' +
        'On Chrome: Click the camera icon in the address bar → Allow'
      )
      return false
    }
  }

  // ── Speech recognition ────────────────────────────────────────
  const startListening = () => {
    console.log('[MIC] startListening called')
    console.log('[MIC] speaking:', isSpeakingRef.current, 'listening:', isListeningRef.current, 'processing:', isProcessingRef.current)

    if (isSpeakingRef.current) { console.log('[MIC] BLOCKED — AI speaking'); return }
    if (isListeningRef.current) { console.log('[MIC] Already listening'); return }
    if (isProcessingRef.current) { console.log('[MIC] BLOCKED — processing response'); return }
    if (!callActiveRef.current) { console.log('[MIC] Call not active'); return }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.abort()
      } catch (e) {}
      recognitionRef.current = null
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice needs Chrome or Safari.'); return }

    const r = new SR()
    r.continuous = false
    r.interimResults = true
    r.lang = 'en-US'
    r.maxAlternatives = 1

    r.onstart = () => {
      console.log('[MIC] ✅ Listening')
      isListeningRef.current = true
      setIsListening(true)
      setTranscript('')
    }

    r.onspeechstart = () => { console.log('[MIC] Speech detected') }

    r.onresult = (event) => {
      let interim = '', final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      const current = final || interim
      setTranscript(current)

      if (final.trim()) {
        console.log('[MIC] ✅ Final:', final)
        isListeningRef.current = false
        setIsListening(false)
        setTranscript('')
        try { r.stop() } catch (e) {}
        setTimeout(() => handleVoiceInput(final.trim()), 80)
      }
    }

    r.onerror = (event) => {
      console.error('[MIC] Error:', event.error)
      isListeningRef.current = false
      setIsListening(false)

      if (event.error === 'not-allowed') {
        alert('Microphone blocked.\n\niPhone: Settings > Safari > Microphone > Allow\nChrome: Click lock icon > Microphone > Allow\n\nReload after allowing.')
        return
      }

      if (
        event.error === 'no-speech' ||
        event.error === 'network' ||
        event.error === 'aborted'
      ) {
        if (callActiveRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
          setTimeout(() => startListening(), 800)
        }
      }
    }

    r.onend = () => {
      console.log('[MIC] Ended')
      isListeningRef.current = false
      setIsListening(false)
    }

    recognitionRef.current = r

    setTimeout(() => {
      if (!callActiveRef.current) return
      try {
        r.start()
        console.log('[MIC] r.start() called')
      } catch (err) {
        console.error('[MIC] start() failed:', err.name)
        isListeningRef.current = false
        setIsListening(false)
        if (err.name === 'InvalidStateError') {
          setTimeout(() => startListening(), 600)
        }
      }
    }, 100)
  }

  const stopListening = () => {
    console.log('[MIC] Stopping')
    isListeningRef.current = false
    setIsListening(false)
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
    }
  }

  // ── Close / hangup detection ──────────────────────────────────
  const checkForClose = (reply) => {
    const r = reply.toLowerCase()
    return [
      "let's do it", "let's go ahead", "i'm in", "sign me up",
      "okay fine", "alright fine", "you convinced me",
      "how do we get started", "what do i need to",
      "when can you start", "send me the contract",
      "yeah let's do", "okay let's do", "i'll do it",
      "let's move forward", "you've got a deal",
      "okay you got me", "alright you've earned",
      "yeah alright let's", "okay walk me through",
    ].some(s => r.includes(s))
  }

  const checkForHangup = (reply) => {
    const r = reply.toLowerCase()
    return [
      "don't call again", "take me off your list",
      "not interested goodbye", "please don't call",
      "remove me from", "never call me again",
    ].some(s => r.includes(s))
  }

  // ── Tone & UI updates ─────────────────────────────────────────
  const updateTone = (text, role = 'bot') => {
    const t = text.toLowerCase()
    setClosePct(prev => {
      let p = prev
      if (role === 'bot') {
        if (/that makes sense|actually interesting|not bad|fair enough|good point/.test(t)) p = Math.min(p + 15, 92)
        if (/tell me more|how does|what exactly|okay so|right|uh huh/.test(t)) p = Math.min(p + 8, 92)
        if (/how do we|what's the next step|next step/.test(t)) p = Math.min(p + 22, 96)
        if (/not interested|take me off|never call/.test(t)) p = Math.max(p - 25, 5)
        if (/too expensive|can't afford|over budget/.test(t)) p = Math.max(p - 15, 10)
        if (/need to think|call me back|maybe later/.test(t)) p = Math.max(p - 10, 10)
        if (/busy|bad time|gotta go/.test(t)) p = Math.max(p - 5, 15)
      }
      if (role === 'usr') {
        if (/imagine|picture this|most people|what if/.test(t)) p = Math.min(p + 4, 92)
        if (/when we get started|once you start/.test(t)) p = Math.min(p + 3, 92)
        if (/\$[\d,]+|\d+%|\d+ (days|weeks|months)/.test(t)) p = Math.min(p + 5, 92)
      }
      closePctRef.current = p
      return p
    })
    const objKw = ['think about', 'expensive', 'too much', 'not interested', 'call back', 'spouse', 'budget', 'not now', "can't afford", 'price is', 'not ready', 'over budget']
    if (role === 'bot' && objKw.some(k => t.includes(k))) {
      setLastObjection(text)
      setReframeOpen(true)
      setReframes(null)
    }
  }

  const addMsg = (role, text, isBrutal = false) => {
    setMessages(m => [...m, { role, text, isBrutal, ts: Date.now() }])
    if (!isBrutal) {
      callMsgRef.current = [...callMsgRef.current, { role, text, time: secsRef.current }]
    }
    if (role === 'bot' && !isBrutal) setLastBotText(text)
  }

  // ── Prospect generation ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setGeneratingProfile(true)
      try {
        const profile = await generateProspectProfile(industry, difficulty)
        if (!cancelled) {
          if (!profile.gender) profile.gender = Math.random() > 0.5 ? 'female' : 'male'
          const objPool = INDUSTRY_OBJECTIONS[industry]
          if (objPool) profile.main_objection = objPool[Math.floor(Math.random() * objPool.length)]
          voicePersonalityRef.current = generateVoicePersonality(profile.gender)
          profileRef.current = profile
          setProspectProfile(profile)
          console.log('[PROSPECT] Generated:', profile.name, profile.gender)
        }
      } catch (e) {
        if (!cancelled) {
          const gender = Math.random() > 0.5 ? 'female' : 'male'
          const nameList = PROSPECT_NAMES[gender] || PROSPECT_NAMES.female
          const fb = nameList[Math.floor(Math.random() * nameList.length)]
          const objPool = INDUSTRY_OBJECTIONS[industry] || INDUSTRY_OBJECTIONS['Door-to-Door']
          const fallback = {
            name: fb[0], gender, age: 42, occupation: 'Business Owner', location: 'Phoenix, AZ',
            personality: 'Direct and skeptical. Values their time above all else.',
            mood_today: 'Busy and slightly stressed.',
            main_objection: objPool[Math.floor(Math.random() * objPool.length)],
            trigger_to_buy: 'Clear ROI with specific numbers and fast results.',
            speech_pattern: 'Short, direct. Few pleasantries.',
            backstory: 'Has dealt with many salespeople.',
            opening_line: 'Yeah?',
          }
          voicePersonalityRef.current = generateVoicePersonality(fallback.gender)
          profileRef.current = fallback
          setProspectProfile(fallback)
        }
      }
      if (!cancelled) setGeneratingProfile(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ── Start call after preview ──────────────────────────────────
  useEffect(() => {
    if (!prospectProfile || showPreview) return
    const t = setTimeout(() => {
      vibrateBlitz([40, 40, 40, 40, 40])
      zapSound()
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
      if (mode === 'one') {
        oneshotRef.current = setInterval(() => setOneShotSecs(s => {
          if (s <= 1) { clearInterval(oneshotRef.current); return 0 }
          return s - 1
        }), 1000)
      }
      startPhoneStatic()
      setCallConnected(true)
      startCall()
    }, 50)
    return () => clearTimeout(t)
  }, [showPreview])

  // ── Show results ──────────────────────────────────────────────
  const showCallResults = async (dealClosed) => {
    if (!callActiveRef.current) return
    callActiveRef.current = false

    clearInterval(timerRef.current)
    clearInterval(oneshotRef.current)
    window.speechSynthesis.cancel()
    if (audioRef.current) { try { audioRef.current.pause() } catch (e) {}; audioRef.current = null }
    isSpeakingRef.current = false; setIsSpeaking(false)
    isListeningRef.current = false; setIsListening(false)
    isProcessingRef.current = false
    stopPhoneStatic()
    try { recognitionRef.current?.abort() } catch (e) {}
    setLoading(false)

    if (dealClosed) {
      navigator.vibrate?.([100, 50, 100, 50, 200])
      dispatch({ type: 'COMPLETE_CALL', payload: { closed: true, dealValue } })
    }

    const msgs = callMsgRef.current
    const exchanges = exchangeCountRef.current
    const finalClosePct = closePctRef.current
    const finalSecs = secsRef.current

    if (msgs.length < 2) {
      setResultsData({
        overall_score: finalClosePct, deal_closed: dealClosed, exchanges,
        grades: { opening: 50, rapport: 50, pitch_clarity: 50, objection_handling: 50, closing_technique: 50, listening: 50 },
        biggest_strength: 'You picked up the phone and started', biggest_mistake: 'Call was too short to analyze',
        blitz_summary: 'Get back in there. Real closers hang up last, not first.',
        next_focus: 'Stay in the conversation longer', secs: finalSecs,
      })
      setShowResults(true)
      return
    }

    setResultsLoading(true)

    const transcriptText = msgs.map(m => `${m.role === 'usr' ? 'REP' : 'PROSPECT'}: ${m.text}`).join('\n')
    const analysisPrompt = `You are Blitz, elite sales coach trained on Andy Elliott, Grant Cardone, and Jordan Belfort.

Analyze this ${industry} training call transcript:

${transcriptText}

Deal closed: ${dealClosed}
Total exchanges: ${exchanges}
Final close probability: ${finalClosePct}%
Difficulty: ${difficulty}

Return ONLY raw JSON, no markdown, no backticks:
{"overall_score":78,"deal_closed":${dealClosed},"exchanges":${exchanges},"grades":{"opening":85,"rapport":72,"pitch_clarity":80,"objection_handling":75,"closing_technique":70,"listening":82},"biggest_strength":"one specific thing they did well","biggest_mistake":"one specific thing that hurt them","best_line":"the single best line the rep said verbatim","worst_line":"the single weakest line the rep said verbatim","elite_version_of_worst":"how a top closer would have said it","key_moments":[{"exchange":2,"what_happened":"brief description","impact":"positive","coaching":"specific coaching note"}],"blitz_summary":"2-3 sentence coaching message in Blitz voice","next_focus":"the single most important skill to work on"}`

    try {
      const raw = await callClaudeConversation([{ role: 'user', content: analysisPrompt }], 900)
      const cleaned = raw.trim().replace(/```json/gi, '').replace(/```/g, '').trim()
      const analysis = JSON.parse(cleaned)
      setResultsData({ ...analysis, deal_closed: dealClosed, secs: finalSecs })
    } catch (e) {
      console.error('[RESULTS] Analysis failed:', e)
      setResultsData({
        overall_score: finalClosePct, deal_closed: dealClosed, exchanges,
        grades: { opening: finalClosePct, rapport: finalClosePct, pitch_clarity: finalClosePct, objection_handling: finalClosePct, closing_technique: finalClosePct, listening: finalClosePct },
        biggest_strength: dealClosed ? 'You closed the deal!' : 'You stayed in the conversation',
        biggest_mistake: 'Keep working on objection handling',
        blitz_summary: dealClosed ? 'You closed the deal. Now sharpen every technique so you close faster.' : 'Good effort. Every call makes you better. Study the objections.',
        next_focus: 'Objection handling', secs: finalSecs,
      })
    }

    setResultsLoading(false)
    setShowResults(true)
  }

  // ── Start call ────────────────────────────────────────────────
  const startCall = async () => {
    console.log('[CALL] ====== NEW CALL STARTING ======')

    callActiveRef.current = true
    exchangeCountRef.current = 0
    chatRef.current = []
    isProcessingRef.current = false
    isSpeakingRef.current = false
    isListeningRef.current = false
    callMsgRef.current = []
    setMessages([])
    setTranscript('')
    setMoodEmoji('😐')
    setLastBotText('')
    setLoading(true)

    window.speechSynthesis.cancel()
    if (audioRef.current) {
      try { audioRef.current.pause() } catch (e) {}
      audioRef.current = null
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.abort()
      } catch (e) {}
      recognitionRef.current = null
    }

    if (!window.speechSynthesis) { alert('Your browser does not support voice. Use Chrome.'); return }

    const hasPermission = await requestMicPermission()
    if (!hasPermission) { callActiveRef.current = false; return }

    const p = profileRef.current
    if (!p) { console.error('[CALL] No prospect profile'); setLoading(false); return }

    console.log('[CALL] Prospect:', p.name, p.gender)

    const sys = buildSystemPrompt(p, industry, difficulty, language, mode, persona, customBrain)
    systemPromptRef.current = sys
    chatRef.current = [{ role: 'user', content: '[The phone is ringing. You answer it now.]' }]

    console.log('[CALL] Language:', language)
    console.log('[CALL] System prompt preview:', sys.slice(0, 120))

    try {
      console.log('[CALL] Getting opening line...')
      const raw = await callClaudeConversation(chatRef.current, 100, sys)
      const opening = cleanAIResponse(raw)
      console.log('[CALL] Opening line:', opening)

      chatRef.current.push({ role: 'assistant', content: opening })

      addMsg('bot', opening)
      updateTone(opening, 'bot')
      setMoodEmoji(analyzeMood(opening))
      setLoading(false)

      console.log('[CALL] Speaking opening...')
      await speakText(opening, p.gender, language)
      console.log('[CALL] Opening spoken.')

      if (callActiveRef.current) {
        await new Promise(r => setTimeout(r, 300))
        startListening()
      }
    } catch (e) {
      console.error('[CALL] Start error:', e)
      setLoading(false)
      addMsg('brutal', '⚠️ Connection error. Check your API key and internet connection.', true)
    }
  }

  // ── Handle voice input ────────────────────────────────────────
  const handleVoiceInput = async (text) => {
    if (!text?.trim()) {
      console.log('[CALL] Empty input — ignoring')
      if (callActiveRef.current && !isSpeakingRef.current) startListening()
      return
    }

    if (isProcessingRef.current) {
      console.log('[CALL] Already processing — ignoring')
      return
    }

    if (!callActiveRef.current) {
      console.log('[CALL] Call not active — ignoring')
      return
    }

    console.log('[CALL] ====== USER SAID:', text, '======')
    isProcessingRef.current = true
    setLoading(true)

    addMsg('usr', text)
    updateTone(text, 'usr')
    chatRef.current.push({ role: 'user', content: text })
    exchangeCountRef.current += 1

    const toneScore = analyzeUserTone(text)
    setClosePct(prev => {
      const next = Math.max(5, Math.min(95, prev + (toneScore - 50) * 0.3))
      closePctRef.current = next
      return next
    })

    console.log('[CALL] Exchange #', exchangeCountRef.current)
    console.log('[CALL] Chat history length:', chatRef.current.length)

    const userCount = callMsgRef.current.filter(m => m.role === 'usr').length
    if (mode === 'bru' && userCount % 3 === 0) {
      getBrutalFeedback(text, language).then(fb => {
        addMsg('brutal', '😤 BLITZ: ' + fb.replace(/^(BLITZ:|Blitz:)/i, '').trim(), true)
      }).catch(() => {})
    }

    const thinkMs = 500 + Math.random() * 600
    await new Promise(r => setTimeout(r, thinkMs))

    try {
      console.log('[CALL] Calling API with', chatRef.current.length, 'messages, language:', language)
      const raw = await callClaudeConversation(chatRef.current, 150, systemPromptRef.current)
      const reply = cleanAIResponse(raw)
      console.log('[CALL] AI reply:', reply)

      chatRef.current.push({ role: 'assistant', content: reply })

      addMsg('bot', reply)
      updateTone(reply, 'bot')
      const emoji = analyzeMood(reply)
      setMoodEmoji(emoji)

      setLoading(false)

      const gender = profileRef.current?.gender || 'female'

      if (checkForClose(reply)) {
        console.log('[CALL] 🏆 DEAL CLOSED after', exchangeCountRef.current, 'exchanges!')
        isProcessingRef.current = false
        await speakText(reply, gender, language)
        showCallResults(true)
        return
      }

      if (checkForHangup(reply)) {
        console.log('[CALL] Prospect hung up')
        isProcessingRef.current = false
        await speakText(reply, gender, language)
        setTimeout(() => showCallResults(false), 1000)
        return
      }

      if (emoji === '😡') {
        console.log('[CALL] Prospect rage quit')
        isProcessingRef.current = false
        await speakText(reply, gender, language)
        setTimeout(() => showCallResults(false), 1500)
        return
      }

      console.log('[CALL] Speaking reply...')
      isProcessingRef.current = false
      await speakText(reply, gender, language)
      console.log('[CALL] Reply spoken.')

      if (callActiveRef.current) {
        await new Promise(r => setTimeout(r, 300))
        console.log('[CALL] Restarting mic...')
        startListening()
      }
    } catch (e) {
      console.error('[CALL] Response error:', e)
      setLoading(false)
      isProcessingRef.current = false
      addMsg('brutal', '⚠️ No response. Check your connection.', true)
      if (callActiveRef.current) {
        setTimeout(() => startListening(), 1000)
      }
    }
  }

  const loadReframes = async () => {
    if (!lastObjection) return
    setReframeLoading(true)
    try { const data = await getReframes(lastObjection, language); setReframes(data) } catch (e) {}
    setReframeLoading(false)
  }

  const fmt = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0')
  const toneColor = closePct >= 70 ? '#22c55e' : closePct >= 45 ? '#f59e0b' : '#ef4444'
  const prospectName = prospectProfile?.name || 'Prospect'

  // ── Render guards ─────────────────────────────────────────────
  if (generatingProfile) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <BlitzIcon size={42} className="mb-4" />
        <p className="text-white font-bubble text-base mb-1">Building your prospect...</p>
        <p className="text-white/40 text-sm">Generating a real character profile</p>
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-closer-blue/60 typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    )
  }

  if (showPreview && prospectProfile) return <ProspectPreview profile={prospectProfile} onStart={() => setShowPreview(false)} />

  if (resultsLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="text-3xl mb-4">🔍</div>
        <BlitzIcon size={52} className="mb-3" />
        <p className="text-white font-bubble text-base mb-1">Blitz is analyzing your call...</p>
        <p className="text-white/40 text-sm">Building your full scorecard</p>
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-closer-blue/60 typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    )
  }

  if (showResults && resultsData) {
    const r = resultsData
    const scoreColor = r.deal_closed ? '#22c55e' : r.overall_score >= 70 ? '#f59e0b' : '#ef4444'
    const gradeNames = { opening: 'Opening', rapport: 'Rapport', pitch_clarity: 'Pitch Clarity', objection_handling: 'Objection Handling', closing_technique: 'Closing', listening: 'Listening' }
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-navy-950">
        <div className="p-4 space-y-4">
          <div className="text-center pt-3 pb-2">
            <div className="text-5xl mb-3">{r.deal_closed ? '🏆' : '📊'}</div>
            <h2 className="text-xl font-bold text-white">{r.deal_closed ? 'Deal Closed!' : 'Call Complete'}</h2>
            <p className="text-white/40 text-sm mt-1">
              {r.exchanges} exchanges · {fmt(r.secs || 0)}
            </p>
          </div>

          <div className={`rounded-2xl p-4 text-center border-2`} style={{ borderColor: scoreColor + '80', background: scoreColor + '15' }}>
            <div className="text-4xl font-bold font-mono mb-1" style={{ color: scoreColor }}>{r.overall_score}</div>
            <div className="text-white/50 text-sm">Overall Score</div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-3">Performance Breakdown</div>
            {Object.entries(r.grades || {}).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 mb-2.5">
                <span className="text-xs text-white/60 w-32 flex-shrink-0">{gradeNames[k] || k}</span>
                <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${v}%`,
                    background: v >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : v >= 60 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)'
                  }} />
                </div>
                <span className="text-xs font-bold font-mono w-8 text-right text-white/60">{v}</span>
              </div>
            ))}
          </div>

          {r.best_line && (
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                <div className="text-[8px] font-bold text-green-400 uppercase tracking-wider mb-1.5">✅ Best Line</div>
                <p className="text-xs text-white/70 italic leading-relaxed">"{r.best_line}"</p>
              </div>
              {r.worst_line && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <div className="text-[8px] font-bold text-red-400 uppercase tracking-wider mb-1.5">❌ Weakest Line</div>
                  <p className="text-xs text-white/40 italic line-through leading-relaxed mb-2">"{r.worst_line}"</p>
                  {r.elite_version_of_worst && (
                    <>
                      <div className="text-[8px] font-bold text-closer-blue mb-1">Elite version:</div>
                      <p className="text-xs text-closer-blue leading-relaxed">"{r.elite_version_of_worst}"</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-800/60 border border-white/10 rounded-xl p-3">
              <div className="text-[8px] font-bold text-green-400 uppercase tracking-wider mb-1.5">Top Strength</div>
              <p className="text-xs text-white/70 leading-relaxed">{r.biggest_strength}</p>
            </div>
            <div className="bg-navy-800/60 border border-white/10 rounded-xl p-3">
              <div className="text-[8px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Fix Next</div>
              <p className="text-xs text-white/70 leading-relaxed">{r.next_focus}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl p-3 border border-closer-blue/30">
            <BlitzIcon size={32} />
            <div>
              <p className="text-[9px] font-bold text-gold-400 mb-1">Blitz Coaching</p>
              <p className="text-xs text-white/80 leading-relaxed">{r.blitz_summary}</p>
            </div>
          </div>

          {r.key_moments?.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">Key Moments</div>
              {r.key_moments.map((m, i) => (
                <div key={i} className={`border rounded-xl p-3 mb-2 bg-navy-800/40 border-white/10 border-l-2 ${m.impact === 'positive' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className={`text-[8px] font-bold uppercase tracking-wider mb-1 ${m.impact === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    Exchange {m.exchange} · {m.impact}
                  </div>
                  <p className="text-xs text-white/60 mb-1">{m.what_happened}</p>
                  <p className="text-xs text-closer-blue">→ {m.coaching}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pb-4">
            <button
              onClick={() => {
                // Unlock HTMLMediaElement audio context for iOS autoplay
                try {
                  const unlock = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=')
                  unlock.play().catch(() => {})
                } catch (e) {}
                setShowResults(false)
                setResultsData(null)
                setSecs(0)
                secsRef.current = 0
                clearInterval(timerRef.current)
                timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
                startCall()
              }}
              className="flex-1 py-3.5 bg-closer-blue text-white font-bold rounded-xl text-sm"
            >
              ↺ Call Again
            </button>
            <button
              onClick={() => onEnd(closePctRef.current)}
              className="flex-1 py-3.5 bg-white/10 border border-white/15 text-white/60 font-bold rounded-xl text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main call UI ──────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full relative">

      {/* Call header */}
      <div className="bg-navy-900 px-3 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
          <span className="text-xs text-red-400 font-bold tracking-wider">
            {callConnected ? '📞 LIVE' : 'CONNECTING'}
          </span>
        </div>
        <span className="text-lg font-bold text-white font-mono tabular-nums">{fmt(secs)}</span>
        <div className="flex gap-1.5 items-center">
          {isSpeaking && <BlitzIcon size={14} className="blitz-speaking" />}
          <button
            onClick={() => {
              const next = !isMuted; muteRef.current = next; setIsMuted(next)
              if (next) {
                window.speechSynthesis.cancel()
                if (audioRef.current) { try { audioRef.current.pause() } catch (e) {}; audioRef.current = null }
                isSpeakingRef.current = false; setIsSpeaking(false)
              }
            }}
            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all ${isMuted ? 'bg-yellow-600/80 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            {isMuted ? '🔇 Muted' : '🔊 Voice'}
          </button>
          <button onClick={() => onEnd(closePctRef.current, 'restart')} className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-white/10 text-white hover:bg-white/20">↺</button>
          <button onClick={() => showCallResults(false)} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-red-700 text-white hover:bg-red-600">✕ End</button>
        </div>
      </div>

      {/* One Shot bar */}
      {mode === 'one' && (
        <div className="h-1.5 bg-white/10 flex-shrink-0">
          <div className="h-full countdown-gradient rounded-r transition-all" style={{ width: `${(oneShotSecs / 90) * 100}%` }} />
        </div>
      )}

      {/* Prospect card */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/60 border-b border-white/10 flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-all duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}
          style={{
            background: prospectProfile?.gender === 'male' ? '#1a6bbf' : '#8b5cf6',
            boxShadow: isSpeaking ? `0 0 0 6px ${prospectProfile?.gender === 'male' ? 'rgba(26,107,191,0.3)' : 'rgba(139,92,246,0.3)'}` : 'none',
          }}
        >
          {prospectProfile?.name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            {prospectName}
            {isSpeaking && <BlitzIcon size={12} className="blitz-speaking" />}
          </p>
          <p className="text-[10px] text-white/40 truncate">{prospectProfile?.occupation || persona}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-base">{moodEmoji}</span>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
            closePct >= 80 ? 'bg-green-900/60 text-green-300' :
            closePct >= 55 ? 'bg-blue-900/60 text-blue-300' :
            closePct >= 30 ? 'bg-yellow-900/60 text-yellow-300' :
            'bg-red-900/60 text-red-300'
          }`}>
            {closePct >= 80 ? 'Warming up' : closePct >= 55 ? 'Neutral' : closePct >= 30 ? 'Skeptical' : 'Frustrated'}
          </span>
        </div>
      </div>

      {/* Call center */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-4">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}
            style={{
              background: prospectProfile?.gender === 'male' ? '#1a6bbf' : '#8b5cf6',
              boxShadow: isSpeaking ? `0 0 0 12px ${prospectProfile?.gender === 'male' ? 'rgba(26,107,191,0.2)' : 'rgba(139,92,246,0.2)'}` : 'none',
            }}
          >
            {prospectProfile?.name?.charAt(0) || '?'}
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs">🔊</div>
          )}
        </div>

        {loading ? (
          <div className="bg-white/8 border border-white/10 rounded-2xl px-5 py-3 flex gap-2 items-center">
            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
          </div>
        ) : lastBotText ? (
          <div className="max-w-xs w-full text-center">
            <div className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/90 leading-relaxed italic">
              "{lastBotText}"
            </div>
          </div>
        ) : null}

        {messages.filter(m => m.isBrutal).slice(-1).map((m, i) => (
          <div key={i} className="max-w-xs w-full bg-red-900/40 border border-red-500/50 rounded-xl px-3 py-2 text-xs text-red-300 font-bold text-center">
            {m.text}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="px-4 pt-3 pb-6 bg-gray-900 border-t border-white/10 flex-shrink-0">
        {/* Close meter */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider w-8">Close</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${closePct}%`,
              background: closePct >= 75 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : closePct >= 45 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#3b82f6,#2563eb)',
            }} />
          </div>
          <span className="text-[9px] font-bold font-mono w-8 text-right" style={{ color: toneColor }}>{closePct}%</span>
        </div>
        <p className="text-[9px] text-white/25 italic mb-4 ml-11">
          {closePct >= 85 ? '🤑 Ready to close — push now' : closePct >= 70 ? '😊 Interested — keep building' : closePct >= 55 ? '🤔 Curious — keep going' : closePct >= 35 ? '😐 Neutral — need more value' : closePct >= 20 ? '🤨 Skeptical — handle objections' : '😤 Frustrated — use empathy'}
        </p>

        {/* Transcript */}
        {(transcript || isListening) && (
          <div className="mb-3 px-3 py-2 bg-white/8 border border-white/15 rounded-xl min-h-[36px]">
            <p className="text-sm text-white/80 leading-relaxed">
              {transcript || <span className="text-white/25 italic text-xs">Listening — speak now...</span>}
            </p>
          </div>
        )}

        {/* Status */}
        <p className="text-center text-xs text-white/30 mb-4">
          {isSpeaking ? `🔊 ${prospectName} is speaking...` : isListening ? '🎙️ Listening — speak your response' : loading ? '⏳ Thinking...' : 'Tap the mic to respond'}
        </p>

        {/* Mic button */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <button
            onClick={() => {
              if (isListening) {
                stopListening()
              } else {
                // Force active — if call UI is visible the call is running
                if (!callActiveRef.current) callActiveRef.current = true
                isProcessingRef.current = false
                startListening()
              }
            }}
            disabled={isSpeaking || loading}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 scale-110' : 'bg-closer-blue hover:scale-105 active:scale-95'}`}
            style={isListening ? { animation: 'mic-pulse 1.2s ease-in-out infinite' } : { boxShadow: '0 8px 32px rgba(26,107,191,0.4)' }}
          >
            {isListening ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            )}
          </button>
          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: isListening ? '#ef4444' : isSpeaking || loading ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)' }}>
            {isListening ? 'Tap to stop' : isSpeaking ? 'Prospect speaking' : loading ? 'Please wait' : 'Tap to speak'}
          </span>
        </div>

        {/* Waveform */}
        {isListening && (
          <div className="flex items-end justify-center gap-1 h-8 mt-2">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-1 bg-closer-blue rounded-full" style={{
                height: `${8 + (i % 5) * 4}px`,
                animation: `waveform-bar ${0.3 + (i % 5) * 0.1}s ease-in-out ${(i * 0.06).toFixed(2)}s infinite alternate`,
              }} />
            ))}
          </div>
        )}

        {/* Mute */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => {
              const next = !isMuted; muteRef.current = next; setIsMuted(next)
              if (next) {
                window.speechSynthesis.cancel()
                if (audioRef.current) { try { audioRef.current.pause() } catch (e) {}; audioRef.current = null }
                isSpeakingRef.current = false; setIsSpeaking(false)
              }
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${isMuted ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-white/5 text-white/30 border-white/15 hover:bg-white/10'}`}
          >
            {isMuted ? '🔇 Unmute AI Voice' : '🔊 Mute AI Voice'}
          </button>
        </div>
      </div>

      {/* Reframe popup */}
      {reframeOpen && (
        <div className="absolute bottom-28 left-3 right-3 bg-navy-900 border border-closer-blue rounded-xl p-3 z-30 shadow-2xl shadow-closer-blue/20">
          <div className="flex items-center gap-2 mb-2">
            <BlitzIcon size={18} />
            <p className="text-[10px] text-gold-400 font-bold flex-1"><LightningEmoji size={12}/> Objection detected — tap for reframes</p>
            <button onClick={() => setReframeOpen(false)} className="text-white/30 text-sm hover:text-white/60">✕</button>
          </div>
          {!reframes ? (
            <button onClick={loadReframes} disabled={reframeLoading} className="w-full py-2 bg-closer-blue/20 border border-closer-blue/30 rounded-lg text-white/80 text-xs font-medium hover:bg-closer-blue/30 disabled:opacity-40">
              {reframeLoading ? 'Loading...' : '🔄 Show 3 elite reframes (Elliott / Belfort / Cardone)'}
            </button>
          ) : (
            <div className="space-y-1.5">
              {[{ text: reframes.r1, label: 'Andy Elliott' }, { text: reframes.r2, label: 'Jordan Belfort' }, { text: reframes.r3, label: 'Grant Cardone' }].map((r, i) => (
                <div key={i} className="bg-closer-blue/15 border border-closer-blue/25 rounded-lg p-2">
                  <p className="text-xs text-white/85 leading-relaxed">{r.text}</p>
                  <p className="text-[8px] font-bold text-gold-500 mt-1">{r.label}</p>
                </div>
              ))}
              <button onClick={() => setReframeOpen(false)} className="w-full py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 text-xs">✕ Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MAIN TRAINING SCREEN ─────────────────────────────────────────────────────
export default function TrainingScreen() {
  const { state, dispatch } = useApp()
  const [mode, setMode] = useState('std')
  const [industry, setIndustry] = useState('Door-to-Door')
  const [persona, setPersona] = useState(PROSPECTS[0])
  const [dealVal, setDealVal] = useState(5000)
  const [difficulty, setDifficulty] = useState(3)
  const [inCall, setInCall] = useState(false)
  const [restartKey, setRestartKey] = useState(0)

  const testVoice = async (gender) => {
    console.log('[TEST] Testing', gender, 'voice in', state.language)
    const url = await elevenLabsSpeak('Hello, this is a voice test.', gender, state.language)
    if (url) {
      const audio = new Audio(url)
      audio.play().catch(e => {
        console.error('[TEST] play() failed:', e.message)
        alert('Audio blocked. Tap the screen first then test again.')
      })
      audio.onended = () => URL.revokeObjectURL(url)
      console.log('[TEST] ✅ Voice test playing')
    } else {
      alert(
        'ElevenLabs voice test failed.\n\n' +
        'Check the console for the error.\n\n' +
        'Common causes:\n' +
        '1. API key wrong or expired\n' +
        '2. Voice ID not found\n' +
        '3. No internet connection\n' +
        '4. Free tier limit reached'
      )
    }
  }

  const handleEnd = (closePct, action) => {
    if (action !== 'restart') {
      dispatch({ type: 'COMPLETE_CALL', payload: { closed: closePct >= 70, dealValue: dealVal } })
    }
    if (action === 'restart') setRestartKey(k => k + 1)
    else setInCall(false)
  }

  if (inCall) {
    return (
      <CallScreen
        key={restartKey}
        mode={mode}
        industry={industry}
        persona={persona}
        difficulty={DIFFICULTY_MAP[Math.round(difficulty)]}
        dealValue={dealVal}
        language={state.language}
        customBrain={state.customBrain}
        onEnd={handleEnd}
      />
    )
  }

  const modeMsg = TRAINING_MODES.find(m => m.id === mode)?.blitzMsg || ''

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
      <BlitzBar message={`<strong>Blitz:</strong> ${modeMsg}`} />

      <div className="text-[9px] font-bubble uppercase tracking-widest text-white/40 mb-2">Training Mode</div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {TRAINING_MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              mode === m.id
                ? m.id === 'bru' ? 'border-red-500 bg-red-500/10' : m.id === 'one' ? 'border-yellow-500 bg-yellow-500/10' : 'border-closer-blue bg-closer-blue/10'
                : 'border-white/10 bg-white/5 hover:bg-white/8'
            }`}
          >
            <div className="text-lg mb-1">{m.icon}</div>
            <div className="text-xs font-bubble text-white">{m.name}</div>
            <div className="text-[9px] text-white/40 mt-0.5 leading-relaxed">{m.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[9px] font-bubble text-white/40 uppercase tracking-wider mb-1.5">Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-bubble text-white/40 uppercase tracking-wider mb-1.5">Prospect</label>
          <select value={persona} onChange={e => setPersona(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            {PROSPECTS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-[9px] font-bubble text-white/40 uppercase tracking-wider mb-1.5">Deal value ($)</label>
        <input type="number" value={dealVal} onChange={e => setDealVal(+e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-sm focus:outline-none focus:border-closer-blue" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[9px] font-bubble text-white/40 uppercase tracking-wider">Difficulty</label>
          <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-blue-900/60 text-blue-300">{DIFFICULTY_MAP[Math.round(difficulty)]}</span>
        </div>
        <div className="relative pt-1 pb-4">
          <input type="range" min="1" max="5" step="0.01" value={difficulty}
            onChange={e => setDifficulty(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #1a6bbf 0%, #1a6bbf ${((difficulty - 1) / 4) * 100}%, rgba(255,255,255,0.1) ${((difficulty - 1) / 4) * 100}%, rgba(255,255,255,0.1) 100%)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            <span className="text-[8px] text-white/30">Beginner</span>
            <span className="text-[8px] text-white/30">Mid</span>
            <span className="text-[8px] text-white/30">Elite</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-white/30 italic mb-4">Training in {state.language}</p>

      {(!import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.VITE_ELEVENLABS_API_KEY === 'your_elevenlabs_key_here') ? (
        <div className="bg-gold-500/10 border border-gold-500/25 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold text-gold-400 mb-1">Enable Real Human Voices</p>
          <p className="text-[10px] text-white/50 leading-relaxed mb-2">
            Add your free ElevenLabs key to .env for voices that sound like actual people. Without it the browser default voice is used.
          </p>
          <p className="text-[10px] font-mono text-white/30 mb-1">VITE_ELEVENLABS_API_KEY=your_key</p>
          <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-[10px] text-closer-blue underline">
            Get free key at elevenlabs.io →
          </a>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 mb-3">
          <p className="text-[10px] font-bold text-green-400">✅ ElevenLabs voice enabled — real human audio active</p>
        </div>
      )}

      {(import.meta.env.VITE_ELEVENLABS_API_KEY && import.meta.env.VITE_ELEVENLABS_API_KEY !== 'your_elevenlabs_key_here') && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => testVoice('female')}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 active:scale-95 transition-all"
          >
            🎙️ Test Female Voice
          </button>
          <button
            onClick={() => testVoice('male')}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 active:scale-95 transition-all"
          >
            🎙️ Test Male Voice
          </button>
        </div>
      )}

      <button
        onClick={() => {
          // Unlock both speech synthesis and HTMLMediaElement audio
          try {
            window.speechSynthesis.cancel()
            const prime = new SpeechSynthesisUtterance('')
            window.speechSynthesis.speak(prime)
          } catch (e) {}
          try {
            const unlock = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=')
            unlock.play().catch(() => {})
          } catch (e) {}
          setInCall(true)
        }}
        className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-[#1a6bbf] to-[#1557a0] text-white tracking-wide shadow-lg shadow-closer-blue/30 hover:shadow-xl hover:shadow-closer-blue/40 hover:from-[#1d78d6] hover:to-[#1a6bbf] active:scale-[0.98] transition-all duration-200 border border-closer-blue/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
        <div className="flex items-center justify-center gap-3 relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Start Training Call</span>
        </div>
      </button>
    </div>
  )
}
