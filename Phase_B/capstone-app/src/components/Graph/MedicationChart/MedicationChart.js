import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Sample data – תוכל להחליף בעתיד בנתונים אמיתיים
const data = [
    { time: '06:30', quantity: 1, name: 'Dopicar 250' },
    { time: '08:00', quantity: 1, name: 'Azilect' },
    { time: '09:30', quantity: 2, name: 'Sinemet CR' },
    { time: '11:00', quantity: 1, name: 'Dopicar 250' },
    { time: '13:30', quantity: 1, name: 'Stalevo' },
    { time: '16:00', quantity: 2, name: 'Sinemet' },
    { time: '19:00', quantity: 1, name: 'Dopicar 250' },
    { time: '22:00', quantity: 1, name: 'Azilect' }
  ];
  

// Tooltip custom display
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div><strong>{entry.name}</strong></div>
        <div>Time: {entry.time}</div>
        <div>{entry.quantity} pill(s)</div>
      </div>
    );
  }
  return null;
};

export default function MedicationChart() {
  return (
    <div style={{ width: '100%', padding: '0 24px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Medication Intake Throughout the Day
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 16, fontWeight: 'bold', fill: '#000' }}
            height={60}
          />
          <YAxis
            tick={{ fontSize: 16, fontWeight: 'bold', fill: '#000' }}
            label={{
              value: 'Pills Taken',
              angle: -90,
              position: 'insideLeft',
              fontSize: 16,
              fontWeight: 'bold',
              fill: '#000',
              dy: 70
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="quantity"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            barSize={40} // ✅ רוחב עמודות קבוע
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
