import React, { useState, useEffect } from 'react'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'

const QUOTES = [
  { text: "The only thing standing between you and the sale is your own fear.", author: "Andy Elliott", tag: "CLOSING" },
  { text: "If you're not training every single day, someone else is — and they're coming for your customers.", author: "Andy Elliott", tag: "DISCIPLINE" },
  { text: "You don't rise to the level of your goals, you fall to the level of your training.", author: "Andy Elliott", tag: "DISCIPLINE" },
  { text: "Excuses are the nails that build the house of failure.", author: "Andy Elliott", tag: "MINDSET" },
  { text: "Every no gets you closer to a yes. Stop fearing rejection and start collecting it.", author: "Andy Elliott", tag: "CLOSING" },
  { text: "The only thing standing between you and your goal is the story you keep telling yourself.", author: "Jordan Belfort", tag: "MINDSET" },
  { text: "Act as if. Act as if you're a wealthy man, rich already, and then you'll surely become it.", author: "Jordan Belfort", tag: "MINDSET" },
  { text: "No matter what happened to you in your past, you are not your past. You are the resources and the capabilities you glean from it.", author: "Jordan Belfort", tag: "MINDSET" },
  { text: "Winners use words that say must and will. Losers use words like should and might.", author: "Jordan Belfort", tag: "CLOSING" },
  { text: "The easiest way to make money is to create something of such value that the world can't help but give you money for it.", author: "Jordan Belfort", tag: "MONEY" },
  { text: "Success is your duty, obligation, and responsibility.", author: "Grant Cardone", tag: "MINDSET" },
  { text: "Be obsessed or be average.", author: "Grant Cardone", tag: "DISCIPLINE" },
  { text: "You sleep like you're rich. I'm up like I'm broke.", author: "Grant Cardone", tag: "DISCIPLINE" },
  { text: "Comfort makes more prisoners than all the jails combined.", author: "Grant Cardone", tag: "DISCIPLINE" },
  { text: "Your problem is you're too busy holding onto your worthlessness.", author: "Grant Cardone", tag: "MINDSET" },
  { text: "Until you become completely obsessed with your mission, no one will take you seriously.", author: "Grant Cardone", tag: "DISCIPLINE" },
  { text: "The number one reason people fail in life is because they listen to their friends, family, and neighbors.", author: "Grant Cardone", tag: "MINDSET" },
  { text: "Never lower your price, add value.", author: "Grant Cardone", tag: "CLOSING" },
  { text: "The only way to get rich quick is to get rich slow.", author: "Alex Hormozi", tag: "MONEY" },
  { text: "You don't need more ideas. You need to execute the ideas you already have.", author: "Alex Hormozi", tag: "DISCIPLINE" },
  { text: "Charge more. Serve better. Complain less.", author: "Alex Hormozi", tag: "CLOSING" },
  { text: "The market doesn't care about your feelings. It cares about your offer.", author: "Alex Hormozi", tag: "CLOSING" },
  { text: "Stop trying to be interesting. Start trying to be interested.", author: "Alex Hormozi", tag: "CLOSING" },
  { text: "Every successful person I know reads. Every broke person I know watches TV.", author: "Alex Hormozi", tag: "DISCIPLINE" },
  { text: "Rich people ask 'how can I afford this?' Poor people say 'I can't afford this.'", author: "Alex Hormozi", tag: "MONEY" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", tag: "MINDSET" },
  { text: "People often say motivation doesn't last. Neither does bathing — that's why we recommend it daily.", author: "Zig Ziglar", tag: "MINDSET" },
  { text: "Every sale has five basic obstacles: no need, no money, no hurry, no desire, no trust.", author: "Zig Ziglar", tag: "CLOSING" },
  { text: "Stop selling. Start helping.", author: "Zig Ziglar", tag: "CLOSING" },
  { text: "If you can dream it, then you can achieve it.", author: "Zig Ziglar", tag: "MINDSET" },
  { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar", tag: "MINDSET" },
  { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett", tag: "MONEY" },
  { text: "The best investment you can make is in yourself.", author: "Warren Buffett", tag: "MINDSET" },
  { text: "Someone is sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett", tag: "MINDSET" },
  { text: "It takes 20 years to build a reputation and 5 minutes to ruin it.", author: "Warren Buffett", tag: "MINDSET" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk", tag: "MINDSET" },
  { text: "Persistence is very important. You should not give up unless you are forced to give up.", author: "Elon Musk", tag: "DISCIPLINE" },
  { text: "I think it's very important to have a feedback loop.", author: "Elon Musk", tag: "MINDSET" },
  { text: "Stop doing the shit you hate.", author: "Gary Vaynerchuk", tag: "MINDSET" },
  { text: "Ideas are worthless. Execution is everything.", author: "Gary Vaynerchuk", tag: "DISCIPLINE" },
  { text: "Document. Don't create.", author: "Gary Vaynerchuk", tag: "MINDSET" },
  { text: "Self-awareness is being able to accept your weaknesses while focusing all of your attention on your strengths.", author: "Gary Vaynerchuk", tag: "MINDSET" },
  { text: "The secret of success is learning how to use pain and pleasure instead of having pain and pleasure use you.", author: "Tony Robbins", tag: "MINDSET" },
  { text: "It's not about the goal. It's about growing to become the person that can accomplish that goal.", author: "Tony Robbins", tag: "MINDSET" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", tag: "MINDSET" },
  { text: "Stay committed to your decisions, but stay flexible in your approach.", author: "Tony Robbins", tag: "MINDSET" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs", tag: "MINDSET" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", tag: "MINDSET" },
]

const TAG_STYLES = {
  CLOSING:    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  MINDSET:    'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  DISCIPLINE: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  MONEY:      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
}

const BLITZ_BY_DAY = [
  "They're resting. You're preparing. That's the difference.",
  "New week. No excuses. Let's go.",
  "Tuesday closers make Friday money.",
  "Halfway through. Double down.",
  "One day before the weekend push. Make it count.",
  "Friday energy = close everything in sight.",
  "The ones who work Saturday own Sunday.",
]

export default function QuoteOfTheDayScreen({ onDone }) {
  const { dispatch } = useApp()
  const [vis, setVis] = useState({ date: false, quote: false, attr: false, bubble: false, btn: false })

  const now = new Date()
  const idx = now.getDate() % QUOTES.length
  const quote = QUOTES[idx]
  const day = now.getDay()

  const dateStr =
    now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() +
    ' · ' +
    now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase() +
    ' ' + now.getDate()

  useEffect(() => {
    const timers = [
      setTimeout(() => setVis(v => ({ ...v, date: true })), 300),
      setTimeout(() => setVis(v => ({ ...v, quote: true })), 600),
      setTimeout(() => setVis(v => ({ ...v, attr: true })), 900),
      setTimeout(() => setVis(v => ({ ...v, bubble: true })), 1100),
      setTimeout(() => setVis(v => ({ ...v, btn: true })), 1300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleDone = () => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'objections' })
    onDone()
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-6 py-8"
      style={{ background: 'linear-gradient(135deg, #020810 0%, #0a1628 50%, #040d1a 100%)' }}
    >
      {/* Animated glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full quote-glow"
          style={{
            width: 340, height: 340,
            background: 'radial-gradient(circle, rgba(26,107,191,0.22) 0%, transparent 70%)',
            top: '10%', left: '-18%',
            filter: 'blur(55px)',
          }}
        />
        <div
          className="absolute rounded-full quote-glow"
          style={{
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(228,170,50,0.18) 0%, transparent 70%)',
            top: '30%', right: '-12%',
            filter: 'blur(55px)',
            animationDelay: '2s',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Blitz icon — no delay, always present */}
        <BlitzIcon size={40} className="blitz-idle mb-5" />

        {/* Date + divider */}
        <div
          className={`flex flex-col items-center gap-2 mb-8 transition-all duration-500 ease-out ${
            vis.date ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <p className="font-bubble text-gold-400 tracking-widest" style={{ fontSize: 12 }}>
            {dateStr}
          </p>
          <div className="w-14 h-px bg-gold-400 opacity-50" />
        </div>

        {/* Quote block */}
        <div
          className={`relative text-center mb-4 transition-all duration-700 ease-out ${
            vis.quote ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ maxWidth: 320 }}
        >
          <span
            className="absolute text-gold-400 select-none pointer-events-none"
            style={{
              fontSize: 80, opacity: 0.18, fontFamily: 'Georgia, serif',
              lineHeight: 1, top: -32, left: -14,
            }}
          >"</span>
          <p
            className="font-nunito text-white px-3"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(17px, 4.5vw, 24px)',
              lineHeight: 1.45,
              textShadow: '0 0 60px rgba(26,107,191,0.2)',
            }}
          >
            {quote.text}
          </p>
          <span
            className="absolute text-gold-400 select-none pointer-events-none"
            style={{
              fontSize: 80, opacity: 0.18, fontFamily: 'Georgia, serif',
              lineHeight: 1, bottom: -46, right: -14,
            }}
          >"</span>
        </div>

        {/* Attribution + tag */}
        <div
          className={`flex flex-col items-center gap-2 mt-8 mb-8 transition-all duration-400 ease-out ${
            vis.attr ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-bubble text-gold-400" style={{ fontSize: 14, letterSpacing: '0.1em' }}>
            — {quote.author}
          </p>
          <span className={`text-[9px] font-bold px-3 py-0.5 rounded-full tracking-widest ${TAG_STYLES[quote.tag] || TAG_STYLES.MINDSET}`}>
            {quote.tag}
          </span>
        </div>

        {/* Blitz speech bubble */}
        <div
          className={`w-full mb-7 transition-all duration-500 ease-out ${
            vis.bubble ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-start gap-3 bg-navy-800/70 border border-white/10 rounded-2xl p-3">
            <BlitzIcon size={28} />
            <p className="text-xs text-white/80 leading-relaxed">
              <strong className="text-gold-400">Blitz:</strong> {BLITZ_BY_DAY[day]}
            </p>
          </div>
        </div>

        {/* CTA button + skip */}
        <div
          className={`w-full transition-all duration-500 ease-out ${
            vis.btn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleDone}
            className="w-full py-4 rounded-2xl font-bubble text-navy-900 btn-gold mb-3"
            style={{ fontSize: 16 }}
          >
            Let's Get To Work 🔥
          </button>
          <button
            onClick={handleDone}
            className="w-full text-center text-xs text-white/20 py-2 hover:text-white/40 transition-colors"
          >
            skip
          </button>
        </div>
      </div>
    </div>
  )
}
