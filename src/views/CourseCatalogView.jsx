import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { COURSES } from '../content/courses.js';

export default function CourseCatalogView({ navigateToView }) {
  const { activeCourseId, state, selectCourse, showConfirm, showToast } = useRoadmap();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleEnrollClick = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleConfirmEnroll = (courseId) => {
    if (!startDate) {
      showToast("⚠️ Please select a start date!", "warning");
      return;
    }

    // Enforce one active course at a time by warning before clearing previous progress
    const activeCourse = state.courses[activeCourseId];
    if (activeCourse && activeCourse.startDate && activeCourseId !== courseId) {
      showConfirm(
        "⚠️ Reset Current Progress?",
        "You are switching to a new course. You can only learn one course at a time. Starting this course will permanently clear your progress and history on the current course. Do you want to proceed?",
        () => {
          selectCourse(courseId, startDate);
          setSelectedCourseId(null);
          showToast("🎓 Enrolled in course successfully!", "success");
          navigateToView('dashboard');
        }
      );
    } else {
      selectCourse(courseId, startDate);
      setSelectedCourseId(null);
      showToast("🎓 Enrolled in course successfully!", "success");
      navigateToView('dashboard');
    }
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* View Title */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Course Catalog</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Select your active curriculum path and configure your starting date to initialize tracking.</p>
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {COURSES.map(course => {
          const courseProgress = state.courses[course.id];
          const isActive = activeCourseId === course.id && courseProgress?.startDate;
          const isEnrolling = selectedCourseId === course.id;

          return (
            <div 
              key={course.id} 
              className="card" 
              style={{ 
                margin: 0, padding: '24px', position: 'relative', overflow: 'hidden',
                borderColor: isActive ? course.color : 'var(--border)',
                boxShadow: isActive ? `0 0 15px ${course.color}22` : 'var(--shadow-sm)'
              }}
            >
              {/* Top Accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: course.color }} />

              {/* Title & Emoji Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{course.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{course.title}</h3>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{course.duration} · {course.phasesCount} Phases</span>
                  </div>
                </div>
                
                {/* Active Indicator Badge */}
                {isActive && (
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>

              {/* Course Description */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '18px', minHeight: '42px' }}>
                {course.description}
              </p>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {course.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="tech-tag" style={{ fontSize: '0.65rem' }}>{tag}</span>
                ))}
                {course.tags.length > 4 && (
                  <span className="tech-tag" style={{ fontSize: '0.65rem', background: 'transparent', opacity: 0.7 }}>+{course.tags.length - 4} more</span>
                )}
              </div>

              {/* Dynamic enrollment selector overlays */}
              {isEnrolling ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Starting Date:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-input" 
                      style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem' }} 
                    />
                    <button 
                      onClick={() => handleConfirmEnroll(course.id)}
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => setSelectedCourseId(null)}
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Difficulty: <strong style={{ color: 'var(--text-secondary)' }}>{course.level}</strong></span>
                  
                  {isActive ? (
                    <button 
                      onClick={() => navigateToView('dashboard')}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.75rem', border: '1px solid #10b981', color: '#10b981' }}
                    >
                      Enter Classroom
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnrollClick(course.id)}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.75rem', background: course.color, border: 'none' }}
                    >
                      {courseProgress?.startDate ? 'Switch Course' : 'Enroll & Start'}
                    </button>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
