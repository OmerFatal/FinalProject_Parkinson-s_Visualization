// CustomBarsCombined.js
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

export default function CustomBarsCombined({
  xAxisMap,
  yAxisMap,
  xAxisId,
  yAxisId,
  setTooltip,
  activityData: activityDataProp,
  categoryPositions,
}) {
  if (!xAxisMap[xAxisId] || !yAxisMap[yAxisId]) return null;

  const barsData = activityDataProp || activityData;
  const xScale = xAxisMap[xAxisId].scale;
  const yScale = yAxisMap[yAxisId].scale;

  return barsData.map((activity, index) => {
    const xValue = activity.timeMinutes !== undefined
      ? activity.timeMinutes
      : parseTimeToFloat(activity.time) * 60;

    const maxTime = 1440; // סוף היום בדקות
    const endMinutes = xValue + activity.duration;
    const clampedDuration = Math.min(activity.duration, maxTime - xValue);

    const xStart = xScale(xValue);
    const xEnd = xScale(xValue + clampedDuration);
    const xStartClamped = Math.max(xStart, xScale.range()[0]);
    const xEndClamped = Math.min(xEnd, xScale.range()[1]);
    const barWidth = Math.max(xEndClamped - xStartClamped, 2);

    const categoryYVal = categoryPositions?.[activity.category];
    if (categoryYVal == null) return null;

    const yCenter = yScale(categoryYVal);
    const barHeight = 28;
    const yPos = yCenter - barHeight / 2;

    return (
      <rect
        key={index}
        x={xStartClamped}
        y={yPos}
        width={barWidth}
        height={barHeight}
        rx={8}
        fill={categoryColors[activity.category] || '#888'}
        fillOpacity={0.7}
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
