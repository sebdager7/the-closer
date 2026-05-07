import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { useApp } from '../context/AppContext'
import { useT } from '../context/TranslationContext'
import { getRebuttal, callClaude } from '../utils/api'
import { INDUSTRIES } from '../data/constants'

export default function ObjectionsScreen() {
  const { state } = useApp()
  const t = useT()
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
      setError(t('objections_error'))
    } finally {
      setLoading(false)
    }
  }

  const STYLE_META = {
    soft: { labelKey: 'objections_soft', badgeCls: 'bg-blue-900/60 text-blue-300' },
    direct: { labelKey: 'objections_direct', badgeCls: 'bg-indigo-900/60 text-indigo-300' },
    aggressive: { labelKey: 'objections_aggressive', badgeCls: 'bg-red-900/60 text-red-300' },
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <BlitzBar message={t('objections_blitz')} />

      {/* Industry pills */}
      <div className="mb-1">
        <div className="text-[9px] font-bubble uppercase tracking-widest text-white/40 mb-2">{t('objections_industry')}</div>
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
        <div className="text-[9px] font-bubble uppercase tracking-widest text-white/40 mb-2">{t('objections_label')}</div>
        <textarea
          value={objText}
          onChange={e => setObjText(e.target.value)}
          placeholder={t('objections_placeholder')}
          rows={3}
          className="w-full bg-navy-800/80 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue resize-none"
        />
        <p className="text-[10px] text-white/30 mt-1 italic">{t('objections_responding_in')} {state.language}</p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          🌐 {t('objections_responding_in')} {state.language}
        </span>
        <button
          onClick={async () => {
            try {
              const result = await callClaude(`Say "Hello, I am testing the language system" in ${state.language}. Return ONLY the translated sentence, nothing else.`, 80)
              alert(`Language test:\n\n${result}\n\nIf this is in ${state.language} — it's working!`)
            } catch (e) {
              alert('Test failed: ' + e.message)
            }
          }}
          className="text-[9px] px-2 py-1 rounded-lg border hover:opacity-80 transition-opacity"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
        >
          {t('objections_test_lang')}
        </button>
      </div>

      <button
        onClick={handleGet}
        disabled={loading || !objText.trim()}
        className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm mb-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {loading ? t('objections_loading_btn') : t('objections_get_btn')}
      </button>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {results && (
        <div className="space-y-3 pb-4">
          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
            {t('objections_for')} "{objText.substring(0, 45)}{objText.length > 45 ? '...' : ''}"
          </div>
          {Object.entries(results).map(([key, d]) => {
            const meta = STYLE_META[key]
            if (!meta) return null
            return (
              <div key={key} className="bg-navy-800/60 border border-white/10 rounded-xl p-4">
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${meta.badgeCls}`}>
                  {t(meta.labelKey)}
                </span>
                <div className="text-[10px] font-bold text-gold-500 mb-2">{d.closer}</div>
                <p className="text-sm text-white leading-relaxed mb-2">"{d.script}"</p>
                <p className="text-[10px] text-white/50">{t('objections_tone')} {d.tone}</p>
                <p className="text-[10px] text-white/40 italic border-t border-white/10 pt-2 mt-2">{t('objections_followup')} {d.followup}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
