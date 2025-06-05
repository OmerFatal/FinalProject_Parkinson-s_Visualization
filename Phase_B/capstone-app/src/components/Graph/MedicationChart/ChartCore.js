import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import MedicationTooltip from './MedicationTooltip';
import { pillColors, pillTypes } from './PillTypes';

export default function ChartCore({ isMobile, visibleTypes = Object.keys(pillTypes), medicationData }) {
  const normalize = (s) => s?.replace(/\s+/g, ' ').trim().toLowerCase();

  // Map of normalizedName -> originalName (for coloring)
  const originalNameMap = {};

  // אוסף את כל שמות התרופות לפי הקבוצות המסומנות
  const visiblePillNames = new Set();
  visibleTypes.forEach(type => {
    (pillTypes[type] || []).forEach(original => {
      const n = normalize(original);
      visiblePillNames.add(n);
      originalNameMap[n] = original;
    });
  });

  const filteredData = medicationData
    .map(entry => {
      const meds = entry.medications.filter(m =>
        visiblePillNames.has(normalize(m.pillName))
      );

      // ✅ בדיקת דיבאג ספציפית לשעה 22:25
      if (entry.time === '22:25') {
        console.log('🕒 22:25 entry:', entry);
        console.log('🔎 Dopicar 250 mg medication exists in entry?',
          entry.medications.find(m => normalize(m.pillName) === 'dopicar 250 mg')
        );
        console.log('✅ visiblePillNames:', Array.from(visiblePillNames));
        console.log('🔍 meds that passed filter:', meds.map(m => m.pillName));
        console.log('✅ visiblePillNames has dopicar 250 mg:',
          visiblePillNames.has('dopicar 250 mg')
        );
      }

      if (!meds.length) return null;

      const obj = { time: entry.time, medications: meds };
      meds.forEach(m => {
        const name = normalize(m.pillName);
        obj[name] = m.amount;
      });
      return obj;
    })
    .filter(Boolean);

  const renderedPills = Array.from(visiblePillNames);
  const topPillsPerTime = {};
  filteredData.forEach(entry => {
    const present = entry.medications.map(m => normalize(m.pillName));
    const last = renderedPills.findLast(p => present.includes(p));
    if (last) topPillsPerTime[entry.time] = last;
  });

  const maxTotal = Math.ceil(
    Math.max(...filteredData.map(entry =>
      entry.medications.reduce((sum, med) => sum + med.amount, 0)
    ), 0)
  );

const step = maxTotal <= 2 ? 0.5 : 1;  // 🔁 התאמה חכמה לפי טווח כולל
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
