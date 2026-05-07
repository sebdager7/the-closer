import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useApp } from './AppContext'
import { callClaude } from '../utils/api'
import { EN_STRINGS } from '../i18n/strings'

const TranslationContext = createContext(null)
const CACHE_KEY = 'closer_ui_translations_v4'

// Only exclude strings with raw HTML tags — everything else gets translated
// (Claude instruction will keep "Blitz" as-is)
const HTML_KEYS = new Set(['progress_blitz', 'pitch_blitz', 'brain_blitz'])

// Stable ordered array — index is the contract between send and parse
const ENTRIES = Object.entries(EN_STRINGS).filter(([k]) => !HTML_KEYS.has(k))

// Language code map for translation instruction
const LANG_NATIVE = {
  Spanish: 'español',
  Portuguese: 'português',
  French: 'français',
  German: 'Deutsch',
  Italian: 'italiano',
  'Mandarin Chinese': '中文',
  Japanese: '日本語',
  Arabic: 'العربية',
  Hindi: 'हिन्दी',
}

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}
function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {}
}

// Parse Claude's numbered-list response back to a key→value map
// Handles: "1. text", "1) text", "1- text", extra blank lines, commentary lines
function parseNumberedResponse(raw) {
  const result = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*(\d{1,3})[.):\-]\s*(.+)$/)
    if (!m) continue
    const idx = parseInt(m[1], 10) - 1
    const value = m[2].trim()
    if (idx >= 0 && idx < ENTRIES.length && value) {
      result[ENTRIES[idx][0]] = value
    }
  }
  return result
}

async function fetchTranslations(language) {
  const numbered = ENTRIES.map(([, v], i) => `${i + 1}. ${v}`).join('\n')
  const native = LANG_NATIVE[language] || language

  const prompt = `You are a translator. Translate the following numbered phrases from English to ${language} (${native}).

STRICT RULES:
1. Return ONLY the numbered translations — no intro text, no notes, nothing else
2. Keep the same numbering (1. 2. 3. …)
3. Keep all emojis exactly as-is
4. The word "Blitz" must NEVER be translated — always write "Blitz"
5. Keep HTML tags like <strong> exactly as-is if present
6. One translation per line

${numbered}`

  const raw = await callClaude(prompt, 1500)
  console.log('[Translation] API returned. First 200 chars:', raw.slice(0, 200))
  return raw
}

export function TranslationProvider({ children }) {
  const { state } = useApp()
  const [translations, setTranslations] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'done' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [retryTick, setRetryTick] = useState(0)
  const cacheRef = useRef(loadCache())
  const langRef = useRef(state.language)

  useEffect(() => {
    langRef.current = state.language

    if (state.language === 'English') {
      setTranslations({})
      setStatus('idle')
      return
    }

    // Check cache
    const cached = cacheRef.current[state.language]
    if (cached && Object.keys(cached).length >= 15) {
      setTranslations(cached)
      setStatus('done')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    let cancelled = false

    fetchTranslations(state.language)
      .then(raw => {
        if (cancelled) return
        const parsed = parseNumberedResponse(raw)
        const count = Object.keys(parsed).length
        console.log(`[Translation] Parsed ${count}/${ENTRIES.length} strings for ${state.language}`)

        if (count < 15) {
          setErrorMsg(`Only got ${count} translations — try again or use English.`)
          setStatus('error')
          return
        }

        cacheRef.current = { ...cacheRef.current, [langRef.current]: parsed }
        saveCache(cacheRef.current)
        setTranslations(parsed)
        setStatus('done')
      })
      .catch(err => {
        if (cancelled) return
        console.error('[Translation] Error:', err)
        setErrorMsg(err.message || 'Translation failed — check API key or try again.')
        setStatus('error')
      })

    return () => { cancelled = true }
  }, [state.language, retryTick])

  // Auto-hide 'done' banner after 2 seconds
  useEffect(() => {
    if (status !== 'done') return
    const t = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(t)
  }, [status])

  const t = (key) => {
    if (state.language === 'English') return EN_STRINGS[key] ?? key
    if (HTML_KEYS.has(key)) return EN_STRINGS[key] ?? key
    return translations[key] ?? EN_STRINGS[key] ?? key
  }

  return (
    <TranslationContext.Provider value={{ t, isTranslating: status === 'loading' }}>

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(4,13,26,0.75)' }}>
          <div
            className="px-6 py-5 rounded-2xl text-white text-sm font-bold flex flex-col items-center gap-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#1a6bbf,#1557a0)', border: '1px solid rgba(255,255,255,0.2)', minWidth: 220 }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>Translating to {state.language}…</span>
            <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 400 }}>Takes ~5 seconds</span>
          </div>
        </div>
      )}

      {/* Success flash */}
      {status === 'done' && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-xl" style={{ background: '#22c55e', whiteSpace: 'nowrap' }}>
          ✓ App translated to {state.language}
        </div>
      )}

      {/* Error banner */}
      {status === 'error' && (
        <div
          className="fixed bottom-24 left-4 right-4 z-[9999] px-4 py-3 rounded-xl text-white text-xs font-bold shadow-xl flex items-start gap-2"
          style={{ background: '#ef4444' }}
        >
          <span>⚠️</span>
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => { setStatus('idle'); setRetryTick(n => n + 1) }} className="text-white font-bold text-[10px] px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 mr-1">Retry</button>
          <button onClick={() => setStatus('idle')} className="text-white/70 hover:text-white ml-1">✕</button>
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
