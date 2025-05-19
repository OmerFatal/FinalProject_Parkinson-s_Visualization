import React from 'react';
import { pillColors } from './PillTypes';

export default function MedicationTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const items = payload
      .filter(item => item.value > 0)
      .map(item => ({
        pillName: item.dataKey,
        amount: item.value,
        color: pillColors[item.dataKey] || '#ddd'
      }));

    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          padding: 14,
          color: '#222',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          minWidth: 170,
          fontSize: 16
        }}
      >
        {items.map((med, idx) => (
          <div key={idx} style={{
            backgroundColor: med.color,
            borderRadius: '6px',
            padding: '6px 10px',
            marginBottom: '4px',
            color: '#000',
            fontWeight: 'bold', // ← מוּדגש
            fontFamily: 'Arial, sans-serif', // ← תוסיף משפחת גופן ברורה
            letterSpacing: '0.4px' // ← אופציונלי לנראות
          }}>
            <strong>{med.pillName}</strong>: {med.amount} pill(s)
          </div>
        ))}
      </div>
    );
  }
  return null;
}
