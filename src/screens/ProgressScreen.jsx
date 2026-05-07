import React, { useEffect, useRef } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { useApp } from '../context/AppContext'
import { useT } from '../context/TranslationContext'
import { CONF_METRICS } from '../data/constants'

function MetricBar({ label, val, prev }) {
  const fillRef = useRef(null)
  const change = val - prev

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = val + '%'
    }, 100)
    return () => clearTimeout(t)
  }, [val])

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs text-white/60 w-28 flex-shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={fillRef}
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: '0%', background: 'linear-gradient(90deg, #1a6bbf, #22c55e)' }}
          />
        </div>
        <span className="text-xs font-bold text-closer-blue w-8 text-right">{val}%</span>
        {change !== 0 && (
          <span className="text-[10px] font-bold text-green-400 w-10 text-right">
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
        {change === 0 && <span className="w-10" />}
      </div>
    </div>
  )
}

export default function ProgressScreen() {
  const { state } = useApp()
  const t = useT()

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white leading-tight">
          {state.user?.name || 'Closer'},{' '}
          <span className="text-gold">{t('progress_your_progress')}</span>
        </h1>
      </div>

      <BlitzBar message={t('progress_blitz')} />

      <div className="text-[9px] font-bubble uppercase tracking-widest text-white/40 mb-3">{t('progress_performance')}</div>
      <div className="mb-6">
        {CONF_METRICS.map(m => (
          <MetricBar key={m.key} label={t('metric_' + m.key)} val={state.metrics[m.key]} prev={state.metricsPrev[m.key]} />
        ))}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="text-[9px] font-bubble uppercase tracking-widest text-white/40 mb-3">{t('progress_session_stats')}</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: state.callCount, lk: 'progress_calls', color: 'text-closer-blue' },
            { v: state.closeCount, lk: 'progress_closes', color: 'text-green-400' },
            { v: '$' + state.totalRevenue.toLocaleString(), lk: 'progress_revenue', color: 'text-gold-400' },
            { v: state.callStreak + '🔥', lk: 'progress_streak', color: 'text-orange-400' },
          ].map(s => (
            <div key={s.lk} className="bg-navy-800/60 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.v}</div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">{t(s.lk)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress */}
      <div className="mt-4 bg-navy-800/60 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">{t('progress_xp')}</span>
          <span className="text-xs font-bold text-gold-400">{state.xp} / 1000</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all" style={{ width: Math.min(state.xp / 1000 * 100, 100) + '%' }} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-white/30">{t('progress_gems')}: 💎 {state.gems}</span>
          <span className="text-[10px] text-white/30">{t('progress_streak')}: 🔥 {state.streak} days</span>
        </div>
      </div>
    </div>
  )
}
