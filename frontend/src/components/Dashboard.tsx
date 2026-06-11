import React, { useState, useEffect } from 'react';
import { ROADMAP, PHASE_COLORS, QUOTES } from '../data';

interface DashboardProps {
  startDate: string | null;
  setStartDate: (date: string) => void;
  tasks: Record<string, boolean>;
  dailyLogs: Record<string, { commit?: boolean; review?: boolean }>;
  onToggleCommitDay: (dateStr: string) => void;
  dsaProblems: any[];
  onOpenPhase: (phaseIdx: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  startDate,
  setStartDate,
  tasks,
  dailyLogs,
  onToggleCommitDay,
  dsaProblems,
  onOpenPhase,
}) => {
  const [dateInput, setDateInput] = useState(startDate || '2026-06-09');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayNumber = () => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return diff + 1; // day 1 on start date
  };

  // Compute Streak
  const computeStreak = () => {
    let streak = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (true) {
      const k = d.toISOString().split('T')[0];
      const log = dailyLogs[k];
      if (log && log.commit) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = computeStreak();

  // Task calculations
  const isTaskDone = (id: string) => !!tasks[id];

  const countTasks = () => {
    let total = 0;
    let done = 0;
    ROADMAP.forEach((phase, pi) => {
      phase.weeks_data.forEach((week, wi) => {
        week.days.forEach((_, di) => {
          ['learn', 'build'].forEach((slot) => {
            total++;
            const taskId = `p${pi}-w${wi}-d${di}-${slot}`;
            if (isTaskDone(taskId)) done++;
          });
        });
      });
    });
    return { total, done };
  };

  const phaseProgress = (phaseIdx: number) => {
    let total = 0;
    let done = 0;
    const phase = ROADMAP[phaseIdx];
    phase.weeks_data.forEach((week, wi) => {
      week.days.forEach((_, di) => {
        ['learn', 'build'].forEach((slot) => {
          total++;
          const taskId = `p${phaseIdx}-w${wi}-d${di}-${slot}`;
          if (isTaskDone(taskId)) done++;
        });
      });
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const { total: totalTasks, done: doneTasks } = countTasks();
  const overallPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // DSA calculations
  const getDsaCounts = () => {
    const counts: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 };
    dsaProblems.forEach((p) => {
      const ph = parseInt(p.phase);
      if (counts[ph] !== undefined) counts[ph]++;
    });
    return counts;
  };

  const dsaCounts = getDsaCounts();
  const totalDsa = Object.values(dsaCounts).reduce((a, b) => a + b, 0);
  const dsaPct = Math.round((totalDsa / 230) * 100);

  // SVG Ring values
  const circumference = 314;
  const offset = circumference - (Math.min(100, dsaPct) / 100) * circumference;

  // GitHub Streak grid cells (180 days)
  const renderCommitGrid = () => {
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 180; i++) {
      const d = new Date();
      if (startDate) {
        const start = new Date(startDate);
        d.setTime(start.getTime() + i * 86400000);
      } else {
        d.setTime(today.getTime() + (i - 179) * 86400000);
      }
      d.setHours(0, 0, 0, 0);
      const k = d.toISOString().split('T')[0];
      const log = dailyLogs[k];
      const isFuture = d > today;

      let cls = 'commit-0';
      if (isFuture) cls = 'commit-future';
      else if (log && log.commit && log.review) cls = 'commit-2';
      else if (log && log.commit) cls = 'commit-1';

      cells.push(
        <div
          key={i}
          className={`commit-cell ${cls}`}
          title={`Day ${i + 1} — ${k}${log ? (log.commit ? ' ✅ Committed' : '') : ''}`}
          onClick={() => {
            if (!isFuture) {
              onToggleCommitDay(k);
            }
          }}
        />
      );
    }
    return cells;
  };

  const dayNum = getDayNumber();

  return (
    <div className="view active" id="view-dashboard">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Your Learning Dashboard</h1>
          <p>180 days. 1,440 hours. One goal: get hired.</p>
        </div>
        <div className="current-date">{formatDate(new Date())}</div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card" id="stat-day">
          <div className="stat-icon">📆</div>
          <div className="stat-value">
            {dayNum !== null && dayNum > 0 && dayNum <= 180 ? dayNum : dayNum !== null && dayNum > 180 ? '✅' : '—'}
          </div>
          <div className="stat-label">Day of Journey</div>
          <div className="stat-sub">
            {dayNum !== null && dayNum > 0 && dayNum <= 180
              ? `of 180 · ${startDate}`
              : dayNum !== null && dayNum > 180
              ? 'Journey complete!'
              : 'Set your start date'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{doneTasks}</div>
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-sub">of {totalTasks} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧩</div>
          <div className="stat-value">{totalDsa}</div>
          <div className="stat-label">DSA Problems</div>
          <div className="stat-sub">Target: 230</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-sub">{streak > 0 ? `${streak} days in a row! 🔥` : 'Start your streak!'}</div>
        </div>
      </div>

      {/* Start Date Banner */}
      {!startDate && (
        <div className="start-banner">
          <div className="start-banner-icon">🚀</div>
          <div className="start-banner-text">
            <strong>When did you start?</strong>
            <p>Set your journey start date to track your progress accurately.</p>
          </div>
          <div className="start-banner-action">
            <input
              type="date"
              className="date-input"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <button className="btn-primary" onClick={() => setStartDate(dateInput)}>
              Set Start Date
            </button>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="progress-section">
        <div className="section-header">
          <h2>Overall Progress</h2>
          <span className="section-badge">{overallPct}%</span>
        </div>
        <div className="master-progress-bar">
          <div className="master-progress-fill" style={{ width: `${overallPct}%` }}></div>
          <div className="master-progress-glow" style={{ width: `${overallPct}%` }}></div>
        </div>
        <div className="phase-progress-row">
          {ROADMAP.map((_, pi) => {
            const pp = phaseProgress(pi);
            const c = PHASE_COLORS[pi + 1];
            return (
              <div key={pi} className="phase-mini-bar">
                <div className="phase-mini-label">
                  <span>P{pi + 1}</span>
                  <span style={{ color: c.text }}>{pp.pct}%</span>
                </div>
                <div className="phase-mini-track">
                  <div
                    className="phase-mini-fill"
                    style={{ width: `${pp.pct}%`, background: c.accent }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="section-header">
        <h2>Phase Overview</h2>
      </div>
      <div className="phase-cards-grid">
        {ROADMAP.map((phase, pi) => {
          const pp = phaseProgress(pi);
          const c = PHASE_COLORS[pi + 1];
          return (
            <div key={pi} className="phase-card" onClick={() => onOpenPhase(pi)}>
              <div
                className="phase-card-accent"
                style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.text})` }}
              ></div>
              <div className="phase-card-top">
                <span className="phase-card-name" style={{ background: c.bg, color: c.text }}>
                  Phase {pi + 1}
                </span>
                <span className="phase-card-weeks">{phase.weeks.split('·')[0].trim()}</span>
              </div>
              <div className="phase-card-title">{phase.title}</div>
              <div className="phase-card-desc">{phase.subtitle}</div>
              <div className="phase-card-progress-bar">
                <div
                  className="phase-card-progress-fill"
                  style={{ width: `${pp.pct}%`, background: c.accent }}
                ></div>
              </div>
              <div className="phase-card-footer">
                <span className="phase-card-pct" style={{ color: c.text }}>
                  {pp.pct}%
                </span>
                <span className="phase-card-tasks">
                  {pp.done}/{pp.total} tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DSA & Commits Dual Grid */}
      <div className="dual-grid">
        {/* DSA Ring */}
        <div className="card">
          <div className="card-header">
            <h3>DSA Progress</h3>
            <span className="badge-green">{totalDsa} / 230</span>
          </div>
          <div className="dsa-mini-chart">
            <div className="dsa-ring-container">
              <svg className="dsa-ring" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="50" className="ring-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="ring-fill"
                  id="dsa-ring-fill"
                  strokeDasharray="314"
                  strokeDashoffset={offset}
                  stroke="url(#ring-gradient)"
                />
              </svg>
              <div className="dsa-ring-text">
                <span>{dsaPct}%</span>
                <small>of 230</small>
              </div>
            </div>
            <div className="dsa-phase-breakdown">
              <div className="dsa-phase-item">
                <span className="dph-dot" style={{ background: '#6366f1' }}></span>
                <span>Phase 2</span>
                <span className="dph-val">{dsaCounts[2]}/60</span>
              </div>
              <div className="dsa-phase-item">
                <span className="dph-dot" style={{ background: '#8b5cf6' }}></span>
                <span>Phase 3</span>
                <span className="dph-val">{dsaCounts[3]}/80</span>
              </div>
              <div className="dsa-phase-item">
                <span className="dph-dot" style={{ background: '#a855f7' }}></span>
                <span>Phase 4</span>
                <span className="dph-val">{dsaCounts[4]}/60</span>
              </div>
              <div className="dsa-phase-item">
                <span className="dph-dot" style={{ background: '#c084fc' }}></span>
                <span>Phase 5+</span>
                <span className="dph-val">{dsaCounts[5]}/30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commit Streak */}
        <div className="card">
          <div className="card-header">
            <h3>GitHub Commit Streak</h3>
            <span className="badge-orange">🔥 {streak} days</span>
          </div>
          <div className="commit-grid">{renderCommitGrid()}</div>
          <div className="commit-legend">
            <span className="commit-cell commit-0"></span> No commit
            <span className="commit-cell commit-1" style={{ marginLeft: '12px' }}></span> Committed
            <span className="commit-cell commit-2" style={{ marginLeft: '8px' }}></span> +Review done
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="quote-card">
        <div className="quote-icon">💬</div>
        <blockquote>{quote ? `"${quote}"` : 'Loading quote...'}</blockquote>
        <cite>— Your 180-Day Plan</cite>
      </div>
    </div>
  );
};
