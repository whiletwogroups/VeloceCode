import React, { useState } from 'react';
import { useRoadmap } from './context/RoadmapContext.jsx';
import { getWeeklyAvatar } from './services/state.js';
import { COURSES } from './content/courses.js';

// Temporary placeholder views (we will implement full versions next)
import DashboardView from './views/DashboardView.jsx';
import CourseCatalogView from './views/CourseCatalogView.jsx';
import TimelineView from './views/TimelineView.jsx';
import FocusJournalView from './views/FocusJournalView.jsx';
import DsaTrackerView from './views/DsaTrackerView.jsx';
import ProjectsView from './views/ProjectsView.jsx';
import LeaderboardView from './views/LeaderboardView.jsx';
import CertificatesView from './views/CertificatesView.jsx';
import RulesView from './views/RulesView.jsx';

import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';

export default function App() {
  const { 
    currentUser, 
    state, 
    activeCourseId, 
    activeCourseProgress,
    changeTheme, 
    changeFont,
    toast,
    dialog,
    showConfirm,
    closeDialog,
    logout,
    getWeeklyAvatar
  } = useRoadmap();

  const [currentView, setCurrentView] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync breadcrumbs titles
  const viewLabels = {
    'dashboard': 'Dashboard',
    'catalog': 'Course Catalog',
    'roadmap': 'Timeline Roadmap',
    'focus-journal': 'Focus & Journal',
    'dsa': 'DSA Tracker',
    'projects': 'Projects Panel',
    'leaderboard': 'Global Leaderboard',
    'certificates': 'Weekly Certificates',
    'rules': 'Rules & Demands',
    'profile': 'Profile & Settings'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'catalog', label: 'Course Catalog', icon: '🎓' },
    { id: 'focus-journal', label: 'Focus & Journal', icon: '⏱️' },
    { id: 'roadmap', label: 'Timeline Roadmap', icon: '🗺️' },
    { id: 'dsa', label: 'DSA Tracker', icon: '🧩' },
    { id: 'projects', label: 'Projects Panel', icon: '🚀' },
    { id: 'leaderboard', label: 'Global Leaderboard', icon: '🏆' },
    { id: 'certificates', label: 'Certificates', icon: '📜' },
    { id: 'rules', label: 'Rules & Demands', icon: '📋' }
  ];

  // Calculate global stats for current user
  const calculateGlobalStats = () => {
    // XP Calculation based on completed tasks, milestones and DSA
    let xp = 0;
    Object.values(state.courses).forEach(c => {
      // 10 XP per lesson/build checklist task
      if (c.tasks) {
        xp += Object.values(c.tasks).filter(Boolean).length * 10;
      }
      // 15 XP per milestone checkoff
      if (c.milestones) {
        xp += Object.values(c.milestones).filter(Boolean).length * 15;
      }
    });
    // 20 XP per solved Leetcode/DSA problem
    if (state.dsaProblems) {
      xp += state.dsaProblems.length * 20;
    }
    const level = Math.floor(xp / 200) + 1;
    const progressPct = Math.round(((xp % 200) / 200) * 100);
    return { xp, level, progressPct };
  };

  const { xp, level, progressPct } = calculateGlobalStats();

  // Streak calculations
  const calculateStreak = () => {
    let streak = 0;
    const cData = state.courses[state.activeCourseId];
    if (!cData || !cData.dailyLogs) return 0;
    
    let d = new Date(); d.setHours(0,0,0,0);
    const todayKey = d.toISOString().split('T')[0];
    
    if (!cData.dailyLogs[todayKey] || !cData.dailyLogs[todayKey].commit) {
      d.setDate(d.getDate() - 1);
    }
    
    while (true) {
      const k = d.toISOString().split('T')[0];
      const log = cData.dailyLogs[k];
      if (log && log.commit) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else { break; }
    }
    return streak;
  };

  const activeStreak = calculateStreak();

  // Switch to Catalog if new user has no active course initialized
  const currentActiveCourse = activeCourseProgress;
  const isCourseStarted = currentActiveCourse && currentActiveCourse.startDate;
  const courseMeta = COURSES.find(c => c.id === activeCourseId) || COURSES[0];

  const navigateToView = (viewId) => {
    if (!isCourseStarted && viewId !== 'catalog' && viewId !== 'rules' && viewId !== 'profile') {
      showConfirm(
        "⚠️ Course Enrollment Required",
        "Please select a course and configure your start date on the Course Catalog to unlock curriculum tracking views.",
        () => {},
        true // confirmOnly
      );
      setCurrentView('catalog');
    } else {
      setCurrentView(viewId);
    }
  };

  const getAvatarLetter = () => {
    if (currentUser && currentUser.displayName) return currentUser.displayName[0].toUpperCase();
    if (currentUser && currentUser.email) return currentUser.email[0].toUpperCase();
    return 'G';
  };

  const handleProfileCardClick = () => {
    if (!currentUser) {
      // Open auth modal triggers
    } else {
      setShowProfileModal(true);
    }
  };

  // Auth Blocker check
  if (!currentUser) {
    return <AuthModal />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="logo-title">VeloceCode</span>
            <span className="logo-sub">Engineering SaaS</span>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleProfileCardClick}>
              <div 
                className="profile-avatar" 
                style={{ 
                  width: '28px', height: '28px', fontSize: '1.1rem', fontWeight: 800, 
                  borderRadius: '50%', background: state.avatarColor || 'var(--accent-grad)', 
                  display: 'grid', placeItems: 'center', color: 'white' 
                }}
              >
                {getWeeklyAvatar().emoji}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                  <span>Lvl {level} Coder</span>
                  <span style={{ color: '#f59e0b', fontWeight: 800 }}>🔥 {activeStreak}d</span>
                </div>
              </div>
            </div>

            {/* Logout button - red circle with white arrow exit SVG */}
            <button 
              id="btn-auth-action" 
              title="Sign Out" 
              onClick={logout}
              style={{
                background: '#ef4444', border: 'none', borderRadius: '50%', 
                width: '22px', height: '22px', padding: '0', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)', color: '#ffffff'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>

          {/* Mini XP progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '20px', width: '100%', marginTop: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--accent-grad)' }}></div>
          </div>
        </div>

        {/* Menu Navigation Links */}
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <a 
              key={item.id} 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigateToView(item.id); }}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT LAYER ─── */}
      <main className="main-content" style={{ flex: 1 }}>
        
        {/* Top Navbar Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            <span>Workspace</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{viewLabels[currentView]}</span>
            {isCourseStarted && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ color: 'var(--accent-1)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{courseMeta.emoji}</span>
                  <span>{courseMeta.title}</span>
                </span>
              </>
            )}
          </div>

          {/* Color Themes & Switchers */}
          <div className="header-actions">
            {/* Font Pair Buttons */}
            <div className="fontbar" style={{ display: 'flex', gap: '4px', alignItems: 'center', marginRight: '10px' }}>
              <button 
                onClick={() => changeFont('public')}
                className={`font-btn ${state.selectedFont === 'public' ? 'active' : ''}`}
                style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                Public Sans
              </button>
              <button 
                onClick={() => changeFont('plex')}
                className={`font-btn ${state.selectedFont === 'plex' ? 'active' : ''}`}
                style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                IBM Plex
              </button>
            </div>

            {/* Themes Swatches */}
            <div className="themebar" style={{ display: 'flex', gap: '6px', alignItems: 'center', marginRight: '12px' }}>
              {['verdigris', 'ember', 'blueprint', 'parchment'].map(th => (
                <button 
                  key={th}
                  onClick={() => changeTheme(th)}
                  className="swatch" 
                  title={th} 
                  style={{ 
                    width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer',
                    background: th === 'verdigris' ? '#2F6F5E' : th === 'ember' ? '#4FA98C' : th === 'blueprint' ? '#C9A227' : '#7A2E2E',
                    transform: state.selectedTheme === th ? 'scale(1.25)' : '',
                    boxShadow: state.selectedTheme === th ? '0 0 8px var(--accent-1)' : '',
                    borderColor: state.selectedTheme === th ? 'var(--text-primary)' : 'var(--border)'
                  }}
                />
              ))}
            </div>

            {/* Notifications Button */}
            <button className="notification-btn" title="System Status" onClick={() => setShowNotifications(!showNotifications)}>🔔</button>

            {/* Live XP Level Pill */}
            <div className="profile-badge">
              <span>⚡ {xp} XP</span>
              <span>·</span>
              <span style={{ color: 'var(--success)' }}>LVL {level}</span>
            </div>
          </div>
        </header>

        {/* Floating notifications panel */}
        {showNotifications && (
          <div id="status-alert-box" style={{ position: 'absolute', right: '40px', top: '70px', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: 'var(--shadow-md)', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContents: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>Notifications</span>
              <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: 'auto' }}>Close</button>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>All services are online. Synced progress with local storage database.</p>
          </div>
        )}

        {/* View Router Render Block */}
        <div className="view-container" style={{ position: 'relative' }}>
          {currentView === 'dashboard' && <DashboardView navigateToView={navigateToView} />}
          {currentView === 'catalog' && <CourseCatalogView navigateToView={navigateToView} />}
          {currentView === 'roadmap' && <TimelineView />}
          {currentView === 'focus-journal' && <FocusJournalView />}
          {currentView === 'dsa' && <DsaTrackerView />}
          {currentView === 'projects' && <ProjectsView />}
          {currentView === 'leaderboard' && <LeaderboardView />}
          {currentView === 'certificates' && <CertificatesView />}
          {currentView === 'rules' && <RulesView />}
        </div>
      </main>

      {/* Floating profile settings modal */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}

      {/* Global Toast System notification alerts */}
      {toast.show && (
        <div 
          style={{ 
            position: 'fixed', right: '30px', bottom: '30px', 
            background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid var(--border)', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', borderRadius: '12px', 
            padding: '14px 24px', zIndex: 11000, display: 'flex', 
            alignItems: 'center', gap: '12px', backdropFilter: 'blur(8px)',
            animation: 'slideUp 0.3s ease-out', borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'warning' ? '#fbbf24' : '#3b82f6'}`
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Global custom confirm dialog */}
      {dialog.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 16, 0.75)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center', zIndex: 10500 }}>
          <div className="card" style={{ width: '380px', padding: '24px', margin: 0, background: 'rgba(15, 23, 42, 0.95)', border: '2px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{dialog.title}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>{dialog.message}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {!dialog.confirmOnly && (
                <button onClick={closeDialog} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>Cancel</button>
              )}
              <button 
                onClick={() => {
                  if (dialog.onConfirm) dialog.onConfirm();
                  closeDialog();
                }} 
                className="btn-primary" 
                style={{ padding: '6px 16px', fontSize: '0.74rem' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
