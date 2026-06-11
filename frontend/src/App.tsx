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

export const App: React.FC = () => {
  // Authentication states
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  // Main navigation view
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // App Tracker States (synced with MongoDB)
  const [startDate, setStartDateState] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [dailyLogs, setDailyLogs] = useState<Record<string, any>>({});
  const [dsaProblems, setDsaProblems] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<Record<string, boolean>>({});

  // Helper trigger to open a specific phase in Roadmap view
  const [openPhaseIndex, setOpenPhaseIndex] = useState<number | null>(null);

  // Fetch state from MongoDB once authenticated
  const fetchProgressState = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/progress`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load progress data');
      }
      const data = await response.json();
      setStartDateState(data.startDate);
      setTasks(data.tasks || {});
      setDailyLogs(data.dailyLogs || {});
      setDsaProblems(data.dsaProblems || []);
      setMilestones(data.milestones || {});
    } catch (error) {
      console.error('Error fetching progress state:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProgressState(token);
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    // Reset state
    setStartDateState(null);
    setTasks({});
    setDailyLogs({});
    setDsaProblems([]);
    setMilestones({});
    setCurrentView('dashboard');
  };

  // Sync state changes to backend
  const syncStateToBackend = async (updates: {
    startDate?: string | null;
    tasks?: Record<string, boolean>;
    dailyLogs?: Record<string, any>;
    dsaProblems?: any[];
    milestones?: Record<string, boolean>;
  }) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to sync progress with database');
      }
      const data = await response.json();
      // Update local state with response values to maintain strict consistency
      if (updates.startDate !== undefined) setStartDateState(data.startDate);
      if (updates.tasks !== undefined) setTasks(data.tasks || {});
      if (updates.dailyLogs !== undefined) setDailyLogs(data.dailyLogs || {});
      if (updates.dsaProblems !== undefined) setDsaProblems(data.dsaProblems || []);
      if (updates.milestones !== undefined) setMilestones(data.milestones || {});
    } catch (error) {
      console.error('Error syncing state to server:', error);
    }
  };

  const setStartDate = async (date: string) => {
    setStartDateState(date);
    await syncStateToBackend({ startDate: date });
  };

  const handleToggleTask = async (taskId: string) => {
    const updatedTasks = {
      ...tasks,
      [taskId]: !tasks[taskId],
    };
    setTasks(updatedTasks);
    await syncStateToBackend({ tasks: updatedTasks });
  };

  const handleToggleMilestone = async (projectId: string, index: number) => {
    const key = `${projectId}-${index}`;
    const updatedMilestones = {
      ...milestones,
      [key]: !milestones[key],
    };
    setMilestones(updatedMilestones);
    await syncStateToBackend({ milestones: updatedMilestones });
  };

  const handleToggleCommitDay = async (dateStr: string) => {
    const log = dailyLogs[dateStr] || {};
    const updatedLogs = {
      ...dailyLogs,
      [dateStr]: {
        ...log,
        commit: !log.commit,
      },
    };
    setDailyLogs(updatedLogs);
    await syncStateToBackend({ dailyLogs: updatedLogs });
  };

  const handleAddProblem = async (
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
    await syncStateToBackend({ dsaProblems: updatedProblems });
  };

  const handleDeleteProblem = async (id: string) => {
    const updatedProblems = dsaProblems.filter((p) => p.id !== id);
    setDsaProblems(updatedProblems);
    await syncStateToBackend({ dsaProblems: updatedProblems });
  };

  const handleSaveLog = async (dateStr: string, logData: any) => {
    const updatedLogs = {
      ...dailyLogs,
      [dateStr]: logData,
    };
    setDailyLogs(updatedLogs);
    await syncStateToBackend({ dailyLogs: updatedLogs });
  };

  const handleOpenPhase = (phaseIdx: number) => {
    setOpenPhaseIndex(phaseIdx);
    setCurrentView('roadmap');
  };

  // Compute Streak for header displays
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
        {/* Animated Background */}
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
      {/* Animated Background */}
      <div className="bg-grid"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        streak={currentStreak}
        username={username}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Header */}
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

      {/* Main Content */}
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
