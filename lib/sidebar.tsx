'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import {
  IconOverview, IconClients, IconBrands, IconProjects,
  IconInvoices, IconFiles, IconSettings,
  IconSun, IconMoon, IconSignOut,
} from '@/lib/icons'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', Icon: IconOverview },
  { label: 'Clients', href: '/admin/clients', Icon: IconClients },
  { label: 'Brands', href: '/admin/brands', Icon: IconBrands },
  { label: 'Projects', href: '/admin/projects', Icon: IconProjects },
  { label: 'Invoices', href: '/admin/invoices', Icon: IconInvoices },
  { label: 'Files', href: '/admin/files', Icon: IconFiles },
  { label: 'Settings', href: '/admin/settings', Icon: IconSettings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  function initials(name: string) {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
  }

  const sidebarPanel = (
    <div style={{
      width: '220px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      overflowY: 'auto',
      ...(isMobile ? {
        position: 'fixed' as const,
        top: 0,
        left: drawerOpen ? '0' : '-240px',
        height: '100vh',
        zIndex: 200,
        transition: 'left 0.25s ease',
        boxShadow: drawerOpen ? '4px 0 32px rgba(0,0,0,0.5)' : 'none',
      } : {
        position: 'sticky' as const,
        top: 0,
        height: '100vh',
        flexShrink: 0,
        minWidth: '200px',
      }),
    }}>

      {/* Mobile close button */}
      {isMobile && (
        <button onClick={() => setDrawerOpen(false)} style={{
          position: 'absolute', top: '14px', right: '12px',
          background: 'none', border: 'none', color: 'var(--text-muted)',
          fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px',
        }}>✕</button>
      )}

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingLeft: '8px' }}>
        <div style={{ width: '30px', height: '30px', background: 'var(--text)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--bg-page)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="14" height="10" rx="1.5" />
            <path d="M1 8h14M4.5 5L6 1.5M8 5l1.5-3.5M11.5 5L13 1.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text)' }}>Studio Portal</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Admin panel</div>
        </div>
      </div>

      {/* Nav */}
      {navItems.map(item => {
        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href}
            onClick={() => isMobile && setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
              borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
              color: isActive ? 'var(--text)' : 'var(--text-inactive)',
              background: isActive ? 'var(--bg-hover)' : 'transparent',
            }}>
            <item.Icon size={16} /> {item.label}
          </Link>
        )
      })}

      {/* Bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>

        {/* User card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', marginBottom: '6px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--bg-hover)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
          }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" width="30" height="30" style={{ display: 'block', borderRadius: '50%' }} referrerPolicy="no-referrer" />
              : initials(profile?.full_name || '')}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {profile?.role}
            </div>
          </div>
        </div>

        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width: '100%', background: 'var(--bg-hover)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
          color: 'var(--text-sec)', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px',
        }}>
          {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Sign out */}
        <button onClick={signOut} style={{
          width: '100%', background: 'transparent', border: 'none',
          borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
          color: '#ef4444', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <IconSignOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: hamburger button + backdrop */}
      {isMobile && (
        <>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'fixed', top: '14px', left: '14px', zIndex: 150,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M0 1h18M0 7h18M0 13h18" />
            </svg>
          </button>
          {drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                zIndex: 199,
              }}
            />
          )}
        </>
      )}

      {sidebarPanel}
    </>
  )
}
