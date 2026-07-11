import React, { useState, useEffect } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { getCourseCurriculum, COURSES } from '../content/courses.js';
import { triggerConfetti } from '../utils/confetti.js';

export default function TimelineView() {
  const { activeCourseId, activeCourseProgress, toggleTask, showConfirm } = useRoadmap();
  
  const curriculum = getCourseCurriculum(activeCourseId);
  const courseMeta = COURSES.find(c => c.id === activeCourseId) || COURSES[0];

  const [phaseFilter, setPhaseFilter] = useState('all');
  const [expandedPhases, setExpandedPhases] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});

  // Expose global handler for dashboard shortcuts
  useEffect(() => {
    window.appOpenPhase = (phaseIndex) => {
      // Toggle phase index expansion
      setExpandedPhases(prev => ({
        ...prev,
        [phaseIndex]: true
      }));
      setPhaseFilter(phaseIndex + 1);
    };
    return () => {
      delete window.appOpenPhase;
    };
  }, []);

  const togglePhaseExpand = (pIdx) => {
    setExpandedPhases(prev => ({
      ...prev,
      [pIdx]: !prev[pIdx]
    }));
  };

  const toggleWeekExpand = (wIdx) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [wIdx]: !prev[wIdx]
    }));
  };

  const handleTaskCheckboxClick = (taskId, wIdx) => {
    toggleTask(taskId, (completedWeekNum) => {
      // Confetti callback triggered by Context!
      triggerConfetti();
      showConfirm(
        "🎉 Week Completed!", 
        `Week ${completedWeekNum} Completed! You earned 150 XP! Head over to the Certificates tab to download your Weekly Certificate.`, 
        () => {}, 
        true
      );
    });
  };

  // Filter curriculum phases
  const filteredCurriculum = curriculum.filter(p => {
    if (phaseFilter === 'all') return true;
    return p.phase === parseInt(phaseFilter);
  });

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-header-text" style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Timeline Roadmap</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Click week cards to check off daily study lessons and coding milestones.</p>
        </div>

        {/* Phase segment buttons selector */}
        <div className="roadmap-filter">
          <button 
            onClick={() => setPhaseFilter('all')}
            className={`filter-btn ${phaseFilter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          {curriculum.map(p => (
            <button 
              key={p.phase}
              onClick={() => setPhaseFilter(p.phase)}
              className={`filter-btn ${phaseFilter === p.phase ? 'active' : ''}`}
            >
              P{p.phase}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap List Container */}
      <div className="roadmap-timeline">
        {filteredCurriculum.map((phase, pi) => {
          const pIdx = phase.phase - 1; // 0-indexed phase index
          const isPhaseOpen = !!expandedPhases[pIdx] || phaseFilter !== 'all';
          
          const pColors = [
            { fill: '#6366f1', text: '#818cf8', bg: 'rgba(99,102,241,0.06)' },
            { fill: '#8b5cf6', text: '#a78bfa', bg: 'rgba(139,92,246,0.06)' },
            { fill: '#ec4899', text: '#f472b6', bg: 'rgba(236,72,153,0.06)' },
            { fill: '#10b981', text: '#34d399', bg: 'rgba(16,185,129,0.06)' },
            { fill: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.06)' },
            { fill: '#06b6d4', text: '#22d3ee', bg: 'rgba(6,182,212,0.06)' }
          ];
          const col = pColors[pIdx % pColors.length];

          // Compute phase checklist completion count
          let totalTasks = 0;
          let doneTasks = 0;
          phase.weeks_data.forEach(week => {
            week.days.forEach(day => {
              const globalDay = (week.week - 1) * 5 + day.day;
              const lId = `p${pIdx}-w${week.week}-d${globalDay}-learn`;
              const bId = `p${pIdx}-w${week.week}-d${globalDay}-build`;
              totalTasks += 2;
              if (activeCourseProgress.tasks[lId]) doneTasks++;
              if (activeCourseProgress.tasks[bId]) doneTasks++;
            });
          });

          return (
            <div key={phase.phase} className="roadmap-phase" style={{ marginBottom: '20px', borderColor: isPhaseOpen ? col.fill : 'var(--border)' }}>
              
              {/* Header block bar */}
              <div 
                className="phase-header-bar" 
                onClick={() => togglePhaseExpand(pIdx)}
                style={{ 
                  background: isPhaseOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: isPhaseOpen ? '1px solid var(--border)' : 'none'
                }}
              >
                <div>
                  <div className="phase-header-meta" style={{ color: col.text }}>
                    Phase {phase.phase} · {phase.weeks}
                  </div>
                  <h3 className="phase-header-title">{phase.title}</h3>
                  <p className="phase-header-desc">{phase.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
                  {/* Phase checkoffs badge */}
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: col.bg, color: col.text }}>
                    {doneTasks} / {totalTasks} Done
                  </span>
                  
                  {/* Chevron Toggle Icon */}
                  <span className="phase-toggle-icon" style={{ transform: isPhaseOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Weeks timeline block */}
              {isPhaseOpen && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {phase.weeks_data.map(week => {
                    const isWeekOpen = !!expandedWeeks[week.week];
                    
                    // Compute week checklist completed count
                    let wTotal = 0;
                    let wDone = 0;
                    week.days.forEach(d => {
                      const globalDay = (week.week - 1) * 5 + d.day;
                      const lId = `p${pIdx}-w${week.week}-d${globalDay}-learn`;
                      const bId = `p${pIdx}-w${week.week}-d${globalDay}-build`;
                      wTotal += 2;
                      if (activeCourseProgress.tasks[lId]) wDone++;
                      if (activeCourseProgress.tasks[bId]) wDone++;
                    });
                    const isWeekFinished = wDone === wTotal;

                    return (
                      <div 
                        key={week.week}
                        className="card"
                        style={{ 
                          margin: 0, padding: 0, overflow: 'hidden', 
                          border: isWeekFinished ? '1.5px solid #10b981' : '1px solid var(--border)',
                          boxShadow: isWeekFinished ? '0 0 12px rgba(16,185,129,0.1)' : 'var(--shadow-sm)'
                        }}
                      >
                        
                        {/* Compact Week header strip */}
                        <div 
                          onClick={() => toggleWeekExpand(week.week)}
                          style={{ 
                            padding: '16px 20px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'space-between', cursor: 'pointer',
                            background: isWeekOpen ? 'rgba(255,255,255,0.015)' : 'transparent',
                            borderBottom: isWeekOpen ? '1px solid var(--border)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {isWeekFinished ? (
                              <span style={{ fontSize: '1.15rem' }}>✅</span>
                            ) : (
                              <span style={{ fontSize: '1.1rem', color: col.text }}>⚡</span>
                            )}
                            <div>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', margin: 0 }}>{week.title}</h4>
                              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{week.summary}</p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wDone}/{wTotal} Done</span>
                            <span style={{ fontSize: '0.65rem', transform: isWeekOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                          </div>
                        </div>

                        {/* Expandable Daily checklists slot */}
                        {isWeekOpen && (
                          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(10,15,25,0.2)' }}>
                            {week.days.map(day => {
                              const globalDay = (week.week - 1) * 5 + day.day;
                              const lId = `p${pIdx}-w${week.week}-d${globalDay}-learn`;
                              const bId = `p${pIdx}-w${week.week}-d${globalDay}-build`;

                              return (
                                <div 
                                  key={day.day} 
                                  style={{ 
                                    display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '16px', 
                                    paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' 
                                  }}
                                >
                                  {/* Day label badge */}
                                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'white' }}>Day {globalDay}</span>
                                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Week {week.week}</span>
                                  </div>

                                  {/* LEARN task card */}
                                  <div 
                                    onClick={() => handleTaskCheckboxClick(lId, week.week)}
                                    className={`day-card ${activeCourseProgress.tasks[lId] ? 'done' : ''}`}
                                    style={{ padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
                                  >
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={!!activeCourseProgress.tasks[lId]} 
                                        onChange={() => {}} // handled by click callback parent
                                        style={{ marginTop: '2px', cursor: 'pointer' }}
                                      />
                                      <div>
                                        <strong style={{ display: 'block', fontSize: '0.74rem', color: 'white', marginBottom: '2px' }}>📖 LEARN</strong>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{day.learn}</p>
                                      </div>
                                    </div>
                                    {activeCourseProgress.tasks[lId] && <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>+10 XP</span>}
                                  </div>

                                  {/* BUILD task card */}
                                  <div 
                                    onClick={() => handleTaskCheckboxClick(bId, week.week)}
                                    className={`day-card ${activeCourseProgress.tasks[bId] ? 'done' : ''}`}
                                    style={{ padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
                                  >
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={!!activeCourseProgress.tasks[bId]} 
                                        onChange={() => {}} // handled by click callback parent
                                        style={{ marginTop: '2px', cursor: 'pointer' }}
                                      />
                                      <div>
                                        <strong style={{ display: 'block', fontSize: '0.74rem', color: 'white', marginBottom: '2px' }}>🛠️ BUILD</strong>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{day.build}</p>
                                      </div>
                                    </div>
                                    {activeCourseProgress.tasks[bId] && <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>+10 XP</span>}
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
