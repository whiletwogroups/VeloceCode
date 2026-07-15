import { state, saveState, calculateXP, countTasks, resetState, getWeeklyAvatar, WEEKLY_AVATARS, getCompletedWeeksCount } from '../services/state.js';
import { auth, hasFirebaseCredentials } from '../services/firebaseConfig.js';
import { signOutUser } from './authPanel.js';

export function syncAvatarUI() {
  const sidebarAvatar = document.getElementById('user-avatar-sidebar');
  const viewAvatar = document.getElementById('view-profile-avatar');

  const av = getWeeklyAvatar();
  const contentValue = av.emoji || '💻';
  const color = state.avatarColor || '#4f46e5';

  if (sidebarAvatar) {
    sidebarAvatar.style.background = color;
    sidebarAvatar.textContent = contentValue;
  }

  if (viewAvatar) {
    viewAvatar.style.background = color;
    viewAvatar.textContent = contentValue;
  }
}

window.syncAvatarUI = syncAvatarUI;

export function renderProfileView() {
  const xp = calculateXP();
  const level = Math.floor(xp / 200) + 1;
  const currentLevelXP = xp % 200;
  const levelProgressPct = Math.round((currentLevelXP / 200) * 100);

  // User details
  let username = "Guest User";
  let email = "guest@example.com";

  if (hasFirebaseCredentials && auth && auth.currentUser) {
    username = auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
    email = auth.currentUser.email;
  } else {
    const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
    if (currentUserStr) {
      try {
        const u = JSON.parse(currentUserStr);
        username = u.username;
        email = u.email;
      } catch (e) {}
    }
  }

  // Populate HTML elements
  const usernameEl = document.getElementById("view-profile-username");
  const emailEl = document.getElementById("view-profile-email");
  const levelLabelEl = document.getElementById("view-profile-level-label");
  const xpFillEl = document.getElementById("view-profile-xp-fill");
  const xpRatioEl = document.getElementById("view-profile-xp-ratio");

  const statXp = document.getElementById("view-profile-stat-xp");
  const statFocus = document.getElementById("view-profile-stat-focus");
  const statTasks = document.getElementById("view-profile-stat-tasks");
  const statDsa = document.getElementById("view-profile-stat-dsa");

  if (usernameEl) usernameEl.textContent = username;
  if (emailEl) emailEl.textContent = email;
  if (levelLabelEl) levelLabelEl.textContent = `Level ${level} Coder`;
  if (xpFillEl) xpFillEl.style.width = `${levelProgressPct}%`;
  if (xpRatioEl) xpRatioEl.textContent = `${currentLevelXP} / 200 XP`;

  let totalMins = 0;
  for (const k in state.dailyLogs) {
    totalMins += state.dailyLogs[k].focusMinutes || 0;
  }
  const focusHours = Math.round(totalMins / 60);

  if (statXp) statXp.textContent = xp;
  if (statFocus) statFocus.textContent = `${focusHours}h`;
  if (statTasks) statTasks.textContent = countTasks().done;
  if (statDsa) statDsa.textContent = state.dsaProblems.length;

  // Render swatches outline
  const currentAccent = state.avatarColor || '#4f46e5';
  document.querySelectorAll(".color-picker-dot-btn").forEach(dot => {
    if (dot.dataset.color === currentAccent) {
      dot.style.borderColor = 'var(--text-primary)';
      dot.style.transform = 'scale(1.15)';
    } else {
      dot.style.borderColor = 'transparent';
      dot.style.transform = '';
    }
  });

  // Render dynamic weekly avatar list showcase roadmap
  renderAvatarsShowcase();

  // Sync avatar representation
  syncAvatarUI();
}

function renderAvatarsShowcase() {
  const container = document.getElementById('profile-avatars-showcase-grid');
  if (!container) return;
  container.innerHTML = '';

  const completedCount = getCompletedWeeksCount();

  WEEKLY_AVATARS.forEach((av, index) => {
    const isUnlocked = index <= completedCount;
    
    const card = document.createElement('div');
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.padding = '8px';
    card.style.borderRadius = '4px';
    card.style.border = '1px solid var(--border)';
    card.style.background = isUnlocked ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255,255,255,0.01)';
    card.style.opacity = isUnlocked ? '1' : '0.4';
    card.style.textAlign = 'center';

    card.innerHTML = `
      <div style="font-size: 1.5rem; margin-bottom: 4px;">${isUnlocked ? av.emoji : '🔒'}</div>
      <div style="font-size: 0.65rem; font-weight: 700; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%;">${av.title}</div>
      <div style="font-size: 0.58rem; color: var(--text-muted); margin-top: 2px;">
        ${index === 0 ? 'Novice Starter' : `Week ${index}`}
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Binders initializer (should be run once on boot)
export function initProfileViewBinders() {
  // Color Swatches
  document.querySelectorAll(".color-picker-dot-btn").forEach(dot => {
    dot.addEventListener("click", () => {
      const color = dot.dataset.color;
      state.avatarColor = color;
      saveState();
      syncAvatarUI();

      // Sync swatches outline
      document.querySelectorAll(".color-picker-dot-btn").forEach(d => {
        if (d.dataset.color === color) {
          d.style.borderColor = 'var(--text-primary)';
          d.style.transform = 'scale(1.15)';
        } else {
          d.style.borderColor = 'transparent';
          d.style.transform = '';
        }
      });
      if (window.appShowSystemNotification) {
        window.appShowSystemNotification("🎨 Profile avatar color updated!");
      }
    });
  });

  // Password Submit
  const form = document.getElementById("view-profile-change-pw-form");
  const msgEl = document.getElementById("view-profile-pw-msg");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgEl) msgEl.style.display = "none";

    const currentPw = document.getElementById("view-profile-pw-current").value;
    const newPw = document.getElementById("view-profile-pw-new").value;

    if (hasFirebaseCredentials && auth && auth.currentUser) {
      try {
        const { updatePassword } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
        await updatePassword(auth.currentUser, newPw);
        if (msgEl) {
          msgEl.textContent = "🔑 Password updated successfully!";
          msgEl.style.background = "rgba(16, 185, 129, 0.1)";
          msgEl.style.color = "var(--success)";
          msgEl.style.display = "block";
        }
        form.reset();
      } catch (err) {
        if (msgEl) {
          msgEl.textContent = err.message;
          msgEl.style.background = "rgba(239, 68, 68, 0.1)";
          msgEl.style.color = "var(--danger)";
          msgEl.style.display = "block";
        }
      }
    } else {
      // Local Storage change
      try {
        const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
        if (!currentUserStr) throw new Error("No active session found.");
        const currentUser = JSON.parse(currentUserStr);
        const email = currentUser.email.toLowerCase().trim();

        const localUsers = JSON.parse(localStorage.getItem('devRoadmap_localUsers') || '{}');
        const user = localUsers[email];
        if (!user) throw new Error("User record not found.");
        if (user.password !== currentPw) throw new Error("Incorrect current password.");
        if (newPw.length < 6) throw new Error("New password must be at least 6 characters.");

        user.password = newPw;
        localUsers[email] = user;
        localStorage.setItem('devRoadmap_localUsers', JSON.stringify(localUsers));

        if (msgEl) {
          msgEl.textContent = "🔑 Password updated successfully!";
          msgEl.style.background = "rgba(16, 185, 129, 0.1)";
          msgEl.style.color = "var(--success)";
          msgEl.style.display = "block";
        }
        form.reset();
      } catch (err) {
        if (msgEl) {
          msgEl.textContent = err.message;
          msgEl.style.background = "rgba(239, 68, 68, 0.1)";
          msgEl.style.color = "var(--danger)";
          msgEl.style.display = "block";
        }
      }
    }
  });

  // Danger Zone - Reset Progress
  document.getElementById("view-profile-reset-btn")?.addEventListener("click", () => {
    if (confirm("⚠️ WARNING: This will completely reset all your progress (learning logs, checklists, projects milestones, DSA tracker). This action CANNOT be undone. Are you sure?")) {
      resetState();
      saveState();
      syncAvatarUI();
      
      if (window.appSwitchView) window.appSwitchView('dashboard');
      if (window.appShowSystemNotification) {
        window.appShowSystemNotification("🗑️ Account progress reset successfully.");
      }
    }
  });

  // Danger Zone - Sign Out
  document.getElementById("view-profile-signout-btn")?.addEventListener("click", () => {
    signOutUser();
  });
}
