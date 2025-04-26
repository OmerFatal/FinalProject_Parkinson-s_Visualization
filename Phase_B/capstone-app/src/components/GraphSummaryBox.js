import React from 'react';

export default function GraphSummaryBox({ sampleData, initialAverages, icons }) {
  const avg = (data, key) => {
    const sum = data.reduce((total, entry) => total + entry[key], 0);
    return (sum / data.length).toFixed(2);
  };

  const getDisplayAverage = (key) => {
    if (initialAverages && Object.prototype.hasOwnProperty.call(initialAverages, key)) {
      return initialAverages[key] != null ? initialAverages[key] : 'N/A';
    }
    const computed = avg(sampleData, key);
    return computed != null ? computed : 'N/A';
  };

  const sections = [
    { key: 'feeling', label: 'My Mood Avg', color: '#2563eb', icon: icons.MyMood },
    { key: 'parkinson', label: 'Parkinson State Avg', color: '#dc2626', icon: icons.Parkinson },
    { key: 'physical', label: 'Physical Difficulty Avg', color: '#22c55e', icon: icons.Physical }
  ];

  return (
    <>
      <div className="graph-summary-label">Average Score For Each Feeling:</div>
      <div className="graph-summary">
        {sections.map(({ key, label, color, icon }) => (
          <div key={key} className="graph-summary-box" style={{ borderColor: color, color: color }}>
            <img src={icon} alt={label} />
            <span>{label}: {getDisplayAverage(key)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
