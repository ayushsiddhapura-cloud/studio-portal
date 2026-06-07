'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClientPortalPage() {
  const { token } = useParams()
  const [client, setClient] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [revisions, setRevisions] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [activeProject, setActiveProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // PIN protection
  const [pinRequired, setPinRequired] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinUnlocked, setPinUnlocked] = useState(false)

  useEffect(() => { fetchClient() }, [token])

  async function fetchClient() {
    const { data: clientData } = await supabase
      .from('clients').select('*').eq('token', token).single()
    if (!clientData) { setNotFound(true); setLoading(false); return }
    setClient(clientData)

    // Check PIN
    if (clientData.pin_enabled && clientData.pin) {
      setPinRequired(true)
      setLoading(false)
      return
    }

    await loadPortalData(clientData)
  }

  async function loadPortalData(clientData: any) {
    const { data: projectData } = await supabase
      .from('projects').select('*').eq('client_id', clientData.id)
    if (projectData) {
      setProjects(projectData)
      setActiveProject(projectData[0] || null)
      const ids = projectData.map((p: any) => p.id)
      if (ids.length > 0) {
        const { data: fileData } = await supabase.from('files').select('*').in('project_id', ids)
        const { data: revData } = await supabase.from('revisions').select('*').in('project_id', ids).order('created_at', { ascending: false })
        const { data: verData } = await supabase.from('versions').select('*').in('project_id', ids).order('version_number', { ascending: true })
        if (fileData) setFiles(fileData)
        if (revData) setRevisions(revData)
        if (verData) setVersions(verData)
      }
    }
    setLoading(false)
  }

  async function handlePinSubmit() {
    if (pinInput === client.pin) {
      setPinUnlocked(true)
      setPinRequired(false)
      setPinError('')
      setLoading(true)
      await loadPortalData(client)
    } else {
      setPinError('Incorrect PIN. Please try again.')
      setPinInput('')
    }
  }

  function openInvoicePDF() {
    if (!activeProject || !client) return

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice — ${activeProject.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111; padding: 48px; max-width: 720px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 2px solid #111; }
    .brand { font-size: 22px; font-weight: 800; }
    .brand-sub { font-size: 13px; color: #666; margin-top: 4px; }
    .invoice-label { text-align: right; }
    .invoice-label h1 { font-size: 32px; font-weight: 800; color: #111; }
    .invoice-label p { font-size: 13px; color: #666; margin-top: 4px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party h3 { font-size: 11px; font-weight: 700; color: #999; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
    .party p { font-size: 14px; color: #333; line-height: 1.7; }
    .party .name { font-size: 16px; font-weight: 700; color: #111; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    thead th { background: #111; color: #fff; padding: 12px 16px; text-align: left; font-size: 12px; letter-spacing: 0.5px; }
    tbody td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    tbody tr:last-child td { border-bottom: none; }
    .totals { margin-left: auto; width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #555; }
    .total-final { display: flex; justify-content: space-between; padding: 14px 0; font-size: 18px; font-weight: 800; border-top: 2px solid #111; margin-top: 8px; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .paid { background: #d1fae5; color: #065f46; }
    .unpaid { background: #fee2e2; color: #991b1b; }
    .partial { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; line-height: 1.8; }
    .note { background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 32px; font-size: 13px; color: #555; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">🎬 Studio Portal</div>
      <div class="brand-sub">Professional Video Editing</div>
    </div>
    <div class="invoice-label">
      <h1>INVOICE</h1>
      <p>#INV-${activeProject.id?.slice(0,8).toUpperCase() || '000001'}</p>
      <p style="margin-top:8px">Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      ${activeProject.deadline ? `<p>Due: ${activeProject.deadline}</p>` : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>From</h3>
      <p class="name">Studio Portal</p>
      <p>Ayush Siddhapura</p>
      <p>Ahmedabad, Gujarat</p>
    </div>
    <div class="party" style="text-align:right">
      <h3>Billed To</h3>
      <p class="name">${client.name}</p>
      ${client.channel_name ? `<p>${client.channel_name}</p>` : ''}
      ${client.email ? `<p>${client.email}</p>` : ''}
      ${client.phone ? `<p>${client.phone}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Type</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>${activeProject.title}</strong>
          ${activeProject.description ? `<br><span style="font-size:12px;color:#888">${activeProject.description}</span>` : ''}
        </td>
        <td>Video Editing</td>
        <td style="text-align:right;font-weight:700">₹${Number(activeProject.amount).toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>₹${Number(activeProject.amount).toLocaleString()}</span></div>
    <div class="total-row"><span>Tax (0%)</span><span>₹0</span></div>
    <div class="total-final"><span>Total</span><span>₹${Number(activeProject.amount).toLocaleString()}</span></div>
    <div style="margin-top:12px;text-align:right">
      <span class="status-badge ${activeProject.payment_status === 'Paid' ? 'paid' : activeProject.payment_status === 'Partial' ? 'partial' : 'unpaid'}">
        ${activeProject.payment_status === 'Paid' ? '✓ PAID' : activeProject.payment_status === 'Partial' ? 'PARTIALLY PAID' : 'PAYMENT DUE'}
      </span>
    </div>
  </div>

  ${activeProject.payment_status !== 'Paid' ? `
  <div class="note" style="margin-top:32px">
    <strong>Payment Terms:</strong> Payment due within 7 days of delivery. Thank you for your business!
  </div>
  ` : ''}

  <div class="footer">
    Thank you for working with Studio Portal · studio-portal-ayushsiddhapura24.vercel.app<br>
    This invoice was generated automatically from your client portal.
    <br><br>
    <button onclick="window.print()" style="background:#111;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px">
      🖨️ Print / Save as PDF
    </button>
  </div>
</body>
</html>`

    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  // ── PIN SCREEN ──
  if (pinRequired && !pinUnlocked) return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '40px 36px', width: '360px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Portal Protected</h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 28px' }}>Enter your PIN to access your project portal</p>
        <input
          type="password"
          value={pinInput}
          onChange={e => setPinInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
          placeholder="Enter PIN"
          maxLength={6}
          style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '20px', textAlign: 'center', letterSpacing: '8px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        {pinError && <p style={{ color: '#f87171', fontSize: '13px', margin: '0 0 12px' }}>{pinError}</p>}
        <button onClick={handlePinSubmit} style={{ width: '100%', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          Unlock Portal →
        </button>
        <p style={{ color: '#444', fontSize: '12px', marginTop: '20px' }}>Contact your studio if you forgot your PIN</p>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontFamily: 'sans-serif' }}>
      Loading your portal...
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontFamily: 'sans-serif', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px' }}>🔍</div>
      <p>Portal not found. Please check your link.</p>
    </div>
  )

  const totalPending = projects.reduce((s, p) => p.payment_status !== 'Paid' ? s + Number(p.amount) : s, 0)
  const activeFiles = activeProject ? files.filter(f => f.project_id === activeProject.id) : []
  const activeRevisions = activeProject ? revisions.filter(r => r.project_id === activeProject.id) : []
  const activeVersions = activeProject ? versions.filter(v => v.project_id === activeProject.id) : []
  const totalVersions = versions.length

  const progressSteps = ['Briefing', 'Editing', 'In review', 'Approved', 'Delivered']
  const getStepIndex = (status: string) => {
    if (status === 'Completed') return 4
    if (status === 'Review') return 2
    if (status === 'In Progress') return 1
    return 0
  }
  const currentStep = activeProject ? getStepIndex(activeProject.status) : 0

  const s = {
    card: { background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', marginBottom: '16px' } as any,
    label: { fontSize: '11px', fontWeight: 600, color: '#666', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' } as any,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#fff' }}>

      {/* Top Nav */}
      <div style={{ background: '#161616', borderBottom: '1px solid #222', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎬</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Studio Portal</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Your private project dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <span>🔒</span> Private & secure
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Hero */}
        <div style={s.card}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#222', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: '#aaa', letterSpacing: '1px', marginBottom: '16px' }}>
            🎬 VIDEO EDITING CLIENT
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
            <span style={{ color: '#fff' }}>{client.name}'s</span>{' '}
            <span style={{ color: '#555', fontWeight: 400 }}>Project Dashboard</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: '0 0 20px' }}>
            {client.channel_name || 'Your Studio'} — all your projects and updates in one place
          </p>
          <div style={{ borderTop: '1px solid #222', paddingTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {client.email && <span style={{ fontSize: '13px', color: '#888' }}>✉️ {client.email}</span>}
            {client.phone && <span style={{ fontSize: '13px', color: '#888' }}>📱 {client.phone}</span>}
            <span style={{ fontSize: '13px', color: '#4ade80' }}>● Active client</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'TOTAL PROJECTS', value: projects.length, sub: `${projects.filter(p => p.status === 'In Progress').length} active · ${projects.filter(p => p.status === 'Review').length} in review`, color: '#fff' },
            { label: 'VERSIONS SENT', value: totalVersions, sub: 'Across all projects', color: '#60a5fa' },
            { label: 'AMOUNT DUE', value: `₹${totalPending.toLocaleString()}`, sub: `${projects.filter(p => p.payment_status !== 'Paid').length} invoices pending`, color: '#f87171' },
          ].map(card => (
            <div key={card.label} style={{ ...s.card, marginBottom: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', letterSpacing: '1px', marginBottom: '10px' }}>{card.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: card.color, marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Project Tabs */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', letterSpacing: '1px', marginBottom: '10px' }}>YOUR PROJECTS</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {projects.map(p => (
                <button key={p.id} onClick={() => setActiveProject(p)} style={{
                  padding: '8px 18px', borderRadius: '8px', border: '1px solid',
                  borderColor: activeProject?.id === p.id ? '#444' : '#2a2a2a',
                  background: activeProject?.id === p.id ? '#222' : 'transparent',
                  color: activeProject?.id === p.id ? '#fff' : '#666',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                }}>{p.title}</button>
              ))}
            </div>
          </div>
        )}

        {/* Active Project */}
        {activeProject && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{activeProject.title}</h2>
              <span style={{
                fontSize: '12px', padding: '4px 14px', borderRadius: '20px', fontWeight: 600, border: '1px solid',
                borderColor: activeProject.status === 'Review' ? '#854d0e' : activeProject.status === 'Completed' ? '#166534' : '#1e3a5f',
                background: activeProject.status === 'Review' ? '#1c1200' : activeProject.status === 'Completed' ? '#052e16' : '#0c1a2e',
                color: activeProject.status === 'Review' ? '#fbbf24' : activeProject.status === 'Completed' ? '#4ade80' : '#60a5fa'
              }}>{activeProject.status}</span>
            </div>
            {activeProject.deadline && (
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
                Due <span style={{ color: '#f87171' }}>{activeProject.deadline}</span>
              </div>
            )}

            {/* Progress */}
            <div style={{ marginBottom: '28px', borderTop: '1px solid #222', paddingTop: '20px' }}>
              <div style={s.label}>📋 PROJECT PROGRESS</div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '1px', background: '#2a2a2a' }} />
                <div style={{ position: 'absolute', top: '10px', left: 0, height: '1px', background: '#fff', width: `${(currentStep / (progressSteps.length - 1)) * 100}%` }} />
                {progressSteps.map((step, i) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', border: '2px solid',
                      borderColor: i <= currentStep ? '#fff' : '#333',
                      background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {i < currentStep && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                      {i === currentStep && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: i <= currentStep ? '#fff' : '#555', fontWeight: i === currentStep ? 600 : 400, textAlign: 'center' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version History */}
            {activeVersions.length > 0 && (
              <div style={{ marginBottom: '24px', borderTop: '1px solid #222', paddingTop: '20px' }}>
                <div style={s.label}>📁 VERSION HISTORY — {activeVersions.length} DRAFTS SENT</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '1px', background: '#2a2a2a' }} />
                  {[...Array(3)].map((_, i) => {
                    const ver = activeVersions[i]
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: ver ? '#fff' : '#1c1c1c',
                          border: `2px solid ${ver ? '#fff' : '#333'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700, color: ver ? '#111' : '#555'
                        }}>v{i + 1}</div>
                        <span style={{ fontSize: '11px', color: ver ? '#aaa' : '#444' }}>{ver ? ver.sent_date || '—' : '—'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Revisions & Files */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #222', paddingTop: '20px' }}>
              <div>
                <div style={s.label}>💬 REVISION HISTORY</div>
                {activeRevisions.length === 0 ? (
                  <div style={{ background: '#161616', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#555' }}>
                    No revisions yet — your feedback will appear here.
                  </div>
                ) : activeRevisions.map((r, idx) => (
                  <div key={r.id} style={{ background: '#161616', borderRadius: '8px', padding: '14px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: idx === 0 ? '#2563eb' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{activeRevisions.length - idx}</div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Round {activeRevisions.length - idx}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 6px', paddingLeft: '30px' }}>{r.note}</p>
                    <div style={{ fontSize: '11px', color: '#555', paddingLeft: '30px' }}>{r.created_date} · {r.status || 'Pending'}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={s.label}>📂 FILES & DRAFTS</div>
                {activeFiles.length === 0 ? (
                  <div style={{ background: '#161616', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#555' }}>
                    Your first draft will appear here once it's ready.
                  </div>
                ) : activeFiles.map(f => (
                  <a key={f.id} href={f.url} target='_blank' rel='noreferrer' style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#161616', borderRadius: '8px', padding: '12px 14px',
                    textDecoration: 'none', marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {f.type === 'Delivery' ? '🎬' : f.type === 'Draft' ? '📝' : '📁'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{f.name}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{f.type}</div>
                      </div>
                    </div>
                    <span style={{ color: '#555', fontSize: '18px' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoice */}
        {activeProject && (
          <div style={s.card}>
            <div style={s.label}>🧾 INVOICE & PAYMENT</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'PROJECT FEE', value: `₹${Number(activeProject.amount).toLocaleString()}`, color: '#fff' },
                { label: 'AMOUNT PAID', value: `₹${activeProject.payment_status === 'Paid' ? Number(activeProject.amount).toLocaleString() : '0'}`, color: '#4ade80' },
                { label: 'BALANCE DUE', value: `₹${activeProject.payment_status === 'Paid' ? '0' : Number(activeProject.amount).toLocaleString()}`, color: '#f87171' },
                { label: 'PAYMENT STATUS', value: activeProject.payment_status, status: true },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', letterSpacing: '1px', marginBottom: '8px' }}>{item.label}</div>
                  {item.status ? (
                    <span style={{
                      fontSize: '13px', padding: '4px 14px', borderRadius: '20px', fontWeight: 600,
                      background: activeProject.payment_status === 'Paid' ? '#052e16' : activeProject.payment_status === 'Partial' ? '#1c1200' : '#1c0a0a',
                      color: activeProject.payment_status === 'Paid' ? '#4ade80' : activeProject.payment_status === 'Partial' ? '#fbbf24' : '#f87171',
                      border: '1px solid', borderColor: activeProject.payment_status === 'Paid' ? '#166534' : activeProject.payment_status === 'Partial' ? '#854d0e' : '#7f1d1d'
                    }}>{item.value}</span>
                  ) : (
                    <div style={{ fontSize: '24px', fontWeight: 800, color: item.color }}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
            {activeProject.deadline && (
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>
                Due date: <span style={{ color: '#fff', fontWeight: 600 }}>{activeProject.deadline}</span>
              </div>
            )}
            <button
              onClick={openInvoicePDF}
              style={{
                width: '100%', background: '#fff', border: 'none',
                borderRadius: '10px', padding: '14px', color: '#000', fontSize: '14px',
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
              🧾 View Invoice PDF
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '24px', padding: '16px', borderTop: '1px solid #1a1a1a' }}>
          🔒 This is your private portal — only you can see this page · Studio Portal by Ayush Siddhapura
        </div>
      </div>
    </div>
  )
}