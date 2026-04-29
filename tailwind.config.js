/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040d1a',
          900: '#071428',
          800: '#0a2744',
          700: '#0d3a6e',
          600: '#1a4e8a',
        },
        gold: {
          400: '#e8c87a',
          500: '#c8a84a',
          600: '#a8882a',
        },
        closer: {
          blue: '#1a6bbf',
          green: '#22c55e',
          red: '#ef4444',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'JetBrains Mono', 'monospace'],
        sora: ['Sora', 'system-ui', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'dm-mono': ['DM Mono', 'monospace'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        bubble: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slide-up 0.28s cubic-bezier(0.4,0,0.2,1)',
        'bounce-blitz': 'bounce-blitz 0.8s ease infinite alternate',
        'fade-in': 'fade-in 0.3s ease',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(26,107,191,0.4)' },
          '50%': { boxShadow: '0 0 0 5px rgba(26,107,191,0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'bounce-blitz': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-3px)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    }
  },
  plugins: []
}
