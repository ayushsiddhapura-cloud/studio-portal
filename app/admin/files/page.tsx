'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦', active: false },
  { label: 'Clients', href: '/admin/clients', icon: '👥', active: false },
  { label: 'Projects', href: '/admin/projects', icon: '🎬', active: false },
  { label: 'Invoices', href: '/admin/invoices', icon: '🧾', active: false },
  { label: 'Files', href: '/admin/files', icon: '📁', active: true },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', active: false },
]

type FileItem = {
  id: number
  name: string
  type: 'frameio' | 'drive' | 'upload'
  label: string
  project: string
  client: string
  size?: string
  date: string
  url: string
  fileType: 'Draft' | 'Final' | 'Brief' | 'Invoice'
  version?: string
}

const files: FileItem[] = [
  { id: 1, name: 'Brand intro – Draft v2', type: 'frameio', label: 'Frame.io', project: 'Brand intro video', client: 'Rahul K.', date: 'Jun 2', url: 'https://frame.io/review/abc123', fileType: 'Draft', version: 'v2' },
  { id: 2, name: 'Brand intro – Draft v1', type: 'frameio', label: 'Frame.io', project: 'Brand intro video', client: 'Rahul K.', date: 'May 27', url: 'https://frame.io/review/abc111', fileType: 'Draft', version: 'v1' },
  { id: 3, name: 'project_brief_rahul.pdf', type: 'drive', label: 'Google Drive', project: 'Brand intro video', client: 'Rahul K.', size: '1.2 MB', date: 'May 20', url: 'https://drive.google.com/file/d/abc', fileType: 'Brief' },
  { id: 4, name: 'YouTube ep.4 – Final review', type: 'frameio', label: 'Frame.io', project: 'YouTube series ep.4', client: 'Priya D.', date: 'Jun 1', url: 'https://frame.io/review/ep4fin', fileType: 'Final', version: 'Final' },
  { id: 5, name: 'yt_ep4_draft_v3.mp4', type: 'frameio', label: 'Frame.io', project: 'YouTube series ep.4', client: 'Priya D.', date: 'May 29', url: 'https://frame.io/review/ep4v3', fileType: 'Draft', version: 'v3' },
  { id: 6, name: 'Wedding highlight – Draft v1', type: 'frameio', label: 'Frame.io', project: 'Wedding highlight reel', client: 'Sneha P.', date: 'Jun 3', url: 'https://frame.io/review/wed1', fileType: 'Draft', version: 'v1' },
  { id: 7, name: 'wedding_brief.pdf', type: 'drive', label: 'Google Drive', project: 'Wedding highlight reel', client: 'Sneha P.', size: '0.8 MB', date: 'May 28', url: 'https://drive.google.com/file/d/wed', fileType: 'Brief' },
  { id: 8, name: 'invoice_sneha_001.pdf', type: 'drive', label: 'Google Drive', project: 'Wedding highlight reel', client: 'Sneha P.', size: '0.3 MB', date: 'May 5', url: 'https://drive.google.com/file/d/inv1', fileType: 'Invoice' },
  { id: 9, name: 'product_brief_aryan.pdf', type: 'drive', label: 'Google Drive', project: 'Product launch ad', client: 'Aryan M.', size: '2.1 MB', date: 'May 28', url: 'https://drive.google.com/file/d/aryan', fileType: 'Brief' },
]

const fileTypeBadge: Record<string, { bg: string; color: string }> = {
  Draft: { bg: '#E6F1FB', color: '#185FA5' },
  Final: { bg: '#EDE8F8', color: '#5B3FA6' },
  Brief: { bg: '#FAEEDA', color: '#854F0B' },
  Invoice: { bg: '#EAF3DE', color: '#3B6D11' },
}

const projectGroups = Array.from(new Set(files.map(f => f.project)))

export default function FilesPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link')
  const [linkForm, setLinkForm] = useState({ url: '', label: '', project: '', type: 'Draft' })
  const [copied, setCopied] = useState<number | null>(null)

  const filteredFiles = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.project.toLowerCase().includes(search.toLowerCase()) ||
      f.client.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'All' ||
      (filterType === 'Frame.io' && f.type === 'frameio') ||
      (filterType === 'Drive' && f.type === 'drive') ||
      (filterType === 'Finals' && f.fileType === 'Final') ||
      (filterType === 'Briefs' && f.fileType === 'Brief')
    return matchSearch && matchType
  })

  const groupedFiles = projectGroups.map(proj => ({
    project: proj,
    client: files.find(f => f.project === proj)?.client || '',
    files: filteredFiles.filter(f => f.project === proj),
  })).filter(g => g.files.length > 0)

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const totalFiles = files.length
  const frameioLinks = files.filter(f => f.type === 'frameio').length
  const finals = files.filter(f => f.fileType === 'Final').length
  const driveFiles = files.filter(f => f.type === 'drive').length

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
            Files <span style={{ fontSize: '12px', color: '#999', fontWeight: '400', marginLeft: '6px' }}>{totalFiles} files</span>
          </div>
          <button
            onClick={() => setShowPanel(true)}
            style={{
              background: '#1a1a1a', border: 'none',
              borderRadius: '8px', padding: '7px 14px',
              fontSize: '12px', color: '#fff', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: '500',
            }}>☁ Upload / Add link</button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', gap: '16px' }}>

          {/* Left — file browser */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Summary stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '8px', marginBottom: '14px',
            }}>
              {[
                { label: 'Total files', value: totalFiles },
                { label: 'Frame.io links', value: frameioLinks },
                { label: 'Final deliveries', value: finals },
                { label: 'Drive files', value: driveFiles },
              ].map((s) => (
                <div key={s.label} style={{
                  background: '#ffffff', border: '0.5px solid #e5e3dc',
                  borderRadius: '10px', padding: '10px 12px',
                }}>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '3px' }}>{s.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                <span style={{
                  position: 'absolute', left: '10px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '14px', color: '#999',
                }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
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
              {['All', 'Frame.io', 'Drive', 'Finals', 'Briefs'].map((f) => (
                <button key={f}
                  onClick={() => setFilterType(f)}
                  style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                    border: '0.5px solid #ccc',
                    background: filterType === f ? '#1a1a1a' : 'transparent',
                    color: filterType === f ? '#fff' : '#666',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontWeight: filterType === f ? '500' : '400',
                  }}>{f}</button>
              ))}
            </div>

            {/* Files grouped by project */}
            {groupedFiles.length === 0 ? (
              <div style={{
                background: '#fff', border: '0.5px solid #e5e3dc',
                borderRadius: '12px', padding: '40px',
                textAlign: 'center', color: '#999', fontSize: '13px',
              }}>No files found</div>
            ) : groupedFiles.map((group) => (
              <div key={group.project} style={{ marginBottom: '18px' }}>
                {/* Group header */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    fontSize: '13px', fontWeight: '500', color: '#1a1a1a',
                  }}>
                    <span style={{ fontSize: '14px', color: '#999' }}>📁</span>
                    {group.project}
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>· {group.client}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', color: '#999',
                    background: '#f5f4f0', padding: '2px 8px',
                    borderRadius: '20px',
                  }}>{group.files.length} files</span>
                </div>

                {/* File rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {group.files.map((file) => (
                    <div key={file.id} style={{
                      background: file.type === 'frameio' ? '#12122a' : '#ffffff',
                      border: `0.5px solid ${file.type === 'frameio' ? '#3d3d6b' : '#e5e3dc'}`,
                      borderRadius: '10px', padding: '10px 14px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      {/* Icon */}
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', flexShrink: 0,
                        background: file.type === 'frameio' ? '#7B68EE'
                          : file.type === 'drive' ? '#E8F0FE'
                          : '#f5f4f0',
                      }}>
                        {file.type === 'frameio' ? (
                          <span style={{ fontSize: '9px', fontWeight: '700', color: '#fff' }}>F.io</span>
                        ) : file.type === 'drive' ? (
                          <span style={{ fontSize: '15px' }}>📄</span>
                        ) : (
                          <span style={{ fontSize: '15px' }}>🎬</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '12px', fontWeight: '500',
                          color: file.type === 'frameio' ? '#c0bede' : '#1a1a1a',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{file.name}</div>
                        <div style={{
                          fontSize: '11px', marginTop: '2px',
                          color: file.type === 'frameio' ? '#5a5a9a' : '#999',
                          display: 'flex', gap: '10px',
                        }}>
                          <span>{file.label}</span>
                          {file.size && <span>{file.size}</span>}
                          <span>{file.date}</span>
                        </div>
                      </div>

                      {/* Badge */}
                      <span style={{
                        background: fileTypeBadge[file.fileType].bg,
                        color: fileTypeBadge[file.fileType].color,
                        fontSize: '10px', fontWeight: '500',
                        padding: '2px 8px', borderRadius: '20px',
                        flexShrink: 0,
                      }}>
                        {file.fileType}{file.version ? ` · ${file.version}` : ''}
                      </span>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleCopy(file.id, file.url)}
                          style={{
                            background: 'transparent',
                            border: `0.5px solid ${file.type === 'frameio' ? '#3d3d6b' : '#ccc'}`,
                            borderRadius: '6px', padding: '5px 8px',
                            fontSize: '11px', cursor: 'pointer',
                            color: file.type === 'frameio' ? '#7B68EE' : '#555',
                            fontFamily: 'inherit',
                          }}>
                          {copied === file.id ? '✅' : '🔗'}
                        </button>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <button style={{
                            background: 'transparent',
                            border: `0.5px solid ${file.type === 'frameio' ? '#3d3d6b' : '#ccc'}`,
                            borderRadius: '6px', padding: '5px 8px',
                            fontSize: '11px', cursor: 'pointer',
                            color: file.type === 'frameio' ? '#7B68EE' : '#555',
                            fontFamily: 'inherit',
                          }}>↗</button>
                        </a>
                        <button style={{
                          background: 'transparent',
                          border: `0.5px solid ${file.type === 'frameio' ? '#3d3d6b' : '#ccc'}`,
                          borderRadius: '6px', padding: '5px 8px',
                          fontSize: '11px', cursor: 'pointer',
                          color: '#A32D2D', fontFamily: 'inherit',
                        }} onClick={() => alert('Delete file?')}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right — upload panel */}
          <div style={{ width: '220px', flexShrink: 0 }}>

            {/* Add file card */}
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '14px', marginBottom: '12px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
                + Add to project
              </div>

              {/* Tab toggle */}
              <div style={{
                display: 'flex', background: '#f5f4f0',
                borderRadius: '8px', padding: '3px',
                marginBottom: '12px', gap: '2px',
              }}>
                {(['link', 'upload'] as const).map((tab) => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1, padding: '5px 4px',
                      borderRadius: '6px', fontSize: '11px',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: '500',
                      background: activeTab === tab ? '#ffffff' : 'transparent',
                      color: activeTab === tab ? '#1a1a1a' : '#999',
                      boxShadow: activeTab === tab ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none',
                    }}>
                    {tab === 'link' ? '🔗 Link' : '☁ Upload'}
                  </button>
                ))}
              </div>

              {activeTab === 'link' ? (
                <div>
                  {/* Frame.io box */}
                  <div style={{
                    background: '#12122a', border: '1px solid #3d3d6b',
                    borderRadius: '8px', padding: '10px', marginBottom: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '4px',
                        background: '#7B68EE', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '8px', fontWeight: '700', color: '#fff',
                      }}>F</div>
                      <span style={{ fontSize: '11px', fontWeight: '500', color: '#c0bede' }}>Frame.io link</span>
                    </div>
                    <input
                      placeholder="https://frame.io/review/..."
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      style={{
                        width: '100%', padding: '6px 8px',
                        background: '#1a1a35', border: '0.5px solid #3d3d6b',
                        borderRadius: '6px', fontSize: '11px', color: '#c0bede',
                        outline: 'none', boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{
                    fontSize: '10px', color: '#999',
                    textAlign: 'center', marginBottom: '8px',
                  }}>— or paste any link —</div>

                  {[
                    { label: 'Label', placeholder: 'e.g. Draft v2', key: 'label' },
                  ].map((f) => (
                    <div key={f.key} style={{ marginBottom: '8px' }}>
                      <label style={{
                        display: 'block', fontSize: '10px',
                        color: '#666', marginBottom: '3px',
                        fontWeight: '500', textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>{f.label}</label>
                      <input
                        placeholder={f.placeholder}
                        style={{
                          width: '100%', padding: '6px 8px',
                          border: '0.5px solid #ddd', borderRadius: '6px',
                          fontSize: '12px', color: '#1a1a1a',
                          outline: 'none', boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: '8px' }}>
                    <label style={{
                      display: 'block', fontSize: '10px',
                      color: '#666', marginBottom: '3px',
                      fontWeight: '500', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>Project</label>
                    <select style={{
                      width: '100%', padding: '6px 8px',
                      border: '0.5px solid #ddd', borderRadius: '6px',
                      fontSize: '12px', color: '#1a1a1a',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit', background: '#fff',
                    }}>
                      <option>Brand intro – Rahul K.</option>
                      <option>Wedding highlight – Sneha P.</option>
                      <option>Product launch – Aryan M.</option>
                      <option>YouTube ep.4 – Priya D.</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{
                      display: 'block', fontSize: '10px',
                      color: '#666', marginBottom: '3px',
                      fontWeight: '500', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>Type</label>
                    <select style={{
                      width: '100%', padding: '6px 8px',
                      border: '0.5px solid #ddd', borderRadius: '6px',
                      fontSize: '12px', color: '#1a1a1a',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit', background: '#fff',
                    }}>
                      <option>Draft</option>
                      <option>Final delivery</option>
                      <option>Reference</option>
                    </select>
                  </div>

                  <button
                    onClick={() => alert('Link saved!')}
                    style={{
                      width: '100%', padding: '9px',
                      background: '#1a1a1a', border: 'none',
                      borderRadius: '8px', fontSize: '12px',
                      color: '#fff', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: '500',
                    }}>🔗 Save link</button>
                </div>
              ) : (
                <div>
                  <div style={{
                    border: '1.5px dashed #ccc', borderRadius: '8px',
                    padding: '20px 12px', textAlign: 'center',
                    marginBottom: '10px', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>📤</div>
                    <div style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>
                      Drop file or click to browse
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>PDF, ZIP · Max 100 MB</div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{
                      display: 'block', fontSize: '10px',
                      color: '#666', marginBottom: '3px',
                      fontWeight: '500', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>Project</label>
                    <select style={{
                      width: '100%', padding: '6px 8px',
                      border: '0.5px solid #ddd', borderRadius: '6px',
                      fontSize: '12px', color: '#1a1a1a',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit', background: '#fff',
                    }}>
                      <option>Brand intro – Rahul K.</option>
                      <option>Wedding highlight – Sneha P.</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{
                      display: 'block', fontSize: '10px',
                      color: '#666', marginBottom: '3px',
                      fontWeight: '500', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>File type</label>
                    <select style={{
                      width: '100%', padding: '6px 8px',
                      border: '0.5px solid #ddd', borderRadius: '6px',
                      fontSize: '12px', color: '#1a1a1a',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit', background: '#fff',
                    }}>
                      <option>Brief / reference</option>
                      <option>Invoice PDF</option>
                      <option>Final delivery</option>
                    </select>
                  </div>
                  <button style={{
                    width: '100%', padding: '9px',
                    background: '#1a1a1a', border: 'none',
                    borderRadius: '8px', fontSize: '12px',
                    color: '#fff', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: '500',
                  }}>☁ Upload</button>
                </div>
              )}
            </div>

            {/* Storage info */}
            <div style={{
              background: '#ffffff', border: '0.5px solid #e5e3dc',
              borderRadius: '12px', padding: '14px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>
                🗄 Storage
              </div>
              <div style={{
                height: '5px', background: '#f5f4f0',
                borderRadius: '3px', marginBottom: '6px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: '30%',
                  background: 'linear-gradient(90deg, #639922, #9B6FE0)',
                  borderRadius: '3px',
                }} />
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px' }}>
                0.9 GB of 15 GB used (Google Drive)
              </div>
              {[
                { dot: '#7B68EE', label: 'Frame.io links', val: '— (no storage)' },
                { dot: '#3B6D11', label: 'Drive uploads', val: '0.9 GB' },
              ].map((row) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', marginBottom: '5px', alignItems: 'center',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: row.dot, display: 'inline-block' }} />
                    {row.label}
                  </span>
                  <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{row.val}</span>
                </div>
              ))}
              <div style={{ fontSize: '10px', color: '#999', marginTop: '8px' }}>
                ✓ Frame.io links use zero storage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}