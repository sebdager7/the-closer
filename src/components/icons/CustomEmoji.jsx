import React from 'react'

export function FireEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Outer flame */}
      <path d="M12 2C10 6 7 8 7 12a5 5 0 0010 0c0-2-1.5-3.5-2-5-1 2-2 3-2 5a1.5 1.5 0 01-3 0c0-3 2-5 2-10z"
        fill="#f97316" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Inner glow */}
      <path d="M12 8c-1 2-1.5 3-1.5 5a1.5 1.5 0 003 0c0-2-.5-3-1.5-5z"
        fill="#fbbf24"/>
      {/* Core */}
      <ellipse cx="12" cy="15" rx="1.5" ry="2" fill="#fef08a" opacity="0.8"/>
    </svg>
  )
}

export function BrainEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Left lobe */}
      <path d="M12 5C8.5 5 6 7.2 6 10c0 1.6.7 3 1.8 4-.9.7-1.5 1.8-1.3 3 .2 1.2 1.1 2 2.2 2H12"
        fill="#e879f9" fillOpacity="0.7" stroke="#d946ef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right lobe */}
      <path d="M12 5c3.5 0 6 2.2 6 5 0 1.6-.7 3-1.8 4 .9.7 1.5 1.8 1.3 3-.2 1.2-1.1 2-2.2 2H12"
        fill="#c084fc" fillOpacity="0.7" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Center divide */}
      <line x1="12" y1="5" x2="12" y2="19" stroke="#d946ef" strokeWidth="1.2" strokeDasharray="2 2" strokeLinecap="round"/>
      {/* Swirl details */}
      <path d="M9 9c0 1 .5 1.8 1.2 2.2" stroke="#f0abfc" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M15 9c0 1-.5 1.8-1.2 2.2" stroke="#c4b5fd" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

export function RobotEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Antenna */}
      <line x1="12" y1="1.5" x2="12" y2="4.5" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="1.5" r="1.3" fill="#3b82f6"/>
      {/* Head */}
      <rect x="4" y="4.5" width="16" height="14" rx="3" fill="#1e40af" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="1.8"/>
      {/* Eyes */}
      <circle cx="9" cy="11" r="2.5" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5"/>
      <circle cx="15" cy="11" r="2.5" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5"/>
      <circle cx="9" cy="11" r="1.1" fill="#1d4ed8"/>
      <circle cx="15" cy="11" r="1.1" fill="#1d4ed8"/>
      <circle cx="9.5" cy="10.4" r="0.4" fill="white"/>
      <circle cx="15.5" cy="10.4" r="0.4" fill="white"/>
      {/* Mouth */}
      <path d="M8 15.5h2.5M11 15.5h2.5M13.5 15.5H16" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

export function TrophyEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Star burst behind */}
      <path d="M12 1l1 3.5 3-1.5-1.5 3 3.5 1-3.5 1 1.5 3-3-1.5L12 14l-1-3.5-3 1.5 1.5-3L6 8l3.5-1-1.5-3 3 1.5z"
        fill="#fbbf24" fillOpacity="0.4"/>
      {/* Cup body */}
      <path d="M7 4h10l-1.5 8H8.5L7 4z"
        fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Handles */}
      <path d="M7 6H5a2 2 0 000 4h2" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 6h2a2 2 0 010 4h-2" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Base */}
      <rect x="9" y="12" width="6" height="1.5" rx="0.5" fill="#f59e0b"/>
      <rect x="7.5" y="13.5" width="9" height="2" rx="1" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
      {/* Star on cup */}
      <path d="M12 6l.5 1.5H14l-1.2.9.5 1.5L12 9l-1.3.9.5-1.5L10 7.5h1.5z" fill="#fff" fillOpacity="0.8"/>
    </svg>
  )
}

export function LightningEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Outer glow blob */}
      <path d="M14 2L5 14h7l-2 8 9-12h-7l2-8z"
        fill="#fde047" fillOpacity="0.3" stroke="none"/>
      {/* Main bolt */}
      <path d="M14 2L5 14h7l-2 8 9-12h-7l2-8z"
        fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Inner bright core */}
      <path d="M13 5l-6 8h5.5l-1.5 5 6.5-9h-5.5L13 5z"
        fill="#fef08a" fillOpacity="0.7"/>
    </svg>
  )
}

export function MoneyEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Circle */}
      <circle cx="12" cy="12" r="10" fill="#16a34a" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1.8"/>
      {/* Dollar sign */}
      <path d="M12 5.5v13M9.5 8.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 2-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2"
        stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      {/* Sparkles */}
      <path d="M3 5l1 1M3 6l1-1M20 5l1 1M20 6l1-1" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="4" cy="19" r="0.8" fill="#4ade80"/>
      <circle cx="20" cy="4" r="0.8" fill="#4ade80"/>
    </svg>
  )
}

export function TargetEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Outer ring */}
      <circle cx="12" cy="12" r="9.5" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1.8"/>
      {/* Middle ring */}
      <circle cx="12" cy="12" r="6" fill="white" fillOpacity="0.1" stroke="#ef4444" strokeWidth="1.8"/>
      {/* Inner dot */}
      <circle cx="12" cy="12" r="2.5" fill="#ef4444" fillOpacity="0.5" stroke="#dc2626" strokeWidth="1.8"/>
      {/* Arrow */}
      <path d="M18 6l-5.5 5.5" stroke="#1d4ed8" strokeWidth="2.3" strokeLinecap="round"/>
      <path d="M16 4l4 1-1 4" stroke="#1d4ed8" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
