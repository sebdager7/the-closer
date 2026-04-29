import React, { useState, useRef, useEffect } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { callClaudeConversation, getBrutalFeedback, getReframes, runAutopsy, generateProspectProfile } from '../utils/api'
import { TRAINING_MODES, DIFFICULTY_MAP, INDUSTRIES, PROSPECTS, PROSPECT_NAMES } from '../data/constants'
import { vibrateBlitz, zapSound } from '../utils/blitz'
import { TrophyEmoji, LightningEmoji, FireEmoji } from '../components/icons/CustomEmoji'

// ─── DEAL AUTOPSY ─────────────────────────────────────────────────────────────
function AutopsyScreen({ data, dealValue, closePct, onRetry, onBack }) {
  const isWin = data.score >= 70, isMid = data.score >= 40
  const cls = isWin ? 'border-green-500 text-green-400 bg-green-500/10' : isMid ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-red-500 text-red-400 bg-red-500/10'

  useEffect(() => { vibrateBlitz(100); if (isWin) zapSound() }, [])

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-3">
      <div className="bg-navy-800/60 border border-white/10 rounded-2xl p-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-2 ${cls}`}>
          {data.score}
        </div>
        <h3 className="text-base font-bubble text-white mb-1">
          {isWin ? <><TrophyEmoji size={18}/> Deal Closed!</> : isMid ? <><LightningEmoji size={16}/> Almost — Close Call</> : '❌ Deal Lost'}
        </h3>
        <p className="text-xs text-white/50 leading-relaxed">{data.overall_feedback}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { v: data.close_probability + '%', l: 'Close Prob', cls: isWin ? 'text-green-400' : isMid ? 'text-closer-blue' : 'text-red-400' },
          { v: '$' + (data.potential_value || dealValue).toLocaleString(), l: 'Deal Value', cls: 'text-closer-blue' },
          { v: data.value_lost > 0 ? '-$' + data.value_lost.toLocaleString() : 'Closed!', l: 'Impact', cls: data.value_lost > 0 ? 'text-red-400' : 'text-green-400' },
        ].map(s => (
          <div key={s.l} className="bg-navy-800/60 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-base font-bold ${s.cls}`}>{s.v}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <BlitzBar message={data.blitz_coaching} vibrate />

      <div>
        <div className="text-[9px] font-bubble text-white/40 uppercase tracking-widest mb-2">Call Replay — Key Moments</div>
        {(data.key_moments || []).map((m, i) => (
          <div key={i} className={`border rounded-xl p-3 mb-2 ${m.type === 'bad' ? 'border-l-2 border-l-red-500 border-white/10' : 'border-l-2 border-l-green-500 border-white/10'} bg-navy-800/40`}>
            <div className={`text-[8px] font-bold uppercase tracking-wider mb-1 ${m.type === 'bad' ? 'text-red-400' : 'text-green-400'}`}>
              {m.type === 'bad' ? '⚠️ WEAK' : '✅ STRONG'} · {m.time}
            </div>
            <p className="text-[10px] text-white/50 italic mb-2">"{m.what_said}"</p>
            <p className="text-xs text-white/80 leading-relaxed">
              {m.type === 'bad' ? <><strong className="text-closer-blue">Elite version:</strong> "{m.better_version}"</> : <><strong className="text-green-400">Build on it:</strong> {m.build_on}</>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3">
          <div className="text-[8px] font-bubble text-red-400 uppercase tracking-wider mb-1">Biggest Mistake</div>
          <p className="text-[10px] text-white/70 leading-relaxed">{data.biggest_mistake}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-3">
          <div className="text-[8px] font-bubble text-green-400 uppercase tracking-wider mb-1">Top Strength</div>
          <p className="text-[10px] text-white/70 leading-relaxed">{data.top_strength}</p>
        </div>
      </div>

      <div className="flex gap-3 pb-2">
        <button onClick={onRetry} className="flex-1 py-3 bg-closer-blue text-white font-bubble rounded-xl text-sm">↺ Retry this call</button>
        <button onClick={onBack} className="flex-1 py-3 bg-white/10 border border-white/15 text-white/60 font-bubble rounded-xl text-sm">← Back</button>
      </div>
    </div>
  )
}

// ─── PROSPECT PREVIEW ─────────────────────────────────────────────────────────
function ProspectPreview({ profile }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col h-full items-center justify-center p-5 bg-navy-950">
      <div className="text-center mb-5">
        <p className="text-[10px] font-bubble text-gold-400 uppercase tracking-widest mb-2">
          📞 Call starting in {countdown}s...
        </p>
        <div className="w-16 h-16 rounded-full bg-closer-blue/20 border-2 border-closer-blue flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
          {profile.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <h2 className="text-xl font-bubble text-white">{profile.name}</h2>
        <p className="text-sm text-white/60">{profile.age} · {profile.occupation}</p>
        <p className="text-xs text-white/40">{profile.location}</p>
      </div>

      <div className="w-full bg-navy-800/70 border border-white/10 rounded-2xl p-4 space-y-3 max-w-xs">
        <div>
          <div className="text-[8px] font-bubble text-gold-400 uppercase tracking-wider mb-1">Today's mood</div>
          <p className="text-xs text-white/80 leading-relaxed">{profile.mood_today}</p>
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
          <p className="text-[10px] text-white/60 italic">"{profile.speech_pattern}"</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {[3, 2, 1].map(n => (
          <div key={n} className={`w-2 h-2 rounded-full transition-all duration-300 ${countdown === n ? 'bg-gold-400 scale-125' : countdown < n ? 'bg-white/20' : 'bg-closer-blue'}`} />
        ))}
      </div>
    </div>
  )
}

// ─── CALL SCREEN ──────────────────────────────────────────────────────────────
const MOOD_MAP = [
  { pattern: /hang up|stop calling|remove me|don't call|not calling back/i, emoji: '😡' },
  { pattern: /annoyed|frustrated|gotta go|got to go|busy right now|waste.*time/i,  emoji: '😤' },
  { pattern: /not sure|expensive|think about|budget|spouse|not ready|maybe later/i, emoji: '🤨' },
  { pattern: /hmm|interesting|tell me more|how does|could be|possibly|not bad/i, emoji: '🤔' },
  { pattern: /sounds good|i like|makes sense|could work|sure|okay.*give/i, emoji: '😊' },
  { pattern: /let's do|i'll take|sign me up|ready|how do we|yes.*deal/i, emoji: '🤑' },
]

function analyzeMood(text) {
  for (const { pattern, emoji } of MOOD_MAP) {
    if (pattern.test(text)) return emoji
  }
  return '😐'
}

function getHumanVoice(gender = 'female') {
  const voices = window.speechSynthesis?.getVoices() || []
  const femalePriority = ['Google US English', 'Google UK English Female', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona']
  const malePriority   = ['Google US English', 'Google UK English Male', 'Daniel', 'Alex', 'Tom', 'Fred']
  const priority = gender === 'female' ? femalePriority : malePriority
  for (const name of priority) {
    const match = voices.find(v => v.name === name || v.name.startsWith(name))
    if (match) return match
  }
  const eng = voices.filter(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('espeak'))
  return eng[0] || voices[0] || null
}

function CallScreen({ mode, industry, persona, difficulty, dealValue, language, customBrain, onEnd }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [secs, setSecs] = useState(0)
  const [closePct, setClosePct] = useState(30)
  const [mood, setMood] = useState({ label: 'Neutral', cls: 'bg-blue-900/60 text-blue-300' })
  const [moodEmoji, setMoodEmoji] = useState('😐')
  const [oneShotSecs, setOneShotSecs] = useState(90)
  const [reframeOpen, setReframeOpen] = useState(false)
  const [reframeLoading, setReframeLoading] = useState(false)
  const [reframes, setReframes] = useState(null)
  const [lastObjection, setLastObjection] = useState('')
  const [callMsgs, setCallMsgs] = useState([])
  const [autopsy, setAutopsy] = useState(null)
  const [autopsyLoading, setAutopsyLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [micState, setMicState] = useState('idle')
  const [interimText, setInterimText] = useState('')
  const [holdToTalk, setHoldToTalk] = useState(false)
  const [prospectProfile, setProspectProfile] = useState(null)
  const [showPreview, setShowPreview] = useState(true)
  const [generatingProfile, setGeneratingProfile] = useState(true)
  const [callConnected, setCallConnected] = useState(false)

  const chatRef = useRef([])
  const msgsEndRef = useRef(null)
  const timerRef = useRef(null)
  const oneshotRef = useRef(null)
  const muteRef = useRef(false)
  const audioCtxRef = useRef(null)
  const staticRef = useRef(null)
  const profileRef = useRef(null)
  const prospectGenderRef = useRef('female')
  const recognitionRef = useRef(null)
  const canvasRef = useRef(null)
  const analyserRef = useRef(null)
  const waveStreamRef = useRef(null)
  const animFrameRef = useRef(null)

  // ── Phone static ──────────────────────────────────────────────
  const startPhoneStatic = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf; src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'; filter.frequency.value = 1400; filter.Q.value = 0.6
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0.015
      src.connect(filter); filter.connect(gainNode); gainNode.connect(ctx.destination)
      src.start()
      staticRef.current = src
    } catch (e) {}
  }

  const stopPhoneStatic = () => {
    try { staticRef.current?.stop() } catch (e) {}
    try { audioCtxRef.current?.close() } catch (e) {}
  }

  // ── Waveform visualizer ──────────────────────────────────────
  const startWaveform = async () => {
    if (!canvasRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      waveStreamRef.current = stream
      const wCtx = new (window.AudioContext || window.webkitAudioContext)()
      const src = wCtx.createMediaStreamSource(stream)
      const analyser = wCtx.createAnalyser()
      analyser.fftSize = 512
      src.connect(analyser)
      analyserRef.current = { analyser, ctx: wCtx }
      const canvas = canvasRef.current
      const cCtx = canvas.getContext('2d')
      const buf = new Uint8Array(analyser.frequencyBinCount)
      const draw = () => {
        animFrameRef.current = requestAnimationFrame(draw)
        if (!canvasRef.current) return
        analyser.getByteTimeDomainData(buf)
        cCtx.clearRect(0, 0, canvas.width, canvas.height)
        cCtx.strokeStyle = '#1a6bbf'
        cCtx.lineWidth = 2.5
        cCtx.beginPath()
        const sw = canvas.width / buf.length
        let x = 0
        buf.forEach((val, i) => {
          const y = (val / 128) * (canvas.height / 2)
          if (i === 0) cCtx.moveTo(x, y); else cCtx.lineTo(x, y)
          x += sw
        })
        cCtx.stroke()
      }
      draw()
    } catch (e) {}
  }

  const stopWaveform = () => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null }
    try { analyserRef.current?.ctx?.close() } catch (e) {}
    try { waveStreamRef.current?.getTracks().forEach(t => t.stop()) } catch (e) {}
    waveStreamRef.current = null; analyserRef.current = null
    if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  // ── Voice synthesis ──────────────────────────────────────────
  const speakMessage = (text, isOpener = false) => {
    if (muteRef.current || !window.speechSynthesis) return
    const delayMs = isOpener ? 1500 + Math.random() * 500 : 700 + Math.random() * 600
    const gender = prospectGenderRef.current

    setTimeout(() => {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate   = gender === 'female' ? 0.95 : 0.9
      utter.pitch  = gender === 'female' ? 1.1  : 0.88
      utter.volume = 1.0

      const doSpeak = () => {
        const v = getHumanVoice(gender)
        if (v) utter.voice = v
        utter.onstart = () => setIsSpeaking(true)
        utter.onend   = () => setIsSpeaking(false)
        utter.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utter)
      }

      if ((window.speechSynthesis.getVoices() || []).length > 0) doSpeak()
      else window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
    }, delayMs)
  }

  const toggleMute = () => {
    const next = !isMuted
    muteRef.current = next
    setIsMuted(next)
    if (next) { window.speechSynthesis?.cancel(); setIsSpeaking(false) }
  }

  // ── Voice recognition ────────────────────────────────────────
  const startListening = () => {
    if (loading) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setMicState('unsupported'); return }
    window.speechSynthesis?.cancel(); setIsSpeaking(false)
    const r = new SR()
    r.continuous = false; r.interimResults = true; r.lang = 'en-US'
    r.onstart = () => { setMicState('listening'); setTimeout(() => startWaveform(), 80) }
    r.onresult = (event) => {
      let interim = '', final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript
        else interim += event.results[i][0].transcript
      }
      setInterimText(interim || final)
      if (final) {
        setInterimText('')
        try { r.abort() } catch (e) {}
        handleVoiceSend(final.trim())
      }
    }
    r.onerror = (e) => {
      setMicState(e.error === 'not-allowed' ? 'error' : 'idle')
      setInterimText(''); stopWaveform()
    }
    r.onend = () => { setMicState(s => s === 'error' ? 'error' : 'idle'); stopWaveform() }
    recognitionRef.current = r
    try { r.start() } catch (e) { setMicState('idle') }
  }

  const handleMicClick = () => {
    if (micState === 'listening') {
      try { recognitionRef.current?.stop() } catch (e) {}
    } else {
      startListening()
    }
  }

  // ── Generate prospect profile ────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setGeneratingProfile(true)
      try {
        const profile = await generateProspectProfile(industry, difficulty)
        if (!cancelled) {
          const gender = Math.random() > 0.5 ? 'female' : 'male'
          prospectGenderRef.current = gender
          profileRef.current = profile
          setProspectProfile(profile)
        }
      } catch (e) {
        if (!cancelled) {
          const gender = Math.random() > 0.5 ? 'female' : 'male'
          prospectGenderRef.current = gender
          const nameList = PROSPECT_NAMES[gender] || PROSPECT_NAMES.female
          const fb = nameList[Math.floor(Math.random() * nameList.length)]
          const fallback = {
            name: fb[0], age: 42, occupation: 'Business Owner', location: 'Phoenix, AZ',
            personality: 'Direct and skeptical. Values their time above all else.',
            mood_today: 'Busy and slightly stressed — in the middle of a workday.',
            main_objection: 'Budget concerns and time constraints.',
            trigger_to_buy: 'Clear ROI with specific numbers and fast results.',
            speech_pattern: 'Short, direct answers. Few pleasantries. Gets to the point.',
            backstory: 'Has dealt with many salespeople. Usually hangs up in 30 seconds.',
            opening_line: 'Yeah?',
          }
          profileRef.current = fallback
          setProspectProfile(fallback)
        }
      }
      if (!cancelled) setGeneratingProfile(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ── Start call after preview ─────────────────────────────────
  useEffect(() => {
    if (!prospectProfile || showPreview) return
    let t
    // Wait a tick then start
    t = setTimeout(() => {
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

  // ── Auto-advance preview after 3 s ──────────────────────────
  useEffect(() => {
    if (!prospectProfile) return
    const t = setTimeout(() => setShowPreview(false), 3000)
    return () => clearTimeout(t)
  }, [prospectProfile])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(oneshotRef.current)
      window.speechSynthesis?.cancel()
      stopPhoneStatic()
      try { recognitionRef.current?.abort() } catch (e) {}
      stopWaveform()
    }
  }, [])

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const updateTone = (text) => {
    const t = text.toLowerCase()
    const TONE_RULES = [
      { kws: ["let's do it", "i'll take it", "sign me up", "ready to start", "how do we get started", "yes deal", "where do i sign", "let's move forward"], delta: 25 },
      { kws: ["sounds good", "i like that", "makes sense", "could work", "that's fair", "i'm in", "okay i'm open", "fair enough", "that's interesting"], delta: 15 },
      { kws: ["tell me more", "how does it work", "what's included", "walk me through", "could be", "not bad", "what are my options", "explain that"], delta: 10 },
      { kws: ["hmm", "maybe", "possibly", "i suppose", "not sure yet", "i'll consider it"], delta: 3 },
      { kws: ["need to think", "think about it", "call me back later", "not right now", "maybe later", "not today", "talk to my", "check with my"], delta: -8 },
      { kws: ["expensive", "too much", "over budget", "can't afford", "price is too high", "not in the budget", "costs too much"], delta: -12 },
      { kws: ["not interested", "don't need it", "stop calling me", "no thanks", "happy with what i have", "already have something", "not looking"], delta: -20 },
      { kws: ["hang up", "leave me alone", "don't ever call again", "remove me", "waste of my time", "goodbye", "get out"], delta: -28 },
    ]

    let delta = 0
    for (const rule of TONE_RULES) {
      if (rule.kws.some(k => t.includes(k))) { delta = rule.delta; break }
    }

    setClosePct(prev => {
      const next = Math.max(5, Math.min(98, prev + delta))
      if (next >= 70) setMood({ label: 'Warming up', cls: 'bg-green-900/60 text-green-300' })
      else if (next >= 45) setMood({ label: 'Neutral', cls: 'bg-blue-900/60 text-blue-300' })
      else if (next >= 25) setMood({ label: 'Skeptical', cls: 'bg-yellow-900/60 text-yellow-300' })
      else setMood({ label: 'Frustrated', cls: 'bg-red-900/60 text-red-300' })
      return next
    })

    const objKw = ['think about', 'expensive', 'too much', 'not interested', 'call back', 'spouse', 'budget', 'not now', "can't afford", 'price is', 'not ready', 'over budget']
    if (objKw.some(k => t.includes(k))) { setLastObjection(text); setReframeOpen(true); setReframes(null) }
  }

  const addMsg = (role, text, isBrutal = false) => {
    setMessages(m => [...m, { role, text, isBrutal, ts: Date.now() }])
    if (!isBrutal) setCallMsgs(m => [...m, { role, text, time: secs }])
  }

  const showBotReply = async (reply, isOpener = false) => {
    try { recognitionRef.current?.abort() } catch (e) {}
    setMicState(s => s === 'error' ? 'error' : 'idle')
    setInterimText(''); stopWaveform()
    const delay = isOpener ? 1600 + Math.random() * 500 : 700 + Math.random() * 600
    await new Promise(res => setTimeout(res, delay))
    addMsg('bot', reply)
    updateTone(reply)
    const emoji = analyzeMood(reply)
    setMoodEmoji(emoji)
    speakMessage(reply, isOpener)
    if (emoji === '😡') {
      setTimeout(() => handleEnd(), 3000)
    }
  }

  const startCall = async () => {
    const p = profileRef.current
    if (!p) return
    const brainCtx = customBrain.offer ? `\nRep sells: ${customBrain.offer}. ICP: ${customBrain.icp}.` : ''
    const extras = { bru: '\nBRUTAL MODE: Be very skeptical and call out every weak word.', one: '\nONE SHOT: Highly resistant. Shut down fast if they blow the opening.', std: '', rfm: '' }
    const sys = `You are ${p.name}, ${p.age} years old, ${p.occupation} from ${p.location}.
Personality: ${p.personality}
Today's mood: ${p.mood_today}
Backstory: ${p.backstory}
Speech pattern: ${p.speech_pattern}
${brainCtx}${extras[mode] || ''}
You are receiving an unexpected ${industry} sales call. Be a REAL human — not a helpful assistant.

REACTIONS:
- Start with your opening line: "${p.opening_line}"
- Main objection when they pitch: ${p.main_objection}
- What would make you buy: ${p.trigger_to_buy}

HUMAN SPEECH — use these naturally:
- Filler words when hesitant: "um", "uh", "I mean", "you know", "so...", "honestly"
- Pause reactions: "Hmm..." or "..." before answering tough questions
- Good-point reactions: "Okay, I'll give you that", "That's... actually fair", "Huh, interesting"
- Weak-pitch reactions: "Look, I really gotta get back to work", "Yeah I've heard that before", "Uh huh..."
- Mid-thought changes: "Actually — wait, what was that price again?"

MOOD ESCALATION:
- Rep shows real specific value + numbers → warm up one level, show genuine interest
- Rep is vague, uses filler, sounds scripted → pull back, get slightly more dismissive
- Rep pushes after clear objection → pull back further, mention family or time
- Rep genuinely acknowledges your concern → stay engaged, give them more time
- If pushed too hard twice → threaten to hang up or simply say goodbye

- NEVER say you're an AI. You ARE ${p.name}. Stay fully in character.
- Keep responses 1-3 sentences — real phone call rhythm. No bullet points. No long speeches.
- Difficulty: ${difficulty}. Harder = more resistant, more skeptical, shorter answers.
Respond in ${language}. Start with your opening line now.`

    chatRef.current = [{ role: 'user', content: sys + `\n\n[Call starting. Respond in ${language}.]` }]
    setLoading(true)
    try {
      const reply = await callClaudeConversation(chatRef.current, 200)
      chatRef.current.push({ role: 'assistant', content: reply })
      await showBotReply(reply, true)
    } catch (e) {
      addMsg('brutal', '⚠️ Connection error. Check your API key and internet, then restart the call.', true)
    }
    setLoading(false)
  }

  const handleTextSend = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    handleVoiceSend(text)
  }

  const handleVoiceSend = async (text) => {
    if (!text || loading) return
    setMicState('idle'); setInterimText(''); stopWaveform()
    addMsg('usr', text)
    chatRef.current.push({ role: 'user', content: text })
    const userCount = callMsgs.filter(m => m.role === 'usr').length + 1
    setLoading(true)
    if (mode === 'bru' && userCount % 3 === 0) {
      getBrutalFeedback(text).then(fb => {
        addMsg('brutal', '😤 BLITZ: ' + fb.replace(/^(BLITZ:|Blitz:)/i, '').trim(), true)
      }).catch(() => {})
    }
    try {
      const reply = await callClaudeConversation(chatRef.current, 200)
      chatRef.current.push({ role: 'assistant', content: reply })
      await showBotReply(reply, false)
    } catch (e) {
      addMsg('brutal', '⚠️ No response. Check your connection and try again.', true)
    }
    setLoading(false)
  }

  const handleEnd = async () => {
    clearInterval(timerRef.current); clearInterval(oneshotRef.current)
    window.speechSynthesis?.cancel(); setIsSpeaking(false)
    stopPhoneStatic()
    if (callMsgs.length >= 4) {
      setAutopsyLoading(true)
      const transcript = callMsgs.map(m => `${m.role === 'usr' ? 'REP' : 'PROSPECT'} [${Math.floor(m.time / 60)}:${(m.time % 60).toString().padStart(2, '0')}]: ${m.text}`).join('\n')
      try {
        const data = await runAutopsy(transcript, closePct, dealValue)
        setAutopsy(data)
      } catch (e) { onEnd(closePct) }
      setAutopsyLoading(false)
    } else {
      onEnd(closePct)
    }
  }

  const loadReframes = async () => {
    if (!lastObjection) return
    setReframeLoading(true)
    try { const data = await getReframes(lastObjection, language); setReframes(data) } catch (e) {}
    setReframeLoading(false)
  }

  const fmt = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0')
  const toneColor = closePct >= 70 ? '#22c55e' : closePct >= 40 ? '#f59e0b' : '#ef4444'
  const toneStatus = closePct >= 80 ? '🔥 HOT — push the close now' : closePct >= 60 ? 'Warming — keep building value' : closePct >= 35 ? 'Neutral — more conviction needed' : closePct >= 15 ? 'Cold — use empathy now' : '❌ Shutting down — reframe immediately'
  const prospectName = prospectProfile?.name || 'Prospect'

  // ── Loading profile screen
  if (generatingProfile) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <BlitzIcon size={42} className="mb-4" />
        <p className="text-white font-bubble text-base mb-1">Building your prospect...</p>
        <p className="text-white/40 text-sm">Generating a real character profile</p>
        <div className="flex gap-1.5 mt-4">
          {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-closer-blue/60 typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
      </div>
    )
  }

  // ── Prospect preview screen
  if (showPreview && prospectProfile) {
    return <ProspectPreview profile={prospectProfile} />
  }

  // ── Autopsy loading screen
  if (autopsyLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <div className="text-3xl mb-4">🔍</div>
        <BlitzIcon size={52} className="mb-3" />
        <p className="text-white font-bubble text-base mb-1">Blitz is analyzing your call...</p>
        <p className="text-white/40 text-sm">Building your full Deal Autopsy</p>
      </div>
    )
  }

  if (autopsy) {
    return <AutopsyScreen data={autopsy} dealValue={dealValue} closePct={closePct} onRetry={() => onEnd(closePct, true)} onBack={() => onEnd(closePct)} />
  }

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
          <button onClick={toggleMute} className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-white/10 text-white hover:bg-white/20" title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={() => setHoldToTalk(h => !h)} className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${holdToTalk ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'bg-white/10 text-white/50 hover:bg-white/20'}`} title="Switch mic mode">
            {holdToTalk ? 'HOLD' : 'TAP'}
          </button>
          <button onClick={() => onEnd(closePct, 'restart')} className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-white/10 text-white hover:bg-white/20">↺</button>
          <button onClick={handleEnd} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-red-700 text-white hover:bg-red-600">✕ End</button>
        </div>
      </div>

      {/* One Shot bar */}
      {mode === 'one' && (
        <div className="h-1.5 bg-white/10 flex-shrink-0">
          <div className="h-full countdown-gradient rounded-r transition-all" style={{ width: `${(oneShotSecs / 90) * 100}%` }} />
        </div>
      )}

      {/* Tone bar */}
      <div className="px-4 py-1.5 bg-gray-900/80 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 mb-0.5">
          <span className="text-[9px] text-white/40 font-bold w-9 flex-shrink-0">Tone</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${closePct}%`, background: toneColor }} />
          </div>
          <span className="text-[9px] font-bold w-9 text-right flex-shrink-0" style={{ color: toneColor }}>{closePct}%</span>
        </div>
        <p className="text-[9px] text-white/40 italic">{toneStatus}</p>
      </div>

      {/* Prospect card */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/60 border-b border-white/10 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-closer-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {prospectProfile?.name?.split(' ').map(w => w[0]).join('').slice(0,2) || '??'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            {prospectName}
            {isSpeaking && <BlitzIcon size={12} className="blitz-speaking" />}
          </p>
          <p className="text-[10px] text-white/40 truncate">{prospectProfile?.occupation || persona}</p>
        </div>
        {/* Mood indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-base">{moodEmoji}</span>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${mood.cls}`}>{mood.label}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'usr' ? 'justify-end' : m.isBrutal ? 'justify-center' : 'justify-start'}`}>
            {m.isBrutal ? (
              <div className="max-w-[90%] bg-red-900/40 border border-red-500/50 rounded-xl px-3 py-2 text-xs text-red-300 font-bold text-center">{m.text}</div>
            ) : (
              <div className="max-w-[80%]">
                <p className="text-[9px] text-white/30 mb-1">{m.role === 'usr' ? 'You' : prospectName}</p>
                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'usr' ? 'bg-closer-blue text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>{m.text}</div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1.5 items-center">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      {/* Voice controls */}
      <div className="flex flex-col items-center gap-2 px-4 pt-3 pb-4 bg-gray-900 border-t border-white/10 flex-shrink-0">
        {interimText ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-sm text-white/80 italic w-full text-center">
            "{interimText}"
          </div>
        ) : null}
        <canvas ref={canvasRef} width={280} height={28} className={`w-full rounded opacity-80 ${micState === 'listening' ? '' : 'hidden'}`} />
        {micState === 'error' && (
          <p className="text-xs text-red-400 text-center">Microphone access is required. Enable in browser settings.</p>
        )}
        {micState === 'unsupported' && (
          <p className="text-xs text-yellow-400 text-center">Voice training requires Chrome or Safari.</p>
        )}
        <button
          onPointerDown={holdToTalk ? (e) => { e.preventDefault(); startListening() } : undefined}
          onPointerUp={holdToTalk ? () => { try { recognitionRef.current?.stop() } catch (e) {} } : undefined}
          onClick={!holdToTalk ? handleMicClick : undefined}
          disabled={loading || micState === 'unsupported'}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all disabled:opacity-30 ${
            micState === 'listening'
              ? 'bg-red-600 scale-110 shadow-xl shadow-red-500/50 mic-pulse'
              : micState === 'error'
              ? 'bg-red-900/50 border-2 border-red-500/50'
              : isSpeaking
              ? 'bg-navy-700 border border-white/20'
              : 'bg-closer-blue hover:bg-blue-600 active:scale-95'
          }`}
        >
          {micState === 'listening' ? '🎙' : micState === 'error' ? '⚠️' : isSpeaking ? '🔇' : '🎤'}
        </button>
        <p className="text-[9px] text-white/30">
          {micState === 'listening'
            ? (holdToTalk ? 'Release to send' : 'Listening... tap to stop')
            : isSpeaking ? 'AI speaking...'
            : holdToTalk ? 'Hold to speak' : 'Tap to speak'}
        </p>

        {/* Text input fallback */}
        <div className="flex gap-2 w-full mt-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleTextSend() }}
            placeholder="Or type your response..."
            className="flex-1 bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-closer-blue"
          />
          <button
            onClick={handleTextSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-closer-blue/80 text-white font-bold rounded-xl text-xs disabled:opacity-40 hover:bg-closer-blue transition-colors"
          >
            Send
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

      <button onClick={() => setInCall(true)} className="w-full py-3.5 bg-closer-blue text-white font-bubble text-sm rounded-xl hover:bg-blue-600 transition-colors">
        ▶ Start Training Call
      </button>
    </div>
  )
}
