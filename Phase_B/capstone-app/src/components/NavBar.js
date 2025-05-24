import React, { useEffect, useState } from 'react';
import './NavBar.css';
import { useLocation, Link } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedMonth = query.get('month');
  const selectedYear = query.get('year');

  // הדגשה של הסקשן הפעיל
  const [activeSection, setActiveSection] = useState('analysis');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['analysis', 'protein', 'medication', 'activity-summary'];
      let found = 'analysis';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) found = id;
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heatmapLink = selectedMonth && selectedYear
    ? `/?month=${selectedMonth}&year=${selectedYear}`
    : '/';

  // גלילה חלקה לסקשן
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">🧠 Parkinson Daily Dashboard</div>
        <Link className="navbar-link back-link" to={heatmapLink}>Back to Heatmap</Link>
      </div>
      <div className="navbar-links">
        <button
          className={`navbar-link back-link${activeSection === 'analysis' ? ' active' : ''}`}
          onClick={() => scrollToSection('analysis')}
        >
          Daily Analysis
        </button>
        <button
          className={`navbar-link back-link${activeSection === 'protein' ? ' active' : ''}`}
          onClick={() => scrollToSection('protein')}
        >
          Protein
        </button>
        <button
          className={`navbar-link back-link${activeSection === 'medication' ? ' active' : ''}`}
          onClick={() => scrollToSection('medication')}
        >
          Medication
        </button>
        <button
          className={`navbar-link back-link${activeSection === 'activity-summary' ? ' active' : ''}`}
          onClick={() => scrollToSection('activity-summary')}
        >
          Activity Summary
        </button>
      </div>
    </nav>
  );
}
