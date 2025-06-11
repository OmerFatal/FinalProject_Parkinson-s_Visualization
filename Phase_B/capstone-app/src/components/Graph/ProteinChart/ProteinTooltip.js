import React from 'react';

export default function ProteinTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #94a3b8',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 16,
        maxWidth: 280,
        whiteSpace: 'pre-line',
        fontWeight: 800
      }}>
       
        <div><strong>{entry.food}</strong></div>

        <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />

        
        <div style={{ fontWeight: 500, fontSize: 14, color: '#334155' }}>
          {entry.notes}
        </div>
      </div>
    );
  }
  return null;
}