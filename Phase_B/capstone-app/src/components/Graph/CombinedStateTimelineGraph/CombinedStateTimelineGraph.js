import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Customized,
  CartesianGrid
} from 'recharts';

import dailyEntries from '../dailyEntries';
import ToggleButtons from '../DailyAnalysisGraph/ToggleButtons';
import LegendSection from '../DailyAnalysisGraph/LegendSection';

import {
  buildActionTimeline,
  buildFullTimeline,
  buildLineData,
  formatDate
} from './utils';

import VerticalLinesWithIcons from './VerticalLinesWithIcons';
import FeelingDots from './FeelingDots';
import CustomXAxisWithTimes from './CustomXAxisWithTimes';
import AveragesDisplay from './AveragesDisplay';

export default function CombinedStateTimelineGraph({ initialAverages, date }) {
  const availableLines = {
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  };

  const [visibleLines, setVisibleLines] = useState({
    feeling: availableLines.feeling,
    parkinson: availableLines.parkinson,
    physical: availableLines.physical
  });

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const actionTimeline = buildActionTimeline(dailyEntries);
  const lastActionTime = actionTimeline[actionTimeline.length - 1];
  const fullTimeline = buildFullTimeline(dailyEntries).filter(t => t <= lastActionTime);
  const data = buildLineData(dailyEntries, fullTimeline);

  const displayDate = date ? formatDate(date) : '';

  return (
    <div>
      <h1 className="graph-title">📊 Daily Analysis{displayDate ? ` - ${displayDate}` : ''}</h1>

      <ToggleButtons
        visibleLines={visibleLines}
        toggleLine={toggleLine}
        availableLines={availableLines}
      />

      <LegendSection />

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />

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

            <YAxis
              domain={[0, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fill: '#000', fontSize: 18, fontWeight: 'bold' }}
              axisLine={true}
              label={{
                value: 'Score (1=Best, 5=Worst)',
                angle: -90,
                position: 'insideLeft',
                fill: '#000',
                fontSize: 20,
                fontWeight: 'bold',
                dy: 85
              }}
            />

            {visibleLines.feeling && (
              <Line type="monotone" dataKey="feeling" stroke="#2563eb" name="My Mood" dot={false} strokeWidth={3} isAnimationActive={false} />
            )}
            {visibleLines.parkinson && (
              <Line type="monotone" dataKey="parkinson" stroke="#dc2626" name="Parkinson State" strokeDasharray="5 5" dot={false} strokeWidth={3} isAnimationActive={false} />
            )}
            {visibleLines.physical && (
              <Line type="monotone" dataKey="physical" stroke="#22c55e" name="Physical Difficulty" strokeDasharray="4 2" dot={false} strokeWidth={3} isAnimationActive={false} />
            )}

            <Customized
              component={({ xAxisMap, yAxisMap }) => (
                <>
                  <VerticalLinesWithIcons
                    points={data}
                    yScale={yAxisMap[Object.keys(yAxisMap)[0]].scale}
                    xScale={xAxisMap[Object.keys(xAxisMap)[0]].scale}
                  />
                  <FeelingDots
                    data={data}
                    yScale={yAxisMap[Object.keys(yAxisMap)[0]].scale}
                    xScale={xAxisMap[Object.keys(xAxisMap)[0]].scale}
                    visibleLines={visibleLines}
                  />
                  <CustomXAxisWithTimes
                    x={xAxisMap[Object.keys(xAxisMap)[0]].x}
                    y={xAxisMap[Object.keys(xAxisMap)[0]].y}
                    ticks={actionTimeline.map((t) => ({ value: t }))}
                    xScale={xAxisMap[Object.keys(xAxisMap)[0]].scale}
                  />
                </>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AveragesDisplay averages={initialAverages || {}} />
    </div>
  );
}
