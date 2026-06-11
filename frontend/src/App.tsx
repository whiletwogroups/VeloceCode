import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Roadmap } from './components/Roadmap';
import { DailyTracker } from './components/DailyTracker';
import { DsaTracker } from './components/DsaTracker';
import { Projects } from './components/Projects';
import { Rules } from './components/Rules';

const API_URL = 'http://localhost:5000/api';

// Per-user localStorage key for progress data (used in offline mode)
const getStorageKey = (user: string) => `devroad-progress-${user}`;

export const App: React.FC = () => {
  // Authentication states
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [isOffline, setIsOffline] = useState<boolean>(localStorage.getItem('isOffline') === 'true');

  // Main navigation view
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // App Tracker States
  const [startDate, setStartDateState] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [dailyLogs, setDailyLogs] = useState<Record<string, any>>({});
  const [dsaProblems, setDsaProblems] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<Record<string, boolean>>({});

  // Helper trigger to open a specific phase in Roadmap view
  const [openPhaseIndex, setOpenPhaseIndex] = useState<number | null>(null);

  // ── Load progress (API or localStorage) ────────────────────────────────
  const fetchProgressState = async (authToken: string, user: string, offline: boolean) => {
    if (offline) {
      // Load from localStorage
      const raw = localStorage.getItem(getStorageKey(user));
      if (raw) {
        try {
          const data = JSON.parse(raw);
          setStartDateState(data.startDate || null);
          setTasks(data.tasks || {});
          setDailyLogs(data.dailyLogs || {});
          setDsaProblems(data.dsaProblems || []);
          setMilestones(data.milestones || {});
        } catch {
          console.warn('Failed to parse saved progress');
        }
      }
      return;
    }

    // Try backend API
    try {
      const response = await fetch(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error('Failed to load progress');
      const data = await response.json();
      setStartDateState(data.startDate);
      setTasks(data.tasks || {});
      setDailyLogs(data.dailyLogs || {});
      setDsaProblems(data.dsaProblems || []);
      setMilestones(data.milestones || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    if (token && username) {
      fetchProgressState(token, username, isOffline);
    }
  }, [token, username, isOffline]);

  const handleAuthSuccess = (newToken: string, newUsername: string, offline: boolean) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('isOffline', offline ? 'true' : 'false');
    setToken(newToken);
    setUsername(newUsername);
    setIsOffline(offline);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isOffline');
    setToken(null);
    setUsername(null);
    setIsOffline(false);
    setStartDateState(null);
    setTasks({});
    setDailyLogs({});
    setDsaProblems([]);
    setMilestones({});
    setCurrentView('dashboard');
  };

  // ── Save progress (API or localStorage) ────────────────────────────────
  const syncProgress = async (updates: {
    startDate?: string | null;
    tasks?: Record<string, boolean>;
    dailyLogs?: Record<string, any>;
    dsaProblems?: any[];
    milestones?: Record<string, boolean>;
  }) => {
    if (!token || !username) return;

    if (isOffline) {
      // Save to localStorage
      const key = getStorageKey(username);
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : {};
      const merged = { ...existing, ...updates };
      localStorage.setItem(key, JSON.stringify(merged));

      if (updates.startDate !== undefined) setStartDateState(updates.startDate);
      if (updates.tasks !== undefined) setTasks(updates.tasks);
      if (updates.dailyLogs !== undefined) setDailyLogs(updates.dailyLogs);
      if (updates.dsaProblems !== undefined) setDsaProblems(updates.dsaProblems);
      if (updates.milestones !== undefined) setMilestones(updates.milestones);
      return;
    }

    // Try backend API
    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to sync progress');
      const data = await response.json();
      if (updates.startDate !== undefined) setStartDateState(data.startDate);
      if (updates.tasks !== undefined) setTasks(data.tasks || {});
      if (updates.dailyLogs !== undefined) setDailyLogs(data.dailyLogs || {});
      if (updates.dsaProblems !== undefined) setDsaProblems(data.dsaProblems || []);
      if (updates.milestones !== undefined) setMilestones(data.milestones || {});
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  const setStartDate = (date: string) => {
    setStartDateState(date);
    syncProgress({ startDate: date });
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = { ...tasks, [taskId]: !tasks[taskId] };
    setTasks(updatedTasks);
    syncProgress({ tasks: updatedTasks });
  };

  const handleToggleMilestone = (projectId: string, index: number) => {
    const key = `${projectId}-${index}`;
    const updatedMilestones = { ...milestones, [key]: !milestones[key] };
    setMilestones(updatedMilestones);
    syncProgress({ milestones: updatedMilestones });
  };

  const handleToggleCommitDay = (dateStr: string) => {
    const log = dailyLogs[dateStr] || {};
    const updatedLogs = { ...dailyLogs, [dateStr]: { ...log, commit: !log.commit } };
    setDailyLogs(updatedLogs);
    syncProgress({ dailyLogs: updatedLogs });
  };

  const handleAddProblem = (
    name: string,
    difficulty: 'easy' | 'medium' | 'hard',
    phase: string,
    topic: string
  ) => {
    const newProblem = {
      id: Date.now().toString(),
      name,
      difficulty,
      phase,
      topic,
      date: new Date().toISOString().split('T')[0],
    };
    const updatedProblems = [...dsaProblems, newProblem];
    setDsaProblems(updatedProblems);
    syncProgress({ dsaProblems: updatedProblems });
  };

  const handleDeleteProblem = (id: string) => {
    const updatedProblems = dsaProblems.filter((p) => p.id !== id);
    setDsaProblems(updatedProblems);
    syncProgress({ dsaProblems: updatedProblems });
  };

  const handleSaveLog = (dateStr: string, logData: any) => {
    const updatedLogs = { ...dailyLogs, [dateStr]: logData };
    setDailyLogs(updatedLogs);
    syncProgress({ dailyLogs: updatedLogs });
  };

  const handleOpenPhase = (phaseIdx: number) => {
    setOpenPhaseIndex(phaseIdx);
    setCurrentView('roadmap');
  };

  const computeStreak = () => {
    let streak = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (true) {
      const k = d.toISOString().split('T')[0];
      const log = dailyLogs[k];
      if (log && log.commit) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = computeStreak();

  if (!token || !username) {
    return (
      <>
        <div className="bg-grid"></div>
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <Auth onAuthSuccess={handleAuthSuccess} apiUrl={API_URL} />
      </>
    );
  }

  return (
    <>
      <div className="bg-grid"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Offline mode banner */}
      {isOffline && (
        <div className="demo-banner">
          <span>📡 Offline Mode</span> — Backend unreachable. Data saved locally in your browser.
          <button className="demo-banner-dismiss" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}

      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        streak={currentStreak}
        username={username}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <header className="mobile-header">
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span className="mobile-logo">⚡ DevRoadmap</span>
        <div className="mobile-streak">🔥 {currentStreak}</div>
      </header>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            startDate={startDate}
            setStartDate={setStartDate}
            tasks={tasks}
            dailyLogs={dailyLogs}
            onToggleCommitDay={handleToggleCommitDay}
            dsaProblems={dsaProblems}
            onOpenPhase={handleOpenPhase}
          />
        )}
        {currentView === 'roadmap' && (
          <Roadmap
            tasks={tasks}
            onToggleTask={handleToggleTask}
            openPhaseIndex={openPhaseIndex}
            setOpenPhaseIndex={setOpenPhaseIndex}
          />
        )}
        {currentView === 'daily' && (
          <DailyTracker
            startDate={startDate}
            dailyLogs={dailyLogs}
            onSaveLog={handleSaveLog}
          />
        )}
        {currentView === 'dsa' && (
          <DsaTracker
            dsaProblems={dsaProblems}
            onAddProblem={handleAddProblem}
            onDeleteProblem={handleDeleteProblem}
          />
        )}
        {currentView === 'projects' && (
          <Projects milestones={milestones} onToggleMilestone={handleToggleMilestone} />
        )}
        {currentView === 'rules' && <Rules />}
      </main>
    </>
  );
};
export default App;
