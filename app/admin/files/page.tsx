'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/lib/sidebar'
import { IconSearch, IconPlus, IconUpload, IconFolder, IconCloud, IconVideo, IconFileText, IconLink, IconInvoices } from '@/lib/icons'

const typeConfig: any = {
  'Delivery': { bg: '#14532d', color: '#4ade80' },
  'Draft':    { bg: '#1e3a5f', color: '#60a5fa' },
  'Reference':{ bg: '#3b2f00', color: '#fbbf24' },
  'Brief':    { bg: '#3b1f3b', color: '#c084fc' },
  'Invoice':  { bg: '#1f2f3b', color: '#67e8f9' },
}

export default function FilesPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [tab, setTab] = useState<'link' | 'upload'>('link')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ project_id: '', name: '', url: '', type: 'Draft' })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: p } = await supabase.from('projects').select('id, title, clients(name)')
    const { data: f } = await supabase.from('files').select('*, projects(title, clients(name))').order('created_at', { ascending: false })
    if (p) setProjects(p)
    if (f) setFiles(f)
    setLoading(false)
  }

  async function addFile() {
    if (!form.name || !form.project_id || !form.url) return alert('Please fill in all fields')
    setSaving(true)
    const { error } = await supabase.from('files').insert([form])
    if (!error) {
      setForm({ project_id: '', name: '', url: '', type: 'Draft' })
      setPanelOpen(false)
      fetchAll()
    } else alert('Error: ' + error.message)
    setSaving(false)
  }

  async function deleteFile(id: string) {
    if (!confirm('Delete this file?')) return
    await supabase.from('files').delete().eq('id', id)
    fetchAll()
  }

  function formatDate(d: string) {
    if (!d) return ''
    const date = new Date(d)
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`
  }

  function isFrameio(url: string) { return url?.includes('frame.io') }

  function getThumbnailBg(type: string) {
    if (type === 'Delivery') return '#14532d'
    if (type === 'Draft') return '#1e1a3f'
    if (type === 'Brief') return '#3b2f00'
    return '#1c1c2e'
  }

  const totalFiles = files.length
  const deliveries = files.filter(f => f.type === 'Delivery').length
  const drafts = files.filter(f => f.type === 'Draft').length
  const briefs = files.filter(f => f.type === 'Brief').length

  const filtered = files.filter(f => {
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.projects?.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.projects?.clients?.name?.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' ? true : f.type === filterType
    return matchSearch && matchType
  })

  const inp: any = { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text)', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' }
  const lbl: any = { fontSize: '12px', color: 'var(--text-sec)', display: 'block', marginBottom: '6px', fontWeight: 500 }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Files</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{totalFiles} files</span>
          <button onClick={() => setPanelOpen(true)} style={{
            marginLeft: 'auto', background: '#222', border: '1px solid var(--border-input)', borderRadius: '10px',
            color: 'var(--text)', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}><IconUpload size={14} /> Upload / Add link</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total files', value: totalFiles, color: 'var(--text)' },
              { label: 'Deliveries', value: deliveries, color: '#4ade80' },
              { label: 'Drafts', value: drafts, color: '#60a5fa' },
              { label: 'Briefs', value: briefs, color: '#c084fc' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Search + type filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><IconSearch size={15} /></span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search files...'
                style={{ ...inp, paddingLeft: '34px' }} />
            </div>
            {['All', 'Delivery', 'Draft', 'Reference', 'Brief', 'Invoice'].map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{
                padding: '7px 14px', borderRadius: '20px', border: '1px solid',
                borderColor: filterType === t ? '#444' : '#2a2a2a',
                background: filterType === t ? '#2a2a2a' : 'transparent',
                color: filterType === t ? '#fff' : '#555',
                fontSize: '12px', cursor: 'pointer', fontWeight: filterType === t ? 600 : 400, whiteSpace: 'nowrap' as const
              }}>{t}</button>
            ))}
          </div>

          {/* File grid */}
          {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.4 }}><IconFolder size={48} /></div>
              <p>No files yet. Click "Upload / Add link" to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {filtered.map((f: any) => (
                <div key={f.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', overflow: 'hidden' }}>
                  {/* Thumbnail */}
                  <div style={{ height: '120px', background: getThumbnailBg(f.type), display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {isFrameio(f.url) ? (
                      <div style={{ width: '48px', height: '48px', background: '#5a3fc0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff' }}>F</div>
                    ) : (
                      <div style={{ opacity: 0.6, color: '#fff' }}>
                        {f.type === 'Delivery' ? <IconVideo size={36} /> : f.type === 'Invoice' ? <IconInvoices size={36} /> : f.type === 'Brief' || f.type === 'Draft' || f.type === 'Reference' ? <IconFileText size={36} /> : <IconFolder size={36} />}
                      </div>
                    )}
                    {/* Type badge top right */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700,
                        background: typeConfig[f.type]?.bg || '#2a2a2a',
                        color: typeConfig[f.type]?.color || '#aaa'
                      }}>{f.type}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.projects?.title} — {f.projects?.clients?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px' }}>{formatDate(f.created_at)}</div>

                    {/* URL preview */}
                    {f.url && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-deep)', borderRadius: '6px', padding: '6px 8px', marginBottom: '10px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f.url}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a href={f.url} target='_blank' rel='noreferrer' style={{
                        flex: 1, background: 'var(--bg-input)', color: '#60a5fa', borderRadius: '6px',
                        padding: '7px', fontSize: '12px', textDecoration: 'none',
                        textAlign: 'center' as const, fontWeight: 500
                      }}>Open ↗</a>
                      <button onClick={() => deleteFile(f.id)} style={{
                        background: 'var(--bg-input)', color: '#f87171', border: 'none', borderRadius: '6px',
                        padding: '7px 10px', cursor: 'pointer', fontSize: '12px'
                      }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      {panelOpen && (
        <div style={{ width: '300px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)', padding: '0', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Panel header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Add to project</div>
            <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>

          {/* Link / Upload tabs */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['link', 'upload'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? '#2a2a2a' : '#111',
                  border: `1px solid ${tab === t ? '#444' : '#222'}`,
                  borderRadius: '10px', padding: '14px', cursor: 'pointer',
                  color: tab === t ? '#fff' : '#555', fontSize: '14px', fontWeight: 600,
                  display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px'
                }}>
                  <span style={{ display: 'flex' }}>{t === 'link' ? <IconLink size={20} /> : <IconCloud size={20} />}</span>
                  {t === 'link' ? 'Link' : 'Upload'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '16px', flex: 1 }}>

            {tab === 'link' ? (
              <>
                {/* Frame.io section */}
                <div style={{ background: '#1a1830', border: '1px solid #2a2660', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#5a3fc0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>F</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Frame.io link</div>
                      <div style={{ fontSize: '11px', color: '#7c6fc0' }}>Paste your review link</div>
                    </div>
                  </div>
                  <input
                    value={form.url.includes('frame.io') ? form.url : ''}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder='https://frame.io/rev...'
                    style={{ width: '100%', background: 'var(--bg-deep)', border: '1px solid #2a2660', borderRadius: '8px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', boxSizing: 'border-box' as const, outline: 'none' }}
                  />
                </div>

                <div style={{ textAlign: 'center' as const, fontSize: '12px', color: 'var(--text-dim)' }}>— or paste any other link —</div>

                {/* Label */}
                <div>
                  <label style={lbl}>Label</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder='e.g. Draft v2, Final cut'
                    style={inp} />
                </div>

                {/* URL (if not frame.io) */}
                {!form.url.includes('frame.io') && (
                  <div>
                    <label style={lbl}>Link URL</label>
                    <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                      placeholder='https://drive.google.com/...'
                      style={inp} />
                  </div>
                )}

                {/* Assign to project */}
                <div>
                  <label style={lbl}>Assign to project</label>
                  <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}
                    style={{ ...inp }}>
                    <option value=''>Select project...</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.title} — {p.clients?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label style={lbl}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inp, fontSize: '16px' }}>
                    {['Draft', 'Delivery', 'Reference', 'Brief', 'Invoice'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <button onClick={addFile} disabled={saving} style={{
                  width: '100%', background: saving ? '#333' : '#2a2a2a', color: saving ? '#666' : '#fff',
                  border: '1px solid #444', borderRadius: '10px', padding: '13px',
                  fontSize: '14px', fontWeight: 600, cursor: saving ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <IconPlus size={14} /> {saving ? 'Saving...' : 'Save link'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', opacity: 0.4 }}><IconCloud size={48} /></div>
                <div style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-sec)' }}>Direct upload coming soon</div>
                <div style={{ fontSize: '12px' }}>Use the Link tab to add Google Drive, WeTransfer or Frame.io links instead.</div>
              </div>
            )}
          </div>

          {/* Storage section */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', margin: '0' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Storage</div>
            <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${Math.min((totalFiles / 50) * 100, 100)}%`, background: 'linear-gradient(90deg, #5a3fc0, #3b82f6)', borderRadius: '3px' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{totalFiles} links saved</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              {[
                { label: 'Frame.io links', value: files.filter(f => f.url?.includes('frame.io')).length, color: '#5a3fc0' },
                { label: 'Other links', value: files.filter(f => !f.url?.includes('frame.io')).length, color: '#4ade80' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sec)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                    {s.label}
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '10px' }}>Links use zero storage ✓</div>
          </div>
        </div>
      )}
    </div>
  )
}