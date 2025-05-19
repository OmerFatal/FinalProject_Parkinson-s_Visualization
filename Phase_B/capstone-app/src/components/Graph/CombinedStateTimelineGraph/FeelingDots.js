// src/components/Graph/CombinedStateTimelineGraph/FeelingDots.js

import React, { useState } from 'react';

export default function FeelingDots({ data, yScale, xScale, visibleLines }) {
  const [hovered, setHovered] = useState(null);

  const dotProps = {
    feeling: { fill: '#2563eb', r: 7, stroke: '#fff', strokeWidth: 2 },
    parkinson: { fill: '#dc2626', r: 7, stroke: '#fff', strokeWidth: 2 },
    physical: { fill: '#22c55e', r: 7, stroke: '#fff', strokeWidth: 2 }
  };

  const tooltipWidth = 170;
  const tooltipHeight = 48;

  function getDotsAtTimeAndY(time, yValue) {
    const pt = data.find(d => d?.timeMinutes === time);
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
        if (!pt) return null; // ✅ הגנה: דילוג על שורות לא תקינות

        const tooltipCandidates = ['feeling', 'parkinson', 'physical'].filter(type => {
          return visibleLines[type] && pt[`${type}Dot`] != null && pt[`${type}DotTime`] && hovered?.time === pt.timeMinutes && hovered?.yValue === pt[type];
        });

        const tooltip = tooltipCandidates.length > 0
          ? (() => {
              const dots = getDotsAtTimeAndY(pt.timeMinutes, hovered.yValue);
              if (dots.length === 0) return null;

              let tooltipX = hovered.x - tooltipWidth / 2;
              const graphRight = xScale.range()[1];
              if (tooltipX + tooltipWidth > graphRight) tooltipX = graphRight - tooltipWidth - 4;
              if (tooltipX < 0) tooltipX = 4;

              return (
                <foreignObject
                  x={tooltipX}
                  y={Math.max(hovered.y - tooltipHeight - 14, 0)}
                  width={tooltipWidth}
                  height={tooltipHeight + 18 * (dots.length - 1)}
                  style={{ pointerEvents: 'none' }}
                >
                  <div style={{
                    background: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 15,
                    color: '#222',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontWeight: 600
                  }}>
                    {dots.map(dot => (
                      <div key={dot.type} style={{ color: dot.color, marginBottom: 2 }}>
                        {dot.label}: {dot.value} <span style={{ color: '#555', fontSize: 13 }}>({dot.time})</span>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              );
            })()
          : null;

        return (
          <React.Fragment key={i}>
            {['feeling', 'parkinson', 'physical'].map(type => (
              visibleLines[type] &&
              pt[`${type}Dot`] != null &&
              pt[`${type}DotTime`] &&
              pt[type] != null && (
                <circle
                  key={type}
                  cx={xScale(pt.timeMinutes)}
                  cy={yScale(pt[type])}
                  {...dotProps[type]}
                  onMouseEnter={() =>
                    setHovered({
                      time: pt.timeMinutes,
                      yValue: pt[type],
                      x: xScale(pt.timeMinutes),
                      y: yScale(pt[type])
                    })
                  }
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              )
            ))}
            {tooltip}
          </React.Fragment>
        );
      })}
    </g>
  );
}
