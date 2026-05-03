import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { CHAT_USERS, INITIAL_CHAT_DATA, ALL_TEAM_MEMBERS } from '../data/constants'
import { ReactionEmoji } from '../components/icons/CustomEmoji'
import ChannelModal from '../components/chat/ChannelModal'
import ManageMembersModal from '../components/chat/ManageMembersModal'

const ME = { name: 'You (Owner)', initials: 'YN', color: '#c8a84a', role: 'owner' }
const isOwner = true

function getRoleBadgeStyle(role) {
  if (role === 'owner')  return { background: 'linear-gradient(135deg,rgba(200,168,74,.22),rgba(200,168,74,.09))', color: '#e8c870', border: '1px solid rgba(200,168,74,.32)' }
  if (role === 'upline') return { background: 'rgba(26,107,191,.2)', color: '#4a9eff', border: '1px solid rgba(26,107,191,.3)' }
  return { background: 'rgba(5,150,105,.18)', color: '#34d399', border: '1px solid rgba(5,150,105,.25)' }
}

function RoleBadge({ role }) {
  const s = getRoleBadgeStyle(role)
  const labels = { owner: 'Owner', upline: 'Upline', rep: 'Rep' }
  return (
    <span style={{ fontSize: 7, fontWeight: 700, padding: '1.5px 5px', borderRadius: 9999, flexShrink: 0, ...s }}>
      {labels[role] || role}
    </span>
  )
}

function Avatar({ user, size = 32 }) {
  const u = user === 'me' ? ME : CHAT_USERS[user]
  if (!u) return null
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: u.color, boxShadow: `0 0 8px ${u.color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.floor(size * 0.34), fontWeight: 900,
      color: u.color === '#c8a84a' ? '#040d1a' : '#fff',
      flexShrink: 0,
    }}>
      {u.initials}
    </div>
  )
}

function Reactions({ rxns, channel, idx }) {
  const { state, dispatch } = useApp()
  if (!rxns?.length) return null
  return (
    <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
      {rxns.map((r, ri) => {
        const key = `${channel}-${idx}-${ri}`
        const reacted = state.chatReacted[key]
        return (
          <button key={ri} onClick={() => dispatch({ type: 'TOGGLE_REACT', payload: key })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 9999,
              border: reacted ? '1px solid rgba(200,168,74,.5)' : '1px solid rgba(255,255,255,.12)',
              background: reacted ? 'rgba(200,168,74,.12)' : 'rgba(255,255,255,.04)',
              color: reacted ? '#e8c870' : 'rgba(255,255,255,.42)',
              fontSize: 9, fontWeight: reacted ? 700 : 400, transition: 'all .15s ease',
            }}
          >
            <ReactionEmoji emoji={r.e} size={11} /> {r.n + (reacted ? 1 : 0)}
          </button>
        )
      })}
    </div>
  )
}

function MessageGroup({ msg, idx, channel }) {
  const [hov, setHov] = useState(false)
  const user = msg.user === 'me' ? ME : CHAT_USERS[msg.user]
  if (!user) return null

  if (msg.type === 'sys') {
    return (
      <div style={{ textAlign: 'center', margin: '12px 0' }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,.28)', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', padding: '3px 12px', borderRadius: 9999 }}>
          {msg.text}
        </span>
      </div>
    )
  }

  if (msg.type === 'ann') {
    return (
      <div style={{ marginBottom: 14, animation: 'msgFadeIn .3s ease-out both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Avatar user={msg.user} size={28} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user.name}</span>
            <RoleBadge role={user.role} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.28)' }}>{msg.time}</span>
          </div>
        </div>
        <div style={{ marginLeft: 38 }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(200,168,74,.07),rgba(200,168,74,.02))', border: '1px solid rgba(200,168,74,.22)', borderRadius: 12, overflow: 'hidden', maxWidth: 300 }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(200,168,74,.28),rgba(200,168,74,.13))', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#e8c870', textTransform: 'uppercase', letterSpacing: '.1em', flex: 1 }}>📢 Announcement</span>
              {msg.pinned && <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 6px', borderRadius: 9999, background: 'rgba(200,168,74,.18)', color: '#c8a84a', border: '1px solid rgba(200,168,74,.3)' }}>📌 pinned</span>}
            </div>
            <div style={{ padding: '8px 12px' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.9)', lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (msg.type === 'deal') {
    return (
      <div style={{ marginBottom: 14, animation: 'msgFadeIn .3s ease-out both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Avatar user={msg.user} size={28} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user.name}</span>
            <RoleBadge role={user.role} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.28)' }}>{msg.time}</span>
          </div>
        </div>
        <div style={{ marginLeft: 38 }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,.1),rgba(5,150,105,.04))', border: '1px solid rgba(5,150,105,.28)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 0 14px rgba(5,150,105,.1)', maxWidth: 280 }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,.35),rgba(4,120,87,.22))', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.1em' }}>🏆 Closed Deal</span>
              <span style={{ fontSize: 8, color: 'rgba(52,211,153,.55)' }}>{msg.time}</span>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#34d399', lineHeight: 1, marginBottom: 4 }}>${Number(msg.amount).toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.72)', marginBottom: 3 }}><strong>{msg.industry}</strong> · {msg.client} · {msg.ttc}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.38)', fontStyle: 'italic', marginBottom: 8 }}>"{msg.note}"</div>
              <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: 'rgba(26,107,191,.2)', color: '#4a9eff', border: '1px solid rgba(26,107,191,.2)' }}>{msg.industry}</span>
            </div>
          </div>
          <Reactions rxns={msg.rxns} channel={channel} idx={idx} />
        </div>
      </div>
    )
  }

  const textHtml = msg.text.replace(/@(\w+)/g, '<span style="color:#4a9eff;font-weight:700">@$1</span>')
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ marginBottom: 12, animation: 'msgFadeIn .3s ease-out both', paddingRight: 4 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Avatar user={msg.user} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user.name}</span>
            <RoleBadge role={user.role} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.25)', opacity: hov ? 1 : 0, transition: 'opacity .15s ease' }}>{msg.time}</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: textHtml }} />
          <Reactions rxns={msg.rxns} channel={channel} idx={idx} />
        </div>
      </div>
    </div>
  )
}

function ChannelContextMenu({ channel, onEdit, onMembers, onDelete, onClose }) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', right: 4, top: '100%', zIndex: 40,
        background: '#0d2040', border: '1px solid rgba(200,168,74,0.2)',
        borderRadius: 12, overflow: 'hidden', width: 164,
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      }}
    >
      <MenuBtn onClick={onEdit} label="✏️ Edit Name & Icon" />
      {channel.type === 'group' && <MenuBtn onClick={onMembers} label="👥 Manage Members" />}
      {!channel.isDefault && (
        <>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
          <MenuBtn onClick={onDelete} label="🗑️ Delete Channel" danger />
        </>
      )}
    </div>
  )
}

function MenuBtn({ onClick, label, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        padding: '9px 12px', textAlign: 'left', fontSize: 11, border: 'none',
        background: hov ? (danger ? 'rgba(239,68,68,0.08)' : 'rgba(200,168,74,0.08)') : 'transparent',
        color: hov ? (danger ? '#ef4444' : '#e8c87a') : (danger ? '#ef4444' : 'rgba(255,255,255,0.7)'),
        transition: 'all .12s',
      }}
    >
      {label}
    </button>
  )
}

function getChannelAction(ch) {
  if (!ch) return null
  if (ch.id === 'announcements') return 'Announce'
  if (ch.id === 'deals') return 'Log Deal'
  return 'Post Deal'
}

export default function TeamChatScreen() {
  const { state, dispatch } = useApp()

  const [currentCh, setCurrentCh] = useState('general')
  const [input, setInput] = useState('')
  const [showDealForm, setShowDealForm] = useState(false)
  const [showAnnForm, setShowAnnForm] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [toolHov, setToolHov] = useState(null)
  const [channelMenuOpen, setChannelMenuOpen] = useState(null)
  const [hovCh, setHovCh] = useState(null)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState(null)
  const [managingChannel, setManagingChannel] = useState(null)
  const msgsEndRef = useRef(null)

  const [dfAmt, setDfAmt] = useState('')
  const [dfInd, setDfInd] = useState('Solar')
  const [dfClient, setDfClient] = useState('')
  const [dfTime, setDfTime] = useState('')
  const [dfNote, setDfNote] = useState('')
  const [annText, setAnnText] = useState('')

  // Merge seed data with any persisted messages for custom channels
  const [chatData, setChatData] = useState(() => {
    const merged = { ...INITIAL_CHAT_DATA }
    Object.entries(state.chatMessages || {}).forEach(([id, msgs]) => {
      if (!INITIAL_CHAT_DATA[id]) merged[id] = msgs
    })
    return merged
  })

  const channels = state.customChannels || []
  const dms = state.customDMs || []

  const currentChannelData = channels.find(c => c.id === currentCh)
  const currentDMData = dms.find(d => d.id === currentCh)

  const channelAction = getChannelAction(currentChannelData)
  const canAnnounce = currentChannelData?.canAnnounce ?? false

  const msgs = chatData[currentCh] || []

  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentCh, chatData])

  // Close context menu on outside click
  useEffect(() => {
    const close = () => setChannelMenuOpen(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const nowTime = () => {
    const d = new Date()
    let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap
  }

  const sendMsg = () => {
    if (!input.trim()) return
    const msg = { type: 'msg', user: 'me', text: input, time: nowTime(), rxns: [] }
    setChatData(prev => ({ ...prev, [currentCh]: [...(prev[currentCh] || []), msg] }))
    if (!INITIAL_CHAT_DATA[currentCh]) {
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { channelId: currentCh, message: msg } })
    }
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
    if (!INITIAL_CHAT_DATA[currentCh]) {
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { channelId: currentCh, message: deal } })
    }
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
    if (!INITIAL_CHAT_DATA[currentCh]) {
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { channelId: currentCh, message: ann } })
    }
    setAnnText(''); setShowAnnForm(false)
  }

  // ── Channel management ──────────────────────────────────────────
  const handleCreateChannel = (data) => {
    const id = 'ch-' + Date.now()
    dispatch({
      type: 'ADD_CHANNEL',
      payload: { id, ...data, isDefault: false, createdBy: 'owner' },
    })
    setShowChannelModal(false)
    setCurrentCh(id)
  }

  const handleEditChannel = (data) => {
    dispatch({
      type: 'UPDATE_CHANNEL',
      payload: { id: editingChannel.id, updates: data },
    })
    setShowChannelModal(false)
    setEditingChannel(null)
  }

  const handleDeleteChannel = (channelId) => {
    if (window.confirm('Delete this channel? This cannot be undone.')) {
      dispatch({ type: 'DELETE_CHANNEL', payload: channelId })
      if (currentCh === channelId) setCurrentCh('general')
    }
  }

  const handleAddMember = (userId) => {
    dispatch({ type: 'ADD_MEMBER_TO_CHANNEL', payload: { channelId: managingChannel.id, userId } })
    setManagingChannel(prev => ({
      ...prev,
      members: [...(Array.isArray(prev.members) ? prev.members : []), userId],
    }))
  }

  const handleRemoveMember = (userId) => {
    dispatch({ type: 'REMOVE_MEMBER_FROM_CHANNEL', payload: { channelId: managingChannel.id, userId } })
    setManagingChannel(prev => ({
      ...prev,
      members: Array.isArray(prev.members) ? prev.members.filter(m => m !== userId) : prev.members,
    }))
  }

  // ── Sidebar sections ────────────────────────────────────────────
  const sidebarSections = [
    {
      id: 'agency',
      label: 'Agency',
      items: channels.filter(c => c.isDefault && c.type === 'channel'),
    },
    {
      id: 'teams',
      label: 'Teams',
      items: channels.filter(c => c.isDefault && c.type === 'group'),
    },
    {
      id: 'custom',
      label: 'My Channels',
      items: channels.filter(c => !c.isDefault),
    },
  ].filter(s => s.items.length > 0 || s.id === 'agency')

  const toolBtns = [
    { id: 'deal', icon: '💰', label: 'Log deal', action: () => { setShowDealForm(true); setShowAnnForm(false) } },
    ...(canAnnounce ? [{ id: 'ann', icon: '📢', label: 'Announce', action: () => { setShowAnnForm(true); setShowDealForm(false) } }] : []),
    { id: 'mention', icon: '@', label: 'Mention', action: () => setInput(i => i + '@') },
  ]

  const currentName = currentChannelData?.name || currentDMData?.name || ''
  const currentIcon = currentChannelData?.icon || (currentDMData ? '💬' : '#')
  const currentDesc = currentChannelData?.desc || (currentDMData ? 'Direct message' : '')

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div style={{ width: showSidebar ? 220 : 0, opacity: showSidebar ? 1 : 0, transition: 'width .3s ease, opacity .25s ease', overflow: 'hidden', flexShrink: 0, zIndex: 10 }}>
        <div style={{ width: 220, height: '100%', background: 'linear-gradient(180deg,#071428 0%,#040d1a 100%)', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* User profile */}
          <div style={{ padding: '14px 12px 12px', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#c8a84a', boxShadow: '0 0 0 2px #c8a84a, 0 0 0 4px rgba(4,13,26,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#040d1a', flexShrink: 0 }}>YN</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1 }}>You (Owner)</div>
                <div style={{ fontSize: 9, color: '#c8a84a', marginTop: 3 }}>Elite · Owner · Tier 3</div>
              </div>
            </div>
          </div>

          {/* Channel list */}
          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 4, paddingBottom: 8 }} className="scrollbar-none">

            {/* New Channel button */}
            {isOwner && (
              <button
                onClick={() => { setEditingChannel(null); setShowChannelModal(true) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', border: 'none', background: 'transparent',
                  color: 'rgba(200,168,74,0.55)', transition: 'color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8c87a'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,74,0.55)'}
              >
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(200,168,74,0.1)', border: '1px solid rgba(200,168,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#e8c87a', flexShrink: 0 }}>+</div>
                <span style={{ fontSize: 11, fontWeight: 700 }}>New Channel</span>
              </button>
            )}

            {sidebarSections.map(sec => (
              <div key={sec.id}>
                <div style={{ padding: '6px 14px 3px', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  {sec.label}
                </div>
                {sec.items.map(ch => (
                  <div
                    key={ch.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHovCh(ch.id)}
                    onMouseLeave={() => setHovCh(null)}
                  >
                    {/* Channel row */}
                    <button
                      onClick={() => setCurrentCh(ch.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 12px', textAlign: 'left',
                        background: currentCh === ch.id ? 'rgba(26,107,191,.13)' : hovCh === ch.id ? 'rgba(255,255,255,.04)' : 'transparent',
                        borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                        borderLeft: `2px solid ${currentCh === ch.id ? '#c8a84a' : 'transparent'}`,
                        transition: 'background .15s, border-color .15s',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {hovCh === ch.id && currentCh !== ch.id && (
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(200,168,74,.04) 0%,transparent 60%)', pointerEvents: 'none' }} />
                      )}
                      <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0, color: currentCh === ch.id ? '#e8c870' : 'rgba(255,255,255,.38)' }}>
                        {ch.icon}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: currentCh === ch.id ? 700 : 500, color: currentCh === ch.id ? '#fff' : 'rgba(255,255,255,.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                        {ch.name}
                      </span>
                    </button>

                    {/* Three-dot menu button */}
                    {isOwner && hovCh === ch.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setChannelMenuOpen(channelMenuOpen === ch.id ? null : ch.id) }}
                        style={{
                          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                          width: 20, height: 20, borderRadius: 4,
                          background: 'rgba(255,255,255,0.08)', border: 'none',
                          color: 'rgba(255,255,255,0.55)', fontSize: 12,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          zIndex: 5,
                        }}
                      >
                        ⋯
                      </button>
                    )}

                    {/* Context menu */}
                    {channelMenuOpen === ch.id && (
                      <ChannelContextMenu
                        channel={ch}
                        onClose={() => setChannelMenuOpen(null)}
                        onEdit={() => { setEditingChannel(ch); setShowChannelModal(true); setChannelMenuOpen(null) }}
                        onMembers={() => { setManagingChannel(ch); setShowMembersModal(true); setChannelMenuOpen(null) }}
                        onDelete={() => { handleDeleteChannel(ch.id); setChannelMenuOpen(null) }}
                      />
                    )}
                  </div>
                ))}
                <div style={{ height: 1, background: 'rgba(255,255,255,.05)', margin: '5px 14px' }} />
              </div>
            ))}

            {/* Direct Messages */}
            <div>
              <div style={{ padding: '6px 14px 3px', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Direct
              </div>
              {dms.map(dm => {
                const active = currentCh === dm.id
                const hov = hovCh === dm.id
                return (
                  <button
                    key={dm.id}
                    onClick={() => { setCurrentCh(dm.id); setShowSidebar(false) }}
                    onMouseEnter={() => setHovCh(dm.id)}
                    onMouseLeave={() => setHovCh(null)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px',
                      background: active ? 'rgba(26,107,191,.13)' : hov ? 'rgba(255,255,255,.04)' : 'transparent',
                      borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                      borderLeft: `2px solid ${active ? '#c8a84a' : 'transparent'}`,
                      transition: 'background .15s, border-color .15s',
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: dm.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900, color: '#fff' }}>
                        {dm.initials.slice(0, 1)}
                      </div>
                      {dm.online && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 7, height: 7, borderRadius: '50%', background: '#22c55e', border: '1.5px solid #040d1a' }} />}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: active ? '#fff' : 'rgba(255,255,255,.5)' }}>{dm.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Online count */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.22)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
              34 members online
            </div>
          </div>
        </div>
      </div>

      {/* ── Toggle pill ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, zIndex: 20 }}>
        <button
          onClick={() => setShowSidebar(s => !s)}
          style={{
            width: 16, height: 48,
            borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            borderTopRightRadius: 8, borderBottomRightRadius: 8,
            background: showSidebar ? 'rgba(26,107,191,.7)' : 'rgba(200,168,74,.85)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 10, lineHeight: 1,
            transition: 'background .3s ease',
            animation: showSidebar ? 'none' : 'toggleGlow 2s ease-in-out infinite',
            flexShrink: 0,
          }}
        >
          <span style={{ transform: showSidebar ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .3s ease', display: 'block', lineHeight: 1 }}>›</span>
        </button>
      </div>

      {/* ── Main chat area ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Chat header */}
        <div style={{ background: 'linear-gradient(135deg,rgba(10,39,68,.97),rgba(7,20,40,.99))', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,rgba(26,107,191,.28),rgba(26,107,191,.1))', border: '1px solid rgba(26,107,191,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            {currentIcon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{currentName}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.38)', marginTop: 2 }}>{currentDesc}</div>
          </div>

          {/* Manage members button for group chats */}
          {isOwner && currentChannelData?.type === 'group' && (
            <button
              onClick={() => { setManagingChannel(currentChannelData); setShowMembersModal(true) }}
              title="Manage members"
              style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(200,168,74,0.1)', border: '1px solid rgba(200,168,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8c87a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>
          )}

          <button style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', color: 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🔍</button>
          {channelAction && (
            <button
              onClick={() => channelAction === 'Announce' ? setShowAnnForm(a => !a) : setShowDealForm(d => !d)}
              style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#c8a84a,#e8c870)', color: '#071428', fontWeight: 700, fontSize: 10, border: 'none', flexShrink: 0 }}
            >
              {channelAction}
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }} className="scrollbar-none">
          {msgs.map((msg, i) => (
            <MessageGroup key={i} msg={msg} idx={i} channel={currentCh} />
          ))}
          {msgs.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: .2 }}>💬</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.28)', margin: 0 }}>No messages yet — be the first to post.</p>
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Deal form */}
        {showDealForm && (
          <div style={{ background: 'linear-gradient(180deg,rgba(7,20,40,.98),rgba(4,13,26,.99))', borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Log a closed deal</span>
              <button onClick={() => setShowDealForm(false)} style={{ color: 'rgba(255,255,255,.3)', fontSize: 14, background: 'none', border: 'none' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Amount ($)</label>
                <input type="number" value={dfAmt} onChange={e => setDfAmt(e.target.value)} placeholder="8500" className="input-dark" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Industry</label>
                <select value={dfInd} onChange={e => setDfInd(e.target.value)} className="input-dark" style={{ width: '100%', boxSizing: 'border-box' }}>
                  {['Solar', 'Life Insurance', 'Real Estate', 'Door-to-Door', 'Car Sales', 'B2B / SaaS'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Client type</label>
                <input value={dfClient} onChange={e => setDfClient(e.target.value)} placeholder="homeowner, SMB..." className="input-dark" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Time to close</label>
                <input value={dfTime} onChange={e => setDfTime(e.target.value)} placeholder="same day, 2 calls..." className="input-dark" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>How you closed it</label>
              <input value={dfNote} onChange={e => setDfNote(e.target.value)} placeholder="Used Cardone's urgency frame..." className="input-dark" style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <button onClick={postDeal} style={{ width: '100%', padding: '9px', background: '#1a6bbf', color: '#fff', fontWeight: 700, borderRadius: 10, border: 'none', fontSize: 12 }}>
              Post deal to board
            </button>
          </div>
        )}

        {/* Announce form */}
        {showAnnForm && (
          <div style={{ background: 'linear-gradient(180deg,rgba(7,20,40,.97),rgba(4,13,26,.99))', borderTop: '1px solid rgba(200,168,74,.15)', padding: '12px 14px', flexShrink: 0 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: '#e8c870', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>📢 Post announcement to all members</div>
            <textarea value={annText} onChange={e => setAnnText(e.target.value)} rows={2} placeholder="Type your announcement..."
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(200,168,74,.2)', borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: 12, resize: 'none', outline: 'none', caretColor: '#c8a84a', marginBottom: 8 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,.28)' }}>Pinned · visible to all members</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAnnForm(false)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: 'rgba(255,255,255,.4)', fontSize: 11 }}>Cancel</button>
                <button onClick={postAnn} className="btn-gold" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 10, fontWeight: 700, border: 'none' }}>Post to all</button>
              </div>
            </div>
          </div>
        )}

        {/* Compose */}
        {!showDealForm && !showAnnForm && (
          <div style={{ background: 'linear-gradient(180deg,rgba(7,20,40,.96),rgba(4,13,26,.99))', borderTop: '1px solid rgba(255,255,255,.07)', padding: '10px 14px 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {toolBtns.map(btn => (
                <button key={btn.id} onClick={btn.action}
                  onMouseEnter={() => setToolHov(btn.id)}
                  onMouseLeave={() => setToolHov(null)}
                  style={{
                    fontSize: 9, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                    border: `1px solid ${toolHov === btn.id ? 'rgba(200,168,74,.45)' : 'rgba(255,255,255,.12)'}`,
                    background: toolHov === btn.id ? 'rgba(200,168,74,.1)' : 'rgba(255,255,255,.04)',
                    color: toolHov === btn.id ? '#e8c870' : 'rgba(255,255,255,.45)',
                    transition: 'all .15s ease', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
                placeholder={`Message ${currentName}...`}
                rows={1}
                style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: input ? '1px solid rgba(200,168,74,.38)' : '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '8px 12px', color: '#fff', fontSize: 12, resize: 'none', minHeight: 36, maxHeight: 72, outline: 'none', caretColor: '#c8a84a', transition: 'border-color .2s ease', boxSizing: 'border-box' }}
              />
              <button onClick={sendMsg} disabled={!input.trim()}
                style={{ padding: '8px 14px', borderRadius: 12, background: input.trim() ? 'linear-gradient(135deg,#c8a84a,#e8c870)' : 'rgba(255,255,255,.07)', color: input.trim() ? '#071428' : 'rgba(255,255,255,.22)', fontWeight: 700, fontSize: 11, border: 'none', flexShrink: 0, transition: 'all .2s ease' }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      {showChannelModal && (
        <ChannelModal
          mode={editingChannel ? 'edit' : 'create'}
          channel={editingChannel}
          members={ALL_TEAM_MEMBERS}
          onSave={editingChannel ? handleEditChannel : handleCreateChannel}
          onClose={() => { setShowChannelModal(false); setEditingChannel(null) }}
        />
      )}

      {showMembersModal && managingChannel && (
        <ManageMembersModal
          channel={managingChannel}
          allMembers={ALL_TEAM_MEMBERS}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onClose={() => { setShowMembersModal(false); setManagingChannel(null) }}
        />
      )}
    </div>
  )
}
