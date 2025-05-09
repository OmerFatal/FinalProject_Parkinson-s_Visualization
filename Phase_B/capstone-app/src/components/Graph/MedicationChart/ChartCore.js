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
import MedicationTooltip from './MedicationTooltip';
import { medicationData, maxTotal, yTicks } from './ChartDataUtils';
import { pillColors, pillTypes } from './PillTypes';

export default function ChartCore({ isMobile, visibleTypes }) {
  const visibleTypeList = Array.from(visibleTypes);

  // כל התרופות שמותר להציג
  const visiblePillNames = Object.entries(pillColors).filter(([pillName]) =>
    visibleTypeList.some(type => {
      const pills = pillTypes[type];
      return pills && pills.includes(pillName);
    })
  );

  const visiblePillSet = new Set(visiblePillNames.map(([pill]) => pill));

  // סינון הזמנים – רק אם יש לפחות תרופה אחת מוצגת
  const filteredData = medicationData.filter(entry =>
    entry.medications.some(med => visiblePillSet.has(med.pillName))
  );

  // מציאת התרופה העליונה בפועל
  const renderedPills = Object.keys(pillColors);
  const topPillsPerTime = {};
  filteredData.forEach(entry => {
    const present = entry.medications.map(m => m.pillName);
    const last = renderedPills.findLast(p => present.includes(p) && visiblePillSet.has(p));
    if (last) topPillsPerTime[entry.time] = last;
  });

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
      <BarChart
        data={filteredData}
        margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
        barGap={0}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          interval={0}
          angle={-45}
          textAnchor="end"
          tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
          height={60}
        />
        <YAxis
          domain={[0, Math.max(maxTotal, 3)]}
          ticks={yTicks}
          interval={0}
          tickFormatter={value => (Number.isInteger(value) ? value : value.toFixed(2))}
          tick={{ fontSize: isMobile ? 10 : 16, fontWeight: 'bold', fill: '#000' }}
        />
        <Tooltip content={<MedicationTooltip />} />

        {visiblePillNames.map(([pillName, color]) => (
          <Bar
            key={pillName}
            dataKey={pillName}
            stackId="a"
            fill={color}
            barSize={isMobile ? 24 : 40}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${pillName}-${index}`}
                radius={
                  topPillsPerTime[entry.time] === pillName
                    ? [10, 10, 0, 0]
                    : [0, 0, 0, 0]
                }
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
