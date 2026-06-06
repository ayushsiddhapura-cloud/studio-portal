'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: false },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: false },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: false },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: false },
  { label: 'Files', href: '/admin/files', icon: '📁', active: false },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: true },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Your Studio Name',
    email: 'admin@studio.com',
    phone: '+91 98765 43210',
    business: 'Freelance Video Editor',
    bio: 'Professional video editor specialising in YouTube, brand films, weddings and commercial content.',
    website: 'www.yourstudio.com',
    location: 'Ahmedabad, Gujarat',
  })

  // Password settings
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    newFeedback: true,
    paymentReceived: true,
    deadlineReminder: true,
    weeklyReport: false,
    clientViewed: true,
  })

  // Portal settings
  const [portal, setPortal] = useState({
    portalName: 'Studio Portal',
    primaryColor: '#639922',
    footerText: 'Studio Portal by Your Studio Name',
    showPhone: true,
    showEmail: true,
    requirePin: false,
    defaultRevisions: '3',
  })

  // Invoice settings
  const [invoice, setInvoice] = useState({
    businessName: 'Your Studio Name',
    gstin: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    invoicePrefix: 'INV',
    paymentTerms: 'Payment due within 7 days of invoice date.',
  })

  const [saved, setSaved] = useState<string | null>(null)

  const handleSave = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(null), 2500)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Password', icon: '🔐' },
    { id: 'portal', label: 'Client portal', icon: '🌐' },
    { id: 'invoice', label: 'Invoice & payment', icon: '🧾' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '0.5px solid #ddd', borderRadius: '8px',
    fontSize: '13px', color: '#1a1a1a',
    outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'inherit', background: '#fff',
  }

  const labelStyle = {
    display: 'block' as const, fontSize: '11px', fontWeight: '500' as const,
    color: '#666', marginBottom: '5px',
    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  }

  const fieldStyle = { marginBottom: '14px' }

  const sectionTitle = (title: string, subtitle: string) => (
    <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '0.5px solid #e5e3dc' }}>
      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '3px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: '#999' }}>{subtitle}</div>
    </div>
  )

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f5f4f0',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Sidebar */}
      <div style={{
        width: '200px', flexShrink: 0,
        background: '#ffffff',
        borderRight: '0.5px solid #e5e3dc',
        padding: '20px 0',
        display: 'flex', flexDirection: 'column', gap: '2px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '0.5px solid #e5e3dc', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #639922, #4a7a19)',
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🎬</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Studio Portal</div>
              <div style={{ fontSize: '10px', color: '#999' }}>Admin panel</div>
            </div>
          </div>
        </div>
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 16px', fontSize: '13px', textDecoration: 'none',
            color: item.active ? '#1a1a1a' : '#666',
            background: item.active ? '#f5f4f0' : 'transparent',
            fontWeight: item.active ? '500' : '400',
          }}>
            <span style={{ fontSize: '15px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          margin: '0 12px', padding: '10px 12px',
          background: '#f5f4f0', borderRadius: '10px',
          fontSize: '11px', color: '#999',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>🔐</span> admin@studio.com
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          background: '#ffffff', borderBottom: '0.5px solid #e5e3dc',
          padding: '12px 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Settings</div>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', gap: '20px' }}>

          {/* Left — tab nav */}
          <div style={{ width: '180px', flexShrink: 0 }}>
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {tabs.map((tab, i) => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    width: '100%', padding: '11px 14px',
                    background: activeTab === tab.id ? '#f5f4f0' : 'transparent',
                    border: 'none',
                    borderBottom: i < tabs.length - 1 ? '0.5px solid #e5e3dc' : 'none',
                    fontSize: '13px', cursor: 'pointer',
                    color: activeTab === tab.id ? '#1a1a1a' : '#666',
                    fontWeight: activeTab === tab.id ? '500' : '400',
                    fontFamily: 'inherit', textAlign: 'left' as const,
                  }}>
                  <span style={{ fontSize: '15px' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — settings content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '24px',
            }}>

              {/* ── PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <div>
                  {sectionTitle('Profile settings', 'Your name and business information shown on the portal')}

                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #639922, #4a7a19)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', color: '#fff', fontWeight: '700',
                    }}>
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>{profile.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{profile.business}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Studio / Business name</label>
                      <input style={inputStyle} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Business type</label>
                      <input style={inputStyle} value={profile.business} onChange={(e) => setProfile({ ...profile, business: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Email address</label>
                      <input style={inputStyle} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Phone number</label>
                      <input style={inputStyle} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Website</label>
                      <input style={inputStyle} value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Location</label>
                      <input style={inputStyle} value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                    </div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Bio (shown on portal footer)</label>
                    <textarea
                      style={{ ...inputStyle, resize: 'none', height: '80px' }}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <SaveButton onSave={() => handleSave('profile')} saved={saved === 'profile'} />
                </div>
              )}

              {/* ── PASSWORD TAB ── */}
              {activeTab === 'password' && (
                <div>
                  {sectionTitle('Change password', 'Update your admin login password')}
                  <div style={{ maxWidth: '400px' }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Current password</label>
                      <input style={inputStyle} type="password" placeholder="Enter current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>New password</label>
                      <input style={inputStyle} type="password" placeholder="Min 8 characters" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Confirm new password</label>
                      <input style={inputStyle} type="password" placeholder="Repeat new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                    </div>
                    <div style={{
                      background: '#f5f4f0', borderRadius: '8px',
                      padding: '10px 12px', fontSize: '12px',
                      color: '#666', marginBottom: '16px', lineHeight: '1.6',
                    }}>
                      🔐 Use a strong password with at least 8 characters, a number, and a special character.
                    </div>
                    <SaveButton onSave={() => handleSave('password')} saved={saved === 'password'} label="Update password" />
                  </div>
                </div>
              )}

              {/* ── PORTAL TAB ── */}
              {activeTab === 'portal' && (
                <div>
                  {sectionTitle('Client portal settings', 'Customise how your clients see their portal')}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Portal name</label>
                      <input style={inputStyle} value={portal.portalName} onChange={(e) => setPortal({ ...portal, portalName: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Default max revisions</label>
                      <select style={inputStyle} value={portal.defaultRevisions} onChange={(e) => setPortal({ ...portal, defaultRevisions: e.target.value })}>
                        {['1', '2', '3', '4', '5', 'Unlimited'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Footer text</label>
                    <input style={inputStyle} value={portal.footerText} onChange={(e) => setPortal({ ...portal, footerText: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '0.5px solid #e5e3dc' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a', marginBottom: '12px' }}>Client portal options</div>
                    {[
                      { key: 'showEmail', label: 'Show client email on their portal', sub: 'Clients can see their email address displayed' },
                      { key: 'showPhone', label: 'Show client phone on their portal', sub: 'Clients can see their phone number displayed' },
                      { key: 'requirePin', label: 'Require PIN for all new clients', sub: 'New clients must enter a PIN to access their portal' },
                    ].map((item) => (
                      <div key={item.key} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 0', borderBottom: '0.5px solid #f5f4f0',
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#1a1a1a', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>{item.sub}</div>
                        </div>
                        <div
                          onClick={() => setPortal({ ...portal, [item.key]: !(portal as any)[item.key] })}
                          style={{
                            width: '40px', height: '22px', borderRadius: '11px',
                            background: (portal as any)[item.key] ? '#639922' : '#ddd',
                            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            flexShrink: 0,
                          }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#fff', position: 'absolute', top: '2px',
                            left: (portal as any)[item.key] ? '20px' : '2px',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <SaveButton onSave={() => handleSave('portal')} saved={saved === 'portal'} />
                </div>
              )}

              {/* ── INVOICE TAB ── */}
              {activeTab === 'invoice' && (
                <div>
                  {sectionTitle('Invoice & payment settings', 'Your business details that appear on invoices')}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Business name on invoice</label>
                      <input style={inputStyle} value={invoice.businessName} onChange={(e) => setInvoice({ ...invoice, businessName: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>GSTIN (optional)</label>
                      <input style={inputStyle} placeholder="e.g. 24XXXXX1234X1ZX" value={invoice.gstin} onChange={(e) => setInvoice({ ...invoice, gstin: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Invoice prefix</label>
                      <input style={inputStyle} value={invoice.invoicePrefix} onChange={(e) => setInvoice({ ...invoice, invoicePrefix: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>UPI ID</label>
                      <input style={inputStyle} placeholder="yourname@upi" value={invoice.upiId} onChange={(e) => setInvoice({ ...invoice, upiId: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Bank name</label>
                      <input style={inputStyle} placeholder="e.g. HDFC Bank" value={invoice.bankName} onChange={(e) => setInvoice({ ...invoice, bankName: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Account number</label>
                      <input style={inputStyle} placeholder="Your account number" value={invoice.accountNumber} onChange={(e) => setInvoice({ ...invoice, accountNumber: e.target.value })} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>IFSC code</label>
                      <input style={inputStyle} placeholder="e.g. HDFC0001234" value={invoice.ifsc} onChange={(e) => setInvoice({ ...invoice, ifsc: e.target.value })} />
                    </div>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Default payment terms</label>
                    <textarea
                      style={{ ...inputStyle, resize: 'none', height: '70px' }}
                      value={invoice.paymentTerms}
                      onChange={(e) => setInvoice({ ...invoice, paymentTerms: e.target.value })}
                    />
                  </div>
                  <SaveButton onSave={() => handleSave('invoice')} saved={saved === 'invoice'} />
                </div>
              )}

              {/* ── NOTIFICATIONS TAB ── */}
              {activeTab === 'notifications' && (
                <div>
                  {sectionTitle('Notification settings', 'Choose when you want to receive alerts')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                      { key: 'newFeedback', label: 'Client submits feedback', sub: 'Get notified when a client posts revision notes' },
                      { key: 'paymentReceived', label: 'Payment received', sub: 'Alert when an invoice is marked as paid' },
                      { key: 'deadlineReminder', label: 'Deadline reminder', sub: '24 hours before a project deadline' },
                      { key: 'clientViewed', label: 'Client views their portal', sub: 'Know when a client opens their private link' },
                      { key: 'weeklyReport', label: 'Weekly summary report', sub: 'Overview of projects, payments, and activity every Monday' },
                    ].map((item, i) => (
                      <div key={item.key} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 0',
                        borderBottom: i < 4 ? '0.5px solid #e5e3dc' : 'none',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a', marginBottom: '3px' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{item.sub}</div>
                        </div>
                        <div
                          onClick={() => setNotifications({ ...notifications, [item.key]: !(notifications as any)[item.key] })}
                          style={{
                            width: '40px', height: '22px', borderRadius: '11px',
                            background: (notifications as any)[item.key] ? '#639922' : '#ddd',
                            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            flexShrink: 0, marginLeft: '16px',
                          }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#fff', position: 'absolute', top: '2px',
                            left: (notifications as any)[item.key] ? '20px' : '2px',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <SaveButton onSave={() => handleSave('notifications')} saved={saved === 'notifications'} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SaveButton({ onSave, saved, label = 'Save changes' }: { onSave: () => void; saved: boolean; label?: string }) {
  return (
    <button
      onClick={onSave}
      style={{
        background: saved ? '#639922' : '#1a1a1a',
        border: 'none', borderRadius: '8px',
        padding: '10px 20px', fontSize: '13px',
        color: '#fff', cursor: 'pointer',
        fontFamily: 'inherit', fontWeight: '500',
        transition: 'background 0.2s',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
      {saved ? '✅ Saved!' : `💾 ${label}`}
    </button>
  )
}