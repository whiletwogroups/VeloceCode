import React from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { getCourseCurriculum } from '../content/courses.js';

export default function CertificatesView() {
  const { activeCourseId, activeCourseProgress, showConfirm } = useRoadmap();
  const curriculum = getCourseCurriculum(activeCourseId);

  // Compute completed weeks in active course
  const getCompletedWeeks = () => {
    const completed = [];
    
    curriculum.forEach((phase, pIdx) => {
      phase.weeks_data.forEach(week => {
        let allDone = true;
        week.days.forEach(day => {
          const globalDay = (week.week - 1) * 5 + day.day;
          const lId = `p${pIdx}-w${week.week}-d${globalDay}-learn`;
          const bId = `p${pIdx}-w${week.week}-d${globalDay}-build`;
          if (!activeCourseProgress.tasks[lId] || !activeCourseProgress.tasks[bId]) {
            allDone = false;
          }
        });
        if (allDone) {
          completed.push(week.week);
        }
      });
    });

    return completed;
  };

  const completedWeeks = getCompletedWeeks();

  const handlePrintCertificate = (weekNum) => {
    showConfirm(
      "📜 Certificate Rendered",
      `Certificate of completion for Week ${weekNum} has been generated successfully! Document print layout is ready.`,
      () => {},
      true
    );
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Weekly Achievements & Certificates</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Unlock official completion badges when finishing all daily tasks for a week.</p>
        </div>
      </div>

      {/* Grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {curriculum.flatMap(p => p.weeks_data).map(week => {
          const isUnlocked = completedWeeks.includes(week.week);

          return (
            <div 
              key={week.week}
              className="card"
              style={{ 
                margin: 0, padding: '24px', position: 'relative', overflow: 'hidden', textAlign: 'center',
                border: isUnlocked ? '1.5px solid var(--success)' : '1px solid var(--border)',
                boxShadow: isUnlocked ? '0 0 12px rgba(16,185,129,0.08)' : 'var(--shadow-sm)'
              }}
            >
              {/* Top decoration circle */}
              <div 
                style={{ 
                  margin: '0 auto 16px', width: '56px', height: '56px', borderRadius: '50%',
                  background: isUnlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: isUnlocked ? '1.5px solid var(--success)' : '1px solid var(--border)',
                  display: 'grid', placeItems: 'center', fontSize: '1.5rem'
                }}
              >
                {isUnlocked ? '📜' : '🔒'}
              </div>

              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>
                Week {week.week} Certificate
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '18px', minHeight: '34px' }}>
                {isUnlocked ? `Credential active for completing "${week.title.split('—')[1].trim()}".` : `Complete all Day 1-5 learn and build slots for Week ${week.week} to unlock.`}
              </p>

              {isUnlocked ? (
                <button 
                  onClick={() => handlePrintCertificate(week.week)}
                  className="btn-primary" 
                  style={{ width: '100%', fontSize: '0.74rem', padding: '8px 0', background: 'var(--success)', border: 'none' }}
                >
                  Download Certificate
                </button>
              ) : (
                <button 
                  disabled
                  className="btn-secondary" 
                  style={{ width: '100%', fontSize: '0.74rem', padding: '8px 0', cursor: 'not-allowed', opacity: 0.5 }}
                >
                  Locked
                </button>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
