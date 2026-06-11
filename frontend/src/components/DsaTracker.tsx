import React, { useState } from 'react';
import { PHASE_COLORS } from '../data';

interface DsaProblem {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  phase: string;
  topic: string;
  date: string;
}

interface DsaTrackerProps {
  dsaProblems: DsaProblem[];
  onAddProblem: (name: string, difficulty: 'easy' | 'medium' | 'hard', phase: string, topic: string) => Promise<void>;
  onDeleteProblem: (id: string) => Promise<void>;
}

export const DsaTracker: React.FC<DsaTrackerProps> = ({
  dsaProblems,
  onAddProblem,
  onDeleteProblem,
}) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [phase, setPhase] = useState('2');
  const [topic, setTopic] = useState('arrays');

  const [filterPhase, setFilterPhase] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAddProblem(name.trim(), difficulty, phase, topic);
    setName('');
  };

  const getDsaCounts = () => {
    const counts: Record<string, number> = { '2': 0, '3': 0, '4': 0, '5': 0 };
    dsaProblems.forEach((p) => {
      if (counts[p.phase] !== undefined) counts[p.phase]++;
    });
    return counts;
  };

  const counts = getDsaCounts();
  const total = dsaProblems.length;

  const phaseTargets = { '2': 60, '3': 80, '4': 60, '5': 30 };
  const phaseLabels: Record<string, string> = {
    '2': 'Phase 2 (Weeks 4–6)',
    '3': 'Phase 3 (Weeks 7–14)',
    '4': 'Phase 4 (Weeks 15–20)',
    '5': 'Phase 5+ (Weeks 21–36)',
  };
  const phaseColors: Record<string, string> = {
    '2': PHASE_COLORS[2].accent,
    '3': PHASE_COLORS[3].accent,
    '4': PHASE_COLORS[4].accent,
    '5': PHASE_COLORS[5].accent,
  };

  const filteredProblems = dsaProblems.filter((p) => {
    if (filterPhase !== 'all' && p.phase !== filterPhase) return false;
    if (filterDiff !== 'all' && p.difficulty !== filterDiff) return false;
    return true;
  });

  return (
    <div className="view active" id="view-dsa">
      <div className="page-header">
        <div className="page-header-text">
          <h1>DSA Problem Tracker</h1>
          <p>Target: 230 problems across 36 weeks. Filter, log, track.</p>
        </div>
        <div className="dsa-total-display">
          <span id="dsa-total-big">{total}</span> / 230
        </div>
      </div>

      {/* Log a Problem */}
      <div className="card add-problem-card">
        <div className="card-header">
          <h3>➕ Log a Problem</h3>
        </div>
        <form onSubmit={handleAdd} className="add-problem-form">
          <input
            type="text"
            placeholder="Problem name (e.g. Two Sum)"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
          >
            <option value="easy">Easy 🟢</option>
            <option value="medium">Medium 🟡</option>
            <option value="hard">Hard 🔴</option>
          </select>
          <select
            className="form-select"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          >
            <option value="2">Phase 2 (Weeks 4–6)</option>
            <option value="3">Phase 3 (Weeks 7–14)</option>
            <option value="4">Phase 4 (Weeks 15–20)</option>
            <option value="5">Phase 5+ (Weeks 21–36)</option>
          </select>
          <select
            className="form-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
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
          <button type="submit" className="btn-primary">
            Add Problem
          </button>
        </form>
      </div>

      {/* Phase progress cards */}
      <div className="dsa-phase-progress">
        {['2', '3', '4', '5'].map((ph) => {
          const done = counts[ph] || 0;
          const target = phaseTargets[ph as '2' | '3' | '4' | '5'];
          const pct = Math.min(100, Math.round((done / target) * 100));

          return (
            <div key={ph} className="dsa-phase-card">
              <div className="dsa-phase-card-name" style={{ color: phaseColors[ph] }}>
                {phaseLabels[ph]}
              </div>
              <div className="dsa-phase-card-nums">
                <span className="dsa-phase-card-done" style={{ color: phaseColors[ph] }}>
                  {done}
                </span>
                <span className="dsa-phase-card-total">/ {target}</span>
              </div>
              <div className="dsa-phase-bar">
                <div
                  className="dsa-phase-bar-fill"
                  style={{ width: `${pct}%`, background: phaseColors[ph] }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Problem log list card */}
      <div className="card">
        <div className="card-header">
          <h3>Problem Log</h3>
          <div className="dsa-filter-row">
            <select
              className="form-select-sm"
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
            >
              <option value="all">All Phases</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
              <option value="5">Phase 5+</option>
            </select>
            <select
              className="form-select-sm"
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="problem-list">
          {filteredProblems.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '2.5rem' }}>🧩</div>
              <p>No problems match your filters yet.</p>
            </div>
          ) : (
            filteredProblems.map((p, index) => (
              <div key={p.id} className="problem-item">
                <span className="problem-num">#{index + 1}</span>
                <span className="problem-name">{p.name}</span>
                <span className={`problem-diff diff-${p.difficulty}`}>
                  {p.difficulty === 'easy' ? '🟢 Easy' : p.difficulty === 'medium' ? '🟡 Med' : '🔴 Hard'}
                </span>
                <span className="problem-topic">{p.topic}</span>
                <span className="problem-phase">P{p.phase}</span>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDeleteProblem(p.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
