import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { triggerConfetti } from '../utils/confetti.js';

export default function DsaTrackerView() {
  const { state, addDsaProblem, removeDsaProblem, showConfirm, showToast } = useRoadmap();
  
  const problems = state.dsaProblems || [];

  // Input states
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [phase, setPhase] = useState('3');
  const [topic, setTopic] = useState('arrays');

  // Filter states
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');

  const handleAddProblem = (e) => {
    e.preventDefault();
    if (!problemName.trim()) {
      showToast("⚠️ Please enter a problem name.", "warning");
      return;
    }

    const newProblem = {
      id: `dsa-${Date.now()}`,
      name: problemName.trim(),
      difficulty,
      phase: parseInt(phase),
      topic,
      date: new Date().toISOString().split('T')[0]
    };

    addDsaProblem(newProblem);
    setProblemName('');
    triggerConfetti();
    showToast(`🟢 Problem "${newProblem.name}" logged successfully! (+20 XP)`, "success");
  };

  // Phase targets count
  const getPhaseCounts = () => {
    const counts = { 2: 0, 3: 0, 4: 0, 5: 0 };
    problems.forEach(p => {
      const ph = p.phase >= 5 ? 5 : p.phase;
      if (counts[ph] !== undefined) counts[ph]++;
    });
    return counts;
  };

  const counts = getPhaseCounts();

  const phaseTargets = {
    2: { name: 'Phase 2 (Basic Algorithm Prep)', target: 60, current: counts[2] },
    3: { name: 'Phase 3 (Core Structures Grind)', target: 80, current: counts[3] },
    4: { name: 'Phase 4 (Advanced Logic Layouts)', target: 60, current: counts[4] },
    5: { name: 'Phase 5+ (Design Patterns & Systems)', target: 30, current: counts[5] }
  };

  const filteredProblems = problems.filter(p => {
    const matchesPhase = filterPhase === 'all' || p.phase.toString() === filterPhase;
    const matchesDiff = filterDiff === 'all' || p.difficulty === filterDiff;
    return matchesPhase && matchesDiff;
  });

  const getDifficultyEmojiBadge = (diff) => {
    if (diff === 'easy') return <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.68rem' }}>Easy 🟢</span>;
    if (diff === 'medium') return <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.68rem' }}>Medium 🟡</span>;
    return <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.68rem' }}>Hard 🔴</span>;
  };

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>DSA Problems Tracker</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Grind targets: complete 230 challenges across development phases.</p>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          <span style={{ color: 'var(--accent-3)' }}>{problems.length}</span> / 230 Completed
        </div>
      </div>

      {/* Add Problem Form card */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '12px' }}>➕ Log a Problem</h3>
        
        <form onSubmit={handleAddProblem} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Problem name (e.g. Two Sum)" 
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            className="form-input" 
            style={{ flex: 1, minWidth: '200px' }}
          />

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="form-select" style={{ width: '120px' }}>
            <option value="easy">Easy 🟢</option>
            <option value="medium">Medium 🟡</option>
            <option value="hard">Hard 🔴</option>
          </select>

          <select value={phase} onChange={(e) => setPhase(e.target.value)} className="form-select" style={{ width: '160px' }}>
            <option value="2">Phase 2 (Weeks 4–6)</option>
            <option value="3">Phase 3 (Weeks 7–14)</option>
            <option value="4">Phase 4 (Weeks 15–20)</option>
            <option value="5">Phase 5+ (Weeks 21–36)</option>
          </select>

          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="form-select" style={{ width: '140px' }}>
            <option value="arrays">Arrays</option>
            <option value="strings">Strings</option>
            <option value="hashmaps">Hash Maps</option>
            <option value="linkedlist">Linked Lists</option>
            <option value="trees">Trees</option>
            <option value="stacks">Stacks & Queues</option>
            <option value="dp">Dynamic Programming</option>
            <option value="graphs">Graphs</option>
            <option value="binary-search">Binary Search</option>
            <option value="sliding-window">Sliding Window</option>
            <option value="two-pointers">Two Pointers</option>
            <option value="other">Other</option>
          </select>

          <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>Add Problem</button>
        </form>
      </div>

      {/* Phase Target Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {Object.entries(phaseTargets).map(([key, target]) => {
          const progressPct = Math.min(100, Math.round((target.current / target.target) * 100));
          return (
            <div key={key} className="card" style={{ padding: '16px', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ color: 'white', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{target.name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{target.current} / {target.target}</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--accent-grad)' }}></div>
              </div>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{progressPct}% Completion Target</span>
            </div>
          );
        })}
      </div>

      {/* Logged Problems Register */}
      <div className="card" style={{ padding: '22px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '0.925rem', fontWeight: 800 }}>DSA Logged Register</h3>
          
          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="form-select-sm" style={{ width: '110px' }}>
              <option value="all">All Phases</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
              <option value="5">Phase 5+</option>
            </select>
            
            <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)} className="form-select-sm" style={{ width: '120px' }}>
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems list */}
        {filteredProblems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            No problem logs found matching the active filter categories.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProblems.map(p => (
              <div 
                key={p.id} 
                className="problem-row" 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '10px 14px', background: 'rgba(255,255,255,0.015)', 
                  border: '1px solid var(--border)', borderRadius: '6px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="tech-tag" style={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>{p.topic}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white' }}>{p.name}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {getDifficultyEmojiBadge(p.difficulty)}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Phase {p.phase}</span>
                  <button 
                    onClick={() => {
                      showConfirm(
                        "🗑️ Remove Problem Log",
                        `Are you sure you want to delete the log for "${p.name}"? This will update your status values.`,
                        () => {
                          removeDsaProblem(p.id);
                          showToast("🗑️ Log deleted successfully", "info");
                        }
                      );
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                    title="Delete Log"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
