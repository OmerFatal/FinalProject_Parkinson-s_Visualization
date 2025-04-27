import React from 'react';

export default function CustomXAxisTick({ x, y, payload, sampleData }) {
  const entry = sampleData.find(d => d.timeMinutes === payload?.value);
  if (!entry) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-5}
        y={0}
        dx={-8}
        textAnchor="end"
        transform="rotate(-60)"
        fontSize={12}
        fill="#000"
        fontWeight="bold"
      >
        {entry.time}
      </text>
    </g>
  );
}
