import React, { useState } from 'react';

// ── Dummy users for offline fallback (used when backend is unreachable) ──────
const DUMMY_USERS: { username: string; email: string; password: string }[] = [
  { username: 'adminuser', email: 'admin@test.com', password: '123456789' },
  { username: 'testuser', email: 'test@test.com', password: 'password123' },
  { username: 'demo', email: 'demo@test.com', password: 'demo123' },
];

interface AuthProps {
  onAuthSuccess: (token: string, username: string, isOffline: boolean) => void;
  apiUrl: string;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, apiUrl }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let useOfflineFallback = false;
    let authErrorMessage = '';

    // ── Step 1: Try the real backend API ──────────────────────────────────
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: email.trim(), password }
        : { username: username.trim(), email: email.trim(), password };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Try parsing the response as JSON.
      // If parsing fails (e.g. server returns 502/404 HTML page), treat backend as unreachable.
      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('BACKEND_UNREACHABLE');
      }

      if (!response.ok) {
        // If it's a server error (5xx) or not found (404), treat backend as offline/down.
        if (response.status >= 500 || response.status === 404) {
          throw new Error('BACKEND_UNREACHABLE');
        }
        // Otherwise, it's a specific auth failure (400, 401, 403) with a JSON error message.
        authErrorMessage = data.message || 'Authentication failed';
      } else {
        // Backend responded successfully — use real token
        onAuthSuccess(data.token, data.username, false);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      if (err.message === 'BACKEND_UNREACHABLE') {
        useOfflineFallback = true;
      } else {
        // Any other fetch exception (CORS error, connection refused, DNS error, localized TypeError, etc.)
        console.warn('Fetch exception caught, falling back to offline mode:', err);
        useOfflineFallback = true;
      }
    }

    // ── Step 2: Fallback or Error Display ──────────────────────
    if (useOfflineFallback) {
      if (isLogin) {
        // For login: match by email + password against dummy users
        const matched = DUMMY_USERS.find(
          (u) => u.email === email.trim().toLowerCase() && u.password === password
        );

        if (matched) {
          const fakeToken = `offline-token-${matched.username}-${Date.now()}`;
          onAuthSuccess(fakeToken, matched.username, true);
        } else {
          setError('Backend offline. Try offline account: admin@test.com / 123456789');
        }
      } else {
        // For register: simulate success (just log them in)
        const trimmedUsername = username.trim() || 'NewUser';
        const fakeToken = `offline-token-${trimmedUsername}-${Date.now()}`;
        onAuthSuccess(fakeToken, trimmedUsername, true);
      }
    } else {
      // Show the actual server auth message (e.g., wrong password / user exists)
      setError(authErrorMessage || 'Authentication failed');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">⚡</div>
        <h2 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Start Your Journey'}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to track your 180-day roadmap progress'
            : 'Create an account to track your study hours and tasks'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowForgot(!showForgot)}
            >
              Forgot password?
            </button>
          </div>

          {/* Forgot password hint — reveals credentials */}
          {showForgot && (
            <div className="forgot-hint-box">
              <p className="forgot-hint-title">🔑 Offline test accounts (when backend is down):</p>
              {DUMMY_USERS.map((u) => (
                <div className="credential-row" key={u.username}>
                  <span className="credential-label">👤</span>
                  <code>{u.email}</code>
                  <span className="credential-sep">/</span>
                  <code>{u.password}</code>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            className="auth-switch-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowForgot(false);
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Offline credentials hint */}
        <div className="auth-divider">
          <span>offline test accounts</span>
        </div>

        <div className="demo-credentials">
          {DUMMY_USERS.map((u) => (
            <div className="credential-row" key={u.username}>
              <span className="credential-label">👤</span>
              <code>{u.email}</code>
              <span className="credential-sep">/</span>
              <code>{u.password}</code>
            </div>
          ))}
        </div>
        <p className="demo-hint">
          These work when backend is offline · Data saved in your browser
        </p>
      </div>
    </div>
  );
};
