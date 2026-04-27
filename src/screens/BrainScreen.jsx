import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'

export default function BrainScreen() {
  const { state, dispatch } = useApp()
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
      <BlitzBar message={`<strong>Blitz:</strong> Train me on YOUR business. Upload your offer, ICP, and the objections you hear most. Every rebuttal, pitch, and training call becomes 100% customized to you.`} />

      {[
        { label: '📋 Your offer / product', id: 'offer', val: offer, set: setOffer, rows: 3, ph: "What do you sell? What's the value prop? Price points? Key benefits..." },
        { label: '👤 Ideal client profile', id: 'icp', val: icp, set: setIcp, rows: 2, ph: "Who is your perfect customer? Demographics, pain points, desires, income level..." },
        { label: '🛡️ Top objections you hear', id: 'obj', val: objections, set: setObjections, rows: 2, ph: "e.g. 'too expensive', 'need to think about it', 'my spouse needs to decide'..." },
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
        🧠 Train Blitz on my business
      </button>

      {saved && (
        <div className="flex items-start gap-3 bg-navy-800/80 rounded-xl p-3 border border-gold-500/30 animate-fade-in">
          <BlitzIcon size={28} />
          <p className="text-sm text-white/90 leading-relaxed flex-1">
            <strong className="text-gold-400">Blitz:</strong> Done! I've loaded your offer, ICP, and top objections. Every pitch, rebuttal, and training call is now tailored to your exact business.
          </p>
        </div>
      )}

      {state.customBrain.offer && !saved && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-[10px] text-green-400 font-medium">✓ Custom brain active — Blitz is trained on your business</p>
        </div>
      )}
    </div>
  )
}
