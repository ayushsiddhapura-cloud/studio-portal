'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '24px',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff08 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, #3b82f620 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px', background: '#fff', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 0 1px #ffffff15, 0 8px 32px #0006',
          }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="5" width="14" height="10" rx="1.5" />
              <path d="M1 8h14M4.5 5L6 1.5M8 5l1.5-3.5M11.5 5L13 1.5" />
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>
            Ayush Siddhapura
          </h1>
          <p style={{ color: '#52525b', fontSize: '14px', margin: 0 }}>Agency Operating System</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111111', borderRadius: '20px',
          border: '1px solid #1f1f1f', padding: '32px',
          boxShadow: '0 24px 64px #00000060',
        }}>
          <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 600, margin: '0 0 6px' }}>
            Welcome back
          </h2>
          <p style={{ color: '#52525b', fontSize: '13px', margin: '0 0 28px', lineHeight: 1.5 }}>
            Sign in with your Google account.<br />
            Access is by invitation only.
          </p>

          {error && (
            <div style={{
              background: '#3b1f1f', color: '#f87171', borderRadius: '10px',
              padding: '12px 14px', fontSize: '13px', marginBottom: '20px',
              border: '1px solid #ef444430',
            }}>{error}</div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#1a1a1a' : '#fff',
              color: '#111', border: 'none', borderRadius: '12px',
              padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: 600, display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'opacity 0.15s',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>

        <p style={{ color: '#3f3f46', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          Don't have access? Contact your workspace admin.
        </p>
      </div>
    </div>
  )
}
