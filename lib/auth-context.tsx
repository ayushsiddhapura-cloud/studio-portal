'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Role = 'owner' | 'editor' | 'manager' | 'client'

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: Role
}

interface AuthCtx {
  user: User | null
  profile: Profile | null
  role: Role | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  user: null, profile: null, role: null, loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, profile, role: profile?.role ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
