import React from 'react';
import { RULES, SKILLS_DEMAND } from '../data';

export const Rules: React.FC = () => {
  return (
    <div className="view active" id="view-rules">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Rules & Hiring Insights</h1>
          <p>The mindset that separates the hired from the hopeful.</p>
        </div>
      </div>

      <div className="rules-grid">
        {RULES.map((rule, index) => (
          <div
            key={index}
            className="rule-card"
            style={
              rule.highlight
                ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }
                : {}
            }
          >
            <div className="rule-card-icon">{rule.icon}</div>
            <div className="rule-card-title">{rule.title}</div>
            <div className="rule-card-text">{rule.text}</div>
          </div>
        ))}

        {/* 2026 Hiring Trends Table */}
        <div className="rule-card col-full" style={{ gridColumn: '1 / -1' }}>
          <div className="rule-card-icon">📊</div>
          <div className="rule-card-title">2026 Hiring Trends — What Actually Gets Freshers Hired</div>
          <table className="skills-demand-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Demand</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS_DEMAND.map((s, index) => (
                <tr key={index}>
                  <td>
                    <strong>{s.skill}</strong>
                  </td>
                  <td>
                    <span
                      className={`demand-badge ${
                        s.demand === 'high'
                          ? 'demand-high'
                          : s.demand === 'medium'
                          ? 'demand-medium'
                          : s.demand === 'growing'
                          ? 'demand-growing'
                          : 'demand-niche'
                      }`}
                    >
                      {s.demand === 'high'
                        ? 'High 🔴'
                        : s.demand === 'medium'
                        ? 'Medium 🟠'
                        : s.demand === 'growing'
                        ? 'Growing 🟡'
                        : 'Niche 🟢'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mindset Card */}
        <div className="rule-card" style={{ gridColumn: '1 / -1' }}>
          <div className="rule-card-icon">🎯</div>
          <div className="rule-card-title">What to Say in Interviews (The Mindset Shift)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  color: 'var(--red)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                ❌ DON'T SAY
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "I built a project using React and Node.js."
              </p>
            </div>
            <div
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  color: 'var(--green)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                ✅ SAY THIS
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                "I built DevBoard — a real-time Kanban tool. The interesting engineering challenge was
                handling concurrent drag-and-drop updates using Socket.io with a Redis pub/sub layer. I
                chose PostgreSQL over MongoDB because the relational data model fit naturally into
                joins, and I needed ACID guarantees for task assignments."
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(99,102,241,0.08)',
              borderRadius: '10px',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              That is the difference between a callback and an offer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
