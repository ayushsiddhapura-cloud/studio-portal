'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-page)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', color: 'var(--text-sec)', fontSize: '14px',
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
