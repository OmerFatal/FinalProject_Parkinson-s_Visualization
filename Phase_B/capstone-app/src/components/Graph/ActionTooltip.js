import React from 'react';

const iconMap = {
  sleep: '😴',
  medication: '💊',
  nutrition: '🍽️',
  activity: '🚶‍♂️'
};

export default function ActionTooltip({ tooltip }) {
  if (!tooltip) return null;
  const { entry } = tooltip;
  const icon = iconMap[entry.icon];

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '160px',
      lineHeight: '1.6',
      textAlign: 'center',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      position: 'fixed',
      left: tooltip.x + 12,
      top: tooltip.y + 12,
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div style={{ fontSize: '32px', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{entry.icon.charAt(0).toUpperCase() + entry.icon.slice(1)}</div>
      <div style={{ fontSize: 14, color: '#555' }}>Time: {entry.time}</div>
    </div>
  );
} 