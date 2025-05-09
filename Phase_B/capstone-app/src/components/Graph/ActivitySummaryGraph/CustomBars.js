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
    const xScale = xAxisMap[xAxisId].scale;
    const yScale = yAxisMap[yAxisId].scale;

    const xStart = xScale(startTime);
    const barWidth = (activity.duration / 60) * (xScale(1) - xScale(0));

    const bandWidth = yScale.bandwidth ? yScale.bandwidth() : 30;
    const barHeight = 20;
    const y = yScale(activity.category) + (bandWidth - barHeight) / 2;

    return (
      <rect
        key={index}
        x={xStart}
        y={y}
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
