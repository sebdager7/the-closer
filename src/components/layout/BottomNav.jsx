import React from 'react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../context/TranslationContext'
import {
  ObjectionsIcon, PitchIcon, PsychologyIcon, TrainingIcon,
  ProgressIcon, BrainNavIcon, AgencyIcon, ChatIcon, PlansIcon,
} from '../icons/NavIcons'

const TABS = [
  { id: 'progress',   Icon: ProgressIcon,   labelKey: 'nav_progress'    },
  { id: 'psychology', Icon: PsychologyIcon, labelKey: 'nav_psychology'  },
  { id: 'training',   Icon: TrainingIcon,   labelKey: 'nav_training'    },
  { id: 'pitch',      Icon: PitchIcon,      labelKey: 'nav_pitch'       },
  { id: 'objections', Icon: ObjectionsIcon, labelKey: 'nav_objections'  },
  { id: 'brain',      Icon: BrainNavIcon,   labelKey: 'nav_brain'       },
  { id: 'agency',     Icon: AgencyIcon,     labelKey: 'nav_agency'      },
  { id: 'chat',       Icon: ChatIcon,       labelKey: 'nav_chat'        },
  { id: 'plans',      Icon: PlansIcon,      labelKey: 'nav_plans'       },
]

export default function BottomNav() {
  const { state, dispatch } = useApp()
  const t = useT()
  const active = state.activeTab
  const activeColor = state.theme === 'light' ? '#c8a84a' : '#1a6bbf'

  return (
    <nav className="border-t flex-shrink-0 safe-bottom transition-colors duration-300" style={{ background: 'var(--nav-bg)', borderColor: 'var(--topbar-border)' }}>
      <div className="flex overflow-x-auto scrollbar-none">
        {TABS.map(({ id, Icon, labelKey }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: id })}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 py-2 px-3 min-w-[58px] transition-all hover:opacity-80"
              style={{ color: isActive ? activeColor : 'var(--text-muted)' }}
            >
              <Icon size={20} active={isActive} activeColor={activeColor} />
              <span
                className="leading-none"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: '10px',
                  letterSpacing: '0.03em',
                  color: isActive ? activeColor : 'var(--text-muted)',
                }}
              >
                {t(labelKey)}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: activeColor }} />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
