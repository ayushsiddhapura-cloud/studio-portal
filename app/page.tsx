'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Temporary check — we'll connect real auth later
    if (email === 'admin@studio.com' && password === 'admin123') {
      setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 1000)
    } else {
      setTimeout(() => {
        setError('Invalid email or password. Try admin@studio.com / admin123')
        setLoading(false)
      }, 800)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>

      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(99,153,34,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(55,138,221,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #639922, #4a7a19)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(99,153,34,0.3)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '26px', fontWeight: '700',
            color: '#ffffff', margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>Studio Portal</h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Admin dashboard — sign in to continue
          </p>
        </div>

        {/* Login card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '36px',
          backdropFilter: 'blur(20px)',
        }}>

          <form onSubmit={handleLogin}>

            {/* Email field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '600',
                color: '#999', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@studio.com"
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', fontSize: '14px',
                  color: '#ffffff', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(99,153,34,0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '600',
                color: '#999', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '13px 46px 13px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', fontSize: '14px',
                    color: '#ffffff', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(99,153,34,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: '#666', cursor: 'pointer', padding: '0',
                    fontSize: '13px',
                  }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(163,45,45,0.15)',
                border: '1px solid rgba(163,45,45,0.3)',
                borderRadius: '10px', padding: '12px 14px',
                fontSize: '13px', color: '#ff8080',
                marginBottom: '18px', lineHeight: '1.5',
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading
                  ? 'rgba(99,153,34,0.5)'
                  : 'linear-gradient(135deg, #639922, #4a7a19)',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                color: '#ffffff', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,153,34,0.35)',
                fontFamily: 'inherit',
                letterSpacing: '-0.2px',
              }}
            >
              {loading ? '⏳ Signing in...' : '→ Sign in to dashboard'}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', fontSize: '12px',
          color: '#444', marginTop: '24px',
        }}>
          🔒 Admin access only — client portal links are separate
        </p>
      </div>
    </div>
  )
}