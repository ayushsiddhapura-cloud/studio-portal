'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/lib/sidebar'
import { IconSearch, IconPlus, IconInstagram, IconExternalLink } from '@/lib/icons'

type Brand = {
  id: string
  name: string
  category: string
  status: 'Active' | 'Inactive'
  services: string[]
  instagram: string
  links: { label: string; url: string }[]
  notes: string
  client_id?: string | null
  clients?: { name: string } | null
}

const SERVICE_SUGGESTIONS = ['Branding', 'Designing', 'Marketing', 'Photography', 'Video', 'Social Media', 'SEO', 'Web Dev']
const LINK_LABELS = ['Website', 'Drive', 'Assets', 'Design', 'Notion', 'Figma']

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [saving, setSaving] = useState(false)

  const emptyForm = (): Omit<Brand, 'id'> => ({
    name: '', category: '', status: 'Active', services: [],
    instagram: '', links: [], notes: '',
  })
  const [form, setForm] = useState(emptyForm())
  const [serviceInput, setServiceInput] = useState('')
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => { fetchBrands() }, [])

  async function fetchBrands() {
    const { data } = await supabase.from('brands').select('*, clients(name)').order('created_at', { ascending: false })
    if (data) setBrands(data as Brand[])
  }

  function openAdd() {
    setEditBrand(null)
    setForm(emptyForm())
    setServiceInput('')
    setLinkLabel('')
    setLinkUrl('')
    setPanelOpen(true)
  }

  function openEdit(b: Brand) {
    setEditBrand(b)
    setForm({ name: b.name, category: b.category, status: b.status, services: [...b.services], instagram: b.instagram, links: [...b.links], notes: b.notes })
    setServiceInput('')
    setLinkLabel('')
    setLinkUrl('')
    setPanelOpen(true)
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    if (editBrand) {
      await supabase.from('brands').update(form).eq('id', editBrand.id)
    } else {
      await supabase.from('brands').insert([form])
    }
    setSaving(false)
    setPanelOpen(false)
    fetchBrands()
  }

  async function deleteBrand(id: string) {
    if (!confirm('Delete this brand?')) return
    await supabase.from('brands').delete().eq('id', id)
    fetchBrands()
  }

  function addService(tag: string) {
    const s = tag.trim()
    if (s && !form.services.includes(s)) setForm({ ...form, services: [...form.services, s] })
    setServiceInput('')
  }

  function removeService(s: string) {
    setForm({ ...form, services: form.services.filter(x => x !== s) })
  }

  function addLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) return
    setForm({ ...form, links: [...form.links, { label: linkLabel.trim(), url: linkUrl.trim() }] })
    setLinkLabel('')
    setLinkUrl('')
  }

  function removeLink(i: number) {
    setForm({ ...form, links: form.links.filter((_, idx) => idx !== i) })
  }

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  )

  const inp: any = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)',
    borderRadius: '8px', padding: '10px 12px', color: 'var(--text)',
    fontSize: '13px', boxSizing: 'border-box' as const, outline: 'none',
  }
  const lbl: any = { fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Brands</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 9px', borderRadius: '20px' }}>{brands.length} total</span>
          <button onClick={openAdd} style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-hover)', border: '1px solid var(--border-input)',
            borderRadius: '10px', color: 'var(--text)', padding: '8px 16px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            <IconPlus size={14} /> Add brand
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 24px 8px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <IconSearch size={15} />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search brands...'
              style={{ ...inp, paddingLeft: '36px' }} />
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              {search ? 'No brands match your search.' : 'No brands yet. Click "Add brand" to get started.'}
            </div>
          ) : filtered.map(b => (
            <div key={b.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '12px', padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{b.name}</div>
                  {b.category && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{b.category}</div>}
                  {b.clients?.name && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>Client: {b.clients.name}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                    background: b.status === 'Active' ? '#14532d22' : '#7f1d1d22',
                    color: b.status === 'Active' ? '#4ade80' : '#f87171',
                    border: `1px solid ${b.status === 'Active' ? '#4ade8030' : '#f8717130'}`,
                  }}>{b.status}</span>
                  <button onClick={() => openEdit(b)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', padding: '4px 8px' }}>Edit</button>
                  <button onClick={() => deleteBrand(b.id)} style={{ background: 'none', border: 'none', color: '#ef444480', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', lineHeight: 1 }}>✕</button>
                </div>
              </div>

              {b.services.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {b.services.map(s => (
                    <span key={s} style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-sec)' }}>{s}</span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                {b.instagram ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-sec)' }}>
                    <IconInstagram size={14} /> {b.instagram}
                  </div>
                ) : <div />}
                {b.links.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {b.links.map((l, i) => (
                      <a key={i} href={l.url} target='_blank' rel='noopener noreferrer' style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', color: 'var(--text-muted)', border: '1px solid var(--border)',
                        borderRadius: '8px', padding: '4px 10px', textDecoration: 'none',
                      }}>
                        <IconExternalLink size={12} /> {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div style={{ width: '340px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)', padding: '24px 20px', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{editBrand ? 'Edit brand' : 'Add brand'}</h2>
            <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={lbl}>BRAND NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='e.g. Litmus' style={inp} />
            </div>

            <div>
              <label style={lbl}>CATEGORY</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder='e.g. F&B, Retail, Fashion...' style={inp} />
            </div>

            <div>
              <label style={lbl}>STATUS</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })} style={inp}>
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
              </select>
            </div>

            <div>
              <label style={lbl}>SERVICES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {form.services.map(s => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-sec)' }}>
                    {s}
                    <button onClick={() => removeService(s)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '12px' }}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  value={serviceInput}
                  onChange={e => setServiceInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(serviceInput) } }}
                  placeholder='Type and press Enter...'
                  style={{ ...inp, flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                {SERVICE_SUGGESTIONS.filter(s => !form.services.includes(s)).map(s => (
                  <button key={s} onClick={() => addService(s)} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>+ {s}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>INSTAGRAM HANDLE</label>
              <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder='@yourbrand' style={inp} />
            </div>

            <div>
              <label style={lbl}>QUICK LINKS</label>
              {form.links.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-sec)', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', whiteSpace: 'nowrap' }}>{l.label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</span>
                  <button onClick={() => removeLink(i)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>✕</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <select value={linkLabel} onChange={e => setLinkLabel(e.target.value)} style={{ ...inp, width: '110px', flex: 'none' }}>
                  <option value=''>Label</option>
                  {LINK_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder='https://...' style={{ ...inp, flex: 1 }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }} />
              </div>
              <button onClick={addLink} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: '1px dashed var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', width: '100%' }}>+ Add link</button>
            </div>

            <div>
              <label style={lbl}>NOTES</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder='Any notes about this brand...' rows={3} style={{ ...inp, resize: 'vertical' as const }} />
            </div>

            <button onClick={save} disabled={saving} style={{
              background: 'var(--text)', color: 'var(--bg-page)', border: 'none',
              borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saving...' : editBrand ? 'Save changes' : 'Add brand'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
