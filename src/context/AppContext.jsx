import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const DEFAULT_CHANNELS = [
  { id: 'general', icon: '#', name: 'general', desc: 'Agency-wide · 34 members', type: 'channel', members: 'all', canAnnounce: true, isDefault: true, createdBy: 'owner' },
  { id: 'announcements', icon: '📢', name: 'announcements', desc: 'Official leadership announcements', type: 'channel', members: 'all', canAnnounce: true, isDefault: true, createdBy: 'owner' },
  { id: 'deals', icon: '💰', name: 'deal board', desc: 'Post every closed deal here', type: 'channel', members: 'all', canAnnounce: false, isDefault: true, createdBy: 'owner' },
  { id: 'team-a', icon: '⚡', name: 'Team Alpha', desc: 'Marcus T. upline · 12 reps', type: 'group', members: ['mt', 'pk'], canAnnounce: true, isDefault: true, createdBy: 'owner' },
  { id: 'team-b', icon: '🔥', name: 'Team Bravo', desc: 'Devon M. upline · 9 reps', type: 'group', members: ['dm', 'jr'], canAnnounce: true, isDefault: true, createdBy: 'owner' },
  { id: 'training', icon: '🎯', name: 'training tips', desc: 'Share scripts and wins', type: 'channel', members: 'all', canAnnounce: false, isDefault: true, createdBy: 'owner' },
]

const DEFAULT_DMS = [
  { id: 'dm-marcus', userId: 'mt', name: 'Marcus T.', initials: 'MT', color: '#1a6bbf', online: true },
  { id: 'dm-jordan', userId: 'jr', name: 'Jordan R.', initials: 'JR', color: '#e74c3c', online: false },
]

const initialState = {
  // Auth
  user: null,
  plan: null,
  isAuthenticated: false,

  // UI
  theme: 'dark',
  language: 'English',
  activeTab: 'progress',

  // Training
  callCount: 0,
  closeCount: 0,
  totalRevenue: 0,
  callStreak: 0,

  // Psychology / XP
  xp: 350,
  gems: 120,
  streak: 3,
  completedActs: ['a1', 'a2'],

  // Custom Brain
  customBrain: { offer: '', icp: '', objections: '' },

  // Chat
  chatReacted: {},
  customChannels: DEFAULT_CHANNELS,
  customDMs: DEFAULT_DMS,
  chatMessages: {},

  // Performance metrics
  metrics: {
    closeRate: 0,
    objectionWin: 0,
    toneStrength: 0,
    avgDealValue: 0,
    oneShotClose: 0,
  },
  metricsPrev: {
    closeRate: 0,
    objectionWin: 0,
    toneStrength: 0,
    avgDealValue: 0,
    oneShotClose: 0,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'SET_PLAN':
      return { ...state, plan: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'COMPLETE_CALL': {
      const { closed, dealValue } = action.payload
      const newCallCount = state.callCount + 1
      const newCloseCount = closed ? state.closeCount + 1 : state.closeCount
      const newCloseRate = Math.round((newCloseCount / newCallCount) * 100)
      return {
        ...state,
        callCount: newCallCount,
        closeCount: newCloseCount,
        totalRevenue: closed ? state.totalRevenue + dealValue : state.totalRevenue,
        callStreak: closed ? state.callStreak + 1 : 0,
        metricsPrev: { ...state.metrics },
        metrics: { ...state.metrics, closeRate: newCloseRate },
      }
    }
    case 'ADD_XP':
      return { ...state, xp: state.xp + action.payload, gems: state.gems + 10 }
    case 'COMPLETE_ACT':
      return {
        ...state,
        completedActs: [...state.completedActs, action.payload],
        streak: Math.min(state.streak + 1, 99),
      }
    case 'SET_CUSTOM_BRAIN':
      return { ...state, customBrain: action.payload }
    case 'TOGGLE_REACT': {
      const key = action.payload
      return {
        ...state,
        chatReacted: { ...state.chatReacted, [key]: !state.chatReacted[key] },
      }
    }
    case 'UPDATE_METRICS':
      return {
        ...state,
        metricsPrev: { ...state.metrics },
        metrics: { ...state.metrics, ...action.payload },
      }

    // ─── Channel management ────────────────────────────────────────
    case 'ADD_CHANNEL':
      return {
        ...state,
        customChannels: [...state.customChannels, action.payload],
      }
    case 'UPDATE_CHANNEL':
      return {
        ...state,
        customChannels: state.customChannels.map(ch =>
          ch.id === action.payload.id
            ? { ...ch, ...action.payload.updates }
            : ch
        ),
      }
    case 'DELETE_CHANNEL':
      return {
        ...state,
        customChannels: state.customChannels.filter(
          ch => ch.id !== action.payload || ch.isDefault
        ),
      }
    case 'ADD_MEMBER_TO_CHANNEL':
      return {
        ...state,
        customChannels: state.customChannels.map(ch =>
          ch.id === action.payload.channelId
            ? {
                ...ch,
                members: Array.isArray(ch.members)
                  ? [...new Set([...ch.members, action.payload.userId])]
                  : ch.members,
              }
            : ch
        ),
      }
    case 'REMOVE_MEMBER_FROM_CHANNEL':
      return {
        ...state,
        customChannels: state.customChannels.map(ch =>
          ch.id === action.payload.channelId
            ? {
                ...ch,
                members: Array.isArray(ch.members)
                  ? ch.members.filter(m => m !== action.payload.userId)
                  : ch.members,
              }
            : ch
        ),
      }
    case 'ADD_CHAT_MESSAGE': {
      const { channelId, message } = action.payload
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [channelId]: [...(state.chatMessages[channelId] || []), message],
        },
      }
    }

    case 'LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('closer_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...init,
          ...parsed,
          // Ensure new fields are present even in old saved state
          customChannels: parsed.customChannels ?? init.customChannels,
          customDMs: parsed.customDMs ?? init.customDMs,
          chatMessages: parsed.chatMessages ?? init.chatMessages,
        }
      }
    } catch {}
    return init
  })

  useEffect(() => {
    try {
      const {
        user, plan, isAuthenticated,
        xp, gems, streak, completedActs,
        customBrain, metrics,
        callCount, closeCount, totalRevenue, callStreak,
        theme, language,
        customChannels, customDMs, chatMessages,
        chatReacted,
      } = state
      localStorage.setItem('closer_state', JSON.stringify({
        user, plan, isAuthenticated,
        xp, gems, streak, completedActs,
        customBrain, metrics,
        callCount, closeCount, totalRevenue, callStreak,
        theme, language,
        customChannels, customDMs, chatMessages,
        chatReacted,
      }))
    } catch {}
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
