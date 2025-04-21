import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const data = [
  { name: 'Sleep Hours', value: 8, fill: '#fef9c3' },
  { name: 'Exercise Hours', value: 5, fill: '#bae6fd' }
];

export default function SleepExerciseChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, 24]}
            label={{ value: 'Hours in a 24-Hour Day', position: 'bottom', offset: 0 }}
          />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar
            dataKey="value"
            isAnimationActive={false}
            shape={(props) => <rect {...props} fill={props.fill} />}
          >
            <LabelList
              dataKey="value"
              position="insideRight"
              formatter={(v) => `${v} hrs`}
              style={{ fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
