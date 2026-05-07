import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useApp } from './AppContext'
import { callClaude } from '../utils/api'
import { EN_STRINGS } from '../i18n/strings'

const TranslationContext = createContext(null)
const CACHE_KEY = 'closer_ui_translations_v3'

// Keys that contain "Blitz" branding — never translated, always stay in English
const BLITZ_KEYS = new Set([
  'progress_blitz', 'objections_blitz', 'pitch_blitz', 'brain_blitz',
  'objections_loading_btn', 'pitch_loading_create', 'pitch_loading_rebuild',
  'brain_train_btn', 'brain_saved', 'brain_active', 'blitz_prefix',
  'translating', 'loading',
])

// Only translate strings that don't contain Blitz branding
const TRANSLATABLE = Object.fromEntries(
  Object.entries(EN_STRINGS).filter(([k]) => !BLITZ_KEYS.has(k))
)

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

// Send as KEY|||VALUE lines — no JSON, no escaping issues
function buildPayload() {
  return Object.entries(TRANSLATABLE)
    .map(([k, v]) => `${k}|||${v}`)
    .join('\n')
}

// Parse KEY|||VALUE lines back into an object
function parseResponse(raw) {
  const result = {}
  const lines = raw.split('\n')
  for (const line of lines) {
    const idx = line.indexOf('|||')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 3).trim()
    if (key && value && key in EN_STRINGS) {
      result[key] = value
    }
  }
  return result
}

export function TranslationProvider({ children }) {
  const { state } = useApp()
  const [translations, setTranslations] = useState({})
  const [isTranslating, setIsTranslating] = useState(false)
  const cacheRef = useRef(loadCache())

  useEffect(() => {
    if (state.language === 'English') {
      setTranslations({})
      return
    }

    const cached = cacheRef.current[state.language]
    if (cached && Object.keys(cached).length > 10) {
      setTranslations(cached)
      return
    }

    setIsTranslating(true)

    ;(async () => {
      try {
        const payload = buildPayload()
        const prompt = `Translate the text values (after |||) to ${state.language}.
Rules:
- Keep every key (before |||) exactly unchanged
- Keep all emojis exactly as they are
- Do NOT translate the word "Blitz" — keep it as "Blitz"
- Return ONLY the translated lines in the exact same KEY|||VALUE format, one per line, nothing else

${payload}`

        const raw = await callClaude(prompt, 4096)
        const parsed = parseResponse(raw)

        if (Object.keys(parsed).length < 10) {
          console.error('[Translation] Too few keys parsed, keeping English. Raw:', raw.slice(0, 200))
          setIsTranslating(false)
          return
        }

        cacheRef.current = { ...cacheRef.current, [state.language]: parsed }
        saveCache(cacheRef.current)
        setTranslations(parsed)
      } catch (e) {
        console.error('[Translation] Failed:', e)
      }
      setIsTranslating(false)
    })()
  }, [state.language])

  // t(key): return translated string, fall back to English
  const t = (key) => {
    if (state.language === 'English') return EN_STRINGS[key] ?? key
    if (BLITZ_KEYS.has(key)) return EN_STRINGS[key] ?? key
    return translations[key] ?? EN_STRINGS[key] ?? key
  }

  return (
    <TranslationContext.Provider value={{ t, isTranslating }}>
      {isTranslating && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <div
            className="px-6 py-4 rounded-2xl text-white text-sm font-bold flex items-center gap-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#1a6bbf,#1557a0)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {EN_STRINGS.translating}
          </div>
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
