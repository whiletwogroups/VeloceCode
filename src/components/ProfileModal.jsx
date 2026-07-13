import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { WEEKLY_AVATARS } from '../services/state.js';
import { getCourseCurriculum, COURSES } from '../content/courses.js';

export default function ProfileModal({ onClose }) {
  const { 
    currentUser, 
    state, 
    updateAvatarColor, 
    getCompletedWeeksCount, 
    getWeeklyAvatar, 
    updateUsername, 
    updatePassword, 
    showToast 
  } = useRoadmap();
  
  const [usernameInput, setUsernameInput] = useState(currentUser?.displayName || currentUser?.email.split('@')[0] || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Colors list
  const colors = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ef4444'  // Red
  ];

  const completedCount = getCompletedWeeksCount();
  const currentAvatar = getWeeklyAvatar();

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSubmittingUsername(true);
    try {
      await updateUsername(usernameInput);
      showToast("✨ Username updated successfully!", "success");
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setIsSubmittingUsername(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      showToast("⚠️ Both password fields are required", "warning");
      return;
    }
    setIsSubmittingPassword(true);
    try {
      await updatePassword(currentPw, newPw);
      showToast("🔑 Password updated successfully!", "success");
      setCurrentPw('');
      setNewPw('');
    } catch (err) {
      showToast(err.message, "warning");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const getCourseCompletionPct = (courseId) => {
    const curriculum = getCourseCurriculum(courseId);
    const courseData = state.courses[courseId];
    if (!courseData || !courseData.tasks) return 0;
    
    let total = 0, done = 0;
    curriculum.forEach((phase, pi) => {
      const pIdx = phase.phase - 1;
      phase.weeks_data.forEach(week => {
        const wIdx = week.week;
        week.days.forEach(day => {
          const globalDay = (wIdx - 1) * 5 + day.day;
          const learnId = `p${pIdx}-w${wIdx}-d${globalDay}-learn`;
          const buildId = `p${pIdx}-w${wIdx}-d${globalDay}-build`;
          
          total += 2;
          if (courseData.tasks[learnId]) done++;
          if (courseData.tasks[buildId]) done++;
        });
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  const completedCourses = COURSES.filter(c => getCourseCompletionPct(c.id) === 100);
  const isGoogleUser = currentUser && currentUser.providerData?.some(p => p.providerId === 'google.com');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 16, 0.75)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9000 }}>
      <div 
        className="card" 
        style={{ 
          width: '420px', padding: '24px', margin: 0, background: 'rgba(15, 23, 42, 0.95)', 
          border: '2px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: 'white', margin: 0 }}>Profile & Settings</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: 0 }}>&times;</button>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
          <div 
            style={{ 
              width: '42px', height: '42px', borderRadius: '50%', background: state.avatarColor || 'var(--accent-grad)',
              display: 'grid', placeItems: 'center', fontSize: '1.4rem', color: 'white', fontWeight: 800
            }}
          >
            {currentAvatar.emoji}
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', margin: '0 0 2px 0' }}>
              {currentUser?.displayName || currentUser?.email.split('@')[0]}
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
          </div>
        </div>

        {/* Username Changer Form */}
        <form onSubmit={handleUpdateUsername} style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Display Name (for Certificates):</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="form-input" 
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
              placeholder="e.g. John Doe"
              required
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmittingUsername}
              style={{ fontSize: '0.72rem', padding: '6px 12px' }}
            >
              {isSubmittingUsername ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>

        {/* Avatar Color Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Profile Color Scheme:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {colors.map(col => (
              <button 
                key={col}
                onClick={() => updateAvatarColor(col)}
                className="color-picker-dot"
                style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', background: col, border: 'none', cursor: 'pointer',
                  transform: state.avatarColor === col ? 'scale(1.2)' : '',
                  boxShadow: state.avatarColor === col ? `0 0 8px ${col}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Weekly Avatars Showcase Grid */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Weekly Avatars Progress ({completedCount} / {WEEKLY_AVATARS.length - 1} Weeks Unlocked):
          </label>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '6px', 
              maxHeight: '140px', 
              overflowY: 'auto', 
              padding: '6px', 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '6px',
              border: '1px solid var(--border)'
            }}
          >
            {WEEKLY_AVATARS.map((av, index) => {
              const isUnlocked = index <= completedCount;
              const isCurrent = index === completedCount;
              return (
                <div 
                  key={index} 
                  title={isUnlocked ? av.title : `Locked (Complete Week ${index})`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 4px',
                    borderRadius: '4px',
                    border: isCurrent ? '1.5px solid var(--accent-1)' : '1px solid var(--border)',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.1)' : isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                    opacity: isUnlocked ? 1 : 0.35,
                    textAlign: 'center',
                    fontSize: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{isUnlocked ? av.emoji : '🔒'}</span>
                  <span style={{ 
                    fontSize: '0.52rem', 
                    fontWeight: 700, 
                    color: isCurrent ? 'var(--accent-1)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    width: '100%' 
                  }}>
                    {av.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Courses Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Completed Curriculums:
          </label>
          {completedCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {completedCourses.map(c => (
                <div 
                  key={c.id} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', 
                    border: '1.5px solid var(--success)', borderRadius: '6px' 
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>🏆</span>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'white' }}>{c.title}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--success)', fontWeight: 600 }}>100% Completed · Certificate Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px', background: 'rgba(255,255,255,0.015)', border: '1px dashed var(--border)', borderRadius: '6px', textAlign: 'center' }}>
              No completed courses yet. Select a course and track lessons to completion!
            </div>
          )}
        </div>

        {/* Password Changer Form */}
        {!isGoogleUser ? (
          <form onSubmit={handleUpdatePassword} style={{ marginBottom: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Change Account Password:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="password" 
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="form-input" 
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.78rem' }}
                placeholder="Current Password"
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="password" 
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="form-input" 
                  style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
                  placeholder="New Password (min 6 chars)"
                />
                <button 
                  type="submit" 
                  className="btn-secondary" 
                  disabled={isSubmittingPassword}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                >
                  {isSubmittingPassword ? 'Changing...' : 'Change'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'left' }}>
            🔒 Authenticated via Google. Manage password credentials on your Google Account Security Dashboard.
          </div>
        )}

        <button 
          onClick={onClose}
          className="btn-primary" 
          style={{ width: '100%', padding: '8px 0', fontSize: '0.78rem' }}
        >
          Save & Exit
        </button>

      </div>
    </div>
  );
}
