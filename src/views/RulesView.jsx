import React from 'react';

export default function RulesView() {
  const rules = [
    { title: '🔴 Daily Git Commits', desc: 'Make at least one valid git commit daily. No exceptions. This establishes real-world habits and tracks progressive checkins.', color: '#ef4444' },
    { title: '⏱️ Pomodoro Focus Blocks', desc: 'Study in isolated 25-minute focus intervals. Minimize context-switching, and log study times to your daily journal notes.', color: '#3b82f6' },
    { title: '🧩 Continuous Challenge Grind', desc: 'Solve target DSA challenges for each active development phase. Track difficulties in the problems register.', color: '#10b981' },
    { title: '📜 Constant End-of-Day Review', desc: 'Complete daily checkpoint review checklists. Reflect on blocker issues and write explanations in your notes.', color: '#f59e0b' }
  ];

  const demands = [
    { area: 'Core Coding Focus', text: 'Commit to at least 2-4 hours of coding and project setup daily. Read documentation thoroughly and test logic.' },
    { area: 'Professional Integrity', text: 'Write clean, scalable, type-safe structures. Standardize directory layouts and lint configurations.' },
    { area: 'Curriculum Deadlines', text: 'Strive to finish all weekly lesson slots in the scheduled 5-day cycle. Maintain flame streak multipliers.' }
  ];

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Rules & Professional Demands</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Review non-negotiable workspace codes of conduct and developer training expectations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
        
        {/* Rules column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Non-Negotiable Code of Conduct</h3>
          
          {rules.map((rule, idx) => (
            <div 
              key={idx} 
              className="card"
              style={{ margin: 0, padding: '20px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: rule.color }} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>{rule.title}</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{rule.desc}</p>
            </div>
          ))}
        </div>

        {/* Demands column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>Professional Study Expectations</h3>
          
          <div className="card" style={{ margin: 0, padding: '24px' }}>
            {demands.map((dm, idx) => (
              <div 
                key={idx} 
                style={{ 
                  paddingBottom: idx === demands.length - 1 ? 0 : '16px',
                  marginBottom: idx === demands.length - 1 ? 0 : '16px',
                  borderBottom: idx === demands.length - 1 ? 'none' : '1px solid var(--border)'
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--accent-2)', marginBottom: '4px' }}>{dm.area}</strong>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>{dm.text}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ margin: 0, padding: '20px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '6px' }}>⚠️ Warning</span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              Failing to check off git commits or review daily checkboxes decreases XP points and triggers warnings. Maintain steady progress.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
