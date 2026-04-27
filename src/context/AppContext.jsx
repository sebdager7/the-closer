import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const initialState = {
  // Auth
  user: null,
  plan: null, // 'free' | 'pro' | 'elite'
  isAuthenticated: false,

  // UI
  theme: 'dark',
  language: 'English',
  activeTab: 'objections',

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

  // Performance metrics
  metrics: {
    closeRate: 42,
    objectionWin: 67,
    toneStrength: 73,
    avgDealValue: 55,
    oneShotClose: 31,
  },
  metricsPrev: {
    closeRate: 28,
    objectionWin: 51,
    toneStrength: 58,
    avgDealValue: 40,
    oneShotClose: 18,
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
    case 'COMPLETE_CALL':
      const { closed, dealValue } = action.payload
      return {
        ...state,
        callCount: state.callCount + 1,
        closeCount: closed ? state.closeCount + 1 : state.closeCount,
        totalRevenue: closed ? state.totalRevenue + dealValue : state.totalRevenue,
        callStreak: closed ? state.callStreak + 1 : 0,
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
    case 'TOGGLE_REACT':
      const key = action.payload
      return {
        ...state,
        chatReacted: { ...state.chatReacted, [key]: !state.chatReacted[key] },
      }
    case 'UPDATE_METRICS':
      return { ...state, metrics: { ...state.metrics, ...action.payload } }
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
        return { ...init, ...parsed }
      }
    } catch {}
    return init
  })

  useEffect(() => {
    try {
      const { user, plan, isAuthenticated, xp, gems, streak, completedActs, customBrain, metrics, callCount, closeCount, totalRevenue, callStreak } = state
      localStorage.setItem('closer_state', JSON.stringify({ user, plan, isAuthenticated, xp, gems, streak, completedActs, customBrain, metrics, callCount, closeCount, totalRevenue, callStreak }))
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
