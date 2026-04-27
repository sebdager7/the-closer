import React from 'react'
import { useApp } from '../../context/AppContext'

const TABS = [
  { id: 'objections', icon: '💬', label: 'Objections' },
  { id: 'pitch', icon: '✍️', label: 'Pitch' },
  { id: 'psychology', icon: '🎮', label: 'Psychology' },
  { id: 'training', icon: '🤖', label: 'Training' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'brain', icon: '🧠', label: 'My Brain' },
  { id: 'agency', icon: '🏢', label: 'Agency' },
  { id: 'chat', icon: '💬', label: 'Chat' },
  { id: 'plans', icon: '📋', label: 'Plans' },
]

export default function BottomNav() {
  const { state, dispatch } = useApp()
  const active = state.activeTab

  return (
    <nav className="bg-navy-900 border-t border-navy-700 flex-shrink-0 safe-bottom">
      <div className="flex overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 py-2 px-3 min-w-[58px] transition-colors ${
              active === tab.id
                ? 'text-closer-blue'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className={`text-[9px] font-medium leading-none ${
              active === tab.id ? 'text-closer-blue' : 'text-white/40'
            }`}>{tab.label}</span>
            {active === tab.id && (
              <div className="w-1 h-1 rounded-full bg-closer-blue mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
