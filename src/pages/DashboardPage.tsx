import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { supabase, type Lead, type LeadStatus } from '@/lib/supabase'
import {
  registerServiceWorker,
  requestNotificationPermission,
  showNotification,
} from '@/lib/pushNotifications'

/* ───────────────── push toast type ───────────────── */
type LeadToast = {
  id: string
  name: string
  projectType: string
  createdAt: string
}

/* ───────────────── design tokens (dashboard-only) ───────────────── */
const COLORS = {
  bg: '#f8f8f6',
  surface: '#ffffff',
  border: '#e8e8e6',
  borderSoft: '#f0f0ee',
  sidebarBg: '#1a1a1a',
  text: '#1a1a1a',
  textMuted: '#9e9e9e',
  textFaint: '#bbbbbb',
  accent: '#7a4f1e',
  accentMid: '#C47C3A',
  accentLight: '#f0e6d8',
  success: '#3B6D11',
}

const STATUS_OPTIONS: LeadStatus[] = [
  'new',
  'in_contact',
  'scheduled',
  'waiting',
  'closed_won',
  'closed_lost',
  'no_show',
]

function getStatusBadge(status: LeadStatus) {
  const map: Record<LeadStatus, { label: string; bg: string; color: string }> = {
    new: { label: 'New', bg: '#EAF3DE', color: '#3B6D11' },
    in_contact: { label: 'In Contact', bg: '#E6F1FB', color: '#185FA5' },
    scheduled: { label: 'Scheduled', bg: '#FAEEDA', color: '#854F0B' },
    waiting: { label: 'Waiting', bg: '#EEEDFE', color: '#534AB7' },
    closed_won: { label: 'Closed Won', bg: '#EAF3DE', color: '#27500A' },
    closed_lost: { label: 'Closed Lost', bg: '#FCEBEB', color: '#A32D2D' },
    no_show: { label: 'No Show', bg: '#F1EFE8', color: '#5F5E5A' },
  }
  return map[status] ?? map.new
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function initials(name: string) {
  return (name || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/* ───────────────── icons ───────────────── */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}
const Icons = {
  overview: (p: any) => (
    <svg {...iconProps} {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  leads: (p: any) => (
    <svg {...iconProps} {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  calendar: (p: any) => (
    <svg {...iconProps} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  analytics: (p: any) => (
    <svg {...iconProps} {...p}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  ),
  logout: (p: any) => (
    <svg {...iconProps} {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
  bell: (p: any) => (
    <svg {...iconProps} {...p}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  check: (p: any) => (
    <svg {...iconProps} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  phone: (p: any) => (
    <svg {...iconProps} width={12} height={12} {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (p: any) => (
    <svg {...iconProps} width={12} height={12} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  search: (p: any) => (
    <svg {...iconProps} width={14} height={14} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  menu: (p: any) => (
    <svg {...iconProps} width={20} height={20} {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  empty: (p: any) => (
    <svg {...iconProps} width={40} height={40} stroke="#ddd" {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </svg>
  ),
}

type Tab = 'overview' | 'leads' | 'calendar' | 'analytics'

/* ───────────────── main ───────────────── */
export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  /* push + toast state */
  const [toasts, setToasts] = useState<LeadToast[]>([])
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  )
  const [dismissedBanner, setDismissedBanner] = useState(false)
  const initialLoadDone = useRef(false)

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  const addToast = (t: LeadToast) =>
    setToasts((prev) => [t, ...prev].slice(0, 4))

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission()
    setPermission(perm)
  }

  useEffect(() => {
    let active = true
    const fetchLeads = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (!active) return
      if (data) setLeads(data as Lead[])
      setLoadingLeads(false)
      initialLoadDone.current = true
    }
    fetchLeads()

    // Register service worker (no-op inside Lovable preview iframes)
    registerServiceWorker()

    // Soft-prompt for permission after 3 s — only if still default
    const permTimer = window.setTimeout(() => {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        // Don't auto-request without user gesture in some browsers; just keep banner visible.
        setPermission(Notification.permission)
      }
    }, 3000)

    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const lead = payload.new as Lead
            setLeads((prev) => [lead, ...prev])

            // Only fire notifications after the initial fetch resolves
            if (initialLoadDone.current) {
              showNotification('New Lead — Mult Flooring', {
                body: `${lead.name} submitted a quote request.\n${
                  lead.project_type || 'Project type not specified'
                }`,
                tag: lead.id,
                data: '/dashboard',
              })
              addToast({
                id: lead.id,
                name: lead.name,
                projectType: lead.project_type,
                createdAt: lead.created_at,
              })
            }
          }
          if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((l) =>
                l.id === (payload.new as Lead).id ? (payload.new as Lead) : l,
              ),
            )
          }
          if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((l) => l.id !== (payload.old as Lead).id))
          }
        },
      )
      .subscribe()

    return () => {
      active = false
      window.clearTimeout(permTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  const newCount = useMemo(() => leads.filter((l) => l.status === 'new').length, [leads])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const tabTitle: Record<Tab, string> = {
    overview: 'Overview',
    leads: 'Leads',
    calendar: 'Calendar',
    analytics: 'Analytics',
  }

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Icons.overview },
    { id: 'leads', label: 'Leads', icon: Icons.leads },
    { id: 'calendar', label: 'Calendar', icon: Icons.calendar },
    { id: 'analytics', label: 'Analytics', icon: Icons.analytics },
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: COLORS.bg,
        fontFamily: 'Inter, sans-serif',
        color: COLORS.text,
      }}
    >
      {/* ───── DESKTOP SIDEBAR ───── */}
      <aside className="dash-sidebar">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>MULT</span>
            <span style={{ fontSize: 16, fontWeight: 400, color: '#C47C3A' }}> FLOORING</span>
          </div>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.35)',
              marginTop: 4,
            }}
          >
            Staff Portal
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.25)',
              padding: '0 8px',
              marginBottom: 6,
            }}
          >
            Main
          </div>

          {navItems.map((item) => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              icon={<item.icon />}
              label={item.label}
              badge={item.id === 'leads' ? newCount : 0}
            />
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              width: '100%',
              fontSize: 13,
              color: 'rgba(255,255,255,0.40)',
              background: 'transparent',
              border: 'none',
              transition: 'color 180ms',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
          >
            <Icons.logout />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ───── MAIN ───── */}
      <div className="dash-main" style={{ flex: 1, minHeight: '100vh' }}>
        {/* HEADER */}
        <header
          style={{
            background: '#fff',
            borderBottom: `1px solid ${COLORS.border}`,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
          className="dash-header"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="dash-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                color: COLORS.text,
              }}
            >
              <Icons.menu />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 500, color: COLORS.text, margin: 0 }}>
              {tabTitle[activeTab]}
            </h1>
          </div>
          <div className="dash-date" style={{ fontSize: 13, color: COLORS.textMuted }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* CONTENT */}
        <div className="dash-content">
          {activeTab === 'overview' && <OverviewTab leads={leads} loading={loadingLeads} />}
          {activeTab === 'leads' && <LeadsTab leads={leads} loading={loadingLeads} />}
          {activeTab === 'calendar' && <CalendarTabPlaceholder />}
          {activeTab === 'analytics' && <AnalyticsTab leads={leads} loading={loadingLeads} />}
        </div>
      </div>

      {/* ───── MOBILE BOTTOM NAV ───── */}
      <nav className="dash-bottom-nav">
        {navItems.map((item) => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: active ? '#C47C3A' : 'rgba(255,255,255,0.45)',
                position: 'relative',
                minHeight: 44,
              }}
              aria-label={item.label}
            >
              <item.icon />
              {item.id === 'leads' && newCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 'calc(50% - 16px)',
                    background: '#C47C3A',
                    color: '#fff',
                    fontSize: 9,
                    borderRadius: 999,
                    padding: '1px 5px',
                    fontWeight: 600,
                  }}
                >
                  {newCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ───── MOBILE DRAWER ───── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 90,
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 260,
                background: COLORS.sidebarBg,
                zIndex: 95,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>MULT</span>
                  <span style={{ fontSize: 16, fontWeight: 400, color: '#C47C3A' }}> FLOORING</span>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: 4,
                  }}
                >
                  Staff Portal
                </div>
              </div>
              <nav style={{ padding: '16px 12px', flex: 1 }}>
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    active={activeTab === item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileNavOpen(false)
                    }}
                    icon={<item.icon />}
                    label={item.label}
                    badge={item.id === 'leads' ? newCount : 0}
                  />
                ))}
              </nav>
              <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.55)',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <Icons.logout />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .dash-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: ${COLORS.sidebarBg};
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          z-index: 50;
        }
        .dash-main { margin-left: 240px; }
        .dash-header { padding: 0 32px; }
        .dash-content { padding: 32px; }
        .dash-bottom-nav { display: none; }
        .dash-date { display: block; }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0ee 25%, #e8e8e6 50%, #f0f0ee 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1023px) {
          .dash-sidebar { display: none; }
          .dash-main { margin-left: 0; padding-bottom: 64px; }
          .dash-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: ${COLORS.sidebarBg};
            z-index: 50;
          }
          .dash-menu-btn { display: inline-flex !important; }
          .dash-header { padding: 0 20px; }
          .dash-content { padding: 20px; }
          .dash-date { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ───────────────── nav item ───────────────── */
function NavItem({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  badge: number
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        marginBottom: 2,
        fontSize: 14,
        fontWeight: active ? 500 : 400,
        transition: 'all 180ms',
        width: '100%',
        textAlign: 'left',
        border: 'none',
        background: active ? 'rgba(196,124,58,0.18)' : 'transparent',
        color: active ? '#C47C3A' : 'rgba(255,255,255,0.55)',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
        }
      }}
    >
      {icon}
      <span>{label}</span>
      {badge > 0 && (
        <span
          style={{
            background: '#C47C3A',
            color: '#fff',
            fontSize: 10,
            borderRadius: 999,
            padding: '1px 7px',
            marginLeft: 'auto',
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

/* ───────────────── shared ───────────────── */
function StatusPill({
  status,
  onClick,
}: {
  status: LeadStatus
  onClick?: (e: React.MouseEvent) => void
}) {
  const b = getStatusBadge(status)
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        background: b.bg,
        color: b.color,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {b.label}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: COLORS.accentLight,
        color: COLORS.accent,
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}

/* ───────────────── OVERVIEW ───────────────── */
function OverviewTab({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const total = leads.length
  const newCount = leads.filter((l) => l.status === 'new').length
  const scheduled = leads.filter((l) => l.status === 'scheduled').length
  const won = leads.filter((l) => l.status === 'closed_won').length
  const recent = leads.slice(0, 5)

  if (loading) {
    return (
      <div>
        <div className="metrics-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 280, marginTop: 32 }} />
      </div>
    )
  }

  return (
    <div>
      <div className="metrics-grid">
        <MetricCard label="Total Leads" value={total} sub="All time" icon={<Icons.leads />} />
        <MetricCard
          label="New Leads"
          value={newCount}
          sub="Need attention"
          icon={<Icons.bell />}
          highlight={newCount > 0 ? COLORS.accentMid : undefined}
        />
        <MetricCard
          label="Scheduled"
          value={scheduled}
          sub="Upcoming consultations"
          icon={<Icons.calendar />}
        />
        <MetricCard
          label="Closed Won"
          value={won}
          sub="Projects closed"
          icon={<Icons.check />}
          highlight={won > 0 ? COLORS.success : undefined}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: COLORS.text, margin: 0 }}>Recent leads</h2>

        {recent.length === 0 ? (
          <div
            style={{
              marginTop: 16,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              background: '#fff',
              padding: '40px 20px',
              textAlign: 'center',
              color: COLORS.textMuted,
              fontSize: 14,
            }}
          >
            No leads yet.
          </div>
        ) : (
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              overflow: 'hidden',
              background: COLORS.border,
            }}
          >
            {recent.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: '#fff',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <Avatar name={lead.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>{lead.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.textMuted,
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lead.project_type || 'No type'} · {timeAgo(lead.created_at)}
                  </div>
                </div>
                <StatusPill status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1023px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  icon,
  highlight,
}: {
  label: string
  value: number
  sub: string
  icon: React.ReactNode
  highlight?: string
}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: COLORS.textMuted,
            fontWeight: 500,
          }}
        >
          {label}
        </div>
        <div style={{ color: COLORS.textMuted }}>{icon}</div>
      </div>
      <div
        style={{
          fontSize: 'clamp(28px, 4vw, 36px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: highlight ?? COLORS.text,
          marginTop: 8,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

/* ───────────────── LEADS TAB ───────────────── */
function LeadsTab({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [search, setSearch] = useState('')
  const [scheduleLead, setScheduleLead] = useState<Lead | null>(null)

  const filtered = useMemo(
    () =>
      leads
        .filter((l) => statusFilter === 'all' || l.status === statusFilter)
        .filter((l) => {
          if (!search) return true
          const s = search.toLowerCase()
          return (
            l.name.toLowerCase().includes(s) ||
            l.email.toLowerCase().includes(s) ||
            (l.phone || '').includes(search)
          )
        }),
    [leads, statusFilter, search],
  )

  const filterOptions: { value: 'all' | LeadStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    ...STATUS_OPTIONS.map((s) => ({ value: s, label: getStatusBadge(s).label })),
  ]

  if (loading) {
    return (
      <div className="leads-grid">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: 280 }} />
        ))}
        <style>{`
          .leads-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          @media (max-width: 1279px) { .leads-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 767px)  { .leads-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      {/* TOOLBAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {filterOptions.map((opt) => {
            const active = statusFilter === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: active ? COLORS.accent : '#fff',
                  color: active ? '#fff' : '#666',
                  border: active ? `1px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                  whiteSpace: 'nowrap',
                  transition: 'all 180ms',
                  fontFamily: 'inherit',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <div style={{ position: 'relative' }} className="leads-search-wrap">
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted, display: 'inline-flex' }}>
            <Icons.search />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            style={{
              height: 40,
              padding: '0 12px 0 36px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              fontSize: 14,
              width: 240,
              fontFamily: 'inherit',
              outline: 'none',
              background: '#fff',
              color: COLORS.text,
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: '60px 20px',
            textAlign: 'center',
            color: COLORS.textMuted,
            fontSize: 14,
          }}
        >
          No leads match your filters.
        </div>
      ) : (
        <div className="leads-grid">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onSchedule={setScheduleLead} />
          ))}
        </div>
      )}

      {scheduleLead && (
        <ScheduleModal lead={scheduleLead} onClose={() => setScheduleLead(null)} />
      )}

      <style>{`
        .leads-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1279px) { .leads-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 767px)  {
          .leads-grid { grid-template-columns: 1fr; }
          .leads-search-wrap, .leads-search-wrap input { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

/* ───────────────── LEAD CARD ───────────────── */
function LeadCard({
  lead,
  onSchedule,
}: {
  lead: Lead
  onSchedule: (l: Lead) => void
}) {
  const [notes, setNotes] = useState(lead.notes || '')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const status = getStatusBadge(lead.status)

  useEffect(() => {
    setNotes(lead.notes || '')
  }, [lead.notes])

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const saveNotes = async () => {
    if (notes === (lead.notes || '')) return
    await supabase.from('leads').update({ notes }).eq('id', lead.id)
  }

  const updateStatus = async (newStatus: LeadStatus) => {
    setDropdownOpen(false)
    if (newStatus === 'scheduled') {
      onSchedule(lead)
      return
    }
    await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id)
  }

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `3px solid ${status.color}`,
        borderRadius: 10,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <Avatar name={lead.name} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {lead.name}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
              {lead.project_type || 'Not specified'}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <StatusPill status={lead.status} />
          <div style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 4 }}>
            {timeAgo(lead.created_at)}
          </div>
        </div>
      </div>

      {/* CONTACTS */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            style={{
              fontSize: 13,
              color: '#555',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 180ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
          >
            <Icons.phone /> {lead.phone}
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            style={{
              fontSize: 13,
              color: '#555',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 180ms',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
          >
            <Icons.mail /> {lead.email}
          </a>
        )}
        {lead.prefer_phone && (
          <span
            style={{
              fontSize: 10,
              background: COLORS.accentLight,
              color: COLORS.accent,
              borderRadius: 999,
              padding: '2px 8px',
              fontWeight: 500,
            }}
          >
            Prefers call
          </span>
        )}
      </div>

      {/* MESSAGE */}
      {lead.message && (
        <div
          style={{
            background: COLORS.bg,
            borderRadius: 6,
            padding: '10px 12px',
            fontSize: 13,
            color: '#666',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {lead.message}
        </div>
      )}

      {/* NOTES */}
      <div>
        <label
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: COLORS.textFaint,
            fontWeight: 500,
            display: 'block',
            marginBottom: 6,
          }}
        >
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Add a note..."
          style={{
            width: '100%',
            minHeight: 72,
            resize: 'none',
            padding: '8px 10px',
            background: COLORS.bg,
            border: '1px solid transparent',
            borderRadius: 6,
            fontSize: 13,
            fontFamily: 'inherit',
            color: '#444',
            lineHeight: 1.5,
            transition: 'border-color 180ms, background 180ms',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#e0cdb8'
            e.currentTarget.style.background = '#fff'
          }}
        />
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${COLORS.borderSoft}`,
          paddingTop: 12,
          marginTop: 'auto',
        }}
      >
        <div style={{ fontSize: 11, color: COLORS.textFaint }}>
          {new Date(lead.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <StatusPill status={lead.status} onClick={() => setDropdownOpen((v) => !v)} />
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: 6,
                background: '#fff',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: 4,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                minWidth: 160,
                zIndex: 100,
              }}
            >
              {STATUS_OPTIONS.map((s) => {
                const b = getStatusBadge(s)
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      color: COLORS.text,
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: b.color,
                      }}
                    />
                    {b.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────── SCHEDULE MODAL ───────────────── */
function ScheduleModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)

  const confirm = async () => {
    if (!date || !time) return
    setSaving(true)
    const scheduledAt = new Date(`${date}T${time}`)
    await supabase
      .from('leads')
      .update({ status: 'scheduled', scheduled_at: scheduledAt.toISOString() })
      .eq('id', lead.id)
    setSaving(false)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '0 12px',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
    color: COLORS.text,
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: COLORS.textMuted,
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="schedule-overlay"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="schedule-modal"
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          width: 380,
          maxWidth: '90vw',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 500, margin: 0, marginBottom: 4, color: COLORS.text }}>
          Schedule consultation
        </h3>
        <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 0, marginBottom: 24 }}>
          {lead.name}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              background: '#fff',
              color: COLORS.text,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!date || !time || saving}
            style={{
              flex: 1,
              height: 44,
              background: COLORS.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: !date || !time || saving ? 'not-allowed' : 'pointer',
              opacity: !date || !time || saving ? 0.6 : 1,
              fontFamily: 'inherit',
            }}
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>

        <style>{`
          @media (max-width: 767px) {
            .schedule-overlay { align-items: flex-end !important; }
            .schedule-modal {
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 16px 16px 0 0 !important;
              padding: 24px 20px 40px !important;
            }
          }
        `}</style>
      </motion.div>
    </motion.div>
  )
}

/* ───────────────── CALENDAR PLACEHOLDER ───────────────── */
function CalendarTabPlaceholder() {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '80px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', color: COLORS.textFaint }}>
        <Icons.calendar />
      </div>
      <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 12 }}>
        Calendar coming soon.
      </div>
    </div>
  )
}

/* ───────────────── ANALYTICS ───────────────── */
function AnalyticsTab({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const statusData = useMemo(
    () =>
      Object.entries(
        leads.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1
          return acc
        }, {} as Record<string, number>),
      ).map(([status, count]) => ({
        name: getStatusBadge(status as LeadStatus).label,
        count,
      })),
    [leads],
  )

  const typeData = useMemo(
    () =>
      Object.entries(
        leads.reduce((acc, l) => {
          const key = l.project_type || 'Not specified'
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {} as Record<string, number>),
      ).map(([name, value]) => ({ name, value })),
    [leads],
  )

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      const month = d.toLocaleDateString('en-US', { month: 'short' })
      const year = d.getFullYear()
      const count = leads.filter((l) => {
        const ld = new Date(l.created_at)
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === year
      }).length
      return { month, count }
    })
  }, [leads])

  const pieColors = ['#7a4f1e', '#C47C3A', '#D4956B', '#e8d8c4', '#9e8c7a', '#6b5c4a', '#3d2b1f']

  if (loading) {
    return (
      <div className="analytics-grid">
        <div className="skeleton" style={{ height: 320 }} />
        <div className="skeleton" style={{ height: 320 }} />
        <div className="skeleton" style={{ height: 280, gridColumn: '1 / -1' }} />
        <style>{`
          .analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          @media (max-width: 1023px) { .analytics-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div
        style={{
          background: '#fff',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex' }}>
          <Icons.empty />
        </div>
        <div style={{ fontSize: 14, color: COLORS.textFaint, marginTop: 8 }}>No data yet</div>
        <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>
          Leads will appear here as they come in.
        </div>
      </div>
    )
  }

  const tooltipStyle = {
    background: '#1a1a1a',
    color: '#fff',
    borderRadius: 6,
    fontSize: 12,
    border: 'none',
    padding: '6px 10px',
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: 24,
  }

  return (
    <div className="analytics-grid">
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, marginBottom: 16, color: COLORS.text }}>
          Leads by status
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke={COLORS.textMuted} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke={COLORS.textMuted} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="count" fill="#C47C3A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, marginBottom: 16, color: COLORS.text }}>
          Leads by project type
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={typeData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {typeData.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, marginBottom: 16, color: COLORS.text }}>
          Leads over time
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke={COLORS.textMuted} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke={COLORS.textMuted} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="count" fill="#C47C3A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 1023px) { .analytics-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
