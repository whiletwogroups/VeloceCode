// ============================================================
//  src/components/dashboard.js — Dashboard View Component
// ============================================================

import { 
  state, saveState, getDayNumber, computeStreak, countTasks, 
  phaseProgress, dsaCounts, updateXPSystem, ROADMAP 
} from '../services/state.js';
import { PHASE_COLORS } from '../content/phaseColors.js';
import { QUOTES } from '../content/quotes.js';
import { PROJECTS } from '../content/projects.js';

export function renderDashboard() {
  renderCountdown();

  const banner = document.getElementById('start-banner');
  if (state.startDate) {
    banner?.classList.add('hidden');
  } else {
    banner?.classList.remove('hidden');
  }

  const dayNum = getDayNumber();
  const statDayEl = document.getElementById('stat-day-val');
  const statDaySubEl = document.getElementById('stat-day-sub');
  if (dayNum !== null && dayNum > 0 && dayNum <= 180) {
    statDayEl.textContent = dayNum;
    statDaySubEl.textContent = `of 180 · ${state.startDate}`;
  } else if (dayNum !== null && dayNum > 180) {
    statDayEl.textContent = '✅';
    statDaySubEl.textContent = 'Journey complete!';
  } else {
    statDayEl.textContent = '—';
    statDaySubEl.textContent = 'Set your start date';
  }

  const { total, done } = countTasks();
  const tasksDoneEl = document.getElementById('stat-tasks-done');
  if (tasksDoneEl) tasksDoneEl.textContent = done;
  
  const tasksTotalEl = document.getElementById('stat-tasks-total');
  if (tasksTotalEl) tasksTotalEl.textContent = `of ${total} total`;

  let completedProjects = 0;
  PROJECTS.forEach(p => {
    const doneMilestones = p.milestones.filter((_, i) => !!state.milestones[`${p.id}-${i}`]).length;
    if (doneMilestones === p.milestones.length) completedProjects++;
  });
  const projectsDoneEl = document.getElementById('stat-projects-done');
  if (projectsDoneEl) projectsDoneEl.textContent = `${completedProjects} / 3`;

  let totalMins = 0;
  for (const k in state.dailyLogs) {
    totalMins += state.dailyLogs[k].focusMinutes || 0;
  }
  const hoursStudiedEl = document.getElementById('stat-hours-studied');
  if (hoursStudiedEl) hoursStudiedEl.textContent = `${Math.round(totalMins / 60)}h`;

  let totalCommits = 0;
  for (const k in state.dailyLogs) {
    if (state.dailyLogs[k].commit) totalCommits++;
  }
  const commitsEl = document.getElementById('stat-git-commits');
  if (commitsEl) commitsEl.textContent = totalCommits;

  const counts = dsaCounts();
  const total_dsa = Object.values(counts).reduce((a,b)=>a+b,0);
  const dsaDoneEl = document.getElementById('stat-dsa-done');
  if (dsaDoneEl) dsaDoneEl.textContent = total_dsa;

  const streak = computeStreak();
  const streakEl = document.getElementById('stat-streak');
  if (streakEl) streakEl.textContent = streak;
  
  const sidebarStreakEl = document.getElementById('sidebar-streak-count');
  if (sidebarStreakEl) sidebarStreakEl.textContent = streak;
  
  const mobileStreakEl = document.getElementById('mobile-streak-count');
  if (mobileStreakEl) mobileStreakEl.textContent = streak;

  // Render commit streak badge in quick stats
  const commitStreakEl = document.getElementById('commit-streak-badge');
  if (commitStreakEl) {
    commitStreakEl.textContent = `🔥 ${streak} days`;
  }

  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('overall-pct').textContent = `${pct}% Complete`;
  document.getElementById('master-progress-fill').style.width = `${pct}%`;
  document.getElementById('master-progress-glow').style.width = `${pct}%`;

  const phaseRow = document.querySelector('.phase-progress-row');
  if (phaseRow) {
    phaseRow.innerHTML = '';
    ROADMAP.forEach((phase, pi) => {
      const pp = phaseProgress(pi);
      const c = PHASE_COLORS[pi+1];
      phaseRow.innerHTML += `
        <div class="phase-mini-bar">
          <div class="phase-mini-label">
            <span>P${pi+1}</span><span style="color:${c.text}">${pp.pct}%</span>
          </div>
          <div class="phase-mini-track">
            <div class="phase-mini-fill" style="width:${pp.pct}%;background:${c.accent}"></div>
          </div>
        </div>`;
    });
  }

  const grid = document.getElementById('phase-cards-grid');
  if (grid) {
    grid.innerHTML = '';
    ROADMAP.forEach((phase, pi) => {
      const pp = phaseProgress(pi);
      const c = PHASE_COLORS[pi+1];
      
      const card = document.createElement('div');
      card.className = 'phase-card';
      card.innerHTML = `
        <div class="phase-card-accent" style="background:linear-gradient(90deg,${c.accent},${c.text})"></div>
        <div class="phase-card-top">
          <span class="phase-card-name" style="background:${c.bg};color:${c.text}">Phase ${pi+1}</span>
          <span class="phase-card-weeks">${phase.weeks.split('·')[0].trim()}</span>
        </div>
        <div class="phase-card-title">${phase.title}</div>
        <div class="phase-card-desc">${phase.subtitle}</div>
        <div class="phase-card-progress-bar">
          <div class="phase-card-progress-fill" style="width:${pp.pct}%;background:${c.accent}"></div>
        </div>
        <div class="phase-card-footer">
          <span class="phase-card-pct" style="color:${c.text}">${pp.pct}%</span>
          <span class="phase-card-tasks">${pp.done}/${pp.total} tasks</span>
        </div>`;
        
      card.addEventListener('click', () => {
        // Switch view will trigger timeline component expansion
        window.appSwitchView('roadmap');
        setTimeout(() => {
          if (window.appOpenPhase) window.appOpenPhase(pi);
        }, 120);
      });
      grid.appendChild(card);
    });
  }

  const dsa_total = Object.values(counts).reduce((a,b)=>a+b,0);
  const dsa_pct = Math.round(dsa_total/230*100);
  const ringEl = document.getElementById('dsa-ring-fill');
  if (ringEl) {
    const circumference = 314;
    const offset = circumference - (dsa_pct/100)*circumference;
    ringEl.style.strokeDashoffset = offset;
    ringEl.setAttribute('stroke', '#06b6d4');
  }
  const dsaPctText = document.getElementById('dsa-pct-text');
  const dsaPctVal = document.getElementById('dsa-pct-value');
  if (dsaPctText) dsaPctText.textContent = `${dsa_pct}%`;
  if (dsaPctVal) dsaPctVal.textContent = `${dsa_pct}%`;
  
  const dp2 = document.getElementById('dph-p2');
  const dp3 = document.getElementById('dph-p3');
  const dp4 = document.getElementById('dph-p4');
  const dp5 = document.getElementById('dph-p5');
  if (dp2) dp2.textContent = `${counts[2]}/60`;
  if (dp3) dp3.textContent = `${counts[3]}/80`;
  if (dp4) dp4.textContent = `${counts[4]}/60`;
  if (dp5) dp5.textContent = `${counts[5]}/30`;

  renderCommitGrid();
  renderWeeklyHoursChart();
  updateXPSystem();

  const q = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  const quoteEl = document.getElementById('quote-text');
  if (quoteEl) quoteEl.textContent = `"${q}"`;
}

function renderCountdown() {
  const dayNum = getDayNumber();
  const pct = dayNum ? Math.min(100, Math.round((dayNum / 180) * 100)) : 0;
  
  const ring = document.getElementById('dashboard-progress-ring-fill');
  const pctDisplay = document.getElementById('dashboard-progress-pct-val');
  if (ring && pctDisplay) {
    pctDisplay.textContent = `${pct}%`;
    const circumference = 264;
    const offset = circumference - (pct / 100) * circumference;
    ring.style.strokeDashoffset = offset;
  }

  let phaseNum = 1;
  if (dayNum > 15) phaseNum = 2;
  if (dayNum > 30) phaseNum = 3;
  if (dayNum > 70) phaseNum = 4;
  if (dayNum > 100) phaseNum = 5;
  if (dayNum > 150) phaseNum = 6;
  
  const phaseLabel = document.getElementById('hero-current-phase-label');
  if (phaseLabel) {
    phaseLabel.textContent = `Phase ${phaseNum} · Day ${dayNum || 1} of 180`;
  }
}

export function renderCommitGrid() {
  const grid = document.getElementById('commit-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const today = new Date(); today.setHours(0,0,0,0);
  
  for (let i = 0; i < 180; i++) {
    const d = new Date();
    if (state.startDate) {
      const start = new Date(state.startDate);
      d.setTime(start.getTime() + i*86400000);
    } else {
      d.setTime(today.getTime() + (i-179)*86400000);
    }
    d.setHours(0,0,0,0);
    const k = d.toISOString().split('T')[0];
    const log = state.dailyLogs[k];
    const isFuture = d > today;
    let cls = 'commit-0';
    if (isFuture) cls = 'commit-future';
    else if (log && log.commit && log.review) cls = 'commit-2';
    else if (log && log.commit) cls = 'commit-1';

    const cell = document.createElement('div');
    cell.className = `commit-cell ${cls}`;
    cell.title = `Day ${i+1} — ${k}${log ? (log.commit ? ' (Committed)' : '') : ''}`;
    cell.dataset.date = k;
    cell.addEventListener('click', () => {
      state.dailyLogs[k] = state.dailyLogs[k] || {};
      state.dailyLogs[k].commit = !state.dailyLogs[k].commit;
      saveState();
      renderCommitGrid();
      
      const streak = computeStreak();
      document.getElementById('stat-streak').textContent = streak;
      document.getElementById('sidebar-streak-count').textContent = streak;
      document.getElementById('mobile-streak-count').textContent = streak;
      
      updateXPSystem();
    });
    grid.appendChild(cell);
  }
}

export function renderWeeklyHoursChart() {
  const svg = document.getElementById('weekly-hours-svg');
  if (!svg) return;
  
  const linesAndText = Array.from(svg.querySelectorAll('rect, text'));
  linesAndText.forEach(el => el.remove());
  
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }
  
  const data = last7Days.map(date => {
    const log = state.dailyLogs[date];
    const mins = log ? (log.focusMinutes || 0) : 0;
    return { date, hours: mins / 60 };
  });
  
  const width = 320;
  const height = 140;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  
  const maxHours = Math.max(8, ...data.map(d => d.hours));
  
  const numDays = data.length;
  const barWidth = 18;
  const spacing = (graphWidth - (numDays * barWidth)) / (numDays - 1);
  
  data.forEach((d, idx) => {
    const x = paddingLeft + idx * (barWidth + spacing);
    const barHeight = (d.hours / maxHours) * graphHeight;
    const y = height - paddingBottom - barHeight;
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', Math.max(2, barHeight));
    rect.setAttribute('class', 'chart-bar');
    rect.innerHTML = `<title>${d.hours.toFixed(1)} hrs on ${d.date}</title>`;
    svg.appendChild(rect);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const dObj = new Date(d.date);
    const label = dObj.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3);
    text.setAttribute('x', x + barWidth / 2);
    text.setAttribute('y', height - 12);
    text.setAttribute('class', 'chart-label');
    text.textContent = label;
    svg.appendChild(text);
  });
  
  for (let i = 0; i <= 4; i++) {
    const val = (maxHours / 4) * i;
    const y = height - paddingBottom - (val / maxHours) * graphHeight;
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 24);
    yLabel.setAttribute('y', y + 3);
    yLabel.setAttribute('class', 'chart-label');
    yLabel.style.textAnchor = 'end';
    yLabel.textContent = `${Math.round(val)}h`;
    svg.appendChild(yLabel);
  }
}
