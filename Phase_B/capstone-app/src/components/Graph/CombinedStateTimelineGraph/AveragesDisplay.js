import React from 'react';
import MyMood from '../../../assets/MyMood.png';
import Parkinson from '../../../assets/Parkinson.png';
import Physical from '../../../assets/Physical.png';


export default function AveragesDisplay({ averages }) {
  const sections = [
    { key: 'feeling', label: 'My Mood Avg', color: '#2563eb', icon: MyMood },
    { key: 'parkinson', label: 'Parkinson State Avg', color: '#dc2626', icon: Parkinson },
    { key: 'physical', label: 'Physical Difficulty Avg', color: '#22c55e', icon: Physical }
  ];

  return (
    <>
      <div
        className="graph-summary-label"
        style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 22,
          color: '#1e3a8a',
          marginTop: 32
        }}
      >
        Average Score For Each Feeling:
      </div>

      <div
        className="graph-summary"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          marginTop: 12,
          marginBottom: 24
        }}
      >
        {sections.map(({ key, label, color, icon }) => (
          <div
            key={key}
            className="graph-summary-box"
            style={{
              border: `2.5px solid ${color}`,
              color,
              borderRadius: 16,
              padding: 16,
              minWidth: 180,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 20,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <img
              src={icon}
              alt={label}
              style={{ width: 38, height: 38, marginBottom: 6 }}
            />
            <div>
              {label}: {averages[key] != null ? averages[key] : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}