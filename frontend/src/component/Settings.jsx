// src/component/Settings.jsx
import React, { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.style.backgroundColor = theme === 'light' ? '#222' : '#fff';
    document.body.style.color = theme === 'light' ? '#fff' : '#000';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Settings</h2>
      <p onClick={toggleTheme} style={{ cursor: 'pointer' }}>🌗 Toggle Theme</p>
    </div>
  );
} 