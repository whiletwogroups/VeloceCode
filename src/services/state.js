// ============================================================
//  src/services/state.js — Global Reactive Storage & XP Engine
// ============================================================

import { PHASES } from '../content/phases.js';
import { WEEKS } from '../content/weeks/index.js';
import { PROJECTS } from '../content/projects.js';
import { todayStr } from '../utils/date.js';
import { triggerConfetti } from '../utils/confetti.js';

// Reconstruct complete ROADMAP array by joining Phases & Weeks modules
export const ROADMAP = PHASES.map(p => ({
  ...p,
  weeks_data: WEEKS.filter(w => w.phase === p.phase)
}));

import { auth, db, hasFirebaseCredentials } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export let state = {
  startDate: null,
  tasks: {},        // { taskId: true/false }
  dailyLogs: {},    // { 'YYYY-MM-DD': { learned, coded, dsa, commit, review, notes, focusMinutes } }
  dsaProblems: [],  // [{ id, name, difficulty, phase, topic, date }]
  milestones: {},   // { 'projectId-milestoneIndex': true }
  gitCicdSkills: {}, // { skillId: true/false }
  selectedTheme: 'ember',
  selectedFont: 'public',
  avatarColor: null,
  avatarMode: 'weekly', // 'weekly' or 'custom'
  customAvatarImg: ''    // Base64 image string
};

let cloudSaveTimeout = null;

export function saveStateToCloud() {
  if (!hasFirebaseCredentials || !auth || !auth.currentUser || !db) return;
  
  if (cloudSaveTimeout) clearTimeout(cloudSaveTimeout);
  
  cloudSaveTimeout = setTimeout(async () => {
    try {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      const dataToSave = {
        startDate: state.startDate,
        tasks: state.tasks,
        dailyLogs: state.dailyLogs,
        dsaProblems: state.dsaProblems,
        milestones: state.milestones,
        gitCicdSkills: state.gitCicdSkills,
        selectedTheme: state.selectedTheme,
        selectedFont: state.selectedFont,
        avatarColor: state.avatarColor,
        avatarMode: state.avatarMode,
        customAvatarImg: state.customAvatarImg
      };
      await setDoc(userDocRef, dataToSave, { merge: true });
      console.log("Cloud state synced to Firestore.");
    } catch (error) {
      console.error("Failed to sync state to cloud:", error);
    }
  }, 1000);
}

export function getStateStorageKey() {
  if (hasFirebaseCredentials && auth && auth.currentUser) {
    return `devRoadmap_state_${auth.currentUser.uid}`;
  }
  const localUserStr = localStorage.getItem('devRoadmap_currentUser');
  if (localUserStr) {
    try {
      const u = JSON.parse(localUserStr);
      if (u && u.email) {
        return `devRoadmap_state_local_${u.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }
    } catch(e) {}
  }
  return 'devRoadmap_state_guest';
}

export function resetState() {
  state.startDate = null;
  state.tasks = {};
  state.dailyLogs = {};
  state.dsaProblems = [];
  state.milestones = {};
  state.gitCicdSkills = {};
  state.selectedTheme = 'ember';
  state.selectedFont = 'public';
  state.avatarColor = null;
  state.avatarMode = 'weekly';
  state.customAvatarImg = '';
}

export function saveState() {
  const key = getStateStorageKey();
  localStorage.setItem(key, JSON.stringify(state));
  saveStateToCloud();
}

export async function loadStateFromCloud(uid) {
  if (!hasFirebaseCredentials || !db) return false;
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      Object.assign(state, cloudData);
      const key = getStateStorageKey();
      localStorage.setItem(key, JSON.stringify(state));
      return true;
    }
  } catch (error) {
    console.error("Failed to load state from Firestore:", error);
  }
  return false;
}

export function loadState() {
  const key = getStateStorageKey();
  const raw = localStorage.getItem(key);
  resetState();
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      Object.assign(state, saved);
    } catch(e) { console.warn('Failed to parse saved state'); }
  }
  
  const OLD_DATES = ['2026-06-08', '2026-06-09'];
  if (state.startDate && OLD_DATES.includes(state.startDate)) {
    state.startDate = null;
    saveState();
  }
}

// ─── Task ID helpers ─────────────────────────────────────────
export function taskId(phaseIdx, weekIdx, dayIdx, slot) {
  return `p${phaseIdx}-w${weekIdx}-d${dayIdx}-${slot}`;
}

export function isTaskDone(id) { return !!state.tasks[id]; }

export function toggleTask(id, callbackOnCompleteWeek) {
  const match = id.match(/^p(\d+)-w(\d+)-d\d+-(learn|build)$/);
  let pi = null, wi = null;
  let beforePct = 0;
  
  if (match) {
    pi = parseInt(match[1]);
    wi = parseInt(match[2]);
    beforePct = weekProgress(pi, wi).pct;
  }

  state.tasks[id] = !state.tasks[id];
  saveState();
  updateXPSystem();

  if (match && pi !== null && wi !== null) {
    const afterPct = weekProgress(pi, wi).pct;
    if (beforePct < 100 && afterPct === 100) {
      triggerConfetti();
      if (callbackOnCompleteWeek) callbackOnCompleteWeek(wi);
    }
  }
}

// ─── Progress Calculations ────────────────────────────────────
export function getDayNumber() {
  if (!state.startDate) return null;
  const start = new Date(state.startDate);
  const now = new Date();
  start.setHours(0,0,0,0); now.setHours(0,0,0,0);
  const diff = Math.floor((now - start) / 86400000);
  const day = diff + 1;
  if (isNaN(day)) return 1;
  return Math.max(1, day);
}

export function computeStreak() {
  const logs = state.dailyLogs;
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  
  const todayKey = d.toISOString().split('T')[0];
  if (!logs[todayKey] || !logs[todayKey].commit) {
    d.setDate(d.getDate() - 1);
  }
  
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

export function countTasks() {
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

export function phaseProgress(phaseIdx) {
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

export function weekProgress(phaseIdx, weekIdx) {
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

export function dsaCounts() {
  const counts = {2:0, 3:0, 4:0, 5:0};
  state.dsaProblems.forEach(p => {
    const ph = parseInt(p.phase);
    if (counts[ph] !== undefined) counts[ph]++;
  });
  return counts;
}

// ─── XP Leveling Engine ───────────────────────────────────────
export function calculateXP() {
  let xp = 0;
  for (const key in state.tasks) {
    if (state.tasks[key]) xp += 10;
  }
  for (const date in state.dailyLogs) {
    const log = state.dailyLogs[date];
    if (log.learned) xp += 10;
    if (log.coded) xp += 15;
    if (log.dsa) xp += 20;
    if (log.commit) xp += 10;
    if (log.review) xp += 10;
  }
  xp += state.dsaProblems.length * 20;
  for (const key in state.milestones) {
    if (state.milestones[key]) xp += 50;
  }
  return xp;
}

export function updateXPSystem() {
  const xp = calculateXP();
  const level = Math.floor(xp / 200) + 1;
  const currentLevelXP = xp % 200;
  const levelProgressPct = Math.round((currentLevelXP / 200) * 100);
  
  if (window.syncAvatarUI) {
    window.syncAvatarUI();
  }
  
  const headerXp = document.getElementById('header-xp-val');
  const headerLvl = document.getElementById('header-level-val');
  if (headerXp) headerXp.textContent = xp;
  if (headerLvl) headerLvl.textContent = `LVL ${level}`;
  
  const sidebarLvl = document.getElementById('user-level-sidebar');
  const sidebarXpBar = document.getElementById('user-xp-bar-sidebar');
  if (sidebarLvl) sidebarLvl.textContent = `Level ${level} Coder`;
  if (sidebarXpBar) sidebarXpBar.style.width = `${levelProgressPct}%`;
  
  const lvlBadge = document.getElementById('level-badge-display');
  const xpText = document.getElementById('xp-text-display');
  const xpPct = document.getElementById('xp-percent-display');
  const xpBar = document.getElementById('xp-progress-bar-fill');
  if (lvlBadge) lvlBadge.textContent = `Level ${level} Coder`;
  if (xpText) xpText.textContent = `${currentLevelXP} / 200 XP (Total: ${xp} XP)`;
  if (xpPct) xpPct.textContent = `${levelProgressPct}%`;
  if (xpBar) xpBar.style.width = `${levelProgressPct}%`;
  
  updateBadges(xp);
}

function updateBadges(xp) {
  const badgeNovice = document.getElementById('badge-novice');
  const badgeGit = document.getElementById('badge-git');
  const badgeCi = document.getElementById('badge-ci');
  const badgeRag = document.getElementById('badge-rag');
  
  if (badgeNovice) {
    if (xp > 0) {
      badgeNovice.classList.add('unlocked');
      badgeNovice.style.background = 'var(--accent-grad)';
    } else {
      badgeNovice.classList.remove('unlocked');
      badgeNovice.style.background = '';
    }
  }
  
  let commitDays = 0;
  for (const date in state.dailyLogs) {
    if (state.dailyLogs[date].commit) commitDays++;
  }
  if (badgeGit) {
    if (commitDays >= 10) {
      badgeGit.classList.add('unlocked');
      badgeGit.style.background = 'var(--accent-grad)';
    } else {
      badgeGit.classList.remove('unlocked');
      badgeGit.style.background = '';
    }
  }
  
  const devBoardDone = state.milestones && Object.keys(state.milestones).filter(k => k.startsWith('devboard-') && state.milestones[k]).length >= 13;
  if (badgeCi) {
    if (devBoardDone) {
      badgeCi.classList.add('unlocked');
      badgeCi.style.background = 'var(--accent-grad)';
    } else {
      badgeCi.classList.remove('unlocked');
      badgeCi.style.background = '';
    }
  }
  
  const nexaAiDone = state.milestones && Object.keys(state.milestones).filter(k => k.startsWith('nexaai-') && state.milestones[k]).length >= 16;
  if (badgeRag) {
    if (nexaAiDone) {
      badgeRag.classList.add('unlocked');
      badgeRag.style.background = 'var(--accent-grad)';
    } else {
      badgeRag.classList.remove('unlocked');
      badgeRag.style.background = '';
    }
  }
}

export const WEEKLY_AVATARS = [
  { emoji: "💻", title: "Novice" },
  { emoji: "🌐", title: "Web Page Builder" },
  { emoji: "🎨", title: "CSS Designer" },
  { emoji: "📜", title: "JS Apprentice" },
  { emoji: "🛠️", title: "Tooling Tinkerer" },
  { emoji: "🏗️", title: "UI Architect" },
  { emoji: "🗃️", title: "Data Modeler" },
  { emoji: "🔗", title: "API Connector" },
  { emoji: "📦", title: "Component Specialist" },
  { emoji: "⚡", title: "React Developer" },
  { emoji: "🗺️", title: "Routing Navigator" },
  { emoji: "💾", title: "State Manager" },
  { emoji: "🧪", title: "Quality Tester" },
  { emoji: "🔒", title: "Auth Guard" },
  { emoji: "🚀", title: "Full Stack Builder" },
  { emoji: "☁️", title: "Cloud Deployer" },
  { emoji: "📁", title: "Database Queryist" },
  { emoji: "🚦", title: "Middleware Engineer" },
  { emoji: "⏱️", title: "Performance Optimizer" },
  { emoji: "📡", title: "WebSockets Operator" },
  { emoji: "🛡️", title: "Security Analyst" },
  { emoji: "🐳", title: "Docker Captain" },
  { emoji: "☸️", title: "K8s Commander" },
  { emoji: "📊", title: "Analytics Integrator" },
  { emoji: "🔍", title: "SEO Optimizer" },
  { emoji: "💳", title: "Payment Processor" },
  { emoji: "⚙️", title: "CI/CD Automator" },
  { emoji: "🖥️", title: "OS Programmer" },
  { emoji: "🧠", title: "Algorithm Master" },
  { emoji: "📶", title: "Graph Specialist" },
  { emoji: "🗝️", title: "Crypto Specialist" },
  { emoji: "🎛️", title: "System Designer" },
  { emoji: "🛰️", title: "Microservices Planner" },
  { emoji: "📉", title: "Serverless Scaler" },
  { emoji: "🧪", title: "QA Lead" },
  { emoji: "🎓", title: "Capstone Dev" },
  { emoji: "👑", title: "Grandmaster Architect" }
];

export function getCompletedWeeksCount() {
  let count = 0;
  ROADMAP.forEach((phase, pi) => {
    phase.weeks_data.forEach((week, wi) => {
      const prog = weekProgress(pi, wi);
      if (prog.pct === 100) {
        count++;
      }
    });
  });
  return count;
}

export function getWeeklyAvatar() {
  const completed = getCompletedWeeksCount();
  const index = Math.min(completed, WEEKLY_AVATARS.length - 1);
  return WEEKLY_AVATARS[index] || WEEKLY_AVATARS[0];
}
