import React, { useEffect } from 'react';
import './NavBar.css';
import { useLocation, Link } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedMonth = query.get('month');
  const selectedYear = query.get('year');

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

  const heatmapLink = selectedMonth && selectedYear
    ? `/?month=${selectedMonth}&year=${selectedYear}`
    : '/';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">🧠 Parkinson Daily Dashboard</div>
        <Link className="navbar-link back-link" to={heatmapLink}>Back to Heatmap</Link>
      </div>

      <div className="navbar-links">
        <a className="navbar-link" href="#analysis">Daily Analysis</a>
        <a className="navbar-link" href="#protein">Protein</a>
        <a className="navbar-link" href="#medication">Medication</a>
        <a className="navbar-link" href="#activity-summary">Activity Summary</a>
      </div>
    </nav>
  );
}
