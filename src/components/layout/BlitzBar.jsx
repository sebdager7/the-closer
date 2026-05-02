import React, { useEffect } from 'react'
import BlitzIcon from './BlitzIcon'
import { useApp } from '../../context/AppContext'
import { vibrateBlitz } from '../../utils/blitz'

export default function BlitzBar({ message, gold = false, className = '', vibrate = false }) {
  const { state } = useApp()
  const isLight = state.theme === 'light'

  useEffect(() => {
    if (vibrate) vibrateBlitz(60)
  }, [message]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl mb-3 border bg-gradient-to-br from-navy-800 to-navy-700 ${className}`}
      style={{ borderColor: gold ? 'rgba(234,179,8,0.4)' : isLight ? 'rgba(200,168,74,0.4)' : 'rgba(26,107,191,0.3)' }}
    >
      <BlitzIcon size={28} />
      <p className="text-sm text-white/90 leading-relaxed flex-1">
        <strong className="text-gold-400">Blitz: </strong>
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </p>
    </div>
  )
}
