import React from 'react';

const categoryColors = {
  Sport: '#3b82f6',
  Cognitive: '#10b981',
  Household: '#f59e0b'
};

export default function LegendBox() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '6px',
      marginBottom: '12px'
    }}>
      {Object.entries(categoryColors).map(([key, color]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: color,
            borderRadius: 4
          }} />
          <span style={{ fontSize: 14 }}>{key}</span>
        </div>
      ))}
    </div>
  );
}