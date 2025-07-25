import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import MedicationTooltip from './MedicationTooltip';
import { pillColors, pillTypes } from './PillTypes';

export default function ChartCore({ isMobile, visibleTypes = Object.keys(pillTypes), medicationData }) {
  // Normalize a pill name (remove extra spaces, lowercase)
  const normalize = (s) => s?.replace(/\s+/g, ' ').trim().toLowerCase();

  const originalNameMap = {};
  const visiblePillNames = new Set();

  // Convert visible types to normalized pill names
  visibleTypes.forEach(type => {
    (pillTypes[type] || []).forEach(original => {
      const n = normalize(original);
      visiblePillNames.add(n);
      originalNameMap[n] = original;
    });
  });

  // Filter and restructure medication data for chart use
  const filteredData = medicationData
    .map(entry => {
      const meds = entry.medications.filter(m =>
        visiblePillNames.has(normalize(m.pillName))
      );

      if (!meds.length) return null;

      const obj = { time: entry.time, medications: meds };
      meds.forEach(m => {
        const name = normalize(m.pillName);
        obj[name] = m.amount;
      });
      return obj;
    })
    .filter(Boolean);

  // Determine which pill is the "top" one per time (for rounded corners)
  const renderedPills = Array.from(visiblePillNames);
  const topPillsPerTime = {};
  filteredData.forEach(entry => {
    const present = entry.medications.map(m => normalize(m.pillName));
    const last = renderedPills.findLast(p => present.includes(p));
    if (last) topPillsPerTime[entry.time] = last;
  });

  // Compute Y-axis max and tick step
  const maxTotal = Math.ceil(
    Math.max(...filteredData.map(entry =>
      entry.medications.reduce((sum, med) => sum + med.amount, 0)
    ), 0)
  );

  const step = maxTotal <= 2 ? 0.5 : 1;
  const yTicks = [];
  for (let i = 0; i <= maxTotal; i += step) {
    yTicks.push(Number(i.toFixed(2)));
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
      <BarChart
        data={filteredData}
        margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
        barGap={0}
        barCategoryGap="20%"
      >
        {/* Grid background */}
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-axis: time */}
        <XAxis
          dataKey="time"
          interval={0}
          angle={-45}
          textAnchor="end"
          tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
          height={60}
        />

        {/* Y-axis: dosage */}
        <YAxis
          domain={[0, Math.max(maxTotal, 3)]}
          ticks={yTicks}
          interval={0}
          tickFormatter={value => (Number.isInteger(value) ? value : value.toFixed(2))}
          tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
        />

        {/* Tooltip on hover */}
        <Tooltip content={<MedicationTooltip />} />

        {/* Bar for each visible pill */}
        {renderedPills.map(pillName => (
          <Bar
            key={pillName}
            dataKey={pillName}
            stackId="a"
            fill={
              (() => {
                const category = Object.entries(pillTypes).find(([cat, names]) =>
                  names.includes(originalNameMap[pillName])
                )?.[0];
                return pillColors[category] || '#aaa';
              })()
            }
            barSize={isMobile ? 24 : 40}
          >
            {/* Rounded corners only for top-most pill in each stack */}
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${pillName}-${index}`}
                radius={topPillsPerTime[entry.time] === pillName ? [10, 10, 0, 0] : [0, 0, 0, 0]}
                stroke="black"
                strokeWidth={2.5}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
