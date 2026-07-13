import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { WEEKLY_AVATARS } from '../services/state.js';
import { getCourseCurriculum, COURSES } from '../content/courses.js';

export default function ProfileModal({ onClose }) {
  const { 
    currentUser, 
    state, 
    activeCourseId,
    activeCourseProgress,
    updateAvatarColor, 
    getCompletedWeeksCount, 
    getWeeklyAvatar, 
    updateUsername, 
    updatePassword, 
    updateStartDate,
    showToast 
  } = useRoadmap();
  
  const [usernameInput, setUsernameInput] = useState(currentUser?.displayName || currentUser?.email.split('@')[0] || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  
  // Format current start date for local input field state: YYYY-MM-DD
  const [startDateInput, setStartDateInput] = useState(activeCourseProgress.startDate || '');
  
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
  const activeCourseMeta = COURSES.find(c => c.id === activeCourseId) || COURSES[0];

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSubmittingUsername(true);
    try {
      await updateUsername(usernameInput);
      showToast("✨ Display name updated successfully!", "success");
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

  const handleUpdateDate = (e) => {
    e.preventDefault();
    if (!startDateInput) {
      showToast("⚠️ Please select a valid date.", "warning");
      return;
    }
    updateStartDate(startDateInput);
    showToast("📅 Course start date updated!", "success");
  };

  const handleResetDate = () => {
    updateStartDate(null);
    setStartDateInput('');
    showToast("🗑️ Course start date has been reset.", "success");
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 16, 0.75)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 9000, padding: '20px' }}>
      <div 
        className="card profile-redesign-modal" 
        style={{ 
          width: '100%', maxWidth: '820px', padding: '28px', margin: 0, background: 'rgba(15, 23, 42, 0.95)', 
          border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.05)', 
          maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚙️</span> Profile & Settings
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Configure your developer credentials and tracking options</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', width: '28px', height: '28px', 
              display: 'grid', placeItems: 'center', transition: 'all 0.2s ease', padding: 0 
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            &times;
          </button>
        </div>

        {/* Two-column layout grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '28px' }}>
          
          {/* ─── LEFT COLUMN ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* User Identity Box Card */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 100%)', 
                border: '1.5px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', overflow: 'hidden' 
              }}
            >
              {/* Ambient Glow behind avatar */}
              <div 
                style={{ 
                  position: 'absolute', left: '10px', top: '10px', width: '60px', height: '60px', 
                  borderRadius: '4px', background: state.avatarColor || 'var(--accent-1)', 
                  opacity: 0.15, filter: 'blur(15px)', zIndex: 0 
                }}
              />

              <div 
                style={{ 
                  width: '52px', height: '52px', borderRadius: '4px', background: state.avatarColor || 'var(--accent-grad)',
                  display: 'grid', placeItems: 'center', fontSize: '1.75rem', color: 'white', fontWeight: 800,
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px ${state.avatarColor || 'rgba(99,102,241,0.2)'}`,
                  border: '2px solid rgba(255,255,255,0.1)', zIndex: 1
                }}
              >
                {currentAvatar.emoji}
              </div>
              <div style={{ zIndex: 1, textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'white', margin: '0 0 2px 0', letterSpacing: '-0.01em' }}>
                  {currentUser?.displayName || currentUser?.email.split('@')[0]}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>{currentUser?.email}</span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: '0.66rem', color: 'var(--accent-1)', fontWeight: 700 }}>
                    {activeCourseMeta.emoji} {activeCourseMeta.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Display Name Changer Form */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Display Name
              </label>
              <form onSubmit={handleUpdateUsername} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="form-input" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.15)', color: 'white' }}
                  placeholder="Certificate original name"
                  required
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmittingUsername}
                  style={{ fontSize: '0.74rem', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                >
                  {isSubmittingUsername ? 'Saving...' : 'Update'}
                </button>
              </form>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Provide your full name for generating course certificates.</span>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Profile Color Scheme
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {colors.map(col => {
                  const isSelected = state.avatarColor === col;
                  return (
                    <button 
                      key={col}
                      onClick={() => updateAvatarColor(col)}
                      className="color-picker-dot"
                      style={{ 
                        width: '26px', height: '26px', borderRadius: '4px', background: col, border: isSelected ? '2px solid white' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                        transform: isSelected ? 'scale(1.15)' : '',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? `0 0 10px ${col}` : 'none'
                      }}
                      title={col}
                    />
                  );
                })}
              </div>
            </div>

            {/* Start Date Management */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Course Start Date
              </label>
              {activeCourseProgress.startDate ? (
                <form onSubmit={handleUpdateDate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="date" 
                      value={startDateInput}
                      onChange={(e) => setStartDateInput(e.target.value)}
                      className="form-input" 
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.15)', color: 'white' }}
                      required
                    />
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ fontSize: '0.74rem', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Save Date
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleResetDate}
                    className="btn-secondary" 
                    style={{ width: '100%', fontSize: '0.74rem', padding: '8px 0', border: '1.5px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}
                  >
                    Reset Start Date (Remove Enrollment)
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px', background: 'rgba(255,255,255,0.015)', border: '1px dashed var(--border)', borderRadius: '4px', textAlign: 'center' }}>
                  No start date set. Enrollment is required to track milestones.
                </div>
              )}
            </div>

          </div>
          
          {/* ─── RIGHT COLUMN ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Weekly Avatars Showcase */}
            <div>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Avatar Unlocks
                </label>
                <span style={{ fontSize: '0.66rem', color: 'var(--accent-1)', fontWeight: 700 }}>
                  {completedCount} / {WEEKLY_AVATARS.length - 1} Weeks Done
                </span>
              </div>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(5, 1fr)', 
                  gap: '6px', 
                  maxHeight: '140px', 
                  overflowY: 'auto', 
                  padding: '8px', 
                  background: 'rgba(0,0,0,0.25)', 
                  borderRadius: '4px',
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
                        padding: '8px 4px',
                        borderRadius: '4px',
                        border: isCurrent ? '1.5px solid var(--accent-1)' : '1px solid rgba(255,255,255,0.04)',
                        background: isCurrent ? 'rgba(99, 102, 241, 0.08)' : isUnlocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)',
                        opacity: isUnlocked ? 1 : 0.35,
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: isCurrent ? '0 0 10px rgba(99,102,241,0.1)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem', marginBottom: '3px' }}>{isUnlocked ? av.emoji : '🔒'}</span>
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

            {/* Completed Curriculums */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Completed Curriculums
              </label>
              {completedCourses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {completedCourses.map(c => (
                    <div 
                      key={c.id} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        padding: '10px 14px', background: 'rgba(16, 185, 129, 0.05)', 
                        border: '1.5px solid rgba(16, 185, 129, 0.2)', borderRadius: '4px' 
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>🏆</span>
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'white' }}>{c.title}</span>
                        <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: 700 }}>100% Completed · Certificate Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px', background: 'rgba(255,255,255,0.015)', border: '1px dashed var(--border)', borderRadius: '4px', textAlign: 'center' }}>
                  No completed courses yet. Select a course and track lessons to completion!
                </div>
              )}
            </div>

            {/* Password Changer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
              {!isGoogleUser ? (
                <form onSubmit={handleUpdatePassword}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Change Account Password
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="password" 
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="form-input" 
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.15)', color: 'white' }}
                      placeholder="Current Password"
                      required
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="password" 
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="form-input" 
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.15)', color: 'white' }}
                        placeholder="New Password (min 6 chars)"
                        required
                      />
                      <button 
                        type="submit" 
                        className="btn-secondary" 
                        style={{ fontSize: '0.74rem', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Account Security
                  </label>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                    <span>🔒</span>
                    <span>Authenticated via Google. Manage security settings on your Google Account Dashboard.</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        <button 
          onClick={onClose}
          className="btn-primary" 
          style={{ width: '100%', padding: '10px 0', fontSize: '0.82rem', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', background: 'var(--accent-grad)', border: 'none', color: 'white', marginTop: '24px' }}
        >
          Save & Exit Settings
        </button>

      </div>
    </div>
  );
}
