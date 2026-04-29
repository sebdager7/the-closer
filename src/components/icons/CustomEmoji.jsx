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

export function FlameEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M16 2C13 8 8 11 8 17a8 8 0 0016 0c0-3-2-5-3-7-1.5 3-2.5 4.5-2.5 7a2 2 0 01-4 0c0-4 3-7 3-15z"
        fill="#f97316" stroke="#ea580c" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 10c-1.5 3-2 4.5-2 7a2 2 0 004 0c0-2.5-.5-4.5-2-7z" fill="#fbbf24"/>
      <ellipse cx="16" cy="20" rx="2" ry="2.5" fill="#fef08a" opacity="0.9"/>
    </svg>
  )
}

export function MuscleEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M6 20C6 12 10 8 16 8C22 8 26 12 26 20C26 22 24 24 22 24"
        fill="#f97316" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 24C20 26 18 27 16 27C12 27 9 25 8 22C7 20 8 18 10 17"
        fill="#f97316" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="16" cy="14" rx="5" ry="4" fill="#fb923c" opacity="0.5"/>
      <path d="M13 12Q14 10 16 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}

export function HundredEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="1" y="5" width="30" height="16" rx="3" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="4" y="17" fontSize="11" fontWeight="900" fill="#ef4444" fontFamily="Arial,sans-serif">100</text>
      <line x1="3" y1="24" x2="29" y2="24" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="28" x2="27" y2="28" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function LightbulbEmoji({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="16" cy="13" r="9" fill="#fde047" fillOpacity="0.18"/>
      <path d="M11 15C11 11 13 7 16 7C19 7 21 11 21 15C21 17 20 18.5 19 20L13 20C12 18.5 11 17 11 15Z"
        fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="13" y="20" width="6" height="2" rx="1" fill="#f59e0b"/>
      <rect x="13.5" y="22" width="5" height="2" rx="1" fill="#f59e0b"/>
      <path d="M13 13Q14 9 16 10" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"/>
      <line x1="16" y1="3" x2="16" y2="5" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="5.5" x2="20.5" y2="7" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="5.5" x2="11.5" y2="7" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function ReactionEmoji({ emoji, size = 14 }) {
  const map = {
    '🔥': FlameEmoji,
    '💰': MoneyEmoji,
    '💪': MuscleEmoji,
    '💯': HundredEmoji,
    '🏆': TrophyEmoji,
    '⚡': LightningEmoji,
    '💡': LightbulbEmoji,
    '🎯': TargetEmoji,
  }
  const Component = map[emoji]
  if (Component) return <Component size={size} />
  return <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
}
