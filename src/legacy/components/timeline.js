// ============================================================
//  src/components/timeline.js — Timeline View Component
// ============================================================

import { 
  state, saveState, updateXPSystem, ROADMAP, taskId, 
  isTaskDone, toggleTask, weekProgress 
} from '../services/state.js';
import { PHASE_COLORS } from '../content/phaseColors.js';
import { formatResourceLabel } from '../utils/date.js';

function hexToRgb(hex) {
  if (!hex) return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function renderRoadmap() {
  const timeline = document.getElementById('roadmap-timeline');
  if (!timeline) return;
  timeline.innerHTML = '';

  ROADMAP.forEach((phase, pi) => {
    const c = PHASE_COLORS[pi+1];
    const phaseEl = document.createElement('div');
    phaseEl.className = 'roadmap-phase';
    
    // Check if phase is expanded
    const isPhaseExpanded = state.tasks[`phase-exp-${pi}`] !== false; // default true
    
    const rgb = hexToRgb(c.accent) || {r: 79, g: 70, b: 229};
    const bgGrad = `linear-gradient(90deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)`;

    phaseEl.innerHTML = `
      <div class="phase-header-bar" style="background:${bgGrad}; border-left:4px solid ${c.accent};">
        <div style="flex:1; cursor:pointer;" class="phase-header-click">
          <div class="phase-header-meta" style="color:${c.text}">PHASE 0${pi+1} · ${phase.weeks}</div>
          <h3 class="phase-header-title">${phase.title}</h3>
          <p class="phase-header-desc">${phase.desc}</p>
        </div>
        <span class="phase-toggle-icon" style="color:${c.text};font-size:0.8rem;cursor:pointer;margin-right:12px;">${isPhaseExpanded ? '▼' : '▶'}</span>
      </div>
      <div class="weeks-container ${isPhaseExpanded ? 'open' : ''}"></div>
    `;

    const triggerClick = phaseEl.querySelector('.phase-header-click');
    const triggerIcon = phaseEl.querySelector('.phase-toggle-icon');
    const container = phaseEl.querySelector('.weeks-container');

    const toggleFn = () => {
      const open = container.classList.toggle('open');
      state.tasks[`phase-exp-${pi}`] = open;
      saveState();
      triggerIcon.textContent = open ? '▼' : '▶';
    };

    triggerClick.addEventListener('click', toggleFn);
    triggerIcon.addEventListener('click', toggleFn);

    const weeksBox = phaseEl.querySelector('.weeks-container');

    phase.weeks_data.forEach((week, wi) => {
      const weekEl = document.createElement('div');
      weekEl.className = 'week-block';
      
      const wp = weekProgress(pi, wi);
      const weekGlobalNum = calculateWeekGlobalNum(pi, wi);
      const isWeekExpanded = !!state.tasks[`week-exp-${pi}-${wi}`]; // default false

      weekEl.innerHTML = `
        <div class="week-header ${isWeekExpanded ? 'expanded' : ''}">
          <div class="week-header-num" style="background:${c.bg};color:${c.text}">W${weekGlobalNum}</div>
          <div class="week-header-info">
            <div class="week-header-title">${week.title}</div>
            <div class="week-header-goal">${week.goal}</div>
          </div>
          <div class="week-progress">
            <span class="week-pct" style="color:${c.text}">${wp.pct}%</span>
            <div class="week-bar">
              <div class="week-bar-fill" style="width:${wp.pct}%;background:${c.accent}"></div>
            </div>
          </div>
          <span class="week-chevron">▼</span>
        </div>
        <div class="day-tasks ${isWeekExpanded ? 'open' : ''}">
          <div class="day-tasks-box"></div>
        </div>
      `;

      const header = weekEl.querySelector('.week-header');
      const dayTasks = weekEl.querySelector('.day-tasks');
      const chevron = weekEl.querySelector('.week-chevron');

      header.addEventListener('click', () => {
        const open = dayTasks.classList.toggle('open');
        header.classList.toggle('expanded', open);
        state.tasks[`week-exp-${pi}-${wi}`] = open;
        saveState();
      });

      const dayBox = weekEl.querySelector('.day-tasks-box');

      week.days.forEach((day, di) => {
        const row = document.createElement('div');
        row.className = 'day-row';
        
        const learnId = taskId(pi, wi, di, 'learn');
        const buildId = taskId(pi, wi, di, 'build');

        row.innerHTML = `
          <div class="day-label">${day.day}</div>
          <div class="day-cell">
            <div class="day-cell-label" style="color:${c.text}">LEARN</div>
            <div class="day-task-item" data-id="${learnId}">
              <span class="task-checkbox ${isTaskDone(learnId) ? 'checked' : ''}"></span>
              <span class="task-text ${isTaskDone(learnId) ? 'done' : ''}">${day.learn}</span>
            </div>
            ${renderTimelineLinkPills(day.learnLinks)}
          </div>
          <div class="day-cell">
            <div class="day-cell-label" style="color:${c.text}">BUILD</div>
            <div class="day-task-item" data-id="${buildId}">
              <span class="task-checkbox ${isTaskDone(buildId) ? 'checked' : ''}"></span>
              <span class="task-text ${isTaskDone(buildId) ? 'done' : ''}">${day.build}</span>
            </div>
            ${renderTimelineLinkPills(day.buildLinks)}
          </div>
        `;

        row.querySelectorAll('.day-task-item').forEach(item => {
          item.addEventListener('click', () => {
            const tid = item.dataset.id;
            toggleTask(tid, (completedWeekIdx) => {
              showSystemNotification(`🎉 Completed Week ${completedWeekIdx+1} Checklist! Got 100 XP Bonus!`);
            });
            
            const done = isTaskDone(tid);
            item.querySelector('.task-checkbox').classList.toggle('checked', done);
            item.querySelector('.task-text').classList.toggle('done', done);

            // Re-render week progress
            const wpNew = weekProgress(pi, wi);
            weekEl.querySelector('.week-pct').textContent = `${wpNew.pct}%`;
            weekEl.querySelector('.week-pct').style.color = c.text;
            weekEl.querySelector('.week-bar-fill').style.width = `${wpNew.pct}%`;

            updateXPSystem();
          });
        });

        dayBox.appendChild(row);
      });

      if (week.deliverable) {
        const deliv = document.createElement('div');
        deliv.className = 'deliverable-row';
        deliv.innerHTML = `
          <span style="font-size:0.8rem">🎯</span>
          <span class="deliverable-text">${week.deliverable}</span>
        `;
        dayBox.appendChild(deliv);
      }

      weeksBox.appendChild(weekEl);
    });

    timeline.appendChild(phaseEl);
  });
}

function renderTimelineLinkPills(links) {
  if (!links || links.length === 0) return '';
  return `<div class="link-pills" style="margin-top:4px;">
    ${links.map(l => `
      <a href="${l.url}" target="_blank" rel="noopener" class="link-pill ${l.type}">
        ${l.type === 'video' ? '▶' : '📖'} ${formatResourceLabel(l)}
      </a>`).join('')}
  </div>`;
}

function calculateWeekGlobalNum(phaseIdx, weekIdx) {
  let count = 0;
  for (let i = 0; i < phaseIdx; i++) {
    count += ROADMAP[i].weeks_data.length;
  }
  return count + (weekIdx + 1);
}

export function appOpenPhase(phaseIdx) {
  const timeline = document.getElementById('roadmap-timeline');
  if (!timeline) return;
  
  const phaseBar = timeline.children[phaseIdx];
  if (!phaseBar) return;
  
  const container = phaseBar.querySelector('.weeks-container');
  const triggerIcon = phaseBar.querySelector('.phase-toggle-icon');
  if (container && triggerIcon) {
    container.classList.add('open');
    triggerIcon.textContent = '▼';
    state.tasks[`phase-exp-${phaseIdx}`] = true;
    saveState();
  }
  phaseBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showSystemNotification(text) {
  if (window.appShowSystemNotification) {
    window.appShowSystemNotification(text);
  }
}
