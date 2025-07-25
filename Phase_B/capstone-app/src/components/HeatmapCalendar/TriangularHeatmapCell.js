import React, { useState } from 'react';
import './TriangularHeatmapCell.css';

export default function TriangularHeatmapCell({
  day,
  mood,
  parkinson,
  physical,
  moodColor = '#ccc',
  parkinsonColor = '#ccc',
  physicalColor = '#ccc'
}) {
  {/* Manage tooltip visibility */}
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="triangular-heatmap-cell triangle-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >

      {/* Tooltip showing mood, parkinson, and physical values */}
      {showTooltip && (
        <div className="tooltip-box">
          <div><strong>Mood:</strong> {mood != null ? mood : 'N/A'}</div>
          <div><strong>Parkinson:</strong> {parkinson != null ? parkinson : 'N/A'}</div>
          <div><strong>Physical:</strong> {physical != null ? physical : 'N/A'}</div>
        </div>
      )}

      {/* Main visual cell with 3 colored triangles and the day number */}
      <svg viewBox="0 0 100 100" className="triangular-svg">

        {/* Background box */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="#f2f2f2"
          stroke="black"
          strokeWidth="25"
        />

        {/* Top triangle - Parkinson */}
        <polygon
          points="0,0 100,0 50,100"
          fill={parkinsonColor}
          stroke="black"
          strokeWidth="1.5"
        />

        {/* Left triangle - Physical */}
        <polygon
          points="0,0 0,100 50,100"
          fill={physicalColor}
          stroke="black"
          strokeWidth="1.5"
        />
        {/* Right triangle - Mood */}
        <polygon
          points="100,0 100,100 50,100"
          fill={moodColor} 
          stroke="black"
          strokeWidth="1.5"
        />
        {/* Day number centered */}
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="#111"
        >
          {day}
        </text>
      </svg>
    </div>
  );
}
