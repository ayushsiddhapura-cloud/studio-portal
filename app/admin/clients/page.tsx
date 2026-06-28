'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/lib/sidebar'
import { IconSearch, IconPlus, IconCopy, IconFilter } from '@/lib/icons'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '', pin_enabled: false })
  const [saving, setSaving] = useState(false)
  const [newClientToken, setNewClientToken] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: p } = await supabase.from('projects').select('*')
    if (c) setClients(c)
    if (p) setProjects(p)
  }

 async function createClient() {
  if (!form.name.trim()) return
  setSaving(true)
  const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  
  const { data, error } = await supabase.from('clients').insert([{
    name: form.name,
    email: form.email,
    phone: form.phone,
    channel_name: form.company,
    notes: form.notes,
    token,
    pin_enabled: form.pin_enabled,
    status: 'Active'
  }]).select()

  if (error) {
    alert('Error: ' + error.message)
    setSaving(false)
    return
  }

  setNewClientToken(token)
  setForm({ name: '', email: '', phone: '', company: '', notes: '', pin_enabled: false })
  setSaving(false)
  fetchAll()
}

  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    fetchAll()
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/c/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.channel_name?.toLowerCase().includes(search.toLowerCase())
  )

  function clientProjects(id: string) { return projects.filter(p => p.client_id === id) }
  function billed(id: string) { return clientProjects(id).reduce((s, p) => s + Number(p.amount || 0), 0) }
  function pending(id: string) { return clientProjects(id).filter(p => p.payment_status !== 'Paid').reduce((s, p) => s + Number(p.amount || 0), 0) }
  function activeCount(id: string) { return clientProjects(id).filter(p => p.status === 'In Progress').length }
  function lastBadge(id: string) {
    const p = clientProjects(id)
    if (!p.length) return null
    const allPaid = p.every(x => x.payment_status === 'Paid')
    if (allPaid) return { label: 'Paid up', bg: '#1a3a2a', color: '#4ade80', border: '#166534' }
    const lastStatus = p[p.length - 1]?.status
    if (lastStatus === 'Completed') return { label: 'Delivered', bg: '#1a3a2a', color: '#4ade80', border: '#166534' }
    if (lastStatus === 'Review') return { label: 'In review', bg: '#2a2000', color: '#fbbf24', border: '#854d0e' }
    return null
  }

  function initials(name: string) { return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?' }
  const avatarPalette = [
    { bg: '#1e3a5f', color: '#60a5fa' }, { bg: '#14532d', color: '#4ade80' },
    { bg: '#4a1942', color: '#e879f9' }, { bg: '#3b2f00', color: '#fbbf24' },
    { bg: '#2e1a5e', color: '#a78bfa' }, { bg: '#3b1a00', color: '#fb923c' },
  ]
  function av(name: string) { return avatarPalette[(name?.charCodeAt(0) || 0) % avatarPalette.length] }

  const inp: any = { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: '8px', padding: '11px 14px', color: 'var(--text)', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }
  const lbl: any = { fontSize: '13px', color: 'var(--text-sec)', display: 'block', marginBottom: '6px', fontWeight: 500 }

  const portalPreview = typeof window !== 'undefined'
    ? `${window.location.origin}/c/auto-generated...`
    : 'studio-portal.com/c/auto-generated...'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Clients</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#222', padding: '2px 8px', borderRadius: '20px' }}>{clients.length} total</span>
          <button onClick={() => { setPanelOpen(true); setNewClientToken(null) }} style={{
            marginLeft: 'auto', background: 'var(--bg-hover)', border: '1px solid var(--border-input)', borderRadius: '10px',
            color: 'var(--text)', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}><IconPlus size={14} /> Add client</button>
        </div>

        {/* Search + Filter */}
        <div style={{ padding: '16px 24px 8px', display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><IconSearch size={15} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search clients...'
              style={{ ...inp, paddingLeft: '34px' }} />
          </div>
          <button style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-input)', borderRadius: '8px', color: 'var(--text-sec)', padding: '10px 18px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconFilter size={13} /> Filter
          </button>
        </div>

        {/* Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignContent: 'start' }}>
          {filtered.map(client => {
            const proj = clientProjects(client.id)
            const active = activeCount(client.id)
            const badge = lastBadge(client.id)
            const avStyle = av(client.name)
            return (
              <div key={client.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '18px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                    {initials(client.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.channel_name || client.email || '—'}</div>
                  </div>
                  <button onClick={() => deleteClient(client.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '16px', padding: '2px', flexShrink: 0 }}>✕</button>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{proj.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>projects</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>₹{billed(client.id).toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>billed</div>
                  </div>
                  {pending(client.id) > 0 && (
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#f87171' }}>₹{pending(client.id).toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>pending</div>
                    </div>
                  )}
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {active > 0 && (
                      <span style={{ fontSize: '12px', background: '#1e3a5f', color: '#60a5fa', padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>
                        {active} active
                      </span>
                    )}
                    {badge && (
                      <span style={{ fontSize: '12px', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  {client.token && (
                    <button onClick={() => copyLink(client.token)} style={{
                      background: 'transparent', border: 'none', color: copied === client.token ? '#4ade80' : '#555',
                      fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <IconCopy size={12} /> {copied === client.token ? 'Copied!' : 'Portal link'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel — always visible when open */}
      {panelOpen && (
        <div style={{ width: '320px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)', padding: '28px 20px', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Add new client</h2>
            <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Full name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='e.g. Rahul Kapoor' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Email address</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder='rahul@email.com' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder='+91 98765 43210' style={inp} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Company (optional)</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder='Company name' style={inp} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>Notes (admin only)</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder='Any private notes about this client...' rows={3}
              style={{ ...inp, resize: 'vertical' }} />
          </div>

          {/* Portal access */}
          <div style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-card)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Client portal access</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
              A unique private link is auto-generated. Share it with the client to give them access to their portal.
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-card)', borderRadius: '6px', padding: '8px 10px', color: 'var(--text-inactive)', wordBreak: 'break-all' }}>
              {newClientToken
                ? `${typeof window !== 'undefined' ? window.location.origin : 'studio-portal.com'}/c/${newClientToken}`
                : portalPreview}
            </div>
            {newClientToken && (
              <button onClick={() => copyLink(newClientToken)} style={{
                marginTop: '8px', width: '100%', background: '#14532d', color: '#4ade80',
                border: '1px solid #166534', borderRadius: '6px', padding: '8px',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer'
              }}>
                {copied === newClientToken ? 'Copied!' : <><IconCopy size={12} /> Copy portal link</>}
              </button>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '13px', color: 'var(--text-sec)', cursor: 'pointer' }}>
              <input type='checkbox' checked={form.pin_enabled} onChange={e => setForm({ ...form, pin_enabled: e.target.checked })}
                style={{ width: '14px', height: '14px', accentColor: '#7c3aed' }} />
              Enable PIN protection
            </label>
          </div>

          <button onClick={createClient} disabled={saving} style={{
            width: '100%', background: saving ? '#333' : '#fff', color: saving ? '#aaa' : '#000',
            border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px',
            fontWeight: 700, cursor: saving ? 'default' : 'pointer', marginBottom: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            <IconPlus size={14} /> {saving ? 'Creating...' : 'Create client'}
          </button>

          <button onClick={() => newClientToken && copyLink(newClientToken)} style={{
            width: '100%', background: 'transparent', color: newClientToken ? '#aaa' : '#444',
            border: '1px solid var(--border-card)', borderRadius: '10px', padding: '13px', fontSize: '14px',
            fontWeight: 600, cursor: newClientToken ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            <IconCopy size={14} /> Copy portal link
          </button>
        </div>
      )}
    </div>
  )
}