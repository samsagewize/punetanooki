import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('nooki-theme') !== 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', dark);
    localStorage.setItem('nooki-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} aria-pressed={dark}>
    <span>{dark ? '◐' : '◑'}</span>{dark ? 'Dark' : 'Light'}
  </button>;
}
