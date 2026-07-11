import React from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { getCourseCurriculum, COURSES } from '../content/courses.js';
import { QUOTES } from '../content/quotes.js';
import { PROJECTS } from '../content/projects.js';

export default function DashboardView({ navigateToView }) {
  const { activeCourseId, activeCourseProgress, state } = useRoadmap();
  
  const courseMeta = COURSES.find(c => c.id === activeCourseId) || COURSES[0];
  const curriculum = getCourseCurriculum(activeCourseId);

  // Math helpers
  const getDayNumber = () => {
    if (!activeCourseProgress.startDate) return null;
    const start = new Date(activeCourseProgress.startDate);
    const now = new Date();
    start.setHours(0,0,0,0); now.setHours(0,0,0,0);
    const diff = Math.floor((now - start) / 86400000);
    const day = diff + 1;
    if (isNaN(day)) return 1;
    return Math.max(1, day);
  };

  const dayNum = getDayNumber();

  // Tasks statistics
  const countTasks = () => {
    let total = 0;
    let done = 0;

    curriculum.forEach((phase, pIdx) => {
      phase.weeks_data.forEach(week => {
        week.days.forEach(day => {
          const globalDay = (week.week - 1) * 5 + day.day;
          const lId = `p${pIdx}-w${week.week}-d${globalDay}-learn`;
          const bId = `p${pIdx}-w${week.week}-d${globalDay}-build`;
          
          total += 2;
          if (activeCourseProgress.tasks[lId]) done++;
          if (activeCourseProgress.tasks[bId]) done++;
        });
      });
    });

    return { total, done };
  };

  const { total: totalTasks, done: doneTasks } = countTasks();
  const progressPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Projects stats
  const getProjectsStats = () => {
    let completedProjects = 0;
    PROJECTS.forEach(p => {
      const milestones = p.milestones || [];
      const doneMilestones = milestones.filter((_, i) => !!activeCourseProgress.milestones[`${p.id}-${i}`]).length;
      if (doneMilestones === milestones.length && milestones.length > 0) completedProjects++;
    });
    return { done: completedProjects, total: PROJECTS.length };
  };

  const projStats = getProjectsStats();

  // Focus studied hours
  const getFocusHours = () => {
    let mins = 0;
    Object.values(activeCourseProgress.dailyLogs).forEach(log => {
      mins += log.focusMinutes || 0;
    });
    return Math.round(mins / 60);
  };

  const focusHours = getFocusHours();

  // Commits count
  const getCommitsCount = () => {
    let count = 0;
    Object.values(activeCourseProgress.dailyLogs).forEach(log => {
      if (log.commit) count++;
    });
    return count;
  };

  const commitsCount = getCommitsCount();

  // Streak calculations
  const calculateStreak = () => {
    let streak = 0;
    let d = new Date(); d.setHours(0,0,0,0);
    const todayKey = d.toISOString().split('T')[0];
    
    if (!activeCourseProgress.dailyLogs[todayKey] || !activeCourseProgress.dailyLogs[todayKey].commit) {
      d.setDate(d.getDate() - 1);
    }
    
    while (true) {
      const k = d.toISOString().split('T')[0];
      const log = activeCourseProgress.dailyLogs[k];
      if (log && log.commit) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else { break; }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Phase Progress breakdowns
  const getPhaseProgress = (phaseIndex) => {
    const phase = curriculum[phaseIndex];
    if (!phase) return { done: 0, total: 0, pct: 0 };
    let done = 0;
    let total = 0;

    phase.weeks_data.forEach(week => {
      week.days.forEach(day => {
        const globalDay = (week.week - 1) * 5 + day.day;
        const lId = `p${phaseIndex}-w${week.week}-d${globalDay}-learn`;
        const bId = `p${phaseIndex}-w${week.week}-d${globalDay}-build`;
        total += 2;
        if (activeCourseProgress.tasks[lId]) done++;
        if (activeCourseProgress.tasks[bId]) done++;
      });
    });

    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  // Get active quote of the day
  const quote = QUOTES[dayNum % QUOTES.length] || QUOTES[0];

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* ─── Top Welcome & Progress Hero Card ─── */}
      <div className="hero-panel" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="hero-card-left" style={{ padding: '24px' }}>
          <div>
            <h1 className="hero-welcome">
              Classroom: <span>{courseMeta.title}</span>
            </h1>
            <p className="hero-quote" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{quote}"</p>
          </div>
          
          <div className="hero-details" style={{ marginTop: '24px', display: 'flex', gap: '24px' }}>
            <div className="hero-detail-item">
              <span className="hero-detail-label">Current Progress</span>
              <span className="hero-detail-val" style={{ color: courseMeta.color }}>Day {dayNum || 1} of 180</span>
            </div>
            <div className="hero-detail-item">
              <span className="hero-detail-label">Active Streak</span>
              <span className="hero-detail-val" style={{ color: '#f59e0b' }}>🔥 {streak} days</span>
            </div>
            <div className="hero-detail-item">
              <span className="hero-detail-label">Completed</span>
              <span className="hero-detail-val">{doneTasks} / {totalTasks} tasks</span>
            </div>
          </div>
        </div>

        {/* Progress Ring Card */}
        <div className="hero-card-right" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px' }}>Journey Progress</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', maxWidth: '160px', lineHeight: '1.4' }}>
              Tracks overall completion of course checklist deliverables.
            </p>
          </div>

          <div className="hero-progress-ring-container" style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke={courseMeta.color} strokeWidth="6"
                strokeDasharray="251" 
                strokeDashoffset={251 - (progressPct / 100) * 251}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className="hero-ring-text" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{progressPct}%</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Single-Row Statistics Grid ─── */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{dayNum || '—'}</div>
          <div className="stat-label">Day of Journey</div>
          <div className="stat-sub">of 180 Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{doneTasks}</div>
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-sub">of {totalTasks} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{projStats.done} / {projStats.total}</div>
          <div className="stat-label">Projects Finished</div>
          <div className="stat-sub">Milestones Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{focusHours}h</div>
          <div className="stat-label">Hours Studied</div>
          <div className="stat-sub">From Focus Timer</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-value">{commitsCount}</div>
          <div className="stat-label">Git Commits</div>
          <div className="stat-sub">🔥 {streak} days</div>
        </div>
      </div>

      {/* ─── Overall Phase Progress Widget ─── */}
      <div className="progress-section" style={{ padding: '24px', marginBottom: '32px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Overall Progress Across Curriculum Phases</h2>
          <span className="section-badge" style={{ background: 'var(--accent-grad)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
            {progressPct}% Completed
          </span>
        </div>
        
        <div className="master-progress-bar" style={{ height: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '100px', marginBottom: '20px', overflow: 'hidden' }}>
          <div className="master-progress-fill" style={{ width: `${progressPct}%`, height: '100%', background: 'var(--accent-grad)', transition: 'width 0.8s ease' }}></div>
        </div>

        <div className="phase-progress-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {curriculum.slice(0, 6).map((phase, pi) => {
            const pp = getPhaseProgress(pi);
            const pColors = [
              { fill: '#6366f1', text: '#818cf8' },
              { fill: '#8b5cf6', text: '#a78bfa' },
              { fill: '#ec4899', text: '#f472b6' },
              { fill: '#10b981', text: '#34d399' },
              { fill: '#f59e0b', text: '#fbbf24' },
              { fill: '#06b6d4', text: '#22d3ee' }
            ];
            const col = pColors[pi % pColors.length];

            return (
              <div key={phase.phase} className="phase-mini-bar" style={{ flex: 1, minWidth: '120px' }}>
                <div className="phase-mini-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span>P{phase.phase}</span>
                  <span style={{ color: col.text }}>{pp.pct}%</span>
                </div>
                <div className="phase-mini-track" style={{ height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div className="phase-mini-fill" style={{ width: `${pp.pct}%`, height: '100%', background: col.fill, transition: 'width 0.8s ease' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Contribution Graph and Charts Row ─── */}
      <div className="dual-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', marginBottom: '24px' }}>
        
        {/* Course details distribution chart (Donut SVG) */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800 }}>📊 Syllabus Allocation</h3>
            <span className="badge-green" style={{ fontSize: '0.65rem' }}>Core Areas</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '140px' }}>
            <svg width="110" height="110" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              {/* React (35%) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6366f1" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="0" />
              {/* Logic (25%) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-35" />
              {/* Relational DB (25%) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" />
              {/* DevOps (15%) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-85" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></span> Frontend (35%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> System Core (25%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span> Relational DB (25%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Cloud/CI/CD (15%)</div>
            </div>
          </div>
        </div>

        {/* Study commits heatmap grid calendar */}
        <div className="card" style={{ padding: '22px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800 }}>📅 Activity Heatmap Calendar</h3>
            <span className="badge-orange" style={{ fontSize: '0.65rem' }}>180 Days</span>
          </div>

          {/* Render 180 grid blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: '3px', marginBottom: '12px' }}>
            {Array.from({ length: 180 }).map((_, i) => {
              const d = new Date();
              if (activeCourseProgress.startDate) {
                const start = new Date(activeCourseProgress.startDate);
                d.setTime(start.getTime() + i * 86400000);
              } else {
                d.setTime(new Date().getTime() + (i - 179) * 86400000);
              }
              const key = d.toISOString().split('T')[0];
              const log = activeCourseProgress.dailyLogs[key];
              
              let cellClass = 'commit-0';
              if (log?.commit) {
                cellClass = log.coded ? 'commit-2' : 'commit-1';
              }

              return (
                <div 
                  key={i} 
                  className={`commit-cell ${cellClass}`}
                  title={`${key}: ${log?.commit ? 'Commit Logged' : 'No activity'}`}
                  style={{ width: '100%', aspectRatio: '1', borderRadius: '2px' }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="commit-cell commit-0" style={{ width: '10px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span> Idle
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="commit-cell commit-1" style={{ width: '10px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span> Commit
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="commit-cell commit-2" style={{ width: '10px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span> Coding + Review
            </span>
          </div>
        </div>
      </div>

      {/* ─── Bottom Phases Overview Catalog grid ─── */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Phase Curriculum Breakdown</h2>
      </div>

      <div className="phase-cards-grid">
        {curriculum.map((phase, pi) => {
          const pp = getPhaseProgress(pi);
          const pColors = [
            { fill: '#6366f1', text: '#818cf8', bg: 'rgba(99,102,241,0.06)' },
            { fill: '#8b5cf6', text: '#a78bfa', bg: 'rgba(139,92,246,0.06)' },
            { fill: '#ec4899', text: '#f472b6', bg: 'rgba(236,72,153,0.06)' },
            { fill: '#10b981', text: '#34d399', bg: 'rgba(16,185,129,0.06)' },
            { fill: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.06)' },
            { fill: '#06b6d4', text: '#22d3ee', bg: 'rgba(6,182,212,0.06)' }
          ];
          const col = pColors[pi % pColors.length];

          return (
            <div 
              key={phase.phase} 
              className="phase-card"
              onClick={() => {
                navigateToView('roadmap');
                // Allow timelines context to render active phase
                setTimeout(() => {
                  if (window.appOpenPhase) window.appOpenPhase(pi);
                }, 100);
              }}
            >
              <div className="phase-card-accent" style={{ background: col.fill }} />
              
              <div className="phase-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="phase-card-name" style={{ background: col.bg, color: col.text, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, borderRadius: '20px' }}>
                  Phase {phase.phase}
                </span>
                <span className="phase-card-weeks" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {phase.weeks.split('·')[0].trim()}
                </span>
              </div>

              <div className="phase-card-title" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                {phase.title}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px', minHeight: '36px' }}>
                {phase.subtitle}
              </p>

              {/* Progress bar */}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${pp.pct}%`, height: '100%', background: col.fill }}></div>
              </div>

              <div className="phase-card-footer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span className="phase-card-pct" style={{ fontWeight: 800, color: col.text }}>{pp.pct}% Done</span>
                <span className="phase-card-tasks" style={{ color: 'var(--text-muted)' }}>{pp.done}/{pp.total} Tasks</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
