import React from 'react';
import './LegendSampleBox.css';

export default function LegendSampleBox() {
  const neutralColor = '#e0e7ff'; // Light blue for legend sample

  return (
    <div className="legend-sample-wrapper">
      <svg viewBox="0 0 12 12" className="legend-sample-svg">

        {/* Background square with border */}
        <rect x="0" y="0" width="12" height="12" fill={neutralColor} stroke="black" strokeWidth="0.3" />

        {/* Top triangle for Parkinson */}
        <polygon points="0,0 12,0 6,12" fill={neutralColor} stroke="black" strokeWidth="0.2" />
        <text x="6" y="4.2" textAnchor="middle" fontSize="1.5" fill="black" fontWeight="bold">
          Parkinson
        </text>

        {/* Left triangle for Physical */}
        <polygon points="0,0 0,12 6,12" fill={neutralColor} stroke="black" strokeWidth="0.2" />
        <text
          x="1.7"
          y="9.3"
          transform="rotate(420 4.4 7)"
          fontSize="1.5"
          fill="black"
          fontWeight="bold"
        >
          Physical
        </text>

        {/* Right triangle for Mood */}
        <polygon points="12,0 12,12 6,12" fill={neutralColor} stroke="black" strokeWidth="0.2" />
        <text
          x="9.3"
          y="9.3"
          transform="rotate(295 9.3 9.8)"
          fontSize="1.5"
          fill="black"
          fontWeight="bold"
        >
          Mood
        </text>
      </svg>
    </div>
  );
}
