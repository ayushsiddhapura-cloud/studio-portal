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
