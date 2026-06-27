'use client'

import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
        <div style={{
          width: '56px', height: '56px', background: '#3b1f1f', borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 10px' }}>Access Denied</h1>
        <p style={{ color: '#52525b', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px' }}>
          Your Google account is not on the invite list for this workspace.
          Contact your admin to get access.
        </p>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#1a1a1a', color: '#a1a1aa', border: '1px solid #2a2a2a',
          borderRadius: '10px', padding: '10px 20px', fontSize: '14px',
          textDecoration: 'none', fontWeight: 500,
        }}>
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
