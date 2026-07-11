'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/lib/sidebar'
import { IconPlus, IconSearch, IconInvoices } from '@/lib/icons'

function monthLabel(m: string) {
  if (!m) return '—'
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1).toLocaleString('default', { month: 'long' }) + ' ' + y
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ client_id: '', month: '', amount: '', pdf_url: '', notes: '' })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: inv } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false })
    const { data: p } = await supabase.from('projects').select('id, title, amount, client_id, invoice_id, payment_status')
    const { data: c } = await supabase.from('clients').select('id, name')
    if (inv) setInvoices(inv)
    if (p) setProjects(p)
    if (c) setClients(c)
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm({ client_id: '', month: new Date().toISOString().slice(0, 7), amount: '', pdf_url: '', notes: '' })
    setSelectedProjects([])
    setShowModal(true)
  }

  function openEdit(inv: any) {
    setEditing(inv)
    setForm({
      client_id: inv.client_id || '',
      month: inv.month || '',
      amount: inv.amount?.toString() || '',
      pdf_url: inv.pdf_url || '',
      notes: inv.notes || '',
    })
    setSelectedProjects(projects.filter(p => p.invoice_id === inv.id).map(p => p.id))
    setShowModal(true)
  }

  function toggleProject(id: string) {
    const next = selectedProjects.includes(id)
      ? selectedProjects.filter(x => x !== id)
      : [...selectedProjects, id]
    setSelectedProjects(next)
    const sum = projects.filter(p => next.includes(p.id)).reduce((s, p) => s + Number(p.amount || 0), 0)
    setForm(f => ({ ...f, amount: sum ? String(sum) : '' }))
  }

  async function saveInvoice() {
    if (!form.client_id) return alert('Please select a client')
    if (!form.month) return alert('Please select a month')
    setSaving(true)

    const payload = {
      client_id: form.client_id,
      month: form.month,
      amount: parseFloat(form.amount) || 0,
      pdf_url: form.pdf_url || null,
      notes: form.notes || null,
    }

    let invoiceId = editing?.id
    if (editing) {
      await supabase.from('invoices').update(payload).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('invoices').insert([{ ...payload, status: 'Unpaid' }]).select('id').single()
      invoiceId = data?.id
    }

    if (invoiceId) {
      const prevLinked = projects.filter(p => p.invoice_id === invoiceId).map(p => p.id)
      const toUnlink = prevLinked.filter(id => !selectedProjects.includes(id))
      const toLink = selectedProjects.filter(id => !prevLinked.includes(id))
      if (toUnlink.length) await supabase.from('projects').update({ invoice_id: null }).in('id', toUnlink)
      if (toLink.length) await supabase.from('projects').update({ invoice_id: invoiceId }).in('id', toLink)
    }

    setSaving(false)
    setShowModal(false)
    setEditing(null)
    fetchAll()
  }

  async function setStatus(inv: any, status: string) {
    await supabase.from('invoices').update({ status }).eq('id', inv.id)
    const linked = projects.filter(p => p.invoice_id === inv.id).map(p => p.id)
    if (linked.length) {
      await supabase.from('projects').update({ payment_status: status === 'Paid' ? 'Paid' : 'Pending' }).in('id', linked)
    }
    fetchAll()
  }

  async function deleteInvoice(inv: any) {
    if (!confirm(`Delete invoice INV-${String(inv.number).padStart(3, '0')}? Projects will be unlinked.`)) return
    await supabase.from('invoices').delete().eq('id', inv.id)
    fetchAll()
  }

  const clientProjects = projects.filter(p =>
    p.client_id === form.client_id &&
    (!p.invoice_id || p.invoice_id === editing?.id)
  )

  const totalBilled = invoices.reduce((s, i) => s + Number(i.amount || 0), 0)
  const collected = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + Number(i.amount || 0), 0)
  const pendingAmt = totalBilled - collected

  const filtered = invoices.filter(i => {
    const matchSearch = i.clients?.name?.toLowerCase().includes(search.toLowerCase()) || monthLabel(i.month).toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Unpaid' ? i.status !== 'Paid' : i.status === 'Paid'
    return matchSearch && matchFilter
  })

  const card: any = { background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '20px' }
  const modalInp: any = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)',
    borderRadius: '10px', padding: '13px 16px', color: 'var(--text)',
    fontSize: '15px', boxSizing: 'border-box', outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  }
  const modalLbl: any = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em',
    display: 'block', marginBottom: '8px'
  }
  const actionBtn: any = {
    background: 'none', border: '1px solid var(--border-input)', borderRadius: '8px',
    color: 'var(--text-sec)', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div className='mobile-topbar-pad' style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Invoices</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{invoices.length} total</span>
          <button onClick={openAdd} style={{
            marginLeft: 'auto', background: '#222', border: '1px solid var(--border-input)', borderRadius: '10px',
            color: 'var(--text)', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
          }}><IconPlus size={14} /> New invoice</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className='mobile-content-pad'>

          {/* Stat cards */}
          <div className='stat-grid-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            <div style={card}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Total billed</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>₹{totalBilled.toLocaleString()}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Collected</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#4ade80' }}>₹{collected.toLocaleString()}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Pending</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fb923c' }}>₹{pendingAmt.toLocaleString()}</div>
            </div>
          </div>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px', minWidth: '160px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><IconSearch size={15} /></span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder='Search by client or month...'
                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '10px 12px 10px 34px', color: 'var(--text)', fontSize: '13px', boxSizing: 'border-box' as const, outline: 'none' }} />
            </div>
            {['All', 'Unpaid', 'Paid'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                borderColor: filter === f ? '#444' : 'var(--border-card)',
                background: filter === f ? 'var(--bg-input)' : 'transparent',
                color: filter === f ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '13px', cursor: 'pointer', fontWeight: filter === f ? 600 : 400
              }}>{f}</button>
            ))}
          </div>

          {/* Invoice cards */}
          {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> :
            filtered.length === 0 ? (
              <div style={{ ...card, padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No invoices yet. Click "New invoice" to create your first monthly invoice.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map(inv => {
                  const covered = projects.filter(p => p.invoice_id === inv.id)
                  const paid = inv.status === 'Paid'
                  return (
                    <div key={inv.id} style={{ ...card, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>INV-{String(inv.number).padStart(3, '0')} · {monthLabel(inv.month)}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-sec)' }}>{inv.clients?.name || '—'}</span>
                        <span style={{
                          fontSize: '12px', padding: '3px 12px', borderRadius: '20px', fontWeight: 600, whiteSpace: 'nowrap',
                          background: paid ? '#14532d' : '#3b2000',
                          color: paid ? '#4ade80' : '#fb923c'
                        }}>{inv.status}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '16px', fontWeight: 800 }}>₹{Number(inv.amount).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        {covered.length === 0 ? 'No projects linked' :
                          'Covers: ' + covered.map(p => `${p.title} (₹${Number(p.amount || 0).toLocaleString()})`).join(' · ')}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {inv.pdf_url && (
                          <a href={inv.pdf_url} target='_blank' rel='noopener noreferrer'
                            style={{ ...actionBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <IconInvoices size={12} /> View PDF
                          </a>
                        )}
                        <button onClick={() => setStatus(inv, paid ? 'Unpaid' : 'Paid')}
                          style={{ ...actionBtn, color: paid ? '#fb923c' : '#4ade80' }}>
                          {paid ? 'Mark unpaid' : 'Mark paid'}
                        </button>
                        <button onClick={() => openEdit(inv)} style={actionBtn}>Edit</button>
                        <button onClick={() => deleteInvoice(inv)} style={{ ...actionBtn, color: '#ef4444' }}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      </div>

      {/* New / Edit invoice modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
          <div className='mobile-modal' style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '500px', maxWidth: 'calc(100vw - 24px)', maxHeight: '90vh', overflowY: 'auto',
            background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '36px',
            zIndex: 50, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>{editing ? 'Edit invoice' : 'New monthly invoice'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={modalLbl}>CLIENT</label>
                <select value={form.client_id}
                  onChange={e => { setForm({ ...form, client_id: e.target.value, amount: '' }); setSelectedProjects([]) }}
                  style={modalInp}>
                  <option value=''>Select client name</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={modalLbl}>MONTH</label>
                <input type='month' value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} style={modalInp} />
              </div>

              {form.client_id && (
                <div>
                  <label style={modalLbl}>PROJECTS COVERED</label>
                  <div style={{ border: '1px solid var(--border-input)', borderRadius: '10px', padding: '6px 12px' }}>
                    {clientProjects.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '8px 0' }}>No available projects for this client.</div>
                    ) : clientProjects.map(p => (
                      <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', padding: '8px 0', cursor: 'pointer', color: 'var(--text)' }}>
                        <input type='checkbox' checked={selectedProjects.includes(p.id)} onChange={() => toggleProject(p.id)} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-sec)', flexShrink: 0 }}>₹{Number(p.amount || 0).toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={modalLbl}>TOTAL AMOUNT (₹)</label>
                <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder='Auto-sums from selected projects' style={modalInp} />
              </div>

              <div>
                <label style={modalLbl}>INVOICE PDF LINK (OPTIONAL)</label>
                <input value={form.pdf_url} onChange={e => setForm({ ...form, pdf_url: e.target.value })}
                  placeholder='https://drive.google.com/...' style={modalInp} />
              </div>

              <div>
                <label style={modalLbl}>NOTES (OPTIONAL)</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder='Payment terms or notes...' rows={3}
                  style={{ ...modalInp, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
                <button onClick={() => { setShowModal(false); setEditing(null) }} style={{
                  background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border-input)',
                  borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 500, cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={saveInvoice} disabled={saving} style={{
                  background: 'var(--text)', color: 'var(--bg-page)', border: 'none',
                  borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: saving ? 'default' : 'pointer'
                }}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create invoice'}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
