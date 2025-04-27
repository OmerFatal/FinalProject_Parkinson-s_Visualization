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

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '200px',
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
      <div style={{ color: '#2563eb', fontWeight: 600 }}>
        My Mood: <span style={{ fontWeight: 800 }}>{entry.feeling}</span>
        {entry.feelingTime ? ` (at ${entry.feelingTime})` : ''}
      </div>
      <div style={{ color: '#dc2626', fontWeight: 600 }}>
        Parkinson State: <span style={{ fontWeight: 800 }}>{entry.parkinson ?? 'N/A'}</span>
        {entry.parkinsonTime ? ` (at ${entry.parkinsonTime})` : ''}
      </div>
      <div style={{ color: '#22c55e', fontWeight: 600 }}>
        Physical Difficulty: <span style={{ fontWeight: 800 }}>{entry.physical ?? 'N/A'}</span>
        {entry.physicalTime ? ` (at ${entry.physicalTime})` : ''}
      </div>
    </div>
  );
}
