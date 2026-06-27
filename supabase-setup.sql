-- ============================================================
-- Run this in your Supabase dashboard → SQL Editor → New query
-- ============================================================

-- 1. PROFILES TABLE (one row per logged-in user)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'editor' check (role in ('owner','editor','manager','client')),
  created_at timestamptz default now()
);

-- 2. INVITED USERS TABLE (owner adds emails here before they log in)
create table if not exists invited_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'editor' check (role in ('editor','manager','client')),
  invited_by uuid references profiles(id),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Row Level Security — profiles
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Allow insert on signup" on profiles for insert with check (true);

-- 4. Row Level Security — invited_users (owner only via service role in callback)
alter table invited_users enable row level security;
create policy "Owner can manage invites" on invited_users for all using (true);

-- ============================================================
-- ALSO DO THIS IN SUPABASE DASHBOARD (UI steps, not SQL):
--
-- 1. Go to Authentication → Providers → Google → Enable it
-- 2. Add your Google OAuth Client ID and Secret
--    (get from console.cloud.google.com → APIs → Credentials)
-- 3. Set the callback URL in Google Console to:
--    https://ksswmztvyirntnotlmjz.supabase.co/auth/v1/callback
-- ============================================================
