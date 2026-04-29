import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { CHAT_META, CHAT_USERS, INITIAL_CHAT_DATA } from '../data/constants'
import { ReactionEmoji } from '../components/icons/CustomEmoji'

const ME = { name: 'You (Owner)', initials: 'YN', color: '#c8a84a', role: 'owner' }

function roleBadge(role) {
  const s = {
    owner: 'bg-gradient-to-r from-yellow-950/80 to-yellow-900/60 text-yellow-400 border border-yellow-600/40',
    upline: 'bg-blue-900/60 text-blue-300',
    rep: 'bg-green-900/60 text-green-400',
  }
  const labels = { owner: 'Owner', upline: 'Upline', rep: 'Rep' }
  return <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${s[role] || ''}`}>{labels[role] || role}</span>
}

function Avatar({ user, size = 24 }) {
  const u = user === 'me' ? ME : CHAT_USERS[user]
  if (!u) return null
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: u.color, fontSize: size * 0.37 }}>
      {u.initials}
    </div>
  )
}

function MessageGroup({ msg, idx, channel, chatData, setChatData }) {
  const { state, dispatch } = useApp()
  const user = msg.user === 'me' ? ME : CHAT_USERS[msg.user]
  if (!user) return null

  const toggleReact = (ri) => {
    const key = `${channel}-${idx}-${ri}`
    dispatch({ type: 'TOGGLE_REACT', payload: key })
  }

  if (msg.type === 'sys') {
    return (
      <div className="text-center my-3">
        <span className="text-[9px] text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{msg.text}</span>
      </div>
    )
  }

  if (msg.type === 'ann') {
    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar user={msg.user} size={24} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">{user.name}</span>
            {roleBadge(user.role)}
            {msg.pinned && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/25">📌 pinned</span>}
            <span className="text-[9px] text-white/25">{msg.time}</span>
          </div>
        </div>
        <div className="ml-8">
          <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl p-3 border border-closer-blue/25 max-w-sm">
            <div className="text-[8px] font-bold text-gold-400 uppercase tracking-wider mb-1.5">📢 Announcement</div>
            <p className="text-xs text-white/90 leading-relaxed">{msg.text}</p>
          </div>
        </div>
      </div>
    )
  }

  if (msg.type === 'deal') {
    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar user={msg.user} size={24} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">{user.name}</span>
            {roleBadge(user.role)}
            <span className="text-[9px] text-white/25">{msg.time}</span>
          </div>
        </div>
        <div className="ml-8">
          <div className="bg-navy-800/60 border border-white/10 border-l-2 border-l-green-500 rounded-r-xl p-3 max-w-xs">
            <div className="text-[8px] font-bold text-green-400 uppercase tracking-wider mb-1">Closed Deal</div>
            <div className="text-xl font-extrabold text-green-400 mb-1">${Number(msg.amount).toLocaleString()}</div>
            <p className="text-[10px] text-white/60"><strong>{msg.industry}</strong> · {msg.client} · {msg.ttc}</p>
            <p className="text-[10px] text-white/40 italic mt-1">"{msg.note}"</p>
            <span className="inline-block text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 mt-2">{msg.industry}</span>
          </div>
          {msg.rxns?.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {msg.rxns.map((r, ri) => {
                const key = `${channel}-${idx}-${ri}`
                const reacted = state.chatReacted[key]
                return (
                  <button key={ri} onClick={() => toggleReact(ri)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] transition-all ${reacted ? 'border-closer-blue bg-closer-blue/20 text-closer-blue' : 'border-white/15 bg-white/5 text-white/50 hover:bg-white/10'}`}>
                    <ReactionEmoji emoji={r.e} size={11} /> {r.n + (reacted ? 1 : 0)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Normal message
  const textHtml = msg.text.replace(/@(\w+)/g, '<span class="text-closer-blue font-bold">@$1</span>')
  return (
    <div className="mb-3">
      <div className="flex items-start gap-2">
        <Avatar user={msg.user} size={26} />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-white">{user.name}</span>
            {roleBadge(user.role)}
            <span className="text-[9px] text-white/25">{msg.time}</span>
          </div>
          <p className="text-xs text-white/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: textHtml }} />
          {msg.rxns?.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {msg.rxns.map((r, ri) => {
                const key = `${channel}-${idx}-${ri}`
                const reacted = state.chatReacted[key]
                return (
                  <button key={ri} onClick={() => toggleReact(ri)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] transition-all ${reacted ? 'border-closer-blue bg-closer-blue/20 text-closer-blue' : 'border-white/15 bg-white/5 text-white/50 hover:bg-white/10'}`}>
                    <ReactionEmoji emoji={r.e} size={11} /> {r.n + (reacted ? 1 : 0)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamChatScreen() {
  const { state } = useApp()
  const [currentCh, setCurrentCh] = useState('general')
  const [chatData, setChatData] = useState(INITIAL_CHAT_DATA)
  const [input, setInput] = useState('')
  const [showDealForm, setShowDealForm] = useState(false)
  const [showAnnForm, setShowAnnForm] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const msgsEndRef = useRef(null)

  // Deal form state
  const [dfAmt, setDfAmt] = useState('')
  const [dfInd, setDfInd] = useState('Solar')
  const [dfClient, setDfClient] = useState('')
  const [dfTime, setDfTime] = useState('')
  const [dfNote, setDfNote] = useState('')

  // Ann form state
  const [annText, setAnnText] = useState('')

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentCh, chatData])

  const meta = CHAT_META[currentCh]
  const msgs = chatData[currentCh] || []

  const nowTime = () => {
    const d = new Date()
    let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap
  }

  const sendMsg = () => {
    if (!input.trim()) return
    setChatData(prev => ({
      ...prev,
      [currentCh]: [...(prev[currentCh] || []), { type: 'msg', user: 'me', text: input, time: nowTime(), rxns: [] }]
    }))
    setInput('')
  }

  const postDeal = () => {
    if (!dfAmt) return
    const deal = { type: 'deal', user: 'me', amount: parseFloat(dfAmt), industry: dfInd, client: dfClient || 'Client', ttc: dfTime || 'N/A', note: dfNote || 'Closed it.', time: nowTime(), rxns: [{ e: '🔥', n: 0 }, { e: '💰', n: 0 }, { e: '💪', n: 0 }] }
    setChatData(prev => {
      const updated = { ...prev, [currentCh]: [...(prev[currentCh] || []), deal] }
      if (currentCh !== 'deals') updated['deals'] = [...(prev['deals'] || []), { ...deal, time: nowTime() }]
      return updated
    })
    setDfAmt(''); setDfClient(''); setDfTime(''); setDfNote('')
    setShowDealForm(false)
  }

  const postAnn = () => {
    if (!annText.trim()) return
    const ann = { type: 'ann', user: 'me', text: annText, time: nowTime(), pinned: true }
    setChatData(prev => {
      const updated = { ...prev, announcements: [...(prev['announcements'] || []), ann] }
      if (currentCh !== 'announcements') updated[currentCh] = [...(prev[currentCh] || []), ann]
      return updated
    })
    setAnnText(''); setShowAnnForm(false)
  }

  const SIDEBAR_ITEMS = [
    { section: 'Agency', items: [
      { id: 'general', icon: '#', label: 'general' },
      { id: 'announcements', icon: '📢', label: 'announcements' },
      { id: 'deals', icon: '💰', label: 'deal board' },
    ]},
    { section: 'Teams', items: [
      { id: 'team-a', icon: '⚡', label: 'Team Alpha' },
      { id: 'team-b', icon: '🔥', label: 'Team Bravo' },
      { id: 'training', icon: '🎯', label: 'training tips' },
    ]},
    { section: 'Direct', items: [
      { id: 'dm-marcus', icon: 'M', label: 'Marcus T.', color: '#1a6bbf', online: true },
      { id: 'dm-jordan', icon: 'J', label: 'Jordan R.', color: '#e74c3c' },
    ]},
  ]

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Overlay — mobile only, behind sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setShowSidebar(false)} />
      )}
      {/* Sidebar — slides in from LEFT */}
      <div className={`fixed inset-y-0 left-0 z-50 w-52 bg-gray-900 border-r border-white/10 flex flex-col overflow-hidden transition-transform duration-300 ease-out md:relative md:inset-auto md:z-auto md:translate-x-0 md:flex ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          {SIDEBAR_ITEMS.map(sec => (
            <div key={sec.section}>
              <div className="px-3 pt-3 pb-1 text-[8px] font-bold text-white/30 uppercase tracking-widest">{sec.section}</div>
              {sec.items.map(item => (
                <button key={item.id} onClick={() => { setCurrentCh(item.id); setShowSidebar(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${currentCh === item.id ? 'bg-closer-blue/20 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                  {item.color ? (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: item.color }}>{item.icon}</span>
                  ) : (
                    <span className="text-sm w-5 text-center flex-shrink-0">{item.icon}</span>
                  )}
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {item.online && <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto flex-shrink-0" />}
                </button>
              ))}
              <div className="h-px bg-white/8 mx-3 my-1" />
            </div>
          ))}
          {/* User */}
          <div className="mt-auto flex items-center gap-2 px-3 py-3 border-t border-white/10">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-navy-900 text-xs flex-shrink-0" style={{ background: '#c8a84a' }}>YN</div>
            <div>
              <div className="text-xs font-bold text-white leading-none">You (Owner)</div>
              <div className="text-[8px] text-white/40 mt-0.5">Elite · Tier 3</div>
            </div>
          </div>
        </div>
      {/* end sidebar */}

      {/* Main chat */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat header */}
        <div className="bg-gray-900 border-b border-white/10 px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setShowSidebar(true)} className="md:hidden w-7 h-7 rounded-lg bg-white/10 text-white/60 flex items-center justify-center text-sm hover:bg-white/15">☰</button>
          <span className="text-sm">{meta?.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-white leading-none">{meta?.name}</div>
            <div className="text-[9px] text-white/40 mt-0.5">{meta?.desc}</div>
          </div>
          {meta?.action && (
            <button onClick={() => meta.action === 'Announce' ? setShowAnnForm(!showAnnForm) : setShowDealForm(!showDealForm)}
              className="px-3 py-1.5 rounded-lg bg-closer-blue/80 text-white text-xs font-bold hover:bg-closer-blue transition-colors">
              {meta.action}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 pt-3">
          {msgs.map((msg, i) => (
            <MessageGroup key={i} msg={msg} idx={i} channel={currentCh} chatData={chatData} setChatData={setChatData} />
          ))}
          {msgs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-3xl mb-3 opacity-20">💬</div>
              <p className="text-sm text-white/30">No messages yet — be the first to post.</p>
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Deal form */}
        {showDealForm && (
          <div className="bg-gray-900 border-t border-white/10 px-3 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Log a closed deal</span>
              <button onClick={() => setShowDealForm(false)} className="text-white/30 hover:text-white/60 text-sm">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-[7px] font-bold text-white/40 uppercase tracking-wider mb-1">Amount ($)</label>
                <input type="number" value={dfAmt} onChange={e => setDfAmt(e.target.value)} placeholder="8500" className="w-full bg-navy-800 border border-white/15 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
              </div>
              <div>
                <label className="block text-[7px] font-bold text-white/40 uppercase tracking-wider mb-1">Industry</label>
                <select value={dfInd} onChange={e => setDfInd(e.target.value)} className="w-full bg-navy-800 border border-white/15 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-closer-blue">
                  {['Solar', 'Life Insurance', 'Real Estate', 'Door-to-Door', 'Car Sales', 'B2B / SaaS'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-[7px] font-bold text-white/40 uppercase tracking-wider mb-1">Client type</label>
                <input value={dfClient} onChange={e => setDfClient(e.target.value)} placeholder="homeowner, SMB..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
              </div>
              <div>
                <label className="block text-[7px] font-bold text-white/40 uppercase tracking-wider mb-1">Time to close</label>
                <input value={dfTime} onChange={e => setDfTime(e.target.value)} placeholder="same day, 2 calls..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-[7px] font-bold text-white/40 uppercase tracking-wider mb-1">How you closed it</label>
              <input value={dfNote} onChange={e => setDfNote(e.target.value)} placeholder="Used Cardone's urgency frame..." className="w-full bg-navy-800 border border-white/15 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-closer-blue placeholder-white/25" />
            </div>
            <button onClick={postDeal} className="w-full py-2 bg-closer-blue text-white font-bold rounded-lg text-xs">Post deal to board</button>
          </div>
        )}

        {/* Announce form */}
        {showAnnForm && (
          <div className="bg-gradient-to-b from-navy-900 to-navy-800 border-t border-gold-500/20 px-3 py-3">
            <div className="text-[8px] font-bold text-gold-400 uppercase tracking-widest mb-2">📢 Post announcement to all members</div>
            <textarea value={annText} onChange={e => setAnnText(e.target.value)} rows={2} placeholder="Type your announcement..." className="w-full bg-white/5 border border-gold-500/25 rounded-xl px-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-gold-500 resize-none mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-white/30">Will be pinned and visible to all members</span>
              <div className="flex gap-2">
                <button onClick={() => setShowAnnForm(false)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 text-xs">Cancel</button>
                <button onClick={postAnn} className="px-3 py-1.5 btn-gold rounded-lg text-[10px] font-bold">Post to all</button>
              </div>
            </div>
          </div>
        )}

        {/* Compose */}
        {!showDealForm && !showAnnForm && (
          <div className="bg-gray-900 border-t border-white/10 px-3 py-2.5 flex-shrink-0">
            <div className="flex gap-2 mb-2">
              <button onClick={() => { setShowDealForm(true); setShowAnnForm(false) }} className="text-[9px] font-medium px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 text-white/50 hover:bg-white/10 flex items-center gap-1">💰 Log deal</button>
              {meta?.canAnnounce && (
                <button onClick={() => { setShowAnnForm(true); setShowDealForm(false) }} className="text-[9px] font-medium px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 text-white/50 hover:bg-white/10 flex items-center gap-1">📢 Announce</button>
              )}
              <button onClick={() => setInput(i => i + '@')} className="text-[9px] font-medium px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 text-white/50 hover:bg-white/10">@ Mention</button>
            </div>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
                placeholder={`Message ${meta?.name || ''}...`}
                rows={1}
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-closer-blue resize-none"
                style={{ minHeight: 34, maxHeight: 72 }}
              />
              <button onClick={sendMsg} className="px-3 py-2 bg-closer-blue text-white font-bold rounded-xl text-xs">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
