import React from 'react'
import BlitzIcon from './BlitzIcon'
import { useApp } from '../../context/AppContext'
import { LANGUAGES } from '../../data/constants'

const PLAN_BADGES = {
  free: { label: '🎯 Free', dark: 'bg-white/10 text-white/60', light: 'bg-black/8 text-gray-500' },
  pro: { label: '⚡ Pro', dark: 'bg-closer-blue/20 text-closer-blue border border-closer-blue/30', light: 'bg-blue-50 text-closer-blue border border-closer-blue/30' },
  elite: { label: '🔥 Elite', dark: 'bg-gold-500/20 text-gold-400 border border-gold-500/30', light: 'bg-amber-50 text-amber-600 border border-amber-300' },
}

function ThemeToggle() {
  const { state, dispatch } = useApp()
  const isDark = state.theme !== 'light'

  return (
    <button
      onClick={() => dispatch({ type: 'SET_THEME', payload: isDark ? 'light' : 'dark' })}
      title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        borderRadius: 20,
        gap: 2,
        border: isDark ? '1px solid rgba(26,107,191,0.45)' : '1px solid rgba(200,168,74,0.55)',
        background: isDark ? '#071428' : '#162847',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
    >
      {/* Sun — active bubble in light mode */}
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: 12,
        background: !isDark ? 'rgba(245,158,11,0.22)' : 'transparent',
        boxShadow: !isDark ? '0 0 8px rgba(245,158,11,0.5), inset 0 0 6px rgba(245,158,11,0.15)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={!isDark ? '#f59e0b' : 'rgba(255,255,255,0.22)'}
          strokeWidth="2.5" strokeLinecap="round"
          style={{ filter: !isDark ? 'drop-shadow(0 0 4px #f59e0b)' : 'none', transition: 'all 0.25s ease' }}
        >
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
        </svg>
      </span>
      {/* Moon — active bubble in dark mode */}
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: 12,
        background: isDark ? 'rgba(26,107,191,0.25)' : 'transparent',
        boxShadow: isDark ? '0 0 8px rgba(26,107,191,0.55), inset 0 0 6px rgba(26,107,191,0.15)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill={isDark ? '#4a9eff' : 'rgba(255,255,255,0.2)'}
          style={{ filter: isDark ? 'drop-shadow(0 0 4px #1a6bbf)' : 'none', transition: 'all 0.25s ease' }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
    </button>
  )
}

export default function TopBar() {
  const { state, dispatch } = useApp()
  const isDark = state.theme !== 'light'
  const badge = PLAN_BADGES[state.plan || 'free']
  const badgeCls = badge.dark

  return (
    <header
      className="px-4 py-2.5 flex items-center justify-between gap-2 flex-shrink-0 border-b transition-colors duration-300"
      style={{ background: 'var(--topbar-bg)', borderColor: 'var(--topbar-border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BlitzIcon size={26} />
        <div>
          <div className="text-sm font-bubble text-gold-400 tracking-wide leading-none">THE CLOSER</div>
          <div className="text-[7px] tracking-[0.15em] uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Elite Sales Intelligence</div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Plan badge */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeCls}`}>
          {badge.label}
        </span>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Debug: tap to confirm current theme */}
        <button
          onClick={() => alert(`Theme: ${state.theme}\nHTML class: ${document.documentElement.className}`)}
          style={{
            width: 22, height: 22, borderRadius: 11, fontSize: 11, fontWeight: 'bold',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.4)', flexShrink: 0, cursor: 'pointer',
          }}
          title="Debug theme state"
        >?</button>

        {/* Language selector */}
        <select
          value={state.language}
          onChange={e => {
            dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })
            console.log('[LANG] Changed to:', e.target.value)
          }}
          className="text-xs rounded-lg px-1.5 py-1 border focus:outline-none transition-colors cursor-pointer"
          style={{
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,168,74,0.12)',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(200,168,74,0.4)',
            color: '#ffffff',
          }}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </header>
  )
}
