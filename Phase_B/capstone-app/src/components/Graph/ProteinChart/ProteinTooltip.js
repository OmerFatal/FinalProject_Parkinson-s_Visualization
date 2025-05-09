import React from 'react';

export default function ProteinTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;

    const formatLine = (label, value, time, color) => {
      const displayValue = value ?? 'N/A';
      const displayTime =
        value == null
          ? '(no data within 3h)'
          : time
            ? `(at ${time})`
            : '(time missing)';

      return (
        <div style={{ color, fontWeight: 800 }}>
          <strong>
            {label}: <span>{displayValue}</span> {displayTime}
          </strong>
        </div>
      );
    };

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #94a3b8',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 16,
        maxWidth: 260,
        lineHeight: '1.8',
        fontWeight: 800
      }}>
        <div><strong>{entry.food}</strong></div>
        <div>{entry.protein}g protein</div>
        <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
        {formatLine('Mood', entry.feeling, entry.feelingTime, '#2563eb')}
        {formatLine('Physical', entry.physical, entry.physicalTime, '#22c55e')}
        {formatLine('Parkinson', entry.parkinson, entry.parkinsonTime, '#dc2626')}
      </div>
    );
  }
  return null;
}
