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
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Segoe UI, sans-serif',
        minWidth: '180px'
      }}>
        {items.map((med, idx) => (
          <div key={idx} style={{
            backgroundColor: med.color,
            borderRadius: '6px',
            padding: '6px 10px',
            marginBottom: '4px',
            color: '#000',
            fontWeight: 'bold'
          }}>
            {med.pillName}: {med.amount} pill(s)
          </div>
        ))}
      </div>
    );
  }
  return null;
}
