// src/components/HeatmapCalendar/HeatmapLegend.js
import React from 'react';

export default function HeatmapLegend() {
  return (
    <div className="heatmap-legend-container">
      <div className="heatmap-legend-bar-vertical">
        <div className="scale-level level-5"></div>
        <div className="scale-level level-4"></div>
        <div className="scale-level level-3"></div>
        <div className="scale-level level-2"></div>
        <div className="scale-level level-1"></div>
      </div>
      <div className="scale-labels">
        <div className="scale-label">5 (Worse)</div>
        <div className="scale-label">4</div>
        <div className="scale-label">3</div>
        <div className="scale-label">2</div>
        <div className="scale-label">1 (Best)</div>

        <div
          className="scale-label"
          style={{
            marginTop: '12px',
            fontStyle: 'italic',
            fontSize: '13px',
            color: '#000000 '
          }}
        >
          Gray = No data reported
        </div>
      </div>
    </div>
  );
}
