import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const data = [
  { name: 'Fruits', value: 2 },
  { name: 'Vegetables', value: 6 },
  { name: 'Carbohydrates', value: 5 },
  { name: 'Proteins', value: 3 },
  { name: 'Dairy', value: 2 },
  { name: 'Sugars', value: 1 },
  { name: 'Beverages', value: 2 }
];

export default function NutritionChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <XAxis
            dataKey="name"
            angle={-25}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis label={{ value: 'Servings (Units)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="value" fill="#4ade80">
            <LabelList dataKey="value" position="top" style={{ fontWeight: 'bold' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
