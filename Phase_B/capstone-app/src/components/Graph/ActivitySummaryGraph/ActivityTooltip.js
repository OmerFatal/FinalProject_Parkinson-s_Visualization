import React from 'react';
import ropeIcon from '../../../assets/rope.png';
import brainIcon from '../../../assets/brain.png';
import houseIcon from '../../../assets/House.png';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Sport': return ropeIcon;
    case 'Cognitive': return brainIcon;
    case 'Household': return houseIcon;
    default: return null;
  }
};

const getIntensityColor = (intensity) => {
  switch (intensity) {
    case 'High': return '#16a34a'; 
    case 'Moderate': return '#facc15'; 
    case 'Low': return '#dc2626'; 
    default: return '#6b7280'; 
  }
};

export default function ActivityTooltip({ tooltip, isMobile }) {
  if (!tooltip) return null;

  const tooltipWidth = isMobile ? 200 : 240;
  const intensityColor = getIntensityColor(tooltip.activity.intensity);

  const isOverflowingRight = tooltip.x + tooltipWidth + 20 > window.innerWidth;
  const adjustedLeft = isOverflowingRight ? tooltip.x - tooltipWidth - 12 : tooltip.x + 12;

  return (
    <div
      style={{
        position: 'fixed',
        left: adjustedLeft,
        top: tooltip.y + 12,
        background: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: 14,
        fontFamily: 'Segoe UI, Helvetica, sans-serif',
        direction: 'ltr',
        lineHeight: '1.6',
        pointerEvents: 'none',
        zIndex: 9999,
        maxWidth: tooltipWidth
      }}
    >
      <div style={{
        fontWeight: 'bold',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }}>
        <img src={getCategoryIcon(tooltip.activity.category)} alt="" style={{ width: 24, height: 24 }} />
        <span>{tooltip.activity.name}</span>
      </div>
      <div>Start: <span style={{ fontWeight: '500' }}>{tooltip.activity.time}</span></div>
      <div>Duration: <span style={{ fontWeight: '500' }}>{tooltip.activity.duration} min</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        Intensity: 
        <span style={{
          backgroundColor: intensityColor,
          color: '#ffffff',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontWeight: '700',
          fontSize: '13px'
        }}>
          {tooltip.activity.intensity}
        </span>
      </div>
    </div>
  );
}