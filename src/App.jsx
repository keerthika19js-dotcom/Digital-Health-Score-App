import { useEffect, useMemo, useState } from 'react'
import {
  Download,
  Globe,
  LogOut,
  Menu,
  Shield,
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import MetricCard from './components/MetricCard'
import ScoreRing from './components/ScoreRing'
import HealthTrendChart from './components/HealthTrendChart'
import { appData, dashboardOverview, historyRecords, notifications, recommendations, reportData, scanStages, trendSeries } from './data/healthData'

const defaultSettings = {
  automaticScan: true,
  scanFrequency: 'Weekly',
  criticalAlerts: true,
  scanNotifications: true,
  weeklySummary: true,
  twoFactor: false,
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('dhs-auth')
    return saved ? JSON.parse(saved) : false
  })
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeTrendMetric, setActiveTrendMetric] = useState('overall')
  const [selectedAppId, setSelectedAppId] = useState('shopease-web')
  const [recommendationFilter, setRecommendationFilter] = useState('All')
  const [historySort, setHistorySort] = useState('date')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dhs-settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })
  const [scanForm, setScanForm] = useState({ url: 'https://example.com', type: 'Website' })
  const [scanState, setScanState] = useState({ running: false, stageIndex: 0, result: 78, complete: false })

  useEffect(() => {
    localStorage.setItem('dhs-auth', JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  useEffect(() => {
    localStorage.setItem('dhs-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!scanState.running) return undefined

    const timer = setInterval(() => {
      setScanState((prev) => {
        if (prev.stageIndex >= scanStages.length - 1) {
          return { ...prev, running: false, complete: true, result: 78 }
        }

        return { ...prev, stageIndex: prev.stageIndex + 1 }
      })
    }, 900)

    return () => clearInterval(timer)
  }, [scanState.running])

  const visibleApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return appData
    return appData.filter((app) => `${app.name} ${app.type}`.toLowerCase().includes(query))
  }, [searchQuery])

  const filteredRecommendations = useMemo(() => {
    if (recommendationFilter === 'All') return recommendations
    return recommendations.filter((item) => item.category === recommendationFilter)
  }, [recommendationFilter])

  const sortedHistory = useMemo(() => {
    const rows = [...historyRecords]
    if (historySort === 'date') {
      rows.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      rows.sort((a, b) => b.overall - a.overall)
    }
    return rows
  }, [historySort])

  const activeApp = appData.find((app) => app.id === selectedAppId) ?? appData[0]

  const handleLogin = (event) => {
    event.preventDefault()
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleDemoLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }

  const handleStartScan = () => {
    setScanState({ running: true, stageIndex: 0, complete: false, result: 78 })
  }

  const handleDownloadReport = () => {
    const content = `Digital Health Report\n\nApplication: ${reportData.application}\nScan ID: ${reportData.scanId}\nDate: ${reportData.date}\nOverall Score: ${reportData.overall}/100\n\nPerformance: ${reportData.performance.score}/100\n- First Contentful Paint: ${reportData.performance.metrics[0][1]}\n- Largest Contentful Paint: ${reportData.performance.metrics[1][1]}\n- Total Blocking Time: ${reportData.performance.metrics[2][1]}\n- Page Size: ${reportData.performance.metrics[3][1]}\n\nSecurity: ${reportData.security.score}/100\n- ${reportData.security.issues.join('\n- ')}\n\nAccessibility: ${reportData.accessibility.score}/100\n- ${reportData.accessibility.issues.join('\n- ')}\n\nUX: ${reportData.ux.score}/100\n- ${reportData.ux.issues.join('\n- ')}`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'digital-health-report.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const pageTitleMap = {
    dashboard: 'Application Health Dashboard',
    applications: 'Monitored Applications',
    scan: 'Scan Application',
    report: 'Digital Health Report',
    recommendations: 'Prioritized Recommendations',
    history: 'Application Scan History',
    settings: 'System Settings',
    details: 'Application Details',
  }

  const renderDashboard = () => (
    <>
      <div className="overview-grid">
        <ScoreRing
          score={dashboardOverview.score}
          status={dashboardOverview.status.toUpperCase()}
          trend={dashboardOverview.trend}
          lastScanned={dashboardOverview.lastScanned}
        />

        <div className="pillar-grid">
          {dashboardOverview.pillars.map((pillar) => (
            <MetricCard
              key={pillar.name}
              title={pillar.name}
              score={pillar.score}
              status={pillar.status}
              detail={pillar.detail}
              accent={pillar.accent}
              onViewDetails={() => {
                setSelectedAppId('shopease-web')
                setCurrentPage('details')
              }}
            />
          ))}
        </div>
      </div>

      <HealthTrendChart data={trendSeries} activeMetric={activeTrendMetric} setActiveMetric={setActiveTrendMetric} />

      <section className="panel">
        <div className="panel-header-row action-header">
          <h3>Monitored Applications</h3>
          <button type="button" className="primary-button" onClick={() => setCurrentPage('scan')}>
            Run New Scan
          </button>
        </div>

        <div className="application-card-grid">
          {visibleApplications.map((app) => (
            <div className="application-card" key={app.id}>
              <div className="app-header-row">
                <div>
                  <div className="app-name">{app.name}</div>
                  <div className="app-meta">{app.type}</div>
                </div>
                <span className={`tiny-badge ${app.status === 'Healthy' ? 'good' : app.status === 'Needs Attention' ? 'warning' : 'danger'}`}>
                  {app.status}
                </span>
              </div>

              <div className="app-score-row">
                <strong>{app.score}</strong>
                <span>Health Score</span>
              </div>

              <div className="app-summary-row">
                <div>
                  <small>Last Scan</small>
                  <strong>{app.lastScan}</strong>
                </div>
                <div>
                  <small>Issues</small>
                  <strong>{app.issues}</strong>
                </div>
              </div>

              <div className="app-action-row">
                <button type="button" className="secondary-button" onClick={() => { setSelectedAppId(app.id); setCurrentPage('details') }}>
                  View
                </button>
                <button type="button" className="secondary-button muted" onClick={() => { setSelectedAppId(app.id); setCurrentPage('report') }}>
                  Scan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const renderApplications = () => (
    <section className="panel">
      <div className="panel-header-row action-header">
        <h3>Monitored Applications</h3>
      </div>

      <div className="application-list">
        {visibleApplications.map((app) => (
          <div className="application-row" key={app.id}>
            <div className="application-row-main">
              <div className="app-icon-box"><Globe size={16} /></div>
              <div>
                <div className="app-name">{app.name}</div>
                <div className="app-url">{app.url}</div>
              </div>
            </div>

            <div className="application-metrics">
              <span>{app.type}</span>
              <span>{app.lastScan}</span>
              <span className={`tiny-badge ${app.status === 'Healthy' ? 'good' : app.status === 'Needs Attention' ? 'warning' : 'danger'}`}>{app.status}</span>
            </div>

            <div className="row-actions">
              <button type="button" className="secondary-button" onClick={() => { setSelectedAppId(app.id); setCurrentPage('details') }}>
                View
              </button>
              <button type="button" className="secondary-button muted" onClick={() => { setSelectedAppId(app.id); setCurrentPage('report') }}>
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderScanPage = () => (
    <section className="panel scan-panel">
      <h3>Scan Application</h3>

      {!scanState.running && !scanState.complete && (
        <div className="scan-form">
          <label>
            Application URL
            <input type="url" value={scanForm.url} onChange={(event) => setScanForm({ ...scanForm, url: event.target.value })} placeholder="https://example.com" />
          </label>

          <label>
            Application Type
            <select value={scanForm.type} onChange={(event) => setScanForm({ ...scanForm, type: event.target.value })}>
              <option>Website</option>
              <option>Mobile Application</option>
            </select>
          </label>

          <div className="checkbox-group">
            <label><input type="checkbox" defaultChecked /> Performance</label>
            <label><input type="checkbox" defaultChecked /> Security</label>
            <label><input type="checkbox" defaultChecked /> Accessibility</label>
            <label><input type="checkbox" defaultChecked /> User Experience</label>
          </div>

          <button type="button" className="primary-button" onClick={handleStartScan}>Start Health Scan</button>
        </div>
      )}

      {(scanState.running || scanState.complete) && (
        <div className="scan-progress-box">
          <div className="progress-header">
            <span>{scanState.complete ? 'Scan Completed Successfully' : 'Scanning Application'}</span>
            <strong>{scanState.complete ? '78/100' : `${Math.min(100, ((scanState.stageIndex + 1) / scanStages.length) * 100).toFixed(0)}%`}</strong>
          </div>

          <div className="progress-track large">
            <span className="progress-fill" style={{ width: `${scanState.complete ? 100 : ((scanState.stageIndex + 1) / scanStages.length) * 100}%` }} />
          </div>

          <ul className="scan-stage-list">
            {scanStages.map((stage, index) => (
              <li key={stage} className={index <= scanState.stageIndex ? 'done' : ''}>
                {stage}
              </li>
            ))}
          </ul>

          {scanState.complete && (
            <div className="completion-box">
              <div className="result-summary">Digital Health Score: 78/100</div>
              <div className="completion-actions">
                <button type="button" className="primary-button" onClick={() => setCurrentPage('report')}>View Report</button>
                <button type="button" className="secondary-button" onClick={() => setScanState({ running: false, stageIndex: 0, complete: false, result: 78 })}>Run Another Scan</button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )

  const renderReportPage = () => (
    <section className="panel report-panel">
      <div className="report-head-row">
        <div>
          <h3>Digital Health Report</h3>
          <div className="report-meta-line">Application: {reportData.application}</div>
          <div className="report-meta-line">Scan ID: {reportData.scanId}</div>
          <div className="report-meta-line">Date: {reportData.date}</div>
        </div>

        <button type="button" className="primary-button" onClick={handleDownloadReport}>
          <Download size={14} /> Download Report
        </button>
      </div>

      <div className="report-score-box">
        Overall Score: {reportData.overall}/100
      </div>

      <div className="report-sections">
        <div className="report-card">
          <h4>Performance <span>{reportData.performance.score}/100</span></h4>
          <ul>
            {reportData.performance.metrics.map(([key, value]) => (
              <li key={key}><span>{key}</span><strong>{value}</strong></li>
            ))}
          </ul>
        </div>

        <div className="report-card">
          <h4>Security <span>{reportData.security.score}/100</span></h4>
          <ul>
            {reportData.security.issues.map((issue) => (
              <li key={issue}><span>Issue</span><strong>{issue}</strong></li>
            ))}
          </ul>
        </div>

        <div className="report-card">
          <h4>Accessibility <span>{reportData.accessibility.score}/100</span></h4>
          <ul>
            {reportData.accessibility.issues.map((issue) => (
              <li key={issue}><span>Issue</span><strong>{issue}</strong></li>
            ))}
          </ul>
        </div>

        <div className="report-card">
          <h4>UX <span>{reportData.ux.score}/100</span></h4>
          <ul>
            {reportData.ux.issues.map((issue) => (
              <li key={issue}><span>Issue</span><strong>{issue}</strong></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )

  const renderRecommendations = () => (
    <section className="panel recommendation-panel">
      <div className="panel-header-row action-header">
        <h3>Prioritized Recommendations</h3>
        <div className="filter-chips">
          {['All', 'Performance', 'Security', 'Accessibility', 'UX'].map((filterValue) => (
            <button
              key={filterValue}
              type="button"
              className={recommendationFilter === filterValue ? 'chip active' : 'chip'}
              onClick={() => setRecommendationFilter(filterValue)}
            >
              {filterValue}
            </button>
          ))}
        </div>
      </div>

      <div className="recommendation-list">
        {filteredRecommendations.map((item) => (
          <article className="recommendation-item" key={item.id}>
            <div className="recommendation-topline">
              <h4>{item.title}</h4>
              <span className={`status-badge ${item.severity === 'High' ? 'status-warning' : item.severity === 'Medium' ? 'status-info' : 'status-good'}`}>
                {item.severity}
              </span>
            </div>

            <div className="recommendation-meta">
              <span>Category: {item.category}</span>
              <span>Impact: {item.impact}</span>
              <span>Effort: {item.effort}</span>
            </div>

            <p>{item.recommendation}</p>
          </article>
        ))}
      </div>
    </section>
  )

  const renderHistory = () => (
    <section className="panel history-panel">
      <div className="panel-header-row action-header">
        <h3>Historical Scan Data</h3>
        <div className="history-controls">
          <select value={historySort} onChange={(event) => setHistorySort(event.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Date</th>
              <th>Performance</th>
              <th>Security</th>
              <th>Accessibility</th>
              <th>UX</th>
              <th>Overall</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((row) => (
              <tr key={`${row.application}-${row.date}`}>
                <td>{row.application}</td>
                <td>{formatDate(row.date)}</td>
                <td>{row.performance}</td>
                <td>{row.security}</td>
                <td>{row.accessibility}</td>
                <td>{row.ux}</td>
                <td>{row.overall}</td>
                <td><span className={`tiny-badge ${row.status === 'Good' ? 'good' : 'warning'}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-chart-block">
        <HealthTrendChart data={trendSeries} activeMetric={activeTrendMetric} setActiveMetric={setActiveTrendMetric} />
      </div>
    </section>
  )

  const renderSettings = () => (
    <section className="panel settings-panel">
      <h3>Profile Settings</h3>
      <div className="settings-grid">
        <div className="settings-group">
          <label>Name
            <input type="text" defaultValue="Admin User" />
          </label>
          <label>Email
            <input type="email" defaultValue="admin@digitalhealthscore.com" />
          </label>
        </div>

        <div className="settings-group">
          <h4>Scan Settings</h4>
          <label className="toggle-row">
            <span>Automatic scanning</span>
            <input type="checkbox" checked={settings.automaticScan} onChange={() => setSettings({ ...settings, automaticScan: !settings.automaticScan })} />
          </label>
          <label>
            Scan frequency
            <select value={settings.scanFrequency} onChange={(event) => setSettings({ ...settings, scanFrequency: event.target.value })}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
        </div>

        <div className="settings-group">
          <h4>Notifications</h4>
          <label className="toggle-row"><span>Critical issue alerts</span><input type="checkbox" checked={settings.criticalAlerts} onChange={() => setSettings({ ...settings, criticalAlerts: !settings.criticalAlerts })} /></label>
          <label className="toggle-row"><span>Scan completion notifications</span><input type="checkbox" checked={settings.scanNotifications} onChange={() => setSettings({ ...settings, scanNotifications: !settings.scanNotifications })} /></label>
          <label className="toggle-row"><span>Weekly health summary</span><input type="checkbox" checked={settings.weeklySummary} onChange={() => setSettings({ ...settings, weeklySummary: !settings.weeklySummary })} /></label>
        </div>

        <div className="settings-group">
          <h4>Security</h4>
          <label className="toggle-row"><span>Change password</span><button type="button" className="secondary-button muted">Update</button></label>
          <label className="toggle-row"><span>Two-factor authentication</span><input type="checkbox" checked={settings.twoFactor} onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })} /></label>
        </div>
      </div>
    </section>
  )

  const renderDetails = () => (
    <section className="panel details-panel">
      <div className="details-grid">
        <div className="details-main-card">
          <div className="app-name-row">
            <div>
              <div className="app-name large">{activeApp.name}</div>
              <div className="app-url">{activeApp.url}</div>
            </div>
            <span className={`tiny-badge ${activeApp.status === 'Healthy' ? 'good' : activeApp.status === 'Needs Attention' ? 'warning' : 'danger'}`}>{activeApp.status}</span>
          </div>

          <div className="details-meta-row">
            <div><small>Application Type</small><strong>{activeApp.type}</strong></div>
            <div><small>Current Health Score</small><strong>{activeApp.score}</strong></div>
            <div><small>Last Scan</small><strong>{activeApp.lastScan}</strong></div>
            <div><small>Number of Issues</small><strong>{activeApp.issues}</strong></div>
          </div>
        </div>

        <div className="detail-score-grid">
          <div className="mini-stat"><span>Performance</span><strong>{activeApp.performance}</strong></div>
          <div className="mini-stat"><span>Security</span><strong>{activeApp.security}</strong></div>
          <div className="mini-stat"><span>Accessibility</span><strong>{activeApp.accessibility}</strong></div>
          <div className="mini-stat"><span>UX</span><strong>{activeApp.ux}</strong></div>
        </div>
      </div>

      <div className="detail-lists">
        <div className="detail-card">
          <h4>Recent scans</h4>
          <ul>
            {activeApp.recentScans.map((scan) => <li key={scan}>{scan}</li>)}
          </ul>
        </div>

        <div className="detail-card">
          <h4>Open issues</h4>
          <ul>
            {activeApp.openIssues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        </div>

        <div className="detail-card">
          <h4>Recommendations</h4>
          <ul>
            {recommendations.slice(0,3).map((item) => <li key={item.id}>{item.title}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )

  const pageContent = (() => {
    switch (currentPage) {
      case 'applications':
        return renderApplications()
      case 'scan':
        return renderScanPage()
      case 'report':
        return renderReportPage()
      case 'recommendations':
        return renderRecommendations()
      case 'history':
        return renderHistory()
      case 'settings':
        return renderSettings()
      case 'details':
        return renderDetails()
      default:
        return renderDashboard()
    }
  })()

  if (!isLoggedIn) {
    return (
      <div className="login-shell">
        <div className="login-panel">
          <div className="login-copy">
            <div className="brand-badge"><Shield size={18} /> Digital Health Score</div>
            <h1>Application Health Assessment Platform</h1>
            <p>Cloud-Native Application Monitoring</p>
            <div className="hero-stats">
              <div><strong>78</strong><span>Digital Health Score</span></div>
              <div><strong>4</strong><span>Pillars Monitored</span></div>
              <div><strong>24/7</strong><span>Monitoring</span></div>
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h2>Welcome back</h2>
            <label>
              Email
              <input type="email" defaultValue="admin@digitalhealthscore.com" />
            </label>
            <label>
              Password
              <input type="password" defaultValue="digitalhealth" />
            </label>

            <button type="submit" className="primary-button" style={{ width: '100%' }}>Login</button>
            <button type="button" className="secondary-button login-demo" onClick={handleDemoLogin}>Demo Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userName="Admin User" />
      </aside>

      <div className="sidebar-shell desktop-only">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userName="Admin User" />
      </div>

      <main className="main-panel">
        <TopBar
          pageTitle={pageTitleMap[currentPage] || 'Application Health Dashboard'}
          search={searchQuery}
          setSearch={setSearchQuery}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          userName="Admin User"
        />

        <div className="mobile-topbar-tools">
          <button type="button" className="icon-button mobile-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle menu">
            <Menu size={18} />
          </button>
          <button type="button" className="secondary-button muted" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>

        {pageContent}
      </main>
    </div>
  )
}

export default App
