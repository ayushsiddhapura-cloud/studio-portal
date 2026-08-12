'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IconLock, IconSearch, IconMail, IconPhone, IconVideo, IconInvoices, IconChat } from '@/lib/icons'
import { drivePreview, driveDownload, driveThumbnail } from '@/lib/drive'

function monthLabel(m: string) {
  if (!m) return '—'
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1).toLocaleString('default', { month: 'long' }) + ' ' + y
}

function dateLabel(d: string) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getDate()} ${dt.toLocaleString('default', { month: 'short' })} ${dt.getFullYear()}`
}

function timeAgo(iso: string) {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  return dateLabel(iso)
}

const STATUS_STYLE: any = {
  'In Progress': { bg: '#0c1a2e', color: '#60a5fa', border: '#1e3a5f', label: 'In progress' },
  'Review': { bg: '#1c1200', color: '#fbbf24', border: '#854d0e', label: 'In review' },
  'Revision': { bg: '#1c0a0a', color: '#f87171', border: '#7f1d1d', label: 'Revision' },
  'Completed': { bg: '#052e16', color: '#4ade80', border: '#166534', label: 'Delivered' },
}

export default function ClientPortalPage() {
  const { token } = useParams()
  const [client, setClient] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [revisions, setRevisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Draft review overlay
  const [activeDraft, setActiveDraft] = useState<any>(null)
  const [feedback, setFeedback] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Invoice PDF overlay
  const [previewPdf, setPreviewPdf] = useState<string | null>(null)

  // PIN protection
  const [pinRequired, setPinRequired] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinUnlocked, setPinUnlocked] = useState(false)

  const refreshTimer = useRef<any>(null)

  useEffect(() => { fetchClient() }, [token])

  // Live updates: Supabase pushes row changes over a websocket so a new draft
  // or invoice appears without the client reloading. Subscriptions are scoped
  // to this client's rows, so no other client's events reach this browser.
  // ponytail: every event just refetches — payloads aren't needed and a refetch
  // keeps derived state consistent. Debounced so a burst of edits is one fetch.
  const projectIds = projects.map(p => p.id).join(',')
  useEffect(() => {
    if (!client?.id || pinRequired) return

    function scheduleRefresh() {
      clearTimeout(refreshTimer.current)
      refreshTimer.current = setTimeout(() => loadPortalData(client), 400)
    }

    const channel = supabase.channel(`portal-${client.id}`)
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `client_id=eq.${client.id}` }, scheduleRefresh)
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `client_id=eq.${client.id}` }, scheduleRefresh)
    // files/revisions carry project_id, not client_id — one listener per project
    projectIds.split(',').filter(Boolean).forEach(id => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'files', filter: `project_id=eq.${id}` }, scheduleRefresh)
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'revisions', filter: `project_id=eq.${id}` }, scheduleRefresh)
    })
    channel.subscribe()

    // Safety net: phones drop websockets on sleep, so resync on return.
    function onVisible() { if (document.visibilityState === 'visible') scheduleRefresh() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)

    return () => {
      clearTimeout(refreshTimer.current)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      supabase.removeChannel(channel)
    }
  }, [client?.id, pinRequired, projectIds])

  async function fetchClient() {
    const { data: clientData } = await supabase
      .from('clients').select('*').eq('token', token).single()
    if (!clientData) { setNotFound(true); setLoading(false); return }
    setClient(clientData)

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
      .from('projects').select('*').eq('client_id', clientData.id).order('created_at', { ascending: false })
    if (projectData) {
      setProjects(projectData)
      const ids = projectData.map((p: any) => p.id)
      if (ids.length > 0) {
        const { data: fileData } = await supabase.from('files').select('*').in('project_id', ids).order('created_at', { ascending: false })
        const { data: revData } = await supabase.from('revisions').select('*').in('project_id', ids).order('created_at', { ascending: false })
        if (fileData) setFiles(fileData)
        if (revData) setRevisions(revData)
      }
    }
    setLoading(false)
  }

  async function refreshRevisions() {
    const ids = projects.map(p => p.id)
    if (!ids.length) return
    const { data } = await supabase.from('revisions').select('*').in('project_id', ids).order('created_at', { ascending: false })
    if (data) setRevisions(data)
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

  function openDraft(file: any, project: any) {
    setActiveDraft({ file, project })
    setFeedback('')
    setSent(false)
  }

  async function sendFeedback() {
    const note = feedback.trim()
    if (!note || !activeDraft) return
    setSending(true)
    const round = revisions.filter(r => r.project_id === activeDraft.project.id).length + 1
    const { error } = await supabase.from('revisions').insert([{
      project_id: activeDraft.project.id,
      note,
      round_number: round,
      status: 'Pending',
    }])
    setSending(false)
    if (error) { alert('Could not send your feedback. Please try again.'); return }
    setFeedback('')
    setSent(true)
    await refreshRevisions()
  }

  // ── PIN SCREEN ──
  if (pinRequired && !pinUnlocked) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '16px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '36px 28px', width: '100%', maxWidth: '340px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', color: 'var(--text)' }}><IconLock size={32} /></div>
        <h2 style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>Portal Protected</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 24px' }}>Enter your PIN to access your project portal</p>
        <input
          type="password"
          value={pinInput}
          onChange={e => setPinInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
          placeholder="Enter PIN"
          maxLength={6}
          style={{ width: '100%', background: 'var(--bg-page)', border: '1px solid var(--border-input)', borderRadius: '10px', padding: '13px', color: 'var(--text)', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        {pinError && <p style={{ color: '#f87171', fontSize: '12px', margin: '0 0 12px' }}>{pinError}</p>}
        <button onClick={handlePinSubmit} style={{ width: '100%', background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Unlock Portal →
        </button>
        <p style={{ color: 'var(--text-dim)', fontSize: '11px', marginTop: '18px' }}>Contact your studio if you forgot your PIN</p>
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

  const totalPending = projects.reduce((s, p) => p.payment_status !== 'Paid' ? s + Number(p.amount || 0) : s, 0)
  const unpaidInvoices = invoices.filter(i => i.status !== 'Paid').length
  const activeCount = projects.filter(p => p.status !== 'Completed').length
  const draftsFor = (id: string) => files.filter(f => f.project_id === id)
  const notesFor = (id: string) => revisions.filter(r => r.project_id === id)

  const s = {
    card: { background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '24px', marginBottom: '16px' } as any,
    label: { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' } as any,
    sectionLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '4px 2px 10px' } as any,
  }

  const draftNotes = activeDraft ? notesFor(activeDraft.project.id) : []

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
          <IconLock size={14} /> Private &amp; secure
        </div>
      </div>

      <div className='portal-container' style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Identity */}
        <div className='portal-card' style={s.card}>
          <div className='portal-hero-badge' style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-sec)', letterSpacing: '1px', marginBottom: '16px' }}>
            <IconVideo size={12} /> VIDEO EDITING
          </div>
          <h1 className='portal-hero-title' style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
            <span style={{ color: 'var(--text)' }}>{client.name}&apos;s</span>{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Project Dashboard</span>
          </h1>
          <p className='portal-hero-sub' style={{ color: 'var(--text-muted)', fontSize: '15px', margin: '0 0 20px' }}>
            {client.channel_name || 'Your Studio'} — all your projects and updates in one place
          </p>
          <div className='portal-hero-meta' style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {client.email && <span style={{ fontSize: '13px', color: 'var(--text-sec)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IconMail size={13} /> {client.email}</span>}
            {client.phone && <span style={{ fontSize: '13px', color: 'var(--text-sec)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IconPhone size={13} /> {client.phone_code ? `${client.phone_code} ` : ''}{client.phone}</span>}
          </div>
        </div>

        {/* Drafts — one card per project */}
        {projects.length > 0 && <div className='portal-sec' style={s.sectionLabel}>Your drafts</div>}

        {projects.map(p => {
          const st = STATUS_STYLE[p.status] || { bg: 'var(--bg-input)', color: 'var(--text-sec)', border: 'var(--border-input)', label: p.status }
          const drafts = draftsFor(p.id)
          const notes = notesFor(p.id)
          return (
            <div key={p.id} className='portal-card' style={{ ...s.card, padding: '0', overflow: 'hidden' }}>

              <div className='portal-proj-head' style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '18px 18px 14px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 className='portal-project-title' style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3 }}>{p.title}</h2>
                  {p.deadline && (
                    <div className='portal-meta' style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Due <span style={{ color: '#f87171' }}>{dateLabel(p.deadline)}</span>
                    </div>
                  )}
                </div>
                <span className='portal-status' style={{
                  flexShrink: 0, fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                  border: '1px solid', background: st.bg, color: st.color, borderColor: st.border, whiteSpace: 'nowrap'
                }}>{st.label}</span>
              </div>

              {drafts.length === 0 ? (
                <div className='portal-nodraft' style={{ margin: '0 18px 18px', padding: '20px 14px', border: '1px dashed var(--border-card)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Your first draft will appear here once it&apos;s ready.
                </div>
              ) : drafts.map(f => (
                <button key={f.id} onClick={() => openDraft(f, p)} className='portal-reel' style={{
                  display: 'flex', gap: '14px', alignItems: 'stretch', textAlign: 'left',
                  width: 'calc(100% - 36px)', margin: '0 18px 14px', padding: '14px',
                  background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '12px',
                  cursor: 'pointer', color: 'inherit', font: 'inherit', boxSizing: 'border-box',
                }}>
                  <div className='portal-poster' style={{
                    position: 'relative', width: '72px', height: '110px', borderRadius: '10px', flexShrink: 0,
                    background: 'linear-gradient(150deg, #2b3a3f 0%, #16202a 55%, #0d1116 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  }}>
                    {driveThumbnail(f.url, 240) && (
                      <img src={driveThumbnail(f.url, 240)} alt='' loading='lazy'
                        referrerPolicy='no-referrer'
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    <span style={{ position: 'relative', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="#000"><path d="M3 1.6l7 4.4-7 4.4z" /></svg>
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div className='portal-meta' style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'auto' }}>
                      {f.type || 'Draft'}{f.created_at ? ` · Sent ${timeAgo(f.created_at)}` : ''}
                    </div>
                    <span className='portal-watch' style={{
                      marginTop: '12px', background: 'var(--text)', color: 'var(--bg-page)', borderRadius: '8px',
                      padding: '9px', fontSize: '13px', fontWeight: 700, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: '7px',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.6l7 4.4-7 4.4z" /></svg>
                      Watch &amp; review
                    </span>
                  </div>
                </button>
              ))}

              {drafts.length > 0 && (
                <div className='portal-meta' style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 18px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <IconChat size={12} />
                  {notes.length === 0
                    ? 'No feedback yet — tap to watch and share your notes'
                    : `${notes.length} note${notes.length > 1 ? 's' : ''} sent`}
                </div>
              )}
            </div>
          )
        })}

        {/* Summary */}
        <div className='portal-sec' style={s.sectionLabel}>Summary</div>
        <div className='portal-stats' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className='portal-card' style={{ ...s.card, marginBottom: 0 }}>
            <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '10px' }}>TOTAL PROJECTS</div>
            <div className='portal-stat' style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{projects.length}</div>
            <div className='portal-stat-sub' style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeCount} active</div>
          </div>
          <div className='portal-card' style={{ ...s.card, marginBottom: 0 }}>
            <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '10px' }}>AMOUNT DUE</div>
            <div className='portal-stat' style={{ fontSize: '28px', fontWeight: 800, color: '#f87171', marginBottom: '4px' }}>₹{totalPending.toLocaleString()}</div>
            <div className='portal-stat-sub' style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{unpaidInvoices} invoice{unpaidInvoices === 1 ? '' : 's'} pending</div>
          </div>
        </div>

        {/* Billing */}
        {(projects.length > 0 || invoices.length > 0) && (
          <>
            <div className='portal-sec' style={s.sectionLabel}>Billing</div>
            <div className='portal-card' style={s.card}>
              {projects.map(p => (
                <div key={p.id} className='portal-bill-row' style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: 'var(--text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                  <span className='portal-status' style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 9px', borderRadius: '20px', whiteSpace: 'nowrap',
                    background: p.payment_status === 'Paid' ? '#052e16' : '#1c0a0a',
                    color: p.payment_status === 'Paid' ? '#4ade80' : '#f87171',
                  }}>{p.payment_status === 'Paid' ? 'Paid' : 'Due'}</span>
                  <b style={{ fontWeight: 700 }}>₹{Number(p.amount || 0).toLocaleString()}</b>
                </div>
              ))}

              {invoices.map(inv => {
                const covered = projects.filter(p => p.invoice_id === inv.id)
                const paid = inv.status === 'Paid'
                return (
                  <div key={inv.id} style={{ background: 'var(--bg-surface)', borderRadius: '10px', padding: '14px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{monthLabel(inv.month)}</span>
                      <span className='portal-status' style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '20px', border: '1px solid',
                        background: paid ? '#052e16' : '#1c0a0a', color: paid ? '#4ade80' : '#f87171',
                        borderColor: paid ? '#166534' : '#7f1d1d',
                      }}>{paid ? 'Paid' : 'Unpaid'}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '15px', fontWeight: 800 }}>₹{Number(inv.amount).toLocaleString()}</span>
                    </div>
                    {covered.length > 0 && (
                      <div className='portal-meta' style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Covers {covered.length} project{covered.length > 1 ? 's' : ''}: {covered.map(p => p.title).join(', ')}
                      </div>
                    )}
                    {inv.pdf_url && (
                      <button onClick={() => setPreviewPdf(inv.pdf_url)} style={{
                        width: '100%', marginTop: '12px', background: 'var(--text)', color: 'var(--bg-page)',
                        border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
                      }}>
                        <IconInvoices size={14} /> View invoice PDF
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Draft review overlay — video + feedback */}
        {activeDraft && (
          <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-page)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <button onClick={() => setActiveDraft(null)} aria-label='Close' style={{
                width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-input)',
                border: '1px solid var(--border-input)', color: 'var(--text)', cursor: 'pointer',
                fontSize: '15px', lineHeight: 1, flexShrink: 0,
              }}>✕</button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeDraft.file.name}</div>
                <div className='portal-meta' style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeDraft.project.title}</div>
              </div>
              <a href={driveDownload(activeDraft.file.url)} target='_blank' rel='noopener noreferrer' style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--text-sec)', textDecoration: 'none',
                border: '1px solid var(--border-input)', borderRadius: '20px', padding: '6px 12px', whiteSpace: 'nowrap',
              }}>Download</a>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div className='portal-review-grid'>

                {/* Video — the main event */}
                <div className='portal-review-video' style={{ minWidth: 0 }}>
                  <div className='portal-stage' style={{ aspectRatio: '9 / 16', height: 'min(78vh, 760px)', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                    <iframe
                      src={drivePreview(activeDraft.file.url)}
                      title={activeDraft.file.name}
                      allow='autoplay'
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  </div>
                </div>

                {/* Project information */}
                <div className='portal-review-side' style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <aside className='portal-review-info' style={{ minWidth: 0 }}>
                  <div className='portal-card' style={{ ...s.card, marginBottom: 0 }}>
                    <div style={s.label}>PROJECT</div>
                    <div className='portal-project-title' style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.3, marginBottom: '14px' }}>
                      {activeDraft.project.title}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '6px' }}>STATUS</div>
                        {(() => {
                          const st = STATUS_STYLE[activeDraft.project.status] || { bg: 'var(--bg-input)', color: 'var(--text-sec)', border: 'var(--border-input)', label: activeDraft.project.status }
                          return (
                            <span className='portal-status' style={{
                              display: 'inline-block', fontSize: '12px', fontWeight: 600, padding: '4px 12px',
                              borderRadius: '20px', border: '1px solid', background: st.bg, color: st.color, borderColor: st.border,
                            }}>{st.label}</span>
                          )
                        })()}
                      </div>

                      {activeDraft.project.deadline && (
                        <div>
                          <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '6px' }}>DUE DATE</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>{dateLabel(activeDraft.project.deadline)}</div>
                        </div>
                      )}

                      <div>
                        <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '6px' }}>DRAFT</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{activeDraft.file.name}</div>
                        <div className='portal-meta' style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {activeDraft.file.type || 'Draft'}{activeDraft.file.created_at ? ` · sent ${timeAgo(activeDraft.file.created_at)}` : ''}
                        </div>
                      </div>

                      <div>
                        <div className='portal-stat-label' style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '6px' }}>FEEDBACK</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-sec)' }}>
                          {draftNotes.length === 0 ? 'No notes sent yet' : `${draftNotes.length} note${draftNotes.length > 1 ? 's' : ''} sent`}
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Review — feedback + notes, under the video */}
                <div className='portal-review-notes' style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={s.label}><IconChat size={13} /> YOUR FEEDBACK</div>
                    <textarea
                      value={feedback}
                      onChange={e => { setFeedback(e.target.value); setSent(false) }}
                      placeholder='Type your notes — e.g. “Trim the intro, and the logo at 0:12 feels rushed.”'
                      rows={4}
                      style={{
                        width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                        borderRadius: '10px', padding: '12px', color: 'var(--text)', fontSize: '14px',
                        fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    <button onClick={sendFeedback} disabled={sending || !feedback.trim()} style={{
                      width: '100%', marginTop: '10px', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700,
                      border: 'none', fontFamily: 'inherit',
                      background: feedback.trim() && !sending ? 'var(--text)' : 'var(--bg-input)',
                      color: feedback.trim() && !sending ? 'var(--bg-page)' : 'var(--text-dim)',
                      cursor: feedback.trim() && !sending ? 'pointer' : 'not-allowed',
                    }}>
                      {sending ? 'Sending...' : 'Send feedback'}
                    </button>
                    <div className='portal-meta' style={{ fontSize: '11px', color: sent ? '#4ade80' : 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                      {sent ? 'Feedback sent — your editor has been notified.' : 'Your editor is notified the moment you send this.'}
                    </div>
                  </div>

                  <div>
                    <div style={s.label}><IconChat size={13} /> NOTES ON THIS PROJECT</div>
                    {draftNotes.length === 0 ? (
                      <div className='portal-empty' style={{ background: 'var(--bg-surface)', borderRadius: '10px', padding: '16px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                        No notes yet — your feedback will appear here.
                      </div>
                    ) : draftNotes.map(r => (
                      <div key={r.id} style={{ background: 'var(--bg-surface)', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>Round {r.round_number || '—'}</span>
                          <span className='portal-status' style={{
                            fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                            background: r.status === 'Done' ? '#052e16' : '#1c1200',
                            color: r.status === 'Done' ? '#4ade80' : '#fbbf24',
                          }}>{r.status || 'Pending'}</span>
                          <span className='portal-meta' style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-dim)' }}>{timeAgo(r.created_at)}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-sec)', lineHeight: 1.55 }}>{r.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* Invoice PDF overlay */}
        {previewPdf && (
          <div onClick={() => setPreviewPdf(null)} style={{
            position: 'fixed', inset: 0, background: 'var(--bg-page)', zIndex: 100,
            display: 'flex', flexDirection: 'column', padding: '12px', boxSizing: 'border-box',
          }}>
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 4px 10px' }}>
                <a href={driveDownload(previewPdf)} target='_blank' rel='noopener noreferrer'
                  style={{ fontSize: '12px', fontWeight: 600, color: 'var(--bg-page)', background: 'var(--text)', textDecoration: 'none', borderRadius: '20px', padding: '6px 14px', whiteSpace: 'nowrap' }}>
                  ↓ Download
                </a>
                <a href={previewPdf} target='_blank' rel='noopener noreferrer'
                  style={{ fontSize: '12px', color: 'var(--text-sec)', textDecoration: 'none', border: '1px solid var(--border-input)', borderRadius: '20px', padding: '6px 12px', whiteSpace: 'nowrap' }}>
                  Open in Drive ↗
                </a>
                <button onClick={() => setPreviewPdf(null)} style={{
                  marginLeft: 'auto', background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text)',
                  borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', lineHeight: 1, flexShrink: 0,
                }}>✕</button>
              </div>
              <iframe src={drivePreview(previewPdf)} title='Invoice PDF'
                style={{ flex: 1, width: '100%', border: 'none', borderRadius: '10px', background: '#fff', minHeight: 0 }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className='portal-footer' style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px', marginTop: '24px', padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <IconLock size={12} /> This is your private portal — only you can see this page · Studio Portal by Ayush Siddhapura
        </div>
      </div>
    </div>
  )
}
