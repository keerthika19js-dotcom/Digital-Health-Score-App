import {
  Activity,
  FileText,
  History,
  LayoutGrid,
  MonitorSmartphone,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'

const icons = {
  dashboard: LayoutGrid,
  applications: MonitorSmartphone,
  scan: Zap,
  report: FileText,
  recommendations: Sparkles,
  history: History,
  settings: Settings,
}

export default function Sidebar({ currentPage, setCurrentPage, userName = 'Admin User' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'applications', label: 'Applications', icon: 'applications' },
    { id: 'scan', label: 'Scan Application', icon: 'scan' },
    { id: 'report', label: 'Health Reports', icon: 'report' },
    { id: 'recommendations', label: 'Recommendations', icon: 'recommendations' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <div className="brand-title">Digital Health Score</div>
          <div className="brand-subtitle">Cloud-Native Monitoring</div>
        </div>
      </div>

      <nav className="side-nav" aria-label="Sidebar navigation">
        {navItems.map(({ id, label, icon }) => {
          const Icon = icons[icon]
          const isActive = currentPage === id

          return (
            <button
              key={id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-user">
        <div className="avatar-chip">
          <Activity size={14} />
        </div>
        <div>
          <span className="user-label">Logged in</span>
          <strong>{userName}</strong>
        </div>
      </div>
    </aside>
  )
}
