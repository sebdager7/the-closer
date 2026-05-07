import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useApp } from './AppContext'
import { callClaude } from '../utils/api'
import { EN_STRINGS } from '../i18n/strings'

const TranslationContext = createContext(null)
const CACHE_KEY = 'closer_ui_translations_v2'

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

export function TranslationProvider({ children }) {
  const { state } = useApp()
  const [translations, setTranslations] = useState(EN_STRINGS)
  const [isTranslating, setIsTranslating] = useState(false)
  const cacheRef = useRef(loadCache())

  useEffect(() => {
    if (state.language === 'English') {
      setTranslations(EN_STRINGS)
      return
    }

    const cached = cacheRef.current[state.language]
    if (cached) {
      setTranslations(cached)
      return
    }

    setIsTranslating(true)
    ;(async () => {
      try {
        const prompt = `Translate all JSON string values to ${state.language}. Rules:\n1. Keep every JSON key exactly unchanged.\n2. Keep all HTML tags like <strong> intact in their positions.\n3. Keep all emojis exactly as they are.\n4. Return ONLY raw valid JSON — no markdown fences, no explanation.\n\n${JSON.stringify(EN_STRINGS)}`
        const raw = await callClaude(prompt, 4096)
        const clean = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
        const translated = JSON.parse(clean)
        cacheRef.current = { ...cacheRef.current, [state.language]: translated }
        saveCache(cacheRef.current)
        setTranslations(translated)
      } catch (e) {
        console.error('[Translation] Failed:', e)
        setTranslations(EN_STRINGS)
      }
      setIsTranslating(false)
    })()
  }, [state.language])

  const t = (key) => translations[key] ?? EN_STRINGS[key] ?? key

  return (
    <TranslationContext.Provider value={{ t, isTranslating }}>
      {isTranslating && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] text-white text-center text-xs py-1.5 font-bold"
          style={{ background: 'linear-gradient(90deg, #1a6bbf, #1557a0)' }}
        >
          {EN_STRINGS.translating}
        </div>
      )}
      {children}
    </TranslationContext.Provider>
  )
}

export function useT() {
  const ctx = useContext(TranslationContext)
  if (!ctx) throw new Error('useT must be used within TranslationProvider')
  return ctx.t
}
