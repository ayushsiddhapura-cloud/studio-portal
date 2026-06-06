'use client'

import { useState } from 'react'
import Link from 'next/link'

const stats = [
  { label: 'Total Clients', value: '12', sub: '3 added this month', icon: '👥', color: '#378ADD' },
  { label: 'Active Projects', value: '7', sub: '2 due this week', icon: '🎬', color: '#639922' },
  { label: 'Completed', value: '34', sub: 'All time', icon: '✅', color: '#639922' },
  { label: 'Pending Payments', value: '₹42,500', sub: '4 invoices unpaid', icon: '⚠️', color: '#A32D2D' },
  { label: 'Total Earnings', value: '₹2,84,000', sub: 'Collected: ₹2,41,500', icon: '📈', color: '#639922' },
  { label: 'This Month', value: '₹38,500', sub: 'vs ₹31,000 last month', icon: '📅', color: '#378ADD' },
]

const projects = [
  { name: 'Brand intro video', client: 'Rahul K.', initials: 'RK', deadline: 'Jun 7', deadlineWarn: true, revisions: '2/3', status: 'In review', statusColor: '#854F0B', statusBg: '#FAEEDA', payment: 'Unpaid', payColor: '#854F0B', payBg: '#FAEEDA' },
  { name: 'Wedding highlight reel', client: 'Sneha P.', initials: 'SP', deadline: 'Jun 14', deadlineWarn: false, revisions: '1/2', status: 'In progress', statusColor: '#185FA5', statusBg: '#E6F1FB', payment: 'Paid', payColor: '#3B6D11', payBg: '#EAF3DE' },
  { name: 'Product launch ad', client: 'Aryan M.', initials: 'AM', deadline: 'Jun 20', deadlineWarn: false, revisions: '0/3', status: 'In progress', statusColor: '#185FA5', statusBg: '#E6F1FB', payment: 'Draft', payColor: '#5F5E5A', payBg: '#F1EFE8' },
  { name: 'YouTube series ep.4', client: 'Priya D.', initials: 'PD', deadline: 'Jun 25', deadlineWarn: false, revisions: '3/3', status: 'Delivered', statusColor: '#3B6D11', statusBg: '#EAF3DE', payment: 'Overdue', payColor: '#A32D2D', payBg: '#FCEBEB' },
]

const deadlines = [
  { name: 'Brand intro video', date: 'Jun 7', warn: true },
  { name: 'Wedding highlight', date: 'Jun 14', warn: false },
  { name: 'Product launch ad', date: 'Jun 20', warn: false },
  { name: 'YouTube ep.4', date: 'Jun 25', warn: false },
]

const invoices = [
  { client: 'Rahul K.', amount: '₹18,000', status: 'Unpaid', statusColor: '#854F0B', statusBg: '#FAEEDA' },
  { client: 'Priya D.', amount: '₹12,500', status: 'Overdue', statusColor: '#A32D2D', statusBg: '#FCEBEB' },
  { client: 'Karan S.', amount: '₹8,000', status: 'Unpaid', statusColor: '#854F0B', statusBg: '#FAEEDA' },
  { client: 'Meena R.', amount: '₹4,000', status: 'Unpaid', statusColor: '#854F0B', statusBg: '#FAEEDA' },
]

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: true },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: false },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: false },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: false },
  { label: 'Files', href: '/admin/files', icon: '📁', active: false },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
]

const avatarColors: Record<string, { bg: string; color: string }> = {
  RK: { bg: '#E6F1FB', color: '#185FA5' },
  SP: { bg: '#EAF3DE', color: '#3B6D11' },
  AM: { bg: '#FAEEDA', color: '#854F0B' },
  PD: { bg: '#FBEAF0', color: '#993556' },
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
        {/* Brand */}
        <div style={{ padding: '0 16px 16px', borderBottom: '0.5px solid #e5e3dc', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #639922, #4a7a19)',
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>🎬</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Studio Portal</div>
              <div style={{ fontSize: '10px', color: '#999' }}>Admin panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 16px', fontSize: '13px', textDecoration: 'none',
            color: item.active ? '#1a1a1a' : '#666',
            background: item.active ? '#f5f4f0' : 'transparent',
            fontWeight: item.active ? '500' : '400',
            transition: 'background 0.1s',
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

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <div style={{
          background: '#ffffff', borderBottom: '0.5px solid #e5e3dc',
          padding: '12px 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Overview</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              background: 'transparent', border: '0.5px solid #ccc',
              borderRadius: '8px', padding: '6px 14px',
              fontSize: '12px', color: '#333', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>+ New project</button>
            <button style={{
              background: '#1a1a1a', border: 'none',
              borderRadius: '8px', padding: '6px 14px',
              fontSize: '12px', color: '#fff', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>+ Add client</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px', marginBottom: '24px',
          }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{
                background: '#ffffff',
                border: '0.5px solid #e5e3dc',
                borderRadius: '12px', padding: '14px',
              }}>
                <div style={{
                  fontSize: '11px', color: '#999',
                  marginBottom: '6px', display: 'flex',
                  alignItems: 'center', gap: '5px',
                }}>
                  <span>{stat.icon}</span> {stat.label}
                </div>
                <div style={{
                  fontSize: '20px', fontWeight: '600',
                  color: stat.label === 'Pending Payments' ? '#A32D2D'
                    : stat.label === 'Total Earnings' ? '#3B6D11'
                    : '#1a1a1a',
                }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Projects table */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>Active projects</span>
              <span style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}>View all →</span>
            </div>
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Project', 'Client', 'Deadline', 'Revisions', 'Status', 'Payment'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '8px 12px',
                        borderBottom: '0.5px solid #e5e3dc',
                        fontWeight: '500', fontSize: '11px', color: '#999',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={i} style={{ borderBottom: i < projects.length - 1 ? '0.5px solid #e5e3dc' : 'none' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '500', color: '#1a1a1a' }}>{p.name}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: avatarColors[p.initials]?.bg || '#eee',
                            color: avatarColors[p.initials]?.color || '#333',
                            fontSize: '9px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>{p.initials}</div>
                          <span style={{ color: '#555' }}>{p.client}</span>
                        </div>
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        color: p.deadlineWarn ? '#854F0B' : '#555',
                        fontWeight: p.deadlineWarn ? '500' : '400',
                      }}>
                        {p.deadlineWarn ? '⚠ ' : ''}{p.deadline}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#555' }}>{p.revisions}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: p.statusBg, color: p.statusColor,
                          fontSize: '11px', fontWeight: '500',
                          padding: '3px 8px', borderRadius: '20px',
                        }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: p.payBg, color: p.payColor,
                          fontSize: '11px', fontWeight: '500',
                          padding: '3px 8px', borderRadius: '20px',
                        }}>{p.payment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

            {/* Deadlines */}
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>
                📅 Upcoming deadlines
              </div>
              {deadlines.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '7px 0',
                  borderBottom: i < deadlines.length - 1 ? '0.5px solid #e5e3dc' : 'none',
                  fontSize: '12px',
                }}>
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{d.name}</span>
                  <span style={{ color: d.warn ? '#854F0B' : '#999', fontWeight: d.warn ? '500' : '400' }}>{d.date}</span>
                </div>
              ))}
            </div>

            {/* Invoices */}
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>
                🧾 Pending invoices
              </div>
              {invoices.map((inv, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '7px 0',
                  borderBottom: i < invoices.length - 1 ? '0.5px solid #e5e3dc' : 'none',
                  fontSize: '12px',
                }}>
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{inv.client}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', color: '#1a1a1a' }}>{inv.amount}</span>
                    <span style={{
                      background: inv.statusBg, color: inv.statusColor,
                      fontSize: '10px', fontWeight: '500',
                      padding: '2px 7px', borderRadius: '20px',
                    }}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}