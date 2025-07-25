import React from 'react';
import { pillColors, pillTypes } from './PillTypes';

export default function MedicationTooltip({ active, payload }) {
  // Render tooltip only if there is data to show
  if (active && payload && payload.length && payload[0]?.payload?.medications) {
    const meds = payload[0].payload.medications;

    // Map each medication to its display color and category
    const items = meds.map(med => {
      const category = Object.entries(pillTypes).find(([cat, names]) =>
        names.includes(med.pillName)
      )?.[0];
      return {
        pillName: med.pillName,
        amount: med.amount,
        color: pillColors[category] || '#ddd'
      };
    });

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
        {/* Render each medication with color and amount */}
        {items.map((med, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: med.color,
              borderRadius: '6px',
              padding: '6px 10px',
              marginBottom: '4px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.4px'
            }}
          >
            <strong>{med.pillName}</strong>: {med.amount} pill(s)
          </div>
        ))}
      </div>
    );
  }

  return null;
}
