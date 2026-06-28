'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/lib/sidebar'
import { IconPlus, IconCalendar } from '@/lib/icons'

export default function DashboardPage() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: p } = await supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false })
    if (c) setClients(c)
    if (p) setProjects(p)
    setLoading(false)
  }

  const now = new Date()
  const thisMonth = (d: string) => { const x = new Date(d); return x.getMonth() === now.getMonth() && x.getFullYear() === now.getFullYear() }
  const lastMonth = (d: string) => { const x = new Date(d); const l = new Date(now.getFullYear(), now.getMonth() - 1); return x.getMonth() === l.getMonth() && x.getFullYear() === l.getFullYear() }

  const totalClients = clients.length
  const activeProjects = projects.filter(p => p.status !== 'Completed').length
  const completed = projects.filter(p => p.status === 'Completed').length
  const pendingAmount = projects.filter(p => p.payment_status !== 'Paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const unpaidCount = projects.filter(p => p.payment_status !== 'Paid').length
  const totalEarned = projects.filter(p => p.payment_status === 'Paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const totalBilled = projects.reduce((s, p) => s + Number(p.amount || 0), 0)
  const thisMonthEarned = projects.filter(p => p.payment_status === 'Paid' && thisMonth(p.created_at)).reduce((s, p) => s + Number(p.amount || 0), 0)
  const lastMonthEarned = projects.filter(p => p.payment_status === 'Paid' && lastMonth(p.created_at)).reduce((s, p) => s + Number(p.amount || 0), 0)
  const addedThisMonth = clients.filter(c => thisMonth(c.created_at)).length
  const dueThisWeek = projects.filter(p => { if (!p.deadline) return false; const d = new Date(p.deadline); const week = new Date(); week.setDate(now.getDate() + 7); return d >= now && d <= week }).length

  const activeList = projects.filter(p => p.status !== 'Completed').slice(0, 5)
  const upcomingDeadlines = [...projects].filter(p => p.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 4)
  const pendingInvoices = projects.filter(p => p.payment_status !== 'Paid').slice(0, 4)

  function formatDeadline(d: string) {
    if (!d) return '—'
    const date = new Date(d)
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`
  }
  function isOverdue(d: string) { return d && new Date(d) < new Date() }
  function initials(name: string) { return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?' }
  const avatarPalette = [
    { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#dcfce7', color: '#15803d' },
    { bg: '#fce7f3', color: '#be185d' }, { bg: '#fef3c7', color: '#b45309' },
    { bg: '#ede9fe', color: '#6d28d9' }, { bg: '#ffedd5', color: '#c2410c' },
  ]
  function av(name: string) { return avatarPalette[(name?.charCodeAt(0) || 0) % avatarPalette.length] }

  const card: any = { background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '20px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Overview</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={() => router.push('/admin/projects')} style={{
              background: 'transparent', border: '1px solid var(--border-input)', borderRadius: '8px',
              color: 'var(--text-sec)', padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
            }}><IconPlus size={13} /> New project</button>
            <button onClick={() => router.push('/admin/clients')} style={{
              background: 'transparent', border: '1px solid var(--border-input)', borderRadius: '8px',
              color: 'var(--text-sec)', padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
            }}><IconPlus size={13} /> Add client</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : (
            <>
              {/* Row 1 — 3 cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div style={card}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>Total clients</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>{totalClients}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{addedThisMonth} added this month</div>
                </div>
                <div style={card}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>Active projects</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>{activeProjects}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dueThisWeek} due this week</div>
                </div>
                <div style={card}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>Completed</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>{completed}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>All time</div>
                </div>
              </div>

              {/* Row 2 — 3 cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {/* Pending payments */}
                <div style={card}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>Pending payments</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#ef4444', marginBottom: '6px', lineHeight: 1 }}>₹{pendingAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{unpaidCount} invoices unpaid</div>
                </div>
                {/* Total earnings — highlighted green border */}
                <div style={{ ...card, border: '1px solid #166534' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>Total earnings</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#4ade80', marginBottom: '6px', lineHeight: 1 }}>₹{totalEarned.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#4ade80' }}>Collected: ₹{totalBilled.toLocaleString()}</div>
                </div>
                {/* This month */}
                <div style={card}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>This month</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>₹{thisMonthEarned.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>vs ₹{lastMonthEarned.toLocaleString()} last month</div>
                </div>
              </div>

              {/* Active Projects Table */}
              <div style={{ ...card, marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Active projects</h2>
                  <Link href='/admin/projects' style={{
                    background: 'var(--bg-hover)', border: '1px solid var(--border-input)', borderRadius: '8px',
                    color: 'var(--text)', padding: '7px 14px', fontSize: '13px', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500
                  }}>View all →</Link>
                </div>

                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 90px 110px 100px', gap: '12px', padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                  {['Project', 'Client', 'Deadline', 'Revisions', 'Status', 'Payment'].map(h => (
                    <div key={h} style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</div>
                  ))}
                </div>

                {activeList.length === 0 ? (
                  <div style={{ padding: '24px 12px', color: 'var(--text-muted)', fontSize: '14px' }}>No active projects.</div>
                ) : activeList.map(p => {
                  const clientName = p.clients?.name || '—'
                  const avStyle = av(clientName)
                  const overdue = isOverdue(p.deadline)
                  return (
                    <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                      <div
                        style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 90px 110px 100px', gap: '12px', padding: '12px', borderRadius: '8px', alignItems: 'center', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: avStyle.bg, color: avStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                            {initials(clientName)}
                          </div>
                          <span style={{ fontSize: '13px', color: 'var(--text-sec)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {clientName.split(' ')[0]} {clientName.split(' ')[1]?.[0] ? clientName.split(' ')[1][0] + '.' : ''}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: overdue ? '#ef4444' : '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconCalendar size={12} /> {formatDeadline(p.deadline)}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-sec)' }}>0 / 3</div>
                        <div>
                          <span style={{
                            fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500,
                            background: p.status === 'Completed' ? '#14532d' : p.status === 'Review' ? '#3b2f00' : p.status === 'Revision' ? '#3b1f1f' : '#1e3a5f',
                            color: p.status === 'Completed' ? '#4ade80' : p.status === 'Review' ? '#fbbf24' : p.status === 'Revision' ? '#f87171' : '#60a5fa'
                          }}>{p.status}</span>
                        </div>
                        <div>
                          <span style={{
                            fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500,
                            background: p.payment_status === 'Paid' ? '#14532d' : overdue ? '#3b1f1f' : '#3b2f00',
                            color: p.payment_status === 'Paid' ? '#4ade80' : overdue ? '#f87171' : '#fbbf24'
                          }}>{overdue && p.payment_status !== 'Paid' ? 'Overdue' : p.payment_status}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Bottom two cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Upcoming deadlines */}
                <div style={card}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    Upcoming deadlines
                  </div>
                  {upcomingDeadlines.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No upcoming deadlines.</div>
                  ) : upcomingDeadlines.map(p => (
                    <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                      <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{p.title}</div>
                        <div style={{ fontSize: '13px', color: isOverdue(p.deadline) ? '#ef4444' : '#aaa', whiteSpace: 'nowrap' }}>
                          {formatDeadline(p.deadline)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pending invoices */}
                <div style={card}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    Pending invoices
                  </div>
                  {pendingInvoices.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>All invoices paid!</div>
                  ) : pendingInvoices.map(p => {
                    const clientName = p.clients?.name || '—'
                    const overdue = isOverdue(p.deadline)
                    return (
                      <Link key={p.id} href={`/admin/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                            {clientName.split(' ')[0]} {clientName.split(' ')[1]?.[0] ? clientName.split(' ')[1][0] + '.' : ''}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>₹{Number(p.amount).toLocaleString()}</span>
                            <span style={{
                              fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                              background: overdue ? '#3b1f1f' : '#3b2f00',
                              color: overdue ? '#f87171' : '#fbbf24'
                            }}>{overdue ? 'Overdue' : 'Unpaid'}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}