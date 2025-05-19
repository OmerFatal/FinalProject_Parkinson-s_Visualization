// src/components/Graph/CombinedStateTimelineGraph/VerticalLinesWithIcons.js

import React from 'react';

export default function VerticalLinesWithIcons({ points, yScale, xScale }) {
  return (
    <g>
      {points.map((pt, i) => {
        if (!pt.actionIcon) return null;
        let x = xScale(pt.timeMinutes);
        if (i === 0) x += 12;
        const y = yScale(3);
        return (
          <g key={i}>
            <line
              x1={x}
              y1={yScale.range()[0]}
              x2={x}
              y2={y}
              stroke="#6366f1"
              strokeWidth={3}
              opacity={0.25}
            />
            <text
              x={x}
              y={y + 6}
              textAnchor="middle"
              fontSize={20}
              filter="url(#shadow)"
            >
              {pt.actionIcon}
            </text>
          </g>
        );
      })}
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#6366f1"
            floodOpacity="0.18"
          />
        </filter>
      </defs>
    </g>
  );
}
