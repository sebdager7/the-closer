import React from 'react'

const GLOW = '#1a6bbf'

const g = (active) => active
  ? { filter: `drop-shadow(0 0 5px ${GLOW}) drop-shadow(0 0 2px ${GLOW})` }
  : undefined

export function ObjectionsIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Bubble body */}
      <path d="M3 5a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H9.5L5 20v-4H6a3 3 0 01-3-3V5z"
        fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Lightning bolt */}
      <path d="M13.5 5.5l-3.5 5h4l-2.5 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function PitchIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Pencil body */}
      <path d="M16.5 3.5a2 2 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
        fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M15 5l4 4" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/>
      {/* Star sparks at tip */}
      <path d="M5.5 17.5l-1.5 1.5M4 18.5l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="3.5" cy="20" r="1" fill="currentColor"/>
    </svg>
  )
}

export function PsychologyIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Brain left lobe */}
      <path d="M12 5c-4 0-7 2.5-7 6 0 1.8.8 3.4 2 4.5-.8.8-1.3 2-1 3.3.3 1.3 1.4 2.2 2.7 2.2H12"
        fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Brain right lobe */}
      <path d="M12 5c4 0 7 2.5 7 6 0 1.8-.8 3.4-2 4.5.8.8 1.3 2 1 3.3-.3 1.3-1.4 2.2-2.7 2.2H12"
        fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Brain center line */}
      <line x1="12" y1="5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.5 2" strokeLinecap="round"/>
      {/* Mini controller */}
      <rect x="8.5" y="10" width="7" height="4.5" rx="2.2" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10.5" cy="12.2" r="0.7" fill="currentColor"/>
      <circle cx="13.5" cy="12.2" r="0.7" fill="currentColor"/>
    </svg>
  )
}

export function TrainingIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Antenna */}
      <line x1="12" y1="1.5" x2="12" y2="5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="12" cy="1.5" r="1.5" fill="currentColor"/>
      {/* Head */}
      <rect x="3.5" y="5" width="17" height="14" rx="3.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.3"/>
      {/* Eyes */}
      <circle cx="9" cy="11.5" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="15" cy="11.5" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
      {/* Inner pupils */}
      <circle cx="9" cy="11.5" r="1" fill="currentColor"/>
      <circle cx="15" cy="11.5" r="1" fill="currentColor"/>
      {/* Mouth grid */}
      <path d="M7.5 16.5h3M10.5 16.5h3M13.5 16.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function ProgressIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Bar 1 */}
      <rect x="2" y="17" width="5" height="5" rx="1.2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.2"/>
      {/* Bar 2 */}
      <rect x="9.5" y="12" width="5" height="10" rx="1.2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.2"/>
      {/* Bar 3 */}
      <rect x="17" y="7" width="5" height="15" rx="1.2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.2"/>
      {/* Upward arrow bursting from bar 3 */}
      <path d="M19.5 7V2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/>
      <path d="M17 4.5l2.5-2.5 2.5 2.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function BrainNavIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Head silhouette */}
      <path d="M7 22v-2.5c0-1.2.6-2.3 1.5-3C7.6 15.6 7 14.4 7 13c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.4-.6 2.6-1.5 3.5.9.7 1.5 1.8 1.5 3V22"
        fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Lightbulb glow */}
      <circle cx="12" cy="9" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8"/>
      {/* Filament lines */}
      <path d="M10.5 11h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M10.5 12.2h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      {/* Sparkles */}
      <path d="M9 7l-.6-.6M15 7l.6-.6M12 5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

export function AgencyIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Crown */}
      <path d="M7 9l5-5 5 5 2.5-3v4.5H4.5V6L7 9z"
        fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Building */}
      <rect x="3" y="10" width="18" height="12" rx="1.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.2"/>
      {/* Windows */}
      <rect x="6" y="13" width="3" height="3.5" rx="0.7" fill="currentColor" fillOpacity="0.5"/>
      <rect x="10.5" y="13" width="3" height="3.5" rx="0.7" fill="currentColor" fillOpacity="0.5"/>
      <rect x="15" y="13" width="3" height="3.5" rx="0.7" fill="currentColor" fillOpacity="0.5"/>
      {/* Door */}
      <rect x="9.5" y="18" width="5" height="4" rx="1" fill="currentColor" fillOpacity="0.45"/>
    </svg>
  )
}

export function ChatIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Back bubble (top-right) */}
      <path d="M9 3h9a3 3 0 013 3v5a3 3 0 01-3 3h-1v3l-4-3H9a3 3 0 01-3-3V6a3 3 0 013-3z"
        fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round"/>
      {/* Front bubble (bottom-left) */}
      <path d="M3 10h8a3 3 0 013 3v3a3 3 0 01-3 3h-1v3l-4-3H3a3 3 0 01-3-3v-3a3 3 0 013-3z"
        fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
      {/* Heart in overlap area */}
      <path d="M7.5 14.8c0-.7.5-1.3 1.2-1.3.4 0 .8.2.8.5.1-.3.4-.5.8-.5.7 0 1.2.6 1.2 1.3 0 .9-1.2 2-2 2.4-.9-.4-2-1.5-2-2.4z"
        fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  )
}

export function PlansIcon({ size = 20, active = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={g(active)}>
      {/* Shield */}
      <path d="M12 2L3.5 6v6c0 4.8 3.7 9.3 8.5 10.7C16.8 21.3 20.5 16.8 20.5 12V6L12 2z"
        fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Checkmark */}
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Star burst at top */}
      <circle cx="12" cy="2" r="1.8" fill="currentColor"/>
    </svg>
  )
}
