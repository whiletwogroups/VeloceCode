// ============================================================
//  app.js — DevRoadmap Application Logic
// ============================================================

// ─── State ───────────────────────────────────────────────────
let state = {
  startDate: null,
  tasks: {},        // { taskId: true/false }
  dailyLogs: {},    // { 'YYYY-MM-DD': { learned, coded, dsa, commit, review, notes } }
  dsaProblems: [],  // [{ id, name, difficulty, phase, topic, date }]
  milestones: {},   // { 'projectId-milestoneIndex': true }
};

// ─── Persistence ─────────────────────────────────────────────
function saveState() {
  localStorage.setItem('devRoadmap_state', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('devRoadmap_state');
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    } catch(e) { console.warn('Failed to parse saved state'); }
  }
  // Day 1 = June 9, 2026. Reset if old date or not set.
  if (!state.startDate || state.startDate === '2026-06-08') {
    state.startDate = '2026-06-09';
    saveState();
  }
}

// ─── Task ID helpers ─────────────────────────────────────────
function taskId(phaseIdx, weekIdx, dayIdx, slot) {
  return `p${phaseIdx}-w${weekIdx}-d${dayIdx}-${slot}`;
}

function isTaskDone(id) { return !!state.tasks[id]; }

function toggleTask(id) {
  state.tasks[id] = !state.tasks[id];
  saveState();
  updateProgress();
}

// ─── Date helpers ─────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function getDayNumber() {
  if (!state.startDate) return null;
  const start = new Date(state.startDate);
  const now = new Date();
  start.setHours(0,0,0,0); now.setHours(0,0,0,0);
  const diff = Math.floor((now - start) / 86400000);
  return diff + 1; // day 1 on start date
}

// ─── Streak ───────────────────────────────────────────────────
function computeStreak() {
  const logs = state.dailyLogs;
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  while (true) {
    const k = d.toISOString().split('T')[0];
    const log = logs[k];
    if (log && log.commit) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else { break; }
  }
  return streak;
}

// ─── Progress ─────────────────────────────────────────────────
function countTasks() {
  let total = 0, done = 0;
  ROADMAP.forEach((phase, pi) => {
    phase.weeks_data.forEach((week, wi) => {
      week.days.forEach((day, di) => {
        ['learn','build'].forEach(slot => {
          total++;
          if (isTaskDone(taskId(pi, wi, di, slot))) done++;
        });
      });
    });
  });
  return { total, done };
}

function phaseProgress(phaseIdx) {
  let total = 0, done = 0;
  const phase = ROADMAP[phaseIdx];
  phase.weeks_data.forEach((week, wi) => {
    week.days.forEach((day, di) => {
      ['learn','build'].forEach(slot => {
        total++;
        if (isTaskDone(taskId(phaseIdx, wi, di, slot))) done++;
      });
    });
  });
  return { total, done, pct: total ? Math.round(done/total*100) : 0 };
}

function weekProgress(phaseIdx, weekIdx) {
  let total = 0, done = 0;
  const week = ROADMAP[phaseIdx].weeks_data[weekIdx];
  week.days.forEach((day, di) => {
    ['learn','build'].forEach(slot => {
      total++;
      if (isTaskDone(taskId(phaseIdx, weekIdx, di, slot))) done++;
    });
  });
  return { total, done, pct: total ? Math.round(done/total*100) : 0 };
}

function dsaCounts() {
  const counts = {2:0, 3:0, 4:0, 5:0};
  state.dsaProblems.forEach(p => {
    const ph = parseInt(p.phase);
    if (counts[ph] !== undefined) counts[ph]++;
  });
  return counts;
}

// ─── Navigation ───────────────────────────────────────────────
let currentView = 'dashboard';

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const viewEl = document.getElementById(`view-${view}`);
  const navEl  = document.getElementById(`nav-${view}`);
  if (viewEl) viewEl.classList.add('active');
  if (navEl)  navEl.classList.add('active');

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  if (view === 'dashboard') renderDashboard();
  if (view === 'roadmap')   renderRoadmap();
  if (view === 'daily')     renderDailyTracker();
  if (view === 'dsa')       renderDSA();
  if (view === 'projects')  renderProjects();
  if (view === 'rules')     renderRules();
}

// ─── Dashboard ────────────────────────────────────────────────
function renderDashboard() {
  // Date
  document.getElementById('current-date').textContent = formatDate(new Date());

  // Start date banner
  const banner = document.getElementById('start-banner');
  if (state.startDate) {
    banner.classList.add('hidden');
  } else {
    banner.classList.remove('hidden');
  }

  // Day number
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

  // Task progress
  const { total, done } = countTasks();
  document.getElementById('stat-tasks-done').textContent = done;
  document.getElementById('stat-tasks-total').textContent = `of ${total} total`;

  // DSA count
  const counts = dsaCounts();
  const total_dsa = Object.values(counts).reduce((a,b)=>a+b,0);
  document.getElementById('stat-dsa-done').textContent = total_dsa;

  // Streak
  const streak = computeStreak();
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-streak-sub').textContent = streak > 0 ? `${streak} days in a row! 🔥` : 'Start your streak!';
  document.getElementById('sidebar-streak-count').textContent = streak;
  document.getElementById('mobile-streak-count').textContent = streak;

  // Overall progress
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('overall-pct').textContent = `${pct}%`;
  document.getElementById('master-progress-fill').style.width = `${pct}%`;
  document.getElementById('master-progress-glow').style.width = `${pct}%`;

  // Phase mini bars
  const phaseRow = document.querySelector('.phase-progress-row');
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

  // Phase cards
  const grid = document.getElementById('phase-cards-grid');
  grid.innerHTML = '';
  ROADMAP.forEach((phase, pi) => {
    const pp = phaseProgress(pi);
    const c = PHASE_COLORS[pi+1];
    grid.innerHTML += `
      <div class="phase-card" onclick="switchView('roadmap'); setTimeout(()=>openPhase(${pi}), 100)">
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
        </div>
      </div>`;
  });

  // DSA ring
  const dsa_total = Object.values(counts).reduce((a,b)=>a+b,0);
  const dsa_pct = Math.round(dsa_total/230*100);
  const circumference = 314;
  const offset = circumference - (dsa_pct/100)*circumference;
  const ringEl = document.getElementById('dsa-ring-fill');
  ringEl.style.strokeDashoffset = offset;
  ringEl.setAttribute('stroke', PHASE_COLORS[1].accent);
  document.getElementById('dsa-pct-text').textContent = `${dsa_pct}%`;
  document.getElementById('dsa-total-badge').textContent = `${dsa_total} / 230`;
  document.getElementById('dph-p2').textContent = `${counts[2]}/60`;
  document.getElementById('dph-p3').textContent = `${counts[3]}/80`;
  document.getElementById('dph-p4').textContent = `${counts[4]}/60`;
  document.getElementById('dph-p5').textContent = `${counts[5]}/30`;

  // Commit grid
  renderCommitGrid();

  // Quote
  const q = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  document.getElementById('quote-text').textContent = `"${q}"`;
}

function renderCommitGrid() {
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
    cell.title = `Day ${i+1} — ${k}${log ? (log.commit ? ' ✅ Committed' : '') : ''}`;
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
    });
    grid.appendChild(cell);
  }
  // Update streak badge
  const streak = computeStreak();
  const badgeEl = document.getElementById('commit-streak-badge');
  if (badgeEl) badgeEl.textContent = `🔥 ${streak} days`;
}

function updateProgress() {
  if (currentView === 'dashboard') {
    const { total, done } = countTasks();
    document.getElementById('stat-tasks-done').textContent = done;
    const pct = total ? Math.round(done/total*100) : 0;
    document.getElementById('overall-pct').textContent = `${pct}%`;
    document.getElementById('master-progress-fill').style.width = `${pct}%`;
    document.getElementById('master-progress-glow').style.width = `${pct}%`;
  }
}

// ─── Roadmap ──────────────────────────────────────────────────
let openPhaseIdx = null;

function renderRoadmap() {
  const timeline = document.getElementById('roadmap-timeline');
  timeline.innerHTML = '';

  ROADMAP.forEach((phase, pi) => {
    const c = PHASE_COLORS[pi+1];
    const pp = phaseProgress(pi);

    const phaseEl = document.createElement('div');
    phaseEl.className = 'roadmap-phase';
    phaseEl.dataset.phase = pi+1;

    const headerEl = document.createElement('div');
    headerEl.className = 'phase-header';
    headerEl.innerHTML = `
      <div class="phase-header-dot" style="background:${c.accent}"></div>
      <div class="phase-header-info">
        <div class="phase-header-name" style="color:${c.text}">Phase ${pi+1}</div>
        <div class="phase-header-title">${phase.title}</div>
        <div class="phase-header-meta">${phase.weeks} · ${phase.subtitle}</div>
      </div>
      <div class="phase-header-right">
        <span class="phase-header-pct" style="color:${c.text}">${pp.pct}%</span>
        <span class="phase-header-chevron">▼</span>
      </div>`;

    const weeksEl = document.createElement('div');
    weeksEl.className = 'weeks-container';

    phase.weeks_data.forEach((week, wi) => {
      const wp = weekProgress(pi, wi);
      const weekBlock = document.createElement('div');
      weekBlock.className = 'week-block';

      const weekHeader = document.createElement('div');
      weekHeader.className = 'week-header';
      weekHeader.innerHTML = `
        <div class="week-header-num" style="background:${c.bg};color:${c.text}">W${wi+1}</div>
        <div class="week-header-info">
          <div class="week-header-title">${week.title}</div>
          ${week.goal ? `<div class="week-header-goal">${week.goal}</div>` : ''}
        </div>
        <div class="week-progress">
          <span class="week-pct" style="color:${c.text}">${wp.pct}%</span>
          <div class="week-bar"><div class="week-bar-fill" style="width:${wp.pct}%;background:${c.accent}"></div></div>
          <span class="week-chevron">▼</span>
        </div>`;

      const dayTasks = document.createElement('div');
      dayTasks.className = 'day-tasks';

      // Table header
      const headerRow = document.createElement('div');
      headerRow.className = 'day-row';
      headerRow.style.background = 'rgba(255,255,255,0.02)';
      headerRow.innerHTML = `
        <div class="day-label" style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.08em">Day</div>
        <div class="day-cell"><div class="day-cell-label" style="color:${c.text}">9:30–12:30 · LEARN</div></div>
        <div class="day-cell"><div class="day-cell-label" style="color:${c.text}">13:30–17:00 · BUILD</div></div>`;
      dayTasks.appendChild(headerRow);

      week.days.forEach((day, di) => {
        const row = document.createElement('div');
        row.className = 'day-row';

        const learnId = taskId(pi, wi, di, 'learn');
        const buildId = taskId(pi, wi, di, 'build');

        row.innerHTML = `
          <div class="day-label">${day.day}</div>
          <div class="day-cell">
            <div class="day-task-item" data-id="${learnId}">
              <div class="task-checkbox ${isTaskDone(learnId)?'checked':''}"></div>
              <span class="task-text ${isTaskDone(learnId)?'done':''}">${day.learn}</span>
            </div>
          </div>
          <div class="day-cell">
            <div class="day-task-item" data-id="${buildId}">
              <div class="task-checkbox ${isTaskDone(buildId)?'checked':''}"></div>
              <span class="task-text ${isTaskDone(buildId)?'done':''}">${day.build}</span>
            </div>
          </div>`;
        dayTasks.appendChild(row);
      });

      if (week.deliverable) {
        const delRow = document.createElement('div');
        delRow.className = 'deliverable-row';
        delRow.innerHTML = `<span class="deliverable-icon">🎯</span><span class="deliverable-text">${week.deliverable}</span>`;
        dayTasks.appendChild(delRow);
      }
      if (week.note) {
        const noteRow = document.createElement('div');
        noteRow.className = 'deliverable-row';
        noteRow.style.background = 'rgba(99,102,241,0.05)';
        noteRow.style.borderTopColor = 'rgba(99,102,241,0.1)';
        noteRow.innerHTML = `<span class="deliverable-icon">💡</span><span class="deliverable-text" style="color:var(--text-accent)">${week.note}</span>`;
        dayTasks.appendChild(noteRow);
      }

      // Toggle week
      weekHeader.addEventListener('click', () => {
        dayTasks.classList.toggle('open');
        weekHeader.classList.toggle('expanded');
        // Update week bar
        const wp2 = weekProgress(pi, wi);
        weekHeader.querySelector('.week-pct').textContent = `${wp2.pct}%`;
        weekHeader.querySelector('.week-bar-fill').style.width = `${wp2.pct}%`;
      });

      // Task toggle
      dayTasks.querySelectorAll && setTimeout(() => {
        dayTasks.querySelectorAll('.day-task-item').forEach(item => {
          item.addEventListener('click', () => {
            const id = item.dataset.id;
            toggleTask(id);
            const cb = item.querySelector('.task-checkbox');
            const txt = item.querySelector('.task-text');
            cb.classList.toggle('checked', isTaskDone(id));
            txt.classList.toggle('done', isTaskDone(id));
            // Update week bar
            const wp3 = weekProgress(pi, wi);
            weekHeader.querySelector('.week-pct').textContent = `${wp3.pct}%`;
            weekHeader.querySelector('.week-bar-fill').style.width = `${wp3.pct}%`;
            // Update phase pct
            const pp3 = phaseProgress(pi);
            headerEl.querySelector('.phase-header-pct').textContent = `${pp3.pct}%`;
          });
        });
      }, 0);

      weekBlock.appendChild(weekHeader);
      weekBlock.appendChild(dayTasks);
      weeksEl.appendChild(weekBlock);
    });

    headerEl.addEventListener('click', () => {
      weeksEl.classList.toggle('open');
      headerEl.classList.toggle('expanded');
    });

    phaseEl.appendChild(headerEl);
    phaseEl.appendChild(weeksEl);
    timeline.appendChild(phaseEl);
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const ph = btn.dataset.phase;
      document.querySelectorAll('.roadmap-phase').forEach(el => {
        if (ph === 'all' || el.dataset.phase === ph) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
    });
  });
}

function openPhase(pi) {
  const phases = document.querySelectorAll('.roadmap-phase');
  if (phases[pi]) {
    const header = phases[pi].querySelector('.phase-header');
    const weeks = phases[pi].querySelector('.weeks-container');
    if (!weeks.classList.contains('open')) {
      weeks.classList.add('open');
      header.classList.add('expanded');
    }
    phases[pi].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── Daily Tracker ────────────────────────────────────────────
function renderDailyTracker() {
  // Today's date display
  const today = todayStr();
  document.getElementById('log-date').textContent = formatDate(new Date());

  // Day badge
  const dayNum = getDayNumber();
  document.getElementById('today-day-badge').textContent = dayNum ? `Day ${dayNum}` : 'Day —';

  // Today's tasks
  const todayCard = document.getElementById('today-task-card');
  if (!state.startDate || !dayNum || dayNum < 1 || dayNum > 180) {
    todayCard.innerHTML = `<div class="today-empty"><div style="font-size:2.5rem">📅</div><p>Set your start date on the Dashboard to see today's tasks.</p></div>`;
  } else {
    // Find which phase/week/day this is
    const weekNum = Math.ceil(dayNum / 5); // approx (Mon–Fri)
    let targetPhase = null, targetWeek = null, targetDay = null;
    let dayCount = 0;
    outer: for (let pi = 0; pi < ROADMAP.length; pi++) {
      for (let wi = 0; wi < ROADMAP[pi].weeks_data.length; wi++) {
        for (let di = 0; di < ROADMAP[pi].weeks_data[wi].days.length; di++) {
          dayCount++;
          if (dayCount === dayNum) {
            targetPhase = pi; targetWeek = wi; targetDay = di;
            break outer;
          }
        }
      }
    }
    if (targetPhase !== null) {
      const phase = ROADMAP[targetPhase];
      const week = phase.weeks_data[targetWeek];
      const day = week.days[targetDay];
      const c = PHASE_COLORS[targetPhase+1];
      todayCard.innerHTML = `
        <div style="margin-bottom:8px;font-size:0.75rem;color:var(--text-muted)">
          Phase ${targetPhase+1} · ${phase.title} · ${week.title}
        </div>
        <div class="today-task-grid">
          <div class="today-task-box">
            <div class="today-task-box-label" style="color:${c.text}">📚 9:30–12:30 LEARN</div>
            <div class="today-task-box-text">${day.learn}</div>
          </div>
          <div class="today-task-box">
            <div class="today-task-box-label" style="color:${c.text}">💻 13:30–17:00 BUILD</div>
            <div class="today-task-box-text">${day.build}</div>
          </div>
        </div>`;
    } else {
      todayCard.innerHTML = `<div class="today-empty"><div style="font-size:2.5rem">🎉</div><p>Journey complete! You've done all 180 days.</p></div>`;
    }
  }

  // Load today's log
  const log = state.dailyLogs[today] || {};
  ['learned','coded','dsa','commit','review'].forEach(key => {
    const el = document.getElementById(`log-${key}`);
    if (el) el.checked = !!log[key];
  });
  const notesEl = document.getElementById('log-notes-input');
  if (notesEl) notesEl.value = log.notes || '';
}

// ─── DSA Tracker ──────────────────────────────────────────────
function renderDSA() {
  const counts = dsaCounts();
  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  document.getElementById('dsa-total-big').textContent = total;

  // Phase cards
  const phaseTargets = { 2:60, 3:80, 4:60, 5:30 };
  const phaseLabels  = { 2:'Phase 2 (Weeks 4–6)', 3:'Phase 3 (Weeks 7–14)', 4:'Phase 4 (Weeks 15–20)', 5:'Phase 5+ (Weeks 21–36)' };
  const phaseColors  = { 2:PHASE_COLORS[2].accent, 3:PHASE_COLORS[3].accent, 4:PHASE_COLORS[4].accent, 5:PHASE_COLORS[5].accent };
  const container = document.getElementById('dsa-phase-progress');
  container.innerHTML = '';
  [2,3,4,5].forEach(ph => {
    const done = counts[ph];
    const target = phaseTargets[ph];
    const pct = Math.min(100, Math.round(done/target*100));
    container.innerHTML += `
      <div class="dsa-phase-card">
        <div class="dsa-phase-card-name" style="color:${phaseColors[ph]}">${phaseLabels[ph]}</div>
        <div class="dsa-phase-card-nums">
          <span class="dsa-phase-card-done" style="color:${phaseColors[ph]}">${done}</span>
          <span class="dsa-phase-card-total">/ ${target}</span>
        </div>
        <div class="dsa-phase-bar">
          <div class="dsa-phase-bar-fill" style="width:${pct}%;background:${phaseColors[ph]}"></div>
        </div>
      </div>`;
  });

  renderProblemList();
}

function renderProblemList() {
  const filterPhase = document.getElementById('dsa-filter-phase')?.value || 'all';
  const filterDiff  = document.getElementById('dsa-filter-diff')?.value  || 'all';

  let problems = [...state.dsaProblems];
  if (filterPhase !== 'all') problems = problems.filter(p => p.phase == filterPhase);
  if (filterDiff  !== 'all') problems = problems.filter(p => p.difficulty === filterDiff);

  const list = document.getElementById('problem-list');
  if (!list) return;
  if (problems.length === 0) {
    list.innerHTML = `<div class="empty-state"><div style="font-size:2.5rem">🧩</div><p>No problems match your filters yet.</p></div>`;
    return;
  }

  list.innerHTML = problems.map((p, i) => `
    <div class="problem-item" data-id="${p.id}">
      <span class="problem-num">#${i+1}</span>
      <span class="problem-name">${p.name}</span>
      <span class="problem-diff diff-${p.difficulty}">${p.difficulty === 'easy' ? '🟢 Easy' : p.difficulty === 'medium' ? '🟡 Med' : '🔴 Hard'}</span>
      <span class="problem-topic">${p.topic}</span>
      <span class="problem-phase">P${p.phase}</span>
      <button class="btn-danger" onclick="deleteProblem('${p.id}')">✕</button>
    </div>`).join('');
}

function addProblem() {
  const name = document.getElementById('problem-name').value.trim();
  if (!name) { document.getElementById('problem-name').focus(); return; }
  const difficulty = document.getElementById('problem-difficulty').value;
  const phase      = document.getElementById('problem-phase').value;
  const topic      = document.getElementById('problem-topic').value;

  state.dsaProblems.push({ id: Date.now().toString(), name, difficulty, phase, topic, date: todayStr() });
  saveState();
  document.getElementById('problem-name').value = '';
  renderDSA();
}

function deleteProblem(id) {
  state.dsaProblems = state.dsaProblems.filter(p => p.id !== id);
  saveState();
  renderDSA();
}

// ─── Projects ─────────────────────────────────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  PROJECTS.forEach(proj => {
    const milestonesDone = proj.milestones.filter((_, i) => !!state.milestones[`${proj.id}-${i}`]).length;
    const totalMilestones = proj.milestones.length;
    const pct = Math.round(milestonesDone/totalMilestones*100);
    const statusLabel = pct === 0 ? 'Not Started' : pct === 100 ? '✅ Complete' : `In Progress — ${pct}%`;
    const statusStyle = pct === 0
      ? 'background:rgba(255,255,255,0.06);color:var(--text-muted)'
      : pct === 100
      ? `background:rgba(16,185,129,0.15);color:var(--green);border:1px solid rgba(16,185,129,0.3)`
      : `background:rgba(${proj.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.15);color:${proj.color}`;

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-top">
        <div class="project-number" style="background:linear-gradient(135deg,${proj.color}33,${proj.color}11);color:${proj.color}">${proj.number}</div>
        <div class="project-info">
          <div class="project-phase-badge" style="background:${proj.color}22;color:${proj.color}">${proj.phase}</div>
          <div class="project-name">${proj.name}</div>
          <div class="project-tagline">${proj.tagline}</div>
        </div>
        <div class="project-status-badge" style="${statusStyle}">${statusLabel}</div>
      </div>
      <div class="project-body">
        <div class="project-weeks">⏱️ ${proj.weeks}</div>
        <div class="project-tech">
          ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-milestones">
          ${proj.milestones.map((m, i) => `
            <div class="milestone-item" data-proj="${proj.id}" data-idx="${i}">
              <div class="milestone-check ${state.milestones[`${proj.id}-${i}`]?'done':''}"></div>
              <span class="milestone-text ${state.milestones[`${proj.id}-${i}`]?'done':''}">${m}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="project-progress-footer">
        <div class="proj-progress-bar">
          <div class="proj-progress-fill" style="width:${pct}%;background:${proj.color}"></div>
        </div>
        <span class="proj-pct" style="color:${proj.color}">${pct}%</span>
      </div>`;

    // Milestone toggle
    card.querySelectorAll('.milestone-item').forEach(item => {
      item.addEventListener('click', () => {
        const pid = item.dataset.proj;
        const idx = item.dataset.idx;
        const key = `${pid}-${idx}`;
        state.milestones[key] = !state.milestones[key];
        saveState();
        renderProjects();
      });
    });

    grid.appendChild(card);
  });
}

// ─── Rules ────────────────────────────────────────────────────
function renderRules() {
  const grid = document.getElementById('rules-grid');
  grid.innerHTML = '';

  RULES.forEach(rule => {
    grid.innerHTML += `
      <div class="rule-card" style="${rule.highlight ? 'border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.05)' : ''}">
        <div class="rule-card-icon">${rule.icon}</div>
        <div class="rule-card-title">${rule.title}</div>
        <div class="rule-card-text">${rule.text}</div>
      </div>`;
  });

  // Skills demand table (full width)
  const tableCard = document.createElement('div');
  tableCard.className = 'rule-card col-full';
  tableCard.style.gridColumn = '1 / -1';
  tableCard.innerHTML = `
    <div class="rule-card-icon">📊</div>
    <div class="rule-card-title">2026 Hiring Trends — What Actually Gets Freshers Hired</div>
    <table class="skills-demand-table">
      <thead>
        <tr>
          <th>Skill</th>
          <th>Demand</th>
          <th>Notes</th>
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

  // Mindset card
  const mindsetCard = document.createElement('div');
  mindsetCard.className = 'rule-card';
  mindsetCard.style.gridColumn = '1 / -1';
  mindsetCard.innerHTML = `
    <div class="rule-card-icon">🎯</div>
    <div class="rule-card-title">What to Say in Interviews (The Mindset Shift)</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
      <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:16px">
        <div style="color:var(--red);font-size:0.72rem;font-weight:700;letter-spacing:0.08em;margin-bottom:8px">❌ DON'T SAY</div>
        <p style="font-size:0.85rem;color:var(--text-secondary);font-style:italic">"I built a project using React and Node.js."</p>
      </div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:16px">
        <div style="color:var(--green);font-size:0.72rem;font-weight:700;letter-spacing:0.08em;margin-bottom:8px">✅ SAY THIS</div>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">"I built DevBoard — a real-time Kanban tool. The interesting engineering challenge was handling concurrent drag-and-drop updates using Socket.io with a Redis pub/sub layer. I chose PostgreSQL over MongoDB because the relational data model fit naturally into joins, and I needed ACID guarantees for task assignments."</p>
      </div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(99,102,241,0.08);border-radius:10px;border-left:3px solid var(--accent)">
      <p style="font-size:0.85rem;color:var(--text-secondary);font-style:italic">That is the difference between a callback and an offer.</p>
    </div>`;
  grid.appendChild(mindsetCard);
}

// ─── Event Listeners ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchView(item.dataset.view);
    });
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Set start date
  document.getElementById('set-start-date').addEventListener('click', () => {
    const val = document.getElementById('start-date-input').value;
    if (!val) return;
    state.startDate = val;
    saveState();
    renderDashboard();
  });

  // Save daily log
  document.getElementById('save-log').addEventListener('click', () => {
    const today = todayStr();
    state.dailyLogs[today] = state.dailyLogs[today] || {};
    ['learned','coded','dsa','commit','review'].forEach(key => {
      const el = document.getElementById(`log-${key}`);
      if (el) state.dailyLogs[today][key] = el.checked;
    });
    const notes = document.getElementById('log-notes-input').value;
    state.dailyLogs[today].notes = notes;
    saveState();

    const msg = document.getElementById('log-saved-msg');
    msg.classList.add('visible');
    setTimeout(() => msg.classList.remove('visible'), 2500);

    // Refresh streak
    const streak = computeStreak();
    document.getElementById('stat-streak')?.textContent;
    document.getElementById('sidebar-streak-count').textContent = streak;
    document.getElementById('mobile-streak-count').textContent = streak;
  });

  // Add DSA problem
  document.getElementById('add-problem-btn').addEventListener('click', addProblem);
  document.getElementById('problem-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') addProblem();
  });

  // DSA filters
  document.getElementById('dsa-filter-phase').addEventListener('change', renderProblemList);
  document.getElementById('dsa-filter-diff').addEventListener('change', renderProblemList);

  // Pre-fill date input with Day 1 start date
  document.getElementById('start-date-input').value = state.startDate || '2026-06-09';

  // Initial render
  renderDashboard();

  // Render other views in background
  setTimeout(() => {
    renderRoadmap();
    renderProjects();
    renderRules();
  }, 100);
});

// Add SVG gradient for DSA ring
const svgNS = 'http://www.w3.org/2000/svg';
const defs = document.createElementNS(svgNS, 'defs');
const gradient = document.createElementNS(svgNS, 'linearGradient');
gradient.setAttribute('id', 'ring-gradient');
gradient.setAttribute('x1', '0%');
gradient.setAttribute('y1', '0%');
gradient.setAttribute('x2', '100%');
gradient.setAttribute('y2', '100%');
const stop1 = document.createElementNS(svgNS, 'stop');
stop1.setAttribute('offset', '0%');
stop1.setAttribute('stop-color', '#6366f1');
const stop2 = document.createElementNS(svgNS, 'stop');
stop2.setAttribute('offset', '100%');
stop2.setAttribute('stop-color', '#a855f7');
gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);
document.querySelector('.dsa-ring')?.prepend(defs);
