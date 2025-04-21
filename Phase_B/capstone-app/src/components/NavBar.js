import React, { useEffect } from 'react';
import './NavBar.css';

export default function NavBar() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">🧠 Parkinson Daily Dashboard</div>
        <a className="navbar-link back-link" href="/">Back to Heatmap</a>
      </div>

      <div className="navbar-links">
        <a className="navbar-link" href="#analysis">Daily Analysis</a>
        <a className="navbar-link" href="#exercise">Sleep & Exercise</a>
        <a className="navbar-link" href="#nutrition">Nutrition</a>
      </div>
    </nav>
  );
}
