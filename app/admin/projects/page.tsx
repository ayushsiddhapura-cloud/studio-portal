'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { IconKanban, IconList, IconPlus, IconSearch, IconCalendar, IconRevision } from '@/lib/icons'
import { Sidebar } from '@/lib/sidebar'

const COLUMNS = [
  { key: 'In Progress', label: 'In progress', color: '#3b82f6' },
  { key: 'Review',      label: 'In review',   color: '#f59e0b' },
  { key: 'Revision',    label: 'Revision',    color: '#ef4444' },
  { key: 'Completed',   label: 'Delivered',   color: '#22c55e' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [revisions, setRevisions] = useState<any[]>([])
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
    const { data: r } = await supabase.from('revisions').select('project_id')
    if (p) setProjects(p)
    if (c) setClients(c)
    if (r) setRevisions(r)
    setLoading(false)
  }

  async function addProject() {
    if (!form.title || !form.client_id) return alert('Please fill in client and project title')
    await supabase.from('projects').insert([{ ...form, amount: parseFloat(form.amount) || 0 }])
    setForm({ client_id: '', title: '', status: 'In Progress', deadline: '', amount: '', payment_status: 'Pending', invoice_pdf_url: '' })
    setShowForm(false)
    fetchAll()
  }

  function revCount(pid: string) { return revisions.filter((r: any) => r.project_id === pid).length }
  function isOverdue(d: string) { return d && new Date(d) < new Date() }
  function fmtDeadline(d: string) {
    if (!d) return null
    const dt = new Date(d)
    return `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()}`
  }
  function initials(name: string) { return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?' }
  const avatarPalette = [
    { bg: '#1e3a5f', color: '#60a5fa' }, { bg: '#14532d', color: '#4ade80' },
    { bg: '#4a1942', color: '#e879f9' }, { bg: '#3b2f00', color: '#fbbf24' },
    { bg: '#2e1a5e', color: '#a78bfa' }, { bg: '#3b1a00', color: '#fb923c' },
  ]
  function av(name: string) { return avatarPalette[(name?.charCodeAt(0) || 0) % avatarPalette.length] }

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.clients?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true
      : filter === 'Overdue' ? (isOverdue(p.deadline) && p.status !== 'Completed')
      : true
    return matchSearch && matchFilter
  })

  const activeCount = projects.filter(p => p.status !== 'Completed').length

  const inp: any = {
    background: 'var(--bg-input)', border: '1px solid var(--border-input)',
    borderRadius: '8px', padding: '10px 12px', color: 'var(--text)',
    fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none', width: '100%'
  }
  const lbl: any = { fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div className='mobile-topbar-pad' style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Projects</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 9px', borderRadius: '20px' }}>{activeCount} active</span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px', gap: '3px' }}>
              {(['kanban', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: view === v ? 'var(--bg-surface)' : 'transparent',
                  color: view === v ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: view === v ? 600 : 400,
                  boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.15)' : 'none'
                }}>
                  {v === 'kanban' ? <IconKanban size={14} /> : <IconList size={14} />}
                  {v === 'kanban' ? 'Kanban' : 'List'}
                </button>
              ))}
            </div>

            <button onClick={() => setShowForm(true)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: 'var(--bg-hover)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text)', padding: '8px 16px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}>
              <IconPlus size={14} /> New project
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ padding: '12px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <IconSearch size={15} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder='Search projects...'
              style={{ ...inp, paddingLeft: '36px' }} />
          </div>
          {['All', 'Overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: '20px', border: '1px solid',
              borderColor: filter === f ? 'var(--text-sec)' : 'var(--border)',
              background: filter === f ? 'var(--bg-hover)' : 'transparent',
              color: filter === f ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '13px', cursor: 'pointer', fontWeight: filter === f ? 600 : 400
            }}>{f}</button>
          ))}
        </div>

        {/* Board */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : view === 'kanban' ? (
            /* ── KANBAN ── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'start' }}>
              {COLUMNS.map(col => {
                const cards = filtered.filter(p => p.status === col.key)
                return (
                  <div key={col.key}>
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ height: '3px', background: col.color, borderRadius: '2px', marginBottom: '12px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{col.label}</span>
                        <span style={{ fontSize: '12px', background: 'var(--bg-hover)', color: 'var(--text-muted)', borderRadius: '20px', padding: '1px 8px', fontWeight: 600 }}>{cards.length}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {cards.length === 0 ? (
                        <div style={{ border: '1.5px dashed var(--border-card)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                          No projects
                        </div>
                      ) : cards.map(p => {
                        const clientName = p.clients?.name || '—'
                        const avStyle = av(clientName)
                        const overdue = isOverdue(p.deadline) && p.status !== 'Completed'
                        const revs = revCount(p.id)
                        const deadline = fmtDeadline(p.deadline)
                        return (
                          <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                            <div
                              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-input)')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-card)')}
                            >
                              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.35 }}>{p.title}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, flexShrink: 0 }}>
                                  {initials(clientName)}
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-sec)' }}>
                                  {clientName.split(' ')[0]} {clientName.split(' ')[1]?.[0] ? clientName.split(' ')[1][0] + '.' : ''}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  {deadline && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: overdue ? '#ef4444' : 'var(--text-muted)' }}>
                                      <IconCalendar size={12} /> {deadline}
                                    </span>
                                  )}
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <IconRevision size={12} /> {revs}/3
                                  </span>
                                </div>
                                {overdue && (
                                  <span style={{ fontSize: '11px', background: '#3b1f1f', color: '#f87171', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Overdue</span>
                                )}
                                {col.key === 'Completed' && (
                                  <span style={{ fontSize: '11px', background: '#14532d', color: '#4ade80', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Done</span>
                                )}
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
            /* ── LIST ── */
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 120px 100px 120px 110px', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                {['Project', 'Client', 'Deadline', 'Revisions', 'Status', 'Payment'].map(h => (
                  <div key={h} style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</div>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No projects found.</div>
              ) : filtered.map(p => {
                const clientName = p.clients?.name || '—'
                const avStyle = av(clientName)
                const overdue = isOverdue(p.deadline) && p.status !== 'Completed'
                const statusColors: any = {
                  'In Progress': { bg: '#1e3a5f', color: '#60a5fa' },
                  'Review':      { bg: '#3b2f00', color: '#fbbf24' },
                  'Completed':   { bg: '#14532d', color: '#4ade80' },
                  'Revision':    { bg: '#3b1f1f', color: '#f87171' },
                }
                const sc = statusColors[p.status] || { bg: 'var(--bg-input)', color: 'var(--text-muted)' }
                return (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 120px 100px 120px 110px', gap: '12px', padding: '14px 20px', borderBottom: '1px solid var(--border-card)', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, flexShrink: 0 }}>
                          {initials(clientName)}
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clientName.split(' ')[0]}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: overdue ? '#ef4444' : 'var(--text-sec)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <IconCalendar size={12} /> {fmtDeadline(p.deadline) || '—'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-sec)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <IconRevision size={12} /> {revCount(p.id)} / 3
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, background: sc.bg, color: sc.color }}>{p.status}</span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600,
                          background: p.payment_status === 'Paid' ? '#14532d' : overdue ? '#3b1f1f' : '#3b2f00',
                          color: p.payment_status === 'Paid' ? '#4ade80' : overdue ? '#f87171' : '#fbbf24'
                        }}>{overdue && p.payment_status !== 'Paid' ? 'Overdue' : p.payment_status}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '480px', background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            borderRadius: '16px', padding: '28px', zIndex: 50
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>New project</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>CLIENT</label>
                <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} style={inp}>
                  <option value=''>Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>PROJECT TITLE</label>
                <input placeholder='e.g. YouTube Video Edit – June' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={lbl}>STATUS</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                  {['In Progress', 'Review', 'Revision', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>DEADLINE</label>
                <input type='date' value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={lbl}>AMOUNT (₹)</label>
                <input placeholder='5000' value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={lbl}>PAYMENT STATUS</label>
                <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })} style={inp}>
                  {['Pending', 'Paid', 'Partial'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={addProject} style={{ flex: 1, background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Save project</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-input)', borderRadius: '10px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
