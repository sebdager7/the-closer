import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { useApp } from '../context/AppContext'
import { generatePitch, improvePitch } from '../utils/api'
import { INDUSTRIES, PITCH_FRAMEWORKS, REBUILD_FRAMEWORKS } from '../data/constants'

export default function PitchScreen() {
  const { state } = useApp()
  const [mode, setMode] = useState('create')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [lastPromptArgs, setLastPromptArgs] = useState(null)

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
    if (!product.trim()) return
    setLoading(true)
    try {
      const args = { product, industry: pitchIndustry, framework, audience, keywords, language: state.language, customBrain: state.customBrain }
      setLastPromptArgs({ type: 'create', ...args })
      const data = await generatePitch(product, pitchIndustry, framework, audience, keywords, state.language, state.customBrain)
      setResult(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleImprove = async () => {
    if (!existing.trim()) return
    setLoading(true)
    try {
      setLastPromptArgs({ type: 'improve', existing, industry: improveIndustry, framework: rebuildFw, language: state.language })
      const data = await improvePitch(existing, improveIndustry, rebuildFw, state.language)
      setResult(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleRedo = async () => {
    if (!lastPromptArgs) return
    setLoading(true)
    try {
      let data
      if (lastPromptArgs.type === 'create') {
        data = await generatePitch(lastPromptArgs.product, lastPromptArgs.industry, lastPromptArgs.framework, lastPromptArgs.audience, lastPromptArgs.keywords, lastPromptArgs.language, state.customBrain)
      } else {
        data = await improvePitch(lastPromptArgs.existing, lastPromptArgs.industry, lastPromptArgs.framework, lastPromptArgs.language)
      }
      setResult(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const ScoreBar = ({ label, value }) => (
    <div className="bg-navy-800/80 border border-white/10 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-closer-blue">{value}</div>
      <div className="text-[9px] text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 font-sora">
      <BlitzBar message="I build pitches using <strong>Andy Elliott's 10-step</strong>, <strong>Belfort's Straight Line</strong>, <strong>Cardone's tonality</strong>. Real patterns. Not AI theory." />

      {/* Mode tabs */}
      <div className="flex gap-2 mb-4">
        {[['create', 'Build from scratch'], ['improve', 'Rebuild my pitch']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${mode === id ? 'bg-closer-blue border-closer-blue text-white' : 'border-white/15 text-white/50 bg-white/5 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'create' ? (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Industry</label>
              <select value={pitchIndustry} onChange={e => setPitchIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Framework</label>
              <select value={framework} onChange={e => setFramework(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {PITCH_FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Product / service</label>
            <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. $0-down solar, whole-life insurance..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Audience</label>
              <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="homeowners..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Keywords</label>
              <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="save money..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
          </div>
          <button onClick={handleGenerate} disabled={loading || !product.trim()} className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm disabled:opacity-40 hover:bg-blue-600 transition-colors">
            {loading ? '⏳ Generating...' : '⚡ Generate elite pitch'}
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Paste your pitch</label>
            <textarea value={existing} onChange={e => setExisting(e.target.value)} placeholder="Paste your pitch here..." rows={4} className="w-full bg-navy-800/80 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Industry</label>
              <select value={improveIndustry} onChange={e => setImproveIndustry(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Rebuild using</label>
              <select value={rebuildFw} onChange={e => setRebuildFw(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
                {REBUILD_FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleImprove} disabled={loading || !existing.trim()} className="w-full py-3 rounded-xl bg-closer-blue text-white font-bold text-sm disabled:opacity-40 hover:bg-blue-600 transition-colors">
            {loading ? '⏳ Rebuilding...' : '🔧 Rebuild my pitch'}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
              {mode === 'create' ? 'Your elite pitch' : 'Rebuilt pitch'}
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard?.writeText(result.pitch)} className="text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-white/60 hover:bg-white/15">Copy</button>
              <button onClick={handleRedo} disabled={loading} className="text-xs px-3 py-1 rounded-lg bg-closer-blue/20 border border-closer-blue/30 text-closer-blue hover:bg-closer-blue/30 disabled:opacity-40">Redo</button>
            </div>
          </div>
          <textarea readOnly value={result.pitch} rows={6} className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-3 text-white text-sm leading-relaxed resize-none focus:outline-none" />
          <div className="grid grid-cols-3 gap-2">
            <ScoreBar label="Hook" value={result.hook_score} />
            <ScoreBar label="Confidence" value={result.confidence_score} />
            <ScoreBar label="Close Power" value={result.close_score} />
          </div>
          {result.feedback && (
            <div className="bg-navy-800/60 border-l-2 border-closer-blue rounded-r-xl px-3 py-2">
              <p className="text-xs text-white/70 leading-relaxed">{result.feedback}</p>
            </div>
          )}
          {result.strength_tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.strength_tags.map(t => (
                <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
