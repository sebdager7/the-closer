import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { useApp } from '../context/AppContext'
import { getRebuttal } from '../utils/api'
import { INDUSTRIES } from '../data/constants'

export default function ObjectionsScreen() {
  const { state } = useApp()
  const [industry, setIndustry] = useState('Door-to-Door')
  const [objText, setObjText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleGet = async () => {
    if (!objText.trim()) return
    setLoading(true); setError(''); setResults(null)
    try {
      const data = await getRebuttal(objText, industry, state.language, state.customBrain)
      setResults(data)
    } catch (e) {
      setError('Something went wrong. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const STYLE_META = {
    soft: { label: 'Soft Close', badgeCls: 'bg-blue-900/60 text-blue-300' },
    direct: { label: 'Direct', badgeCls: 'bg-indigo-900/60 text-indigo-300' },
    aggressive: { label: 'Aggressive', badgeCls: 'bg-red-900/60 text-red-300' },
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 font-sora">
      <BlitzBar message="Type any objection you're getting crushed on. I'll give you 3 battle-tested scripts — Andy Elliott soft close, Belfort direct, Cardone aggressive. Real frameworks, real money." />

      {/* Industry pills */}
      <div className="mb-1">
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Industry</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                industry === ind
                  ? 'bg-closer-blue border-closer-blue text-white'
                  : 'border-white/15 bg-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Objection input */}
      <div className="mb-1">
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Objection</div>
        <textarea
          value={objText}
          onChange={e => setObjText(e.target.value)}
          placeholder="e.g. 'I need to think about it' or 'Your price is too high'..."
          rows={3}
          className="w-full bg-navy-800/80 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue resize-none"
        />
        <p className="text-[10px] text-white/30 mt-1 italic">Responses in {state.language}</p>
      </div>

      <button
        onClick={handleGet}
        disabled={loading || !objText.trim()}
        className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm mb-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {loading ? '⏳ Blitz is loading elite scripts...' : 'Get elite rebuttals'}
      </button>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {results && (
        <div className="space-y-3 pb-4">
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
            Rebuttals for: "{objText.substring(0, 45)}{objText.length > 45 ? '...' : ''}"
          </div>
          {Object.entries(results).map(([key, d]) => {
            const meta = STYLE_META[key]
            return (
              <div key={key} className="bg-navy-800/60 border border-white/10 rounded-xl p-4">
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${meta.badgeCls}`}>
                  {meta.label}
                </span>
                <div className="text-[10px] font-bold text-gold-500 mb-2">{d.closer}</div>
                <p className="text-sm text-white leading-relaxed mb-2">"{d.script}"</p>
                <p className="text-[10px] text-white/50">Tone: {d.tone}</p>
                <p className="text-[10px] text-white/40 italic border-t border-white/10 pt-2 mt-2">Follow-up: {d.followup}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
