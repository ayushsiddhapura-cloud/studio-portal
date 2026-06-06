'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: false },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: false },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: true },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: false },
  { label: 'Files', href: '/admin/files', icon: '📁', active: false },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
]

const avatarColors: Record<string, { bg: string; color: string }> = {
  RK: { bg: '#E6F1FB', color: '#185FA5' },
  SP: { bg: '#EAF3DE', color: '#3B6D11' },
  AM: { bg: '#FAEEDA', color: '#854F0B' },
  PD: { bg: '#FBEAF0', color: '#993556' },
  KS: { bg: '#E6F1FB', color: '#185FA5' },
  MR: { bg: '#EAF3DE', color: '#3B6D11' },
}

type Project = {
  id: number
  name: string
  client: string
  initials: string
  deadline: string
  warn: boolean
  revisions: string
  status: string
  payment: string
  payBg: string
  payColor: string
}

type Columns = {
  [key: string]: Project[]
}

const columns: Columns = {
  'In progress': [
    { id: 1, name: 'Wedding highlight reel', client: 'Sneha P.', initials: 'SP', deadline: 'Jun 14', warn: false, revisions: '1/2', status: 'In progress', payment: 'Paid', payBg: '#EAF3DE', payColor: '#3B6D11' },
    { id: 2, name: 'Product launch ad', client: 'Aryan M.', initials: 'AM', deadline: 'Jun 20', warn: false, revisions: '0/3', status: 'In progress', payment: 'Draft', payBg: '#F1EFE8', payColor: '#5F5E5A' },
    { id: 3, name: 'Corporate promo reel', client: 'Karan S.', initials: 'KS', deadline: 'Jun 28', warn: false, revisions: '0/2', status: 'In progress', payment: 'Unpaid', payBg: '#FAEEDA', payColor: '#854F0B' },
  ],
  'In review': [
    { id: 4, name: 'Brand intro video', client: 'Rahul K.', initials: 'RK', deadline: 'Jun 7', warn: true, revisions: '2/3', status: 'In review', payment: 'Unpaid', payBg: '#FAEEDA', payColor: '#854F0B' },
    { id: 5, name: 'Social media cuts', client: 'Priya D.', initials: 'PD', deadline: 'Jun 18', warn: false, revisions: '1/2', status: 'In review', payment: 'Partial', payBg: '#FAEEDA', payColor: '#854F0B' },
  ],
  'Revision': [
    { id: 6, name: 'Event recap video', client: 'Meena R.', initials: 'MR', deadline: 'Jun 8', warn: true, revisions: '3/3', status: 'Revision', payment: 'Unpaid', payBg: '#FAEEDA', payColor: '#854F0B' },
  ],
  'Delivered': [
    { id: 7, name: 'YouTube series ep.4', client: 'Priya D.', initials: 'PD', deadline: 'Done', warn: false, revisions: '3/3', status: 'Delivered', payment: 'Overdue', payBg: '#FCEBEB', payColor: '#A32D2D' },
  ],
}

const columnColors: Record<string, string> = {
  'In progress': '#378ADD',
  'In review': '#EF9F27',
  'Revision': '#E24B4A',
  'Delivered': '#639922',
}

const statusBadge: Record<string, { bg: string; color: string }> = {
  'In progress': { bg: '#E6F1FB', color: '#185FA5' },
  'In review': { bg: '#FAEEDA', color: '#854F0B' },
  'Revision': { bg: '#FCEBEB', color: '#A32D2D' },
  'Delivered': { bg: '#EAF3DE', color: '#3B6D11' },
}

export default function ProjectsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)

  const allProjects = Object.values(columns).flat()
  const filtered = allProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
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
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            Projects <span style={{ fontSize: '12px', color: '#999', fontWeight: '400', marginLeft: '6px' }}>7 active</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setView('kanban')}
              style={{
                background: view === 'kanban' ? '#f5f4f0' : 'transparent',
                border: '0.5px solid #ccc', borderRadius: '8px',
                padding: '6px 12px', fontSize: '12px',
                color: '#333', cursor: 'pointer', fontFamily: 'inherit',
              }}>⊞ Kanban</button>
            <button
              onClick={() => setView('list')}
              style={{
                background: view === 'list' ? '#f5f4f0' : 'transparent',
                border: '0.5px solid #ccc', borderRadius: '8px',
                padding: '6px 12px', fontSize: '12px',
                color: '#333', cursor: 'pointer', fontFamily: 'inherit',
              }}>☰ List</button>
            <button
              onClick={() => setShowNewProject(true)}
              style={{
                background: '#1a1a1a', border: 'none',
                borderRadius: '8px', padding: '7px 14px',
                fontSize: '12px', color: '#fff', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: '500',
              }}>+ New project</button>
          </div>
        </div>

        <div style={{ padding: '16px 24px', flex: 1 }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '14px', color: '#999',
              }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects or clients..."
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
            {['All', 'Mine', 'Overdue'].map((f) => (
              <button key={f} style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                border: '0.5px solid #ccc',
                background: f === 'All' ? '#f5f4f0' : 'transparent',
                color: f === 'All' ? '#1a1a1a' : '#666',
                cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: f === 'All' ? '500' : '400',
              }}>{f}</button>
            ))}
          </div>

          {/* KANBAN VIEW */}
          {view === 'kanban' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px', alignItems: 'start',
            }}>
              {Object.entries(columns).map(([colName, projects]) => (
                <div key={colName}>
                  {/* Column accent */}
                  <div style={{
                    height: '3px', borderRadius: '3px',
                    background: columnColors[colName],
                    marginBottom: '10px',
                  }} />
                  {/* Column header */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '500', color: '#666' }}>{colName}</span>
                    <span style={{
                      background: '#f5f4f0', borderRadius: '20px',
                      padding: '1px 7px', fontSize: '10px', color: '#999',
                    }}>{projects.length}</span>
                  </div>

                  {/* Project cards */}
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{
                        background: '#ffffff',
                        border: '0.5px solid #e5e3dc',
                        borderRadius: '10px', padding: '12px',
                        marginBottom: '8px', cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#bbb')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e3dc')}
                      >
                        <div style={{
                          fontSize: '12px', fontWeight: '500',
                          color: '#1a1a1a', marginBottom: '6px',
                          lineHeight: '1.4',
                        }}>{project.name}</div>

                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: '5px', marginBottom: '8px',
                        }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: avatarColors[project.initials]?.bg || '#eee',
                            color: avatarColors[project.initials]?.color || '#333',
                            fontSize: '9px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>{project.initials}</div>
                          <span style={{ fontSize: '11px', color: '#666' }}>{project.client}</span>
                        </div>

                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{
                            fontSize: '10px',
                            color: project.warn ? '#854F0B' : '#999',
                            display: 'flex', alignItems: 'center', gap: '3px',
                          }}>
                            {project.warn ? '⚠ ' : '📅 '}{project.deadline}
                          </span>
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            🔄 {project.revisions}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {view === 'list' && (
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Project', 'Client', 'Deadline', 'Revisions', 'Status', 'Payment'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '8px 14px',
                        borderBottom: '0.5px solid #e5e3dc',
                        fontWeight: '500', fontSize: '11px', color: '#999',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(search ? filtered : allProjects).map((p, i) => (
                    <tr key={p.id}
                      style={{
                        borderBottom: i < allProjects.length - 1 ? '0.5px solid #e5e3dc' : 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf8')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: '500', color: '#1a1a1a' }}>{p.name}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: avatarColors[p.initials]?.bg || '#eee',
                            color: avatarColors[p.initials]?.color || '#333',
                            fontSize: '9px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>{p.initials}</div>
                          <span style={{ color: '#555' }}>{p.client}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: p.warn ? '#854F0B' : '#555' }}>
                        {p.warn ? '⚠ ' : ''}{p.deadline}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#555' }}>{p.revisions}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          background: statusBadge[p.status]?.bg,
                          color: statusBadge[p.status]?.color,
                          fontSize: '11px', fontWeight: '500',
                          padding: '3px 8px', borderRadius: '20px',
                        }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
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
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)',
        }} onClick={() => setShowNewProject(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px',
            padding: '24px', width: '420px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>New project</div>
              <button onClick={() => setShowNewProject(false)} style={{
                background: 'none', border: 'none', fontSize: '18px',
                cursor: 'pointer', color: '#999',
              }}>×</button>
            </div>

            {[
              { label: 'Project name', placeholder: 'e.g. Brand intro video' },
              { label: 'Client', placeholder: 'Select or type client name' },
              { label: 'Start date', placeholder: 'e.g. Jun 1, 2026' },
              { label: 'Deadline', placeholder: 'e.g. Jun 30, 2026' },
              { label: 'Quoted price (₹)', placeholder: 'e.g. 18000' },
              { label: 'Max revisions', placeholder: 'e.g. 3' },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: '500',
                  color: '#666', marginBottom: '4px',
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
                color: '#666', marginBottom: '4px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Project type</label>
              <select style={{
                width: '100%', padding: '9px 12px',
                border: '0.5px solid #ddd', borderRadius: '8px',
                fontSize: '13px', color: '#1a1a1a',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', background: '#fff',
              }}>
                <option>YouTube video editing</option>
                <option>Brand / commercial video</option>
                <option>Wedding highlight reel</option>
                <option>Social media content</option>
                <option>Product launch video</option>
                <option>Corporate video</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowNewProject(false)} style={{
                flex: 1, padding: '10px',
                background: 'transparent', border: '0.5px solid #ddd',
                borderRadius: '8px', fontSize: '13px',
                color: '#666', cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => {
                alert('Project created!')
                setShowNewProject(false)
              }} style={{
                flex: 1, padding: '10px',
                background: '#1a1a1a', border: 'none',
                borderRadius: '8px', fontSize: '13px',
                color: '#fff', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: '500',
              }}>Create project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}