import React from 'react';

const iconMap = {
  sleep: '😴',
  medication: '💊',
  nutrition: '🍽️',
  activity: '🚶‍♂️'
};

export default function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0]?.payload;
  const icon = iconMap[entry?.icon];

  const formatLine = (label, value, time, color) => {
    const displayValue = value ?? 'N/A';

    const displayTime =
      value == null
        ? '(no data within 3h)'
        : time
          ? `(at ${time})`
          : '(time missing)';

    return (
      <div style={{ color, fontWeight: 600 }}>
        {label}: <span style={{ fontWeight: 800 }}>{displayValue}</span> {displayTime}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '220px',
      lineHeight: '1.6',
      textAlign: 'left',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      {icon && (
        <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>{icon}</div>
      )}
      <div style={{ fontWeight: '700', marginBottom: '8px' }}>
        Action Time: {entry.time}
      </div>

      {formatLine('My Mood', entry.feeling, entry.feelingTime, '#2563eb')}
      {formatLine('Parkinson State', entry.parkinson, entry.parkinsonTime, '#dc2626')}
      {formatLine('Physical Difficulty', entry.physical, entry.physicalTime, '#22c55e')}
    </div>
  );
}
