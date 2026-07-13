import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { auth, googleProvider, hasFirebaseCredentials } from '../services/firebaseConfig.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { validateEmail, validatePassword, validateUsername, checkRateLimit } from '../utils/security.js';

export default function AuthModal() {
  const { reloadSession } = useRoadmap();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg("⚠️ Email and password fields cannot be blank.");
      return;
    }

    // 1. Rate limiter check on authentication attempts
    try {
      checkRateLimit('auth');
    } catch (err) {
      setErrorMsg(err.message);
      return;
    }

    // 2. Schema validations
    if (!validateEmail(email)) {
      setErrorMsg("⚠️ Please specify a valid email address (5-100 characters).");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMsg("⚠️ Password must be between 6 and 100 characters in length.");
      return;
    }

    if (!isLogin && !validateUsername(username)) {
      setErrorMsg("⚠️ Username must be between 3 and 25 characters and contain only alphanumeric characters, underscores, or hyphens.");
      return;
    }

    if (hasFirebaseCredentials && auth) {
      // Firebase auth logic
      try {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email.trim(), password);
          setSuccessMsg("👋 Signed in successfully! Welcome back.");
          setTimeout(() => reloadSession(), 100);
        } else {
          if (!username.trim()) {
            setErrorMsg("⚠️ Please specify a username.");
            return;
          }
          const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          await updateProfile(userCredential.user, { displayName: username.trim() });
          setSuccessMsg("✨ Account created successfully! Let's build.");
          setTimeout(() => reloadSession(), 100);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(`❌ Auth error: ${err.message}`);
      }
    } else {
      // Local storage auth logic
      try {
        const usersKey = 'devRoadmap_localUsers';
        const usersRaw = localStorage.getItem(usersKey) || '[]';
        const users = JSON.parse(usersRaw);

        if (isLogin) {
          const user = users.find(u => u.email === email.trim() && u.password === password);
          if (!user) {
            setErrorMsg("❌ Incorrect email or password credentials.");
            return;
          }
          localStorage.setItem('devRoadmap_currentUser', JSON.stringify({ username: user.username, email: user.email }));
          setSuccessMsg(`👋 Welcome back, ${user.username}!`);
          window.location.reload();
        } else {
          if (!username.trim()) {
            setErrorMsg("⚠️ Please specify a username.");
            return;
          }
          if (users.some(u => u.email === email.trim())) {
            setErrorMsg("❌ An account with this email address already exists.");
            return;
          }
          users.push({ username: username.trim(), email: email.trim(), password });
          localStorage.setItem(usersKey, JSON.stringify(users));
          localStorage.setItem('devRoadmap_currentUser', JSON.stringify({ username: username.trim(), email: email.trim() }));
          setSuccessMsg("✨ Account created successfully!");
          window.location.reload();
        }
      } catch (err) {
        setErrorMsg("❌ Local authentication failed.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Rate limiter check on authentication attempts
    try {
      checkRateLimit('auth');
    } catch (err) {
      setErrorMsg(err.message);
      return;
    }

    if (hasFirebaseCredentials && auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
        setSuccessMsg("👋 Signed in successfully with Google! Welcome.");
        setTimeout(() => reloadSession(), 100);
      } catch (err) {
        console.error(err);
        setErrorMsg(`❌ Google Auth error: ${err.message}`);
      }
    } else {
      setErrorMsg("⚠️ Google Auth is not available in local guest mode. Please configure your Firebase environment variables first.");
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 16, 0.85)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 10000 }}>
      <div 
        className="card" 
        style={{ 
          width: '400px', padding: '32px', margin: 0, background: 'rgba(15, 23, 42, 0.9)', 
          border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          borderRadius: 'var(--radius)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>⚡</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0 }}>VeloceCode</h2>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isLogin ? 'Sign in to sync your professional developer logs' : 'Register a free profile to track your curriculum checkoffs'}
          </p>
        </div>

        {/* Form panel tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', gap: '16px' }}>
          <button 
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{ 
              background: 'none', border: 'none', paddingBottom: '8px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
              color: isLogin ? 'var(--accent-1)' : 'var(--text-muted)',
              borderBottom: isLogin ? '2.5px solid var(--accent-1)' : 'none'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{ 
              background: 'none', border: 'none', paddingBottom: '8px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
              color: !isLogin ? 'var(--accent-1)' : 'var(--text-muted)',
              borderBottom: !isLogin ? '2.5px solid var(--accent-1)' : 'none'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success alert badges */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', fontSize: '0.74rem', color: '#ef4444', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', fontSize: '0.74rem', color: '#10b981', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Username:</label>
              <input 
                type="text" 
                placeholder="e.g. JohnDoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input" 
                style={{ width: '100%' }}
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address:</label>
            <input 
              type="email" 
              placeholder="e.g. name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input" 
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Password:</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input" 
              style={{ width: '100%' }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px 0', fontSize: '0.82rem', marginTop: '8px' }}>
            {isLogin ? 'Sign In Credentials' : 'Create Free Profile'}
          </button>

        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', opacity: 0.3 }} />
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)', opacity: 0.3 }} />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          className="btn-secondary" 
          style={{ 
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
            padding: '10px 0', fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', cursor: 'pointer' 
          }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48" style={{ display: 'block' }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.75H24v9h12.75C34.9 33.9 30.2 38.5 24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c12.75 0 23.27-10.3 23.27-24z"/>
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 38.5c6.26 0 11.57-4.22 13.46-9.91l7.98 6.19C41.49 42.62 33.38 48 24 48c-9.38 0-17.49-5.38-21.44-13.22l7.98-6.19c1.89 5.69 7.2 9.91 13.46 9.91z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}
