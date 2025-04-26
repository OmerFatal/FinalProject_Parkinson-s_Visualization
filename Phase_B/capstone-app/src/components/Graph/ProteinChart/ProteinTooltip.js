// ProteinTooltip.js

import React from 'react';

export default function ProteinTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 14,
        maxWidth: 220
      }}>
        <div><strong>{entry.food}</strong></div>
        <div>Time: {entry.time}</div>
        <div>{entry.protein}g protein</div>
      </div>
    );
  }
  return null;
}
