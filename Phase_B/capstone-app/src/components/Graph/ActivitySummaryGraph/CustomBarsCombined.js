import React from 'react';

const categoryColors = {
  Sport: '#3b82f6',
  Cognitive: '#10b981',
  Household: '#f59e0b'
};

function parseTimeToFloat(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [h = '0', m = '0'] = timeStr.trim().split(':');
  return parseInt(h) + parseInt(m) / 60;
}

export default function CustomBarsCombined({
  xAxisMap,
  yAxisMap,
  xAxisId,
  yAxisId,
  setTooltip,
  activityData,
  categoryPositions,
}) {
  if (!xAxisMap[xAxisId] || !yAxisMap[yAxisId]) return null;

  const xScale = xAxisMap[xAxisId].scale;
  const yScale = yAxisMap[yAxisId].scale;

  return activityData.map((activity, index) => {
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
