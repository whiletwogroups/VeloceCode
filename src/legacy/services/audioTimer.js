// ============================================================
//  src/services/audioTimer.js — Pomodoro state & Synthesized Noise
// ============================================================

import { state, saveState, updateXPSystem } from './state.js';
import { todayStr } from '../utils/date.js';

export let focusTimerInterval = null;
export let focusTimeDuration = 25 * 60;
export let focusTimeRemaining = 25 * 60;
export let focusTimerLabel = 'Focus';
export let isTimerRunning = false;

let ambientAudioSource = null;
let ambientAudioCtx = null;
let ambientGainNode = null;

export function playCompletionChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
  } catch(e) { console.warn('AudioContext failed to start', e); }
}

export function startAmbientNoise(type) {
  stopAmbientNoise();
  if (type === 'none') return;

  try {
    ambientAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientGainNode = ambientAudioCtx.createGain();
    ambientGainNode.gain.setValueAtTime(0.04, ambientAudioCtx.currentTime);
    ambientGainNode.connect(ambientAudioCtx.destination);

    if (type === 'white' || type === 'rain') {
      const bufferSize = 2 * ambientAudioCtx.sampleRate;
      const noiseBuffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'white') {
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else {
          output[i] = (lastOut + (0.12 * white)) / 1.12;
          lastOut = output[i];
          output[i] *= 1.5;
        }
      }

      const noiseNode = ambientAudioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;
      noiseNode.connect(ambientGainNode);
      noiseNode.start();
      ambientAudioSource = noiseNode;
    } else if (type === 'synth') {
      const osc1 = ambientAudioCtx.createOscillator();
      const osc2 = ambientAudioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110.0, ambientAudioCtx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, ambientAudioCtx.currentTime);

      const filter = ambientAudioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ambientAudioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ambientGainNode);

      osc1.start();
      osc2.start();

      ambientAudioSource = {
        stop: () => {
          try { osc1.stop(); osc2.stop(); } catch(e){}
        }
      };
    }
  } catch(e) { console.warn('Ambient AudioContext failed to initialize', e); }
}

export function stopAmbientNoise() {
  if (ambientAudioSource) {
    try { ambientAudioSource.stop(); } catch(e){}
    ambientAudioSource = null;
  }
  if (ambientAudioCtx) {
    try { ambientAudioCtx.close(); } catch(e){}
    ambientAudioCtx = null;
  }
}

export function setTimerDuration(mins, label, onUpdate) {
  pauseFocusTimer();
  focusTimeDuration = mins * 60;
  focusTimeRemaining = focusTimeDuration;
  focusTimerLabel = label;
  if (onUpdate) onUpdate();
}

export function startFocusTimer(onTick, onComplete) {
  if (isTimerRunning) return;
  isTimerRunning = true;

  const ambientType = document.getElementById('ambient-noise-select')?.value || 'none';
  if (ambientType !== 'none' && !ambientAudioSource) {
    startAmbientNoise(ambientType);
  }

  focusTimerInterval = setInterval(() => {
    if (focusTimeRemaining <= 0) {
      clearInterval(focusTimerInterval);
      focusTimerInterval = null;
      isTimerRunning = false;

      playCompletionChime();
      const elapsedMins = Math.round(focusTimeDuration / 60);
      addStudyMinutes(elapsedMins);
      
      stopAmbientNoise();
      if (onComplete) onComplete();
    } else {
      focusTimeRemaining--;
      if (onTick) onTick();
    }
  }, 1000);
}

export function pauseFocusTimer() {
  if (!isTimerRunning) return;
  isTimerRunning = false;
  clearInterval(focusTimerInterval);
  focusTimerInterval = null;
  stopAmbientNoise();
}

export function resetFocusTimer(onUpdate) {
  pauseFocusTimer();
  focusTimeRemaining = focusTimeDuration;
  if (onUpdate) onUpdate();
}

export function addStudyMinutes(mins) {
  const today = todayStr();
  state.dailyLogs[today] = state.dailyLogs[today] || {};
  state.dailyLogs[today].focusMinutes = (state.dailyLogs[today].focusMinutes || 0) + mins;
  saveState();
  updateXPSystem();
}

export function getFocusTimeRemaining() {
  return focusTimeRemaining;
}

export function getFocusTimeDuration() {
  return focusTimeDuration;
}

export function getFocusTimerLabel() {
  return focusTimerLabel;
}

export function getIsTimerRunning() {
  return isTimerRunning;
}
