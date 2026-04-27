import React from 'react'
import { useApp } from '../context/AppContext'
import { PLANS } from '../data/constants'

export default function PlansScreen() {
  const { state, dispatch } = useApp()

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <h2 className="text-base font-bold text-white mb-1">Plans & Pricing</h2>
      <p className="text-xs text-white/40 mb-4">Cancel or upgrade anytime</p>

      {PLANS.map(plan => (
        <div key={plan.id} className={`relative rounded-2xl p-4 mb-3 border-2 ${
          plan.id === 'elite' ? 'border-gold-500/70 bg-gradient-to-br from-navy-900 to-[#0f1f3a]' :
          plan.id === 'pro' ? 'border-closer-blue/70 bg-navy-800/60' :
          'border-white/15 bg-navy-800/40'
        }`}>
          {plan.badge && (
            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
              plan.badgeColor === 'gold'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900'
                : 'bg-closer-blue text-white'
            }`}>{plan.badge}</div>
          )}

          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">{plan.name}</h3>
              {plan.id === state.plan && (
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 mt-1 inline-block">✓ Current plan</span>
              )}
            </div>
            <div className="text-right">
              <div className={`text-2xl font-extrabold ${
                plan.id === 'elite' ? 'text-gold-400' : plan.id === 'pro' ? 'text-closer-blue' : 'text-white/50'
              }`}>{plan.priceDisplay}</div>
              <div className="text-[10px] text-white/40">{plan.period}</div>
            </div>
          </div>

          <ul className="space-y-1.5 mb-4">
            {plan.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                <span className="text-green-400 font-bold text-sm flex-shrink-0">✓</span> {f}
              </li>
            ))}
            {plan.locked.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/25 line-through">
                <span className="text-white/20 font-bold text-sm flex-shrink-0">✕</span> {f}
              </li>
            ))}
          </ul>

          {plan.agencyNote && (
            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl p-3 mb-3 border border-gold-500/20">
              <p className="text-[10px] text-gold-400 leading-relaxed">{plan.agencyNote}</p>
            </div>
          )}

          {plan.id !== state.plan ? (
            <button
              onClick={() => dispatch({ type: 'SET_PLAN', payload: plan.id })}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                plan.id === 'elite'
                  ? 'btn-gold hover:opacity-90'
                  : plan.id === 'pro'
                  ? 'bg-closer-blue text-white hover:bg-blue-600'
                  : 'bg-white/10 text-white/50 border border-white/15 hover:bg-white/15'
              }`}
            >
              {plan.id === 'free' ? 'Downgrade to Free' : `Upgrade to ${plan.name}`}
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-center text-sm font-bold text-green-400">
              ✓ Active Plan
            </div>
          )}
        </div>
      ))}

      <div className="bg-navy-800/40 border border-white/10 rounded-xl p-4 mt-2">
        <h4 className="text-xs font-bold text-white mb-3">All plans include:</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '🔒', text: '256-bit SSL security' },
            { icon: '💳', text: 'Cancel anytime' },
            { icon: '🌐', text: '14 languages' },
            { icon: '📱', text: 'iOS & Android ready' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-2">
              <span className="text-sm">{f.icon}</span>
              <span className="text-[10px] text-white/50">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
