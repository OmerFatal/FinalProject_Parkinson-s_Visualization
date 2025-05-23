import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized
} from 'recharts';

import CustomTooltip from './DailyAnalysisGraph/CustomTooltip';
import CustomXAxisTick from './DailyAnalysisGraph/CustomXAxisTick';
import LegendSection from './DailyAnalysisGraph/LegendSection';
import ToggleButtons from './DailyAnalysisGraph/ToggleButtons';
import { generateSampleData } from './DailyAnalysisGraph/generateSampleData';
import activityDataRaw from './ActivitySummaryGraph/activityData';
import CustomBarsCombined from './ActivitySummaryGraph/CustomBarsCombined';
import ActivityTooltip from './ActivitySummaryGraph/ActivityTooltip';

const toMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// 🧭 מיפוי קטגוריות לערכים מספריים לציר Y (ימני)
const categoryPositions = {
  Sport: 1,
  Cognitive: 3,
  Household: 5
};

export default function CombinedGraph({ date, initialAverages }) {
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

  const [sampleData, setSampleData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [showActivity, setShowActivity] = useState(false);
  const [activityTooltip, setActivityTooltip] = useState(null);

  useEffect(() => {
    setSampleData(generateSampleData());

    const formatted = activityDataRaw.map(item => ({
      ...item,
      timeMinutes: toMinutes(item.time)
    }));
    setActivityData(formatted);
  }, [date]);

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedSampleData = [...sampleData].sort((a, b) => a.timeMinutes - b.timeMinutes);

  // 🧮 מחשב מתי הפעולה האחרונה באמת מסתיימת
  const lastActivityEnd = Math.max(
    ...activityData.map(a => a.timeMinutes + a.duration)
  );

  const xMax = Math.max(
    sortedSampleData[sortedSampleData.length - 1]?.timeMinutes || 0,
    lastActivityEnd
  );

  return (
    <div className="graph-wrapper">
      <h2 className="graph-title">🧠 Daily & Activity Combined Graph</h2>

      <ToggleButtons
        visibleLines={visibleLines}
        toggleLine={toggleLine}
        availableLines={availableLines}
      />

      <LegendSection />

      <button
        onClick={() => setShowActivity(!showActivity)}
        className="toggle-activity-btn"
        style={{
          margin: '10px auto',
          display: 'block',
          padding: '8px 16px',
          borderRadius: '6px',
          backgroundColor: '#444',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {showActivity ? 'Hide Activity Layer' : 'Show Activity Layer'}
      </button>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={sampleData}
          margin={{ top: 10, right: 70, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timeMinutes"
            type="number"
            domain={[
              sortedSampleData[0]?.timeMinutes || 0,
              xMax
            ]}
            tick={(props) => <CustomXAxisTick {...props} sampleData={sortedSampleData} />}
            xAxisId="x"
            ticks={sortedSampleData.map(d => d.timeMinutes)}
            allowDuplicatedCategory={false}
          />

          <YAxis
            yAxisId="left"
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: '#000', fontSize: 14, fontWeight: 'bold' }}
          />

          {showActivity && (
            <YAxis
              yAxisId="right"
              orientation="right"
              type="number"
              domain={[0, 6]}
              ticks={[1, 3, 5]}
              tickFormatter={(val) => {
                const entry = Object.entries(categoryPositions).find(([, pos]) => pos === val);
                return entry?.[0] || '';
              }}
              tick={{ fill: '#555', fontSize: 12, fontWeight: 'bold' }}
            />
          )}

          <Tooltip content={<CustomTooltip visibleLines={visibleLines} />} />

          {visibleLines.feeling && (
            <Line
              type="linear"
              dataKey="feeling"
              stroke="#2563eb"
              dot={{ r: 6 }}
              strokeWidth={3}
              yAxisId="left"
              xAxisId="x"
              name="My Mood"
            />
          )}
          {visibleLines.parkinson && (
            <Line
              type="linear"
              dataKey="parkinson"
              stroke="#dc2626"
              strokeDasharray="5 5"
              dot={{ r: 6 }}
              strokeWidth={3}
              yAxisId="left"
              xAxisId="x"
              name="Parkinson State"
            />
          )}
          {visibleLines.physical && (
            <Line
              type="linear"
              dataKey="physical"
              stroke="#22c55e"
              strokeDasharray="4 2"
              dot={{ r: 6 }}
              strokeWidth={3}
              yAxisId="left"
              xAxisId="x"
              name="Physical Difficulty"
            />
          )}

          {showActivity && (
            <Customized
              component={(props) => (
                <CustomBarsCombined
                  {...props}
                  xAxisId="x"
                  yAxisId="right"
                  setTooltip={setActivityTooltip}
                  activityData={activityData}
                  categoryPositions={categoryPositions}
                />
              )}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {showActivity && (
        <ActivityTooltip tooltip={activityTooltip} isMobile={false} />
      )}
    </div>
  );
}
