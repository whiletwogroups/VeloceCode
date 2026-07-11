// ============================================================
//  src/components/projectsPanel.js — Projects Component
// ============================================================

import { state, saveState, updateXPSystem } from '../services/state.js';
import { PROJECTS } from '../content/projects.js';
import { triggerConfetti } from '../utils/confetti.js';

function hexToRgbString(hex) {
  if (!hex) return '79, 70, 229';
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '79, 70, 229';
}

export function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  container.innerHTML = '';

  PROJECTS.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const accentColor = project.color || '#6366f1';
    const rgbStr = hexToRgbString(accentColor);

    const doneCount = project.milestones.filter((_, idx) => !!state.milestones[`${project.id}-${idx}`]).length;
    const totalCount = project.milestones.length;
    const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

    // Render tech tags
    const techHTML = project.tech ? project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('') : '';

    // Render milestones
    let milestonesHTML = '';
    project.milestones.forEach((m, idx) => {
      const isCompleted = !!state.milestones[`${project.id}-${idx}`];
      milestonesHTML += `
        <div class="milestone-item" data-project-id="${project.id}" data-index="${idx}">
          <div class="milestone-check ${isCompleted ? 'done' : ''}"></div>
          <span class="milestone-text ${isCompleted ? 'done' : ''}">${m}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="project-card-top">
        <div class="project-number" style="background: rgba(${rgbStr}, 0.1); color: ${accentColor};">
          ${project.number || '01'}
        </div>
        <div class="project-info">
          <span class="project-phase-badge" style="background: rgba(${rgbStr}, 0.08); color: ${accentColor}; border: 1px solid rgba(${rgbStr}, 0.15);">
            ${project.phase || 'Phase 3'}
          </span>
          <h3 class="project-name">${project.name}</h3>
          <p class="project-tagline">${project.tagline || ''}</p>
        </div>
        <div class="project-status-badge" style="background: rgba(${rgbStr}, 0.08); color: ${accentColor}; border: 1px solid rgba(${rgbStr}, 0.15);">
          ${pct === 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started'}
        </div>
      </div>
      
      <div class="project-body">
        <div class="project-weeks">
          <span>📅</span> <strong>Weeks:</strong> ${project.weeks || ''}
        </div>
        
        <div class="project-tech">
          ${techHTML}
        </div>
        
        <div class="project-milestones">
          <h4 style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; margin-top: 4px;">
            📋 Milestones & Verification
          </h4>
          <div class="milestones-list-container">
            ${milestonesHTML}
          </div>
        </div>
      </div>
      
      <div class="project-progress-footer">
        <div class="proj-progress-bar">
          <div class="proj-progress-fill" style="width: ${pct}%; background: ${accentColor}; color: ${accentColor};"></div>
        </div>
        <span class="proj-pct" style="color: ${accentColor};">${pct}%</span>
      </div>
    `;

    // Bind click handlers to milestones
    card.querySelectorAll('.milestone-item').forEach(row => {
      row.addEventListener('click', () => {
        const pId = row.dataset.projectId;
        const idx = parseInt(row.dataset.index);
        const key = `${pId}-${idx}`;
        const wasCompleted = !!state.milestones[key];
        
        state.milestones[key] = !state.milestones[key];
        saveState();
        
        const checkEl = row.querySelector('.milestone-check');
        const textEl = row.querySelector('.milestone-text');
        
        const isNowCompleted = state.milestones[key];
        checkEl.classList.toggle('done', isNowCompleted);
        textEl.classList.toggle('done', isNowCompleted);

        // Celebrate on 100% completion
        const newDoneCount = project.milestones.filter((_, i) => !!state.milestones[`${project.id}-${i}`]).length;
        if (!wasCompleted && newDoneCount === totalCount) {
          triggerConfetti();
          showSystemNotification(`🚀 Congratulations! Fully Completed project: "${project.name}"!`);
        }

        // Recalculate card progress
        const newPct = totalCount ? Math.round((newDoneCount / totalCount) * 100) : 0;
        card.querySelector('.proj-pct').textContent = `${newPct}%`;
        card.querySelector('.proj-progress-fill').style.width = `${newPct}%`;
        
        // Update status badge
        const statusBadge = card.querySelector('.project-status-badge');
        if (statusBadge) {
          statusBadge.textContent = newPct === 100 ? 'Completed' : newPct > 0 ? 'In Progress' : 'Not Started';
        }

        updateXPSystem();
        if (window.appRenderDashboard) window.appRenderDashboard();
      });
    });

    container.appendChild(card);
  });
}

function showSystemNotification(text) {
  if (window.appShowSystemNotification) {
    window.appShowSystemNotification(text);
  }
}
