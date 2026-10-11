import { Bell, Search, UserCircle2 } from 'lucide-react'

export default function TopBar({ pageTitle, search, setSearch, notifications, notificationsOpen, setNotificationsOpen, userName = 'Admin User' }) {
  return (
    <header className="topbar">
      <div className="page-title-wrap">
        <div className="page-title">{pageTitle}</div>
      </div>

      <div className="topbar-actions">
        <label className="search-box" aria-label="Search applications">
          <Search size={15} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applications"
          />
        </label>

        <div className="notification-wrapper">
          <button
            type="button"
            className="icon-button"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell size={17} />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              {notifications.map((item) => (
                <div className="notification-item" key={item}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-pill">
          <UserCircle2 size={18} />
          <span>{userName}</span>
        </div>
      </div>
    </header>
  )
}
