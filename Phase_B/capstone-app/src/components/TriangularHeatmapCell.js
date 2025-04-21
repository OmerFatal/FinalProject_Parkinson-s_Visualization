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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="triangle-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="tooltip-box">
          <div><strong>Parkinson:</strong> {parkinson ?? 'N/A'}</div>
          <div><strong>Physical:</strong> {physical ?? 'N/A'}</div>
          <div><strong>Mood:</strong> {mood ?? 'N/A'}</div>
        </div>
      )}
      <svg viewBox="0 0 100 100" className="triangular-svg">
        <rect x="0" y="0" width="100" height="100" fill="#f2f2f2" stroke="black" />
        <polygon points="0,0 100,0 50,100" fill={parkinsonColor} stroke="black" />
        <polygon points="0,0 0,100 50,100" fill={physicalColor} stroke="black" />
        <polygon points="100,0 100,100 50,100" fill={moodColor} stroke="black" />
        <text x="50" y="60" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#111">
          {day}
        </text>
      </svg>
    </div>
  );
}
