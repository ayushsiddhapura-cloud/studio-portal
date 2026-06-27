import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect(`${origin}/`)

  const cookieStore = await cookies()

  // Build the redirect response first so we can attach cookies to it
  const dashboardUrl = new URL('/admin/dashboard', origin)
  const loginUrl = new URL('/', origin)
  const accessDeniedUrl = new URL('/access-denied', origin)

  let redirectResponse = NextResponse.redirect(dashboardUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
            redirectResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(loginUrl)
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (existingProfile) {
    return redirectResponse
  }

  // First-ever user becomes owner (bootstrap)
  const ownerEmail = process.env.OWNER_EMAIL
  if (ownerEmail && user.email === ownerEmail) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      role: 'owner',
    })
    return redirectResponse
  }

  // Check invite list
  const { data: invite } = await supabase
    .from('invited_users')
    .select('role')
    .eq('email', user.email?.toLowerCase())
    .is('accepted_at', null)
    .single()

  if (!invite) {
    await supabase.auth.signOut()
    return NextResponse.redirect(accessDeniedUrl)
  }

  // Create profile with invited role
  await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || '',
    avatar_url: user.user_metadata?.avatar_url || '',
    role: invite.role,
  })

  // Mark invite as accepted
  await supabase
    .from('invited_users')
    .update({ accepted_at: new Date().toISOString() })
    .eq('email', user.email?.toLowerCase())

  return redirectResponse
}
