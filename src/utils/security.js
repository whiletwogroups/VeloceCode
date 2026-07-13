// ============================================================
//  src/utils/security.js — Input Sanitization, Validation & Throttling
// ============================================================

/**
 * XSS Sanitizer: Strips any HTML tags to prevent cross-site scripting.
 * @param {string} val 
 * @returns {string}
 */
export function sanitizeString(val) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate email format and length.
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const cleaned = email.trim();
  if (cleaned.length < 5 || cleaned.length > 100) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned);
}

/**
 * Validate username format and length.
 */
export function validateUsername(username) {
  if (typeof username !== 'string') return false;
  const cleaned = username.trim();
  if (cleaned.length < 3 || cleaned.length > 25) return false;
  // Alphanumeric, underscores, and hyphens only
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(cleaned);
}

/**
 * Validate password requirements.
 */
export function validatePassword(password) {
  if (typeof password !== 'string') return false;
  return password.length >= 6 && password.length <= 100;
}

/**
 * Strict Input Schema Validator for DSA Problem items.
 * Extracts only allowed fields and throws an error on invalid formats.
 */
export function validateAndSanitizeDsaProblem(problem) {
  if (!problem || typeof problem !== 'object') {
    throw new Error("Invalid DSA problem data structure.");
  }

  // Enforce types and exact values
  const name = sanitizeString(problem.name);
  if (!name || name.length > 100) {
    throw new Error("DSA problem name is required and must be under 100 characters.");
  }

  const difficulty = problem.difficulty;
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new Error("Invalid DSA difficulty value.");
  }

  const phase = parseInt(problem.phase);
  if (isNaN(phase) || phase < 2 || phase > 5) {
    throw new Error("DSA phase must be an integer between 2 and 5.");
  }

  const topic = sanitizeString(problem.topic);
  if (!topic || topic.length > 50) {
    throw new Error("DSA topic is required and must be under 50 characters.");
  }

  const id = sanitizeString(problem.id);
  if (!/^dsa-\d+$/.test(id)) {
    throw new Error("Invalid DSA problem identifier.");
  }

  const date = sanitizeString(problem.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  // Reconstruct cleanly to reject unexpected fields
  return {
    id,
    name,
    difficulty,
    phase,
    topic,
    date
  };
}

/**
 * Strict Input Schema Validator for Daily Logs fields.
 * Extracts only allowed fields and throws an error on invalid formats.
 */
export function validateAndSanitizeDailyLog(fields) {
  if (!fields || typeof fields !== 'object') {
    throw new Error("Invalid daily log fields data structure.");
  }

  const sanitized = {};

  // Optional booleans
  const booleanKeys = ['learned', 'coded', 'dsa', 'commit', 'review'];
  booleanKeys.forEach(key => {
    if (fields[key] !== undefined) {
      sanitized[key] = !!fields[key];
    }
  });

  // Optional notes (Max 3000 chars, sanitized of HTML tags)
  if (fields.notes !== undefined) {
    const rawNotes = String(fields.notes);
    if (rawNotes.length > 3000) {
      throw new Error("Daily review notes must be under 3000 characters.");
    }
    sanitized.notes = sanitizeString(rawNotes);
  }

  // Optional focus minutes (Int in range [0, 1440])
  if (fields.focusMinutes !== undefined) {
    const mins = parseInt(fields.focusMinutes);
    if (isNaN(mins) || mins < 0 || mins > 1440) {
      throw new Error("Focus minutes must be a number between 0 and 1440.");
    }
    sanitized.focusMinutes = mins;
  }

  return sanitized;
}

// ============================================================
//  Client-Side Sliding Window Rate Limiter
// ============================================================

// Memory map to track request timestamps per action
const rateLimitCache = {};

/**
 * Checks and updates rate limits for a given action.
 * Throws a simulated HTTP 429 Error if limits are exceeded.
 * 
 * Rules:
 * - "db_write" : Max 15 operations per 30 seconds.
 * - "auth"     : Max 5 operations per 60 seconds.
 * 
 * @param {string} action - Action name ('db_write' | 'auth')
 */
export function checkRateLimit(action) {
  const now = Date.now();
  
  // Define limits: duration (ms) and max actions allowed
  const config = {
    db_write: { windowMs: 30000, max: 15 },
    auth: { windowMs: 60000, max: 5 }
  }[action] || { windowMs: 10000, max: 10 };

  if (!rateLimitCache[action]) {
    rateLimitCache[action] = [];
  }

  // Filter timestamps to keep only those within the current sliding window
  const windowStart = now - config.windowMs;
  rateLimitCache[action] = rateLimitCache[action].filter(time => time > windowStart);

  // Check if limit exceeded
  if (rateLimitCache[action].length >= config.max) {
    const waitSeconds = Math.ceil((rateLimitCache[action][0] + config.windowMs - now) / 1000);
    const error = new Error(`Too Many Requests (429). Please wait ${waitSeconds} seconds before trying again.`);
    error.status = 429;
    throw error;
  }

  // Record current request timestamp
  rateLimitCache[action].push(now);
}
