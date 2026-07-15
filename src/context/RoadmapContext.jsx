import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { COURSES, getCourseCurriculum } from '../content/courses.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { auth, db, hasFirebaseCredentials } from '../services/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { checkRateLimit, validateAndSanitizeDailyLog, validateAndSanitizeDsaProblem, sanitizeString } from '../utils/security.js';
import { WEEKLY_AVATARS } from '../services/state.js';

const RoadmapContext = createContext();

const DEFAULT_STATE = {
  activeCourseId: 'webdev',
  courses: {},
  selectedTheme: 'ember',
  selectedFont: 'public',
  avatarColor: null,
  avatarMode: 'weekly',
  customAvatarImg: ''
};

export const RoadmapProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(DEFAULT_STATE);

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [dialog, setDialog] = useState({ show: false, title: '', message: '', onConfirm: null, confirmOnly: false });

  // ─── Pomodoro Timer State ───
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Focus');
  const [ambientSound, setAmbientSound] = useState('none');
  const [timerVolume, setTimerVolume] = useState(0.04);

  const timerIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const showConfirm = (title, message, onConfirm, confirmOnly = false) => {
    setDialog({ show: true, title, message, onConfirm, confirmOnly });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, show: false }));
  };

  // Get current storage key scoped by auth status
  const getStorageKey = (user) => {
    if (user) {
      return `devRoadmap_state_${user.uid}`;
    }
    const localUser = localStorage.getItem('devRoadmap_currentUser');
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        if (u && u.email) {
          return `devRoadmap_state_local_${u.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        }
      } catch (e) {}
    }
    return 'devRoadmap_state_guest';
  };

  // Perform migration on old flat configurations if any
  const migrateLegacyState = (saved) => {
    if (saved.startDate && !saved.courses) {
      const legacyWebDev = {
        startDate: saved.startDate,
        tasks: saved.tasks || {},
        dailyLogs: saved.dailyLogs || {},
        milestones: saved.milestones || {},
        gitCicdSkills: saved.gitCicdSkills || {}
      };
      saved.courses = {
        'webdev': legacyWebDev
      };
      saved.activeCourseId = 'webdev';
      
      // clean up old root properties
      delete saved.startDate;
      delete saved.tasks;
      delete saved.dailyLogs;
      delete saved.milestones;
      delete saved.gitCicdSkills;
    }
    return saved;
  };

  // Load state from local storage or cloud
  const loadActiveState = async (user) => {
    const key = getStorageKey(user);
    const raw = localStorage.getItem(key);
    let loadedState = { ...DEFAULT_STATE };

    if (raw) {
      try {
        const parsed = migrateLegacyState(JSON.parse(raw));
        loadedState = { ...loadedState, ...parsed };
      } catch (e) {
        console.warn('Failed to parse local storage state');
      }
    }

    if (user && hasFirebaseCredentials && db) {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const cloudData = migrateLegacyState(docSnap.data());
          loadedState = { ...loadedState, ...cloudData };
          // save backup locally
          localStorage.setItem(key, JSON.stringify(loadedState));
        }
      } catch (e) {
        console.error('Failed to load state from Firestore:', e);
      }
    }

    setState(loadedState);
    applyThemeAndFont(loadedState.selectedTheme, loadedState.selectedFont);
  };

  // Save state helper
  const saveState = (newState) => {
    setState(newState);
    const key = getStorageKey(currentUser);
    localStorage.setItem(key, JSON.stringify(newState));

    // Async cloud sync if logged in
    if (currentUser && hasFirebaseCredentials && db) {
      setDoc(doc(db, 'users', currentUser.uid), newState, { merge: true })
        .then(() => console.log('State synchronized with Firestore cloud'))
        .catch(e => console.error('Cloud sync failure:', e));
    }
  };

  const applyThemeAndFont = (theme, font) => {
    const modeMap = { verdigris: 'light', ember: 'dark', blueprint: 'dark', parchment: 'light' };
    const mode = modeMap[theme] || 'dark';
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-mode', mode);
    document.body.setAttribute('data-font', font);
  };

  // Listen to auth changes
  useEffect(() => {
    let unsubscribe = () => {};
    if (hasFirebaseCredentials && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        await loadActiveState(user);
        setLoading(false);
      });
    } else {
      // Local storage auth listener mock
      const checkLocalAuth = () => {
        const session = localStorage.getItem('devRoadmap_currentUser');
        if (session) {
          try {
            const u = JSON.parse(session);
            setCurrentUser({ displayName: u.username, email: u.email, uid: u.email });
            loadActiveState({ uid: u.email });
          } catch (e) {
            setCurrentUser(null);
            loadActiveState(null);
          }
        } else {
          setCurrentUser(null);
          loadActiveState(null);
        }
        setLoading(false);
      };
      checkLocalAuth();
    }
    return () => unsubscribe();
  }, []);

  // Expose current active course data helpers
  const getActiveCourseProgress = () => {
    const cId = state.activeCourseId || 'webdev';
    const courseData = state.courses[cId] || {
      startDate: null,
      tasks: {},
      dailyLogs: {},
      milestones: {}
    };
    return courseData;
  };

  const selectCourse = (courseId, startDate) => {
    // Enforce only one course at a time by clearing all other course states and logs
    const newCourses = {
      [courseId]: {
        startDate,
        tasks: {},
        dailyLogs: {},
        milestones: {}
      }
    };

    const updated = {
      ...state,
      activeCourseId: courseId,
      courses: newCourses,
      dsaProblems: [] // Reset DSA logs since they are course specific
    };
    saveState(updated);
  };

  const toggleTask = (taskId, callbackOnCompleteWeek) => {
    const cId = state.activeCourseId || 'webdev';
    const courseData = { ...getActiveCourseProgress() };
    const newTasks = { ...courseData.tasks };

    newTasks[taskId] = !newTasks[taskId];
    courseData.tasks = newTasks;

    const newCourses = { ...state.courses };
    newCourses[cId] = courseData;

    const updated = {
      ...state,
      courses: newCourses
    };
    saveState(updated);

    // Calculate if week is newly completed for achievements/confetti
    const match = taskId.match(/^p(\d+)-w(\d+)-d\d+-(learn|build)$/);
    if (match && newTasks[taskId]) {
      const pIdx = parseInt(match[1]);
      const wIdx = parseInt(match[2]);
      const curriculum = getCourseCurriculum(cId);
      const phase = curriculum.find(p => p.phase === pIdx + 1);
      const week = phase?.weeks_data.find(w => w.week === wIdx);
      if (week) {
        // Verify if all days in week are now checkmarked
        let allDone = true;
        week.days.forEach(d => {
          const globalDay = (wIdx - 1) * 5 + d.day;
          const lId = `p${pIdx}-w${wIdx}-d${globalDay}-learn`;
          const bId = `p${pIdx}-w${wIdx}-d${globalDay}-build`;
          if (!newTasks[lId] || !newTasks[bId]) allDone = false;
        });
        if (allDone && callbackOnCompleteWeek) {
          callbackOnCompleteWeek(wIdx);
        }
      }
    }
  };

  const saveDailyLog = (dateKey, fields) => {
    try {
      // 1. Rate Limiter check
      checkRateLimit('db_write');

      // 2. Schema check and sanitization
      const sanitizedFields = validateAndSanitizeDailyLog(fields);
      const safeDateKey = sanitizeString(dateKey);

      const cId = state.activeCourseId || 'webdev';
      const courseData = { ...getActiveCourseProgress() };
      const newLogs = { ...courseData.dailyLogs };

      newLogs[safeDateKey] = {
        ...(newLogs[safeDateKey] || {
          learned: false,
          coded: false,
          dsa: false,
          commit: false,
          review: false,
          notes: '',
          focusMinutes: 0
        }),
        ...sanitizedFields
      };
      courseData.dailyLogs = newLogs;

      const newCourses = { ...state.courses };
      newCourses[cId] = courseData;

      const updated = {
        ...state,
        courses: newCourses
      };
      saveState(updated);
    } catch (error) {
      console.error("Security/Sync Error in saveDailyLog:", error.message);
      showToast(error.message, "warning");
    }
  };

  const toggleMilestone = (projectId, index) => {
    const cId = state.activeCourseId || 'webdev';
    const courseData = { ...getActiveCourseProgress() };
    const newMilestones = { ...courseData.milestones };
    const key = `${projectId}-${index}`;

    newMilestones[key] = !newMilestones[key];
    courseData.milestones = newMilestones;

    const newCourses = { ...state.courses };
    newCourses[cId] = courseData;

    const updated = {
      ...state,
      courses: newCourses
    };
    saveState(updated);
  };

  const updateAvatarColor = (color) => {
    const updated = { ...state, avatarColor: color };
    saveState(updated);
  };

  const updateAvatarImage = (mode, imgBase64) => {
    try {
      // 1. Rate Limiter check
      checkRateLimit('db_write');

      // 2. Sanitization & simple validation
      const safeMode = sanitizeString(mode);
      const safeImg = sanitizeString(imgBase64);

      if (safeMode !== 'weekly' && safeMode !== 'custom') {
        throw new Error("Invalid avatar mode.");
      }
      if (safeImg.length > 5000000) {
        throw new Error("Avatar image size exceeds the limit of 5MB.");
      }

      const updated = { ...state, avatarMode: safeMode, customAvatarImg: safeImg };
      saveState(updated);
    } catch (error) {
      console.error("Security/Sync Error in updateAvatarImage:", error.message);
      showToast(error.message, "warning");
    }
  };

  const getCompletedWeeksCount = () => {
    const activeId = state.activeCourseId || 'webdev';
    const curriculum = getCourseCurriculum(activeId);
    const courseData = state.courses[activeId] || {};
    const tasks = courseData.tasks || {};

    let completedWeeks = 0;
    curriculum.forEach((phase, pi) => {
      const pIdx = phase.phase - 1;
      phase.weeks_data.forEach((week, wi) => {
        const wIdx = week.week;
        let total = 0, done = 0;
        week.days.forEach((day, di) => {
          const globalDay = (wIdx - 1) * 5 + day.day;
          const learnId = `p${pIdx}-w${wIdx}-d${globalDay}-learn`;
          const buildId = `p${pIdx}-w${wIdx}-d${globalDay}-build`;
          
          total += 2;
          if (tasks[learnId]) done++;
          if (tasks[buildId]) done++;
        });
        
        const pct = total ? Math.round((done / total) * 100) : 0;
        if (pct === 100) {
          completedWeeks++;
        }
      });
    });
    return completedWeeks;
  };

  const getWeeklyAvatar = () => {
    const completed = getCompletedWeeksCount();
    const index = Math.min(completed, WEEKLY_AVATARS.length - 1);
    return WEEKLY_AVATARS[index] || WEEKLY_AVATARS[0];
  };

  const updateUsername = async (newUsername) => {
    const trimmed = newUsername.trim();
    if (!trimmed) throw new Error("⚠️ Username cannot be empty.");
    if (hasFirebaseCredentials && auth && auth.currentUser) {
      const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      await updateProfile(auth.currentUser, { displayName: trimmed });
      setCurrentUser({ ...auth.currentUser, displayName: trimmed });
    } else {
      const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
      if (currentUserStr) {
        const u = JSON.parse(currentUserStr);
        u.username = trimmed;
        localStorage.setItem('devRoadmap_currentUser', JSON.stringify(u));
        
        const usersKey = 'devRoadmap_localUsers';
        const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
        const updatedUsers = users.map(user => {
          if (user.email === u.email) {
            return { ...user, username: trimmed };
          }
          return user;
        });
        localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
        setCurrentUser(prev => ({ ...prev, displayName: trimmed }));
      }
    }
  };

  const updatePassword = async (currentPw, newPw) => {
    if (newPw.length < 6) {
      throw new Error("⚠️ New password must be at least 6 characters.");
    }
    if (hasFirebaseCredentials && auth && auth.currentUser) {
      const { updatePassword: updateFbPw } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      await updateFbPw(auth.currentUser, newPw);
    } else {
      const currentUserStr = localStorage.getItem('devRoadmap_currentUser');
      if (!currentUserStr) throw new Error("No active session found.");
      const u = JSON.parse(currentUserStr);
      const email = u.email;

      const usersKey = 'devRoadmap_localUsers';
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const userIndex = users.findIndex(usr => usr.email === email);
      if (userIndex === -1) throw new Error("User record not found.");
      if (users[userIndex].password !== currentPw) {
        throw new Error("❌ Incorrect current password.");
      }
      users[userIndex].password = newPw;
      localStorage.setItem(usersKey, JSON.stringify(users));
    }
  };

  const updateStartDate = (newStartDate) => {
    const cId = state.activeCourseId || 'webdev';
    const courseData = { ...getActiveCourseProgress() };
    courseData.startDate = newStartDate;

    const newCourses = { ...state.courses };
    newCourses[cId] = courseData;

    const updated = {
      ...state,
      courses: newCourses
    };
    saveState(updated);
  };

  const changeTheme = (theme) => {
    applyThemeAndFont(theme, state.selectedFont);
    const updated = { ...state, selectedTheme: theme };
    saveState(updated);
  };

  const changeFont = (font) => {
    applyThemeAndFont(state.selectedTheme, font);
    const updated = { ...state, selectedFont: font };
    saveState(updated);
  };

  const addDsaProblem = (problem) => {
    try {
      // 1. Rate Limiter check
      checkRateLimit('db_write');

      // 2. Schema check and sanitization
      const sanitizedProblem = validateAndSanitizeDsaProblem(problem);

      const newDsa = [...(state.dsaProblems || []), sanitizedProblem];
      const updated = { ...state, dsaProblems: newDsa };
      saveState(updated);
    } catch (error) {
      console.error("Security/Sync Error in addDsaProblem:", error.message);
      showToast(error.message, "warning");
    }
  };

  const removeDsaProblem = (problemId) => {
    const newDsa = (state.dsaProblems || []).filter(p => p.id !== problemId);
    const updated = { ...state, dsaProblems: newDsa };
    saveState(updated);
  };

  const logout = () => {
    localStorage.removeItem('devRoadmap_currentUser');
    if (hasFirebaseCredentials && auth) {
      auth.signOut();
    } else {
      setCurrentUser(null);
      setState(DEFAULT_STATE);
      applyThemeAndFont(DEFAULT_STATE.selectedTheme, DEFAULT_STATE.selectedFont);
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
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerLabel(label);
  };

  const startTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);

    if (ambientSound !== 'none') {
      startAmbientNoise(ambientSound, timerVolume);
    }

    let totalSecs = timerMinutes * 60 + timerSeconds;
    const initialDurationMins = Math.round((timerMinutes * 60 + timerSeconds) / 60);

    timerIntervalRef.current = setInterval(() => {
      totalSecs--;
      if (totalSecs <= 0) {
        clearInterval(timerIntervalRef.current);
        setIsTimerRunning(false);
        setTimerMinutes(0);
        setTimerSeconds(0);
        playCompletionChime();
        stopAmbientNoise();

        // Log study minutes to daily logs
        const todayKey = new Date().toISOString().split('T')[0];
        const activeProgress = getActiveCourseProgress();
        const currentMins = activeProgress.dailyLogs[todayKey]?.focusMinutes || 0;
        
        saveDailyLog(todayKey, {
          focusMinutes: currentMins + initialDurationMins
        });

        showConfirm(
          "⏱️ Focus Session Completed!",
          `Awesome work! You completed a ${initialDurationMins} minutes study block, which has been automatically logged. Keep grinding!`,
          () => {},
          true
        );
      } else {
        setTimerMinutes(Math.floor(totalSecs / 60));
        setTimerSeconds(totalSecs % 60);
      }
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    stopAmbientNoise();
  };

  const resetTimer = () => {
    pauseTimer();
    setTimerMinutes(25);
    setTimerSeconds(0);
    setTimerLabel('Focus');
  };

  const handleSetAmbientSound = (val) => {
    setAmbientSound(val);
    if (isTimerRunning) {
      startAmbientNoise(val, timerVolume);
    } else {
      stopAmbientNoise();
    }
  };

  // Update volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(timerVolume, audioCtxRef.current.currentTime);
    }
  }, [timerVolume]);

  // Clean up timer interval on unmount of the Provider
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopAmbientNoise();
    };
  }, []);

  return (
    <RoadmapContext.Provider
      value={{
        currentUser,
        loading,
        state,
        activeCourseId: state.activeCourseId,
        activeCourseProgress: getActiveCourseProgress(),
        selectCourse,
        toggleTask,
        saveDailyLog,
        toggleMilestone,
        changeTheme,
        changeFont,
        updateAvatarColor,
        updateAvatarImage,
        addDsaProblem,
        removeDsaProblem,
        toast,
        dialog,
        showToast,
        showConfirm,
        closeDialog,
        logout,
        getCompletedWeeksCount,
        getWeeklyAvatar,
        updateUsername,
        updatePassword,
        updateStartDate,
        reloadSession: () => loadActiveState(currentUser),
        // Timer values
        timerMinutes,
        timerSeconds,
        isTimerRunning,
        timerLabel,
        ambientSound,
        timerVolume,
        setTimerVolume,
        startTimer,
        pauseTimer,
        resetTimer,
        changeTimerDuration,
        setAmbientSound: handleSetAmbientSound
      }}
    >
      {!loading && children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => useContext(RoadmapContext);
