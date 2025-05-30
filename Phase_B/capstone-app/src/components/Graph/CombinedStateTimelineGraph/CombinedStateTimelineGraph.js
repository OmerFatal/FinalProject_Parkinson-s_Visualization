// CombinedStateTimelineGraph.js
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

import ToggleButtons from '../DailyAnalysisGraph/ToggleButtons';
import LegendSection from '../DailyAnalysisGraph/LegendSection';
import VerticalLinesWithIcons from './VerticalLinesWithIcons';
import FeelingDots from './FeelingDots';
import CustomXAxisWithTimes from './CustomXAxisWithTimes';
import AveragesDisplay from './AveragesDisplay';

import {
  buildActionTimeline,
  buildFullTimeline,
  buildLineData,
  toMinutes
} from './utils';

export default function CombinedStateTimelineGraph({ entries = [], initialAverages, date  }) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  const [visibleLines, setVisibleLines] = useState({
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  });

  const toggleLine = (key) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = entries.filter((r) => {
    if (!r.Date || !r.Time) return false;
    return r.Date === date;
  });

  const mapped = filtered.map((r) => ({
    time: r.Time,
    timeMinutes: toMinutes(r.Time),
    report: r.Report,
    name: r.Name,
    type: r.Type,
    tooltipText: r.Type,
    icon: mapReportToIcon(r.Report, r.Type),
    feeling: r.Type === 'My Mood' ? 6 - Number(r.Intensity) : null,
    parkinson: r.Type === "Parkinson's State" ? Number(r.Intensity) : null,
    physical: r.Type === 'Physical Difficulty' ? Number(r.Intensity) : null,
    feelingTime: r.Type === 'My Mood' ? r.Time : null,
    parkinsonTime: r.Type === "Parkinson's State" ? r.Time : null,
    physicalTime: r.Type === 'Physical Difficulty' ? r.Time : null
  }));

  const groupedByTime = {};
  mapped.forEach((entry) => {
    const t = entry.time;
    if (!groupedByTime[t]) groupedByTime[t] = [];
    groupedByTime[t].push(entry);
  });

  const merged = Object.entries(groupedByTime).map(([time, group]) => {
    const base = group[0];
    const tooltipTexts = group
      .map((e) => {
        if (e.report?.toLowerCase().includes('activity')) return e.name;
        return e.type || e.name;
      })
      .filter(Boolean);

    return {
      ...base,
      tooltipTexts
    };
  });

  const actionTimeline = buildActionTimeline(merged);
  const lastActionTime = actionTimeline[actionTimeline.length - 1];
  const fullTimeline = buildFullTimeline(merged);
  const data = buildLineData(merged, fullTimeline);

  const availableLines = {
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  };

  return (
    <div>
      <h1 className="graph-title">📊 Daily Analysis – {formattedDate}</h1>

      <ToggleButtons visibleLines={visibleLines} toggleLine={toggleLine} availableLines={availableLines} />
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
            />

            {visibleLines.feeling && (
              <Line type="linear" dataKey="feeling" stroke="#2563eb" name="My Mood" dot={false} strokeWidth={3} isAnimationActive={false} />
            )}
            {visibleLines.parkinson && (
              <Line type="linear" dataKey="parkinson" stroke="#dc2626" name="Parkinson State" strokeDasharray="5 5" dot={false} strokeWidth={3} isAnimationActive={false} />
            )}
            {visibleLines.physical && (
              <Line type="linear" dataKey="physical" stroke="#22c55e" name="Physical Difficulty" strokeDasharray="4 2" dot={false} strokeWidth={3} isAnimationActive={false} />
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

function mapReportToIcon(report, type) {
  if (!report) return null;
  const lower = report.toLowerCase();

  if (lower.includes('activity')) return 'activity';
  if (lower.includes('medicine')) return 'medication';
  if (lower.includes('nutrition')) return 'nutrition';
  if (lower.includes('sleep') || lower.includes('wake')) {
    if (type === 'Going to Sleep') return 'sleepStart';
    if (type === 'Waking Up') return 'sleepEnd';
    return 'sleep';
  }
  return null;
}
