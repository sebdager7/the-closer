import React, { useState, useEffect } from 'react'
import BlitzIcon from '../components/layout/BlitzIcon'
import { useApp } from '../context/AppContext'
import { PLANS } from '../data/constants'
import { vibrateBlitz } from '../utils/blitz'

export default function LoginScreen() {
  const { dispatch } = useApp()
  const [step, setStep] = useState('login') // login | signup | plans | billing | tutorial | tutDone
  const [isSignIn, setIsSignIn] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [tutStep, setTutStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [appleLoading, setAppleLoading] = useState(false)

  // Vibrate on every tutorial page (when step becomes 'tutorial' or tutStep advances)
  useEffect(() => {
    if (step === 'tutorial') vibrateBlitz([30, 50, 30])
  }, [step, tutStep])

  const plan = PLANS.find(p => p.id === selectedPlan)

  // TODO: Replace with real Sign In with Apple using Apple JS SDK
  // Docs: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js
  // Requires: Apple Developer account, Services ID, domain verification
  const handleAppleAuth = () => {
    setAppleLoading(true)
    setTimeout(() => {
      setAppleLoading(false)
      dispatch({ type: 'SET_USER', payload: { name: 'Apple User', email: 'user@icloud.com' } })
      if (!isSignIn) setStep('plans')
    }, 1000)
  }

  const handleAuth = () => {
    if (isSignIn) {
      // Direct login — go straight to app
      dispatch({ type: 'SET_USER', payload: { name: 'Closer', email } })
      dispatch({ type: 'SET_PLAN', payload: 'elite' }) // demo: elite
    } else {
      setStep('plans')
    }
  }

  const handlePlanContinue = () => {
    if (selectedPlan === 'free') {
      dispatch({ type: 'SET_USER', payload: { name: name || 'Closer', email } })
      dispatch({ type: 'SET_PLAN', payload: 'free' })
      setStep('tutorial')
    } else {
      setStep('billing')
    }
  }

  const handleBillingContinue = () => {
    dispatch({ type: 'SET_USER', payload: { name: name || 'Closer', email } })
    dispatch({ type: 'SET_PLAN', payload: selectedPlan })
    setStep('tutorial')
  }

  const TUT_STEPS = [
    {
      title: 'Welcome to The Closer!',
      blitz: `Hey! I'm <strong>Blitz</strong>, your personal sales coach. You just unlocked something serious. Let me give you the 2-minute tour.`,
      cta: "Let's go!",
    },
    {
      title: 'Objection Handler',
      blitz: `The <strong>Objections</strong> tab is your secret weapon. Type any pushback you're getting crushed on — I pull from Andy Elliott, Belfort, and Cardone frameworks instantly.`,
      features: [
        { icon: '💬', title: 'Any objection', desc: 'Real prospect pushbacks' },
        { icon: '⚡', title: '3 rebuttal styles', desc: 'Soft, direct, aggressive' },
        { icon: '🌐', title: '14 languages', desc: 'Global sales teams' },
        { icon: '🏭', title: 'All industries', desc: 'D2D, insurance, solar, B2B' },
      ],
      cta: 'Next',
    },
    {
      title: 'Pitch Maker',
      blitz: `<strong>Pitch Maker</strong> builds from real closer patterns — Andy Elliott's 10-step, Belfort's Straight Line, Cardone's tonality. Not AI theory. Frameworks that made millionaires.`,
      features: [
        { icon: '✍️', title: 'Build from scratch', desc: 'Give keywords, I write' },
        { icon: '🔧', title: 'Rebuild yours', desc: 'AI corrects and strengthens' },
        { icon: '📊', title: 'Pitch scoring', desc: 'Hook, confidence, close power' },
        { icon: '🔄', title: 'Refine anytime', desc: '"Make it shorter" — done' },
      ],
      cta: 'Next',
    },
    {
      title: 'Psychology Zone Map',
      blitz: `The <strong>Psychology</strong> tab is a full Sonic-style zone map — blast through acts, collect XP rings, and level up your sales psychology. I guide every single lesson.`,
      features: [
        { icon: '🎮', title: 'Sonic zone map', desc: '4 zones, pixel art, XP rings' },
        { icon: '🧠', title: '4 learning zones', desc: 'Trust, Vocab, Influence, Close' },
        { icon: '❓', title: 'Interactive lessons', desc: 'Quizzes, fill-ins, matching' },
        { icon: '🔥', title: 'Streaks & scoring', desc: 'Daily streak, ring counter' },
      ],
      cta: 'Next',
    },
    {
      title: 'AI Training',
      blitz: `<strong>AI Training</strong> — live conversations with a real AI prospect who gives objections and won't back down. Brutal Mode, One Shot Close, Instant Reframe. Deal Autopsy after every call.`,
      features: [
        { icon: '🤖', title: 'Live AI prospect', desc: 'Human reactions + mood' },
        { icon: '😤', title: 'Brutal Coach Mode', desc: 'Zero sugar — raw feedback' },
        { icon: '🎰', title: 'One Shot Close', desc: '90 seconds, one chance' },
        { icon: '⚡', title: 'Instant Reframe', desc: 'Live objection detection' },
      ],
      cta: "Let's start closing!",
      finish: true,
    },
  ]

  const tut = TUT_STEPS[tutStep]

  if (step === 'tutorial') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col">
        {/* Header */}
        <div className="bg-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BlitzIcon size={24} />
            <span className="text-gold-400 font-bold text-sm">THE CLOSER</span>
          </div>
          <span className="text-white/30 text-xs">STEP 4 OF 4</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-4 pt-3">
          {TUT_STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= tutStep ? 'bg-closer-blue' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tutStep === 0 ? (
            <div className="flex flex-col items-center text-center pt-4 pb-6">
              <div className="text-3xl mb-3">🎉🔥💎⚡🏆</div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome to The Closer!</h2>
              <p className="text-white/50 text-sm mb-4">Your account is ready. Let Blitz show you around.</p>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                selectedPlan === 'elite' ? 'border-gold-500/40 text-gold-400 bg-gold-500/10' : 'border-closer-blue/40 text-closer-blue bg-closer-blue/10'
              }`}>
                {selectedPlan === 'elite' ? '🔥' : selectedPlan === 'pro' ? '⚡' : '🎯'} {plan?.name} — Activated
              </div>
            </div>
          ) : null}

          {/* Blitz bubble */}
          <div className="flex items-start gap-3 bg-navy-800/80 rounded-xl p-3 mb-4 border border-white/10">
            <BlitzIcon size={42} />
            <div className="bg-navy-950 border border-white/10 rounded-xl rounded-bl-sm px-3 py-2 flex-1">
              <p className="text-sm text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: tut.blitz }} />
            </div>
          </div>

          {/* Feature grid */}
          {tut.features && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tut.features.map(f => (
                <div key={f.title} className="bg-navy-800/60 border border-white/10 rounded-xl p-3">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xs font-bold text-white mb-0.5">{f.title}</div>
                  <div className="text-[10px] text-white/50">{f.desc}</div>
                  <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Included</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-navy-900">
          <button
            onClick={() => {
              if (tutStep < TUT_STEPS.length - 1) setTutStep(tutStep + 1)
              else dispatch({ type: 'SET_USER', payload: { name: name || 'Closer', email } })
            }}
            className={`w-full py-3 rounded-xl font-bold text-sm ${
              tut.finish
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900'
                : 'bg-closer-blue text-white'
            }`}
          >
            {tut.cta}
          </button>
          {tutStep > 0 && !tut.finish && (
            <button onClick={() => dispatch({ type: 'SET_USER', payload: { name: name || 'Closer', email } })} className="w-full text-center text-white/30 text-xs mt-3 py-1">
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    )
  }

  if (step === 'billing') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col">
        <div className="bg-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setStep('plans')} className="w-7 h-7 rounded-lg bg-white/10 text-white text-sm flex items-center justify-center">←</button>
            <span className="text-gold-400 font-bold text-sm">Billing</span>
          </div>
          <span className="text-white/30 text-xs">STEP 3 OF 4</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Plan summary */}
          <div className="flex items-center gap-3 bg-navy-800 rounded-xl p-3 border border-white/10">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${plan?.id === 'elite' ? 'bg-gold-500/20' : 'bg-closer-blue/20'}`}>
              {plan?.id === 'elite' ? '🔥' : '⚡'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{plan?.name}</div>
              <div className="text-xs text-white/50">{plan?.priceDisplay}{plan?.period}</div>
            </div>
            <button onClick={() => setStep('plans')} className="ml-auto text-xs text-closer-blue underline">Change</button>
          </div>

          <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Payment Information</div>
          <div className="flex gap-2">
            {['VISA','MC','AMEX'].map(c => <span key={c} className="text-[9px] font-bold px-2 py-1 border border-white/20 rounded text-white/50">{c}</span>)}
          </div>

          {[
            { label: 'Cardholder name', ph: 'Name on card', type: 'text' },
            { label: 'Card number', ph: '1234 5678 9012 3456', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.ph} className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Expiry</label>
              <input type="text" placeholder="MM / YY" className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">CVC</label>
              <input type="text" placeholder="•••" className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Billing email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-closer-blue" />
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>🔒</span> Secured with 256-bit SSL
          </div>
        </div>
        <div className="p-4 bg-navy-900 border-t border-white/10">
          <button
            onClick={handleBillingContinue}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
              plan?.id === 'elite' ? 'btn-gold' : 'bg-closer-blue text-white'
            }`}
          >
            🔒 Pay {plan?.priceDisplay}{plan?.period}
          </button>
          <p className="text-center text-xs text-white/30 mt-2">Cancel anytime · No hidden fees · Instant access</p>
        </div>
      </div>
    )
  }

  if (step === 'plans') {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col">
        <div className="bg-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BlitzIcon size={22} />
            <span className="text-gold-400 font-bold text-sm">Choose Your Plan</span>
          </div>
          <span className="text-white/30 text-xs">STEP 2 OF 4</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-center text-lg font-bold text-white mb-1">Pick your closer level</h2>
          <p className="text-center text-white/40 text-sm mb-4">Upgrade or downgrade anytime</p>
          <div className="space-y-3">
            {PLANS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all relative ${
                  selectedPlan === p.id
                    ? p.id === 'elite'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-closer-blue bg-closer-blue/10'
                    : p.id === 'elite'
                      ? 'border-gold-500/40 bg-navy-800/50'
                      : 'border-white/15 bg-navy-800/50'
                }`}
              >
                {p.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold ${
                    p.badgeColor === 'gold'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900'
                      : 'bg-closer-blue text-white'
                  }`}>
                    {p.badge}
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === p.id
                        ? p.id === 'elite' ? 'border-gold-500 bg-gold-500' : 'border-closer-blue bg-closer-blue'
                        : 'border-white/30'
                    }`}>
                      {selectedPlan === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="font-bold text-white">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${p.id === 'elite' ? 'text-gold-400' : p.id === 'pro' ? 'text-closer-blue' : 'text-white/50'}`}>
                      {p.priceDisplay}
                    </div>
                    <div className="text-xs text-white/40">{p.period}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.features.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">{f}</span>)}
                  {p.locked.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/20 line-through">{f}</span>)}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-navy-900 border-t border-white/10">
          <button
            onClick={handlePlanContinue}
            className={`w-full py-3 rounded-xl font-bold text-sm ${
              selectedPlan === 'elite' ? 'btn-gold' : selectedPlan === 'pro' ? 'bg-closer-blue text-white' : 'bg-white/10 text-white/60 border border-white/20'
            }`}
          >
            Continue with {PLANS.find(p => p.id === selectedPlan)?.name}
          </button>
        </div>
      </div>
    )
  }

  // Default: Login/Signup
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <div className="bg-navy-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BlitzIcon size={26} />
          <div>
            <div className="text-sm font-bold text-gold-400 leading-none">THE CLOSER</div>
            <div className="text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Sales Intelligence</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          {/* Blitz greeting */}
          <div className="flex items-start gap-3 bg-navy-800/80 rounded-2xl p-3 border border-white/10 mb-5">
            <BlitzIcon size={44} />
            <div>
              <p className="text-sm font-bold text-white mb-0.5">Hey, I'm Blitz!</p>
              <p className="text-xs text-white/50 leading-relaxed">Your personal sales coach. {isSignIn ? 'Sign in and let\'s get to work.' : 'Sign up and I\'ll show you everything.'}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">{isSignIn ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-white/40 text-sm mb-5">{isSignIn ? 'Sign in to continue your closer journey' : 'Join thousands of closers leveling up'}</p>

          {/* Apple button — shown first per Apple HIG */}
          <button
            onClick={handleAppleAuth}
            disabled={appleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-black border border-white/20 hover:bg-white/5 text-white text-sm font-medium transition-colors mb-3 disabled:opacity-60"
          >
            {appleLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg width="15" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.453 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.94 1.156-1.672 1.636-3.295 1.662-3.402-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                {isSignIn ? 'Sign in with Apple' : 'Sign up with Apple'}
              </>
            )}
          </button>

          {/* Google button */}
          <button
            onClick={() => { isSignIn ? handleAuth() : setStep('plans') }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors mb-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSignIn ? 'Continue with Google' : 'Sign up with Google'}
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-2.5">
            {!isSignIn && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-navy-800 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-closer-blue"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-navy-800 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-closer-blue"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-navy-800 border border-white/15 rounded-xl px-3.5 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-closer-blue"
            />
          </div>

          <button
            onClick={() => isSignIn ? handleAuth() : setStep('plans')}
            className="w-full mt-4 py-3 rounded-xl bg-closer-blue text-white font-bold text-sm hover:bg-blue-600 transition-colors"
          >
            {isSignIn ? 'Sign in' : 'Create account'}
          </button>

          <p className="text-center mt-3 text-xs text-white/40">
            {isSignIn ? "No account?" : "Have an account?"}{' '}
            <button onClick={() => setIsSignIn(!isSignIn)} className="text-closer-blue font-bold">
              {isSignIn ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
          <p className="text-center mt-2 text-[10px] text-white/25">By continuing you agree to The Closer's Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
