import React, { useState, useRef, useEffect } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { callClaudeConversation, getBrutalFeedback, getReframes, generateProspectProfile, textToSpeechElevenLabs, ELEVEN_VOICES } from '../utils/api'
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

const HUMAN_VOICE_DB = {
  female: [
    'Google US English',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Michelle Online (Natural)',
    'Samantha (Enhanced)',
    'Samantha',
    'Karen (Enhanced)',
    'Karen',
    'Moira',
    'Tessa',
    'Victoria',
    'Google UK English Female',
  ],
  male: [
    'Google UK English Male',
    'Microsoft Guy Online (Natural)',
    'Microsoft Davis Online (Natural)',
    'Microsoft Ryan Online (Natural)',
    'Daniel (Enhanced)',
    'Daniel',
    'Alex (Enhanced)',
    'Alex',
    'Aaron',
    'Gordon',
    'Oliver',
    'Thomas',
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
  { pattern: /hang up|stop calling|remove me|don't call|not calling back/i, emoji: '😡' },
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

const cleanResponse = (text) => {
  if (!text) return ''
  let clean = text
  // Remove *asterisk* actions
  clean = clean.replace(/\*[^*]+\*/g, '')
  // Remove [bracket] actions
  clean = clean.replace(/\[[^\]]+\]/g, '')
  // Remove parenthetical actions
  clean = clean.replace(/\((pause|sigh|laugh|chuckle|hesitat|think|clear|exhale|inhale|breath)[^)]*\)/gi, '')
  // Remove leading stage direction phrases
  clean = clean.replace(/^(pause|sighs?|laughs?|chuckles?|hesitates?|clears? throat)[,.]?\s*/gi, '')
  clean = clean.replace(/takes? a (moment|breath|pause)[,.]?\s*/gi, '')
  clean = clean.replace(/speaks? (slowly|quickly|quietly|firmly)[,.]?\s*/gi, '')
  // Collapse extra whitespace
  clean = clean.replace(/\s+/g, ' ').trim()
  return clean.length >= 3 ? clean : 'Yeah, go ahead.'
}

const addNaturalPauses = (text) => {
  return text
    .replace(/\. ([A-Z])/g, '.  $1')
    .replace(/, /g, ',  ')
    .replace(/ but /gi, '  but ')
    .replace(/ because /gi, '  because ')
    .replace(/^(Yeah|Look|Right|Okay|Hmm|Well|Uh|I mean)([,.]?\s)/i, '$1...  ')
    .replace(/\s{3,}/g, '  ')
}

const buildSystemPrompt = (profile, industry, difficulty, language, mode, persona, customBrain) => {
  const resistanceLevels = {
    'Beginner': 'You are polite. You push back once or twice but warm up fairly easily after 3-4 good responses. You buy after 5-6 solid exchanges.',
    'Beginner+': 'You are cautious. You need a couple objections handled properly. You buy after 7-8 good exchanges.',
    'Intermediate': 'You are a realistic skeptic. You push back on price, timing, and need. You need real answers. You buy after 9-10 solid exchanges.',
    'Advanced': 'You are tough and busy. You test the rep hard. Only a genuinely compelling conversation over 11-12 exchanges wins you over.',
    'Elite Closer': 'You are the hardest possible prospect. You know sales tactics and call them out. Only someone who truly listens and adapts over 13+ exchanges gets your yes.',
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

  return `You are ${profile.name}, ${profile.age} years old, ${profile.occupation}.
Your mood right now: ${profile.mood_today || profile.mood || 'neutral'}
How you naturally talk: ${profile.speech_pattern || profile.speech || 'normal conversational pace'}
Your main resistance to this call: ${profile.main_objection}
What would genuinely change your mind: ${profile.trigger_to_buy}
${profile.backstory ? 'Your backstory: ' + profile.backstory : ''}${brainCtx}${modeExtras[mode] || ''}

${resistanceLevels[difficulty] || resistanceLevels['Intermediate']}

You are on the phone receiving an unexpected call about ${industry}.

ABSOLUTE RULES — never break these:
- You are a real human. Never say you are AI. Never break character.
- Maximum 2 sentences per response. This is a phone call not an essay.
- NEVER write stage directions, actions, or descriptions of what you are doing. Only write the actual words you speak.
- Never write actions like *pauses* or (hesitates) or [sighs] or *clears throat*.
- Never describe what you are doing or feeling. Just say what you say.
- Never use bullet points or numbered lists ever.
- Never say things like "I appreciate your pitch" or "That is a valid point."
- Just talk like a real person talks on the phone.
- Use natural real speech only: "Yeah", "Look", "Uh", "I mean", "Right", "Hmm", "I don't know about that", "That's actually", "Wait so", "Okay but", "I hear you but"
- React directly to exactly what was just said to you.
- Your resistance changes based on how good the rep is:
  Vague or pushy → get shorter and more resistant
  Specific and genuine → warm up one level
  Handles your objection with real proof → warm up more
  4 great exchanges → start asking buying questions
  Ready to close → say yes naturally the way a real person would
- When you say yes it sounds like: "Alright look, how do we do this" | "Okay fine you've got me, what's next" | "Yeah alright let's do it" | "You know what, okay. Walk me through it."

Real phrases people like you say on cold calls:
Resistance: ${patterns.resistance.join(' | ')}
Warming up: ${patterns.warming.join(' | ')}
Ready to buy: ${patterns.buying.join(' | ')}

Example of WRONG response: *sighs* Look I don't know...
Example of RIGHT response: Look I don't know...

Your opening line when the call starts: "${profile.opening_line}"
Respond in ${language}`
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
  const timerRef = useRef(null)
  const oneshotRef = useRef(null)
  const muteRef = useRef(false)
  const loadingRef = useRef(false)
  const isSpeakingRef = useRef(false)
  const voicesRef = useRef([])
  const audioCtxRef = useRef(null)
  const staticRef = useRef(null)
  const profileRef = useRef(null)
  const recognitionRef = useRef(null)
  const voicePersonalityRef = useRef(null)
  const conversationStateRef = useRef('cold')
  const exchangeCountRef = useRef(0)
  const isListeningRef = useRef(false)
  const closePctRef = useRef(30)
  const callMsgRef = useRef([])
  const secsRef = useRef(0)
  const callEndedRef = useRef(false)
  const selectedVoiceIdRef = useRef(null)
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
      console.log('[AMBIENCE] Phone static on')
    } catch (e) { console.log('[AMBIENCE] Skipped') }
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
        console.log('[VOICE] Ready:', v.length, 'voices')
        const en = v.filter(x => x.lang.startsWith('en'))
        console.log('[VOICE] English voices:')
        en.forEach(x => console.log(' -', x.name, x.lang))
      }
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    const t1 = setTimeout(load, 300)
    const t2 = setTimeout(load, 1000)
    const t3 = setTimeout(load, 2000)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      window.speechSynthesis.onvoiceschanged = null
      window.speechSynthesis.cancel()
    }
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
      clearInterval(timerRef.current)
      clearInterval(oneshotRef.current)
      window.speechSynthesis.cancel()
      stopPhoneStatic()
      try { recognitionRef.current?.abort() } catch (e) {}
      if (audioRef.current) { try { audioRef.current.pause() } catch (e) {} }
    }
  }, [])

  // ── Voice helpers ─────────────────────────────────────────────
  const generateVoicePersonality = (gender) => {
    if (gender === 'male') {
      return { baseRate: 0.84 + Math.random() * 0.1, basePitch: 0.88 + Math.random() * 0.1, rateVar: 0.05, pitchVar: 0.05 }
    }
    return { baseRate: 0.90 + Math.random() * 0.1, basePitch: 1.04 + Math.random() * 0.14, rateVar: 0.05, pitchVar: 0.06 }
  }

  const getBestBrowserVoice = (gender = 'female') => {
    const fresh = window.speechSynthesis.getVoices()
    const voices = [...voicesRef.current, ...fresh].filter(
      (v, i, arr) => arr.findIndex(x => x.name === v.name) === i
    )
    if (!voices.length) return null

    const femaleNames = [
      'Google US English',
      'Microsoft Aria Online (Natural)',
      'Microsoft Jenny Online (Natural)',
      'Samantha (Enhanced)', 'Samantha',
      'Karen (Enhanced)', 'Karen',
      'Nicky (Enhanced)', 'Nicky',
      'Allison (Enhanced)', 'Allison',
      'Ava (Enhanced)', 'Ava',
      'Moira', 'Tessa',
    ]
    const maleNames = [
      'Google UK English Male',
      'Microsoft Guy Online (Natural)',
      'Microsoft Davis Online (Natural)',
      'Daniel (Enhanced)', 'Daniel',
      'Alex (Enhanced)', 'Alex',
      'Aaron (Enhanced)', 'Aaron',
      'Tom (Enhanced)', 'Tom',
      'Oliver (Enhanced)', 'Oliver',
      'Gordon',
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

  const resetVoice = () => {
    selectedVoiceIdRef.current = null
    if (audioRef.current) {
      try { audioRef.current.pause() } catch (e) {}
      audioRef.current = null
    }
  }

  const playAudioUrl = (url, text) => {
    return new Promise((resolve) => {
      const audio = new Audio(url)
      audioRef.current = audio

      const maxTime = Math.max((text?.length || 100) * 70, 5000)
      const safety = setTimeout(() => {
        console.warn('[AUDIO] Safety timeout')
        resolve()
      }, maxTime)

      const finish = () => {
        clearTimeout(safety)
        URL.revokeObjectURL(url)
        audioRef.current = null
        resolve()
      }

      audio.onended = () => { console.log('[AUDIO] Playback finished'); finish() }
      audio.onerror = (e) => { console.error('[AUDIO] Playback error:', e); finish() }
      audio.play().catch(err => { console.error('[AUDIO] play() failed:', err); finish() })
    })
  }

  const speakWithBrowserTTS = (text, gender) => {
    return new Promise((resolve) => {
      const humanized = text
        .replace(/\. ([A-Z])/g, '.  $1')
        .replace(/, but /gi, ',  but ')
        .replace(/Well, /gi, 'Well... ')
        .replace(/Look, /gi, 'Look... ')
        .replace(/I mean, /gi, 'I mean... ')
        .replace(/Hmm/gi, 'Hmm...')
        .replace(/Yeah, /gi, 'Yeah... ')

      const utter = new SpeechSynthesisUtterance(humanized)
      const voice = getBestBrowserVoice(gender)
      if (voice) utter.voice = voice

      utter.rate = gender === 'male' ? 0.84 + Math.random() * 0.07 : 0.88 + Math.random() * 0.08
      utter.pitch = gender === 'male' ? 0.86 + Math.random() * 0.08 : 1.02 + Math.random() * 0.1
      utter.volume = 1.0

      console.log('[BROWSER TTS] Rate:', utter.rate.toFixed(2), '| Pitch:', utter.pitch.toFixed(2))

      let done = false
      const finish = () => { if (done) return; done = true; resolve() }

      const safety = setTimeout(finish, Math.max(text.length * 70, 5000))
      const keep = setInterval(() => {
        if (window.speechSynthesis.speaking) { window.speechSynthesis.pause(); window.speechSynthesis.resume() }
        else clearInterval(keep)
      }, 8000)

      utter.onend = () => { clearTimeout(safety); clearInterval(keep); finish() }
      utter.onerror = () => { clearTimeout(safety); clearInterval(keep); finish() }

      window.speechSynthesis.speak(utter)
    })
  }

  const thinkingTime = (text) => Math.min(600 + text.split(' ').length * 30 + Math.random() * 400, 2500)

  // ── Mic permission ────────────────────────────────────────────
  const requestMicPermission = async () => {
    try {
      console.log('[MIC] Requesting permission...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
      console.log('[MIC] Permission granted')
      return true
    } catch (err) {
      console.error('[MIC] Permission denied:', err)
      alert(
        'Microphone access is required for voice training.\n\n' +
        'Please allow microphone access when prompted.\n\n' +
        'On iPhone: Settings → Safari → Microphone → Allow\n' +
        'On Chrome: Click the camera icon in the address bar → Allow'
      )
      return false
    }
  }

  // ── speakText ─────────────────────────────────────────────────
  const speakText = async (text, gender = 'female') => {
    if (!text?.trim()) return
    if (muteRef.current) { console.log('[SPEECH] Muted — skipping'); return }

    window.speechSynthesis.cancel()
    if (audioRef.current) { try { audioRef.current.pause() } catch (e) {}; audioRef.current = null }

    isSpeakingRef.current = true
    setIsSpeaking(true)

    const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY

    if (!selectedVoiceIdRef.current) {
      const voices = gender === 'male' ? ELEVEN_VOICES.male : ELEVEN_VOICES.female
      const picked = voices[Math.floor(Math.random() * voices.length)]
      selectedVoiceIdRef.current = picked
      console.log('[VOICE] Selected ElevenLabs voice:', picked.name)
    }

    if (elevenKey && elevenKey !== 'your_elevenlabs_key_here') {
      try {
        const audioUrl = await textToSpeechElevenLabs(text, selectedVoiceIdRef.current.id, elevenKey)
        if (audioUrl) {
          await playAudioUrl(audioUrl, text)
          isSpeakingRef.current = false
          setIsSpeaking(false)
          return
        }
      } catch (err) {
        console.error('[ELEVEN] Playback failed:', err)
      }
    }

    console.log('[VOICE] Using browser TTS fallback')
    await speakWithBrowserTTS(text, gender)
    isSpeakingRef.current = false
    setIsSpeaking(false)
  }

  // ── Speech recognition ────────────────────────────────────────
  const startListening = () => {
    console.log('[MIC] Called. Speaking:', isSpeakingRef.current)
    if (isSpeakingRef.current === true) { console.log('[MIC] BLOCKED by speaking ref'); return }
    if (isListeningRef.current === true) { console.log('[MIC] Already listening'); return }
    if (callEndedRef.current) return

    console.log('[MIC] Starting...')
    window.speechSynthesis.cancel()

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice requires Chrome or Safari. Please use Chrome.'); return }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.abort()
      } catch (e) {}
      recognitionRef.current = null
    }

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
      console.log('[MIC]', final ? 'FINAL:' : 'interim:', current)
      if (final.trim()) {
        isListeningRef.current = false
        setIsListening(false)
        try { r.stop() } catch (e) {}
        setTimeout(() => handleVoiceInput(final.trim()), 100)
      }
    }

    r.onerror = (e) => {
      console.error('[MIC] Error:', e.error)
      isListeningRef.current = false
      setIsListening(false)
      if (e.error === 'not-allowed') {
        alert('Microphone blocked.\n\niPhone: Settings > Safari > Microphone > Allow\nChrome: Click the lock icon > Allow mic')
      }
      if (e.error === 'no-speech') {
        setTimeout(() => { if (!isSpeakingRef.current && !callEndedRef.current) startListening() }, 800)
      }
    }

    r.onend = () => {
      console.log('[MIC] Ended')
      isListeningRef.current = false
      setIsListening(false)
    }

    recognitionRef.current = r

    setTimeout(() => {
      try {
        r.start()
        console.log('[MIC] start() called')
      } catch (err) {
        console.error('[MIC] start() failed:', err.name, err.message)
        isListeningRef.current = false
        setIsListening(false)
        if (err.name === 'InvalidStateError') {
          setTimeout(() => startListening(), 500)
        }
      }
    }, 100)
  }

  const stopListening = () => {
    console.log('[MIC] Stopping...')
    isListeningRef.current = false
    setIsListening(false)
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
    }
  }

  // ── Prospect generation ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setGeneratingProfile(true)
      try {
        console.log('[PROSPECT] Generating...')
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

  // ── Start call after preview ───────────────────────────────────
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

  // ── Tone detection ────────────────────────────────────────────
  const updateTone = (text, role = 'bot') => {
    const t = text.toLowerCase()
    setClosePct(prev => {
      let p = prev
      if (role === 'bot') {
        if (/that makes sense|actually interesting|not bad|fair enough|good point/.test(t)) p = Math.min(p + 15, 92)
        if (/tell me more|how does|what exactly|okay so|right|uh huh/.test(t)) p = Math.min(p + 8, 92)
        if (/how do we|what's the next step|next step/.test(t)) p = Math.min(p + 22, 96)
        if (/not interested|don't call|stop calling/.test(t)) p = Math.max(p - 25, 5)
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
    if (objKw.some(k => t.includes(k))) { setLastObjection(text); setReframeOpen(true); setReframes(null) }
  }

  const addMsg = (role, text, isBrutal = false) => {
    setMessages(m => [...m, { role, text, isBrutal, ts: Date.now() }])
    if (!isBrutal) {
      const entry = { role, text, time: secsRef.current }
      callMsgRef.current = [...callMsgRef.current, entry]
    }
    if (role === 'bot' && !isBrutal) setLastBotText(text)
  }

  // ── Conversation tracking ─────────────────────────────────────
  const checkForClose = (reply) => {
    const r = reply.toLowerCase()
    return [
      "let's do it", "let's go", "i'm in", "sign me up", "you convinced me",
      "alright fine", "okay fine", "yeah let's", "how do we get started",
      "when can you start", "what do i need to sign", "send me the contract",
      "you've earned it", "you've made your case", "i'll do it",
      "let's move forward", "alright, you've", "okay, you've",
      "alright let's", "yeah let's do", "okay let's do",
    ].some(phrase => r.includes(phrase))
  }

  const analyzeConversationState = (reply) => {
    exchangeCountRef.current += 1
    const r = reply.toLowerCase()
    if (checkForClose(reply)) {
      conversationStateRef.current = 'sold'
      console.log('[CALL] PROSPECT SOLD after', exchangeCountRef.current, 'exchanges')
      setTimeout(() => showCallResults(true), 1500)
      return
    }
    if (/that makes sense|actually interesting|tell me more|how does that|what exactly/.test(r)) {
      if (conversationStateRef.current === 'cold') conversationStateRef.current = 'curious'
      else if (conversationStateRef.current === 'skeptical') conversationStateRef.current = 'interested'
    }
    console.log('[CALL] State:', conversationStateRef.current, '| Exchange:', exchangeCountRef.current)
  }

  // ── Show results / end call ───────────────────────────────────
  const showCallResults = async (dealClosed) => {
    if (callEndedRef.current) return
    callEndedRef.current = true

    clearInterval(timerRef.current)
    clearInterval(oneshotRef.current)
    window.speechSynthesis.cancel()
    if (audioRef.current) { try { audioRef.current.pause() } catch (e) {}; audioRef.current = null }
    isSpeakingRef.current = false; setIsSpeaking(false)
    isListeningRef.current = false; setIsListening(false)
    stopPhoneStatic()
    try { recognitionRef.current?.abort() } catch (e) {}
    loadingRef.current = false; setLoading(false)

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

  // ── Show bot reply ────────────────────────────────────────────
  const showBotReply = async (rawReply, isOpener = false) => {
    try { recognitionRef.current?.abort() } catch (e) {}
    isListeningRef.current = false; setIsListening(false); setTranscript('')

    const delay = isOpener ? 1400 + Math.random() * 400 : 500 + Math.random() * 400
    await new Promise(res => setTimeout(res, delay))

    const cleaned = cleanResponse(rawReply)

    addMsg('bot', cleaned)
    updateTone(cleaned, 'bot')
    const emoji = analyzeMood(cleaned)
    setMoodEmoji(emoji)
    const gender = profileRef.current?.gender || 'female'
    console.log('[CALL] AI response:', cleaned.slice(0, 80))

    await speakText(cleaned, gender)
    // isSpeakingRef.current is now false — safe to listen

    if (emoji === '😡' && !callEndedRef.current) {
      setTimeout(() => showCallResults(false), 2000)
    }
  }

  // ── Start call ────────────────────────────────────────────────
  const startCall = async () => {
    if (!window.speechSynthesis) { alert('Your browser does not support voice. Use Chrome.'); return }

    const hasPermission = await requestMicPermission()
    if (!hasPermission) return

    const p = profileRef.current
    if (!p) return

    resetVoice()
    callEndedRef.current = false
    conversationStateRef.current = 'cold'
    exchangeCountRef.current = 0
    callMsgRef.current = []

    const sys = buildSystemPrompt(p, industry, difficulty, language, mode, persona, customBrain)

    chatRef.current = [{ role: 'user', content: sys + '\n\nThe phone rings. Answer it now.' }]
    loadingRef.current = true; setLoading(true)
    console.log('[CALL] Starting...')

    try {
      const reply = await callClaudeConversation(chatRef.current, 200)
      chatRef.current.push({ role: 'assistant', content: reply })
      console.log('[CALL] Opening line:', reply.slice(0, 60))
      await showBotReply(reply, true)
    } catch (e) {
      console.error('[CALL] Start error:', e)
      addMsg('brutal', '⚠️ Connection error. Check your API key and internet connection.', true)
    }

    loadingRef.current = false; setLoading(false)
    if (!callEndedRef.current) {
      await new Promise(r => setTimeout(r, 300))
      console.log('[MIC] Speaking done. Starting listen.')
      startListening()
    }
  }

  // ── Handle voice input ────────────────────────────────────────
  const handleVoiceInput = async (text) => {
    if (!text || loadingRef.current || callEndedRef.current) return
    console.log('[CALL] User said:', text)
    isListeningRef.current = false; setIsListening(false); setTranscript('')

    const toneScore = analyzeUserTone(text)
    console.log('[TONE] User tone score:', toneScore)

    // Update close probability based on how confident/specific the rep sounds
    setClosePct(prev => {
      const change = (toneScore - 50) * 0.3
      const next = Math.max(5, Math.min(95, prev + change))
      closePctRef.current = next
      return next
    })

    addMsg('usr', text)
    // Send weak responses with a note so AI naturally reacts to rep quality
    const contextualInput = toneScore >= 65 ? text : `[Note: rep sounded uncertain or vague] ${text}`
    chatRef.current.push({ role: 'user', content: contextualInput })

    const userCount = callMsgRef.current.filter(m => m.role === 'usr').length
    updateTone(text, 'usr')
    loadingRef.current = true; setLoading(true)

    if (mode === 'bru' && userCount % 3 === 0) {
      getBrutalFeedback(text).then(fb => {
        addMsg('brutal', '😤 BLITZ: ' + fb.replace(/^(BLITZ:|Blitz:)/i, '').trim(), true)
      }).catch(() => {})
    }

    await new Promise(r => setTimeout(r, thinkingTime(text)))
    console.log('[API] Calling. Messages:', chatRef.current.length)

    try {
      const reply = await callClaudeConversation(chatRef.current, 200)
      chatRef.current.push({ role: 'assistant', content: reply })
      analyzeConversationState(reply)
      if (!callEndedRef.current) {
        await showBotReply(reply, false)
      }
    } catch (e) {
      console.error('[CALL] API error:', e)
      addMsg('brutal', '⚠️ No response. Check your connection.', true)
    }

    loadingRef.current = false; setLoading(false)
    if (!callEndedRef.current) {
      await new Promise(r => setTimeout(r, 300))
      console.log('[MIC] Speaking done. Starting listen.')
      startListening()
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
                setShowResults(false); setResultsData(null); callEndedRef.current = false
                setMessages([]); callMsgRef.current = []; setLastBotText(''); setClosePct(30)
                closePctRef.current = 30; setMoodEmoji('😐'); chatRef.current = []
                setSecs(0); secsRef.current = 0
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
              if (next) { window.speechSynthesis.cancel(); isSpeakingRef.current = false; setIsSpeaking(false) }
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
            onClick={() => { if (isListening) stopListening(); else startListening() }}
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
              if (next) { window.speechSynthesis.cancel(); isSpeakingRef.current = false; setIsSpeaking(false) }
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
    <div className="flex flex-col h-full overflow-y-auto p-4">
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

      <button
        onClick={() => {
          try {
            window.speechSynthesis.cancel()
            const prime = new SpeechSynthesisUtterance('')
            window.speechSynthesis.speak(prime)
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
