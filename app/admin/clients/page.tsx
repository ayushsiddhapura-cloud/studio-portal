'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: false },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: true },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: false },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: false },
  { label: 'Files', href: '/admin/files', icon: '📁', active: false },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
]

const clients = [
  {
    id: 1,
    name: 'Rahul Kapoor',
    company: 'Kapoor Enterprises',
    email: 'rahul@kapoor.com',
    phone: '+91 98765 43210',
    initials: 'RK',
    avatarBg: '#E6F1FB',
    avatarColor: '#185FA5',
    projects: 4,
    billed: '₹72,000',
    pending: '₹18,000',
    status: 'active',
    activeSince: 'May 2026',
    token: 'rahul-abc123xyz',
  },
  {
    id: 2,
    name: 'Sneha Patel',
    company: 'Wedding Films Co.',
    email: 'sneha@weddingfilms.com',
    phone: '+91 87654 32109',
    initials: 'SP',
    avatarBg: '#EAF3DE',
    avatarColor: '#3B6D11',
    projects: 2,
    billed: '₹45,000',
    pending: '₹0',
    status: 'paid',
    activeSince: 'Apr 2026',
    token: 'sneha-def456uvw',
  },
  {
    id: 3,
    name: 'Aryan Mehta',
    company: 'Mehta Digital',
    email: 'aryan@mehtadigital.com',
    phone: '+91 76543 21098',
    initials: 'AM',
    avatarBg: '#FAEEDA',
    avatarColor: '#854F0B',
    projects: 3,
    billed: '₹58,000',
    pending: '₹0',
    status: 'active',
    activeSince: 'Mar 2026',
    token: 'aryan-ghi789rst',
  },
  {
    id: 4,
    name: 'Priya Desai',
    company: 'PD Content Studio',
    email: 'priya@pdcontent.com',
    phone: '+91 65432 10987',
    initials: 'PD',
    avatarBg: '#FBEAF0',
    avatarColor: '#993556',
    projects: 6,
    billed: '₹1,10,000',
    pending: '₹12,500',
    status: 'overdue',
    activeSince: 'Jan 2026',
    token: 'priya-jkl012mno',
  },
]

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: '1 active', bg: '#E6F1FB', color: '#185FA5' },
  paid: { label: 'Paid up', bg: '#EAF3DE', color: '#3B6D11' },
  overdue: { label: 'Overdue', bg: '#FCEBEB', color: '#A32D2D' },
}

export default function ClientsPage() {
  const [showPanel, setShowPanel] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<number | null>(null)

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', notes: '', pin: false,
  })

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopy = (clientId: number, token: string) => {
    navigator.clipboard.writeText(`yourstudio.vercel.app/c/${token}`)
    setCopied(clientId)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f5f4f0',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Sidebar */}
      <div style={{
        width: '200px', flexShrink: 0,
        background: '#ffffff',
        borderRight: '0.5px solid #e5e3dc',
        padding: '20px 0',
        display: 'flex', flexDirection: 'column', gap: '2px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '0.5px solid #e5e3dc', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #639922, #4a7a19)',
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🎬</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Studio Portal</div>
              <div style={{ fontSize: '10px', color: '#999' }}>Admin panel</div>
            </div>
          </div>
        </div>
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 16px', fontSize: '13px', textDecoration: 'none',
            color: item.active ? '#1a1a1a' : '#666',
            background: item.active ? '#f5f4f0' : 'transparent',
            fontWeight: item.active ? '500' : '400',
          }}>
            <span style={{ fontSize: '15px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          margin: '0 12px', padding: '10px 12px',
          background: '#f5f4f0', borderRadius: '10px',
          fontSize: '11px', color: '#999',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>🔐</span> admin@studio.com
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          background: '#ffffff', borderBottom: '0.5px solid #e5e3dc',
          padding: '12px 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            Clients <span style={{ fontSize: '12px', color: '#999', fontWeight: '400', marginLeft: '6px' }}>12 total</span>
          </div>
          <button
            onClick={() => setShowPanel(true)}
            style={{
              background: '#1a1a1a', border: 'none',
              borderRadius: '8px', padding: '7px 14px',
              fontSize: '12px', color: '#fff', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: '500',
            }}>
            + Add client
          </button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1 }}>

          {/* Search */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '14px', color: '#999',
              }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                style={{
                  width: '100%', height: '34px',
                  border: '0.5px solid #ccc', borderRadius: '8px',
                  padding: '0 12px 0 32px', fontSize: '13px',
                  background: '#fff', color: '#1a1a1a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Client cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '10px',
          }}>
            {filtered.map((client) => (
              <div key={client.id} style={{
                background: '#ffffff',
                border: '0.5px solid #e5e3dc',
                borderRadius: '12px', padding: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#bbb')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e3dc')}
              >
                {/* Client header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: client.avatarBg, color: client.avatarColor,
                    fontSize: '13px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{client.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>{client.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>{client.company}</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    <strong style={{ color: '#1a1a1a', fontSize: '13px' }}>{client.projects}</strong> projects
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    <strong style={{ color: '#1a1a1a', fontSize: '13px' }}>{client.billed}</strong> billed
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    <strong style={{ color: client.pending === '₹0' ? '#3B6D11' : '#A32D2D', fontSize: '13px' }}>{client.pending}</strong> pending
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px', borderTop: '0.5px solid #e5e3dc',
                }}>
                  <span style={{
                    background: statusMap[client.status].bg,
                    color: statusMap[client.status].color,
                    fontSize: '11px', fontWeight: '500',
                    padding: '3px 8px', borderRadius: '20px',
                  }}>{statusMap[client.status].label}</span>

                  <button
                    onClick={() => handleCopy(client.id, client.token)}
                    style={{
                      background: 'none', border: 'none',
                      fontSize: '11px', color: '#999',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', gap: '4px',
                      fontFamily: 'inherit',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f4f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    {copied === client.id ? '✅ Copied!' : '🔗 Portal link'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add client panel */}
      {showPanel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }}
          onClick={() => setShowPanel(false)}
        >
          <div
            style={{
              background: '#ffffff', borderRadius: '16px',
              padding: '24px', width: '400px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Add new client</div>
              <button onClick={() => setShowPanel(false)} style={{
                background: 'none', border: 'none', fontSize: '18px',
                cursor: 'pointer', color: '#999', lineHeight: 1,
              }}>×</button>
            </div>

            {[
              { label: 'Full name', key: 'name', placeholder: 'e.g. Rahul Kapoor', type: 'text' },
              { label: 'Email address', key: 'email', placeholder: 'rahul@email.com', type: 'email' },
              { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210', type: 'text' },
              { label: 'Company (optional)', key: 'company', placeholder: 'Company name', type: 'text' },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: '14px' }}>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: '500',
                  color: '#666', marginBottom: '5px',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '9px 12px',
                    border: '0.5px solid #ddd', borderRadius: '8px',
                    fontSize: '13px', color: '#1a1a1a',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '500',
                color: '#666', marginBottom: '5px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Notes (admin only)</label>
              <textarea
                placeholder="Any private notes about this client..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px',
                  border: '0.5px solid #ddd', borderRadius: '8px',
                  fontSize: '13px', color: '#1a1a1a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', resize: 'none', height: '70px',
                }}
              />
            </div>

            <div style={{
              background: '#f5f4f0', borderRadius: '10px',
              padding: '12px', marginBottom: '14px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                🔒 Client portal access
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', lineHeight: '1.5' }}>
                A unique private link is auto-generated when you create the client.
              </div>
              <div style={{
                fontFamily: 'monospace', fontSize: '11px',
                color: '#555', background: '#ebe9e4',
                padding: '7px 10px', borderRadius: '6px',
              }}>
                yourstudio.vercel.app/c/<span style={{ color: '#1a1a1a' }}>auto-generated...</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <input
                type="checkbox"
                id="pin"
                checked={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              <label htmlFor="pin" style={{ fontSize: '12px', color: '#666', cursor: 'pointer' }}>
                Enable PIN protection for this client
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowPanel(false)}
                style={{
                  flex: 1, padding: '10px',
                  background: 'transparent', border: '0.5px solid #ddd',
                  borderRadius: '8px', fontSize: '13px',
                  color: '#666', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Cancel</button>
              <button
                onClick={() => {
                  alert(`Client "${form.name}" created! Portal link copied.`)
                  setShowPanel(false)
                  setForm({ name: '', email: '', phone: '', company: '', notes: '', pin: false })
                }}
                style={{
                  flex: 1, padding: '10px',
                  background: '#1a1a1a', border: 'none',
                  borderRadius: '8px', fontSize: '13px',
                  color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: '500',
                }}
              >Create client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}