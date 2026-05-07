import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { useT } from '../context/TranslationContext'

export default function BrainScreen() {
  const { state, dispatch } = useApp()
  const t = useT()
  const [offer, setOffer] = useState(state.customBrain.offer)
  const [icp, setIcp] = useState(state.customBrain.icp)
  const [objections, setObjections] = useState(state.customBrain.objections)
  const [saved, setSaved] = useState(false)

  const handleTrain = () => {
    dispatch({ type: 'SET_CUSTOM_BRAIN', payload: { offer, icp, objections } })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <BlitzBar message={t('brain_blitz')} />

      {[
        { label: t('brain_offer'), id: 'offer', val: offer, set: setOffer, rows: 3, ph: t('brain_offer_ph') },
        { label: t('brain_icp'), id: 'icp', val: icp, set: setIcp, rows: 2, ph: t('brain_icp_ph') },
        { label: t('brain_objections'), id: 'obj', val: objections, set: setObjections, rows: 2, ph: t('brain_obj_ph') },
      ].map(f => (
        <div key={f.id} className="bg-navy-800/60 border border-white/10 rounded-xl p-4 mb-3">
          <div className="text-xs font-bold text-white mb-3">{f.label}</div>
          <textarea
            value={f.val}
            onChange={e => f.set(e.target.value)}
            placeholder={f.ph}
            rows={f.rows}
            className="w-full bg-navy-950/60 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-closer-blue resize-none"
          />
        </div>
      ))}

      <button
        onClick={handleTrain}
        className="w-full py-3.5 bg-closer-blue text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-colors mb-3"
      >
        {t('brain_train_btn')}
      </button>

      {saved && (
        <div className="flex items-start gap-3 bg-navy-800/80 rounded-xl p-3 border border-gold-500/30 animate-fade-in">
          <BlitzIcon size={28} />
          <p className="text-sm text-white/90 leading-relaxed flex-1">
            <strong className="text-gold-400">Blitz:</strong> {t('brain_saved')}
          </p>
        </div>
      )}

      {state.customBrain.offer && !saved && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-[10px] text-green-400 font-medium">{t('brain_active')}</p>
        </div>
      )}

      <div className="bg-navy-800/60 border border-gold-500/25 rounded-xl p-4 mt-4">
        <div className="text-[9px] font-bold text-gold-400 uppercase tracking-widest mb-2">{t('brain_voices_title')}</div>
        <p className="text-xs text-white/60 leading-relaxed mb-3">
          {t('brain_voices_desc').split('.env').map((part, i, arr) =>
            i < arr.length - 1
              ? <span key={i}>{part}<span className="text-white/80 font-mono">.env</span></span>
              : <span key={i}>{part}</span>
          )}
        </p>
        <div className="bg-navy-950/60 rounded-lg px-3 py-2 font-mono text-xs text-white/40 mb-3 select-all">
          VITE_ELEVENLABS_API_KEY=your_key_here
        </div>
        <a
          href="https://elevenlabs.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-closer-blue underline"
        >
          {t('brain_get_key')}
        </a>
      </div>
    </div>
  )
}
