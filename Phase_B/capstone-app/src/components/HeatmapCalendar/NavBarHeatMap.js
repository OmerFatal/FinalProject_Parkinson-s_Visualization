import React from 'react';
import '../NavBar.css';

export default function NavBarHeatMap() {
  return (
    <nav className="navbar">
      {/* Heatmap title shown as logo in navbar */}
      <div className="navbar-logo" style={{ color: '#ffffff' }} >
        📅 Monthly Heatmap
      </div>
    </nav>
  );
}
