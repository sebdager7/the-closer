import React from 'react'

export default function ManageMembersModal({ channel, allMembers, onAddMember, onRemoveMember, onClose }) {
  const currentMembers = Array.isArray(channel.members) ? channel.members : []
  const available = allMembers.filter(m => !currentMembers.includes(m.id))

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
          width: '100%', maxWidth: 360, borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(180deg,#0d2040 0%,#071428 100%)',
          border: '1px solid rgba(200,168,74,0.25)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(200,168,74,0.12)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Manage Members</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {channel.icon} {channel.name}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Current members */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(200,168,74,0.6)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              Current Members ({currentMembers.length})
            </div>
            {currentMembers.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '12px 0' }}>
                No members yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentMembers.map(memberId => {
                  const m = allMembers.find(x => x.id === memberId)
                  if (!m) return null
                  return (
                    <div key={memberId}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: m.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                        {m.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{m.role}</div>
                      </div>
                      <button
                        onClick={() => onRemoveMember(memberId)}
                        style={{
                          fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.2)',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Add members */}
          {available.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                Add Members
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {available.map(m => (
                  <button
                    key={m.id}
                    onClick={() => onAddMember(m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 12, textAlign: 'left',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(200,168,74,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(200,168,74,0.2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: m.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                      {m.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{m.role}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(200,168,74,0.1)', color: '#e8c87a', border: '1px solid rgba(200,168,74,0.2)', flexShrink: 0 }}>
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {available.length === 0 && currentMembers.length > 0 && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '8px 0' }}>
              All team members are already in this group.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
