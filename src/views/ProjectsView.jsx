import React from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { PROJECTS } from '../content/projects.js';

export default function ProjectsView() {
  const { activeCourseProgress, toggleMilestone } = useRoadmap();
  
  const milestones = activeCourseProgress.milestones || {};

  const getProjectProgress = (proj) => {
    const list = proj.milestones || [];
    if (list.length === 0) return { done: 0, total: 0, pct: 0 };
    let done = 0;
    list.forEach((_, i) => {
      if (milestones[`${proj.id}-${i}`]) done++;
    });
    const pct = Math.round((done / list.length) * 100);
    return { done, total: list.length, pct };
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Projects Panel</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Complete Capstone milestone checkoffs to verify software engineering competence.</p>
        </div>
      </div>

      {/* Grid of Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {PROJECTS.map(proj => {
          const stats = getProjectProgress(proj);
          const isCompleted = stats.pct === 100 && stats.total > 0;

          return (
            <div 
              key={proj.id} 
              className="card"
              style={{ 
                margin: 0, padding: '24px', display: 'flex', flexDirection: 'column',
                border: isCompleted ? '1.5px solid #10b981' : '1px solid var(--border)',
                boxShadow: isCompleted ? '0 0 12px rgba(16,185,129,0.08)' : 'var(--shadow-sm)'
              }}
            >
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{proj.emoji || '🚀'}</span>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'white', margin: 0 }}>{proj.title}</h3>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{proj.weeks}</span>
                  </div>
                </div>
                {isCompleted && (
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>
                    Finished
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px', minHeight: '34px' }}>
                {proj.description}
              </p>

              {/* Stack tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {proj.tags && proj.tags.map(tag => (
                  <span key={tag} className="tech-tag" style={{ fontSize: '0.62rem' }}>{tag}</span>
                ))}
              </div>

              {/* Progress track bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Milestones Completed</span>
                  <span style={{ color: 'white' }}>{stats.pct}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${stats.pct}%`, height: '100%', background: isCompleted ? '#10b981' : 'var(--accent-grad)' }}></div>
                </div>
              </div>

              {/* Milestones list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Milestones</span>
                
                {proj.milestones && proj.milestones.map((ms, index) => {
                  const key = `${proj.id}-${index}`;
                  const isChecked = !!milestones[key];

                  return (
                    <div 
                      key={index}
                      onClick={() => toggleMilestone(proj.id, index)}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '10px 12px', borderRadius: '6px', cursor: 'pointer',
                        background: isChecked ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.01)',
                        border: isChecked ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} // handled by click container
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: isChecked ? 'var(--text-muted)' : 'white', textDecoration: isChecked ? 'line-through' : 'none', lineHeight: '1.4' }}>
                          {ms}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.62rem', color: isChecked ? 'var(--text-muted)' : 'var(--success)', fontWeight: 800, marginLeft: '8px' }}>
                        +15 XP
                      </span>
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
}
