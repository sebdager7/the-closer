import React, { useRef } from 'react'

export default function BlitzIcon({ size = 32, className = '', onClick }) {
  const svgRef = useRef(null)
  const w = size
  const h = Math.round(size * (95 / 80))

  const handleBlitzTap = (e) => {
    if (navigator.vibrate) navigator.vibrate([30, 20, 60, 20, 30])

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.4, ctx.currentTime)
      masterGain.connect(ctx.destination)

      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(1200, ctx.currentTime)
      osc1.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25)
      gain1.gain.setValueAtTime(0.5, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28)
      osc1.connect(gain1); gain1.connect(masterGain)
      osc1.start(ctx.currentTime); osc1.stop(ctx.currentTime + 0.28)

      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(220, ctx.currentTime)
      gain2.gain.setValueAtTime(0.3, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc2.connect(gain2); gain2.connect(masterGain)
      osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.3)

      setTimeout(() => ctx.close(), 400)
    } catch (err) {}

    const el = svgRef.current
    if (el) {
      el.classList.remove('blitz-bounce')
      void el.offsetWidth
      el.classList.add('blitz-bounce')
      setTimeout(() => el.classList.remove('blitz-bounce'), 600)
    }

    onClick?.(e)
  }

  // Separate blitz-* animation classes from utility classes (margins etc.)
  const blitzSpecialMatch = className.match(/blitz-(speaking|celebrate)/)
  const svgAnimClass = blitzSpecialMatch ? blitzSpecialMatch[0] : ''
  const wrapperUtilClasses = className.replace(/blitz-\S+/g, '').trim()
  const hasSpecialAnim = Boolean(blitzSpecialMatch)

  return (
    <div
      className={`${hasSpecialAnim ? '' : 'blitz-idle'} inline-flex ${wrapperUtilClasses}`.trim()}
      style={{ flexShrink: 0 }}
    >
      <svg
        ref={svgRef}
        id="blitz-icon-main"
        width={w}
        height={h}
        viewBox="0 0 80 95"
        fill="none"
        className={svgAnimClass}
        onClick={handleBlitzTap}
        style={{ cursor: 'pointer' }}
      >
        {/* Body */}
        <path d="M12 62 C12 38 20 24 40 24 C60 24 68 38 68 62 C68 74 55 82 40 82 C25 82 12 74 12 62 Z" fill="#111122"/>
        {/* Ears */}
        <path d="M22 38 L14 16 L28 28 Z" fill="#111122"/>
        <path d="M58 38 L66 16 L52 28 Z" fill="#111122"/>
        <path d="M23 36 L17 18 L27 27 Z" fill="#252540"/>
        <path d="M57 36 L63 18 L53 27 Z" fill="#252540"/>
        {/* Face */}
        <path d="M14 58 C14 40 22 28 40 28 C58 28 66 40 66 58 C66 68 54 76 40 76 C26 76 14 68 14 58 Z" fill="#181830"/>
        {/* Eyes — whites */}
        <ellipse cx="30" cy="49" rx="9" ry="8" fill="#fff"/>
        <ellipse cx="50" cy="49" rx="9" ry="8" fill="#fff"/>
        {/* Eyes — irises */}
        <ellipse cx="30" cy="49" rx="5.5" ry="5.5" fill="#1a6bbf"/>
        <ellipse cx="50" cy="49" rx="5.5" ry="5.5" fill="#1a6bbf"/>
        {/* Eyes — pupils */}
        <ellipse cx="30.5" cy="49" rx="3" ry="3.2" fill="#04040e"/>
        <ellipse cx="50.5" cy="49" rx="3" ry="3.2" fill="#04040e"/>
        {/* Eyes — shine */}
        <circle cx="31.5" cy="47.5" r="1.1" fill="#fff"/>
        <circle cx="51.5" cy="47.5" r="1.1" fill="#fff"/>
        {/* Whiskers */}
        <path d="M22 43 L37 40" stroke="#c8a84a" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M58 43 L43 40" stroke="#c8a84a" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Mouth — open smile arc */}
        <path d="M32 63 Q40 70 48 63" stroke="#0a0a1a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Inner mouth fill */}
        <path d="M32 63 Q40 70 48 63 Q45 68 40 69 Q35 68 32 63 Z" fill="#c84060"/>
        {/* Teeth line */}
        <path d="M34 63 Q40 67 46 63" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Tongue body */}
        <ellipse cx="40" cy="71" rx="4.5" ry="3.5" fill="#e8607a"/>
        {/* Tongue center line */}
        <line x1="40" y1="68" x2="40" y2="74" stroke="#c04060" strokeWidth="1" strokeLinecap="round"/>
        {/* Tongue shine */}
        <ellipse cx="38.5" cy="70" rx="1.2" ry="0.8" fill="#f090a0" opacity="0.7"/>
        {/* Tongue shadow */}
        <ellipse cx="41" cy="73.5" rx="2" ry="1.2" fill="#c04060" opacity="0.35"/>
      </svg>
    </div>
  )
}
