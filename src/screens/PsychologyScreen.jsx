import React, { useState, useEffect } from 'react'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { ZONES, ELITE_QUOTES, LESSON_DATA } from '../data/constants'

// ─── HUD ──────────────────────────────────────────────────────────────────────
function Hud({ xp, gems, streak }) {
  const xpPct = Math.min(xp / 1000 * 100, 100)
  return (
    <div className="bg-[#0a0a1a] border-b-2 border-[#1a1a3a] px-3 py-1.5 flex items-center justify-between gap-3 flex-shrink-0">
      <div className="flex flex-col items-center">
        <span className="text-[6px] text-[#4a6a9a] font-bold uppercase tracking-widest">Score</span>
        <span className="text-xs font-bold text-yellow-400 font-mono">{(xp * 100).toLocaleString()}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[6px] text-[#4a6a9a] font-bold uppercase tracking-widest">Streak</span>
        <span className="text-xs font-bold text-orange-400">🔥{streak}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[6px] text-[#4a6a9a] font-bold uppercase tracking-widest">Rings</span>
        <span className="text-xs font-bold text-yellow-400">💎{gems}</span>
      </div>
      <div className="flex-1 max-w-[90px]">
        <span className="text-[6px] text-[#4a6a9a] font-bold uppercase tracking-widest block mb-1">XP</span>
        <div className="h-1.5 bg-[#1a1a3a] rounded-full overflow-hidden border border-[#2a2a5a]">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <svg key={i} width="12" height="14" viewBox="0 0 80 88" fill="none">
            <path d="M12 62 C12 38 20 24 40 24 C60 24 68 38 68 62 C68 74 55 82 40 82 C25 82 12 74 12 62 Z" fill="#111122"/>
            <path d="M14 58 C14 40 22 28 40 28 C58 28 66 40 66 58 C66 68 54 76 40 76 C26 76 14 68 14 58 Z" fill="#181830"/>
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
function ActCard({ act, zone, actIndex, isActive, isDone, isLocked, onClick }) {
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
      {/* Scene */}
      <div className={`h-11 relative overflow-hidden ${zone.bgClass}`}>
        {/* Rings */}
        {rings.map((rx, i) => (
          <div key={i} className={`absolute w-1.5 h-1.5 rounded-full border-[1.5px] border-yellow-500 ${isDone ? 'bg-yellow-500' : ''}`} style={{ left: rx, top: 6 + (actIndex % 3) * 5 }} />
        ))}
        {/* Platforms */}
        {platforms.map((p, i) => (
          <div key={i} className="absolute h-1 rounded-sm" style={{ left: p.left, top: p.top, width: p.width, background: zone.platColor }} />
        ))}
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 rounded-t-sm" style={{ background: zone.gndColor }} />
        {/* Blitz on active */}
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
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="bg-[#0f0f24] px-1.5 py-1">
        <div className="text-[5px] text-[#4a6a9a] font-bold uppercase tracking-wider">ACT {actIndex + 1}</div>
        <div className="text-[7px] font-bold text-[#e8f0fa] leading-tight min-h-[14px]">{act.name}</div>
        <div className="flex items-center justify-between mt-0.5">
          <div className="text-[5px] text-[#4a6a9a] font-bold uppercase">{tIcons[act.type]} {act.type}</div>
          <div className="text-[5px] font-bold text-yellow-500">+{act.xp}</div>
        </div>
      </div>
    </button>
  )
}

// ─── LESSON ENGINE ────────────────────────────────────────────────────────────
function LessonOverlay({ act, zone, onClose, onComplete }) {
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
      <div className="absolute inset-0 z-50 bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-white font-bold text-lg mb-2">{act.name}</h3>
        <p className="text-white/50 text-sm mb-6">Full lesson coming soon! +{act.xp} XP on completion.</p>
        <button onClick={() => onComplete(50, 100)} className="px-6 py-2.5 bg-yellow-500 text-navy-900 font-bold rounded-xl text-sm">Claim XP →</button>
      </div>
    )
  }

  const handleCheck = () => {
    if (step.type === 'quiz') {
      setChecked(true)
      if (selectedOpt !== step.correct) setLives(l => Math.max(0, l - 1)); setWrongCount(w => w + 1)
    } else if (step.type === 'fill') {
      setChecked(true)
      if (!fillVal.toLowerCase().includes(step.answer.toLowerCase())) { setLives(l => Math.max(0, l - 1)); setWrongCount(w => w + 1) }
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
    const pairKey = side + idx
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
      if (newPairs.size >= step.pairs.length * 2) setTimeout(handleNext, 600)
    } else {
      setLives(l => Math.max(0, l - 1)); setWrongCount(w => w + 1)
    }
    setMatchSel(null)
  }

  const typeBadge = { learn: 'Lesson', quiz: 'Quiz', fill: 'Fill in', match: 'Match' }
  const typeCls = { learn: 'bg-blue-900/60 text-blue-300', quiz: 'bg-yellow-900/60 text-yellow-300', fill: 'bg-green-900/60 text-green-300', match: 'bg-red-900/60 text-red-300' }

  return (
    <div className="absolute inset-0 z-60 flex flex-col bg-gray-950 animate-fade-in">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-white/10 px-3 py-2 flex items-center gap-3 flex-shrink-0">
        <button onClick={onClose} className="w-6 h-6 rounded-lg border border-white/20 text-white/50 flex items-center justify-center text-xs hover:bg-white/10">←</button>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
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
            <div className="flex items-start gap-3 bg-navy-800/80 rounded-xl p-3 border border-white/10 mb-3">
              <BlitzIcon size={28} />
              <div className="bg-gray-950 border border-white/10 rounded-xl rounded-bl-sm px-3 py-2 flex-1">
                <p className="text-xs text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.content }} />
              </div>
            </div>
            {step.cards?.map((c, i) => (
              <div key={i} className="bg-navy-800/60 border border-white/10 rounded-xl p-3 mb-2">
                <h4 className="text-xs font-bold text-white mb-1">{c.h}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{c.p}</p>
                {c.q && <p className="text-[9px] text-gold-500 font-bold mt-1.5">{c.q}</p>}
              </div>
            ))}
          </div>
        )}

        {step.type === 'quiz' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4 leading-snug">{step.question}</h3>
            <div className="space-y-2 mb-3">
              {step.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => setSelectedOpt(i)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border text-sm transition-all ${
                    checked
                      ? i === step.correct ? 'border-green-500 bg-green-500/20 text-green-300' : i === selectedOpt ? 'border-red-500 bg-red-500/20 text-red-300' : 'border-white/10 text-white/40'
                      : selectedOpt === i ? 'border-closer-blue bg-closer-blue/20 text-white' : 'border-white/15 bg-white/5 text-white hover:border-closer-blue/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {checked && (
              <div className={`p-3 rounded-xl border text-xs mb-3 ${selectedOpt === step.correct ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300'}`}>
                <p className="font-bold mb-0.5">{selectedOpt === step.correct ? 'Correct!' : 'Not quite'}</p>
                <p className="opacity-80">{step.explanation}</p>
              </div>
            )}
          </div>
        )}

        {step.type === 'fill' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-3">{step.question}</h3>
            <div className="bg-navy-800/60 border border-white/10 rounded-xl p-3 mb-3 text-xs text-white/60 leading-relaxed">
              "{step.before} <span className="bg-closer-blue/30 text-closer-blue px-1.5 py-0.5 rounded font-bold mx-0.5">_____</span> {step.after}"
            </div>
            <input
              value={fillVal}
              onChange={e => setFillVal(e.target.value)}
              placeholder={step.hint}
              disabled={checked}
              className={`w-full px-3.5 py-3 rounded-xl border text-sm mb-3 focus:outline-none ${
                checked
                  ? fillVal.toLowerCase().includes(step.answer.toLowerCase())
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-white/15 bg-white/5 text-white focus:border-closer-blue'
              }`}
            />
            {checked && (
              <div className={`p-3 rounded-xl border text-xs mb-3 ${fillVal.toLowerCase().includes(step.answer.toLowerCase()) ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300'}`}>
                <p className="font-bold mb-0.5">{fillVal.toLowerCase().includes(step.answer.toLowerCase()) ? 'Correct!' : `Answer: "${step.answer}"`}</p>
                <p className="opacity-80">{step.explanation}</p>
              </div>
            )}
          </div>
        )}

        {step.type === 'match' && (
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{step.question}</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Left column */}
              <div className="space-y-2">
                {step.pairs.map((p, i) => {
                  const matched = matchedPairs.has('L' + i)
                  const selected = matchSel?.side === 'L' && matchSel.idx === i
                  return (
                    <button key={i} onClick={() => handleMatchClick('L', i, p.left)}
                      className={`w-full px-2.5 py-2.5 rounded-xl border text-xs text-center transition-all ${matched ? 'border-green-500 bg-green-500/20 text-green-300 cursor-default' : selected ? 'border-closer-blue bg-closer-blue/20 text-white' : 'border-white/15 bg-white/5 text-white hover:border-closer-blue/50'}`}
                    >{p.left}</button>
                  )
                })}
              </div>
              {/* Right column */}
              <div className="space-y-2">
                {shuffledRights.map((r, i) => {
                  const matched = matchedPairs.has('R' + i)
                  const selected = matchSel?.side === 'R' && matchSel.idx === i
                  return (
                    <button key={i} onClick={() => handleMatchClick('R', i, r)}
                      className={`w-full px-2.5 py-2.5 rounded-xl border text-xs text-center transition-all ${matched ? 'border-green-500 bg-green-500/20 text-green-300 cursor-default' : selected ? 'border-closer-blue bg-closer-blue/20 text-white' : 'border-white/15 bg-white/5 text-white hover:border-closer-blue/50'}`}
                    >{r}</button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border-t border-white/10 px-4 py-3 flex-shrink-0">
        {step.type === 'learn' ? (
          <button onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-sm">Continue</button>
        ) : step.type === 'match' ? (
          <div className="text-center text-xs text-white/40">Match all pairs to continue</div>
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
function CompleteOverlay({ elapsed, accuracy, xpEarned, streak, onContinue }) {
  const m = Math.floor(elapsed / 60), s = elapsed % 60
  const trophy = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🥈' : '🥉'
  return (
    <div className="absolute inset-0 z-70 bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="text-5xl mb-2 animate-scale-in">{trophy}</div>
      <BlitzIcon size={52} className="mb-2" />
      <h3 className="text-lg font-bold text-white mb-1">{accuracy >= 90 ? 'Zone Cleared! 🔥' : accuracy >= 70 ? 'Act Complete! 💪' : 'Keep Running! 🎮'}</h3>
      <p className="text-sm text-white/50 mb-5">+{xpEarned} XP · {streak} day streak · Blitz is proud!</p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[200px] mb-5">
        {[{ v: '+' + xpEarned, l: 'XP' }, { v: accuracy + '%', l: 'Accuracy' }, { v: m + ':' + s.toString().padStart(2, '0'), l: 'Time' }].map(s => (
          <div key={s.l} className="bg-navy-800/80 border border-white/10 rounded-xl p-2 text-center">
            <div className="text-base font-bold text-closer-blue font-mono">{s.v}</div>
            <div className="text-[8px] text-white/40 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
      <button onClick={onContinue} className="px-6 py-3 bg-closer-blue text-white font-bold rounded-xl text-sm">Continue →</button>
    </div>
  )
}

// ─── ACT PANEL ────────────────────────────────────────────────────────────────
function ActPanel({ act, zone, actIndex, onStart, onClose }) {
  const q = (ELITE_QUOTES[zone.id] || [])[actIndex] || (ELITE_QUOTES[zone.id] || [])[0]
  return (
    <div className="absolute inset-0 bg-black/87 z-50 flex items-end animate-fade-in" onClick={onClose}>
      <div className="bg-[#0f0f24] rounded-t-2xl w-full border-t-2 border-[#2a2a5a] animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a3a]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: zone.nameColor + '22' }}>{zone.icon}</div>
          <div>
            <h3 className="text-sm font-bold text-[#e8f0fa]">{act.name}</h3>
            <p className="text-[9px] text-[#4a6a9a]">{zone.name} · Act {actIndex + 1}</p>
          </div>
          <button onClick={onClose} className="ml-auto w-6 h-6 rounded-full bg-white/10 text-[#8aaccc] text-xs flex items-center justify-center hover:bg-white/20">✕</button>
        </div>
        <div className="p-4">
          {q && (
            <div className="bg-[#050510] border-l-2 border-yellow-500 rounded-r-lg p-3 mb-4 text-[9px] text-[#8aaccc] italic leading-relaxed">
              "{q.q}" <strong className="text-yellow-500 not-italic">{q.a}</strong>
            </div>
          )}
          <p className="text-xs text-[#6a8aaa] leading-relaxed mb-4">{act.name} — {zone.sub}. Complete this act to earn +{act.xp} XP.</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ v: '+' + act.xp, l: 'XP' }, { v: act.type, l: 'Type' }, { v: act.stars > 0 ? '⭐'.repeat(act.stars) : '—', l: 'Best' }].map(s => (
              <div key={s.l} className="bg-[#050510] border border-[#1a1a3a] rounded-lg p-2 text-center">
                <div className="text-xs font-bold text-yellow-500 font-mono">{s.v}</div>
                <div className="text-[7px] text-[#4a6a9a] uppercase tracking-wider">{s.l}</div>
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
  const [selectedAct, setSelectedAct] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completionData, setCompletionData] = useState(null)

  const handleActComplete = (elapsed, accuracy) => {
    const xpEarned = selectedAct.act.xp + Math.round(accuracy / 10) * 5
    dispatch({ type: 'ADD_XP', payload: xpEarned })
    dispatch({ type: 'COMPLETE_ACT', payload: selectedAct.act.id })
    setActiveLesson(null)
    setCompletionData({ elapsed, accuracy, xpEarned, streak: state.streak + 1 })
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] relative">
      <Hud xp={state.xp} gems={state.gems} streak={state.streak} />

      <div className="flex-1 overflow-y-auto pb-4">
        {ZONES.map((zone, zi) => {
          const firstUnfinishedIdx = zone.acts.findIndex(a => !state.completedActs.includes(a.id))
          return (
            <div key={zone.id} className="mb-5">
              {/* Zone header */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: zone.nameColor + '22', border: `1px solid ${zone.nameColor}44` }}>
                  {zone.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: zone.nameColor }}>{zone.name}</div>
                  <div className="text-[8px] text-[#4a6a9a]">{zone.sub}</div>
                </div>
                <span className={`text-[7px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-lg ${zone.locked ? 'bg-[#1a1a3a] text-[#4a6a9a] border border-[#2a2a5a]' : ''}`} style={!zone.locked ? { background: zone.nameColor + '22', color: zone.nameColor, border: `1px solid ${zone.nameColor}55` } : {}}>
                  {zone.locked ? '🔒 LOCKED' : `ZONE ${zi + 1}`}
                </span>
              </div>

              {/* Act scroll */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none px-3 pb-1">
                {zone.acts.map((act, ai) => {
                  const isDone = state.completedActs.includes(act.id)
                  const isActive = !zone.locked && !isDone && ai === firstUnfinishedIdx
                  const isLocked = zone.locked || (!isDone && !isActive && ai > firstUnfinishedIdx)
                  return (
                    <ActCard
                      key={act.id}
                      act={act}
                      zone={zone}
                      actIndex={ai}
                      isDone={isDone}
                      isActive={isActive}
                      isLocked={isLocked}
                      onClick={() => setSelectedAct({ act, zone, actIndex: ai })}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Act Panel */}
      {selectedAct && !activeLesson && !completionData && (
        <ActPanel
          act={selectedAct.act}
          zone={selectedAct.zone}
          actIndex={selectedAct.actIndex}
          onClose={() => setSelectedAct(null)}
          onStart={() => setActiveLesson(true)}
        />
      )}

      {/* Lesson overlay */}
      {activeLesson && selectedAct && !completionData && (
        <LessonOverlay
          act={selectedAct.act}
          zone={selectedAct.zone}
          onClose={() => { setActiveLesson(null); setSelectedAct(null) }}
          onComplete={handleActComplete}
        />
      )}

      {/* Completion overlay */}
      {completionData && (
        <CompleteOverlay
          {...completionData}
          onContinue={() => { setCompletionData(null); setSelectedAct(null) }}
        />
      )}
    </div>
  )
}
