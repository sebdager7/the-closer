import React, { useState, useEffect } from 'react'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { ZONES, ELITE_QUOTES, LESSON_DATA } from '../data/constants'
import { vibrateBlitz } from '../utils/blitz'

function playCorrect() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const g1 = ctx.createGain()
    g1.gain.setValueAtTime(0.3, ctx.currentTime)
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    g1.connect(ctx.destination)
    const o1 = ctx.createOscillator()
    o1.type = 'sine'; o1.frequency.setValueAtTime(523, ctx.currentTime)
    o1.connect(g1); o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.18)
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(0.3, ctx.currentTime + 0.16)
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
    g2.connect(ctx.destination)
    const o2 = ctx.createOscillator()
    o2.type = 'sine'; o2.frequency.setValueAtTime(784, ctx.currentTime + 0.16)
    o2.connect(g2); o2.start(ctx.currentTime + 0.16); o2.stop(ctx.currentTime + 0.45)
    setTimeout(() => ctx.close(), 600)
  } catch (e) {}
}

function playWrong() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    gain.connect(ctx.destination)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3)
    osc.connect(gain); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35)
    setTimeout(() => ctx.close(), 500)
  } catch (e) {}
}

function playFanfare() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.13)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.22)
      gain.connect(ctx.destination)
      const osc = ctx.createOscillator()
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.13)
      osc.connect(gain); osc.start(ctx.currentTime + i * 0.13); osc.stop(ctx.currentTime + i * 0.13 + 0.22)
    })
    setTimeout(() => ctx.close(), 900)
  } catch (e) {}
}

function playXpPing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    gain.connect(ctx.destination)
    const osc = ctx.createOscillator()
    osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.connect(gain); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5)
    setTimeout(() => ctx.close(), 700)
  } catch (e) {}
}

const adjustColorForLight = (hexColor) => hexColor

// ─── HUD ──────────────────────────────────────────────────────────────────────
function Hud({ xp, gems, streak, isLight }) {
  const xpPct = Math.min(xp / 1000 * 100, 100)
  const lbl = { color: isLight ? 'rgba(200,168,74,0.65)' : '#4a6a9a' }
  return (
    <div
      className="px-3 py-1.5 flex items-center justify-between gap-3 flex-shrink-0 border-b-2 transition-colors duration-200"
      style={{ background: isLight ? '#0d1a2e' : '#0a0a1a', borderColor: isLight ? 'rgba(200,168,74,0.35)' : '#1a1a3a' }}
    >
      <div className="flex flex-col items-center">
        <span className="text-[6px] font-bold uppercase tracking-widest" style={lbl}>Score</span>
        <span className="text-xs font-bold font-mono" style={{ color: isLight ? '#e8c870' : '#facc15' }}>{(xp * 100).toLocaleString()}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[6px] font-bold uppercase tracking-widest" style={lbl}>Streak</span>
        <span className="text-xs font-bold text-orange-400">🔥{streak}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[6px] font-bold uppercase tracking-widest" style={lbl}>Rings</span>
        <span className="text-xs font-bold" style={{ color: isLight ? '#e8c870' : '#facc15' }}>💎{gems}</span>
      </div>
      <div className="flex-1 max-w-[90px]">
        <span className="text-[6px] font-bold uppercase tracking-widest block mb-1" style={lbl}>XP</span>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{
            background: isLight ? '#0f2540' : '#1a1a3a',
            border: `1px solid ${isLight ? 'rgba(200,168,74,0.25)' : '#2a2a5a'}`,
          }}
        >
          <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <svg key={i} width="12" height="14" viewBox="0 0 80 88" fill="none">
            <path d="M12 62 C12 38 20 24 40 24 C60 24 68 38 68 62 C68 74 55 82 40 82 C25 82 12 74 12 62 Z" fill={isLight ? '#d0dff8' : '#111122'}/>
            <path d="M14 58 C14 40 22 28 40 28 C58 28 66 40 66 58 C66 68 54 76 40 76 C26 76 14 68 14 58 Z" fill={isLight ? '#dce8ff' : '#181830'}/>
            <ellipse cx="30" cy="49" rx="8" ry="7" fill="#fff"/>
            <ellipse cx="50" cy="49" rx="8" ry="7" fill="#fff"/>
            <ellipse cx="30" cy="49" rx="5" ry="5" fill="#1a6bbf"/>
            <ellipse cx="50" cy="49" rx="5" ry="5" fill="#1a6bbf"/>
            <ellipse cx="30.5" cy="49" rx="2.8" ry="3" fill="#04040e"/>
            <ellipse cx="50.5" cy="49" rx="2.8" ry="3" fill="#04040e"/>
          </svg>
        ))}
      </div>
    </div>
  )
}

// ─── ACT CARD ─────────────────────────────────────────────────────────────────
function ActCard({ act, zone, actIndex, isActive, isDone, isLocked, onClick, isLight }) {
  const tIcons = { Learn: '📖', Quiz: '❓', 'Fill-in': '✏️', Match: '🔗' }
  const platforms = [
    { left: 3, top: 14, width: 16 },
    { left: 30, top: 22, width: 14 },
  ]
  const rings = [16, 32, 50]

  return (
    <button
      onClick={!isLocked ? onClick : undefined}
      className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all ${
        isDone ? 'border-green-500' : isActive && !isLocked ? 'border-yellow-500 animate-[actpls_2s_infinite]' : isLocked ? 'opacity-40 cursor-not-allowed border-transparent' : 'border-transparent hover:border-white/30 cursor-pointer'
      }`}
    >
      {/* Scene — pixel art zones stay the same in both modes */}
      <div className={`h-11 relative overflow-hidden ${zone.bgClass}`}>
        {rings.map((rx, i) => (
          <div key={i} className={`absolute w-1.5 h-1.5 rounded-full border-[1.5px] border-yellow-500 ${isDone ? 'bg-yellow-500' : ''}`} style={{ left: rx, top: 6 + (actIndex % 3) * 5 }} />
        ))}
        {platforms.map((p, i) => (
          <div key={i} className="absolute h-1 rounded-sm" style={{ left: p.left, top: p.top, width: p.width, background: zone.platColor }} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-2 rounded-t-sm" style={{ background: zone.gndColor }} />
        {isActive && !isLocked && (
          <div className="absolute bottom-1.5 left-0.5 animate-[bounce-blitz_0.8s_ease_infinite_alternate]">
            <svg width="10" height="12" viewBox="0 0 80 88" fill="none">
              <path d="M12 62 C12 38 20 24 40 24 C60 24 68 38 68 62 C68 74 55 82 40 82 C25 82 12 74 12 62 Z" fill="#111122"/>
              <path d="M14 58 C14 40 22 28 40 28 C58 28 66 40 66 58 C66 68 54 76 40 76 C26 76 14 68 14 58 Z" fill="#181830"/>
              <ellipse cx="30" cy="49" rx="8" ry="7" fill="#fff"/>
              <ellipse cx="50" cy="49" rx="8" ry="7" fill="#fff"/>
              <ellipse cx="30" cy="49" rx="5" ry="5" fill="#1a6bbf"/>
              <ellipse cx="50" cy="49" rx="5" ry="5" fill="#1a6bbf"/>
              <ellipse cx="30.5" cy="49" rx="2.8" ry="3" fill="#04040e"/>
              <ellipse cx="50.5" cy="49" rx="2.8" ry="3" fill="#04040e"/>
            </svg>
          </div>
        )}
        {isDone && (
          <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[6px] font-bold text-white z-10">✓</div>
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: isLight ? 'rgba(10,20,40,0.85)' : 'rgba(0,0,0,0.55)' }}>
            <span className="text-xs">🔒</span>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="px-1.5 py-1 transition-colors duration-200" style={{ background: isLight ? '#0f1f38' : '#0f0f24' }}>
        <div className="text-[5px] font-bold uppercase tracking-wider" style={{ color: isLight ? 'rgba(200,168,74,0.65)' : '#4a6a9a' }}>ACT {actIndex + 1}</div>
        <div className="text-[7px] font-bold leading-tight min-h-[14px]" style={{ color: '#e8f0fa' }}>{act.name}</div>
        <div className="flex items-center justify-between mt-0.5">
          <div className="text-[5px] font-bold uppercase" style={{ color: isLight ? 'rgba(200,168,74,0.65)' : '#4a6a9a' }}>{tIcons[act.type]} {act.type}</div>
          <div className="text-[5px] font-bold" style={{ color: isLight ? '#e8c870' : '#eab308' }}>+{act.xp}</div>
        </div>
      </div>
    </button>
  )
}

// ─── LESSON ENGINE ────────────────────────────────────────────────────────────
function LessonOverlay({ act, zone, onClose, onComplete, isLight }) {
  const steps = LESSON_DATA[act.id] || []
  const [stepIdx, setStepIdx] = useState(0)
  const [lives, setLives] = useState(3)
  const [wrongCount, setWrongCount] = useState(0)
  const [startTime] = useState(Date.now())
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [fillVal, setFillVal] = useState('')
  const [checked, setChecked] = useState(false)
  const [matchSel, setMatchSel] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState(new Set())
  const [shuffledRights, setShuffledRights] = useState([])

  const step = steps[stepIdx]
  const progPct = steps.length ? Math.round(stepIdx / steps.length * 100) : 0

  useEffect(() => {
    if (step?.type === 'match' && step.pairs) {
      setShuffledRights([...step.pairs].sort(() => Math.random() - 0.5).map(p => p.right))
      setMatchedPairs(new Set())
      setMatchSel(null)
    }
    setSelectedOpt(null); setFillVal(''); setChecked(false)
  }, [stepIdx])

  if (!steps.length) {
    return (
      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-colors duration-200"
        style={{ background: isLight ? '#0d1a2e' : '#0a0a1a' }}
      >
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="font-bold text-lg mb-2 text-white">{act.name}</h3>
        <p className="text-sm mb-6" style={{ color: isLight ? 'rgba(200,168,74,0.65)' : 'rgba(255,255,255,0.5)' }}>Full lesson coming soon! +{act.xp} XP on completion.</p>
        <button onClick={() => onComplete(50, 100)} className="px-6 py-2.5 bg-yellow-500 text-navy-900 font-bold rounded-xl text-sm">Claim XP →</button>
      </div>
    )
  }

  const handleCheck = () => {
    if (step.type === 'quiz') {
      setChecked(true)
      if (selectedOpt !== step.correct) {
        setLives(l => Math.max(0, l - 1))
        setWrongCount(w => w + 1)
        playWrong()
        navigator.vibrate?.([50, 30, 50])
      } else {
        playCorrect()
        navigator.vibrate?.(40)
      }
    } else if (step.type === 'fill') {
      setChecked(true)
      if (!fillVal.toLowerCase().includes(step.answer.toLowerCase())) {
        setLives(l => Math.max(0, l - 1))
        setWrongCount(w => w + 1)
        playWrong()
        navigator.vibrate?.([50, 30, 50])
      } else {
        playCorrect()
        navigator.vibrate?.(40)
      }
    }
  }

  const handleNext = () => {
    if (stepIdx + 1 >= steps.length) {
      const elapsed = Math.round((Date.now() - startTime) / 1000)
      const acc = Math.max(0, Math.round((1 - wrongCount / (steps.length + wrongCount)) * 100))
      onComplete(elapsed, acc)
    } else {
      setStepIdx(i => i + 1)
    }
  }

  const handleMatchClick = (side, idx, val) => {
    if (step.type !== 'match') return
    if (matchedPairs.has('L' + step.pairs.findIndex(p => p.left === val)) || matchedPairs.has('R' + shuffledRights.indexOf(val))) return
    if (!matchSel) { setMatchSel({ side, idx, val }); return }
    if (matchSel.side === side) { setMatchSel({ side, idx, val }); return }
    const lv = side === 'R' ? matchSel.val : val
    const rv = side === 'R' ? val : matchSel.val
    const valid = step.pairs.some(p => p.left === lv && p.right === rv)
    if (valid) {
      const newPairs = new Set(matchedPairs)
      newPairs.add('L' + step.pairs.findIndex(p => p.left === lv))
      newPairs.add('R' + shuffledRights.indexOf(rv))
      setMatchedPairs(newPairs)
      playCorrect()
      navigator.vibrate?.(40)
      if (newPairs.size >= step.pairs.length * 2) setTimeout(handleNext, 600)
    } else {
      setLives(l => Math.max(0, l - 1))
      setWrongCount(w => w + 1)
      playWrong()
      navigator.vibrate?.([50, 30, 50])
    }
    setMatchSel(null)
  }

  const typeBadge = { learn: 'Lesson', quiz: 'Quiz', fill: 'Fill in', match: 'Match' }
  const typeCls = { learn: 'bg-blue-900/60 text-blue-300', quiz: 'bg-yellow-900/60 text-yellow-300', fill: 'bg-green-900/60 text-green-300', match: 'bg-red-900/60 text-red-300' }

  const barBg = isLight ? '#0d1a2e' : '#111122'
  const barBorder = isLight ? 'rgba(200,168,74,0.2)' : 'rgba(255,255,255,0.1)'
  const bodyBg = isLight ? '#0d1a2e' : '#0a0a1a'
  const cardBg = isLight ? '#111f38' : 'rgba(26,107,191,0.08)'
  const cardBorder = isLight ? 'rgba(200,168,74,0.2)' : 'rgba(255,255,255,0.1)'
  const bubbleBg = isLight ? '#0d1a2e' : '#040d1a'
  const speechColor = isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.8)'
  const infoBg = isLight ? '#111f38' : 'rgba(26,107,191,0.06)'
  const infoHeadColor = '#ffffff'
  const infoBodyColor = isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.6)'
  const infoQuoteColor = isLight ? '#e8c870' : '#c8a84a'
  const questionColor = '#ffffff'
  const optUnselBg = isLight ? 'rgba(20,36,64,0.6)' : 'rgba(255,255,255,0.04)'
  const optUnselBorder = isLight ? 'rgba(200,168,74,0.25)' : 'rgba(255,255,255,0.12)'
  const optUnselColor = '#ffffff'
  const fillContBg = isLight ? '#111f38' : 'rgba(26,107,191,0.1)'
  const fillInputBg = isLight ? 'rgba(20,36,64,0.6)' : 'rgba(255,255,255,0.05)'
  const fillInputBorder = isLight ? 'rgba(200,168,74,0.3)' : 'rgba(255,255,255,0.15)'
  const matchUnselBg = isLight ? 'rgba(20,36,64,0.6)' : 'rgba(255,255,255,0.04)'
  const matchUnselBorder = isLight ? 'rgba(200,168,74,0.25)' : 'rgba(255,255,255,0.12)'
  const matchSelBg = isLight ? 'rgba(200,168,74,0.2)' : 'rgba(26,107,191,0.2)'
  const matchHintColor = isLight ? 'rgba(200,168,74,0.55)' : 'rgba(255,255,255,0.4)'

  return (
    <div className="absolute inset-0 z-60 flex flex-col animate-fade-in transition-colors duration-200" style={{ background: bodyBg }}>
      {/* Top bar */}
      <div
        className="px-3 py-2 flex items-center gap-3 flex-shrink-0 transition-colors duration-200"
        style={{ background: barBg, borderBottom: `1px solid ${barBorder}` }}
      >
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs hover:opacity-80"
          style={{ border: `1px solid ${barBorder}`, color: isLight ? '#6b87a8' : 'rgba(255,255,255,0.5)' }}
        >←</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: isLight ? '#e8eef8' : 'rgba(255,255,255,0.1)' }}>
          <div className="h-full bg-closer-blue rounded-full transition-all" style={{ width: `${progPct}%` }} />
        </div>
        <div className="text-sm">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${typeCls[step.type] || ''}`}>
          {typeBadge[step.type]}
        </span>

        {step.type === 'learn' && (
          <div>
            <div
              className="flex items-start gap-3 rounded-xl p-3 mb-3 transition-colors duration-200"
              style={{ background: cardBg, border: `0.5px solid ${cardBorder}` }}
            >
              <BlitzIcon size={28} />
              <div
                className="rounded-xl rounded-bl-sm px-3 py-2 flex-1 transition-colors duration-200"
                style={{ background: bubbleBg, border: `0.5px solid ${cardBorder}` }}
              >
                <p className="text-xs leading-relaxed" style={{ color: speechColor }} dangerouslySetInnerHTML={{ __html: step.content }} />
              </div>
            </div>
            {step.cards?.map((c, i) => (
              <div
                key={i}
                className="rounded-xl p-3 mb-2 transition-colors duration-200"
                style={{ background: infoBg, border: `0.5px solid ${cardBorder}` }}
              >
                <h4 className="text-xs font-bold mb-1" style={{ color: infoHeadColor }}>{c.h}</h4>
                <p className="text-xs leading-relaxed" style={{ color: infoBodyColor }}>{c.p}</p>
                {c.q && <p className="text-[9px] font-bold mt-1.5" style={{ color: infoQuoteColor }}>{c.q}</p>}
              </div>
            ))}
          </div>
        )}

        {step.type === 'quiz' && (
          <div>
            <h3 className="text-sm font-bold mb-4 leading-snug" style={{ color: questionColor }}>{step.question}</h3>
            <div className="space-y-2 mb-3">
              {step.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => setSelectedOpt(i)}
                  className="w-full text-left px-3.5 py-3 rounded-xl border text-sm transition-all"
                  style={
                    checked
                      ? i === step.correct
                        ? { borderColor: '#22c55e', background: 'rgba(34,197,94,0.2)', color: '#166534' }
                        : i === selectedOpt
                        ? { borderColor: '#ef4444', background: 'rgba(239,68,68,0.2)', color: '#991b1b' }
                        : { borderColor: optUnselBorder, background: optUnselBg, color: 'rgba(255,255,255,0.3)' }
                      : selectedOpt === i
                      ? { borderColor: '#1a6bbf', background: 'rgba(26,107,191,0.2)', color: isLight ? '#1a6bbf' : '#ffffff' }
                      : { borderColor: optUnselBorder, background: optUnselBg, color: optUnselColor }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
            {checked && (
              <div
                className="p-3 rounded-xl border text-xs mb-3"
                style={
                  selectedOpt === step.correct
                    ? { background: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#166534' }
                    : { background: 'rgba(239,68,68,0.2)', borderColor: '#ef4444', color: '#991b1b' }
                }
              >
                <p className="font-bold mb-0.5">{selectedOpt === step.correct ? 'Correct!' : 'Not quite'}</p>
                <p className="opacity-80">{step.explanation}</p>
              </div>
            )}
          </div>
        )}

        {step.type === 'fill' && (
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: questionColor }}>{step.question}</h3>
            <div
              className="rounded-xl p-3 mb-3 text-xs leading-relaxed transition-colors duration-200"
              style={{ background: fillContBg, border: `0.5px solid ${cardBorder}`, color: infoBodyColor }}
            >
              "{step.before} <span style={{ background: 'rgba(26,107,191,0.3)', color: '#1a6bbf', padding: '1px 6px', borderRadius: 4, fontWeight: 700, margin: '0 2px' }}>_____</span> {step.after}"
            </div>
            <input
              value={fillVal}
              onChange={e => setFillVal(e.target.value)}
              placeholder={step.hint}
              disabled={checked}
              className="w-full px-3.5 py-3 rounded-xl border text-sm mb-3 focus:outline-none transition-colors duration-200"
              style={
                checked
                  ? fillVal.toLowerCase().includes(step.answer.toLowerCase())
                    ? { borderColor: '#22c55e', background: 'rgba(34,197,94,0.2)', color: '#166534' }
                    : { borderColor: '#ef4444', background: 'rgba(239,68,68,0.2)', color: '#991b1b' }
                  : { borderColor: fillInputBorder, background: fillInputBg, color: optUnselColor }
              }
            />
            {checked && (
              <div
                className="p-3 rounded-xl border text-xs mb-3"
                style={
                  fillVal.toLowerCase().includes(step.answer.toLowerCase())
                    ? { background: 'rgba(34,197,94,0.2)', borderColor: '#22c55e', color: '#166534' }
                    : { background: 'rgba(239,68,68,0.2)', borderColor: '#ef4444', color: '#991b1b' }
                }
              >
                <p className="font-bold mb-0.5">{fillVal.toLowerCase().includes(step.answer.toLowerCase()) ? 'Correct!' : `Answer: "${step.answer}"`}</p>
                <p className="opacity-80">{step.explanation}</p>
              </div>
            )}
          </div>
        )}

        {step.type === 'match' && (
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: questionColor }}>{step.question}</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="space-y-2">
                {step.pairs.map((p, i) => {
                  const matched = matchedPairs.has('L' + i)
                  const selected = matchSel?.side === 'L' && matchSel.idx === i
                  return (
                    <button
                      key={i}
                      onClick={() => handleMatchClick('L', i, p.left)}
                      className="w-full px-2.5 py-2.5 rounded-xl border text-xs text-center transition-all"
                      style={
                        matched
                          ? { borderColor: '#22c55e', background: 'rgba(34,197,94,0.2)', color: '#166534' }
                          : selected
                          ? { borderColor: '#1a6bbf', background: matchSelBg, color: '#1a6bbf' }
                          : { borderColor: matchUnselBorder, background: matchUnselBg, color: optUnselColor }
                      }
                    >{p.left}</button>
                  )
                })}
              </div>
              <div className="space-y-2">
                {shuffledRights.map((r, i) => {
                  const matched = matchedPairs.has('R' + i)
                  const selected = matchSel?.side === 'R' && matchSel.idx === i
                  return (
                    <button
                      key={i}
                      onClick={() => handleMatchClick('R', i, r)}
                      className="w-full px-2.5 py-2.5 rounded-xl border text-xs text-center transition-all"
                      style={
                        matched
                          ? { borderColor: '#22c55e', background: 'rgba(34,197,94,0.2)', color: '#166534' }
                          : selected
                          ? { borderColor: '#1a6bbf', background: matchSelBg, color: '#1a6bbf' }
                          : { borderColor: matchUnselBorder, background: matchUnselBg, color: optUnselColor }
                      }
                    >{r}</button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="px-4 py-3 flex-shrink-0 transition-colors duration-200"
        style={{ background: barBg, borderTop: `0.5px solid ${barBorder}` }}
      >
        {step.type === 'learn' ? (
          <button onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-sm">Continue</button>
        ) : step.type === 'match' ? (
          <div className="text-center text-xs" style={{ color: matchHintColor }}>Match all pairs to continue</div>
        ) : !checked ? (
          <button onClick={handleCheck} disabled={step.type === 'quiz' ? selectedOpt === null : !fillVal.trim()} className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm disabled:opacity-40">Check</button>
        ) : (
          <button onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-sm">Continue</button>
        )}
      </div>
    </div>
  )
}

// ─── ACT COMPLETE OVERLAY ─────────────────────────────────────────────────────
function CompleteOverlay({ elapsed, accuracy, xpEarned, streak, onContinue, isLight }) {
  const m = Math.floor(elapsed / 60), s = elapsed % 60
  const trophy = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🥈' : '🥉'

  useEffect(() => { vibrateBlitz([50, 30, 50, 30, 100]) }, [])

  return (
    <div
      className="absolute inset-0 z-70 flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors duration-200"
      style={{ background: isLight ? 'rgba(13,26,46,0.97)' : '#0a0a1a' }}
    >
      <div className="text-5xl mb-2 animate-scale-in">{trophy}</div>
      <BlitzIcon size={52} className="blitz-celebrate mb-2" />
      <h3 className="text-lg font-bold mb-1 text-white">
        {accuracy >= 90 ? 'Zone Cleared! 🔥' : accuracy >= 70 ? 'Act Complete! 💪' : 'Keep Running! 🎮'}
      </h3>
      <p className="text-sm mb-5" style={{ color: isLight ? 'rgba(200,168,74,0.7)' : 'rgba(255,255,255,0.5)' }}>
        +{xpEarned} XP · {streak} day streak · Blitz is proud!
      </p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[200px] mb-5">
        {[{ v: '+' + xpEarned, l: 'XP' }, { v: accuracy + '%', l: 'Accuracy' }, { v: m + ':' + s.toString().padStart(2, '0'), l: 'Time' }].map(stat => (
          <div
            key={stat.l}
            className="rounded-xl p-2 text-center transition-colors duration-200"
            style={{
              background: isLight ? '#111f38' : 'rgba(26,107,191,0.08)',
              border: `0.5px solid ${isLight ? 'rgba(200,168,74,0.25)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <div className="text-base font-bold font-mono" style={{ color: isLight ? '#e8c870' : '#1a6bbf' }}>{stat.v}</div>
            <div className="text-[8px] uppercase tracking-wider" style={{ color: isLight ? 'rgba(200,168,74,0.55)' : 'rgba(255,255,255,0.4)' }}>{stat.l}</div>
          </div>
        ))}
      </div>
      <button onClick={onContinue} className="px-6 py-3 bg-closer-blue text-white font-bold rounded-xl text-sm">Continue →</button>
    </div>
  )
}

// ─── ACT PANEL ────────────────────────────────────────────────────────────────
function ActPanel({ act, zone, actIndex, onStart, onClose, isLight }) {
  const q = (ELITE_QUOTES[zone.id] || [])[actIndex] || (ELITE_QUOTES[zone.id] || [])[0]
  return (
    <div
      className="absolute inset-0 z-50 flex items-end animate-fade-in transition-colors duration-200"
      style={{ background: 'rgba(0,0,10,0.87)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-2xl w-full animate-slide-up transition-colors duration-200"
        style={{
          background: isLight ? '#0f1f38' : '#0f0f24',
          borderTop: `2px solid ${isLight ? 'rgba(200,168,74,0.4)' : '#2a2a5a'}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 transition-colors duration-200"
          style={{ borderBottom: `1px solid ${isLight ? 'rgba(200,168,74,0.2)' : '#1a1a3a'}` }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: zone.nameColor + '22' }}>{zone.icon}</div>
          <div>
            <h3 className="text-sm font-bold text-white">{act.name}</h3>
            <p className="text-[9px]" style={{ color: isLight ? 'rgba(200,168,74,0.65)' : '#4a6a9a' }}>{zone.name} · Act {actIndex + 1}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition-opacity"
            style={{
              background: isLight ? 'rgba(200,168,74,0.12)' : 'rgba(255,255,255,0.06)',
              color: isLight ? '#c8a84a' : '#8aaccc',
            }}
          >✕</button>
        </div>

        <div className="p-4">
          {q && (
            <div
              className="rounded-r-lg p-3 mb-4 text-[9px] italic leading-relaxed"
              style={{
                background: isLight ? 'rgba(20,36,64,0.8)' : '#050510',
                borderLeft: '2px solid #f59e0b',
              }}
            >
              <span style={{ color: isLight ? '#a0b8d0' : '#8aaccc' }}>"{q.q}"</span>{' '}
              <strong style={{ color: isLight ? '#e8c870' : '#f59e0b', fontStyle: 'normal' }}>{q.a}</strong>
            </div>
          )}
          <p className="text-xs leading-relaxed mb-4" style={{ color: isLight ? '#7a9ab8' : '#6a8aaa' }}>
            {act.name} — {zone.sub}. Complete this act to earn +{act.xp} XP.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ v: '+' + act.xp, l: 'XP' }, { v: act.type, l: 'Type' }, { v: act.stars > 0 ? '⭐'.repeat(act.stars) : '—', l: 'Best' }].map(stat => (
              <div
                key={stat.l}
                className="rounded-lg p-2 text-center transition-colors duration-200"
                style={{
                  background: isLight ? '#0d1a2e' : '#050510',
                  border: `1px solid ${isLight ? 'rgba(200,168,74,0.2)' : '#1a1a3a'}`,
                }}
              >
                <div className="text-xs font-bold font-mono" style={{ color: isLight ? '#e8c870' : '#f59e0b' }}>{stat.v}</div>
                <div className="text-[7px] uppercase tracking-wider" style={{ color: isLight ? 'rgba(200,168,74,0.55)' : '#4a6a9a' }}>{stat.l}</div>
              </div>
            ))}
          </div>
          <button onClick={onStart} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900 font-extrabold rounded-xl text-sm">▶ START ACT</button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function PsychologyScreen() {
  const { state, dispatch } = useApp()
  const isLight = state.theme === 'light'
  const [selectedAct, setSelectedAct] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completionData, setCompletionData] = useState(null)

  const handleActComplete = (elapsed, accuracy) => {
    const xpEarned = selectedAct.act.xp + Math.round(accuracy / 10) * 5
    dispatch({ type: 'ADD_XP', payload: xpEarned })
    dispatch({ type: 'COMPLETE_ACT', payload: selectedAct.act.id })
    setActiveLesson(null)
    playXpPing()
    const newCompleted = [...state.completedActs, selectedAct.act.id]
    const zoneActsDone = selectedAct.zone.acts.filter(a => newCompleted.includes(a.id)).length
    if (zoneActsDone >= selectedAct.zone.acts.length) {
      setTimeout(playFanfare, 300)
    }
    setCompletionData({ elapsed, accuracy, xpEarned, streak: state.streak + 1 })
  }

  const zoneUnlocked = ZONES.map((zone, zi) => {
    if (zi === 0) return true
    const prevZone = ZONES[zi - 1]
    return prevZone.acts.filter(a => state.completedActs.includes(a.id)).length >= 3
  })

  const lbl = { color: isLight ? 'rgba(200,168,74,0.65)' : '#4a6a9a' }

  return (
    <div
      className="flex flex-col h-full relative transition-colors duration-200"
      style={{ background: isLight ? '#0d1a2e' : '#0a0a1a' }}
    >
      <Hud xp={state.xp} gems={state.gems} streak={state.streak} isLight={isLight} />

      <div className="flex-1 overflow-y-auto pb-4">
        {ZONES.map((zone, zi) => {
          const isLocked = !zoneUnlocked[zi]
          const firstUnfinishedIdx = zone.acts.findIndex(a => !state.completedActs.includes(a.id))
          const actsCompleted = zone.acts.filter(a => state.completedActs.includes(a.id)).length
          const totalActs = zone.acts.length
          const progressPct = Math.round(actsCompleted / totalActs * 100)
          const zoneNameColor = isLight ? adjustColorForLight(zone.nameColor) : zone.nameColor

          return (
            <div key={zone.id} className="mb-5">
              {/* Zone header */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: zone.nameColor + '22', border: `1px solid ${zone.nameColor}44` }}>
                  {zone.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: zoneNameColor }}>{zone.name}</div>
                  <div className="text-[8px]" style={lbl}>{zone.sub}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{
                        background: isLight ? '#0f2540' : '#1a1a3a',
                        border: `1px solid ${isLight ? 'rgba(200,168,74,0.25)' : '#2a2a5a'}`,
                      }}
                    >
                      <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: zoneNameColor }} />
                    </div>
                    <span className="text-[7px] font-bold" style={{ color: zoneNameColor }}>{actsCompleted}/{totalActs}</span>
                  </div>
                </div>
                <span
                  className="text-[7px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-lg"
                  style={
                    isLocked
                      ? { background: isLight ? '#0f2540' : '#1a1a3a', color: isLight ? 'rgba(200,168,74,0.55)' : '#4a6a9a', border: `1px solid ${isLight ? 'rgba(200,168,74,0.2)' : '#2a2a5a'}` }
                      : { background: zone.nameColor + '22', color: zoneNameColor, border: `1px solid ${zone.nameColor}55` }
                  }
                >
                  {isLocked ? '🔒 LOCKED' : `ZONE ${zi + 1}`}
                </span>
              </div>

              {/* Act scroll */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none px-3 pb-1">
                {zone.acts.map((act, ai) => {
                  const isDone = state.completedActs.includes(act.id)
                  const isActive = !isLocked && !isDone && ai === firstUnfinishedIdx
                  const isActLocked = isLocked || (!isDone && !isActive && ai > firstUnfinishedIdx)
                  return (
                    <ActCard
                      key={act.id}
                      act={act}
                      zone={zone}
                      actIndex={ai}
                      isDone={isDone}
                      isActive={isActive}
                      isLocked={isActLocked}
                      isLight={isLight}
                      onClick={() => setSelectedAct({ act, zone, actIndex: ai })}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedAct && !activeLesson && !completionData && (
        <ActPanel
          act={selectedAct.act}
          zone={selectedAct.zone}
          actIndex={selectedAct.actIndex}
          isLight={isLight}
          onClose={() => setSelectedAct(null)}
          onStart={() => setActiveLesson(true)}
        />
      )}

      {activeLesson && selectedAct && !completionData && (
        <LessonOverlay
          act={selectedAct.act}
          zone={selectedAct.zone}
          isLight={isLight}
          onClose={() => { setActiveLesson(null); setSelectedAct(null) }}
          onComplete={handleActComplete}
        />
      )}

      {completionData && (
        <CompleteOverlay
          {...completionData}
          isLight={isLight}
          onContinue={() => { setCompletionData(null); setSelectedAct(null) }}
        />
      )}
    </div>
  )
}
