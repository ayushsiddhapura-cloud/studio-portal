'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: false },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: false },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: false },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: true },
  { label: 'Files', href: '/admin/files', icon: '📁', active: false },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
]

type Invoice = {
  id: number
  num: string
  client: string
  initials: string
  avatarBg: string
  avatarColor: string
  project: string
  amount: number
  due: string
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft'
  invoiceDate: string
}

const invoices: Invoice[] = [
  { id: 1, num: '#014', client: 'Rahul K.', initials: 'RK', avatarBg: '#E6F1FB', avatarColor: '#185FA5', project: 'Brand intro video', amount: 18000, due: 'Jun 10', status: 'Unpaid', invoiceDate: 'May 22, 2026' },
  { id: 2, num: '#013', client: 'Priya D.', initials: 'PD', avatarBg: '#FBEAF0', avatarColor: '#993556', project: 'YouTube series ep.4', amount: 12500, due: 'May 30', status: 'Overdue', invoiceDate: 'May 10, 2026' },
  { id: 3, num: '#012', client: 'Karan S.', initials: 'KS', avatarBg: '#E6F1FB', avatarColor: '#185FA5', project: 'Corporate promo reel', amount: 8000, due: 'Jun 15', status: 'Unpaid', invoiceDate: 'Jun 1, 2026' },
  { id: 4, num: '#011', client: 'Meena R.', initials: 'MR', avatarBg: '#EAF3DE', avatarColor: '#3B6D11', project: 'Event recap video', amount: 4000, due: 'Jun 18', status: 'Unpaid', invoiceDate: 'Jun 3, 2026' },
  { id: 5, num: '#010', client: 'Sneha P.', initials: 'SP', avatarBg: '#EAF3DE', avatarColor: '#3B6D11', project: 'Wedding highlight reel', amount: 22000, due: 'May 25', status: 'Paid', invoiceDate: 'May 5, 2026' },
  { id: 6, num: '#009', client: 'Aryan M.', initials: 'AM', avatarBg: '#FAEEDA', avatarColor: '#854F0B', project: 'Social media ad cuts', amount: 15000, due: 'May 18', status: 'Paid', invoiceDate: 'Apr 28, 2026' },
  { id: 7, num: '#008', client: 'Rahul K.', initials: 'RK', avatarBg: '#E6F1FB', avatarColor: '#185FA5', project: 'Product teaser video', amount: 10000, due: 'Apr 30', status: 'Paid', invoiceDate: 'Apr 10, 2026' },
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  Paid: { bg: '#EAF3DE', color: '#3B6D11' },
  Unpaid: { bg: '#FAEEDA', color: '#854F0B' },
  Overdue: { bg: '#FCEBEB', color: '#A32D2D' },
  Draft: { bg: '#F1EFE8', color: '#5F5E5A' },
}

export default function InvoicesPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filters = ['All', 'Unpaid', 'Overdue', 'Paid', 'Draft']

  const filtered = invoices.filter(inv => {
    const matchFilter = filter === 'All' || inv.status === filter
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase()) ||
      inv.num.includes(search)
    return matchFilter && matchSearch
  })

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0)
  const collected = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pending = invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

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
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            Invoices <span style={{ fontSize: '12px', color: '#999', fontWeight: '400', marginLeft: '6px' }}>{invoices.length} total</span>
          </div>
          <button
            onClick={() => { setSelectedInvoice(null); setShowModal(true) }}
            style={{
              background: '#1a1a1a', border: 'none',
              borderRadius: '8px', padding: '7px 14px',
              fontSize: '12px', color: '#fff', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: '500',
            }}>+ New invoice</button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1 }}>

          {/* Summary stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '10px', marginBottom: '18px',
          }}>
            {[
              { label: 'Total billed', value: fmt(totalBilled), color: '#1a1a1a' },
              { label: 'Collected', value: fmt(collected), color: '#3B6D11' },
              { label: 'Pending', value: fmt(pending), color: '#854F0B' },
              { label: 'Overdue', value: fmt(overdue), color: '#A32D2D' },
            ].map((s) => (
              <div key={s.label} style={{
                background: '#ffffff', border: '0.5px solid #e5e3dc',
                borderRadius: '12px', padding: '12px 14px',
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>{s.label}</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '14px', color: '#999',
              }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by client, project or invoice #..."
                style={{
                  width: '100%', height: '34px',
                  border: '0.5px solid #ccc', borderRadius: '8px',
                  padding: '0 12px 0 32px', fontSize: '13px',
                  background: '#fff', color: '#1a1a1a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            {filters.map((f) => (
              <button key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                  border: '0.5px solid #ccc',
                  background: filter === f ? '#1a1a1a' : 'transparent',
                  color: filter === f ? '#fff' : '#666',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: filter === f ? '500' : '400',
                  transition: 'all 0.15s',
                }}>{f}</button>
            ))}
          </div>

          {/* Invoice table */}
          <div style={{
            background: '#ffffff', border: '0.5px solid #e5e3dc',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Inv #', 'Client', 'Project', 'Amount', 'Due', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 14px',
                      borderBottom: '0.5px solid #e5e3dc',
                      fontWeight: '500', fontSize: '11px', color: '#999',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                      No invoices found
                    </td>
                  </tr>
                ) : filtered.map((inv, i) => (
                  <tr key={inv.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #e5e3dc' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: '#999', fontSize: '12px' }}>
                      {inv.num}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: inv.avatarBg, color: inv.avatarColor,
                          fontSize: '9px', fontWeight: '600',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>{inv.initials}</div>
                        <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{inv.client}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', color: '#555', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.project}
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontWeight: '500', color: '#1a1a1a' }}>
                      {fmt(inv.amount)}
                    </td>
                    <td style={{
                      padding: '11px 14px',
                      color: inv.status === 'Overdue' ? '#A32D2D' : inv.status === 'Unpaid' ? '#854F0B' : '#555',
                      fontWeight: inv.status === 'Overdue' ? '500' : '400',
                    }}>
                      {inv.due}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{
                        background: statusStyle[inv.status].bg,
                        color: statusStyle[inv.status].color,
                        fontSize: '11px', fontWeight: '500',
                        padding: '3px 9px', borderRadius: '20px',
                      }}>{inv.status}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => alert(`Invoice ${inv.num} marked as paid!`)}
                            style={{
                              background: 'transparent',
                              border: '0.5px solid #ccc',
                              borderRadius: '6px', padding: '4px 8px',
                              fontSize: '11px', cursor: 'pointer',
                              color: '#3B6D11', fontFamily: 'inherit',
                              title: 'Mark as paid',
                            }}>✓ Paid</button>
                        )}
                        <button
                          onClick={() => { setSelectedInvoice(inv); setShowModal(true) }}
                          style={{
                            background: 'transparent',
                            border: '0.5px solid #ccc',
                            borderRadius: '6px', padding: '4px 8px',
                            fontSize: '11px', cursor: 'pointer',
                            color: '#555', fontFamily: 'inherit',
                          }}>👁 View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice modal — view or create */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px',
            padding: '28px', width: '460px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                {selectedInvoice ? `Invoice ${selectedInvoice.num}` : 'New invoice'}
              </div>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: '#999', lineHeight: 1,
              }}>×</button>
            </div>

            {selectedInvoice ? (
              /* View invoice */
              <div>
                <div style={{
                  background: '#f5f4f0', borderRadius: '12px',
                  padding: '16px', marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '3px' }}>CLIENT</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>{selectedInvoice.client}</div>
                    </div>
                    <span style={{
                      background: statusStyle[selectedInvoice.status].bg,
                      color: statusStyle[selectedInvoice.status].color,
                      fontSize: '12px', fontWeight: '600',
                      padding: '4px 12px', borderRadius: '20px',
                      alignSelf: 'flex-start',
                    }}>{selectedInvoice.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Project', value: selectedInvoice.project },
                      { label: 'Invoice date', value: selectedInvoice.invoiceDate },
                      { label: 'Due date', value: selectedInvoice.due },
                      { label: 'Amount', value: fmt(selectedInvoice.amount) },
                    ].map((row) => (
                      <div key={row.label}>
                        <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{row.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment breakdown */}
                <div style={{
                  border: '0.5px solid #e5e3dc', borderRadius: '10px',
                  overflow: 'hidden', marginBottom: '16px',
                }}>
                  {[
                    { label: 'Project fee', value: fmt(selectedInvoice.amount) },
                    { label: 'Amount paid', value: selectedInvoice.status === 'Paid' ? fmt(selectedInvoice.amount) : '₹0' },
                    { label: 'Balance due', value: selectedInvoice.status === 'Paid' ? '₹0' : fmt(selectedInvoice.amount) },
                  ].map((row, i) => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: i < 2 ? '0.5px solid #e5e3dc' : 'none',
                      fontSize: '13px',
                    }}>
                      <span style={{ color: '#666' }}>{row.label}</span>
                      <span style={{
                        fontWeight: '500',
                        color: row.label === 'Balance due' && selectedInvoice.status !== 'Paid' ? '#A32D2D'
                          : row.label === 'Amount paid' && selectedInvoice.status === 'Paid' ? '#3B6D11'
                          : '#1a1a1a',
                      }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    flex: 1, padding: '10px',
                    background: '#f5f4f0', border: 'none',
                    borderRadius: '8px', fontSize: '13px',
                    color: '#555', cursor: 'pointer', fontFamily: 'inherit',
                  }} onClick={() => alert('PDF download coming soon!')}>
                    📄 View PDF
                  </button>
                  {selectedInvoice.status !== 'Paid' && (
                    <button style={{
                      flex: 1, padding: '10px',
                      background: '#1a1a1a', border: 'none',
                      borderRadius: '8px', fontSize: '13px',
                      color: '#fff', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: '500',
                    }} onClick={() => { alert(`Invoice ${selectedInvoice.num} marked as paid!`); setShowModal(false) }}>
                      ✓ Mark as paid
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* New invoice form */
              <div>
                {[
                  { label: 'Client', placeholder: 'Select client name' },
                  { label: 'Project', placeholder: 'Select project' },
                  { label: 'Amount (₹)', placeholder: 'e.g. 18000' },
                  { label: 'Invoice date', placeholder: 'e.g. Jun 6, 2026' },
                  { label: 'Due date', placeholder: 'e.g. Jun 20, 2026' },
                ].map((field) => (
                  <div key={field.label} style={{ marginBottom: '13px' }}>
                    <label style={{
                      display: 'block', fontSize: '11px', fontWeight: '500',
                      color: '#666', marginBottom: '5px',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{field.label}</label>
                    <input
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '9px 12px',
                        border: '0.5px solid #ddd', borderRadius: '8px',
                        fontSize: '13px', color: '#1a1a1a',
                        outline: 'none', boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block', fontSize: '11px', fontWeight: '500',
                    color: '#666', marginBottom: '5px',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>Notes (optional)</label>
                  <textarea placeholder="Payment terms or notes..." style={{
                    width: '100%', padding: '9px 12px',
                    border: '0.5px solid #ddd', borderRadius: '8px',
                    fontSize: '13px', color: '#1a1a1a',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit', resize: 'none', height: '70px',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: '10px',
                    background: 'transparent', border: '0.5px solid #ddd',
                    borderRadius: '8px', fontSize: '13px',
                    color: '#666', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Cancel</button>
                  <button onClick={() => { alert('Invoice created!'); setShowModal(false) }} style={{
                    flex: 1, padding: '10px',
                    background: '#1a1a1a', border: 'none',
                    borderRadius: '8px', fontSize: '13px',
                    color: '#fff', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: '500',
                  }}>Create invoice</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}