export const IconOverview = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
)

export const IconClients = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="5" r="2.5" />
    <path d="M1 13.5c0-2.5 2-4.5 4.5-4.5S10 11 10 13.5" />
    <circle cx="11.5" cy="4.5" r="2" />
    <path d="M13 13.5c0-1.8-.9-3.4-2.5-4.2" />
  </svg>
)

export const IconProjects = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="14" height="10" rx="1.5" />
    <path d="M1 8h14" />
    <path d="M4.5 5L6 1.5M8 5l1.5-3.5M11.5 5L13 1.5" />
  </svg>
)

export const IconInvoices = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 1.5h10v13l-2-1.5-2 1.5-2-1.5-2 1.5V1.5z" />
    <line x1="5.5" y1="5.5" x2="10.5" y2="5.5" />
    <line x1="5.5" y1="8" x2="10.5" y2="8" />
    <line x1="5.5" y1="10.5" x2="8.5" y2="10.5" />
  </svg>
)

export const IconFiles = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 3.5h4.8l1.7 2H14.5v9H1.5z" />
  </svg>
)

export const IconSettings = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
  </svg>
)

export const IconKanban = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="2" width="4" height="12" rx="1" />
    <rect x="6" y="2" width="4" height="8" rx="1" />
    <rect x="11" y="2" width="4" height="10" rx="1" />
  </svg>
)

export const IconList = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="4" x2="13" y2="4" />
    <line x1="3" y1="8" x2="13" y2="8" />
    <line x1="3" y1="12" x2="13" y2="12" />
    <circle cx="1" cy="4" r="0.5" fill="currentColor" />
    <circle cx="1" cy="8" r="0.5" fill="currentColor" />
    <circle cx="1" cy="12" r="0.5" fill="currentColor" />
  </svg>
)

export const IconPlus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="2" x2="8" y2="14" />
    <line x1="2" y1="8" x2="14" y2="8" />
  </svg>
)

export const IconCalendar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="2" width="12" height="11" rx="1.5" />
    <line x1="1" y1="5.5" x2="13" y2="5.5" />
    <line x1="4.5" y1="1" x2="4.5" y2="3.5" />
    <line x1="9.5" y1="1" x2="9.5" y2="3.5" />
  </svg>
)

export const IconRevision = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="12" height="12" rx="2" />
    <path d="M4 7l2 2 4-4" />
  </svg>
)

export const IconSearch = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="6.5" cy="6.5" r="4.5" />
    <line x1="10" y1="10" x2="14" y2="14" />
  </svg>
)

export const IconEdit = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
  </svg>
)

export const IconUpload = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 9V2M4 5l3-3 3 3" />
    <path d="M2 11h10" />
  </svg>
)

export const IconBrands = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 13V6.5l6-4 6 4V13" />
    <rect x="5.5" y="9" width="5" height="4" rx="0.5" />
    <path d="M2 6.5h12" />
  </svg>
)

export const IconSun = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="3" />
    <line x1="8" y1="1" x2="8" y2="2.5" />
    <line x1="8" y1="13.5" x2="8" y2="15" />
    <line x1="1" y1="8" x2="2.5" y2="8" />
    <line x1="13.5" y1="8" x2="15" y2="8" />
    <line x1="3.05" y1="3.05" x2="4.1" y2="4.1" />
    <line x1="11.9" y1="11.9" x2="12.95" y2="12.95" />
    <line x1="3.05" y1="12.95" x2="4.1" y2="11.9" />
    <line x1="11.9" y1="4.1" x2="12.95" y2="3.05" />
  </svg>
)

export const IconMoon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" />
  </svg>
)

export const IconSignOut = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    <path d="M10.5 11L14 8l-3.5-3" />
    <line x1="6" y1="8" x2="14" y2="8" />
  </svg>
)

export const IconInstagram = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" />
    <circle cx="8" cy="8" r="3" />
    <circle cx="11.5" cy="4.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

export const IconLink = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 8.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5L6 3" />
    <path d="M8.5 5.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5L8 11" />
  </svg>
)

export const IconExternalLink = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" />
    <path d="M8 1h4v4" />
    <line x1="12" y1="1" x2="5.5" y2="7.5" />
  </svg>
)

export const IconFolder = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
  </svg>
)

export const IconCloud = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10a6 6 0 0 0-11.8-1.2A4 4 0 0 0 7 17h11a4 4 0 0 0 0-8z" />
    <line x1="12" y1="13" x2="12" y2="20" />
    <polyline points="9 17 12 20 15 17" />
  </svg>
)

export const IconVideo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="15" height="12" rx="2" />
    <path d="M17 10l5-3v10l-5-3" />
  </svg>
)

export const IconFileText = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
)

export const IconCopy = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1.5" />
    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
  </svg>
)

export const IconFilter = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="4" x2="14" y2="4" />
    <line x1="4" y1="8" x2="12" y2="8" />
    <line x1="6" y1="12" x2="10" y2="12" />
  </svg>
)

export const IconLock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="7" rx="1.5" />
    <path d="M5 7V4.5a3 3 0 0 1 6 0V7" />
  </svg>
)

export const IconMail = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
    <path d="M2 4l6 5 6-5" />
  </svg>
)

export const IconPhone = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2.5h2.5l1 3-1.5 1.2a8 8 0 0 0 4.3 4.3l1.2-1.5 3 1V13a1.5 1.5 0 0 1-1.5 1.5C6.6 14.5 1.5 9.4 1.5 4 1.5 3.17 2.17 2.5 3 2.5z" />
  </svg>
)

export const IconChecklist = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4l1 1 2-2" />
    <line x1="8" y1="4" x2="14" y2="4" />
    <path d="M3 9l1 1 2-2" />
    <line x1="8" y1="9" x2="14" y2="9" />
  </svg>
)

export const IconChat = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 3.5h13v8h-8L3 14v-2.5H1.5v-8z" />
  </svg>
)

export const IconFolderOpen = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 5V3.5a1 1 0 0 1 1-1h3l1.5 1.5h6a1 1 0 0 1 1 1V6" />
    <path d="M1.5 5h12.7a1 1 0 0 1 .97 1.24l-1.1 4.5a1 1 0 0 1-.97.76H2.6a1 1 0 0 1-.97-.76l-1.1-4.5A1 1 0 0 1 1.5 5z" />
  </svg>
)
