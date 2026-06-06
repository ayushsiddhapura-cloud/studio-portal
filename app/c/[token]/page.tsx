'use client'

import { useState } from 'react'

// Sample client data — later this will come from a real database
const clientData = {
  name: 'Rahul Kapoor',
  company: 'Kapoor Enterprises',
  email: 'rahul@kapoor.com',
  phone: '+91 98765 43210',
  initials: 'RK',
  activeSince: 'May 2026',
  totalProjects: 2,
  versionsSent: 5,
  amountDue: 18000,
  projects: [
    {
      id: 1,
      name: 'Brand intro video',
      subtitle: 'Standard Package · Brand Video Editing',
      startDate: 'May 20, 2026',
      deadline: 'Jun 7, 2026',
      deadlineWarn: true,
      revisionsUsed: 2,
      revisionsMax: 3,
      status: 'In review',
      statusBg: '#FAEEDA',
      statusColor: '#854F0B',
      progress: ['Briefing', 'Editing', 'In review', 'Approved', 'Delivered'],
      currentStep: 2,
      versions: [
        { label: 'v1', date: 'May 27', sent: true, latest: false },
        { label: 'v2', date: 'Jun 2', sent: true, latest: true },
        { label: 'v3', date: '—', sent: false, latest: false },
      ],
      revisions: [
        { round: 2, note: 'Logo animation slower, music lower, new tagline font.', date: 'Jun 3', status: 'active', submittedBy: 'You' },
        { round: 1, note: 'Warmer colour grade, 2 sec pause before CTA.', date: 'May 28', status: 'done', submittedBy: 'You' },
      ],
      files: [
        { name: 'Draft v2 — Frame.io review', type: 'frameio', sub: 'Click to open & comment', url: 'https://frame.io/review/abc123' },
        { name: 'Project brief.pdf', type: 'drive', sub: 'Google Drive · 1.2 MB', url: 'https://drive.google.com/file/d/abc' },
      ],
      invoice: {
        num: 'INV-001',
        date: 'May 22, 2026',
        projectFee: 18000,
        amountPaid: 0,
        balanceDue: 18000,
        status: 'Unpaid',
        statusBg: '#FAEEDA',
        statusColor: '#854F0B',
        dueDate: 'Jun 10, 2026',
      },
    },
    {
      id: 2,
      name: 'Product launch ad',
      subtitle: 'Standard Package · Ad Video Editing',
      startDate: 'May 28, 2026',
      deadline: 'Jun 20, 2026',
      deadlineWarn: false,
      revisionsUsed: 0,
      revisionsMax: 3,
      status: 'In progress',
      statusBg: '#E6F1FB',
      statusColor: '#185FA5',
      progress: ['Briefing', 'Editing', 'In review', 'Approved', 'Delivered'],
      currentStep: 1,
      versions: [],
      revisions: [],
      files: [
        { name: 'Project brief.pdf', type: 'drive', sub: 'Google Drive · 2.1 MB', url: 'https://drive.google.com/file/d/aryan' },
      ],
      invoice: {
        num: 'INV-002',
        date: 'Jun 1, 2026',
        projectFee: 12000,
        amountPaid: 6000,
        balanceDue: 6000,
        status: 'Partial',
        statusBg: '#FAEEDA',
        statusColor: '#854F0B',
        dueDate: 'Jun 25, 2026',
      },
    },
  ],
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function ClientPortal() {
  const [activeProject, setActiveProject] = useState(0)
  const client = clientData

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f4f0',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Top nav */}
      <div style={{
        background: '#ffffff',
        borderBottom: '0.5px solid #e5e3dc',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #639922, #4a7a19)',
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '15px',
          }}>🎬</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Studio Portal</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Your private project dashboard</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#f5f4f0', borderRadius: '20px',
          padding: '5px 12px 5px 6px',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: '#E6F1FB', color: '#185FA5',
            fontSize: '10px', fontWeight: '600',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{client.initials}</div>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#1a1a1a' }}>{client.name}</span>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '760px', margin: '0 auto' }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          background: '#ffffff',
          border: '0.5px solid #e5e3dc',
          borderRadius: '16px',
          padding: '24px 28px 0',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* subtle bg glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '300px', height: '200px',
            background: 'radial-gradient(ellipse at top right, rgba(99,153,34,0.06), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: '#f5f4f0', border: '0.5px solid #e5e3dc',
            borderRadius: '20px', padding: '4px 10px',
            fontSize: '10px', fontWeight: '600',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: '#666', marginBottom: '12px',
          }}>
            🎬 Video editing client
          </div>

          {/* Name */}
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
              {client.name.split(' ')[0]}'s{' '}
            </span>
            <span style={{ fontSize: '32px', fontWeight: '400', color: '#666', letterSpacing: '-0.5px' }}>
              Project Dashboard
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
            {client.company} — all your projects and updates in one place
          </div>

          {/* Contact row */}
          <div style={{
            display: 'flex', gap: '20px', flexWrap: 'wrap',
            padding: '12px 0',
            borderTop: '0.5px solid #e5e3dc',
          }}>
            {[
              { icon: '✉', val: client.email },
              { icon: '📞', val: client.phone },
              { icon: '📅', val: `Active since ${client.activeSince}` },
            ].map((item) => (
              <div key={item.val} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#666',
              }}>
                <span>{item.icon}</span> {item.val}
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '10px', marginBottom: '20px',
        }}>
          {[
            { label: 'Total projects', value: client.totalProjects, sub: '1 active · 1 in review', color: '#1a1a1a' },
            { label: 'Versions sent', value: client.versionsSent, sub: 'Across all projects', color: '#185FA5' },
            { label: 'Amount due', value: fmt(client.amountDue), sub: 'See invoice below', color: '#A32D2D' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#999', marginBottom: '5px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '600', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div style={{
          fontSize: '11px', fontWeight: '600',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#999', paddingBottom: '10px',
          borderBottom: '0.5px solid #e5e3dc', marginBottom: '14px',
        }}>Your projects</div>

        {/* Project tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {client.projects.map((p, i) => (
            <button key={p.id}
              onClick={() => setActiveProject(i)}
              style={{
                padding: '6px 16px', borderRadius: '20px',
                fontSize: '12px', cursor: 'pointer',
                border: '0.5px solid',
                borderColor: activeProject === i ? '#1a1a1a' : '#e5e3dc',
                background: activeProject === i ? '#1a1a1a' : '#ffffff',
                color: activeProject === i ? '#ffffff' : '#666',
                fontWeight: '500', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >{p.name}</button>
          ))}
        </div>

        {/* Active project card */}
        {client.projects.map((project, idx) => idx === activeProject && (
          <div key={project.id} style={{
            background: '#ffffff', border: '0.5px solid #e5e3dc',
            borderRadius: '16px', overflow: 'hidden',
            marginBottom: '20px',
          }}>
            {/* Project header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid #e5e3dc',
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: '10px',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{project.name}</div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>{project.subtitle}</div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    📅 Started {project.startDate}
                  </span>
                  <span style={{ fontSize: '11px', color: project.deadlineWarn ? '#854F0B' : '#666', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: project.deadlineWarn ? '500' : '400' }}>
                    🏁 Due {project.deadline}{project.deadlineWarn ? ' ⚠' : ''}
                  </span>
                  <span style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    🔄 {project.revisionsUsed} of {project.revisionsMax} revisions used
                  </span>
                </div>
              </div>
              <span style={{
                background: project.statusBg, color: project.statusColor,
                fontSize: '11px', fontWeight: '600',
                padding: '4px 12px', borderRadius: '20px', flexShrink: 0,
              }}>{project.status}</span>
            </div>

            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Progress tracker */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  📊 Project progress
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  {project.progress.map((step, i) => (
                    <div key={step} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                      {i > 0 && (
                        <div style={{
                          position: 'absolute', top: '9px', left: '-50%',
                          width: '100%', height: '1.5px',
                          background: i <= project.currentStep ? '#639922' : '#e5e3dc',
                          zIndex: 0,
                        }} />
                      )}
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: '1.5px solid',
                        borderColor: i < project.currentStep ? '#639922' : i === project.currentStep ? '#378ADD' : '#e5e3dc',
                        background: i < project.currentStep ? '#639922' : '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 5px', position: 'relative', zIndex: 1,
                        fontSize: '9px', color: i < project.currentStep ? '#fff' : i === project.currentStep ? '#378ADD' : '#ccc',
                      }}>
                        {i < project.currentStep ? '✓' : i === project.currentStep ? '●' : ''}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: i < project.currentStep ? '#639922' : i === project.currentStep ? '#378ADD' : '#999',
                        fontWeight: i === project.currentStep ? '500' : '400',
                      }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version history timeline */}
              {project.versions.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '10px' }}>
                    🎬 Version history — {project.versions.filter(v => v.sent).length} drafts sent
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: '13px',
                      left: '13px', right: '13px',
                      height: '1.5px', background: '#e5e3dc', zIndex: 0,
                    }} />
                    {project.versions.map((v) => (
                      <div key={v.label} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 5px',
                          fontSize: '10px', fontWeight: '700',
                          background: v.latest ? '#1a1a1a' : v.sent ? '#E6F1FB' : '#f5f4f0',
                          color: v.latest ? '#fff' : v.sent ? '#185FA5' : '#ccc',
                          border: `1.5px solid ${v.latest ? '#1a1a1a' : v.sent ? '#378ADD' : '#e5e3dc'}`,
                        }}>{v.label}</div>
                        <div style={{ fontSize: '10px', color: '#999' }}>{v.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.versions.length === 0 && (
                <div style={{
                  background: '#f5f4f0', borderRadius: '10px',
                  padding: '12px 14px', fontSize: '12px', color: '#999',
                }}>
                  🎬 Your first draft will appear here once it's ready. We'll update you when it's uploaded.
                </div>
              )}

              {/* Two columns — revisions + files */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Revision history */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '10px' }}>
                    🔄 Revision history
                  </div>
                  {project.revisions.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#999', background: '#f5f4f0', padding: '10px 12px', borderRadius: '8px' }}>
                      No revisions yet — your feedback will appear here.
                    </div>
                  ) : project.revisions.map((rev) => (
                    <div key={rev.round} style={{ display: 'flex', gap: '9px', marginBottom: '10px' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: '1.5px solid',
                        borderColor: rev.status === 'active' ? '#378ADD' : '#639922',
                        background: rev.status === 'done' ? '#EAF3DE' : '#E6F1FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', flexShrink: 0, marginTop: '1px',
                        color: rev.status === 'active' ? '#185FA5' : '#3B6D11',
                        fontWeight: '600',
                      }}>
                        {rev.status === 'done' ? '✓' : rev.round}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#1a1a1a', marginBottom: '3px' }}>
                          Round {rev.round} — Your feedback
                        </div>
                        <div style={{
                          fontSize: '11px', color: '#666',
                          background: '#f5f4f0', padding: '6px 9px',
                          borderRadius: '8px', lineHeight: '1.5',
                          marginBottom: '3px',
                        }}>{rev.note}</div>
                        <div style={{ fontSize: '10px', color: '#999' }}>
                          {rev.date} · {rev.status === 'active' ? 'Being worked on' : 'Done ✓'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Files */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '10px' }}>
                    📁 Files & drafts
                  </div>
                  {project.files.map((file, i) => (
                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px',
                        background: file.type === 'frameio' ? '#12122a' : '#f5f4f0',
                        border: `0.5px solid ${file.type === 'frameio' ? '#3d3d6b' : '#e5e3dc'}`,
                        borderRadius: '10px', marginBottom: '7px', cursor: 'pointer',
                      }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          background: file.type === 'frameio' ? '#7B68EE' : '#E8F0FE',
                        }}>
                          {file.type === 'frameio'
                            ? <span style={{ fontSize: '9px', fontWeight: '700', color: '#fff' }}>F.io</span>
                            : <span style={{ fontSize: '14px' }}>📄</span>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', color: file.type === 'frameio' ? '#c0bede' : '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.name}
                          </div>
                          <div style={{ fontSize: '10px', color: file.type === 'frameio' ? '#5a5a9a' : '#999', marginTop: '2px' }}>
                            {file.sub}
                          </div>
                        </div>
                        <span style={{ fontSize: '12px', color: file.type === 'frameio' ? '#7B68EE' : '#999', flexShrink: 0 }}>↗</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment section */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '10px' }}>
                  🧾 Invoice & payment — {project.invoice.num} · {project.invoice.date}
                </div>
                <div style={{
                  background: '#f5f4f0', borderRadius: '10px',
                  overflow: 'hidden', marginBottom: '10px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                    {[
                      { label: 'Project fee', value: fmt(project.invoice.projectFee), color: '#1a1a1a' },
                      { label: 'Amount paid', value: fmt(project.invoice.amountPaid), color: project.invoice.amountPaid > 0 ? '#3B6D11' : '#1a1a1a' },
                      { label: 'Balance due', value: fmt(project.invoice.balanceDue), color: project.invoice.balanceDue > 0 ? '#A32D2D' : '#3B6D11' },
                      { label: 'Status', value: project.invoice.status, isStatus: true, statusBg: project.invoice.statusBg, statusColor: project.invoice.statusColor },
                    ].map((cell, i) => (
                      <div key={cell.label} style={{
                        padding: '12px 14px',
                        borderRight: i < 3 ? '0.5px solid #e5e3dc' : 'none',
                      }}>
                        <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '5px' }}>
                          {cell.label}
                        </div>
                        {(cell as any).isStatus ? (
                          <span style={{
                            background: (cell as any).statusBg,
                            color: (cell as any).statusColor,
                            fontSize: '11px', fontWeight: '600',
                            padding: '3px 10px', borderRadius: '20px',
                          }}>{cell.value}</span>
                        ) : (
                          <div style={{ fontSize: '15px', fontWeight: '600', color: cell.color }}>{cell.value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#f5f4f0', padding: '10px 14px',
                  borderRadius: '10px', fontSize: '12px', color: '#666',
                }}>
                  <span>Due date: <strong style={{ color: '#1a1a1a' }}>{project.invoice.dueDate}</strong></span>
                  <button
                    onClick={() => alert('Invoice PDF coming soon! Your editor will send it via email.')}
                    style={{
                      background: '#1a1a1a', border: 'none',
                      borderRadius: '8px', padding: '8px 16px',
                      fontSize: '12px', color: '#fff', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: '500',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                    📄 View invoice PDF
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '20px',
        borderTop: '0.5px solid #e5e3dc',
        fontSize: '11px', color: '#999',
        background: '#ffffff', marginTop: '8px',
      }}>
        🔒 This is your private portal — only you can see this page &nbsp;·&nbsp; Studio Portal by Your Studio Name
      </div>
    </div>
  )
}