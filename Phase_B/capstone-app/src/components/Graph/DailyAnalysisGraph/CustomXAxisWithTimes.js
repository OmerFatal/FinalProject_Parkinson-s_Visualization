import React from 'react';
import { formatTime } from './utils';

export default function CustomXAxisWithTimes({ x, y, ticks, xScale }) {
  return (
    <g>
      {ticks.map((tick, i) => {
        let xPos = xScale(tick.value);
        if (i === 0) xPos += 12;
        return (
          <g key={i} transform={`rotate(-18,${xPos},${y + 28})`}>
            <text
              x={xPos}
              y={y + 28}
              textAnchor="middle"
              fontSize={16}
              fontWeight="bold"
              fill="#1e3a8a"
            >
              {formatTime(tick.value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}