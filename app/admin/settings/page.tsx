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

const settingsSections = [
  { key: 'profile', label: 'Profile', icon: '👤' },
  { key: 'password', label: 'Password', icon: '🔑' },
  { key: 'portal', label: 'Client portal', icon: '🌐' },
  { key: 'invoice', label: 'Invoice & payment', icon: '🧾' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [form, setForm] = useState({
    studio_name: '', business_type: '', email: '',
    phone: '', website: '', location: '', bio: '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [portalForm, setPortalForm] = useState({ portal_color: '#7c3aed', show_bio: true, show_files: true, show_revisions: true })
  const [invoiceForm, setInvoiceForm] = useState({ upi_id: '', bank_name: '', account_number: '', ifsc: '', payment_terms: 'Payment due within 7 days of delivery.' })
  const [notifForm, setNotifForm] = useState({ new_client: true, payment_received: true, project_due: true, revision_request: false })

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').limit(1).single()
    if (data) {
      setSettingsId(data.id)
      setForm({
        studio_name: data.studio_name || '',
        business_type: data.business_type || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        location: data.location || '',
        bio: data.bio || '',
      })
    }
    setLoading(false)
  }

  async function saveProfile() {
    setSaving(true)
    if (settingsId) {
      await supabase.from('settings').update(form).eq('id', settingsId)
    } else {
      const { data } = await supabase.from('settings').insert([form]).select().single()
      if (data) setSettingsId(data.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function changePassword() {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) { setPwMsg('Please fill all fields.'); return }
    if (passwords.newPass !== passwords.confirm) { setPwMsg('New passwords do not match.'); return }
    if (passwords.newPass.length < 6) { setPwMsg('Must be at least 6 characters.'); return }
    setPwMsg('✅ Password updated!')
    setPasswords({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setPwMsg(''), 3000)
  }

  const inp: any = {
    width: '100%', background: '#1c1c1c', border: '1px solid #2a2a2a',
    borderRadius: '8px', padding: '11px 14px', color: '#fff',
    fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  }
  const lbl: any = { fontSize: '11px', fontWeight: 600, color: '#555', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }
  const card: any = { background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '14px', padding: '28px' }
  const saveBtn = (saved: boolean, saving: boolean) => ({
    background: saved ? '#14532d' : '#fff', color: saved ? '#4ade80' : '#000',
    border: 'none', borderRadius: '10px', padding: '12px 28px',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '8px'
  })

  const Toggle = ({ value, onChange }: { value: boolean, onChange: () => void }) => (
    <div onClick={onChange} style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: value ? '#fff' : '#333',
      position: 'relative' as const, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
    }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: value ? '#111' : '#666',
        position: 'absolute' as const, top: '3px',
        left: value ? '23px' : '3px', transition: 'left 0.2s'
      }} />
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Main sidebar */}
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
            color: item.href === '/admin/settings' ? '#fff' : '#666',
            background: item.href === '/admin/settings' ? '#222' : 'transparent', fontSize: '14px'
          }}>{item.icon} {item.label}</Link>
        ))}
      </div>

      {/* Settings sub-nav */}
      <div style={{ width: '200px', background: '#111', borderRight: '1px solid #1a1a1a', padding: '24px 14px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 20px', paddingLeft: '8px', color: '#fff' }}>Settings</h1>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
          {settingsSections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
              borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%',
              textAlign: 'left' as const,
              background: activeSection === s.key ? '#222' : 'transparent',
              color: activeSection === s.key ? '#fff' : '#555',
              fontSize: '14px', fontWeight: activeSection === s.key ? 600 : 400
            }}>{s.icon} {s.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {loading ? <p style={{ color: '#555' }}>Loading...</p> : (
          <div style={{ maxWidth: '680px' }}>

            {/* ── PROFILE ── */}
            {activeSection === 'profile' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Profile settings</h2>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Your name and business information shown on the portal</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                    {form.studio_name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{form.studio_name || 'Your Studio Name'}</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>{form.business_type || 'Freelance Video Editor'}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={lbl}>STUDIO / BUSINESS NAME</label>
                    <input value={form.studio_name} onChange={e => setForm({ ...form, studio_name: e.target.value })} placeholder='Your Studio Name' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>BUSINESS TYPE</label>
                    <input value={form.business_type} onChange={e => setForm({ ...form, business_type: e.target.value })} placeholder='Freelance Video Editor' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>EMAIL ADDRESS</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder='admin@studio.com' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>PHONE NUMBER</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder='+91 98765 43210' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>WEBSITE</label>
                    <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder='www.yourstudio.com' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>LOCATION</label>
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder='Ahmedabad, Gujarat' style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>BIO (SHOWN ON PORTAL FOOTER)</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder='Professional video editor specialising in YouTube, brand films...'
                    rows={3} style={{ ...inp, resize: 'vertical' as const }} />
                </div>
                <button onClick={saveProfile} disabled={saving} style={saveBtn(saved, saving)}>
                  💾 {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
                </button>
              </div>
            )}

            {/* ── PASSWORD ── */}
            {activeSection === 'password' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Change password</h2>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Update your admin login password</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                  <div>
                    <label style={lbl}>CURRENT PASSWORD</label>
                    <input type='password' value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder='••••••••' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>NEW PASSWORD</label>
                    <input type='password' value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} placeholder='••••••••' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>CONFIRM NEW PASSWORD</label>
                    <input type='password' value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder='••••••••' style={inp} />
                  </div>
                  {pwMsg && (
                    <div style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '8px', background: pwMsg.includes('✅') ? '#14532d' : '#3b1f1f', color: pwMsg.includes('✅') ? '#4ade80' : '#f87171' }}>
                      {pwMsg}
                    </div>
                  )}
                  <button onClick={changePassword} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' as const }}>
                    Update password
                  </button>
                </div>
              </div>
            )}

            {/* ── CLIENT PORTAL ── */}
            {activeSection === 'portal' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Client portal settings</h2>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Customize what clients see on their portal</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={lbl}>PORTAL ACCENT COLOR</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      <input type='color' value={portalForm.portal_color} onChange={e => setPortalForm({ ...portalForm, portal_color: e.target.value })}
                        style={{ width: '48px', height: '44px', borderRadius: '8px', border: '1px solid #333', cursor: 'pointer', background: 'none', padding: '2px' }} />
                      <span style={{ fontSize: '14px', color: '#aaa', fontFamily: 'monospace' }}>{portalForm.portal_color}</span>
                    </div>
                  </div>
                  {[
                    { key: 'show_bio', label: 'Show bio on client portal', sub: 'Display your studio bio at the bottom of each client portal' },
                    { key: 'show_files', label: 'Show files & deliveries section', sub: 'Allow clients to see and download their project files' },
                    { key: 'show_revisions', label: 'Show revision history', sub: 'Let clients view the full revision log on their portal' },
                  ].map((item, i) => (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #222' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{item.sub}</div>
                      </div>
                      <Toggle value={(portalForm as any)[item.key]} onChange={() => setPortalForm({ ...portalForm, [item.key]: !(portalForm as any)[item.key] })} />
                    </div>
                  ))}
                  <div style={{ paddingTop: '20px' }}>
                    <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                      Save portal settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── INVOICE & PAYMENT ── */}
            {activeSection === 'invoice' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Invoice & payment</h2>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Payment details shown on invoices sent to clients</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={lbl}>UPI ID</label>
                    <input value={invoiceForm.upi_id} onChange={e => setInvoiceForm({ ...invoiceForm, upi_id: e.target.value })} placeholder='yourname@upi' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>BANK NAME</label>
                    <input value={invoiceForm.bank_name} onChange={e => setInvoiceForm({ ...invoiceForm, bank_name: e.target.value })} placeholder='HDFC Bank' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>ACCOUNT NUMBER</label>
                    <input value={invoiceForm.account_number} onChange={e => setInvoiceForm({ ...invoiceForm, account_number: e.target.value })} placeholder='XXXXXXXXXXXX' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>IFSC CODE</label>
                    <input value={invoiceForm.ifsc} onChange={e => setInvoiceForm({ ...invoiceForm, ifsc: e.target.value })} placeholder='HDFC0001234' style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>PAYMENT TERMS</label>
                  <textarea value={invoiceForm.payment_terms} onChange={e => setInvoiceForm({ ...invoiceForm, payment_terms: e.target.value })}
                    rows={3} style={{ ...inp, resize: 'vertical' as const }} />
                </div>
                <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  💾 Save payment details
                </button>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === 'notifications' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Notifications</h2>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 28px' }}>Choose what you want to be notified about</p>
                {[
                  { key: 'new_client', label: 'New client added', sub: 'When a new client is created in the system' },
                  { key: 'payment_received', label: 'Payment received', sub: 'When a project is marked as Paid' },
                  { key: 'project_due', label: 'Project deadline reminder', sub: '24 hours before a project deadline' },
                  { key: 'revision_request', label: 'Revision request', sub: 'When a client submits a revision round' },
                ].map((item, i) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 3 ? '1px solid #222' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{item.sub}</div>
                    </div>
                    <Toggle value={(notifForm as any)[item.key]} onChange={() => setNotifForm({ ...notifForm, [item.key]: !(notifForm as any)[item.key] })} />
                  </div>
                ))}
                <button style={{ marginTop: '24px', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Save preferences
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}