import React, { useState, useEffect } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { WEEKLY_AVATARS } from '../services/state.js';
import { db, hasFirebaseCredentials } from '../services/firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

export default function LeaderboardView() {
  const { currentUser, state, getWeeklyAvatar } = useRoadmap();
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compute XP for any user state block
  const calculateXPForState = (userState) => {
    let xp = 0;
    if (userState.courses) {
      Object.values(userState.courses).forEach(c => {
        if (c.tasks) xp += Object.values(c.tasks).filter(Boolean).length * 10;
        if (c.milestones) xp += Object.values(c.milestones).filter(Boolean).length * 15;
      });
    }
    if (userState.dsaProblems) {
      xp += userState.dsaProblems.length * 20;
    }
    return xp;
  };

  // Helper to resolve candidates weekly progress avatars
  const getCandidateAvatar = (level) => {
    const index = Math.min(level - 1, WEEKLY_AVATARS.length - 1);
    return WEEKLY_AVATARS[index]?.emoji || '💻';
  };

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const mergedList = [];
      const currentUserName = currentUser ? (currentUser.displayName || currentUser.email.split('@')[0]) : 'Guest Coder';
      const currentUserEmail = currentUser ? currentUser.email : 'guest';

      // 1. Fetch from Firestore if enabled
      if (hasFirebaseCredentials && db) {
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach((doc) => {
          const uState = doc.data();
          const email = uState.email || doc.id;
          const isSelf = currentUser && (currentUser.uid === doc.id || currentUser.email === email);
          
          let xp = 0;
          let level = 1;
          let username = uState.username || email.split('@')[0];

          if (isSelf) {
            xp = calculateXPForState(state);
            level = Math.floor(xp / 200) + 1;
            username = currentUserName;
          } else {
            xp = calculateXPForState(uState);
            level = Math.floor(xp / 200) + 1;
          }

          mergedList.push({
            name: isSelf ? `${username} (You)` : username,
            avatar: getCandidateAvatar(level),
            level,
            xp,
            isSelf
          });
        });
      } else {
        // 2. Fetch from LocalStorage localUsers if Firestore is offline
        const usersKey = 'devRoadmap_localUsers';
        const localUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
        const processedEmails = new Set();

        localUsers.forEach(user => {
          const email = user.email;
          processedEmails.add(email);

          const isSelf = currentUser && currentUser.email === email;
          const storageKey = `devRoadmap_state_local_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
          const raw = localStorage.getItem(storageKey);
          
          let xp = 0;
          let level = 1;
          let username = user.username;

          if (isSelf) {
            xp = calculateXPForState(state);
            level = Math.floor(xp / 200) + 1;
            username = currentUserName;
          } else if (raw) {
            try {
              const uState = JSON.parse(raw);
              xp = calculateXPForState(uState);
              level = Math.floor(xp / 200) + 1;
            } catch (e) {}
          }

          mergedList.push({
            name: isSelf ? `${username} (You)` : username,
            avatar: getCandidateAvatar(level),
            level,
            xp,
            isSelf
          });
        });

        // Add self guest if not present in the local database list
        if (currentUser && !processedEmails.has(currentUser.email)) {
          const xp = calculateXPForState(state);
          const level = Math.floor(xp / 200) + 1;
          mergedList.push({
            name: `${currentUserName} (You)`,
            avatar: getCandidateAvatar(level),
            level,
            xp,
            isSelf: true
          });
        }
      }

      // 3. Fallback candidates to prevent empty board for single offline developer
      const defaultCandidates = [
        { name: 'Emily Chen', level: 32, xp: 6420 },
        { name: 'Alex Rivera', level: 29, xp: 5890 },
        { name: 'Sarah Jenkins', level: 27, xp: 5410 },
        { name: 'Michael Zhao', level: 25, xp: 5080 },
        { name: 'Elena Rostova', level: 24, xp: 4850 },
        { name: 'David Kim', level: 22, xp: 4420 }
      ];

      defaultCandidates.forEach(cand => {
        if (!mergedList.some(u => u.name.replace(' (You)', '') === cand.name)) {
          mergedList.push({
            name: cand.name,
            avatar: getCandidateAvatar(cand.level),
            level: cand.level,
            xp: cand.xp,
            isSelf: false
          });
        }
      });

      // Sort by XP
      mergedList.sort((a, b) => b.xp - a.xp);

      // Recalculate rank indices
      mergedList.forEach((item, index) => {
        item.rank = index + 1;
      });

      setLeaderboardList(mergedList);
    } catch (err) {
      console.error("Failed to query leaderboard values:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [state]); // Triggers load on component mount and when local user state updates

  const first = leaderboardList.find(c => c.rank === 1);
  const second = leaderboardList.find(c => c.rank === 2);
  const third = leaderboardList.find(c => c.rank === 3);
  const rows = leaderboardList.filter(c => c.rank > 3);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥇 GOLD</span>;
    if (rank === 2) return <span style={{ background: '#94a3b8', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥈 SILVER</span>;
    if (rank === 3) return <span style={{ background: '#b45309', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 800 }}>🥉 BRONZE</span>;
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 800 }}>#{rank}</span>;
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Global Leaderboard</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Compare progress, streak scores, and total XP with other software engineer candidates.</p>
        </div>
        <button 
          onClick={fetchLeaderboardData} 
          className="btn-secondary" 
          disabled={loading}
          style={{ padding: '6px 14px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {loading ? '⏳ Synced' : '🔄 Sync Leaderboard'}
        </button>
      </div>

      {loading && leaderboardList.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔄</div>
          <span>Synchronizing live candidate rankings database...</span>
        </div>
      ) : (
        <>
          {/* Podium Cards Section */}
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
        </>
      )}

    </div>
  );
}
