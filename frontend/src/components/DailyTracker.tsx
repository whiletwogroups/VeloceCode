import React, { useState, useEffect } from 'react';
import { ROADMAP, PHASE_COLORS } from '../data';

interface DailyTrackerProps {
  startDate: string | null;
  dailyLogs: Record<string, {
    learned?: boolean;
    coded?: boolean;
    dsa?: boolean;
    commit?: boolean;
    review?: boolean;
    notes?: string;
  }>;
  onSaveLog: (dateStr: string, logData: any) => Promise<void>;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  startDate,
  dailyLogs,
  onSaveLog,
}) => {
  const [learned, setLearned] = useState(false);
  const [coded, setCoded] = useState(false);
  const [dsa, setDsa] = useState(false);
  const [commit, setCommit] = useState(false);
  const [review, setReview] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedVisible, setSavedVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const log = dailyLogs[todayStr] || {};
    setLearned(!!log.learned);
    setCoded(!!log.coded);
    setDsa(!!log.dsa);
    setCommit(!!log.commit);
    setReview(!!log.review);
    setNotes(log.notes || '');
  }, [dailyLogs, todayStr]);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayNumber = () => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return diff + 1; // day 1 on start date
  };

  const dayNum = getDayNumber();

  const handleSave = async () => {
    setSaving(true);
    const logData = {
      learned,
      coded,
      dsa,
      commit,
      review,
      notes,
    };
    await onSaveLog(todayStr, logData);
    setSaving(false);
    setSavedVisible(true);
    setTimeout(() => setSavedVisible(false), 2500);
  };

  const renderTodayFocus = () => {
    if (!startDate || !dayNum || dayNum < 1 || dayNum > 180) {
      return (
        <div className="today-empty">
          <div style={{ fontSize: '2.5rem' }}>📅</div>
          <p>Set your start date on the Dashboard to see today's tasks.</p>
        </div>
      );
    }

    // Map dayNum to Phase, Week, Day index in ROADMAP
    let targetPhaseIndex = null;
    let targetWeekIndex = null;
    let targetDayIndex = null;
    let currentDayCount = 0;

    outerLoop: for (let pi = 0; pi < ROADMAP.length; pi++) {
      const phase = ROADMAP[pi];
      for (let wi = 0; wi < phase.weeks_data.length; wi++) {
        const week = phase.weeks_data[wi];
        for (let di = 0; di < week.days.length; di++) {
          currentDayCount++;
          if (currentDayCount === dayNum) {
            targetPhaseIndex = pi;
            targetWeekIndex = wi;
            targetDayIndex = di;
            break outerLoop;
          }
        }
      }
    }

    if (targetPhaseIndex !== null && targetWeekIndex !== null && targetDayIndex !== null) {
      const phase = ROADMAP[targetPhaseIndex];
      const week = phase.weeks_data[targetWeekIndex];
      const day = week.days[targetDayIndex];
      const c = PHASE_COLORS[targetPhaseIndex + 1];

      return (
        <div>
          <div style={{ marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Phase {targetPhaseIndex + 1} · {phase.title} · {week.title}
          </div>
          <div className="today-task-grid">
            <div className="today-task-box">
              <div className="today-task-box-label" style={{ color: c.text }}>
                📚 9:30–12:30 LEARN
              </div>
              <div className="today-task-box-text">{day.learn}</div>
            </div>
            <div className="today-task-box">
              <div className="today-task-box-label" style={{ color: c.text }}>
                💻 13:30–17:00 BUILD
              </div>
              <div className="today-task-box-text">{day.build}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="today-empty">
          <div style={{ fontSize: '2.5rem' }}>🎉</div>
          <p>Journey complete! You've done all 180 days.</p>
        </div>
      );
    }
  };

  return (
    <div className="view active" id="view-daily">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Daily Tracker</h1>
          <p>Your day-by-day schedule. Every. Single. Day.</p>
        </div>
      </div>

      {/* Timetable */}
      <div className="timetable-card">
        <div className="card-header">
          <h3>⏰ Your Daily Timetable (Non-Negotiable)</h3>
        </div>
        <div className="timetable-grid">
          <div className="timetable-row">
            <div className="time-slot">09:00 – 09:30</div>
            <div className="time-activity dsa-slot">
              <div className="time-tag">DSA</div>
              <p>2 LeetCode problems (Phase 3+) · Concept review (Phase 1–2)</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">09:30 – 10:30</div>
            <div className="time-activity learn-slot">
              <div className="time-tag">LEARN</div>
              <p>Study concept, read docs, take notes</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">10:30 – 10:45</div>
            <div className="time-activity break-slot">
              <div className="time-tag">BREAK</div>
              <p>Walk, water, no phone 🚶</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">10:45 – 12:30</div>
            <div className="time-activity code-slot">
              <div className="time-tag">CODE</div>
              <p>Write code based on what you learned</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">12:30 – 13:30</div>
            <div className="time-activity lunch-slot">
              <div className="time-tag">LUNCH</div>
              <p>Full break. Rest your brain 🍽️</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">13:30 – 15:30</div>
            <div className="time-activity build-slot">
              <div className="time-tag">BUILD</div>
              <p>Work on your current project</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">15:30 – 15:45</div>
            <div className="time-activity break-slot">
              <div className="time-tag">BREAK</div>
              <p>Short break ☕</p>
            </div>
          </div>
          <div className="timetable-row">
            <div className="time-slot">15:45 – 17:00</div>
            <div className="time-activity review-slot">
              <div className="time-tag">REVIEW</div>
              <p>Fix bugs · Explain out loud · Git commit · Plan tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="today-section">
        <div className="card-header">
          <h3>📋 Today's Focus</h3>
          <span className="today-day-badge">
            {dayNum ? `Day ${dayNum}` : 'Day —'}
          </span>
        </div>
        <div className="today-task-card">{renderTodayFocus()}</div>
      </div>

      {/* Log Today */}
      <div className="card log-card">
        <div className="card-header">
          <h3>📝 Daily Log</h3>
          <span className="log-date">{formatDate(new Date())}</span>
        </div>

        <div className="log-checklist">
          {[
            { id: 'learned', label: "Completed today's learning session", value: learned, setter: setLearned },
            { id: 'coded', label: 'Wrote code for at least 2 hours', value: coded, setter: setCoded },
            { id: 'dsa', label: 'Solved DSA problem(s)', value: dsa, setter: setDsa },
            { id: 'commit', label: '🔴 Made a Git commit (NON-NEGOTIABLE)', value: commit, setter: setCommit },
            { id: 'review', label: 'Did end-of-day review + explained concept out loud', value: review, setter: setReview },
          ].map((item) => (
            <label key={item.id} className="log-item">
              <input
                type="checkbox"
                id={`log-${item.id}`}
                className="log-check"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
              />
              <span className="log-check-custom"></span>
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <div className="log-notes">
          <textarea
            id="log-notes-input"
            placeholder="Notes for today... What did you learn? What was hard? What will you do differently tomorrow?"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : "💾 Save Today's Log"}
        </button>

        <div className={`log-saved-msg ${savedVisible ? 'visible' : ''}`} id="log-saved-msg">
          ✅ Saved!
        </div>
      </div>
    </div>
  );
};
