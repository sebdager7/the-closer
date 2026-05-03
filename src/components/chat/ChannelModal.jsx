import React, { useState } from 'react'

const EMOJI_OPTIONS = [
  '#', '📢', '💰', '🎯', '⚡', '🔥', '💪', '🏆',
  '🚀', '💡', '📊', '🎮', '🤝', '💎', '🌟', '⭐',
  '📱', '💬', '🔔', '📝', '🎪', '🏅', '🎁', '🔑',
  '🌊', '⚔️', '🛡️', '🎵', '🎨', '🔮', '🦁', '🐯',
  '🦊', '🦅', '💥', '✨', '🌈', '🎯', '🔑', '🏋️',
]

export default function ChannelModal({ mode, channel, members, onSave, onClose }) {
  const isEdit = mode === 'edit'

  const [name, setName] = useState(isEdit ? channel?.name || '' : '')
  const [icon, setIcon] = useState(isEdit ? channel?.icon || '#' : '#')
  const [desc, setDesc] = useState(isEdit ? channel?.desc || '' : '')
  const [type, setType] = useState(isEdit ? channel?.type || 'channel' : 'channel')
  const [selectedMembers, setSelectedMembers] = useState(
    isEdit && Array.isArray(channel?.members) ? channel.members : []
  )
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [customEmoji, setCustomEmoji] = useState('')

  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      icon: customEmoji || icon,
      desc: desc.trim() || `${customEmoji || icon} ${name.trim()}`,
      type,
      members: type === 'group' ? selectedMembers : 'all',
      canAnnounce: type === 'channel',
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: 16, background: 'rgba(0,0,0,0.78)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 360,
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(180deg,#0d2040 0%,#071428 100%)',
          border: '1px solid rgba(200,168,74,0.25)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(200,168,74,0.12)',
          background: 'rgba(200,168,74,0.04)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {isEdit ? 'Edit Channel' : 'Create New Channel'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(200,168,74,0.6)', marginTop: 2 }}>
              Owner access only
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Icon + Name row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            {/* Icon picker */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setShowEmojiPicker(p => !p)}
                style={{
                  width: 48, height: 48, borderRadius: 12, fontSize: 22,
                  background: 'rgba(200,168,74,0.08)',
                  border: `1px solid ${showEmojiPicker ? 'rgba(200,168,74,0.5)' : 'rgba(200,168,74,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color .15s',
                }}
              >
                {customEmoji || icon}
              </button>

              {showEmojiPicker && (
                <div style={{
                  position: 'absolute', top: 54, left: 0, zIndex: 20,
                  background: '#071428', border: '1px solid rgba(200,168,74,0.2)',
                  borderRadius: 12, padding: 10, width: 220,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}>
                  <input
                    type="text"
                    placeholder="Type your own emoji..."
                    value={customEmoji}
                    onChange={e => setCustomEmoji(e.target.value.slice(0, 2))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'transparent', border: '1px solid rgba(200,168,74,0.2)',
                      borderRadius: 8, padding: '4px 8px', fontSize: 11,
                      color: '#fff', outline: 'none', caretColor: '#e8c87a', marginBottom: 8,
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 3 }}>
                    {EMOJI_OPTIONS.map((e, i) => (
                      <button key={i} onClick={() => { setIcon(e); setCustomEmoji(''); setShowEmojiPicker(false) }}
                        style={{
                          width: 24, height: 24, fontSize: 14, background: 'none', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 4, transition: 'transform .1s',
                        }}
                        onMouseEnter={e2 => e2.currentTarget.style.transform = 'scale(1.3)'}
                        onMouseLeave={e2 => e2.currentTarget.style.transform = 'scale(1)'}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Name input */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(200,168,74,0.6)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5 }}>
                Channel Name
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Top Performers"
                maxLength={30}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(200,168,74,0.2)',
                  borderRadius: 10, padding: '9px 12px',
                  color: '#fff', fontSize: 13, outline: 'none',
                  caretColor: '#e8c87a', transition: 'border-color .15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,168,74,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(200,168,74,0.2)'}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5 }}>
              Description (optional)
            </div>
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What is this channel for?"
              maxLength={60}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '9px 12px',
                color: '#fff', fontSize: 12, outline: 'none', caretColor: '#e8c87a',
              }}
            />
          </div>

          {/* Type selector */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'channel', icon: '#', label: 'Public Channel', desc: 'All members can see' },
                { id: 'group',   icon: '👥', label: 'Group Chat',    desc: 'Specific members only' },
              ].map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  style={{
                    textAlign: 'left', padding: 12, borderRadius: 12,
                    background: type === t.id ? 'rgba(200,168,74,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${type === t.id ? 'rgba(200,168,74,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all .15s',
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: type === t.id ? '#e8c87a' : 'rgba(255,255,255,0.7)' }}>{t.label}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Members — group only */}
          {type === 'group' && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                Add Members{' '}
                <span style={{ color: 'rgba(200,168,74,0.6)' }}>({selectedMembers.length} selected)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 176, overflowY: 'auto' }}>
                {members.map(m => {
                  const sel = selectedMembers.includes(m.id)
                  return (
                    <button key={m.id} onClick={() => toggleMember(m.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 12, textAlign: 'left',
                        background: sel ? 'rgba(200,168,74,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${sel ? 'rgba(200,168,74,0.35)' : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all .15s',
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: m.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                        {m.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#e8c87a' : '#fff' }}>{m.name}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{m.role}</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: sel ? 'linear-gradient(135deg,#c8a84a,#e8c870)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${sel ? '#c8a84a' : 'rgba(255,255,255,0.12)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .15s',
                      }}>
                        {sel && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '12px', borderRadius: 12, border: 'none',
              fontSize: 13, fontWeight: 700,
              background: name.trim() ? 'linear-gradient(135deg,#c8a84a,#e8c870)' : 'rgba(255,255,255,0.08)',
              color: name.trim() ? '#0a1628' : 'rgba(255,255,255,0.3)',
              boxShadow: name.trim() ? '0 4px 16px rgba(200,168,74,0.35)' : 'none',
              transition: 'all .2s', opacity: name.trim() ? 1 : 0.5,
            }}
          >
            {isEdit ? 'Save Changes' : 'Create Channel'}
          </button>
        </div>
      </div>
    </div>
  )
}
