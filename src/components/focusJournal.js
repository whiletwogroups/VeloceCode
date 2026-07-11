// ============================================================
//  src/components/focusJournal.js — Focus & Journal View Component
// ============================================================

import { 
  state, saveState, getDayNumber, computeStreak, updateXPSystem, 
  ROADMAP, taskId, isTaskDone, toggleTask 
} from '../services/state.js';
import { PHASE_COLORS } from '../content/phaseColors.js';
import { todayStr, formatDate, formatResourceLabel } from '../utils/date.js';
import { compileMarkdown } from '../utils/markdown.js';

export let selectedDayNumber = null;

export function getDateStringForDay(dayNum) {
  if (!state.startDate) return todayStr();
  const start = new Date(state.startDate);
  const d = new Date(start.getTime() + (dayNum - 1) * 86400000);
  return d.toISOString().split('T')[0];
}

export function changeSelectedDay(offset) {
  const actualTodayDay = getDayNumber() || 1;
  if (selectedDayNumber === null) {
    selectedDayNumber = actualTodayDay;
  }
  selectedDayNumber = Math.max(1, Math.min(180, selectedDayNumber + offset));
  renderDailyTracker();
}

export function toggleExtraReferences() {
  const content = document.getElementById('extra-references-content');
  const chevron = document.getElementById('extra-refs-chevron');
  if (content && chevron) {
    if (content.style.display === 'none') {
      content.style.display = 'flex';
      chevron.style.transform = 'rotate(180deg)';
    } else {
      content.style.display = 'none';
      chevron.style.transform = '';
    }
  }
}

export function renderDailyTracker() {
  const actualTodayDay = getDayNumber() || 1;
  if (selectedDayNumber === null) {
    selectedDayNumber = actualTodayDay;
  }
  
  const targetDateStr = getDateStringForDay(selectedDayNumber);
  const isActualToday = selectedDayNumber === actualTodayDay;
  
  const logDateEl = document.getElementById('log-date');
  if (logDateEl) {
    logDateEl.textContent = formatDate(new Date(targetDateStr)) + (isActualToday ? ' (Today)' : '');
  }

  const dayNum = selectedDayNumber;
  const daysLeft = dayNum ? Math.max(0, 180 - dayNum) : null;
  const badge = document.getElementById('today-day-badge');
  if (badge) badge.textContent = dayNum ? `Day ${dayNum}` : 'Day —';

  const leftBadge = document.getElementById('days-left-badge');
  if (leftBadge && daysLeft !== null) leftBadge.textContent = `${daysLeft} days left`;

  const todayCard = document.getElementById('today-task-card');

  if (!state.startDate || !dayNum || dayNum < 1 || dayNum > 180) {
    if (todayCard) {
      todayCard.innerHTML = `<div class="today-empty"><div style="font-size:2.5rem">📅</div><p>Configure your start date on the Dashboard first.</p></div>`;
    }
    return;
  }

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

  if (targetPhase === null) {
    if (todayCard) {
      todayCard.innerHTML = `<div class="today-empty"><div style="font-size:2.5rem">🎉</div><p>All 180 days completed! Excellent work!</p></div>`;
    }
  } else {
    const phase = ROADMAP[targetPhase];
    const week = phase.weeks_data[targetWeek];
    const day = week.days[targetDay];
    const c = PHASE_COLORS[targetPhase+1];
    const learnId = taskId(targetPhase, targetWeek, targetDay, 'learn');
    const buildId = taskId(targetPhase, targetWeek, targetDay, 'build');

    if (todayCard) {
      todayCard.innerHTML = `
        <div class="daily-meta" style="margin-bottom:14px;">
          <span class="daily-phase-badge" style="background:${c.bg};color:${c.text}">Phase ${targetPhase+1}</span>
          <span class="daily-week-label">${week.title}</span>
        </div>

        <div class="target-grid">
          <!-- LEARN Task Card -->
          <div class="target-card">
            <div class="target-card-header">
              <span class="target-card-icon" style="background:${c.bg};color:${c.text}">📚</span>
              <span class="target-card-label" style="color:${c.text}">9:30–12:30 · LEARN</span>
              <span class="daily-task-check ${isTaskDone(learnId) ? 'checked' : ''}" data-id="${learnId}" style="margin-left:auto;"></span>
            </div>
            <div class="target-card-body">${day.learn}</div>
            <div class="target-card-links">
              <div class="target-link-section">
                <span class="target-link-title">Recommended Videos</span>
                ${renderTargetLinkPills(day.learnLinks, 'video')}
              </div>
              <div class="target-link-section">
                <span class="target-link-title">Documentation & Manuals</span>
                ${renderTargetLinkPills(day.learnLinks, 'doc')}
              </div>
            </div>
          </div>

          <!-- BUILD Task Card -->
          <div class="target-card">
            <div class="target-card-header">
              <span class="target-card-icon" style="background:${c.bg};color:${c.text}">💻</span>
              <span class="target-card-label" style="color:${c.text}">13:30–17:00 · BUILD</span>
              <span class="daily-task-check ${isTaskDone(buildId) ? 'checked' : ''}" data-id="${buildId}" style="margin-left:auto;"></span>
            </div>
            <div class="target-card-body">${day.build}</div>
            <div class="target-card-links">
              <div class="target-link-section">
                <span class="target-link-title">Recommended Videos</span>
                ${renderTargetLinkPills(day.buildLinks, 'video')}
              </div>
              <div class="target-link-section">
                <span class="target-link-title">Documentation & Manuals</span>
                ${renderTargetLinkPills(day.buildLinks, 'doc')}
              </div>
            </div>
          </div>
        </div>

        ${week.deliverable ? `<div class="daily-deliverable" style="margin-top:16px;"><span>🎯 Deliverable:</span> <span>${week.deliverable}</span></div>` : ''}

        <!-- Collapsible Git, GitHub & CI/CD Core Tutorials -->
        <div style="margin-top: 20px; border: 1px dashed rgba(255, 255, 255, 0.08); background: rgba(0, 0, 0, 0.15); border-radius: 12px; padding: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;" id="extra-refs-trigger">
            <span style="font-size: 0.78rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: var(--text-secondary);">
              <span>🎬</span> Core Git, GitHub & CI/CD Reference Tutorials
            </span>
            <span id="extra-refs-chevron" style="font-size: 0.7rem; color: var(--text-muted); transition: transform var(--transition);">▼</span>
          </div>
          <div id="extra-references-content" style="display: none; margin-top: 14px; flex-direction: column; gap: 8px;">
            <a href="https://www.youtube.com/watch?v=8JJ101D3knE" target="_blank" class="extra-ref-item">
              <span class="extra-ref-num">1</span>
              <span class="extra-ref-title">"Complete Git & GitHub Tutorial: Beginner to PRO" — VarJosh</span>
              <span class="extra-ref-meta">Cloud Workflow</span>
            </a>
            <a href="https://www.youtube.com/watch?v=H5GJZTa__W4" target="_blank" class="extra-ref-item">
              <span class="extra-ref-num">2</span>
              <span class="extra-ref-title">"Git & GitHub Crash Course for Beginners" — logicBase Labs</span>
              <span class="extra-ref-meta">Conflicts & Stash</span>
            </a>
            <a href="https://www.youtube.com/watch?v=IiwGbcd8S7I" target="_blank" class="extra-ref-item">
              <span class="extra-ref-num">3</span>
              <span class="extra-ref-title">"Git and GitHub Full Course for Beginners" — Malvik Vaghadia</span>
              <span class="extra-ref-meta">Branch Policies</span>
            </a>
            <a href="https://www.youtube.com/watch?v=apGV9Ad7XY0" target="_blank" class="extra-ref-item">
              <span class="extra-ref-num">4</span>
              <span class="extra-ref-title">"Git & GitHub Tutorial for Beginners" — The Coder Coder</span>
              <span class="extra-ref-meta">Quick Intro</span>
            </a>
          </div>
        </div>
      `;

      // Bind dynamic events inside targets card
      todayCard.querySelectorAll('.daily-task-check').forEach(checkEl => {
        checkEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const tid = checkEl.dataset.id;
          toggleTask(tid, (completedWeekIndex) => {
            showSystemNotification(`🎉 Completed Week ${completedWeekIndex+1} Checklist! Got 100 XP Bonus!`);
          });
          const done = isTaskDone(tid);
          checkEl.classList.toggle('checked', done);
        });
      });

      const refsTrigger = document.getElementById('extra-refs-trigger');
      if (refsTrigger) {
        refsTrigger.addEventListener('click', toggleExtraReferences);
      }
    }
  }

  // Load selected day's log notes & checks
  const log = state.dailyLogs[targetDateStr] || {};
  ['learned','coded','dsa','commit','review'].forEach(key => {
    const el = document.getElementById(`log-${key}`);
    if (el) {
      el.checked = !!log[key];
      const card = el.closest('.journal-check-card');
      if (card) card.classList.toggle('checked', el.checked);
    }
  });
  
  const notesEl = document.getElementById('log-notes-input');
  if (notesEl) notesEl.value = log.notes || '';
  
  switchJournalTab('edit');
}

function renderTargetLinkPills(links, type) {
  if (!links || links.length === 0) {
    return `<div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No ${type === 'video' ? 'videos' : 'documentations'} recommended.</div>`;
  }
  const filtered = links.filter(l => l.type === type);
  if (filtered.length === 0) {
    return `<div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">No ${type === 'video' ? 'videos' : 'documentations'} recommended.</div>`;
  }
  return `<div class="link-pills" style="margin-top: 4px;">
    ${filtered.map(l => `
      <a href="${l.url}" target="_blank" rel="noopener" class="link-pill ${l.type}">
        ${l.type === 'video' ? '▶' : '📖'} ${formatResourceLabel(l)}
      </a>`).join('')}
  </div>`;
}

export function toggleJournalCard(key) {
  const el = document.getElementById(`log-${key}`);
  if (!el) return;
  
  el.checked = !el.checked;
  const card = el.closest('.journal-check-card');
  if (card) card.classList.toggle('checked', el.checked);
  
  saveDailyLog();
}

export function saveDailyLog() {
  const actualTodayDay = getDayNumber() || 1;
  if (selectedDayNumber === null) {
    selectedDayNumber = actualTodayDay;
  }
  const targetDateStr = getDateStringForDay(selectedDayNumber);
  
  state.dailyLogs[targetDateStr] = state.dailyLogs[targetDateStr] || {};
  ['learned','coded','dsa','commit','review'].forEach(key => {
    const el = document.getElementById(`log-${key}`);
    if (el) state.dailyLogs[targetDateStr][key] = el.checked;
  });
  const notes = document.getElementById('log-notes-input').value;
  state.dailyLogs[targetDateStr].notes = notes;
  saveState();

  const msg = document.getElementById('log-saved-msg');
  if (msg) {
    msg.style.opacity = 1;
    setTimeout(() => msg.style.opacity = 0, 2000);
  }

  const streak = computeStreak();
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('sidebar-streak-count').textContent = streak;
  document.getElementById('mobile-streak-count').textContent = streak;
  
  updateXPSystem();
  
  const dashboardGrid = document.getElementById('commit-grid');
  if (dashboardGrid && window.appRenderCommitGrid) {
    window.appRenderCommitGrid();
  }
}

export function switchJournalTab(tab) {
  const editBtn = document.getElementById('journal-tab-edit');
  const previewBtn = document.getElementById('journal-tab-preview');
  const editorPanel = document.getElementById('journal-editor-panel');
  const previewPanel = document.getElementById('journal-preview-panel');
  
  if (!editBtn || !previewBtn || !editorPanel || !previewPanel) return;

  if (tab === 'edit') {
    editBtn.classList.add('active');
    previewBtn.classList.remove('active');
    editorPanel.classList.remove('hidden');
    previewPanel.classList.add('hidden');
  } else {
    editBtn.classList.remove('active');
    previewBtn.classList.add('active');
    editorPanel.classList.add('hidden');
    previewPanel.classList.remove('hidden');
    
    const rawText = document.getElementById('log-notes-input').value;
    previewPanel.innerHTML = rawText ? compileMarkdown(rawText) : '<div style="font-size: 0.72rem; color: var(--text-muted); font-style: italic;">No notes written yet...</div>';
  }
}

export function renderFocusTimerView() {
  const today = todayStr();
  const minutes = state.dailyLogs[today]?.focusMinutes || 0;
  
  const spentText = document.getElementById('spent-time-text');
  if (spentText) {
    if (minutes >= 60) {
      const hrs = Math.floor(minutes / 60);
      const m = minutes % 60;
      spentText.textContent = `${hrs}h ${m}m`;
    } else {
      spentText.textContent = `${minutes}m`;
    }
  }

  const targetSelect = document.getElementById('timer-target-select');
  const targetVal = targetSelect ? parseInt(targetSelect.value) : 480;

  const clockHandSpent = document.getElementById('clock-hand-spent');
  const clockHandTarget = document.getElementById('clock-hand-target');

  if (clockHandSpent) {
    const angleSpent = Math.min(360, (minutes / targetVal) * 360);
    clockHandSpent.style.transform = `rotate(${angleSpent}deg)`;
  }

  if (clockHandTarget) {
    clockHandTarget.style.transform = `rotate(360deg)`;
  }
}

function showSystemNotification(text) {
  if (window.appShowSystemNotification) {
    window.appShowSystemNotification(text);
  }
}
