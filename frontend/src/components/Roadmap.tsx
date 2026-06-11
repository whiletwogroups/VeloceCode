import React, { useState, useEffect, useRef } from 'react';
import { ROADMAP, PHASE_COLORS } from '../data';

interface RoadmapProps {
  tasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  openPhaseIndex: number | null;
  setOpenPhaseIndex: (idx: number | null) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  tasks,
  onToggleTask,
  openPhaseIndex,
  setOpenPhaseIndex,
}) => {
  const [filterPhase, setFilterPhase] = useState('all');
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  
  const phaseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-expand and scroll to phase if triggered from Dashboard
  useEffect(() => {
    if (openPhaseIndex !== null) {
      setExpandedPhases((prev) => ({ ...prev, [openPhaseIndex]: true }));
      // Wait for DOM to update then scroll
      setTimeout(() => {
        const el = phaseRefs.current[openPhaseIndex];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Reset the trigger so it doesn't run again on tab switch
        setOpenPhaseIndex(null);
      }, 150);
    }
  }, [openPhaseIndex, setOpenPhaseIndex]);

  const togglePhase = (pi: number) => {
    setExpandedPhases((prev) => ({ ...prev, [pi]: !prev[pi] }));
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekKey]: !prev[weekKey] }));
  };

  const isTaskDone = (id: string) => !!tasks[id];

  const getPhaseProgress = (phaseIdx: number) => {
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
    return total ? Math.round((done / total) * 100) : 0;
  };

  const getWeekProgress = (phaseIdx: number, weekIdx: number) => {
    let total = 0;
    let done = 0;
    const week = ROADMAP[phaseIdx].weeks_data[weekIdx];
    week.days.forEach((_, di) => {
      ['learn', 'build'].forEach((slot) => {
        total++;
        const taskId = `p${phaseIdx}-w${weekIdx}-d${di}-${slot}`;
        if (isTaskDone(taskId)) done++;
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="view active" id="view-roadmap">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Full 180-Day Roadmap</h1>
          <p>Click any week to expand tasks. Check off as you go.</p>
        </div>
        <div className="roadmap-filter">
          <button
            className={`filter-btn ${filterPhase === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPhase('all')}
          >
            All Phases
          </button>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`filter-btn ${filterPhase === String(num) ? 'active' : ''}`}
              onClick={() => setFilterPhase(String(num))}
            >
              P{num}
            </button>
          ))}
        </div>
      </div>

      <div className="roadmap-timeline">
        {ROADMAP.map((phase, pi) => {
          const phaseNum = pi + 1;
          // Filtering logic
          if (filterPhase !== 'all' && filterPhase !== String(phaseNum)) {
            return null;
          }

          const c = PHASE_COLORS[phaseNum];
          const isPhaseOpen = !!expandedPhases[pi];
          const phasePct = getPhaseProgress(pi);

          return (
            <div
              key={pi}
              className="roadmap-phase"
              ref={(el) => { phaseRefs.current[pi] = el; }}
              data-phase={phaseNum}
            >
              {/* Phase Header */}
              <div
                className={`phase-header ${isPhaseOpen ? 'expanded' : ''}`}
                onClick={() => togglePhase(pi)}
              >
                <div className="phase-header-dot" style={{ background: c.accent }}></div>
                <div className="phase-header-info">
                  <div className="phase-header-name" style={{ color: c.text }}>
                    Phase {phaseNum}
                  </div>
                  <div className="phase-header-title">{phase.title}</div>
                  <div className="phase-header-meta">
                    {phase.weeks} · {phase.subtitle}
                  </div>
                </div>
                <div className="phase-header-right">
                  <span className="phase-header-pct" style={{ color: c.text }}>
                    {phasePct}%
                  </span>
                  <span className="phase-header-chevron">▼</span>
                </div>
              </div>

              {/* Weeks Container */}
              <div className={`weeks-container ${isPhaseOpen ? 'open' : ''}`}>
                {phase.weeks_data.map((week, wi) => {
                  const weekKey = `${pi}-${wi}`;
                  const isWeekOpen = !!expandedWeeks[weekKey];
                  const weekPct = getWeekProgress(pi, wi);

                  return (
                    <div key={wi} className="week-block">
                      {/* Week Header */}
                      <div
                        className={`week-header ${isWeekOpen ? 'expanded' : ''}`}
                        onClick={() => toggleWeek(weekKey)}
                      >
                        <div className="week-header-num" style={{ background: c.bg, color: c.text }}>
                          W{wi + 1}
                        </div>
                        <div className="week-header-info">
                          <div className="week-header-title">{week.title}</div>
                          {week.goal && <div className="week-header-goal">{week.goal}</div>}
                        </div>
                        <div className="week-progress">
                          <span className="week-pct" style={{ color: c.text }}>
                            {weekPct}%
                          </span>
                          <div className="week-bar">
                            <div
                              className="week-bar-fill"
                              style={{ width: `${weekPct}%`, background: c.accent }}
                            ></div>
                          </div>
                          <span className="week-chevron">▼</span>
                        </div>
                      </div>

                      {/* Day Tasks */}
                      <div className={`day-tasks ${isWeekOpen ? 'open' : ''}`}>
                        {/* Table Header */}
                        <div className="day-row" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <div
                            className="day-label"
                            style={{
                              fontSize: '0.65rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                            }}
                          >
                            Day
                          </div>
                          <div className="day-cell">
                            <div className="day-cell-label" style={{ color: c.text }}>
                              9:30–12:30 · LEARN
                            </div>
                          </div>
                          <div className="day-cell">
                            <div className="day-cell-label" style={{ color: c.text }}>
                              13:30–17:00 · BUILD
                            </div>
                          </div>
                        </div>

                        {/* Day Rows */}
                        {week.days.map((day, di) => {
                          const learnId = `p${pi}-w${wi}-d${di}-learn`;
                          const buildId = `p${pi}-w${wi}-d${di}-build`;

                          return (
                            <div key={di} className="day-row">
                              <div className="day-label">{day.day}</div>
                              <div className="day-cell">
                                <div
                                  className="day-task-item"
                                  onClick={() => onToggleTask(learnId)}
                                >
                                  <div
                                    className={`task-checkbox ${
                                      isTaskDone(learnId) ? 'checked' : ''
                                    }`}
                                  ></div>
                                  <span className={`task-text ${isTaskDone(learnId) ? 'done' : ''}`}>
                                    {day.learn}
                                  </span>
                                </div>
                              </div>
                              <div className="day-cell">
                                <div
                                  className="day-task-item"
                                  onClick={() => onToggleTask(buildId)}
                                >
                                  <div
                                    className={`task-checkbox ${
                                      isTaskDone(buildId) ? 'checked' : ''
                                    }`}
                                  ></div>
                                  <span className={`task-text ${isTaskDone(buildId) ? 'done' : ''}`}>
                                    {day.build}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Deliverable & Note lines */}
                        {week.deliverable && (
                          <div className="deliverable-row">
                            <span className="deliverable-icon">🎯</span>
                            <span className="deliverable-text">{week.deliverable}</span>
                          </div>
                        )}
                        {week.note && (
                          <div
                            className="deliverable-row"
                            style={{
                              background: 'rgba(99,102,241,0.05)',
                              borderTopColor: 'rgba(99,102,241,0.1)',
                            }}
                          >
                            <span className="deliverable-icon">💡</span>
                            <span
                              className="deliverable-text"
                              style={{ color: 'var(--text-accent)' }}
                            >
                              {week.note}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
