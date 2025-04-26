// CustomBars.js

import React from 'react';
import activityData from './activityData';

const categoryColors = {
  Sport: '#3b82f6',
  Cognitive: '#10b981',
  Household: '#f59e0b'
};

function parseTimeToFloat(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

export default function CustomBars({ xAxisMap, yAxisMap, xAxisId, yAxisId, setTooltip }) {
  return activityData.map((activity, index) => {
    const startTime = parseTimeToFloat(activity.time);
    const xStart = xAxisMap[xAxisId].scale(startTime);
    const barWidth = (activity.duration / 60) * (xAxisMap[xAxisId].scale(1) - xAxisMap[xAxisId].scale(0));
    const y = yAxisMap[yAxisId].scale(activity.category);
    const barHeight = 20;

    return (
      <rect
        key={index}
        x={xStart}
        y={y - barHeight / 2}
        width={barWidth}
        height={barHeight}
        rx={4}
        fill={categoryColors[activity.category] || '#888'}
        onMouseEnter={(e) => {
          setTooltip({
            x: e.clientX,
            y: e.clientY,
            activity
          });
        }}
        onMouseLeave={() => setTooltip(null)}
      />
    );
  });
}
