import React from 'react';

export default function LegendSection() {
  return (
    <div className="legend-wrapper">
      {/* Legend for lines */}
      <div className="legend-container">
        <div className="legend-group">
          <div className="legend-badge" style={{ color: '#2563eb' }}>─ My Mood</div>
          <div className="legend-badge" style={{ color: '#dc2626' }}>─ Parkinson State</div>
          <div className="legend-badge" style={{ color: '#22c55e' }}>─ Physical Difficulty</div>
        </div>
      </div>
      {/* Legend for score scale meaning */}
      <div className="legend-container">
        <div className="legend-group">
          <div
            className="legend-badge"
            style={{
              fontWeight: 600,
              color: '#1e3a8a',
               marginLeft: '10px'
            }}
          >
            Score Scale: 1 = Best, 5 = Worst
          </div>
        </div>
      </div>
      {/* Legend for activity icons */}
      <div className="legend-container">
        <div className="legend-group">
          <div className="legend-badge">🌙 Going to Sleep</div>
          <div className="legend-badge">🌅 Waking Up</div>
          <div className="legend-badge">💊 Medication</div>
          <div className="legend-badge">🍽️ Nutrition</div>
          <div className="legend-badge">🚶‍♂️ Activity</div>
        </div>
      </div>
    </div>
  );
}