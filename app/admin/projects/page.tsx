'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '📊' },
  { label: 'Clients', href: '/admin/clients', icon: '👥' },
  { label: 'Projects', href: '/admin/projects', icon: '🎬' },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾' },
  { label: 'Files', href: '/admin/files', icon: '📁' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

const columns = [
  { key: 'In Progress', label: 'In progress', color: '#3b82f6' },
  { key: 'Review', label: 'In review', color: '#f59e0b' },
  { key: 'Revision', label: 'Revision', color: '#ef4444' },
  { key: 'Completed', label: 'Delivered', color: '#22c55e' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    client_id: '', title: '', status: 'In Progress',
    deadline: '', amount: '', payment_status: 'Pending', invoice_pdf_url: ''
  })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: p } = await supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false })
    const { data: c } = await supabase.from('clients').select('id, name')
    if (p) setProjects(p)
    if (c) setClients(c)
    setLoading(false)
  }

  async function addProject() {
    if (!form.title || !form.client_id) return alert('Please fill in client and project title')
    const { error } = await supabase.from('projects').insert([{ ...form, amount: parseFloat(form.amount) || 0 }])
    if (!error) {
      setForm({ client_id: '', title: '', status: 'In Progress', deadline: '', amount: '', payment_status: 'Pending', invoice_pdf_url: '' })
      setShowForm(false)
      fetchAll()
    } else alert('Error: ' + error.message)
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchAll()
  }

  function initials(name: string) { return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?' }
  const avatarPalette = [
    { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#dcfce7', color: '#15803d' },
    { bg: '#fce7f3', color: '#be185d' }, { bg: '#fef3c7', color: '#b45309' },
    { bg: '#ede9fe', color: '#6d28d9' }, { bg: '#ffedd5', color: '#c2410c' },
  ]
  function av(name: string) { return avatarPalette[(name?.charCodeAt(0) || 0) % avatarPalette.length] }

  function isOverdue(deadline: string) {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  function formatDeadline(deadline: string) {
    if (!deadline) return null
    const d = new Date(deadline)
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.clients?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Overdue' ? isOverdue(p.deadline) : true
    return matchSearch && matchFilter
  })

  const inp: any = { width: '100%', background: '#2a2a2a', border: '1px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }
  const lbl: any = { fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '200px', background: '#161616', borderRight: '1px solid #222', padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', paddingLeft: '6px' }}>
          <div style={{ width: '28px', height: '28px', background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎬</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Studio Portal</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Admin panel</div>
          </div>
        </div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
            borderRadius: '8px', textDecoration: 'none',
            color: item.href === '/admin/projects' ? '#fff' : '#666',
            background: item.href === '/admin/projects' ? '#222' : 'transparent', fontSize: '14px'
          }}>{item.icon} {item.label}</Link>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ background: '#161616', borderBottom: '1px solid #222', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Projects</h1>
          <span style={{ fontSize: '12px', color: '#555', background: '#222', padding: '2px 8px', borderRadius: '20px' }}>
            {projects.filter(p => p.status !== 'Completed').length} active
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            {['kanban', 'list'].map(v => (
              <button key={v} onClick={() => setView(v as any)} style={{
                background: view === v ? '#2a2a2a' : 'transparent',
                border: '1px solid #333', borderRadius: '8px',
                color: view === v ? '#fff' : '#666', padding: '8px 16px',
                fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>⊞ {v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
            <button onClick={() => setShowForm(true)} style={{
              background: '#fff', color: '#000', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>⊞ New project</button>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search projects...'
              style={{ ...inp, paddingLeft: '34px', background: '#1a1a1a', border: '1px solid #222' }} />
          </div>
          {['All', 'Mine', 'Overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#2a2a2a' : 'transparent',
              border: '1px solid', borderColor: filter === f ? '#444' : '#222',
              borderRadius: '20px', color: filter === f ? '#fff' : '#555',
              padding: '6px 14px', fontSize: '13px', cursor: 'pointer'
            }}>{f}</button>
          ))}
          <button style={{
            marginLeft: 'auto', background: '#1a1a1a', border: '1px solid #333',
            borderRadius: '8px', color: '#aaa', padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>⊞ Client</button>
        </div>

        {/* Kanban / List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? <p style={{ color: '#555' }}>Loading...</p> : view === 'kanban' ? (

            /* KANBAN */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'start' }}>
              {columns.map(col => {
                const colProjects = filtered.filter(p => p.status === col.key)
                return (
                  <div key={col.key}>
                    {/* Column header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '10px', borderBottom: `2px solid ${col.color}` }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{col.label}</span>
                      <span style={{ fontSize: '12px', background: '#222', color: '#666', padding: '2px 8px', borderRadius: '20px' }}>{colProjects.length}</span>
                    </div>
                    {/* Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {colProjects.map(p => {
                        const overdue = isOverdue(p.deadline)
                        const clientName = p.clients?.name || '—'
                        const avStyle = av(clientName)
                        return (
                          <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = '#444')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '10px', lineHeight: 1.3 }}>{p.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                                  {initials(clientName)}
                                </div>
                                <span style={{ fontSize: '13px', color: '#888' }}>{clientName.split(' ')[0]} {clientName.split(' ')[1]?.[0] ? clientName.split(' ')[1][0] + '.' : ''}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {p.deadline && (
                                    <span style={{ fontSize: '12px', color: overdue ? '#ef4444' : '#666', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      ⊞ {formatDeadline(p.deadline)}
                                    </span>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {overdue && col.key === 'Completed' && (
                                    <span style={{ fontSize: '11px', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Overdue</span>
                                  )}
                                  <span style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '3px' }}>⊞ 0/2</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

          ) : (

            /* LIST VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map(p => {
                const overdue = isOverdue(p.deadline)
                const clientName = p.clients?.name || '—'
                const avStyle = av(clientName)
                return (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#444')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                      <div style={{ flex: 1, fontWeight: 600, fontSize: '14px', color: '#fff' }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{initials(clientName)}</div>
                        <span style={{ fontSize: '13px', color: '#888' }}>{clientName}</span>
                      </div>
                      {p.deadline && <span style={{ fontSize: '12px', color: overdue ? '#ef4444' : '#666' }}>⊞ {formatDeadline(p.deadline)}</span>}
                      <span style={{
                        fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500,
                        background: p.status === 'Completed' ? '#14532d' : p.status === 'Review' ? '#3b2f00' : p.status === 'Revision' ? '#3b1f1f' : '#1e3a5f',
                        color: p.status === 'Completed' ? '#4ade80' : p.status === 'Review' ? '#fbbf24' : p.status === 'Revision' ? '#f87171' : '#60a5fa'
                      }}>{p.status}</span>
                      <span style={{ fontSize: '13px', color: '#555' }}>₹{Number(p.amount).toLocaleString()}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Project Panel */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '360px', background: '#161616', borderLeft: '1px solid #222', zIndex: 50, padding: '28px 24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>New project</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lbl}>Client *</label>
                <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} style={{ ...inp }}>
                  <option value=''>Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Project title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder='e.g. Wedding highlight reel' style={inp} />
              </div>
              <div>
                <label style={lbl}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inp }}>
                  {['In Progress', 'Review', 'Revision', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Deadline</label>
                <input type='date' value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={lbl}>Amount (₹)</label>
                <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder='5000' style={inp} />
              </div>
              <div>
                <label style={lbl}>Payment status</label>
                <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })} style={{ ...inp }}>
                  {['Pending', 'Paid', 'Partial'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Invoice PDF URL (optional)</label>
                <input value={form.invoice_pdf_url} onChange={e => setForm({ ...form, invoice_pdf_url: e.target.value })} placeholder='https://drive.google.com/...' style={inp} />
                <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>💡 Google Drive or Canva share link</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button onClick={addProject} style={{ flex: 1, background: '#fff', color: '#000', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Create project
                </button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}