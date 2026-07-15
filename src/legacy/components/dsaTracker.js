// ============================================================
//  src/components/dsaTracker.js — DSA Tracker Component
// ============================================================

import { state, saveState, updateXPSystem } from '../services/state.js';

export function renderDsaTracker() {
  const counts = { 2: 0, 3: 0, 4: 0, 5: 0 };
  state.dsaProblems.forEach(p => {
    const ph = parseInt(p.phase);
    if (counts[ph] !== undefined) counts[ph]++;
  });

  const phaseColors = { 2: '#8b5cf6', 3: '#06b6d4', 4: '#10b981', 5: '#f97316' };
  const phaseLabels = { 2: 'Phase 2: Core DSA', 3: 'Phase 3: Advanced DSA', 4: 'Phase 4: Optimization', 5: 'Phase 5: High Scale' };
  const phaseTargets = { 2: 60, 3: 80, 4: 60, 5: 30 };

  const container = document.getElementById('dsa-phases-grid');
  if (container) {
    container.innerHTML = '';
    [2,3,4,5].forEach(ph => {
      const done = counts[ph];
      const target = phaseTargets[ph];
      const pct = Math.min(100, Math.round(done/target*100));
      container.innerHTML += `
        <div class="dsa-phase-card" style="background:var(--bg-card); border:1px solid var(--border); padding:16px; border-radius:var(--radius-sm);">
          <div style="font-size:0.75rem; font-weight:700; color:${phaseColors[ph]}; margin-bottom:4px;">${phaseLabels[ph]}</div>
          <div style="font-size:1.35rem; font-weight:800; color:white; margin:6px 0 2px;">
            ${done} <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:500;">/ ${target}</span>
          </div>
          <div style="height:4px; background:rgba(255,255,255,0.03); border-radius:100px; overflow:hidden; margin-top:8px;">
            <div style="width:${pct}%; height:100%; background:${phaseColors[ph]};"></div>
          </div>
        </div>`;
    });
  }

  renderProblemList();
}

export function renderProblemList() {
  const filterPhase = document.getElementById('dsa-filter-phase')?.value || 'all';
  const filterDiff  = document.getElementById('dsa-filter-diff')?.value  || 'all';

  let problems = [...state.dsaProblems];
  if (filterPhase !== 'all') problems = problems.filter(p => p.phase == filterPhase);
  if (filterDiff  !== 'all') problems = problems.filter(p => p.difficulty === filterDiff);

  const list = document.getElementById('problem-list');
  if (!list) return;
  if (problems.length === 0) {
    list.innerHTML = `<div style="font-size:0.8rem; color:var(--text-secondary); text-align:center; padding:20px;">No problems match your filters.</div>`;
    return;
  }

  list.innerHTML = problems.map((p, i) => `
    <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:8px; padding:10px 16px;">
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted);">#${i+1}</span>
        <span style="font-size:0.82rem; font-weight:700; color:white;">${p.name}</span>
        <span style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:${p.difficulty==='easy'?'var(--success)':p.difficulty==='medium'?'var(--warning)':'var(--danger)'}">${p.difficulty}</span>
        <span style="font-size:0.65rem; color:var(--text-muted); background:rgba(255,255,255,0.03); padding:1px 6px; border-radius:10px;">Phase ${p.phase}</span>
        <span style="font-size:0.65rem; color:var(--text-muted);">${p.topic}</span>
      </div>
      <button class="btn-danger" data-id="${p.id}" style="padding: 2px 8px; font-size:0.7rem; border-radius:4px;">✕</button>
    </div>`).join('');

  // Bind dynamic delete buttons
  list.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteProblem(btn.dataset.id);
    });
  });
}

export function addProblem() {
  const name = document.getElementById('problem-name').value.trim();
  if (!name) { document.getElementById('problem-name').focus(); return; }
  const difficulty = document.getElementById('problem-difficulty').value;
  const phase      = document.getElementById('problem-phase').value;
  const topic      = document.getElementById('problem-topic').value;

  state.dsaProblems.push({ id: Date.now().toString(), name, difficulty, phase, topic, date: new Date().toISOString().split('T')[0] });
  saveState();
  
  document.getElementById('problem-name').value = '';
  document.getElementById('problem-topic').value = '';
  
  renderDsaTracker();
  updateXPSystem();
  if (window.appRenderDashboard) window.appRenderDashboard();
}

export function deleteProblem(id) {
  state.dsaProblems = state.dsaProblems.filter(p => p.id !== id);
  saveState();
  renderDsaTracker();
  updateXPSystem();
  if (window.appRenderDashboard) window.appRenderDashboard();
}
