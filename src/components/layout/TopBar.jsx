import React from 'react'
import BlitzIcon from './BlitzIcon'
import { useApp } from '../../context/AppContext'
import { LANGUAGES } from '../../data/constants'

const PLAN_BADGES = {
  free: { label: '🎯 Free', className: 'bg-white/10 text-white/60' },
  pro: { label: '⚡ Pro', className: 'bg-closer-blue/20 text-closer-blue border border-closer-blue/30' },
  elite: { label: '🔥 Elite', className: 'bg-gold-500/20 text-gold-400 border border-gold-500/30' },
}

export default function TopBar() {
  const { state, dispatch } = useApp()
  const badge = PLAN_BADGES[state.plan || 'free']

  return (
    <header className="bg-navy-800 px-4 py-2.5 flex items-center justify-between gap-2 flex-shrink-0 border-b border-navy-700">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BlitzIcon size={26} />
        <div>
          <div className="text-sm font-bold text-gold-400 tracking-wide leading-none">THE CLOSER</div>
          <div className="text-[7px] text-white/30 tracking-[0.15em] uppercase mt-0.5">Elite Sales Intelligence</div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Plan badge */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badge.className}`}>
          {badge.label}
        </span>

        {/* Language selector */}
        <select
          value={state.language}
          onChange={e => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })}
          className="bg-white/10 border border-white/20 text-white text-xs rounded-md px-1.5 py-1 focus:outline-none focus:border-closer-blue cursor-pointer"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        {/* Theme toggle */}
        <button
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
          className="text-white/50 hover:text-white transition-colors text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"
          title="Toggle theme"
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
