// ProteinChart.js

import React from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import proteinData from './proteinData';
import ProteinTooltip from './ProteinTooltip';

export default function ProteinChart() {
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ width: '100%', padding: '0 24px' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Protein Intake and State Analysis
      </h2>

      <ResponsiveContainer width="100%" height={isMobile ? 280 : 340}>
        <BarChart
          data={proteinData}
          margin={{ top: 10, right: 20, left: 10, bottom: 50 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
            height={60}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
            label={{
              value: 'Protein (g)',
              angle: -90,
              position: 'insideLeft',
              fontSize: isMobile ? 10 : 16,
              fontWeight: 'bold',
              fill: '#000',
              dy: 70
            }}
          />
          <Tooltip content={<ProteinTooltip />} />

          <Bar
            dataKey="protein"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            barSize={isMobile ? 24 : 40}
          />

          {/* קווים למצבים */}
          <Line
            type="monotone"
            dataKey="feeling"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Mood"
          />
          <Line
            type="monotone"
            dataKey="physical"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Physical"
          />
          <Line
            type="monotone"
            dataKey="parkinson"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Parkinson"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
