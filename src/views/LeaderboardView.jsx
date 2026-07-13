import React from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { WEEKLY_AVATARS } from '../services/state.js';

export default function LeaderboardView() {
  const { currentUser, state, getWeeklyAvatar } = useRoadmap();

  // Compute current user's XP
  const calculateUserXP = () => {
    let xp = 0;
    Object.values(state.courses).forEach(c => {
      if (c.tasks) xp += Object.values(c.tasks).filter(Boolean).length * 10;
      if (c.milestones) xp += Object.values(c.milestones).filter(Boolean).length * 15;
    });
    if (state.dsaProblems) xp += state.dsaProblems.length * 20;
    return xp;
  };

  const userXP = calculateUserXP();
  const userLevel = Math.floor(userXP / 200) + 1;

  // Helper to resolve candidates weekly progress avatars
  const getCandidateAvatar = (level) => {
    const index = Math.min(level - 1, WEEKLY_AVATARS.length - 1);
    return WEEKLY_AVATARS[index]?.emoji || '💻';
  };

  // Candidates list
  const candidates = [
    { name: 'Emily Chen', avatar: getCandidateAvatar(32), rank: 1, level: 32, xp: 6420, active: true },
    { name: 'Alex Rivera', avatar: getCandidateAvatar(29), rank: 2, level: 29, xp: 5890, active: true },
    { name: 'Sarah Jenkins', avatar: getCandidateAvatar(27), rank: 3, level: 27, xp: 5410, active: true },
    { name: 'Michael Zhao', avatar: getCandidateAvatar(25), rank: 4, level: 25, xp: 5080, active: false },
    { name: 'Elena Rostova', avatar: getCandidateAvatar(24), rank: 5, level: 24, xp: 4850, active: true },
    { name: 'David Kim', avatar: getCandidateAvatar(22), rank: 6, level: 22, xp: 4420, active: false }
  ];

  // Merge current user dynamically into leaderboard
  const username = currentUser ? (currentUser.displayName || currentUser.email.split('@')[0]) : 'Guest Coder';
  const userObj = {
    name: `${username} (You)`,
    avatar: getWeeklyAvatar().emoji,
    rank: 0, // calculated below
    level: userLevel,
    xp: userXP,
    active: true,
    isSelf: true
  };

  // Insert user and sort by XP
  const list = [...candidates, userObj].sort((a, b) => b.xp - a.xp);
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Podium candidates (1st, 2nd, 3rd)
  const first = list.find(c => c.rank === 1);
  const second = list.find(c => c.rank === 2);
  const third = list.find(c => c.rank === 3);

  // Remaining candidates list
  const rows = list.filter(c => c.rank > 3);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥇 GOLD</span>;
    if (rank === 2) return <span style={{ background: '#94a3b8', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥈 SILVER</span>;
    if (rank === 3) return <span style={{ background: '#b45309', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥉 BRONZE</span>;
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 800 }}>#{rank}</span>;
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Global Leaderboard</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Compare progress, streak scores, and total XP with other software engineer candidates.</p>
        </div>
      </div>

      {/* Podium Cards Section: Uniform square cards */}
      <div id="leaderboard-podium" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
        
        {/* SECOND PLACE */}
        {second && (
          <div className="podium-card" style={{ border: second.isSelf ? '2px solid var(--accent-1)' : '2px solid rgba(255,255,255,0.05)' }}>
            <div className="podium-badge second">2</div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{second.avatar}</div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', margin: '0 0 4px 0', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {second.name}
            </h4>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Level {second.level} Coder</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-2)' }}>
              ⚡ {second.xp} XP
            </div>
          </div>
        )}

        {/* FIRST PLACE */}
        {first && (
          <div className="podium-card first" style={{ border: first.isSelf ? '2px solid var(--accent-1)' : '2px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.08)' }}>
            <div className="podium-badge first">1</div>
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{first.avatar}</div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b', margin: '0 0 4px 0', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {first.name}
            </h4>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Level {first.level} Coder</div>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b' }}>
              ⚡ {first.xp} XP
            </div>
          </div>
        )}

        {/* THIRD PLACE */}
        {third && (
          <div className="podium-card" style={{ border: third.isSelf ? '2px solid var(--accent-1)' : '2px solid rgba(255,255,255,0.05)' }}>
            <div className="podium-badge third">3</div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{third.avatar}</div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', margin: '0 0 4px 0', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {third.name}
            </h4>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Level {third.level} Coder</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-3)' }}>
              ⚡ {third.xp} XP
            </div>
          </div>
        )}

      </div>

      {/* Standing Rows list */}
      <div className="card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Rankings Standing</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rows.map(item => (
            <div 
              key={item.rank} 
              className="leaderboard-row" 
              style={{ 
                display: 'grid', gridTemplateColumns: '80px 40px 1.5fr 1fr 1fr', gap: '12px', 
                alignItems: 'center', padding: '12px 16px', borderRadius: '8px',
                background: item.isSelf ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.01)',
                border: item.isSelf ? '1.5px solid var(--accent-1)' : '1px solid var(--border)'
              }}
            >
              <div>{getRankBadge(item.rank)}</div>
              <div style={{ fontSize: '1.2rem', textAlign: 'center' }}>{item.avatar}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>{item.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Level {item.level} Coder</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-1)', textAlign: 'right' }}>
                ⚡ {item.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
