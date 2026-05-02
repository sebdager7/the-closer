import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { checkAPIKey } from './utils/api'

// Layout
import TopBar from './components/layout/TopBar'
import BottomNav from './components/layout/BottomNav'

// Screens
import LoginScreen from './screens/LoginScreen'
import QuoteOfTheDayScreen from './screens/QuoteOfTheDayScreen'
import ObjectionsScreen from './screens/ObjectionsScreen'
import PitchScreen from './screens/PitchScreen'
import PsychologyScreen from './screens/PsychologyScreen'
import TrainingScreen from './screens/TrainingScreen'
import ProgressScreen from './screens/ProgressScreen'
import BrainScreen from './screens/BrainScreen'
import AgencyScreen from './screens/AgencyScreen'
import TeamChatScreen from './screens/TeamChatScreen'
import PlansScreen from './screens/PlansScreen'

const TAB_SCREENS = {
  objections: ObjectionsScreen,
  pitch: PitchScreen,
  psychology: PsychologyScreen,
  training: TrainingScreen,
  progress: ProgressScreen,
  brain: BrainScreen,
  agency: AgencyScreen,
  chat: TeamChatScreen,
  plans: PlansScreen,
}

function MainApp() {
  const { state } = useApp()
  const ActiveScreen = TAB_SCREENS[state.activeTab] || ObjectionsScreen

  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
    console.log('[THEME] Applied class:', state.theme, '| HTML classes:', root.className)
  }, [state.theme])

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <TopBar />
      <main className="flex-1 overflow-hidden relative">
        <ActiveScreen />
      </main>
      <BottomNav />
    </div>
  )
}

function AppRouter() {
  const { state } = useApp()
  const [quoteShown, setQuoteShown] = useState(() => {
    const today = new Date().toDateString()
    const alreadySeen = localStorage.getItem('closer_quote_date') === today
    if (!alreadySeen) localStorage.setItem('closer_quote_date', today)
    return alreadySeen
  })

  if (!state.isAuthenticated) {
    return <LoginScreen />
  }

  if (!quoteShown) {
    return <QuoteOfTheDayScreen onDone={() => setQuoteShown(true)} />
  }

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  useEffect(() => { checkAPIKey() }, [])
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}
