import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Customized
} from 'recharts';

import VerticalLinesWithIcons from './VerticalLinesWithIcons';
import FeelingDots from './FeelingDots';
import CustomXAxisWithTimes from './CustomXAxisWithTimes';

export default function GraphContainer({ data, visibleLines, actionTimeline, lastActionTime }) {
  // Helper to extract first scale from axisMap
  const getScale = (axisMap) => axisMap[Object.keys(axisMap)[0]];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 70 }}>
           {/*Background grid*/}
          <CartesianGrid strokeDasharray="3 3" />

           {/* X-axis: time of day (minutes) */}
          <XAxis
            dataKey="timeMinutes"
            type="number"
            ticks={actionTimeline}
            domain={[actionTimeline[0], lastActionTime]}
            allowDuplicatedCategory={false}
            axisLine={true}
            tick={false}
            height={60}
          />
          {/* Y-axis: feeling scale 1–5*/}
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: '#000', fontSize: 18, fontWeight: 'bold' }}
            axisLine={true}
          />
          {/* My Mood line (solid blue) */}
          {visibleLines.feeling && (
            <Line type="linear" dataKey="feeling" stroke="#2563eb" name="My Mood" dot={false} strokeWidth={3} isAnimationActive={false} />
          )}
          {/* Parkinson line (dashed red) */}
          {visibleLines.parkinson && (
            <Line type="linear" dataKey="parkinson" stroke="#dc2626" name="Parkinson State" strokeDasharray="5 5" dot={false} strokeWidth={3} isAnimationActive={false} />
          )}
          {/* Physical line (dotted green) */}
          {visibleLines.physical && (
            <Line type="linear" dataKey="physical" stroke="#22c55e" name="Physical Difficulty" strokeDasharray="4 2" dot={false} strokeWidth={3} isAnimationActive={false} />
          )}
          {/* Custom overlays: vertical icons, dots, x-axis ticks*/}
          <Customized
            component={({ xAxisMap, yAxisMap }) => (
              <>
                <VerticalLinesWithIcons
                  points={data}
                  yScale={getScale(yAxisMap).scale}
                  xScale={getScale(xAxisMap).scale}
                />
                <FeelingDots
                  data={data}
                  yScale={getScale(yAxisMap).scale}
                  xScale={getScale(xAxisMap).scale}
                  visibleLines={visibleLines}
                />
                <CustomXAxisWithTimes
                  x={getScale(xAxisMap).x}
                  y={getScale(xAxisMap).y}
                  ticks={actionTimeline.map((t) => ({ value: t }))}
                  xScale={getScale(xAxisMap).scale}
                />
              </>
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}