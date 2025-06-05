import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ProteinTooltip from './ProteinTooltip';
import useProteinData from './useProteinData';

import './ProteinChart.css';

export default function ProteinChart({ entries = [], date }) {
  const isMobile = window.innerWidth <= 768;
  const proteinData = useProteinData(entries, date);

  return (
    <div className="protein-chart-wrapper">
      <h2 className="protein-chart-title">
        Protein Intake Analysis
      </h2>

      {proteinData.length === 0 ? (
        <div className="protein-chart-no-data">
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
              fill="#2ecc71"
              radius={[6, 6, 0, 0]}
              barSize={isMobile ? 24 : 40}
            >
              {proteinData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  stroke="black"
                  strokeWidth={2.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
