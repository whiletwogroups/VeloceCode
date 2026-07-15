import React, { useState, useEffect } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { getCourseCurriculum } from '../content/courses.js';
import { formatResourceLabel } from '../utils/date.js';

export default function FocusJournalView() {
  const { 
    activeCourseId, 
    activeCourseProgress, 
    saveDailyLog, 
    showConfirm,
    toggleTask,
    showToast,
    // Timer values from context
    timerMinutes,
    timerSeconds,
    isTimerRunning,
    timerLabel,
    ambientSound,
    timerVolume,
    setTimerVolume,
    startTimer,
    pauseTimer,
    resetTimer,
    changeTimerDuration,
    setAmbientSound
  } = useRoadmap();

  // Selected date page navigation
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExtraRefs, setShowExtraRefs] = useState(false);

  // Curriculum calculations
  const curriculum = getCourseCurriculum(activeCourseId);
  const allDays = [];
  curriculum.forEach((phase, phaseIdx) => {
    phase.weeks_data.forEach((week, weekIdx) => {
      week.days.forEach((day, dayIdx) => {
        allDays.push({
          phaseIndex: phaseIdx,
          weekIndex: weekIdx,
          dayIndex: dayIdx,
          phase,
          week,
          day
        });
      });
    });
  });

  const getDayNumberForDate = (dateStr) => {
    if (!activeCourseProgress || !activeCourseProgress.startDate) return null;
    const start = new Date(activeCourseProgress.startDate);
    const target = new Date(dateStr);
    start.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    const diff = Math.floor((target - start) / 86400000);
    const day = diff + 1;
    if (isNaN(day)) return null;
    return day;
  };

  const dayNum = getDayNumberForDate(selectedDate);
  const currentDayData = (dayNum && dayNum >= 1 && dayNum <= allDays.length) ? allDays[dayNum - 1] : null;

  // Retrieve task IDs for the selected day to bind checkmarks in the target cards
  const getTaskIdsForDay = () => {
    if (!currentDayData) return { learnId: '', buildId: '' };
    const { phaseIndex, week, day } = currentDayData;
    // Follow the identical format used in TimelineView
    const globalDay = (week.week - 1) * 5 + day.day;
    const learnId = `p${phaseIndex}-w${week.week}-d${globalDay}-learn`;
    const buildId = `p${phaseIndex}-w${week.week}-d${globalDay}-build`;
    return { learnId, buildId };
  };

  const { learnId, buildId } = getTaskIdsForDay();

  // Load journal logs for selected date
  const getLogForDate = (date) => {
    return activeCourseProgress.dailyLogs[date] || {
      learned: false,
      coded: false,
      dsa: false,
      commit: false,
      review: false,
      notes: '',
      focusMinutes: 0
    };
  };

  // Local state for the selected date's log
  const [localLog, setLocalLog] = useState(() => getLogForDate(selectedDate));
  
  // When selectedDate changes, update local state
  useEffect(() => {
    setLocalLog(getLogForDate(selectedDate));
  }, [selectedDate]);

  // Keep focusMinutes synced from context in case the timer completes in the background
  const contextLog = getLogForDate(selectedDate);
  useEffect(() => {
    setLocalLog(prev => ({
      ...prev,
      focusMinutes: contextLog.focusMinutes
    }));
  }, [contextLog.focusMinutes]);

  const toggleChecklist = (field) => {
    setLocalLog(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setLocalLog(prev => ({
      ...prev,
      notes: val
    }));
  };

  const insertMarkdownHelper = (prefix, suffix) => {
    const textarea = document.getElementById('log-notes-input');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    
    setLocalLog(prev => ({
      ...prev,
      notes: updatedText
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    }, 10);
  };

  const handleSubmitDay = () => {
    // Save to context/database
    saveDailyLog(selectedDate, localLog);

    // Play confetti animation applauding completion
    import('canvas-confetti').then((module) => {
      const confetti = module.default;
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }).catch(e => console.error("Failed to load canvas-confetti:", e));

    showToast("🎉 Daily journal submitted! Progress updated in real-time.", "success");
  };

  const changeSelectedDay = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Compute ring outline offset using global timer values
  const totalMins = timerMinutes * 60 + timerSeconds;
  const initialSecs = timerLabel === 'Focus' ? 25 * 60 : timerLabel === 'Learn' ? 50 * 60 : timerLabel === 'Rest' ? 5 * 60 : 15 * 60;
  const circumference = 503;
  const strokeOffset = initialSecs ? circumference - (totalMins / initialSecs) * circumference : 0;

  // Resource link pill renderer
  const renderTargetLinkPills = (links, type) => {
    if (!links || links.length === 0) {
      return <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No {type === 'video' ? 'videos' : 'documentations'} recommended.</div>;
    }
    const filtered = links.filter(l => l.type === type);
    if (filtered.length === 0) {
      return <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No {type === 'video' ? 'videos' : 'documentations'} recommended.</div>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
        {filtered.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={`link-pill ${l.type}`}>
            {l.type === 'video' ? '▶' : '📖'} {formatResourceLabel(l)}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Focus Session & Daily Journal</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Synthesize background audio, run focus countdown timers, and log daily checklist milestones.</p>
        </div>
      </div>

      <div className="focus-journal-layout" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
        
        {/* LEFT PANEL: Tasks, Checklists & Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* DAILY CURRICULUM TARGETS (Rendered similar to before migration) */}
          {currentDayData ? (
            <div className="card" style={{ padding: '22px' }}>
              <div className="daily-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="daily-phase-badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent-1)', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem' }}>
                    Phase {currentDayData.phaseIndex + 1}
                  </span>
                  <span className="daily-week-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>
                    {currentDayData.week.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-2)' }}>
                  Day {dayNum} Course Material
                </span>
              </div>

              {/* Target columns grid */}
              <div className="target-grid">
                
                {/* LEARN Target Card */}
                <div className="target-card">
                  <div className="target-card-header">
                    <span className="target-card-icon">📚</span>
                    <span className="target-card-label" style={{ color: 'var(--text-primary)' }}>9:30–12:30 · LEARN</span>
                    
                    {/* Synchronized timeline checkmark */}
                    <div 
                      onClick={() => toggleTask(learnId)}
                      className={`journal-check-card-indicator ${activeCourseProgress.tasks[learnId] ? 'checked' : ''}`}
                      style={{ 
                        marginLeft: 'auto', 
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        display: 'grid', placeItems: 'center', cursor: 'pointer',
                        background: activeCourseProgress.tasks[learnId] ? 'var(--completed)' : 'transparent',
                        borderColor: activeCourseProgress.tasks[learnId] ? 'var(--completed)' : 'rgba(255,255,255,0.15)'
                      }}
                    >
                      {activeCourseProgress.tasks[learnId] && (
                        <span style={{ fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                  </div>
                  <div className="target-card-body">{currentDayData.day.learn}</div>
                  
                  <div className="target-card-links">
                    <div className="target-link-section">
                      <span className="target-link-title">Recommended Videos</span>
                      {renderTargetLinkPills(currentDayData.day.learnLinks, 'video')}
                    </div>
                    <div className="target-link-section">
                      <span className="target-link-title">Documentation & Manuals</span>
                      {renderTargetLinkPills(currentDayData.day.learnLinks, 'doc')}
                    </div>
                  </div>
                </div>

                {/* BUILD Target Card */}
                <div className="target-card">
                  <div className="target-card-header">
                    <span className="target-card-icon">💻</span>
                    <span className="target-card-label" style={{ color: 'var(--text-primary)' }}>13:30–17:00 · BUILD</span>
                    
                    {/* Synchronized timeline checkmark */}
                    <div 
                      onClick={() => toggleTask(buildId)}
                      className={`journal-check-card-indicator ${activeCourseProgress.tasks[buildId] ? 'checked' : ''}`}
                      style={{ 
                        marginLeft: 'auto', 
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        display: 'grid', placeItems: 'center', cursor: 'pointer',
                        background: activeCourseProgress.tasks[buildId] ? 'var(--completed)' : 'transparent',
                        borderColor: activeCourseProgress.tasks[buildId] ? 'var(--completed)' : 'rgba(255,255,255,0.15)'
                      }}
                    >
                      {activeCourseProgress.tasks[buildId] && (
                        <span style={{ fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                  </div>
                  <div className="target-card-body">{currentDayData.day.build}</div>

                  <div className="target-card-links">
                    <div className="target-link-section">
                      <span className="target-link-title">Recommended Videos</span>
                      {renderTargetLinkPills(currentDayData.day.buildLinks, 'video')}
                    </div>
                    <div className="target-link-section">
                      <span className="target-link-title">Documentation & Manuals</span>
                      {renderTargetLinkPills(currentDayData.day.buildLinks, 'doc')}
                    </div>
                  </div>
                </div>

              </div>

              {/* Weekly Capstone Deliverable Target */}
              {currentDayData.week.deliverable && (
                <div className="daily-deliverable" style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.04)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--success)', display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.76rem' }}>🎯 Deliverable:</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.74rem', fontWeight: 600 }}>{currentDayData.week.deliverable}</span>
                </div>
              )}

              {/* Collapsible Git, GitHub & CI/CD Core Tutorials */}
              <div style={{ marginTop: '20px', border: '1px dashed rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.15)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContents: 'space-between', cursor: 'pointer' }} onClick={() => setShowExtraRefs(!showExtraRefs)}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>🎬</span> Core Git, GitHub & CI/CD Reference Tutorials
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transition: 'transform 0.3s ease', transform: showExtraRefs ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
                {showExtraRefs && (
                  <div style={{ display: 'flex', marginTop: '14px', flexDirection: 'column', gap: '8px' }}>
                    <a href="https://www.youtube.com/watch?v=8JJ101D3knE" target="_blank" rel="noopener noreferrer" className="extra-ref-item">
                      <span className="extra-ref-num">1</span>
                      <span className="extra-ref-title">"Complete Git & GitHub Tutorial: Beginner to PRO" — VarJosh</span>
                      <span className="extra-ref-meta">Cloud Workflow</span>
                    </a>
                    <a href="https://www.youtube.com/watch?v=H5GJZTa__W4" target="_blank" rel="noopener noreferrer" className="extra-ref-item">
                      <span className="extra-ref-num">2</span>
                      <span className="extra-ref-title">"Git & GitHub Crash Course for Beginners" — logicBase Labs</span>
                      <span className="extra-ref-meta">Conflicts & Stash</span>
                    </a>
                    <a href="https://www.youtube.com/watch?v=IiwGbcd8S7I" target="_blank" rel="noopener noreferrer" className="extra-ref-item">
                      <span className="extra-ref-num">3</span>
                      <span className="extra-ref-title">"Git and GitHub Full Course for Beginners" — Malvik Vaghadia</span>
                      <span className="extra-ref-meta">Branch Policies</span>
                    </a>
                    <a href="https://www.youtube.com/watch?v=apGV9Ad7XY0" target="_blank" rel="noopener noreferrer" className="extra-ref-item">
                      <span className="extra-ref-num">4</span>
                      <span className="extra-ref-title">"Git & GitHub Tutorial for Beginners" — The Coder Coder</span>
                      <span className="extra-ref-meta">Quick Intro</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
              <h3 style={{ fontSize: '0.9rem', color: 'white', fontWeight: 800 }}>Syllabus Material Unavailable</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                {!activeCourseProgress.startDate 
                  ? "Configure your active course and start date on the Course Catalog to unlock curriculum tracking." 
                  : "Selected date is outside the active course duration timeline."}
              </p>
            </div>
          )}

          {/* Daily Checklist (Styled with premium check-card rules from index.css) */}
          <div className="card" style={{ padding: '22px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '0.925rem', fontWeight: 800 }}>📋 Daily Checklist</h3>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '20px' }}>
                <button className="btn-secondary" onClick={() => changeSelectedDay(-1)} style={{ border: 'none', background: 'transparent', padding: '2px 8px', fontSize: '0.65rem' }}>◀ Prev</button>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'var(--accent-grad)', padding: '2px 10px', borderRadius: '20px', color: 'white' }}>{selectedDate}</span>
                <button className="btn-secondary" onClick={() => changeSelectedDay(1)} style={{ border: 'none', background: 'transparent', padding: '2px 8px', fontSize: '0.65rem' }}>Next ▶</button>
              </div>
            </div>

            <div className="journal-check-grid">
              
              <div onClick={() => toggleChecklist('learned')} className={`journal-check-card ${localLog.learned ? 'checked' : ''}`}>
                <div className="journal-check-card-info">
                  <div className="journal-check-card-indicator"></div>
                  <span className="journal-check-card-title">Studied roadmap core deliverables for 1+ hours</span>
                </div>
                <span className="journal-check-card-xp">+10 XP</span>
              </div>

              <div onClick={() => toggleChecklist('coded')} className={`journal-check-card ${localLog.coded ? 'checked' : ''}`}>
                <div className="journal-check-card-info">
                  <div className="journal-check-card-indicator"></div>
                  <span className="journal-check-card-title">Wrote code for at least 2 hours</span>
                </div>
                <span className="journal-check-card-xp">+15 XP</span>
              </div>

              <div onClick={() => toggleChecklist('dsa')} className={`journal-check-card ${localLog.dsa ? 'checked' : ''}`}>
                <div className="journal-check-card-info">
                  <div className="journal-check-card-indicator"></div>
                  <span className="journal-check-card-title">Solved LeetCode / DSA problem</span>
                </div>
                <span className="journal-check-card-xp">+20 XP</span>
              </div>

              <div onClick={() => toggleChecklist('commit')} className={`journal-check-card ${localLog.commit ? 'checked' : ''}`}>
                <div className="journal-check-card-info">
                  <div className="journal-check-card-indicator"></div>
                  <span className="journal-check-card-title">Made a Git commit (NON-NEGOTIABLE)</span>
                </div>
                <span className="journal-check-card-xp">+10 XP</span>
              </div>

              <div onClick={() => toggleChecklist('review')} className={`journal-check-card ${localLog.review ? 'checked' : ''}`}>
                <div className="journal-check-card-info">
                  <div className="journal-check-card-indicator"></div>
                  <span className="journal-check-card-title">Completed end-of-day review</span>
                </div>
                <span className="journal-check-card-xp">+10 XP</span>
              </div>

            </div>
          </div>

          {/* Notes Area Editor */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Journal Notes</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => insertMarkdownHelper('**', '**')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>B</button>
                <button onClick={() => insertMarkdownHelper('*', '*')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>I</button>
                <button onClick={() => insertMarkdownHelper('`', '`')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Code</button>
                <button onClick={() => insertMarkdownHelper('```\n', '\n```')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Block</button>
              </div>
            </div>

            <textarea 
              id="log-notes-input"
              rows="6"
              value={localLog.notes}
              onChange={handleNotesChange}
              placeholder="Log what you learned today, resources referred, blocker items resolved..."
              style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '12px', fontSize: '0.8rem', outline: 'none', marginBottom: '16px' }}
            />

            {/* Complete & Submit Day Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleSubmitDay}
                className="btn-primary" 
                style={{ 
                  padding: '12px 30px', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  border: 'none'
                }}
              >
                <span>💾</span> Submit & Complete Day
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Pomodoro Focus Timer (Bound to context) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '22px', textAlign: 'center', position: 'relative' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '14px' }}>⏱️ Focus Session Countdown</h3>
            
            {/* Presets Row */}
            <div className="timer-presets" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={() => changeTimerDuration(25, 'Focus')} className={timerLabel === 'Focus' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Focus (25m)</button>
              <button onClick={() => changeTimerDuration(50, 'Learn')} className={timerLabel === 'Learn' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Learn (50m)</button>
              <button onClick={() => changeTimerDuration(5, 'Rest')} className={timerLabel === 'Rest' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Short (5m)</button>
              <button onClick={() => changeTimerDuration(15, 'Break')} className={timerLabel === 'Break' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Long (15m)</button>
            </div>

            {/* Circular SVG clock */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '170px', marginBottom: '20px' }}>
              <svg width="170" height="170" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                <circle 
                  cx="90" cy="90" r="80" fill="none" 
                  stroke="url(#timer-gradient)" strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>
                  {timerMinutes.toString().padStart(2, '0')}:{timerSeconds.toString().padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {timerLabel}
                </span>
              </div>
            </div>

            {/* Controls Button trigger */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px' }}>
              {isTimerRunning ? (
                <button onClick={pauseTimer} className="btn-danger" style={{ padding: '8px 24px', fontSize: '0.78rem' }}>Pause</button>
              ) : (
                <button onClick={startTimer} className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.78rem' }}>Start Focus</button>
              )}
              <button onClick={resetTimer} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.78rem' }}>Reset</button>
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Completed sessions log focus hours to your database log: <strong style={{ color: 'var(--success)' }}>{localLog.focusMinutes} minutes today</strong>.
            </div>
          </div>

          {/* Synth ambient audio (Bound to context) */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '8px' }}>🔊 Ambient Soundscapes</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Select synthesized noise frequencies to isolate your study space.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Audio Frequency:</span>
                <select 
                  value={ambientSound} 
                  onChange={(e) => setAmbientSound(e.target.value)}
                  className="form-select-sm"
                  style={{ width: '130px' }}
                >
                  <option value="none">None (Silence)</option>
                  <option value="white">White Noise 🎚️</option>
                  <option value="rain">Deep Rain 🌧️</option>
                  <option value="synth">Ambient Drone 🪐</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Volume Level:</span>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.1" 
                  step="0.01"
                  value={timerVolume}
                  onChange={(e) => setTimerVolume(parseFloat(e.target.value))}
                  style={{ width: '130px', accentColor: 'var(--accent-1)' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
