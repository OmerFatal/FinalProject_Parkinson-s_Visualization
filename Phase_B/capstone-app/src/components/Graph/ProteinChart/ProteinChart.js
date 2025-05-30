// ProteinChart.js

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ProteinTooltip from './ProteinTooltip';

export default function ProteinChart({ entries = [], date }) {
  const isMobile = window.innerWidth <= 768;
  const [proteinData, setProteinData] = useState([]);

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    const nutritionEntries = entries.filter(row =>
      row.Report === 'Nutrition' &&
      row.Date === date &&
      row.Time &&
      row.Type &&
      row.Notes
    );

    const formatted = nutritionEntries.map(row => {
      // שליפת ערך החלבון מהשדה Notes
      const match = row.Notes.match(/Proteins:\s*(\d+)g/i);
      const proteinValue = match ? Number(match[1]) : 0;

      return {
        time: row.Time.slice(0, 5), // חותך את השניות
        protein: proteinValue,
        food: row.Type,
        notes: row.Notes.trim()
      };
    });

    setProteinData(formatted);
  }, [entries, date]);

  return (
    <div style={{ width: '100%', padding: '0 24px' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Protein Intake Analysis
      </h2>

      {proteinData.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
          No protein intake data for this day.
        </div>
      ) : (
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
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
