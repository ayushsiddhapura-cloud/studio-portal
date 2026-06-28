'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/lib/sidebar'

const IconPerson = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
  </svg>
)
const IconTeam = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="5" r="2.5" /><path d="M1 13.5c0-2.5 2-4.5 4.5-4.5S10 11 10 13.5" />
    <circle cx="11.5" cy="4.5" r="2" /><path d="M13 13.5c0-1.8-.9-3.4-2.5-4.2" />
  </svg>
)
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1.5a5 5 0 0 1 5 5v3l1 2H2l1-2v-3a5 5 0 0 1 5-5z" /><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" />
  </svg>
)
const IconInvoiceSet = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 1.5h10v13l-2-1.5-2 1.5-2-1.5-2 1.5V1.5z" /><line x1="5.5" y1="5.5" x2="10.5" y2="5.5" /><line x1="5.5" y1="8" x2="10.5" y2="8" />
  </svg>
)
const IconPortal = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.5" /><path d="M5.5 8a8.5 8.5 0 0 0 2.5 5 8.5 8.5 0 0 0 2.5-5 8.5 8.5 0 0 0-2.5-5 8.5 8.5 0 0 0-2.5 5z" /><line x1="1.5" y1="8" x2="14.5" y2="8" />
  </svg>
)

export default function SettingsPage() {
  const { profile, role } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [form, setForm] = useState({ studio_name: '', business_type: '', email: '', phone: '', website: '', location: '', bio: '' })
  const [portalForm, setPortalForm] = useState({ portal_color: '#3b82f6', show_bio: true, show_files: true, show_revisions: true })
  const [invoiceForm, setInvoiceForm] = useState({ upi_id: '', bank_name: '', account_number: '', ifsc: '', payment_terms: 'Payment due within 7 days of delivery.' })
  const [notifForm, setNotifForm] = useState({ new_client: true, payment_received: true, project_due: true, revision_request: false })

  // Team invite state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [invitedList, setInvitedList] = useState<any[]>([])

  const isOwner = role === 'owner'

  const settingsSections = [
    { key: 'profile', label: 'Profile', Icon: IconPerson },
    ...(isOwner ? [{ key: 'team', label: 'Team & Invites', Icon: IconTeam }] : []),
    { key: 'notifications', label: 'Notifications', Icon: IconBell },
    ...(isOwner ? [
      { key: 'portal', label: 'Client portal', Icon: IconPortal },
      { key: 'invoice', label: 'Invoice & payment', Icon: IconInvoiceSet },
    ] : []),
  ]

  useEffect(() => { fetchSettings(); if (isOwner) fetchInvites() }, [isOwner])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').limit(1).single()
    if (data) {
      setSettingsId(data.id)
      setForm({ studio_name: data.studio_name || '', business_type: data.business_type || '', email: data.email || '', phone: data.phone || '', website: data.website || '', location: data.location || '', bio: data.bio || '' })
    }
    setLoading(false)
  }

  async function fetchInvites() {
    const { data } = await supabase.from('invited_users').select('*').order('created_at', { ascending: false })
    if (data) setInvitedList(data)
  }

  async function saveProfile() {
    setSaving(true)
    if (settingsId) {
      await supabase.from('settings').update(form).eq('id', settingsId)
    } else {
      const { data } = await supabase.from('settings').insert([form]).select().single()
      if (data) setSettingsId(data.id)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return
    setInviting(true); setInviteMsg('')
    const { error } = await supabase.from('invited_users').insert([{
      email: inviteEmail.toLowerCase().trim(),
      role: inviteRole,
      invited_by: profile?.id,
    }])
    if (error) {
      setInviteMsg(error.code === '23505' ? 'This email is already invited.' : error.message)
    } else {
      setInviteMsg('Invite added! Tell them to sign in with this Google email.')
      setInviteEmail('')
      fetchInvites()
    }
    setInviting(false)
    setTimeout(() => setInviteMsg(''), 4000)
  }

  async function removeInvite(id: string) {
    await supabase.from('invited_users').delete().eq('id', id)
    fetchInvites()
  }

  const inp: any = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)',
    borderRadius: '8px', padding: '11px 14px', color: 'var(--text)',
    fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  }
  const lbl: any = { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }
  const card: any = { background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '14px', padding: '28px' }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '12px', background: value ? '#3b82f6' : 'var(--bg-input)', position: 'relative' as const, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0, border: '1px solid var(--border-input)' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute' as const, top: '2px', left: value ? '22px' : '2px', transition: 'left 0.2s' }} />
    </div>
  )

  const roleColors: any = {
    owner: { bg: '#1e3a5f', color: '#60a5fa' },
    editor: { bg: '#4a1942', color: '#e879f9' },
    manager: { bg: '#3b2f00', color: '#fbbf24' },
    client: { bg: '#14532d', color: '#4ade80' },
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      {/* Settings sub-nav */}
      <div style={{ width: '210px', background: 'var(--bg-deep)', borderRight: '1px solid var(--border)', padding: '24px 14px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 20px', paddingLeft: '8px' }}>Settings</h1>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
          {settingsSections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
              borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%',
              textAlign: 'left' as const,
              background: activeSection === s.key ? 'var(--bg-hover)' : 'transparent',
              color: activeSection === s.key ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '14px', fontWeight: activeSection === s.key ? 600 : 400
            }}><s.Icon /> {s.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : (
          <div style={{ maxWidth: '680px' }}>

            {/* ── PROFILE ── */}
            {activeSection === 'profile' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Your profile</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Your personal and business information</p>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-card)' }} />
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
                      {profile?.full_name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{profile?.full_name || 'Your Name'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{profile?.email}</div>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, background: roleColors[profile?.role || 'editor']?.bg, color: roleColors[profile?.role || 'editor']?.color, textTransform: 'capitalize' }}>
                      {profile?.role}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 24px', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: '8px', lineHeight: 1.6 }}>
                  Your name and photo come from your Google account. To change them, update your Google profile at myaccount.google.com.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={lbl}>STUDIO / BUSINESS NAME</label>
                    <input value={form.studio_name} onChange={e => setForm({ ...form, studio_name: e.target.value })} placeholder='Ayush Siddhapura' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>BUSINESS TYPE</label>
                    <input value={form.business_type} onChange={e => setForm({ ...form, business_type: e.target.value })} placeholder='Video Editing Agency' style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>CONTACT EMAIL</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder='contact@yourstudio.com' style={inp} />
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
                  <label style={lbl}>BIO</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder='Professional video editor specialising in YouTube, brand films...' rows={3} style={{ ...inp, resize: 'vertical' as const }} />
                </div>
                <button onClick={saveProfile} disabled={saving} style={{ background: saved ? '#14532d' : 'var(--text)', color: saved ? '#4ade80' : 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save changes'}
                </button>
              </div>
            )}

            {/* ── TEAM & INVITES (owner only) ── */}
            {activeSection === 'team' && isOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Invite form */}
                <div style={card}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Invite team member</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
                    Enter their Google email address. They'll sign in with that Google account and get access based on their role.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', alignItems: 'end' }}>
                    <div>
                      <label style={lbl}>GOOGLE EMAIL ADDRESS</label>
                      <input
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        placeholder='editor@gmail.com'
                        style={inp}
                        onKeyDown={e => e.key === 'Enter' && sendInvite()}
                      />
                    </div>
                    <div>
                      <label style={lbl}>ROLE</label>
                      <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ ...inp, width: 'auto' }}>
                        <option value='editor'>Editor</option>
                        <option value='manager'>Manager</option>
                        <option value='client'>Client</option>
                      </select>
                    </div>
                    <button onClick={sendInvite} disabled={inviting || !inviteEmail.trim()} style={{ background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '8px', padding: '11px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                      {inviting ? 'Adding...' : '+ Add invite'}
                    </button>
                  </div>
                  {inviteMsg && (
                    <div style={{ marginTop: '12px', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', background: inviteMsg.includes('added') ? '#14532d22' : '#3b1f1f', color: inviteMsg.includes('added') ? '#4ade80' : '#f87171', border: `1px solid ${inviteMsg.includes('added') ? '#14532d' : '#ef444430'}` }}>
                      {inviteMsg}
                    </div>
                  )}
                </div>

                {/* Invite list */}
                <div style={card}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px' }}>Invited members ({invitedList.length})</h3>
                  {invitedList.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No invites yet. Add your first team member above.</p>
                  ) : invitedList.map((inv: any) => {
                    const rc = roleColors[inv.role] || roleColors.editor
                    return (
                      <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: rc.color, flexShrink: 0 }}>
                          {inv.email?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.email}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {inv.accepted_at ? `Joined ${new Date(inv.accepted_at).toLocaleDateString()}` : 'Pending sign-in'}
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, background: rc.bg, color: rc.color, textTransform: 'capitalize' as const }}>{inv.role}</span>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: inv.accepted_at ? '#14532d22' : 'var(--bg-input)', color: inv.accepted_at ? '#4ade80' : 'var(--text-muted)' }}>
                          {inv.accepted_at ? '✓ Active' : 'Pending'}
                        </span>
                        {!inv.accepted_at && (
                          <button onClick={() => removeInvite(inv.id)} style={{ background: 'transparent', border: '1px solid #ef444430', color: '#f87171', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}>
                            Remove
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === 'notifications' && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Notifications</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Choose what you want to be notified about</p>
                {[
                  { key: 'new_client', label: 'New client added', sub: 'When a new client is created in the system' },
                  { key: 'payment_received', label: 'Payment received', sub: 'When a project is marked as Paid' },
                  { key: 'project_due', label: 'Project deadline reminder', sub: '24 hours before a project deadline' },
                  { key: 'revision_request', label: 'Revision request', sub: 'When a client submits a revision round' },
                ].map((item, i, arr) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                    <Toggle value={(notifForm as any)[item.key]} onChange={() => setNotifForm({ ...notifForm, [item.key]: !(notifForm as any)[item.key] })} />
                  </div>
                ))}
                <button style={{ marginTop: '24px', background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Save preferences
                </button>
              </div>
            )}

            {/* ── CLIENT PORTAL (owner only) ── */}
            {activeSection === 'portal' && isOwner && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Client portal settings</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Customize what clients see on their portal</p>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>PORTAL ACCENT COLOR</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <input type='color' value={portalForm.portal_color} onChange={e => setPortalForm({ ...portalForm, portal_color: e.target.value })}
                      style={{ width: '48px', height: '44px', borderRadius: '8px', border: '1px solid var(--border-input)', cursor: 'pointer', background: 'none', padding: '2px' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-sec)', fontFamily: 'monospace' }}>{portalForm.portal_color}</span>
                  </div>
                </div>
                {[
                  { key: 'show_bio', label: 'Show bio on client portal', sub: 'Display your studio bio at the bottom of each client portal' },
                  { key: 'show_files', label: 'Show files & deliveries section', sub: 'Allow clients to see and download their project files' },
                  { key: 'show_revisions', label: 'Show revision history', sub: 'Let clients view the full revision log on their portal' },
                ].map((item) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                    <Toggle value={(portalForm as any)[item.key]} onChange={() => setPortalForm({ ...portalForm, [item.key]: !(portalForm as any)[item.key] })} />
                  </div>
                ))}
                <button style={{ marginTop: '20px', background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Save portal settings
                </button>
              </div>
            )}

            {/* ── INVOICE & PAYMENT (owner only) ── */}
            {activeSection === 'invoice' && isOwner && (
              <div style={card}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Invoice & payment</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 28px' }}>Payment details shown on invoices sent to clients</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div><label style={lbl}>UPI ID</label><input value={invoiceForm.upi_id} onChange={e => setInvoiceForm({ ...invoiceForm, upi_id: e.target.value })} placeholder='yourname@upi' style={inp} /></div>
                  <div><label style={lbl}>BANK NAME</label><input value={invoiceForm.bank_name} onChange={e => setInvoiceForm({ ...invoiceForm, bank_name: e.target.value })} placeholder='HDFC Bank' style={inp} /></div>
                  <div><label style={lbl}>ACCOUNT NUMBER</label><input value={invoiceForm.account_number} onChange={e => setInvoiceForm({ ...invoiceForm, account_number: e.target.value })} placeholder='XXXXXXXXXXXX' style={inp} /></div>
                  <div><label style={lbl}>IFSC CODE</label><input value={invoiceForm.ifsc} onChange={e => setInvoiceForm({ ...invoiceForm, ifsc: e.target.value })} placeholder='HDFC0001234' style={inp} /></div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>PAYMENT TERMS</label>
                  <textarea value={invoiceForm.payment_terms} onChange={e => setInvoiceForm({ ...invoiceForm, payment_terms: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical' as const }} />
                </div>
                <button style={{ background: 'var(--text)', color: 'var(--bg-page)', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Save payment details
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
