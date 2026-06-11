import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  streak: number;
  username: string;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  streak,
  username,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'daily', label: 'Daily Tracker', icon: '📅' },
    { id: 'dsa', label: 'DSA Tracker', icon: '🧩' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'rules', label: 'Rules & Tips', icon: '📋' },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          <span className="logo-title">DevRoadmap</span>
          <span className="logo-sub">180 Days · 1,440 hrs</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange(item.id);
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-nav" style={{ flex: 'none', borderTop: '1px solid var(--border)', padding: '12px' }}>
        <div style={{ padding: '4px 12px 12px', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
          Logged in as <strong>{username}</strong>
        </div>
        <button
          onClick={onLogout}
          className="btn-danger"
          style={{ width: '100%', padding: '8px', cursor: 'pointer', textAlign: 'center' }}
        >
          Logout 🚪
        </button>
      </div>

      <div className="sidebar-streak">
        <div className="streak-flame">🔥</div>
        <div className="streak-info">
          <span className="streak-count" id="sidebar-streak-count">
            {streak}
          </span>
          <span className="streak-label">Day Streak</span>
        </div>
      </div>
    </aside>
  );
};
