import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { useApp } from '../context/AppContext'
import { useT } from '../context/TranslationContext'
import { generatePitch, improvePitch, callClaude } from '../utils/api'
import { INDUSTRIES, PITCH_FRAMEWORKS, REBUILD_FRAMEWORKS } from '../data/constants'

export default function PitchScreen() {
  const { state } = useApp()
  const t = useT()
  const [mode, setMode] = useState('create')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [lastPromptArgs, setLastPromptArgs] = useState(null)

  const testAPI = async () => {
    setError('')
    try {
      const r = await callClaude('Reply with only the word: WORKING', 20)
      if (r.includes('WORKING')) {
        alert('✅ API connection working! Your key is valid.')
      } else {
        alert('⚠️ API responded but with unexpected content: ' + r)
      }
    } catch (err) {
      alert('❌ API test failed: ' + err.message)
    }
  }

  // Create form state
  const [product, setProduct] = useState('')
  const [pitchIndustry, setPitchIndustry] = useState('Door-to-Door')
  const [framework, setFramework] = useState(PITCH_FRAMEWORKS[0])
  const [audience, setAudience] = useState('')
  const [keywords, setKeywords] = useState('')

  // Improve form state
  const [existing, setExisting] = useState('')
  const [improveIndustry, setImproveIndustry] = useState('Door-to-Door')
  const [rebuildFw, setRebuildFw] = useState(REBUILD_FRAMEWORKS[0])

  const handleGenerate = async () => {
    if (!product.trim()) { setError(t('pitch_no_product')); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setLastPromptArgs({ type: 'create', product, industry: pitchIndustry, framework, audience, keywords, language: state.language, customBrain: state.customBrain })
      const data = await generatePitch(product, pitchIndustry, framework, audience, keywords, state.language, state.customBrain)
      setResult(data)
    } catch (err) {
      console.error('[PITCH] Generation failed:', err)
      setError(err.message || 'Something went wrong. Check the browser console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleImprove = async () => {
    if (!existing.trim()) { setError(t('pitch_no_pitch')); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setLastPromptArgs({ type: 'improve', existing, industry: improveIndustry, framework: rebuildFw, language: state.language })
      const data = await improvePitch(existing, improveIndustry, rebuildFw, state.language)
      setResult(data)
    } catch (err) {
      console.error('[PITCH] Improve failed:', err)
      setError(err.message || 'Something went wrong. Check the browser console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleRedo = async () => {
    if (!lastPromptArgs) return
    setLoading(true); setError('')
    try {
      let data
      if (lastPromptArgs.type === 'create') {
        data = await generatePitch(lastPromptArgs.product, lastPromptArgs.industry, lastPromptArgs.framework, lastPromptArgs.audience, lastPromptArgs.keywords, lastPromptArgs.language, state.customBrain)
      } else {
        data = await improvePitch(lastPromptArgs.existing, lastPromptArgs.industry, lastPromptArgs.framework, lastPromptArgs.language)
      }
      setResult(data)
    } catch (e) { setError(e.message || 'Something went wrong. Check your connection and try again.') }
    setLoading(false)
  }

  const ScoreBar = ({ label, value }) => (
    <div className="bg-navy-800/80 border border-white/10 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-closer-blue">{value}</div>
      <div className="text-[9px] text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <BlitzBar message={t('pitch_blitz')} />

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        {[['create', t('pitch_build')], ['improve', t('pitch_rebuild')]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${mode === id ? 'bg-closer-blue border-closer-blue text-white' : 'border-white/15 text-white/50 bg-white/5 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'create' ? (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_industry')}</label>
              <select value={pitchIndustry} onChange={e => setPitchIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_framework')}</label>
              <select value={framework} onChange={e => setFramework(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {PITCH_FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_product')}</label>
            <input value={product} onChange={e => setProduct(e.target.value)} placeholder={t('pitch_product_ph')} className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_audience')}</label>
              <input value={audience} onChange={e => setAudience(e.target.value)} placeholder={t('pitch_audience_ph')} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_keywords')}</label>
              <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder={t('pitch_keywords_ph')} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-white/60 font-medium">{t('pitch_loading_create')}</p>
            </div>
          ) : (
            <>
              <button onClick={handleGenerate} disabled={!product.trim()} className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm disabled:opacity-40 hover:bg-blue-600 transition-colors">
                {t('pitch_generate_btn')}
              </button>
              <button onClick={testAPI} className="w-full py-2 mt-2 rounded-xl border border-white/15 bg-transparent text-white/40 text-xs hover:bg-white/5 hover:text-white/60 transition-colors">
                {t('pitch_test_api')}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_paste_label')}</label>
            <textarea value={existing} onChange={e => setExisting(e.target.value)} placeholder={t('pitch_paste_ph')} rows={4} className="w-full bg-navy-800/80 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_industry')}</label>
              <select value={improveIndustry} onChange={e => setImproveIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{t('pitch_rebuild_using')}</label>
              <select value={rebuildFw} onChange={e => setRebuildFw(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {REBUILD_FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-closer-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-white/60 font-medium">{t('pitch_loading_rebuild')}</p>
            </div>
          ) : (
            <>
              <button onClick={handleImprove} disabled={!existing.trim()} className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm disabled:opacity-40 hover:bg-blue-600 transition-colors">
                {t('pitch_rebuild_btn')}
              </button>
              <button onClick={testAPI} className="w-full py-2 mt-2 rounded-xl border border-white/15 bg-transparent text-white/40 text-xs hover:bg-white/5 hover:text-white/60 transition-colors">
                {t('pitch_test_api')}
              </button>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-red-300 mb-1">{t('pitch_error_title')}</p>
          <p className="text-xs text-red-300/70 leading-relaxed">{error}</p>
          <p className="text-xs text-white/30 mt-2">Check that your VITE_ANTHROPIC_API_KEY is set in your .env file and restart the dev server.</p>
        </div>
      )}

      {result && (
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
              {mode === 'create' ? t('pitch_your_pitch') : t('pitch_rebuilt_pitch')}
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard?.writeText(result.pitch)} className="text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-white/60 hover:bg-white/15">{t('pitch_copy')}</button>
              <button onClick={handleRedo} disabled={loading} className="text-xs px-3 py-1 rounded-lg bg-closer-blue/20 border border-closer-blue/30 text-closer-blue hover:bg-closer-blue/30 disabled:opacity-40">{t('pitch_redo')}</button>
            </div>
          </div>
          <textarea readOnly value={result.pitch} rows={6} className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm leading-relaxed resize-none focus:outline-none" />
          <div className="grid grid-cols-3 gap-2">
            <ScoreBar label={t('pitch_hook')} value={result.hook_score} />
            <ScoreBar label={t('pitch_confidence')} value={result.confidence_score} />
            <ScoreBar label={t('pitch_close_power')} value={result.close_score} />
          </div>
          {result.feedback && (
            <div className="bg-navy-800/60 border-l-2 border-closer-blue rounded-r-xl px-3 py-2">
              <p className="text-xs text-white/70 leading-relaxed">{result.feedback}</p>
            </div>
          )}
          {result.strength_tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.strength_tags.map(tag => (
                <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300">{tag}</span>
              ))}
            </div>
          )}

          {result.closer_blend?.length > 0 && mode === 'create' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-bubble text-white/40 uppercase tracking-wider">{t('pitch_closer_blend')}</span>
              {(Array.isArray(result.closer_blend) ? result.closer_blend : [result.closer_blend]).map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-gold-500/20 to-gold-400/10 border border-gold-500/40 text-gold-400">
                  ⚡ {c}
                </span>
              ))}
            </div>
          )}

          {result.power_moments?.length > 0 && (
            <div>
              <div className="text-[9px] font-bubble text-gold-400/70 uppercase tracking-widest mb-2">{t('pitch_power_moments')}</div>
              <div className="space-y-2">
                {result.power_moments.map((pm, i) => (
                  <div key={i} className="bg-gold-500/5 border border-gold-500/25 rounded-xl px-3.5 py-2.5">
                    <p className="text-sm text-gold-300 font-medium leading-relaxed italic">"{typeof pm === 'string' ? pm : pm.line}"</p>
                    {pm.technique && <p className="text-[9px] text-gold-500/70 font-bold uppercase tracking-wider mt-1.5">{pm.technique}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'improve' && result.what_was_wrong?.length > 0 && (
            <div className="space-y-2">
              <div className="bg-red-500/8 border border-red-500/25 rounded-xl p-3">
                <div className="text-[9px] font-bubble text-red-400 uppercase tracking-wider mb-2">{t('pitch_what_wrong')}</div>
                <ul className="space-y-1">
                  {result.what_was_wrong.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-red-300/80">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
              {result.what_was_fixed?.length > 0 && (
                <div className="bg-green-500/8 border border-green-500/25 rounded-xl p-3">
                  <div className="text-[9px] font-bubble text-green-400 uppercase tracking-wider mb-2">{t('pitch_what_fixed')}</div>
                  <ul className="space-y-1">
                    {result.what_was_fixed.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-green-300/80">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
