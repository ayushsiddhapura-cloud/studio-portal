'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '📊' },
  { label: 'Clients', href: '/admin/clients', icon: '👥' },
  { label: 'Projects', href: '/admin/projects', icon: '🎬' },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾' },
  { label: 'Files', href: '/admin/files', icon: '📁' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [revisions, setRevisions] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editNote, setEditNote] = useState(false)
  const [note, setNote] = useState('')
  const [newRevision, setNewRevision] = useState('')
  const [showRevForm, setShowRevForm] = useState(false)
  const [newFile, setNewFile] = useState({ name: '', url: '', type: 'Draft' })
  const [showFileForm, setShowFileForm] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => { fetchAll() }, [id])

  async function fetchAll() {
    const { data: p } = await supabase.from('projects').select('*, clients(*)').eq('id', id).single()
    if (!p) { setLoading(false); return }
    setProject(p)
    setClient(p.clients)
    setNote(p.clients?.notes || '')
    setEditForm({
      title: p.title, status: p.status, deadline: p.deadline,
      amount: p.amount, payment_status: p.payment_status, invoice_pdf_url: p.invoice_pdf_url || ''
    })
    const { data: f } = await supabase.from('files').select('*').eq('project_id', id).order('created_at', { ascending: false })
    const { data: r } = await supabase.from('revisions').select('*').eq('project_id', id).order('created_at', { ascending: false })
    if (f) setFiles(f)
    if (r) setRevisions(r)
    setActivity(buildActivity(p, f || [], r || []))
    setLoading(false)
  }

  function buildActivity(p: any, f: any[], r: any[]) {
    const items: any[] = []
    f.forEach(file => items.push({ label: `${file.name} uploaded`, time: file.created_at }))
    r.forEach(rev => items.push({ label: `Round ${rev.round_number || '?'} feedback received`, time: rev.created_at }))
    if (p.created_at) items.push({ label: 'Project created', time: p.created_at })
    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6)
  }

  async function saveEdit() {
    await supabase.from('projects').update({ ...editForm, amount: parseFloat(editForm.amount) || 0 }).eq('id', id)
    setEditMode(false)
    fetchAll()
  }

  async function saveNote() {
    await supabase.from('clients').update({ notes: note }).eq('id', client.id)
    setEditNote(false)
    fetchAll()
  }

  async function addRevision() {
    if (!newRevision.trim()) return
    await supabase.from('revisions').insert([{
      project_id: id, note: newRevision,
      round_number: revisions.length + 1, status: 'Pending'
    }])
    setNewRevision('')
    setShowRevForm(false)
    fetchAll()
  }

  async function addFile() {
    if (!newFile.name.trim() || !newFile.url.trim()) return
    await supabase.from('files').insert([{ ...newFile, project_id: id }])
    setNewFile({ name: '', url: '', type: 'Draft' })
    setShowFileForm(false)
    fetchAll()
  }

  async function deleteProject() {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await supabase.from('projects').delete().eq('id', id)
    router.push('/admin/projects')
  }

  function formatDate(d: string) {
    if (!d) return '—'
    const date = new Date(d)
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`
  }

  function formatTime(d: string) {
    if (!d) return ''
    const date = new Date(d)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function isOverdue(deadline: string) { return deadline && new Date(deadline) < new Date() }

  const fileIcon: any = { Draft: '🟦', Delivery: '🟩', Reference: '🟧', Brief: '🟨' }

  const inp: any = { width: '100%', background: '#2a2a2a', border: '1px solid #333', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }
  const lbl: any = { fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.05em' }

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif' }}>Loading...</div>
  if (!project) return <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontFamily: 'sans-serif' }}>Project not found.</div>

  const progressPct = revisions.length > 0
    ? Math.min(100, Math.round((revisions.filter((r: any) => r.status === 'Done').length / Math.max(revisions.length, 1)) * 100))
    : project.status === 'Completed' ? 100 : project.status === 'Review' ? 66 : project.status === 'Revision' ? 50 : 30

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

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: '#161616', borderBottom: '1px solid #222', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href='/admin/projects' style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Projects</Link>
          <span style={{ color: '#333' }}>›</span>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{project.title}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={() => setEditMode(true)} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#aaa', padding: '7px 16px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⊞ Edit
            </button>
            <button onClick={() => setShowFileForm(true)} style={{ background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#aaa', padding: '7px 16px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⊞ Upload file
            </button>
            <button onClick={deleteProject} style={{ background: 'transparent', border: '1px solid #3b1f1f', borderRadius: '8px', color: '#f87171', padding: '7px 16px', fontSize: '13px', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Project info card */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>{project.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                      {client?.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: '14px', color: '#aaa' }}>{client?.name} · {client?.channel_name || client?.email || ''}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '13px', padding: '6px 14px', borderRadius: '20px', fontWeight: 600,
                  background: project.status === 'Completed' ? '#14532d' : project.status === 'Review' ? '#3b2f00' : project.status === 'Revision' ? '#3b1f1f' : '#1e3a5f',
                  color: project.status === 'Completed' ? '#4ade80' : project.status === 'Review' ? '#fbbf24' : project.status === 'Revision' ? '#f87171' : '#60a5fa'
                }}>{project.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {[
                  { label: 'START DATE', value: formatDate(project.created_at) },
                  { label: 'DEADLINE', value: formatDate(project.deadline), red: isOverdue(project.deadline) },
                  { label: 'REVISIONS', value: `${revisions.length} of 3 used` },
                  { label: 'QUOTED PRICE', value: `₹${Number(project.amount).toLocaleString()}` },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '10px', color: '#555', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: item.red ? '#ef4444' : '#fff' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ height: '6px', background: '#2a2a2a', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, background: '#3b82f6', borderRadius: '3px', transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#555' }}>Project progress — {progressPct}%</div>
              </div>
            </div>

            {/* Revision history */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Revision history</h3>
                <button onClick={() => setShowRevForm(!showRevForm)} style={{ background: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', color: '#aaa', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⊞ Add round
                </button>
              </div>

              {showRevForm && (
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <input value={newRevision} onChange={e => setNewRevision(e.target.value)}
                    placeholder='Describe the revision feedback...'
                    style={{ ...inp, flex: 1 }} />
                  <button onClick={addRevision} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Add</button>
                  <button onClick={() => setShowRevForm(false)} style={{ background: 'transparent', color: '#555', border: '1px solid #333', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                </div>
              )}

              {revisions.length === 0 ? (
                <div style={{ color: '#555', fontSize: '14px', padding: '16px 0' }}>No revisions yet.</div>
              ) : revisions.map((r: any, i: number) => (
                <div key={r.id} style={{ borderTop: i > 0 ? '1px solid #222' : 'none', paddingTop: i > 0 ? '16px' : '0', marginTop: i > 0 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Round {r.round_number || revisions.length - i}</span>
                    <span style={{ fontSize: '12px', color: '#555' }}>{formatDate(r.created_at)}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 6px', lineHeight: 1.5 }}>{r.note}</p>
                  <span style={{ fontSize: '12px', color: '#555' }}>Submitted by client</span>
                </div>
              ))}
            </div>

            {/* Files */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Files</h3>
                <span style={{ fontSize: '13px', color: '#555' }}>{files.length} files</span>
              </div>

              {showFileForm && (
                <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input value={newFile.name} onChange={e => setNewFile({ ...newFile, name: e.target.value })} placeholder='File name (e.g. brand_intro_v1.mp4)' style={inp} />
                  <input value={newFile.url} onChange={e => setNewFile({ ...newFile, url: e.target.value })} placeholder='URL (Google Drive, WeTransfer, etc.)' style={inp} />
                  <select value={newFile.type} onChange={e => setNewFile({ ...newFile, type: e.target.value })} style={{ ...inp }}>
                    {['Draft', 'Delivery', 'Reference', 'Brief'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addFile} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Add file</button>
                    <button onClick={() => setShowFileForm(false)} style={{ background: 'transparent', color: '#555', border: '1px solid #333', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              {files.length === 0 ? (
                <div style={{ color: '#555', fontSize: '14px', padding: '16px 0' }}>No files uploaded yet.</div>
              ) : files.map((f: any) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #222' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {fileIcon[f.type] || '📄'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{f.type} · {formatDate(f.created_at)}</div>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                    background: f.type === 'Delivery' ? '#14532d' : f.type === 'Draft' ? '#1e3a5f' : '#2a2a2a',
                    color: f.type === 'Delivery' ? '#4ade80' : f.type === 'Draft' ? '#60a5fa' : '#aaa'
                  }}>{f.type}</span>
                  <a href={f.url} target='_blank' rel='noreferrer' style={{ color: '#555', fontSize: '16px', textDecoration: 'none' }}>↗</a>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Payment */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Payment</h3>
              {[
                { label: 'Amount', value: `₹${Number(project.amount).toLocaleString()}` },
                { label: 'Status', value: project.payment_status, badge: true },
                { label: 'Due date', value: formatDate(project.deadline) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' }}>
                  <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
                  {item.badge ? (
                    <span style={{
                      fontSize: '12px', padding: '3px 12px', borderRadius: '20px', fontWeight: 600,
                      background: project.payment_status === 'Paid' ? '#14532d' : project.payment_status === 'Partial' ? '#3b2f00' : '#3b2f00',
                      color: project.payment_status === 'Paid' ? '#4ade80' : project.payment_status === 'Partial' ? '#fbbf24' : '#fbbf24'
                    }}>{item.value}</span>
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{item.value}</span>
                  )}
                </div>
              ))}
              {project.invoice_pdf_url ? (
                <a href={project.invoice_pdf_url} target='_blank' rel='noreferrer' style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  width: '100%', marginTop: '14px', background: '#2a2a2a', color: '#fff',
                  border: '1px solid #333', borderRadius: '8px', padding: '11px',
                  fontSize: '13px', fontWeight: 600, textDecoration: 'none', boxSizing: 'border-box'
                }}>⊞ View invoice PDF ↗</a>
              ) : (
                <button onClick={() => setEditMode(true)} style={{
                  width: '100%', marginTop: '14px', background: '#2a2a2a', color: '#aaa',
                  border: '1px solid #333', borderRadius: '8px', padding: '11px',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}>⊞ Add invoice PDF link</button>
              )}
            </div>

            {/* Admin notes */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>Admin notes</h3>
              {editNote ? (
                <>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
                    style={{ ...inp, resize: 'vertical', marginBottom: '10px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={saveNote} style={{ flex: 1, background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                    <button onClick={() => setEditNote(false)} style={{ flex: 1, background: 'transparent', color: '#555', border: '1px solid #333', borderRadius: '6px', padding: '8px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '13px', color: note ? '#aaa' : '#555', lineHeight: 1.6, margin: '0 0 14px' }}>
                    {note || 'No notes yet. Click Edit note to add private notes about this client.'}
                  </p>
                  <button onClick={() => setEditNote(true)} style={{
                    width: '100%', background: '#2a2a2a', color: '#aaa',
                    border: '1px solid #333', borderRadius: '8px', padding: '10px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}>⊞ Edit note</button>
                </>
              )}
            </div>

            {/* Activity log */}
            <div style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Activity log</h3>
              {activity.length === 0 ? (
                <div style={{ color: '#555', fontSize: '13px' }}>No activity yet.</div>
              ) : activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333', border: '2px solid #555', flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <div style={{ fontSize: '13px', color: '#aaa' }}>{a.label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{formatTime(a.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <>
          <div onClick={() => setEditMode(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '460px', background: '#1c1c1c', border: '1px solid #333', borderRadius: '14px', padding: '28px', zIndex: 50 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Edit project</h2>
              <button onClick={() => setEditMode(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={lbl}>TITLE</label><input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>STATUS</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} style={{ ...inp }}>
                    {['In Progress', 'Review', 'Revision', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>PAYMENT STATUS</label>
                  <select value={editForm.payment_status} onChange={e => setEditForm({ ...editForm, payment_status: e.target.value })} style={{ ...inp }}>
                    {['Pending', 'Paid', 'Partial'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>DEADLINE</label>
                  <input type='date' value={editForm.deadline} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={lbl}>AMOUNT (₹)</label>
                  <input value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={inp} />
                </div>
              </div>
              <div>
                <label style={lbl}>INVOICE PDF URL</label>
                <input value={editForm.invoice_pdf_url} onChange={e => setEditForm({ ...editForm, invoice_pdf_url: e.target.value })} placeholder='https://drive.google.com/...' style={inp} />
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button onClick={saveEdit} style={{ flex: 1, background: '#fff', color: '#000', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Save changes</button>
                <button onClick={() => setEditMode(false)} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}