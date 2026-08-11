'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IconLock, IconSearch, IconMail, IconPhone, IconChecklist, IconFolderOpen, IconChat, IconFolder, IconVideo, IconFileText, IconInvoices } from '@/lib/icons'
import { drivePreview, driveDownload } from '@/lib/drive'

function monthLabel(m: string) {
  if (!m) return '—'
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1).toLocaleString('default', { month: 'long' }) + ' ' + y
}

export default function ClientPortalPage() {
  const { token } = useParams()
  const [client, setClient] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [revisions, setRevisions] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [activeProject, setActiveProject] = useState<any>(null)
  const [previewPdf, setPreviewPdf] = useState<string | null>(null)
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
    const { data: invoiceData } = await supabase
      .from('invoices').select('*').eq('client_id', clientData.id).order('month', { ascending: false })
    if (invoiceData) setInvoices(invoiceData)
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


  // ── PIN SCREEN ──
  if (pinRequired && !pinUnlocked) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '40px 36px', width: '360px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text)' }}><IconLock size={36} /></div>
        <h2 style={{ color: 'var(--text)', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Portal Protected</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 28px' }}>Enter your PIN to access your project portal</p>
        <input
          type="password"
          value={pinInput}
          onChange={e => setPinInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
          placeholder="Enter PIN"
          maxLength={6}
          style={{ width: '100%', background: 'var(--bg-page)', border: '1px solid var(--border-input)', borderRadius: '10px', padding: '14px', color: 'var(--text)', fontSize: '20px', textAlign: 'center', letterSpacing: '8px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        {pinError && <p style={{ color: '#f87171', fontSize: '13px', margin: '0 0 12px' }}>{pinError}</p>}
        <button onClick={handlePinSubmit} style={{ width: '100%', background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          Unlock Portal →
        </button>
        <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '20px' }}>Contact your studio if you forgot your PIN</p>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sec)', fontFamily: 'sans-serif' }}>
      Loading your portal...
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sec)', fontFamily: 'sans-serif', flexDirection: 'column', gap: '16px' }}>
      <div style={{ opacity: 0.5 }}><IconSearch size={40} /></div>
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
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '24px', marginBottom: '16px' } as any,
    label: { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' } as any,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: 'var(--text)' }}>

      {/* Top Nav */}
      <div className='portal-nav' style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--text)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-page)' }}><IconVideo size={17} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Studio Portal</div>
            <div className='portal-nav-sub' style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your private project dashboard</div>
          </div>
        </div>
        <div className='portal-nav-badge' style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-sec)', whiteSpace: 'nowrap' }}>
          <IconLock size={14} /> Private & secure
        </div>
      </div>

      <div className='portal-container' style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Hero */}
        <div className='portal-card' style={s.card}>
          <div className='portal-hero-badge' style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-sec)', letterSpacing: '1px', marginBottom: '16px' }}>
            <IconVideo size={12} /> VIDEO EDITING CLIENT
          </div>
          <h1 className='portal-hero-title' style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
            <span style={{ color: 'var(--text)' }}>{client.name}'s</span>{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Project Dashboard</span>
          </h1>
          <p className='portal-hero-sub' style={{ color: 'var(--text-muted)', fontSize: '15px', margin: '0 0 20px' }}>
            {client.channel_name || 'Your Studio'} — all your projects and updates in one place
          </p>
          <div className='portal-hero-meta' style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {client.email && <span style={{ fontSize: '13px', color: 'var(--text-sec)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IconMail size={13} /> {client.email}</span>}
            {client.phone && <span style={{ fontSize: '13px', color: 'var(--text-sec)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IconPhone size={13} /> {client.phone_code ? `${client.phone_code} ` : ''}{client.phone}</span>}
            <span style={{ fontSize: '13px', color: '#4ade80' }}>● Active client</span>
          </div>
        </div>

        {/* Stats */}
        <div className='portal-stats' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'TOTAL PROJECTS', value: projects.length, sub: `${projects.filter(p => p.status === 'In Progress').length} active · ${projects.filter(p => p.status === 'Review').length} in review`, color: 'var(--text)' },
            { label: 'VERSIONS SENT', value: totalVersions, sub: 'Across all projects', color: '#60a5fa' },
            { label: 'AMOUNT DUE', value: `₹${totalPending.toLocaleString()}`, sub: `${projects.filter(p => p.payment_status !== 'Paid').length} invoices pending`, color: '#f87171' },
          ].map(card => (
            <div key={card.label} className='portal-card' style={{ ...s.card, marginBottom: 0 }}>
              <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '10px' }}>{card.label}</div>
              <div className='portal-stat' style={{ fontSize: '32px', fontWeight: 800, color: card.color, marginBottom: '4px' }}>{card.value}</div>
              <div className='portal-stat-sub' style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Project Tabs */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '10px' }}>YOUR PROJECTS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {projects.map(p => (
                <button key={p.id} onClick={() => setActiveProject(p)} className='portal-tab' style={{
                  padding: '8px 18px', borderRadius: '8px', border: '1px solid',
                  borderColor: activeProject?.id === p.id ? 'var(--text-dim)' : 'var(--border-card)',
                  background: activeProject?.id === p.id ? 'var(--border)' : 'transparent',
                  color: activeProject?.id === p.id ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                }}>{p.title}</button>
              ))}
            </div>
          </div>
        )}

        {/* Active Project */}
        {activeProject && (
          <div className='portal-card' style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <h2 className='portal-project-title' style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{activeProject.title}</h2>
              <span style={{
                fontSize: '12px', padding: '4px 14px', borderRadius: '20px', fontWeight: 600, border: '1px solid',
                borderColor: activeProject.status === 'Review' ? '#854d0e' : activeProject.status === 'Completed' ? '#166534' : '#1e3a5f',
                background: activeProject.status === 'Review' ? '#1c1200' : activeProject.status === 'Completed' ? '#052e16' : '#0c1a2e',
                color: activeProject.status === 'Review' ? '#fbbf24' : activeProject.status === 'Completed' ? '#4ade80' : '#60a5fa'
              }}>{activeProject.status}</span>
            </div>
            {activeProject.deadline && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Due <span style={{ color: '#f87171' }}>{activeProject.deadline}</span>
              </div>
            )}

            {/* Progress */}
            <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div className='portal-label' style={s.label}><IconChecklist size={13} /> PROJECT PROGRESS</div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '2px', background: 'var(--border-card)' }} />
                <div style={{ position: 'absolute', top: '10px', left: 0, height: '2px', background: 'var(--text)', width: `${((currentStep + 0.5) / progressSteps.length) * 100}%`, transition: 'width 0.4s' }} />
                {progressSteps.map((step, i) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', border: '2px solid',
                      borderColor: i <= currentStep ? 'var(--text)' : 'var(--border-input)',
                      background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {i < currentStep && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text)' }} />}
                      {i === currentStep && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text)' }} />}
                    </div>
                    <span className='portal-step' style={{ fontSize: '11px', color: i <= currentStep ? 'var(--text)' : 'var(--text-muted)', fontWeight: i === currentStep ? 600 : 400, textAlign: 'center' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version History */}
            {activeVersions.length > 0 && (
              <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div className='portal-label' style={s.label}><IconFolder size={13} /> VERSION HISTORY — {activeVersions.length} DRAFTS SENT</div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '1px', background: 'var(--border-card)' }} />
                  {[...Array(3)].map((_, i) => {
                    const ver = activeVersions[i]
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: ver ? 'var(--text)' : 'var(--bg-card)',
                          border: `2px solid ${ver ? 'var(--text)' : 'var(--border-input)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700, color: ver ? 'var(--bg-page)' : 'var(--text-muted)'
                        }}>v{i + 1}</div>
                        <span style={{ fontSize: '11px', color: ver ? 'var(--text-sec)' : 'var(--text-dim)' }}>{ver ? ver.sent_date || '—' : '—'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Revisions & Files */}
            <div className='grid-2col' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div>
                <div className='portal-label' style={s.label}><IconChat size={13} /> REVISION HISTORY</div>
                {activeRevisions.length === 0 ? (
                  <div className='portal-empty' style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    No revisions yet — your feedback will appear here.
                  </div>
                ) : activeRevisions.map((r, idx) => (
                  <div key={r.id} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '14px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: idx === 0 ? '#2563eb' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{activeRevisions.length - idx}</div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Round {activeRevisions.length - idx}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sec)', margin: '0 0 6px', paddingLeft: '30px' }}>{r.note}</p>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: '30px' }}>{r.created_date} · {r.status || 'Pending'}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className='portal-label' style={s.label}><IconFolderOpen size={13} /> FILES & DRAFTS</div>
                {activeFiles.length === 0 ? (
                  <div className='portal-empty' style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Your first draft will appear here once it's ready.
                  </div>
                ) : activeFiles.map(f => (
                  <a key={f.id} href={f.url} target='_blank' rel='noreferrer' style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px 14px',
                    textDecoration: 'none', marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        {f.type === 'Delivery' ? <IconVideo size={15} /> : f.type === 'Draft' ? <IconFileText size={15} /> : <IconFolder size={15} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{f.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.type}</div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoice */}
        {activeProject && (
          <div className='portal-card' style={s.card}>
            <div className='portal-label' style={s.label}><IconInvoices size={13} /> INVOICE & PAYMENT</div>
            <div className='portal-pay-grid stat-grid-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'PROJECT FEE', value: `₹${Number(activeProject.amount).toLocaleString()}`, color: 'var(--text)' },
                { label: 'AMOUNT PAID', value: `₹${activeProject.payment_status === 'Paid' ? Number(activeProject.amount).toLocaleString() : '0'}`, color: '#4ade80' },
                { label: 'BALANCE DUE', value: `₹${activeProject.payment_status === 'Paid' ? '0' : Number(activeProject.amount).toLocaleString()}`, color: '#f87171' },
                { label: 'PAYMENT STATUS', value: activeProject.payment_status, status: true },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>{item.label}</div>
                  {item.status ? (
                    <span style={{
                      fontSize: '13px', padding: '4px 14px', borderRadius: '20px', fontWeight: 600,
                      background: activeProject.payment_status === 'Paid' ? '#052e16' : activeProject.payment_status === 'Partial' ? '#1c1200' : '#1c0a0a',
                      color: activeProject.payment_status === 'Paid' ? '#4ade80' : activeProject.payment_status === 'Partial' ? '#fbbf24' : '#f87171',
                      border: '1px solid', borderColor: activeProject.payment_status === 'Paid' ? '#166534' : activeProject.payment_status === 'Partial' ? '#854d0e' : '#7f1d1d'
                    }}>{item.value}</span>
                  ) : (
                    <div className='portal-stat' style={{ fontSize: '24px', fontWeight: 800, color: item.color }}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
            {activeProject.deadline && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Due date: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{activeProject.deadline}</span>
              </div>
            )}
            {(() => {
              const linked = invoices.find(inv => inv.id === activeProject.invoice_id)
              if (linked) return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--text-sec)' }}>
                  <IconInvoices size={14} /> Included in the monthly invoice — {monthLabel(linked.month)}
                </div>
              )
              if (activeProject.invoice_pdf_url) return (
                <button onClick={() => setPreviewPdf(activeProject.invoice_pdf_url)}
                  style={{
                    width: '100%', background: 'var(--text)', border: 'none',
                    borderRadius: '10px', padding: '14px', color: 'var(--bg-page)', fontSize: '14px',
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxSizing: 'border-box', fontFamily: 'inherit'
                  }}>
                  <IconInvoices size={15} /> View Invoice PDF
                </button>
              )
              return null
            })()}
          </div>
        )}

        {/* Monthly invoices */}
        {invoices.length > 0 && (
          <div className='portal-card' style={s.card}>
            <div className='portal-label' style={s.label}><IconInvoices size={13} /> INVOICES</div>
            {invoices.map(inv => {
              const covered = projects.filter(p => p.invoice_id === inv.id)
              const paid = inv.status === 'Paid'
              return (
                <div key={inv.id} style={{ background: 'var(--bg-surface)', borderRadius: '10px', padding: '16px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{monthLabel(inv.month)}</span>
                    <span style={{
                      fontSize: '12px', padding: '3px 12px', borderRadius: '20px', fontWeight: 600, border: '1px solid',
                      background: paid ? '#052e16' : '#1c0a0a',
                      color: paid ? '#4ade80' : '#f87171',
                      borderColor: paid ? '#166534' : '#7f1d1d'
                    }}>{paid ? 'Paid' : 'Unpaid'}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '16px', fontWeight: 800 }}>₹{Number(inv.amount).toLocaleString()}</span>
                  </div>
                  {covered.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Covers {covered.length} project{covered.length > 1 ? 's' : ''}: {covered.map(p => p.title).join(', ')}
                    </div>
                  )}
                  {inv.pdf_url && (
                    <button onClick={() => setPreviewPdf(inv.pdf_url)}
                      style={{
                        width: '100%', background: 'var(--text)', border: 'none', borderRadius: '8px', padding: '11px',
                        color: 'var(--bg-page)', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxSizing: 'border-box', marginTop: '12px', fontFamily: 'inherit'
                      }}>
                      <IconInvoices size={14} /> View Invoice PDF
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* PDF preview overlay */}
        {previewPdf && (
          <div
            onClick={() => setPreviewPdf(null)}
            style={{
              position: 'fixed', inset: 0, background: 'var(--bg-page)', zIndex: 100,
              display: 'flex', flexDirection: 'column', padding: '12px', boxSizing: 'border-box'
            }}>
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 4px 10px' }}>
                <a href={driveDownload(previewPdf)} target='_blank' rel='noopener noreferrer'
                  style={{ fontSize: '12px', fontWeight: 600, color: 'var(--bg-page)', background: 'var(--text)', textDecoration: 'none', borderRadius: '20px', padding: '6px 14px', whiteSpace: 'nowrap' }}>
                  ↓ Download
                </a>
                <a href={previewPdf} target='_blank' rel='noopener noreferrer'
                  style={{ fontSize: '12px', color: 'var(--text-sec)', textDecoration: 'none', border: '1px solid var(--border-input)', borderRadius: '20px', padding: '6px 12px', whiteSpace: 'nowrap' }}>
                  Open in Drive ↗
                </a>
                <button onClick={() => setPreviewPdf(null)}
                  style={{
                    marginLeft: 'auto', background: 'var(--border)', border: '1px solid var(--border-input)', color: 'var(--text)',
                    borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px',
                    cursor: 'pointer', lineHeight: 1, flexShrink: 0
                  }}>✕</button>
              </div>

              <iframe
                src={drivePreview(previewPdf)}
                title='Invoice PDF'
                style={{ flex: 1, width: '100%', border: 'none', borderRadius: '10px', background: 'var(--text)', minHeight: 0 }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px', marginTop: '24px', padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <IconLock size={12} /> This is your private portal — only you can see this page · Studio Portal by Ayush Siddhapura
        </div>
      </div>
    </div>
  )
}