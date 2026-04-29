import React, { useEffect } from 'react'
import BlitzIcon from './BlitzIcon'
import { vibrateBlitz } from '../../utils/blitz'

export default function BlitzBar({ message, gold = false, className = '', vibrate = false }) {
  useEffect(() => {
    if (vibrate) vibrateBlitz(60)
  }, [message]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl mb-3 border ${
      gold
        ? 'bg-gradient-to-br from-navy-900 to-[#1a1a40] border-yellow-500/30'
        : 'bg-gradient-to-br from-navy-800 to-navy-700 border-closer-blue/30'
    } ${className}`}>
      <BlitzIcon size={28} />
      <p className="text-sm text-white/90 leading-relaxed flex-1">
        <strong className="text-gold-400">Blitz: </strong>
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </p>
    </div>
  )
}
