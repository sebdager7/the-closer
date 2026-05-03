import { useEffect } from 'react'

export default function MoneyTrail() {
  useEffect(() => {
    let lastSpawn = 0

    const spawn = (x, y) => {
      const el = document.createElement('span')
      const isBill  = Math.random() < 0.12
      const size    = 11 + Math.random() * 8
      const dx      = (Math.random() - 0.5) * 22
      const dy      = -(16 + Math.random() * 16)
      const rot     = (Math.random() - 0.5) * 72
      const lightness = 50 + Math.random() * 16
      const gold    = `hsl(${43 + Math.random() * 10}, ${68 + Math.random() * 20}%, ${lightness}%)`

      el.textContent = isBill ? '💸' : '$'

      el.style.cssText = [
        'position:fixed',
        `left:${x - size * 0.4}px`,
        `top:${y - size * 0.5}px`,
        'pointer-events:none',
        `font-size:${size}px`,
        'font-weight:900',
        'font-family:Arial,sans-serif',
        `color:${gold}`,
        'text-shadow:0 1px 6px rgba(200,168,74,0.5)',
        'z-index:999999',
        'user-select:none',
        'will-change:transform,opacity',
        'transition:transform 0.56s cubic-bezier(0.25,0.46,0.45,0.94),opacity 0.56s ease-out',
        'opacity:1',
        'transform:translate(0,0) rotate(0deg) scale(1)',
      ].join(';')

      document.body.appendChild(el)

      // Two rAF ticks so the browser paints the start state before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0.2)`
          el.style.opacity = '0'
        })
      })

      setTimeout(() => el.parentNode?.removeChild(el), 600)
    }

    const onMove = (e) => {
      const now = Date.now()
      if (now - lastSpawn < 38) return
      lastSpawn = now
      spawn(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return null
}
