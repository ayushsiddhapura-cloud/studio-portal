// Neutral avatar styles. Four subtle grey steps keep people distinguishable
// at a glance without reintroducing colour tints into the dark theme.
const AVATARS = [
  { bg: '#1a1a1a', color: '#c4c4c4' },
  { bg: '#202020', color: '#d9d9d9' },
  { bg: '#262626', color: '#ededed' },
  { bg: '#2c2c2c', color: '#fafafa' },
]

export function av(name: string) {
  return AVATARS[(name?.charCodeAt(0) || 0) % AVATARS.length]
}
