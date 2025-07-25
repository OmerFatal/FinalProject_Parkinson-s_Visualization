import React, { useEffect, useState } from 'react';
import './NavBar.css';
import { useLocation, Link } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedMonth = query.get('month');
  const selectedYear = query.get('year');

  const [activeSection, setActiveSection] = useState('analysis');

  {/* Update active section based on scroll position */}
  useEffect(() => {
  const handleScroll = () => {
    const sections = ['analysis', 'protein', 'medication', 'activity-summary'];
    let currentSection = null;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = id;
        }
      }
    }

  if (currentSection) {
    setActiveSection(currentSection);
  }
};

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  {/* Build back-link URL to the heatmap with preserved month/year */}
  const heatmapLink = selectedMonth && selectedYear
    ? `/?month=${selectedMonth}&year=${selectedYear}`
    : '/';

  {/* Scroll smoothly to a section on the page */}
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">

        {/* Dashboard logo */}
        <div className="navbar-logo">🧠 Parkinson Daily Dashboard</div>

        {/* Back link to the heatmap calendar */}
        <Link className="navbar-link back-link" to={heatmapLink}>Back to Heatmap</Link>
      </div>

      {/* Section navigation buttons */}
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
          Protein Intake 
        </button>
        <button
          className={`navbar-link back-link${activeSection === 'medication' ? ' active' : ''}`}
          onClick={() => scrollToSection('medication')}
        >
          Medication Intake
        </button>
        <button
          className={`navbar-link back-link${activeSection === 'activity-summary' ? ' active' : ''}`}
          onClick={() => scrollToSection('activity-summary')}
        >
          Daily Activities
        </button>
      </div>
    </nav>
  );
}
