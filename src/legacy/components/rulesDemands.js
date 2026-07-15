// ============================================================
//  src/components/rulesDemands.js — Rules & Demands Component
// ============================================================

import { RULES, SKILLS_DEMAND } from '../content/interview.js';

export function renderRulesDemands() {
  const grid = document.getElementById('rules-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // 1. Render Rules cards
  RULES.forEach(rule => {
    grid.innerHTML += `
      <div class="rule-card" style="${rule.highlight ? 'border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.03)' : ''}">
        <div class="rule-card-icon">${rule.icon}</div>
        <div class="rule-card-title">${rule.title}</div>
        <div class="rule-card-text">${rule.text}</div>
      </div>`;
  });

  // 2. Render Hiring Trends table card
  const tableCard = document.createElement('div');
  tableCard.className = 'rule-card';
  tableCard.style.gridColumn = '1 / -1';
  tableCard.innerHTML = `
    <div class="rule-card-icon">📊</div>
    <div class="rule-card-title">2026 Developer Hiring Trends — Key Skills</div>
    <table class="skills-demand-table">
      <thead>
        <tr>
          <th>Skill Area</th>
          <th>Market Demand</th>
          <th>Context Guide</th>
        </tr>
      </thead>
      <tbody>
        ${SKILLS_DEMAND.map(s => `
          <tr>
            <td><strong>${s.skill}</strong></td>
            <td><span class="demand-badge demand-${s.demand}">${
              s.demand === 'high' ? '🔴 High' :
              s.demand === 'medium' ? '🟠 Medium' :
              s.demand === 'growing' ? '🟡 Growing' : '🟢 Niche'
            }</span></td>
            <td style="color:var(--text-secondary)">${s.notes}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  grid.appendChild(tableCard);

  // 3. Render Interview Mindset Shift card
  const mindsetCard = document.createElement('div');
  mindsetCard.className = 'rule-card';
  mindsetCard.style.gridColumn = '1 / -1';
  mindsetCard.innerHTML = `
    <div class="rule-card-icon">🎯</div>
    <div class="rule-card-title">The Interview Mindset Shift (Practical Example)</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:16px">
        <div style="color:var(--danger);font-size:0.7rem;font-weight:700;letter-spacing:0.08em;margin-bottom:8px">❌ AVOID THE BASIC STATEMENT</div>
        <p style="font-size:0.82rem;color:var(--text-secondary);font-style:italic">"I built a todo list using React and Express."</p>
      </div>
      <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:10px;padding:16px">
        <div style="color:var(--completed);font-size:0.7rem;font-weight:700;letter-spacing:0.08em;margin-bottom:8px">✅ DISCUSS ARCHITECTURE PROBLEMS</div>
        <p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.5">"I built DevBoard, a real-time collaborative kanban app. To handle concurrent task updates, I designed a Socket.io message relay with a Redis pub/sub backplane. I opted for PostgreSQL over Document DBs because transactional locks were critical for task ownership assignments."</p>
      </div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(99,102,241,0.04);border-radius:10px;border-left:3px solid var(--accent-2);">
      <p style="font-size:0.8rem;color:var(--text-secondary);font-style:italic">Describe projects through engineering decision-making logs. This demonstrates true system maturity.</p>
    </div>`;
  grid.appendChild(mindsetCard);
}
