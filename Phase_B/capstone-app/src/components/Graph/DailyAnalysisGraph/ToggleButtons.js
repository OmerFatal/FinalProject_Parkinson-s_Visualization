import React from 'react';

export default function ToggleButtons({ visibleLines, toggleLine, availableLines }) {
  const buttons = [
    { key: 'feeling', label: 'My Mood', color: '#2563eb' },
    { key: 'parkinson', label: 'Parkinson State', color: '#dc2626' },
    { key: 'physical', label: 'Physical Difficulty', color: '#22c55e' }
  ];

  return (
    <div className="graph-buttons-with-label">
      <span className="graph-buttons-label">Select Feeling To Display:</span>
      <div className="graph-buttons">
        {buttons.map(({ key, label, color }) =>
          availableLines?.[key] ? (
            <button
              key={key}
              onClick={() => toggleLine(key)}
              className="graph-button"
              style={{
                border: `2px solid ${visibleLines[key] ? color : '#cbd5e1'}`,
                backgroundColor: visibleLines[key] ? color : '#f1f5f9',
                color: visibleLines[key] ? 'white' : '#1e293b'
              }}
            >
              {label}
            </button>
          ) : (
            <div
              key={key}
              style={{
                fontSize: '14px',
                color: '#64748b',
                fontStyle: 'italic',
                marginBottom: '6px',
                border: '1px dashed #94a3b8',
                borderRadius: '12px',
                padding: '6px 12px',
                backgroundColor: '#f8fafc',
                marginRight: '8px'
              }}
            >
              ⚠️ {label} – No data reported today
            </div>
          )
        )}
      </div>
    </div>
  );
}