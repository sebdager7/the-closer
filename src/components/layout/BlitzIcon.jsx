import React, { useState } from 'react'
import { vibrateBlitz, zapSound } from '../../utils/blitz'

export default function BlitzIcon({ size = 32, className = '' }) {
  const [bouncing, setBouncing] = useState(false)
  const w = size
  const h = Math.round(size * 1.1)

  const handleClick = () => {
    vibrateBlitz(40)
    zapSound()
    setBouncing(true)
    setTimeout(() => setBouncing(false), 500)
  }

  // If caller passes a blitz-* animation class, respect it; otherwise idle
  const hasAnimClass = /blitz-(speaking|celebrate|idle|bounce)/.test(className)
  const animClass = bouncing ? 'blitz-bounce' : (hasAnimClass ? '' : 'blitz-idle')

  return (
    <svg
      width={w} height={h} viewBox="0 0 80 88" fill="none"
      className={`${animClass} ${className}`.trim()}
      onClick={handleClick}
      style={{ flexShrink: 0, cursor: 'pointer' }}
    >
      <path d="M12 62 C12 38 20 24 40 24 C60 24 68 38 68 62 C68 74 55 82 40 82 C25 82 12 74 12 62 Z" fill="#111122"/>
      <path d="M22 38 L14 16 L28 28 Z" fill="#111122"/>
      <path d="M58 38 L66 16 L52 28 Z" fill="#111122"/>
      <path d="M23 36 L17 18 L27 27 Z" fill="#252540"/>
      <path d="M57 36 L63 18 L53 27 Z" fill="#252540"/>
      <path d="M14 58 C14 40 22 28 40 28 C58 28 66 40 66 58 C66 68 54 76 40 76 C26 76 14 68 14 58 Z" fill="#181830"/>
      <ellipse cx="30" cy="49" rx="9" ry="8" fill="#fff"/>
      <ellipse cx="50" cy="49" rx="9" ry="8" fill="#fff"/>
      <ellipse cx="30" cy="49" rx="5.5" ry="5.5" fill="#1a6bbf"/>
      <ellipse cx="50" cy="49" rx="5.5" ry="5.5" fill="#1a6bbf"/>
      <ellipse cx="30.5" cy="49" rx="3" ry="3.2" fill="#04040e"/>
      <ellipse cx="50.5" cy="49" rx="3" ry="3.2" fill="#04040e"/>
      <circle cx="31.5" cy="47.5" r="1.1" fill="#fff"/>
      <circle cx="51.5" cy="47.5" r="1.1" fill="#fff"/>
      <path d="M22 43 L37 40" stroke="#c8a84a" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M58 43 L43 40" stroke="#c8a84a" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx="40" cy="62" rx="9" ry="6" fill="#252540"/>
      <ellipse cx="40" cy="62" rx="3" ry="2" fill="#d05040"/>
      <circle cx="32" cy="65" r="1.4" fill="#c8a84a"/>
      <circle cx="48" cy="65" r="1.4" fill="#c8a84a"/>
    </svg>
  )
}
