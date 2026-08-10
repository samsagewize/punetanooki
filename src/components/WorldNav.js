import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function WorldNav() {
  return <nav className="nav shell world-nav">
    <Link className="brand" to="/" aria-label="Ordinoooki home"><span className="brand-mark"><img src="/ordinooki-icon.png" alt="" /></span><span>ORDIN<span className="lime">OO</span>KI</span></Link>
    <div className="nav-links">
      <NavLink to="/gallery">Gallery</NavLink>
      <NavLink to="/forest">Nooki Forest</NavLink>
      <NavLink to="/playground">Playground <small className="soon-label">SOON</small></NavLink>
      <a className="x-nav-button" href="https://x.com/Ordinooki" target="_blank" rel="noreferrer">𝕏 Follow</a>
      <ThemeToggle />
    </div>
  </nav>;
}
