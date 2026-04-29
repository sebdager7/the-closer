import React, { useState, useRef, useEffect } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { callClaudeConversation, getBrutalFeedback, getReframes, runAutopsy } from '../utils/api'
import { TRAINING_MODES, DIFFICULTY_MAP, INDUSTRIES, PROSPECTS, PROSPECT_NAMES } from '../data/constants'
import { vibrateBlitz } from '../utils/blitz'

// ─── DEAL AUTOPSY ─────────────────────────────────────────────────────────────
function AutopsyScreen({ data, dealValue, closePct, onRetry, onBack }) {
  const isWin = data.score >= 70, isMid = data.score >= 40
  const cls = isWin ? 'border-green-500 text-green-400 bg-green-500/10' : isMid ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-red-500 text-red-400 bg-red-500/10'

  useEffect(() => { vibrateBlitz(100) }, [])

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-3 font-dm-mono">
      {/* Hero */}
      <div className="bg-navy-800/60 border border-white/10 rounded-2xl p-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-3 ${cls}`}>
          {data.score}
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {isWin ? '🏆 Deal Closed!' : isMid ? '⚡ Almost — Close Call' : '❌ Deal Lost'}
        </h3>
        <p className="text-xs text-white/50 leading-relaxed">{data.overall_feedback}</p>
      </div>

      {/* Revenue grid */}
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

      {/* Blitz coaching */}
      <BlitzBar message={data.blitz_coaching} vibrate />

      {/* Key moments */}
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Call Replay — Key Moments</div>
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

      {/* Mistake / Strength */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3">
          <div className="text-[8px] font-bold text-red-400 uppercase tracking-wider mb-1">Biggest Mistake</div>
          <p className="text-[10px] text-white/70 leading-relaxed">{data.biggest_mistake}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-3">
          <div className="text-[8px] font-bold text-green-400 uppercase tracking-wider mb-1">Top Strength</div>
          <p className="text-[10px] text-white/70 leading-relaxed">{data.top_strength}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-2">
        <button onClick={onRetry} className="flex-1 py-3 bg-closer-blue text-white font-bold rounded-xl text-sm">↺ Retry this call</button>
        <button onClick={onBack} className="flex-1 py-3 bg-white/10 border border-white/15 text-white/60 font-bold rounded-xl text-sm">← Back</button>
      </div>
    </div>
  )
}

// ─── CALL SCREEN ──────────────────────────────────────────────────────────────
function CallScreen({ mode, industry, persona, difficulty, dealValue, language, customBrain, onEnd }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [secs, setSecs] = useState(0)
  const [closePct, setClosePct] = useState(30)
  const [mood, setMood] = useState({ label: 'Neutral', cls: 'bg-blue-900/60 text-blue-300' })
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
  const chatRef = useRef([])
  const msgsEndRef = useRef(null)
  const timerRef = useRef(null)
  const oneshotRef = useRef(null)
  const muteRef = useRef(false)
  const prospect = PROSPECT_NAMES[Math.floor(Math.random() * PROSPECT_NAMES.length)]
  const prospectRef = useRef(prospect)

  // ── Voice synthesis ──────────────────────────────────────────────
  const speakMessage = (text) => {
    if (muteRef.current || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 1.0
    utter.pitch = 1.0
    utter.volume = 1.0

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.name === 'Google US English')
        || voices.find(v => v.name === 'Samantha')
        || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('espeak'))
        || voices.find(v => v.lang.startsWith('en'))
      if (voice) utter.voice = voice
      utter.onstart = () => setIsSpeaking(true)
      utter.onend = () => setIsSpeaking(false)
      utter.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utter)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak()
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
    }
  }

  const toggleMute = () => {
    const next = !isMuted
    muteRef.current = next
    setIsMuted(next)
    if (next) { window.speechSynthesis?.cancel(); setIsSpeaking(false) }
  }

  useEffect(() => {
    vibrateBlitz([40, 40, 40, 40, 40])
    timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
    if (mode === 'one') {
      oneshotRef.current = setInterval(() => setOneShotSecs(s => {
        if (s <= 1) { clearInterval(oneshotRef.current); return 0 }
        return s - 1
      }), 1000)
    }
    startCall()
    return () => {
      clearInterval(timerRef.current)
      clearInterval(oneshotRef.current)
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const updateTone = (text, role) => {
    const t = text.toLowerCase()
    setClosePct(prev => {
      let p = prev
      if (role === 'bot') {
        if (t.includes('not interested') || t.includes('leave') || t.includes('frustrated')) p = Math.max(p - 18, 5)
        else if (t.includes('not sure') || t.includes('expensive') || t.includes('think about')) p = Math.max(p - 8, 5)
        else if (t.includes('tell me more') || t.includes('interesting') || t.includes('how does')) p = Math.min(p + 10, 90)
        else if (t.includes("let's do") || t.includes("i'll take") || t.includes("sounds good")) p = Math.min(p + 25, 98)
      } else {
        if (t.includes('i understand') || t.includes('i hear you')) p = Math.min(p + 5, 90)
        if (t.includes('um ') || t.includes('uh ')) p = Math.max(p - 3, 5)
      }
      return p
    })
    const objKw = ['think about', 'expensive', 'too much', 'not interested', 'call back', 'spouse', 'budget', 'not now', "can't afford", 'price is', 'not ready']
    if (role === 'bot' && objKw.some(k => t.includes(k))) { setLastObjection(text); setReframeOpen(true); setReframes(null) }
    if (closePct >= 70) setMood({ label: 'Warming up', cls: 'bg-green-900/60 text-green-300' })
    else if (closePct >= 45) setMood({ label: 'Neutral', cls: 'bg-blue-900/60 text-blue-300' })
    else if (closePct >= 25) setMood({ label: 'Skeptical', cls: 'bg-yellow-900/60 text-yellow-300' })
    else setMood({ label: 'Frustrated', cls: 'bg-red-900/60 text-red-300' })
  }

  const addMsg = (role, text, isBrutal = false) => {
    setMessages(m => [...m, { role, text, isBrutal, ts: Date.now() }])
    if (!isBrutal) setCallMsgs(m => [...m, { role, text, time: secs }])
  }

  const startCall = async () => {
    const p = prospectRef.current
    const brainCtx = customBrain.offer ? `\nRep sells: ${customBrain.offer}. ICP: ${customBrain.icp}.` : ''
    const extras = { bru: '\nBRUTAL MODE: Be very skeptical. Call out vague statements.', one: '\nONE SHOT: Highly resistant. Shut down if they blow the opening.', std: '', rfm: '' }
    const sys = `You are ${p[0]}, a real sales prospect in ${industry}. Personality: ${persona}. Difficulty: ${difficulty}. Respond in ${language}.${brainCtx}${extras[mode] || ''} Be human. React to quality. Give real objections. Only buy after 4+ strong responses. Keep replies 1-3 sentences. Start by answering the door/phone.`
    chatRef.current = [{ role: 'user', content: sys + '\n\n[Start in ' + language + '.]' }]
    setLoading(true)
    try {
      const reply = await callClaudeConversation(chatRef.current, 200)
      chatRef.current.push({ role: 'assistant', content: reply })
      addMsg('bot', reply)
      updateTone(reply, 'bot')
      speakMessage(reply)
    } catch (e) { }
    setLoading(false)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
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
      addMsg('bot', reply)
      updateTone(reply, 'bot')
      speakMessage(reply)
    } catch (e) { }
    setLoading(false)
  }

  const handleEnd = async () => {
    clearInterval(timerRef.current); clearInterval(oneshotRef.current)
    window.speechSynthesis?.cancel(); setIsSpeaking(false)
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
    try {
      const data = await getReframes(lastObjection, language)
      setReframes(data)
    } catch (e) { }
    setReframeLoading(false)
  }

  const fmt = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0')
  const toneColor = closePct >= 70 ? '#22c55e' : closePct >= 40 ? '#f59e0b' : '#ef4444'
  const toneStatus = closePct >= 80 ? '🔥 HOT — push the close now' : closePct >= 60 ? 'Warming — keep building value' : closePct >= 35 ? 'Neutral — you need more conviction' : closePct >= 15 ? 'Cold — slow down, use empathy' : '❌ Shutting down — reframe immediately'

  if (autopsyLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center font-dm-mono">
        <div className="text-3xl mb-4">🔍</div>
        <BlitzIcon size={52} className="mb-3" />
        <p className="text-white font-bold text-base mb-1">Blitz is analyzing your call...</p>
        <p className="text-white/40 text-sm">Building your full Deal Autopsy</p>
      </div>
    )
  }

  if (autopsy) {
    return <AutopsyScreen data={autopsy} dealValue={dealValue} closePct={closePct} onRetry={() => onEnd(closePct, true)} onBack={() => onEnd(closePct)} />
  }

  return (
    <div className="flex flex-col h-full relative font-dm-mono">
      {/* Call header */}
      <div className="bg-navy-900 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
          <span className="text-xs text-red-400 font-bold tracking-wider">LIVE</span>
        </div>
        <span className="text-lg font-bold text-white font-mono">{fmt(secs)}</span>
        <div className="flex gap-2 items-center">
          {isSpeaking && <BlitzIcon size={16} className="blitz-speaking" />}
          <button
            onClick={toggleMute}
            className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-white/10 text-white hover:bg-white/20"
            title={isMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={() => onEnd(closePct, 'restart')} className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-white/10 text-white hover:bg-white/20">↺ Restart</button>
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

      {/* Prospect */}
      <div className="flex flex-col items-center py-3 bg-gray-900/60 border-b border-white/10 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-closer-blue flex items-center justify-center text-white font-bold text-sm mb-1">{prospectRef.current[1]}</div>
        <p className="text-sm font-bold text-white flex items-center gap-1.5">
          {prospectRef.current[0]}
          {isSpeaking && <BlitzIcon size={14} className="blitz-speaking" />}
        </p>
        <p className="text-[10px] text-white/40">{persona}</p>
      </div>

      {/* Mood + close prob */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border-b border-white/10 flex-shrink-0">
        <span className="text-[9px] text-white/40">Mood:</span>
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${mood.cls}`}>{mood.label}</span>
        <span className="ml-auto text-[9px] text-white/40">Close prob: {closePct}%</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'usr' ? 'justify-end' : m.isBrutal ? 'justify-center' : 'justify-start'}`}>
            {m.isBrutal ? (
              <div className="max-w-[90%] bg-red-900/40 border border-red-500/50 rounded-xl px-3 py-2 text-xs text-red-300 font-bold text-center">{m.text}</div>
            ) : (
              <div className={`max-w-[80%] ${m.role === 'usr' ? '' : ''}`}>
                <p className="text-[9px] text-white/30 mb-1">{m.role === 'usr' ? 'You' : prospectRef.current[0]}</p>
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

      {/* Input */}
      <div className="flex gap-2 px-3 py-3 bg-gray-900 border-t border-white/10 flex-shrink-0 relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
          placeholder="Type your response..."
          className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="px-4 py-2.5 bg-closer-blue text-white font-bold rounded-xl text-sm disabled:opacity-40">Send</button>
      </div>

      {/* Reframe popup */}
      {reframeOpen && (
        <div className="absolute bottom-20 left-3 right-3 bg-navy-900 border border-closer-blue rounded-xl p-3 z-30 shadow-2xl shadow-closer-blue/20">
          <div className="flex items-center gap-2 mb-2">
            <BlitzIcon size={18} />
            <p className="text-[10px] text-gold-400 font-bold flex-1">⚡ Objection detected — tap for reframes</p>
            <button onClick={() => setReframeOpen(false)} className="text-white/30 text-sm hover:text-white/60">✕</button>
          </div>
          {!reframes ? (
            <button onClick={loadReframes} disabled={reframeLoading} className="w-full py-2 bg-closer-blue/20 border border-closer-blue/30 rounded-lg text-white/80 text-xs font-medium hover:bg-closer-blue/30 disabled:opacity-40">
              {reframeLoading ? 'Loading...' : '🔄 Show 3 elite reframes (Elliott / Belfort / Cardone)'}
            </button>
          ) : (
            <div className="space-y-1.5">
              {[
                { text: reframes.r1, label: 'Andy Elliott' },
                { text: reframes.r2, label: 'Jordan Belfort' },
                { text: reframes.r3, label: 'Grant Cardone' },
              ].map((r, i) => (
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
    if (action === 'restart') {
      setRestartKey(k => k + 1)
    } else {
      setInCall(false)
    }
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
    <div className="flex flex-col h-full overflow-y-auto p-4 font-dm-mono">
      <BlitzBar message={`<strong>Blitz:</strong> ${modeMsg}`} />

      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Training Mode</div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {TRAINING_MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              mode === m.id
                ? m.id === 'bru' ? 'border-red-500 bg-red-500/10' : m.id === 'one' ? 'border-yellow-500 bg-yellow-500/10' : 'border-closer-blue bg-closer-blue/10'
                : 'border-white/10 bg-white/5 hover:bg-white/8'
            }`}
          >
            <div className="text-lg mb-1">{m.icon}</div>
            <div className="text-xs font-bold text-white">{m.name}</div>
            <div className="text-[9px] text-white/40 mt-0.5 leading-relaxed">{m.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Prospect</label>
          <select value={persona} onChange={e => setPersona(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            {PROSPECTS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Deal value ($)</label>
        <input type="number" value={dealVal} onChange={e => setDealVal(+e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-sm focus:outline-none focus:border-closer-blue" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Difficulty</label>
          <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-blue-900/60 text-blue-300">{DIFFICULTY_MAP[Math.round(difficulty)]}</span>
        </div>
        <div className="relative pt-1 pb-4">
          <input
            type="range" min="1" max="5" step="0.01" value={difficulty}
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
        onClick={() => setInCall(true)}
        className="w-full py-3.5 bg-closer-blue text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-colors"
      >
        ▶ Start training call
      </button>
    </div>
  )
}
