'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    if (email === 'admin@studio.com' && password === 'admin123') {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Studio Portal</h1>
          <p style={{ color: '#aaa', fontSize: '14px', marginTop: '8px' }}>Admin Dashboard</p>
        </div>

        {/* Card */}
        <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginBottom: '24px', marginTop: 0 }}>Sign in</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='admin@studio.com'
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', background: '#2a2a2a', border: '1px solid #333',
                borderRadius: '8px', padding: '12px', color: '#fff',
                fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••'
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', background: '#2a2a2a', border: '1px solid #333',
                borderRadius: '8px', padding: '12px', color: '#fff',
                fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#3b1f1f', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', background: '#7c3aed', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '13px', cursor: 'pointer',
            fontSize: '15px', fontWeight: 600
          }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>

        <p style={{ color: '#555', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          Studio Portal · Admin only
        </p>
      </div>
    </div>
  )
}