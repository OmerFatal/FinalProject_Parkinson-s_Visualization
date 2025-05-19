import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Customized, CartesianGrid } from 'recharts';
import dailyEntries from './dailyEntries';
import LegendSection from './DailyAnalysisGraph/LegendSection';
import ToggleButtons from './DailyAnalysisGraph/ToggleButtons';
import MyMood from '../../assets/MyMood.png';
import Parkinson from '../../assets/Parkinson.png';
import Physical from '../../assets/Physical.png';

const iconMap = {
  sleep: '😴',
  medication: '💊',
  nutrition: '🍽️',
  activity: '🚶‍♂️'
};

function formatTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function toMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Build a combined timeline of all unique action times (for X axis)
function buildActionTimeline(entries) {
  const times = new Set();
  entries.forEach(e => {
    times.add(e.timeMinutes);
  });
  return Array.from(times).filter(Boolean).sort((a, b) => a - b);
}

// Build a full timeline of all unique times (actions + feelings)
function buildFullTimeline(entries) {
  const times = new Set();
  entries.forEach(e => {
    times.add(e.timeMinutes);
    if (e.feelingTime) times.add(toMinutes(e.feelingTime));
    if (e.parkinsonTime) times.add(toMinutes(e.parkinsonTime));
    if (e.physicalTime) times.add(toMinutes(e.physicalTime));
  });
  return Array.from(times).filter(Boolean).sort((a, b) => a - b);
}

// For each time, get the latest value up to that time for each state
function buildLineData(entries, timeline) {
  // Find the first available value for each state
  const firstFeeling = entries.find(e => e.feeling != null);
  const firstParkinson = entries.find(e => e.parkinson != null);
  const firstPhysical = entries.find(e => e.physical != null);
  let last = {
    feeling: firstFeeling ? firstFeeling.feeling : null,
    parkinson: firstParkinson ? firstParkinson.parkinson : null,
    physical: firstPhysical ? firstPhysical.physical : null
  };
  let lastTimes = { feeling: null, parkinson: null, physical: null };
  const data = timeline.map(t => {
    // Find if there's a new value at this time
    entries.forEach(e => {
      if (e.feelingTime && toMinutes(e.feelingTime) === t) {
        last.feeling = e.feeling;
        lastTimes.feeling = t;
      }
      if (e.parkinsonTime && toMinutes(e.parkinsonTime) === t) {
        last.parkinson = e.parkinson;
        lastTimes.parkinson = t;
      }
      if (e.physicalTime && toMinutes(e.physicalTime) === t) {
        last.physical = e.physical;
        lastTimes.physical = t;
      }
    });
    // Is there an action at this time?
    const action = entries.find(e => e.timeMinutes === t);
    // Find the original entry for each feeling at this time
    const feelingEntry = entries.find(e => e.feelingTime && toMinutes(e.feelingTime) === t);
    const parkinsonEntry = entries.find(e => e.parkinsonTime && toMinutes(e.parkinsonTime) === t);
    const physicalEntry = entries.find(e => e.physicalTime && toMinutes(e.physicalTime) === t);
    return {
      timeMinutes: t,
      time: formatTime(t),
      feeling: last.feeling,
      parkinson: last.parkinson,
      physical: last.physical,
      actionIcon: action ? iconMap[action.icon] : null,
      actionType: action ? action.icon : null,
      feelingDot: lastTimes.feeling === t ? last.feeling : null,
      parkinsonDot: lastTimes.parkinson === t ? last.parkinson : null,
      physicalDot: lastTimes.physical === t ? last.physical : null,
      feelingDotTime: feelingEntry ? feelingEntry.feelingTime : null,
      parkinsonDotTime: parkinsonEntry ? parkinsonEntry.parkinsonTime : null,
      physicalDotTime: physicalEntry ? physicalEntry.physicalTime : null
    };
  });
  return data;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function CustomXAxisWithTimes({ x, y, width, height, ticks, xScale }) {
  return (
    <g>
      {ticks.map((tick, i) => {
        let xPos = xScale(tick.value);
        if (i === 0) xPos += 12;
        return (
          <g key={i} transform={`rotate(-18,${xPos},${y + 28})`}>
            <text x={xPos} y={y + 28} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#1e3a8a">{formatTime(tick.value)}</text>
          </g>
        );
      })}
    </g>
  );
}

function VerticalLinesWithIcons({ points, yScale, xScale }) {
  return (
    <g>
      {points.map((pt, i) => {
        if (!pt.actionIcon) return null;
        let x = xScale(pt.timeMinutes);
        if (i === 0) x += 12;
        const y = yScale(3);
        return (
          <g key={i}>
            <line x1={x} y1={yScale.range()[0]} x2={x} y2={y} stroke="#6366f1" strokeWidth={3} opacity={0.25} />
            <text x={x} y={y + 6} textAnchor="middle" fontSize={20} filter="url(#shadow)">{pt.actionIcon}</text>
          </g>
        );
      })}
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#6366f1" floodOpacity="0.18" />
        </filter>
      </defs>
    </g>
  );
}

function FeelingDots({ data, yScale, xScale, visibleLines }) {
  const [hovered, setHovered] = useState(null);
  const dotProps = {
    feeling: { fill: '#2563eb', r: 7, stroke: '#fff', strokeWidth: 2 },
    parkinson: { fill: '#dc2626', r: 7, stroke: '#fff', strokeWidth: 2 },
    physical: { fill: '#22c55e', r: 7, stroke: '#fff', strokeWidth: 2 }
  };
  const tooltipWidth = 170;
  const tooltipHeight = 48;

  // Find all dots at a given time and Y value
  function getDotsAtTimeAndY(time, yValue) {
    const pt = data.find(d => d.timeMinutes === time);
    if (!pt) return [];
    const result = [];
    if (visibleLines.feeling && pt.feelingDot != null && pt.feelingDotTime && pt.feeling === yValue) {
      result.push({
        type: 'feeling',
        label: 'Mood',
        value: pt.feelingDot,
        color: '#2563eb',
        time: pt.feelingDotTime
      });
    }
    if (visibleLines.parkinson && pt.parkinsonDot != null && pt.parkinsonDotTime && pt.parkinson === yValue) {
      result.push({
        type: 'parkinson',
        label: 'Parkinson',
        value: pt.parkinsonDot,
        color: '#dc2626',
        time: pt.parkinsonDotTime
      });
    }
    if (visibleLines.physical && pt.physicalDot != null && pt.physicalDotTime && pt.physical === yValue) {
      result.push({
        type: 'physical',
        label: 'Physical',
        value: pt.physicalDot,
        color: '#22c55e',
        time: pt.physicalDotTime
      });
    }
    return result;
  }

  return (
    <g>
      {data.map((pt, i) => {
        // Tooltip logic: calculate dots for this time and Y value
        let tooltip = null;
        // Get right edge of graph
        const graphRight = xScale.range()[1];
        // For feeling dot
        if (visibleLines.feeling && pt.feelingDot != null && pt.feelingDotTime && hovered && hovered.time === pt.timeMinutes && hovered.yValue === pt.feeling) {
          const dots = getDotsAtTimeAndY(pt.timeMinutes, hovered.yValue);
          if (dots.length > 0) {
            let tooltipX = hovered.x - tooltipWidth / 2;
            if (tooltipX + tooltipWidth > graphRight) tooltipX = graphRight - tooltipWidth - 4;
            if (tooltipX < 0) tooltipX = 4;
            tooltip = (
              <foreignObject
                x={tooltipX}
                y={Math.max(hovered.y - tooltipHeight - 14, 0)}
                width={tooltipWidth}
                height={tooltipHeight + 18 * (dots.length - 1)}
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', fontSize: 15, color: '#222', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontWeight: 600 }}>
                  {dots.map(dot => (
                    <div key={dot.type} style={{ color: dot.color, marginBottom: 2 }}>
                      {dot.label}: {dot.value} <span style={{ color: '#555', fontSize: 13 }}>({dot.time})</span>
                    </div>
                  ))}
                </div>
              </foreignObject>
            );
          }
        }
        // For parkinson dot
        if (visibleLines.parkinson && pt.parkinsonDot != null && pt.parkinsonDotTime && hovered && hovered.time === pt.timeMinutes && hovered.yValue === pt.parkinson) {
          const dots = getDotsAtTimeAndY(pt.timeMinutes, hovered.yValue);
          if (dots.length > 0) {
            let tooltipX = hovered.x - tooltipWidth / 2;
            if (tooltipX + tooltipWidth > graphRight) tooltipX = graphRight - tooltipWidth - 4;
            if (tooltipX < 0) tooltipX = 4;
            tooltip = (
              <foreignObject
                x={tooltipX}
                y={Math.max(hovered.y - tooltipHeight - 14, 0)}
                width={tooltipWidth}
                height={tooltipHeight + 18 * (dots.length - 1)}
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', fontSize: 15, color: '#222', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontWeight: 600 }}>
                  {dots.map(dot => (
                    <div key={dot.type} style={{ color: dot.color, marginBottom: 2 }}>
                      {dot.label}: {dot.value} <span style={{ color: '#555', fontSize: 13 }}>({dot.time})</span>
                    </div>
                  ))}
                </div>
              </foreignObject>
            );
          }
        }
        // For physical dot
        if (visibleLines.physical && pt.physicalDot != null && pt.physicalDotTime && hovered && hovered.time === pt.timeMinutes && hovered.yValue === pt.physical) {
          const dots = getDotsAtTimeAndY(pt.timeMinutes, hovered.yValue);
          if (dots.length > 0) {
            let tooltipX = hovered.x - tooltipWidth / 2;
            if (tooltipX + tooltipWidth > graphRight) tooltipX = graphRight - tooltipWidth - 4;
            if (tooltipX < 0) tooltipX = 4;
            tooltip = (
              <foreignObject
                x={tooltipX}
                y={Math.max(hovered.y - tooltipHeight - 14, 0)}
                width={tooltipWidth}
                height={tooltipHeight + 18 * (dots.length - 1)}
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', fontSize: 15, color: '#222', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontWeight: 600 }}>
                  {dots.map(dot => (
                    <div key={dot.type} style={{ color: dot.color, marginBottom: 2 }}>
                      {dot.label}: {dot.value} <span style={{ color: '#555', fontSize: 13 }}>({dot.time})</span>
                    </div>
                  ))}
                </div>
              </foreignObject>
            );
          }
        }
        return (
          <React.Fragment key={i}>
            {visibleLines.feeling && pt.feelingDot != null && pt.feelingDotTime && (
              <g>
                <circle
                  cx={xScale(pt.timeMinutes)}
                  cy={yScale(pt.feeling)}
                  {...dotProps.feeling}
                  onMouseEnter={() => setHovered({ time: pt.timeMinutes, yValue: pt.feeling, x: xScale(pt.timeMinutes), y: yScale(pt.feeling) })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )}
            {visibleLines.parkinson && pt.parkinsonDot != null && pt.parkinsonDotTime && (
              <g>
                <circle
                  cx={xScale(pt.timeMinutes)}
                  cy={yScale(pt.parkinson)}
                  {...dotProps.parkinson}
                  onMouseEnter={() => setHovered({ time: pt.timeMinutes, yValue: pt.parkinson, x: xScale(pt.timeMinutes), y: yScale(pt.parkinson) })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )}
            {visibleLines.physical && pt.physicalDot != null && pt.physicalDotTime && (
              <g>
                <circle
                  cx={xScale(pt.timeMinutes)}
                  cy={yScale(pt.physical)}
                  {...dotProps.physical}
                  onMouseEnter={() => setHovered({ time: pt.timeMinutes, yValue: pt.physical, x: xScale(pt.timeMinutes), y: yScale(pt.physical) })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )}
            {tooltip}
          </React.Fragment>
        );
      })}
    </g>
  );
}

function AveragesDisplay({ averages }) {
  const sections = [
    { key: 'feeling', label: 'My Mood Avg', color: '#2563eb', icon: MyMood },
    { key: 'parkinson', label: 'Parkinson State Avg', color: '#dc2626', icon: Parkinson },
    { key: 'physical', label: 'Physical Difficulty Avg', color: '#22c55e', icon: Physical }
  ];
  return (
    <>
      <div className="graph-summary-label" style={{ textAlign: 'center', fontWeight: 700, fontSize: 22, color: '#1e3a8a', marginTop: 32 }}>Average Score For Each Feeling:</div>
      <div className="graph-summary" style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, marginBottom: 24 }}>
        {sections.map(({ key, label, color, icon }) => (
          <div key={key} className="graph-summary-box" style={{ border: `2.5px solid ${color}`, color, borderRadius: 16, padding: 16, minWidth: 180, textAlign: 'center', fontWeight: 700, fontSize: 20, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <img src={icon} alt={label} style={{ width: 38, height: 38, marginBottom: 6 }} />
            <div>{label}: {averages[key] != null ? averages[key] : 'N/A'}</div>
          </div>
        ))}
      </div>
    </>
  );
}

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
                    width={xAxisMap[Object.keys(xAxisMap)[0]].width}
                    height={xAxisMap[Object.keys(xAxisMap)[0]].height}
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
