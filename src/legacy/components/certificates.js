import { state, ROADMAP, weekProgress } from '../services/state.js';
import { auth, hasFirebaseCredentials } from '../services/firebaseConfig.js';

export function renderCertificates() {
  const grid = document.getElementById('certificates-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let weekGlobalIndex = 1;

  ROADMAP.forEach((phase, pi) => {
    phase.weeks_data.forEach((week, wi) => {
      const prog = weekProgress(pi, wi);
      const isCompleted = prog.pct === 100;
      const weekNum = weekGlobalIndex;
      
      const card = document.createElement('div');
      card.className = `certificate-card ${isCompleted ? 'unlocked' : 'locked'}`;

      const accentColor = isCompleted ? '#b59410' : '#475569';
      
      card.innerHTML = `
        <div class="cert-icon-badge" style="color: ${accentColor};">
          ${isCompleted ? '📜' : '🔒'}
        </div>
        <div class="cert-card-title">Week ${weekNum}: ${week.title}</div>
        <div class="cert-card-weeks">${phase.weeks} · Progress ${prog.pct}%</div>
        
        <button class="cert-card-btn ${isCompleted ? 'unlocked' : 'locked'}" ${isCompleted ? '' : 'disabled'}>
          ${isCompleted ? 'View Certificate' : 'Week Locked'}
        </button>
      `;

      if (isCompleted) {
        card.querySelector('.cert-card-btn').addEventListener('click', () => {
          openCertificateModal(weekNum, week.title, week.goal);
        });
      }

      grid.appendChild(card);
      weekGlobalIndex++;
    });
  });
}

function openCertificateModal(weekNum, weekTitle, weekGoal) {
  const modal = document.getElementById('certificate-modal');
  const card = document.getElementById('certificate-modal-card');
  if (!modal || !card) return;

  // Retrieve user name
  let username = "Guest User";
  if (hasFirebaseCredentials && auth && auth.currentUser) {
    username = auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
  } else {
    const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
    if (currentUserStr) {
      try {
        const u = JSON.parse(currentUserStr);
        username = u.username;
      } catch (e) {}
    }
  }

  // Generate unique certificate ID
  const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
  const certId = `DRM-W${weekNum.toString().padStart(2, '0')}-${randomHex}`;

  // Set text contents
  document.getElementById('cert-recipient-name').textContent = username;
  document.getElementById('cert-week-title').textContent = `Week ${weekNum.toString().padStart(2, '0')}: ${weekTitle}`;
  document.getElementById('cert-skills-list').textContent = weekGoal || "Comprehensive Software Engineering Fundamentals";
  document.getElementById('cert-issue-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('cert-id-string').textContent = certId;

  // Show modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    card.style.transform = 'scale(1)';
  }, 10);

  // Bind sharing button triggers
  const shareBtn = document.getElementById('btn-share-cert-linkedin');
  const copyBtn = document.getElementById('btn-share-copy-post');

  shareBtn.onclick = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://github.com/devroadmap')}`;
    window.open(linkedinUrl, '_blank');
  };

  copyBtn.onclick = () => {
    const postTemplate = `🏆 Milestone Achieved! I just completed Week ${weekNum} (${weekTitle}) of the 180-Day Software Engineering Roadmap!

📚 Milestone Focus:
- ${weekGoal}

I have successfully completed all checkpoints, exercises, and code deliverables for this week. Excited for the next phase of development!

#softwareengineering #careerdev #learningroadmap #fullstack #codechallenge`;

    navigator.clipboard.writeText(postTemplate).then(() => {
      if (window.appShowSystemNotification) {
        window.appShowSystemNotification("📋 Copied LinkedIn template to clipboard!");
      }
    });
  };
}

// Binders initializer (should be run once on boot)
export function initCertificatesBinders() {
  const modal = document.getElementById('certificate-modal');
  const card = document.getElementById('certificate-modal-card');
  const closeBtn = document.getElementById('btn-close-cert-modal');

  if (closeBtn && modal && card) {
    closeBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    });
  }
}
