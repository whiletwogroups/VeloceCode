import React, { useRef } from 'react';
import { useRoadmap } from '../context/RoadmapContext.jsx';

export default function ProfileModal({ onClose }) {
  const { currentUser, state, updateAvatarColor, updateAvatarImage, showToast } = useRoadmap();
  
  const fileInputRef = useRef(null);

  // Colors list
  const colors = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ef4444'  // Red
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("⚠️ File size must be smaller than 2MB.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateAvatarImage('custom', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetToWeekly = () => {
    updateAvatarImage('weekly', '');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 16, 0.75)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 9000 }}>
      <div 
        className="card" 
        style={{ 
          width: '380px', padding: '24px', margin: 0, background: 'rgba(15, 23, 42, 0.95)', 
          border: '2px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: 'white', margin: 0 }}>Profile & Settings</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: 0 }}>&times;</button>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
          <div 
            style={{ 
              width: '42px', height: '42px', borderRadius: '50%', background: state.avatarColor || 'var(--accent-grad)',
              display: 'grid', placeItems: 'center', fontSize: '1.25rem', color: 'white', fontWeight: 800
            }}
          >
            {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', margin: '0 0 2px 0' }}>
              {currentUser?.displayName || currentUser?.email.split('@')[0]}
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
          </div>
        </div>

        {/* Avatar Color Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Profile Color Scheme:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {colors.map(col => (
              <button 
                key={col}
                onClick={() => updateAvatarColor(col)}
                className="color-picker-dot"
                style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', background: col, border: 'none', cursor: 'pointer',
                  transform: state.avatarColor === col ? 'scale(1.2)' : '',
                  boxShadow: state.avatarColor === col ? `0 0 8px ${col}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Custom Avatar Upload */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Avatar Image Theme:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary" 
              style={{ fontSize: '0.72rem', padding: '6px 12px' }}
            >
              Upload Picture
            </button>

            {state.avatarMode === 'custom' && (
              <button 
                onClick={handleResetToWeekly}
                className="btn-secondary" 
                style={{ fontSize: '0.72rem', padding: '6px 12px', borderColor: '#ef4444', color: '#ef4444' }}
              >
                Reset Image
              </button>
            )}
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>Supports PNG, JPG, or GIF up to 2MB.</span>
        </div>

        <button 
          onClick={onClose}
          className="btn-primary" 
          style={{ width: '100%', padding: '8px 0', fontSize: '0.78rem' }}
        >
          Save & Exit
        </button>

      </div>
    </div>
  );
}
