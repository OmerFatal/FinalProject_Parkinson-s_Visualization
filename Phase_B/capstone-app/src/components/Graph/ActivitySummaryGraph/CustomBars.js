import React from 'react';

{/* Color scheme for each category */}
const categoryColors = {
  Sport: '#3b82f6',
  Cognitive: '#10b981',
  Household: '#f59e0b'
};

{/* Convert time string (HH:mm) to float hours */}
function parseTimeToFloat(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [h = '0', m = '0'] = timeStr.trim().split(':');
  return parseInt(h) + parseInt(m) / 60;
}

export default function CustomBars({ xAxisMap, yAxisMap, xAxisId, yAxisId, setTooltip, data }) {
  if (!xAxisMap[xAxisId] || !yAxisMap[yAxisId]) return null;

  const xScale = xAxisMap[xAxisId].scale;
  const yScale = yAxisMap[yAxisId].scale;

  return data.map((activity, index) => {
    {/* Determine X start based on time */}
    const startTime = activity.timeMinutes !== undefined
      ? activity.timeMinutes
      : parseTimeToFloat(activity.time);

    const xStart = xScale(startTime);
    const barWidth = (activity.duration / 60) * (xScale(1) - xScale(0));
    
    {/* Vertically center the bar in its Y band */}
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
        stroke="black"
        strokeWidth={2.5}
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
