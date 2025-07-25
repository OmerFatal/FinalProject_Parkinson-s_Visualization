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
  // Detect if user is on a mobile device
  const isMobile = window.innerWidth <= 768;

  // Extract protein entries for the selected date
  const proteinData = useProteinData(entries, date);

  return (
    <div className="protein-chart-wrapper">
      {/* Title with formatted date */}
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Protein Intake Summary – {new Date(date).toLocaleDateString('en-GB')}
      </h2>

      {/* Show message if no data exists */}
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
            {/* Grid lines */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis: time of day */}
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
              height={60}
            />

            {/* Y-axis: grams of protein */}
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

            {/* Custom tooltip on hover */}
            <Tooltip content={<ProteinTooltip />} />

            {/* Bar for each protein entry */}
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
