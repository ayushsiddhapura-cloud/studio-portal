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

export default function InvoicesPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    client_id: '', project_id: '', amount: '',
    invoice_date: '', due_date: '', notes: ''
  })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: p } = await supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false })
    const { data: c } = await supabase.from('clients').select('id, name')
    if (p) setProjects(p)
    if (c) setClients(c)
    setLoading(false)
  }

  async function updatePayment(id: string, payment_status: string) {
    await supabase.from('projects').update({ payment_status }).eq('id', id)
    fetchAll()
  }

  async function createInvoice() {
    if (!form.client_id || !form.project_id) return alert('Please select a client and project')
    setSaving(true)
    await supabase.from('projects').update({
      amount: parseFloat(form.amount) || 0,
      deadline: form.due_date || null,
      payment_status: 'Pending',
    }).eq('id', form.project_id)
    setForm({ client_id: '', project_id: '', amount: '', invoice_date: '', due_date: '', notes: '' })
    setSaving(false)
    setShowModal(false)
    fetchAll()
  }

  const clientProjects = form.client_id ? projects.filter(p => p.client_id === form.client_id) : []

  function isOverdue(deadline: string) { return deadline && new Date(deadline) < new Date() }
  function formatDate(d: string) {
    if (!d) return '—'
    const date = new Date(d)
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  }
  function initials(name: string) { return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?' }
  const avatarPalette = [
    { bg: '#1e3a5f', color: '#60a5fa' }, { bg: '#14532d', color: '#4ade80' },
    { bg: '#4a1942', color: '#e879f9' }, { bg: '#3b2f00', color: '#fbbf24' },
    { bg: '#2e1a5e', color: '#a78bfa' }, { bg: '#3b1a00', color: '#fb923c' },
  ]
  function av(name: string) { return avatarPalette[(name?.charCodeAt(0) || 0) % avatarPalette.length] }

  const totalBilled = projects.reduce((s, p) => s + Number(p.amount || 0), 0)
  const collected = projects.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const pendingAmt = projects.filter(p => p.payment_status === 'Pending').reduce((s, p) => s + Number(p.amount || 0), 0)
  const overdueAmt = projects.filter(p => p.payment_status !== 'Paid' && isOverdue(p.deadline)).reduce((s, p) => s + Number(p.amount || 0), 0)

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.clients?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Unpaid' ? p.payment_status !== 'Paid' : filter === 'Overdue' ? (p.payment_status !== 'Paid' && isOverdue(p.deadline)) : p.payment_status === 'Paid'
    return matchSearch && matchFilter
  })

  const card: any = { background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }

  const modalInp: any = {
    width: '100%', background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '10px', padding: '13px 16px', color: '#111',
    fontSize: '15px', boxSizing: 'border-box', outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  }
  const modalLbl: any = {
    fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em',
    display: 'block', marginBottom: '8px'
  }

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
            color: item.href === '/admin/invoices' ? '#fff' : '#666',
            background: item.href === '/admin/invoices' ? '#222' : 'transparent', fontSize: '14px'
          }}>{item.icon} {item.label}</Link>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: '#161616', borderBottom: '1px solid #222', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Invoices</h1>
              <span style={{ fontSize: '12px', color: '#555' }}>{projects.length} total</span>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            marginLeft: 'auto', background: '#222', border: '1px solid #333', borderRadius: '10px',
            color: '#fff', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>⊞ New invoice</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <div style={card}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>Total billed</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>₹{totalBilled.toLocaleString()}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>Collected</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#4ade80' }}>₹{collected.toLocaleString()}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>Pending</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fb923c' }}>₹{pendingAmt.toLocaleString()}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>Overdue</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#ef4444' }}>₹{overdueAmt.toLocaleString()}</div>
            </div>
          </div>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder='Search by client or project...'
                style={{ width: '100%', background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 12px 10px 34px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' as const, outline: 'none' }} />
            </div>
            {['All', 'Unpaid', 'Overdue', 'Paid'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                borderColor: filter === f ? '#444' : '#2a2a2a',
                background: filter === f ? '#2a2a2a' : 'transparent',
                color: filter === f ? '#fff' : '#555',
                fontSize: '13px', cursor: 'pointer', fontWeight: filter === f ? 600 : 400
              }}>{f}</button>
            ))}
          </div>

          {/* Table */}
          {loading ? <p style={{ color: '#555' }}>Loading...</p> : (
            <div style={{ ...card, padding: '0', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1.5fr 2fr 120px 110px 130px 80px', gap: '12px', padding: '12px 20px', borderBottom: '1px solid #222' }}>
                {['Inv #', 'Client', 'Project', 'Amount', 'Due', 'Status', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>{h}</div>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '14px' }}>No invoices found.</div>
              ) : filtered.map((p, i) => {
                const clientName = p.clients?.name || '—'
                const avStyle = av(clientName)
                const over = isOverdue(p.deadline) && p.payment_status !== 'Paid'
                const invoiceNum = `#${String(projects.length - projects.findIndex(x => x.id === p.id)).padStart(3, '0')}`

                return (
                  <div key={p.id}
                    style={{ display: 'grid', gridTemplateColumns: '70px 1.5fr 2fr 120px 110px 130px 80px', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #1a1a1a', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>{invoiceNum}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                        {initials(clientName)}
                      </div>
                      <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {clientName.split(' ')[0]} {clientName.split(' ')[1]?.[0] ? clientName.split(' ')[1][0] + '.' : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>₹{Number(p.amount).toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: over ? '#ef4444' : '#aaa' }}>{formatDate(p.deadline)}</div>
                    <div>
                      <span style={{
                        fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600,
                        background: p.payment_status === 'Paid' ? '#14532d' : over ? '#3b1f1f' : '#3b2000',
                        color: p.payment_status === 'Paid' ? '#4ade80' : over ? '#f87171' : '#fb923c'
                      }}>
                        {over ? 'Overdue' : p.payment_status}
                      </span>
                    </div>
                    <div>
                      <select value={p.payment_status} onChange={e => updatePayment(p.id, e.target.value)}
                        style={{ background: '#2a2a2a', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '5px 6px', fontSize: '11px', cursor: 'pointer' }}>
                        {['Pending', 'Paid', 'Partial'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '500px', maxHeight: '90vh', overflowY: 'auto',
            background: '#fff', borderRadius: '20px', padding: '36px',
            zIndex: 50, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111' }}>New invoice</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Client */}
              <div>
                <label style={modalLbl}>CLIENT</label>
                <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value, project_id: '' })}
                  style={{ ...modalInp, color: form.client_id ? '#111' : '#9ca3af' }}>
                  <option value=''>Select client name</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Project */}
              <div>
                <label style={modalLbl}>PROJECT</label>
                <select value={form.project_id} onChange={e => {
                  const proj = projects.find(p => p.id === e.target.value)
                  setForm({ ...form, project_id: e.target.value, amount: proj?.amount?.toString() || '' })
                }} style={{ ...modalInp, color: form.project_id ? '#111' : '#9ca3af' }}>
                  <option value=''>Select project</option>
                  {clientProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label style={modalLbl}>AMOUNT (₹)</label>
                <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder='e.g. 18000' style={modalInp} />
              </div>

              {/* Invoice Date + Due Date side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={modalLbl}>INVOICE DATE</label>
                  <input type='date' value={form.invoice_date} onChange={e => setForm({ ...form, invoice_date: e.target.value })}
                    style={{ ...modalInp, color: form.invoice_date ? '#111' : '#9ca3af' }} />
                </div>
                <div>
                  <label style={modalLbl}>DUE DATE</label>
                  <input type='date' value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                    style={{ ...modalInp, color: form.due_date ? '#111' : '#9ca3af' }} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={modalLbl}>NOTES (OPTIONAL)</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder='Payment terms or notes...' rows={4}
                  style={{ ...modalInp, resize: 'vertical' }} />
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
                <button onClick={() => setShowModal(false)} style={{
                  background: '#fff', color: '#374151', border: '1px solid #e5e7eb',
                  borderRadius: '12px', padding: '14px', fontSize: '15px',
                  fontWeight: 500, cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={createInvoice} disabled={saving} style={{
                  background: '#111', color: '#fff', border: 'none',
                  borderRadius: '12px', padding: '14px', fontSize: '15px',
                  fontWeight: 600, cursor: saving ? 'default' : 'pointer'
                }}>{saving ? 'Creating...' : 'Create invoice'}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}