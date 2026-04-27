import React, { useState } from 'react'
import BlitzBar from '../components/layout/BlitzBar'
import { AGENCY_TIERS, TEAM_MEMBERS } from '../data/constants'

function TierCard({ tier }) {
  const styles = {
    t1: { card: 'bg-gradient-to-br from-blue-950/80 to-blue-900/60 border-closer-blue/60', tierText: 'text-closer-blue', pct: 'text-closer-blue', perk: 'bg-blue-900/60 text-blue-300' },
    t2: { card: 'bg-gradient-to-br from-yellow-950/60 to-yellow-900/40 border-yellow-600/50', tierText: 'text-yellow-500', pct: 'text-yellow-400', perk: 'bg-yellow-900/60 text-yellow-300' },
    t3: { card: 'bg-gradient-to-br from-navy-900 to-[#0f1f3a] border-gold-500/60', tierText: 'text-gold-400', pct: 'text-gold-400', perk: 'bg-gold-500/15 text-gold-400 border border-gold-500/30' },
  }
  const s = styles[tier.style]
  return (
    <div className={`rounded-2xl p-4 border-2 mb-3 ${s.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[8px] font-extrabold uppercase tracking-widest mb-1 ${s.tierText}`}>{tier.tier}</div>
          <div className="text-base font-extrabold text-white">{tier.name}</div>
          <div className={`text-xs mt-0.5 ${tier.style === 't3' ? 'text-white/40' : 'text-white/50'}`}>{tier.req}</div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-extrabold leading-none ${s.pct}`}>{tier.pct}<span className="text-sm font-semibold">%</span></div>
          <div className={`text-[9px] mt-0.5 ${tier.style === 't3' ? 'text-white/40' : 'text-white/50'}`}>{tier.detail}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tier.perks.map(p => (
          <span key={p} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.perk}`}>{p}</span>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const [copied, setCopied] = useState(false)
  const copyCode = () => {
    navigator.clipboard?.writeText('ELITE-JD-7X2K')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Code box */}
      <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-4 border border-closer-blue/30">
        <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Your Partner Code</div>
        <div className="text-xs text-white/60 mb-3">Share with your team. You earn monthly on every active member.</div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-base font-bold text-gold-400 font-mono tracking-widest">{`ELITE-JD-7X2K`}</div>
          <button onClick={copyCode} className="px-3 py-2.5 bg-gold-500/20 border border-gold-500/40 rounded-xl text-xs font-bold text-gold-400 hover:bg-gold-500/30 transition-colors">
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <div className="mt-2 text-[9px] text-white/30">Link: thecloser.ai/join?ref=<span className="text-gold-400">ELITE-JD-7X2K</span></div>
      </div>

      {/* Earnings */}
      <div className="grid grid-cols-3 gap-2">
        {[{ v: '$340', l: 'This Month', c: 'text-green-400' }, { v: '$1,820', l: 'All Time', c: 'text-green-400' }, { v: '34', l: 'Members', c: 'text-closer-blue' }].map(s => (
          <div key={s.l} className="bg-navy-800/60 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-[8px] text-white/40 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tier progress */}
      <div className="bg-navy-800/60 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white">Tier Progress</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-navy-900 to-navy-800 text-gold-400 border border-gold-500/40">🔥 Elite Partner · 40%</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[9px] text-white/40 w-24">Active members</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full" style={{ width: '68%' }} />
          </div>
          <span className="text-xs font-bold text-gold-400 w-5">34</span>
        </div>
        <p className="text-[9px] text-white/40">16 more to maintain Elite Tier · Next payout: <strong className="text-white/60">May 1</strong></p>
      </div>

      {/* Blitz */}
      <BlitzBar
        message={`Your team's close rate is up 14% this month. <strong>Marcus and Jordan</strong> are top performers — both using Brutal Mode daily. Push new reps into the Psychology zones — a trained team stays subscribed longer. That's your recurring income right there.`}
        gold
      />

      {/* Team table */}
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Team Members (34 active)</div>
        <div className="bg-navy-800/40 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-0 border-b border-white/10">
            {['Name', 'Plan', 'Close %', 'Status'].map(h => (
              <div key={h} className="px-3 py-2 text-[8px] font-bold text-white/40 uppercase tracking-wider">{h}</div>
            ))}
          </div>
          {TEAM_MEMBERS.map((m, i) => (
            <div key={i} className="grid grid-cols-4 border-b border-white/5 last:border-0">
              <div className="px-3 py-2.5 text-xs font-semibold text-white">{m.name}</div>
              <div className="px-3 py-2.5">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${m.plan === 'Elite' ? 'bg-gold-500/20 text-gold-400' : 'bg-blue-900/60 text-blue-300'}`}>{m.plan}</span>
              </div>
              <div className="px-3 py-2.5 flex items-center gap-2">
                <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-closer-blue rounded-full" style={{ width: m.close + '%' }} />
                </div>
                <span className={`text-[9px] font-bold ${m.close >= 60 ? 'text-green-400' : m.close >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{m.close}%</span>
              </div>
              <div className="px-3 py-2.5">
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-900/60 text-green-400' : 'bg-yellow-900/60 text-yellow-400'}`}>
                  {m.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApplyForm() {
  const [form, setForm] = useState({ name: '', email: '', role: '', plan: '', company: '', size: '', why: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = () => {
    if (form.plan !== 'elite') {
      setStatus('error')
      return
    }
    if (!form.name || !form.email || !form.role || !form.company) return
    setStatus('success')
  }

  return (
    <div className="space-y-3 pb-4">
      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Apply to Partner Program</div>
      <BlitzBar message={`We don't hand out partner codes to just anyone. We protect the program's quality so your name is attached to something worth promoting. Fill this out — it goes directly to the founder for review.`} gold />

      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Full name', key: 'name', ph: 'First Last', type: 'text' }, { label: 'Email', key: 'email', ph: 'you@co.com', type: 'email' }].map(f => (
          <div key={f.key}>
            <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            <option value="">Select role</option>
            {['Agency Owner', 'Upline / IMO', 'Broker', 'Sales Team Lead', 'Sales Trainer'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Current plan</label>
          <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue">
            <option value="">Select plan</option>
            <option value="elite">Elite Closer ($49.99)</option>
            <option value="pro">Pro ($17.99)</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Agency name</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Your agency..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
        </div>
        <div>
          <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Team size</label>
          <input type="number" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g. 12" className="w-full bg-navy-800 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
        </div>
      </div>

      <div>
        <label className="block text-[8px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Why do you want to partner?</label>
        <textarea value={form.why} onChange={e => setForm({ ...form, why: e.target.value })} rows={2} placeholder="Tell us about your team..." className="w-full bg-navy-800/80 border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs placeholder-white/25 focus:outline-none focus:border-closer-blue resize-none" />
      </div>

      <button onClick={handleSubmit} className="w-full py-3 btn-gold rounded-xl text-sm">Submit Application →</button>

      {status === 'error' && (
        <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3">
          <p className="text-xs text-red-300 font-bold">Elite Closer subscription required.</p>
          <p className="text-xs text-red-300/70 mt-1">Upgrade to $49.99/mo first, then reapply. The Agency Growth Program is only available to Elite subscribers.</p>
        </div>
      )}
      {status === 'success' && (
        <div className="bg-green-500/15 border border-green-500/40 rounded-xl p-3">
          <p className="text-sm font-bold text-green-300 mb-1">✅ Application submitted!</p>
          <p className="text-xs text-green-300/70">Your application is under manual review. We respond within 24–48 hours. Only Elite subscribers with legitimate agency operations will be approved.</p>
        </div>
      )}

      <p className="text-center text-[9px] text-white/25 leading-relaxed">Applications reviewed manually. Not everyone gets a code — we protect the program quality.</p>
    </div>
  )
}

export default function AgencyScreen() {
  const [view, setView] = useState('landing') // landing | dashboard | apply

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {view !== 'landing' && (
        <div className="bg-navy-900 px-4 py-3 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
          <button onClick={() => setView('landing')} className="w-6 h-6 rounded-lg bg-white/10 text-white/60 flex items-center justify-center text-xs hover:bg-white/20">←</button>
          <span className="text-sm font-bold text-gold-400">{view === 'dashboard' ? 'Agency Dashboard' : 'Apply to Partner'}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        {view === 'landing' && (
          <div className="bg-gradient-to-b from-navy-900 to-navy-950 px-4 py-6 text-center border-b border-gold-500/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-gold-500/40 text-gold-400 bg-gold-500/8 mb-4">🏢 Agency Growth Program</div>
            <h2 className="text-xl font-extrabold text-white mb-2">Grow Your Team.<br /><span className="text-gold-400">Earn While They Close.</span></h2>
            <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto mb-5">Not a quick affiliate gimmick. A professional revenue share for agency owners, uplines, and brokers who build and train real teams.</p>
            <div className="flex gap-3 justify-center mb-2">
              <button onClick={() => setView('dashboard')} className="px-5 py-2.5 rounded-xl text-xs font-bold btn-gold">View My Dashboard</button>
              <button onClick={() => setView('apply')} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20 hover:bg-white/15">Apply to Partner</button>
            </div>
          </div>
        )}

        <div className="p-4">
          {view === 'landing' && (
            <>
              <BlitzBar message={`This is a real income stream tied to your team's growth. You earn monthly — as long as your people pay. A trained team stays subscribed longer. That's compounding income from the work you're already doing.`} gold />

              <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-3">Commission Tiers</div>
              {AGENCY_TIERS.map(tier => <TierCard key={tier.id} tier={tier} />)}

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-blue-950/60 rounded-xl text-center border border-closer-blue/40">
                  <div className="text-xl font-extrabold text-closer-blue">$17.99</div>
                  <div className="text-[9px] font-bold text-blue-300">Pro Closer / mo</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-navy-900 to-[#1a3050] rounded-xl text-center border border-gold-500/40">
                  <div className="text-xl font-extrabold text-gold-400">$49.99</div>
                  <div className="text-[9px] font-bold text-gold-500">Elite Closer / mo</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-navy-800/60 border border-white/10 rounded-xl p-4 mb-4">
                <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-3">Quality Filter — Who Gets a Code</div>
                {[
                  { ok: true, text: 'Active Elite Closer subscriber ($49.99/mo)' },
                  { ok: true, text: 'Agency owner, broker, upline, or team leader' },
                  { ok: true, text: 'Manual approval — contact us directly' },
                  { ok: false, text: 'No open registration — not everyone gets a code' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-sm">{r.ok ? '✅' : '❌'}</span>
                    <span className={`text-xs ${r.ok ? 'text-white/70' : 'text-white/30'}`}>{r.text}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setView('apply')} className="w-full py-3 rounded-xl btn-gold font-bold text-sm">Apply to Become a Partner →</button>
            </>
          )}
          {view === 'dashboard' && <Dashboard />}
          {view === 'apply' && <ApplyForm />}
        </div>
      </div>
    </div>
  )
}
