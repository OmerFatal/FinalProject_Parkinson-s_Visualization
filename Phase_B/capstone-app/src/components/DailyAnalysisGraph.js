import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './DailyAnalysisGraph.css';
import MyMood from '../assets/MyMood.png';
import Parkinson from '../assets/Parkinson.png';
import Physical from '../assets/Physical.png';

const iconMap = {
  sleep: '😴',
  medication: '💊',
  nutrition: '🍽️',
  activity: '🚶‍♂️'
};

const activityIcons = ['medication', 'nutrition', 'activity'];

const generateRandomData = (seed) => {
  const entries = [];
  const timesUsed = new Set();
  const seededRandom = (s) => {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const randomTime = (s) => {
    const hour = Math.floor(seededRandom(s) * 18) + 6;
    const minute = Math.floor(seededRandom(s + 0.5) * 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // שינה בתחילת היום
  entries.push({
    time: '06:00',
    feeling: +(seededRandom(seed + 1) * 4 + 1).toFixed(2),
    parkinson: +(seededRandom(seed + 2) * 4 + 1).toFixed(2),
    physical: +(seededRandom(seed + 3) * 4 + 1).toFixed(2),
    icon: 'sleep'
  });
  timesUsed.add('06:00');

  const count = Math.floor(seededRandom(seed + 99) * 5) + 6; // 6–10 פעילויות אמצע
  for (let i = 0; i < count; i++) {
    let time, attempt = 0;
    do {
      time = randomTime(seed + i + attempt);
      attempt++;
    } while (timesUsed.has(time) && attempt < 10);

    if (timesUsed.has(time)) continue;
    timesUsed.add(time);

    entries.push({
      time,
      feeling: +(seededRandom(seed * (i + 2)) * 4 + 1).toFixed(2),
      parkinson: +(seededRandom(seed * (i + 3)) * 4 + 1).toFixed(2),
      physical: +(seededRandom(seed * (i + 4)) * 4 + 1).toFixed(2),
      icon: activityIcons[Math.floor(seededRandom(seed * (i + 5)) * activityIcons.length)]
    });
  }

  // שינה בסיום היום
  entries.push({
    time: '23:00',
    feeling: +(seededRandom(seed + 100) * 4 + 1).toFixed(2),
    parkinson: +(seededRandom(seed + 101) * 4 + 1).toFixed(2),
    physical: +(seededRandom(seed + 102) * 4 + 1).toFixed(2),
    icon: 'sleep'
  });
  timesUsed.add('23:00');

  return entries.sort((a, b) => a.time.localeCompare(b.time));
};

const CustomXAxisTick = ({ x, y, payload, sampleData }) => {
  const entry = sampleData.find(d => d.time === payload.value);
  const icon = iconMap[entry?.icon];

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={10} textAnchor="middle" fontSize={20}>
        {icon}
      </text>
      <text x={0} y={28} textAnchor="middle" fontSize={11} fill="#111" fontWeight="bold">
        {payload.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '180px',
      lineHeight: '1.6'
    }}>
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            color: entry.color,
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px'
          }}
        >
          {entry.name}: <span style={{ fontWeight: '700' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const avg = (sampleData, key) => {
  const sum = sampleData.reduce((total, entry) => total + entry[key], 0);
  return (sum / sampleData.length).toFixed(2);
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export default function DailyAnalysisGraph({ date }) {
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    const seed = date
      ? parseInt(date.replaceAll('-', ''), 10)
      : parseInt(new Date().toISOString().split('T')[0].replaceAll('-', ''), 10);
    setSampleData(generateRandomData(seed));
  }, [date]);

  const [visibleLines, setVisibleLines] = useState({
    feeling: true,
    parkinson: true,
    physical: true
  });

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasVisibleLines = visibleLines.feeling || visibleLines.parkinson || visibleLines.physical;
  const displayDate = date ? formatDate(date) : formatDate(new Date());

  return (
    <div className="graph-wrapper">
      <h2 className="graph-title">📊 Daily Analysis - {displayDate}</h2>

      <div className="graph-buttons">
        {[ 
          { key: 'feeling', label: 'My Mood', color: '#2563eb' },
          { key: 'parkinson', label: 'Parkinson State', color: '#dc2626' },
          { key: 'physical', label: 'Physical Difficulty', color: '#22c55e' }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLine(key)}
            className="graph-button"
            style={{
              border: `2px solid ${visibleLines[key] ? color : '#cbd5e1'}`,
              backgroundColor: visibleLines[key] ? color : '#f1f5f9',
              color: visibleLines[key] ? 'white' : '#1e293b'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="graph-summary">
        {[ 
          { key: 'feeling', label: 'My Mood Avg', color: '#2563eb', icon: MyMood },
          { key: 'parkinson', label: 'Parkinson State Avg', color: '#dc2626', icon: Parkinson },
          { key: 'physical', label: 'Physical Difficulty Avg', color: '#22c55e', icon: Physical }
        ].map(({ key, label, color, icon }) => (
          <div key={key} className="graph-summary-box" style={{ backgroundColor: color }}>
            <img src={icon} alt={label} style={{ width: '24px', height: '24px' }} />
            <span>{label}: {avg(sampleData, key)}</span>
          </div>
        ))}
      </div>

      <div className="legend-wrapper">
        <div className="legend-container">
          <div className="legend-group">
            <div className="legend-badge" style={{ color: '#2563eb' }}>─ My Mood</div>
            <div className="legend-badge" style={{ color: '#dc2626' }}>─ Parkinson State</div>
            <div className="legend-badge" style={{ color: '#22c55e' }}>─ Physical Difficulty</div>
          </div>
        </div>

        <div className="legend-container">
          <div className="legend-group">
            <div className="legend-badge">😴 Sleep</div>
            <div className="legend-badge">💊 Medication</div>
            <div className="legend-badge">🍽️ Nutrition</div>
            <div className="legend-badge">🚶‍♂️ Activity</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {hasVisibleLines && (
            <XAxis
              dataKey="time"
              tick={(props) => <CustomXAxisTick {...props} sampleData={sampleData} />}
              interval={0}
            />
          )}
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} label={{ value: 'Score (1=Best, 5=Worst)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          {visibleLines.feeling && (
            <Line type="monotone" dataKey="feeling" stroke="#2563eb" name="My Mood" dot={{ r: 6 }} strokeWidth={3} />
          )}
          {visibleLines.parkinson && (
            <Line type="monotone" dataKey="parkinson" stroke="#dc2626" name="Parkinson State" strokeDasharray="5 5" dot={{ r: 6 }} strokeWidth={3} />
          )}
          {visibleLines.physical && (
            <Line type="monotone" dataKey="physical" stroke="#22c55e" name="Physical Difficulty" strokeDasharray="4 2" dot={{ r: 6 }} strokeWidth={3} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
