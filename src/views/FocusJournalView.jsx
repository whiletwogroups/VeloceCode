import React, { useState, useEffect, useRef } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { getCourseCurriculum } from '../content/courses.js';

export default function FocusJournalView() {
  const { activeCourseId, activeCourseProgress, saveDailyLog, showConfirm } = useRoadmap();
  const curriculum = getCourseCurriculum(activeCourseId);

  // Journal date page navigation
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load journal logs for selected date
  const getLogForDate = (date) => {
    return activeCourseProgress.dailyLogs[date] || {
      learned: false,
      coded: false,
      dsa: false,
      commit: false,
      review: false,
      notes: '',
      focusMinutes: 0
    };
  };

  const activeLog = getLogForDate(selectedDate);

  const toggleChecklist = (field) => {
    saveDailyLog(selectedDate, {
      [field]: !activeLog[field]
    });
  };

  const handleNotesChange = (e) => {
    saveDailyLog(selectedDate, {
      notes: e.target.value
    });
  };

  const insertMarkdownHelper = (prefix, suffix) => {
    const textarea = document.getElementById('log-notes-input');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    
    saveDailyLog(selectedDate, {
      notes: updatedText
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    }, 10);
  };

  // ─── Pomodoro Timer State ───
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Focus');
  const [ambientSound, setAmbientSound] = useState('none');
  const [volume, setVolume] = useState(0.04);

  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Web Audio Synth Player
  const startAmbientNoise = (type, vol) => {
    stopAmbientNoise();
    if (type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (type === 'white' || type === 'rain') {
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'white') {
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
          } else {
            data[i] = (lastOut + (0.12 * white)) / 1.12;
            lastOut = data[i];
            data[i] *= 1.5;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        source.start();
        audioSourceRef.current = source;
      } else if (type === 'synth') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110.0, ctx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110.5, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);

        osc1.start();
        osc2.start();

        audioSourceRef.current = {
          stop: () => {
            try { osc1.stop(); osc2.stop(); } catch(e){}
          }
        };
      }
    } catch(e) {
      console.warn("Failed to initialize audio context:", e);
    }
  };

  const stopAmbientNoise = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e){}
      audioSourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
  };

  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      playTone(523.25, ctx.currentTime, 0.4);
      playTone(659.25, ctx.currentTime + 0.15, 0.4);
      playTone(783.99, ctx.currentTime + 0.3, 0.6);
    } catch (e) {}
  };

  const changeTimerDuration = (mins, label) => {
    pauseTimer();
    setMinutes(mins);
    setSeconds(0);
    setTimerLabel(label);
  };

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);

    if (ambientSound !== 'none') {
      startAmbientNoise(ambientSound, volume);
    }

    let totalSecs = minutes * 60 + seconds;
    const initialDurationMins = Math.round(totalSecs / 60);

    timerRef.current = setInterval(() => {
      if (totalSecs <= 1) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setMinutes(0);
        setSeconds(0);
        playCompletionChime();
        stopAmbientNoise();
        
        // Log study minutes to journal
        const currentMins = activeLog.focusMinutes || 0;
        saveDailyLog(selectedDate, {
          focusMinutes: currentMins + initialDurationMins
        });
        showConfirm(
          "⏱️ Focus Session Completed!",
          `Awesome work! You completed a ${initialDurationMins} minutes study block, which has been automatically logged. Keep grinding!`,
          () => {},
          true
        );
      } else {
        totalSecs--;
        setMinutes(Math.floor(totalSecs / 60));
        setSeconds(totalSecs % 60);
      }
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    stopAmbientNoise();
  };

  const resetTimer = () => {
    pauseTimer();
    setMinutes(25);
    setSeconds(0);
    setTimerLabel('Focus');
  };

  // Update volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stopAmbientNoise();
    };
  }, []);

  const changeSelectedDay = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Compute ring outline offset
  const totalMins = minutes * 60 + seconds;
  const initialSecs = timerLabel === 'Focus' ? 25 * 60 : timerLabel === 'Learn' ? 50 * 60 : timerLabel === 'Rest' ? 5 * 60 : 15 * 60;
  const circumference = 503;
  const strokeOffset = initialSecs ? circumference - (totalMins / initialSecs) * circumference : 0;

  return (
    <div style={{ padding: '0 40px 60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Focus Session & Daily Journal</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>Synthesize background audio, run focus countdown timers, and log daily checklist milestones.</p>
        </div>
      </div>

      <div className="focus-journal-layout" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
        
        {/* LEFT PANEL: Journal checklists & Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Target Checklist */}
          <div className="card" style={{ padding: '22px' }}>
            
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '0.925rem', fontWeight: 800 }}>📋 Daily Checklist</h3>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '20px' }}>
                <button className="btn-secondary" onClick={() => changeSelectedDay(-1)} style={{ border: 'none', background: 'transparent', padding: '2px 8px', fontSize: '0.65rem' }}>◀ Prev</button>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'var(--accent-grad)', padding: '2px 10px', borderRadius: '20px', color: 'white' }}>{selectedDate}</span>
                <button className="btn-secondary" onClick={() => changeSelectedDay(1)} style={{ border: 'none', background: 'transparent', padding: '2px 8px', fontSize: '0.65rem' }}>Next ▶</button>
              </div>
            </div>

            <div className="journal-check-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              <div onClick={() => toggleChecklist('learned')} className={`journal-check-card ${activeLog.learned ? 'done' : ''}`} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={!!activeLog.learned} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>Studied roadmap core deliverables for 1+ hours</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>+10 XP</span>
              </div>

              <div onClick={() => toggleChecklist('coded')} className={`journal-check-card ${activeLog.coded ? 'done' : ''}`} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={!!activeLog.coded} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>Wrote code for at least 2 hours</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>+15 XP</span>
              </div>

              <div onClick={() => toggleChecklist('dsa')} className={`journal-check-card ${activeLog.dsa ? 'done' : ''}`} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={!!activeLog.dsa} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>Solved LeetCode / DSA problem</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>+20 XP</span>
              </div>

              <div onClick={() => toggleChecklist('commit')} className={`journal-check-card ${activeLog.commit ? 'done' : ''}`} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={!!activeLog.commit} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>Made a Git commit (NON-NEGOTIABLE)</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>+10 XP</span>
              </div>

              <div onClick={() => toggleChecklist('review')} className={`journal-check-card ${activeLog.review ? 'done' : ''}`} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={!!activeLog.review} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 600 }}>Completed end-of-day review</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>+10 XP</span>
              </div>

            </div>
          </div>

          {/* Notes Area Editor */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Journal Notes</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => insertMarkdownHelper('**', '**')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>B</button>
                <button onClick={() => insertMarkdownHelper('*', '*')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>I</button>
                <button onClick={() => insertMarkdownHelper('`', '`')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Code</button>
                <button onClick={() => insertMarkdownHelper('```\n', '\n```')} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>Block</button>
              </div>
            </div>

            <textarea 
              id="log-notes-input"
              rows="6"
              value={activeLog.notes}
              onChange={handleNotesChange}
              placeholder="Log what you learned today, resources referred, blocker items resolved..."
              style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '12px', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>

        </div>

        {/* RIGHT PANEL: Pomodoro Focus Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '22px', textAlign: 'center', position: 'relative' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '14px' }}>⏱️ Focus Session Countdown</h3>
            
            {/* Presets Row */}
            <div className="timer-presets" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={() => changeTimerDuration(25, 'Focus')} className={timerLabel === 'Focus' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Focus (25m)</button>
              <button onClick={() => changeTimerDuration(50, 'Learn')} className={timerLabel === 'Learn' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Learn (50m)</button>
              <button onClick={() => changeTimerDuration(5, 'Rest')} className={timerLabel === 'Rest' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Short (5m)</button>
              <button onClick={() => changeTimerDuration(15, 'Break')} className={timerLabel === 'Break' ? 'active' : ''} style={{ fontSize: '11px', padding: '6px 12px' }}>Long (15m)</button>
            </div>

            {/* Circular SVG clock */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '170px', marginBottom: '20px' }}>
              <svg width="170" height="170" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                <circle 
                  cx="90" cy="90" r="80" fill="none" 
                  stroke="url(#timer-gradient)" strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {timerLabel}
                </span>
              </div>
            </div>

            {/* Controls Button trigger */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px' }}>
              {isRunning ? (
                <button onClick={pauseTimer} className="btn-danger" style={{ padding: '8px 24px', fontSize: '0.78rem' }}>Pause</button>
              ) : (
                <button onClick={startTimer} className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.78rem' }}>Start Focus</button>
              )}
              <button onClick={resetTimer} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.78rem' }}>Reset</button>
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Completed sessions log focus hours to your database log: <strong style={{ color: 'var(--success)' }}>{activeLog.focusMinutes} minutes today</strong>.
            </div>
          </div>

          {/* Synth ambient audio */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, marginBottom: '8px' }}>🔊 Ambient Soundscapes</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Select synthesized noise frequencies to isolate your study space.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Audio Frequency:</span>
                <select 
                  value={ambientSound} 
                  onChange={(e) => {
                    setAmbientSound(e.target.value);
                    if (isRunning) startAmbientNoise(e.target.value, volume);
                  }}
                  className="form-select-sm"
                  style={{ width: '130px' }}
                >
                  <option value="none">None (Silence)</option>
                  <option value="white">White Noise 🎚️</option>
                  <option value="rain">Deep Rain 🌧️</option>
                  <option value="synth">Ambient Drone 🪐</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Volume Level:</span>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.1" 
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: '130px', accentColor: 'var(--accent-1)' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
