import { state, calculateXP, computeStreak, WEEKLY_AVATARS, getWeeklyAvatar, countTasks } from '../services/state.js';
import { auth, hasFirebaseCredentials } from '../services/firebaseConfig.js';

const MOCK_LEARNERS = [
  { name: "Alex Mercer", email: "alex@example.com", xp: 1800, streak: 24, commits: 22, tasksDone: 25, dsaDone: 15, week: "Week 12", avatarColor: "#10b981" },
  { name: "Sophia Lin", email: "sophia@example.com", xp: 1520, streak: 18, commits: 19, tasksDone: 21, dsaDone: 12, week: "Week 9", avatarColor: "#f59e0b" },
  { name: "Daniel Craig", email: "daniel@example.com", xp: 1250, streak: 14, commits: 16, tasksDone: 18, dsaDone: 10, week: "Week 8", avatarColor: "#ec4899" },
  { name: "Chao Zhang", email: "chao@example.com", xp: 980, streak: 11, commits: 12, tasksDone: 14, dsaDone: 8, week: "Week 6", avatarColor: "#3b82f6" },
  { name: "Ryan Dahl", email: "ryan@example.com", xp: 850, streak: 9, commits: 10, tasksDone: 11, dsaDone: 7, week: "Week 5", avatarColor: "#8b5cf6" },
  { name: "Sarah Connor", email: "sarah@example.com", xp: 720, streak: 8, commits: 8, tasksDone: 10, dsaDone: 6, week: "Week 4", avatarColor: "#ef4444" },
  { name: "Vikram Sen", email: "vikram@example.com", xp: 600, streak: 7, commits: 7, tasksDone: 8, dsaDone: 5, week: "Week 3", avatarColor: "#10b981" },
  { name: "Elena Rostova", email: "elena@example.com", xp: 480, streak: 5, commits: 5, tasksDone: 6, dsaDone: 3, week: "Week 2", avatarColor: "#f59e0b" },
  { name: "Marcus Aurelius", email: "marcus@example.com", xp: 400, streak: 4, commits: 4, tasksDone: 5, dsaDone: 3, week: "Week 2", avatarColor: "#3b82f6" },
  { name: "Linus Torvalds", email: "linus@example.com", xp: 350, streak: 4, commits: 4, tasksDone: 4, dsaDone: 2, week: "Week 2", avatarColor: "#8b5cf6" },
  { name: "Ada Lovelace", email: "ada@example.com", xp: 280, streak: 3, commits: 3, tasksDone: 3, dsaDone: 2, week: "Week 1", avatarColor: "#ec4899" },
  { name: "Grace Hopper", email: "grace@example.com", xp: 200, streak: 2, commits: 2, tasksDone: 3, dsaDone: 1, week: "Week 1", avatarColor: "#10b981" },
  { name: "John Connor", email: "john@example.com", xp: 150, streak: 1, commits: 1, tasksDone: 2, dsaDone: 1, week: "Week 1", avatarColor: "#ef4444" }
];

function calculateConsistencyScore(user) {
  return (
    user.xp +
    user.streak * 25 +
    user.commits * 40 +
    user.tasksDone * 15 +
    user.dsaDone * 20
  );
}

function getCommitDaysCount() {
  let count = 0;
  for (const date in state.dailyLogs) {
    if (state.dailyLogs[date].commit) {
      count++;
    }
  }
  return count;
}

export function renderLeaderboard() {
  const podiumContainer = document.getElementById('leaderboard-podium');
  const listContainer = document.getElementById('leaderboard-list');
  const stickyContainer = document.getElementById('leaderboard-current-user-sticky-container');

  if (!podiumContainer || !listContainer) return;

  podiumContainer.innerHTML = '';
  listContainer.innerHTML = '';
  if (stickyContainer) stickyContainer.innerHTML = '';

  // Get current user stats
  let currentUsername = "Guest User";
  let currentEmail = "guest@example.com";

  if (hasFirebaseCredentials && auth && auth.currentUser) {
    currentUsername = auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
    currentEmail = auth.currentUser.email;
  } else {
    const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
    if (currentUserStr) {
      try {
        const u = JSON.parse(currentUserStr);
        currentUsername = u.username;
        currentEmail = u.email;
      } catch (e) {}
    }
  }

  const currentXP = calculateXP();
  const currentStreak = computeStreak();
  const commitsCount = getCommitDaysCount();
  const tasksCount = countTasks().done;
  const dsaCount = state.dsaProblems.length;

  let currentWeekNum = 1;
  if (state.startDate) {
    const today = new Date();
    const start = new Date(state.startDate);
    const diff = today - start;
    const days = Math.floor(diff / 86400000);
    currentWeekNum = Math.min(36, Math.max(1, Math.floor(days / 7) + 1));
  }

  const currentUser = {
    name: currentUsername + " (You)",
    email: currentEmail,
    xp: currentXP,
    streak: currentStreak,
    commits: commitsCount,
    tasksDone: tasksCount,
    dsaDone: dsaCount,
    week: `Week ${currentWeekNum}`,
    avatarColor: state.avatarColor || '#4f46e5',
    isCurrentUser: true
  };

  // Map scores
  const processedMock = MOCK_LEARNERS.map(u => ({
    ...u,
    score: calculateConsistencyScore(u)
  }));
  
  const processedUser = {
    ...currentUser,
    score: calculateConsistencyScore(currentUser)
  };

  // Combine lists and sort by Consistency Score
  const allUsers = [...processedMock, processedUser];
  allUsers.sort((a, b) => b.score - a.score);

  // Identify ranks
  const rankedList = allUsers.map((u, index) => ({ ...u, rank: index + 1 }));

  // Find current user's rank object
  const currentUserRank = rankedList.find(u => u.isCurrentUser);

  // Update Hero Banner content based on standings (Design 3/4 reference)
  const heroTitle = document.getElementById('leaderboard-hero-title');
  const heroSubtitle = document.getElementById('leaderboard-hero-subtitle');

  if (currentUserRank) {
    if (currentUserRank.rank === 1) {
      if (heroTitle) heroTitle.textContent = "🏆 You are leading the pack!";
      if (heroSubtitle) heroSubtitle.textContent = "You're currently Rank #1. Keep studying and committing to maintain your crown!";
    } else {
      const nextUser = rankedList.find(u => u.rank === currentUserRank.rank - 1);
      const pointsDiff = nextUser ? (nextUser.score - currentUserRank.score) : 0;
      
      if (heroTitle) heroTitle.textContent = "You're closer than you think!";
      if (heroSubtitle) {
        heroSubtitle.innerHTML = `Just <strong style="color:#ffffff; font-family:var(--font-mono);">${pointsDiff} points</strong> away from overtaking <strong>${nextUser ? nextUser.name : 'the next learner'}</strong>! Complete checkoff milestones to boost your rank.`;
      }
    }
  }

  // Populate dynamic header metrics
  const totalRegisteredEl = document.getElementById('stats-total-registered');
  const activeStreaksEl = document.getElementById('stats-active-streaks');
  if (totalRegisteredEl) {
    totalRegisteredEl.textContent = (1277 + (state.startDate ? 1 : 0)).toLocaleString();
  }
  if (activeStreaksEl) {
    let activeStreakCount = 255;
    if (currentStreak > 0) activeStreakCount++;
    activeStreaksEl.textContent = activeStreakCount;
  }

  // Separate top 3 for podium (Design 3/4 podium style)
  const rank1 = rankedList.find(u => u.rank === 1);
  const rank2 = rankedList.find(u => u.rank === 2);
  const rank3 = rankedList.find(u => u.rank === 3);

  // Render Podium (Ranks: 2nd, 1st, 3rd) as sleek vertical card columns side by side
  if (rank2) podiumContainer.appendChild(createPodiumCard(rank2, 2));
  if (rank1) podiumContainer.appendChild(createPodiumCard(rank1, 1));
  if (rank3) podiumContainer.appendChild(createPodiumCard(rank3, 3));

  // Render Ranks list (Ranks 4-10)
  const remainingRanks = rankedList.filter(u => u.rank >= 4 && u.rank <= 10);
  remainingRanks.forEach(u => {
    listContainer.appendChild(createLeaderboardRow(u));
  });

  // Sticky standalone Standing card if user is ranked below 10 (as requested!)
  if (currentUserRank && currentUserRank.rank > 10 && stickyContainer) {
    const nextRankUser = rankedList.find(u => u.rank === currentUserRank.rank - 1);
    const pointsBehind = nextRankUser ? (nextRankUser.score - currentUserRank.score) : 0;
    const match = currentUserRank.week.match(/\d+/);
    const completedWeeks = match ? (parseInt(match[0]) - 1) : 0;
    const completionPct = Math.round((completedWeeks / 36) * 100);

    stickyContainer.innerHTML = `
      <div style="background: rgba(139, 92, 246, 0.08); border: 2px dashed rgba(139, 92, 246, 0.4); border-radius: var(--radius); padding: 18px 24px; box-shadow: 0 0 20px rgba(139, 92, 246, 0.1); margin-top: 16px;">
        <div style="font-size: 0.68rem; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Your Standing Position</div>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px; width: 240px;">
            <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: #c084fc;">#${currentUserRank.rank}</div>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: ${currentUserRank.avatarColor}; display: grid; place-items: center; font-size: 1.25rem; border: 2px solid rgba(255,255,255,0.08);">
              ${getUserEmoji(currentUserRank)}
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #ffffff;">${currentUserRank.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${currentUserRank.week}</div>
            </div>
          </div>
          
          <!-- Mid: progress bar -->
          <div style="flex: 1; padding: 0 16px; min-width: 150px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.7rem; color: var(--text-secondary);">
              <span>${getUserRankTitle(currentUserRank)}</span>
              <span style="font-family: var(--font-mono); font-weight: 700; color: #10b981;">${completionPct}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.04); border-radius: 10px; overflow: hidden;">
              <div style="width: ${completionPct}%; height: 100%; background: #10b981;"></div>
            </div>
          </div>

          <div style="display: flex; gap: 24px; align-items: center;">
            <div style="font-size: 0.76rem; color: #f59e0b; font-weight: 700;">🔥 ${currentUserRank.streak} days streak</div>
            <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent-2); font-weight: 700;">${currentUserRank.xp} XP</div>
            <div style="text-align: right;">
              <div style="font-size: 1.1rem; font-weight: 900; font-family: var(--font-mono); color: #a78bfa;">${currentUserRank.score}</div>
              <div style="font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase;">Consistency score</div>
            </div>
          </div>
        </div>
        ${nextRankUser ? `
          <div style="border-top: 1px solid rgba(139, 92, 246, 0.15); margin-top: 12px; padding-top: 8px; font-size: 0.72rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
            <span>⚡</span>
            <span>Overtake <strong>${nextRankUser.name}</strong> (Rank #${nextRankUser.rank}) by earning <strong>${pointsBehind} more Consistency points</strong>! Commit continuously or complete weekly checkoffs to close the gap!</span>
          </div>
        ` : ''}
      </div>
    `;
  }
}

function getUserEmoji(user) {
  if (user.isCurrentUser) {
    const av = getWeeklyAvatar();
    return av.emoji || '💻';
  }
  const match = user.week.match(/\d+/);
  if (match) {
    const weekNum = parseInt(match[0]);
    const index = Math.max(0, weekNum - 1);
    const av = WEEKLY_AVATARS[index];
    return av ? av.emoji : '💻';
  }
  return '💻';
}

function getUserRankTitle(user) {
  const match = user.week.match(/\d+/);
  const weekNum = match ? parseInt(match[0]) : 1;
  const index = Math.max(0, weekNum - 1);
  const av = WEEKLY_AVATARS[index];
  return av ? av.title : 'Novice Coder';
}

function createPodiumCard(user, rank) {
  const card = document.createElement('div');
  card.className = `podium-card rank-${rank} ${user.isCurrentUser ? 'current-user-card' : ''}`;
  
  const emoji = getUserEmoji(user);
  const title = getUserRankTitle(user);
  const match = user.week.match(/\d+/);
  const completedWeeks = match ? (parseInt(match[0]) - 1) : 0;
  
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const badgeColor = rank === 1 ? '#f59e0b' : rank === 2 ? '#06b6d4' : '#db2777';

  card.innerHTML = `
    <!-- Top Rank/Medal Tag -->
    <div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; font-size: 0.62rem; font-weight: 800; color: ${badgeColor}; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">
      <span>RANK</span>
      <span style="font-family: var(--font-mono); font-weight: 900; font-size: 0.72rem;">${rank}</span>
      <span>${medal}</span>
    </div>

    <!-- Center profile info -->
    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 14px; flex: 1; justify-content: center;">
      <div class="leaderboard-avatar" style="width: 50px; height: 50px; border-radius: 50%; background: ${user.avatarColor}; display: grid; place-items: center; font-size: 1.4rem; border: 2.5px solid ${badgeColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.15); margin-bottom: 8px;">
        ${emoji}
      </div>
      <div style="font-size: 0.9rem; font-weight: 800; color: #ffffff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 170px;">${user.name}</div>
      <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">${title}</div>
    </div>

    <!-- Compact metrics row -->
    <div style="display: flex; justify-content: space-between; width: 100%; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 10px; margin-top: 8px; font-size: 0.68rem; color: var(--text-secondary);">
      <div>
        <span style="color: var(--text-muted);">Commits:</span>
        <strong style="color: #ffffff; font-family: var(--font-mono);">${user.commits}</strong>
      </div>
      <div>
        <span style="color: #f59e0b; font-weight: 700;">🔥 ${user.streak}d streak</span>
      </div>
    </div>

    <!-- Bottom Consistency points bar -->
    <div style="width: 100%; background: linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%); border: 1px solid rgba(167, 139, 250, 0.3); color:#ffffff; font-family:var(--font-mono); font-size: 0.78rem; font-weight: 900; margin-top: 10px; padding: 6px 0; border-radius: var(--radius-sm); text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-transform: uppercase; letter-spacing: 0.05em;">
      ${user.score} PTS
    </div>
  `;
  return card;
}

function createLeaderboardRow(user) {
  const row = document.createElement('div');
  row.className = `leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`;

  const emoji = getUserEmoji(user);
  const rankTitle = getUserRankTitle(user);
  const match = user.week.match(/\d+/);
  const completedWeeks = match ? (parseInt(match[0]) - 1) : 0;
  const completionPct = Math.round((completedWeeks / 36) * 100);

  row.innerHTML = `
    <div class="leaderboard-rank" style="width: 60px;">#${user.rank}</div>
    <div class="leaderboard-profile" style="width: 200px; min-width: 180px;">
      <div class="leaderboard-avatar" style="background:${user.avatarColor}; border: 1.5px solid rgba(255,255,255,0.06); display:grid; place-items:center; font-size:1.1rem; width:34px; height:34px;">${emoji}</div>
      <div>
        <div class="leaderboard-name" style="color:#ffffff;">${user.name}</div>
        <div class="leaderboard-week" style="font-size:0.7rem; color:var(--text-muted);">${user.week}</div>
      </div>
    </div>
    
    <!-- Curriculum Progress Column (Design 2 reference) -->
    <div style="flex: 1; padding: 0 16px; display: flex; align-items: center; gap: 12px; min-width: 150px;">
      <span style="font-size: 0.72rem; color: var(--text-secondary); width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${rankTitle}
      </span>
      <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.04); border-radius: 10px; overflow: hidden; max-width: 180px; position: relative;">
        <div style="width: ${completionPct}%; height: 100%; background: #10b981; border-radius: 10px;"></div>
      </div>
      <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #10b981; width: 35px; text-align: right;">
        ${completionPct}%
      </span>
    </div>

    <div class="leaderboard-streak" style="width: 110px; justify-content: center; color: #f59e0b; font-weight: 700;">🔥 ${user.streak} days</div>
    <div class="leaderboard-xp" style="width: 100px; text-align: center; color: var(--accent-2); font-weight: 700;">${user.xp} XP</div>
    <div style="width: 130px; text-align: right; color: #a78bfa; font-weight: 900; font-family: var(--font-mono); font-size: 0.85rem; padding-right: 8px;">
      ${user.score}
    </div>
  `;
  return row;
}
