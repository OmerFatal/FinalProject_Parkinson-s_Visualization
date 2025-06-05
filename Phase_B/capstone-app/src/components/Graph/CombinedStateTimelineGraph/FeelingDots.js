import React, { useState } from 'react';

export default function FeelingDots({ data, yScale, xScale, visibleLines }) {
  const [hovered, setHovered] = useState(null);

  const dotProps = {
    feeling: { fill: '#2563eb', r: 7, stroke: '#fff', strokeWidth: 2 },
    parkinson: { fill: '#dc2626', r: 7, stroke: '#fff', strokeWidth: 2 },
    physical: { fill: '#22c55e', r: 7, stroke: '#fff', strokeWidth: 2 }
  };

  const tooltipWidth = 220;

  function getDotsAroundTimeAndY(hoveredTime, yValue) {
    return data.flatMap((pt) => {
      const dots = [];
      const isNearby = Math.abs(pt.timeMinutes - hoveredTime) <= 1;

      if (
        visibleLines.feeling &&
        pt.feelingDot != null &&
        pt.feelingDotTime &&
        pt.feeling === yValue &&
        isNearby
      ) {
        dots.push({
          type: 'feeling',
          label: 'My Mood',
          value: pt.feelingDot,
          color: '#2563eb',
          time: pt.feelingDotTime
        });
      }

      if (
        visibleLines.parkinson &&
        pt.parkinsonDot != null &&
        pt.parkinsonDotTime &&
        pt.parkinson === yValue &&
        isNearby
      ) {
        dots.push({
          type: 'parkinson',
          label: 'Parkinson State',
          value: pt.parkinsonDot,
          color: '#dc2626',
          time: pt.parkinsonDotTime
        });
      }

      if (
        visibleLines.physical &&
        pt.physicalDot != null &&
        pt.physicalDotTime &&
        pt.physical === yValue &&
        isNearby
      ) {
        dots.push({
          type: 'physical',
          label: 'Physical Difficulty',
          value: pt.physicalDot,
          color: '#22c55e',
          time: pt.physicalDotTime
        });
      }

      return dots;
    });
  }

  function getPointTypesAtTime(pt) {
    const result = [];
    ['feeling', 'parkinson', 'physical'].forEach((type) => {
      if (
        visibleLines[type] &&
        pt[`${type}Dot`] != null &&
        pt[`${type}DotTime`] &&
        pt[type] != null
      ) {
        result.push(type);
      }
    });
    return result;
  }

  return (
    <g>
      <defs>
        <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      {data.map((pt, i) => {
        if (!pt) return null;

        const tooltipCandidates = ['feeling', 'parkinson', 'physical'].filter(
          (type) =>
            visibleLines[type] &&
            pt[`${type}Dot`] != null &&
            pt[`${type}DotTime`] &&
            hovered?.yValue === pt[type] &&
            Math.abs(pt.timeMinutes - hovered?.time) <= 1
        );

        const tooltip =
          tooltipCandidates.length > 0
            ? (() => {
                const dots = getDotsAroundTimeAndY(hovered.time, hovered.yValue);
                if (dots.length === 0) return null;

                let tooltipX = hovered.x - tooltipWidth / 2;
                const graphRight = xScale.range()[1];
                if (tooltipX + tooltipWidth > graphRight) tooltipX = graphRight - tooltipWidth - 4;
                if (tooltipX < 0) tooltipX = 4;

                
                let tooltipHeight;
                switch (dots.length) {
                  case 1:
                    tooltipHeight = 35;
                    break;
                  case 2:
                    tooltipHeight = 55;
                    break;
                  default:
                    tooltipHeight = 75;
                }

                return (
                  <foreignObject
                    x={tooltipX}
                    y={Math.max(hovered.y - tooltipHeight - 14, 0)}
                    width={tooltipWidth}
                    height={tooltipHeight}
                    style={{ pointerEvents: 'none' }}
                  >
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 15,
                        color: '#222',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        fontWeight: 600,
                        height: '100%',
                        overflow: 'visible'
                      }}
                    >
                      {dots.map((dot) => (
                        <div key={dot.type} style={{ color: dot.color, marginBottom: 2,
    whiteSpace: 'nowrap' }}>
                          {dot.label}: {dot.value}{' '}
                          <span style={{ color: '#555', fontSize: 13 }}>({dot.time})</span>
                        </div>
                      ))}
                    </div>
                  </foreignObject>
                );
              })()
            : null;

        return (
          <React.Fragment key={i}>
            {getPointTypesAtTime(pt).map((type) => {
              const isHovered =
                hovered &&
                hovered.yValue === pt[type] &&
                Math.abs(pt.timeMinutes - hovered.time) <= 1;

              const sameYNearby = getPointTypesAtTime(pt).filter(
                (t) =>
                  visibleLines[t] &&
                  pt[`${t}`] === pt[type] &&
                  pt[`${t}Dot`] != null &&
                  pt[`${t}DotTime`] != null
              );
              const index = sameYNearby.indexOf(type);
              const total = sameYNearby.length;
              const spacing = 10;
              const offset = total > 1 ? (index - (total - 1) / 2) * spacing : 0;

              return (
                <circle
                  key={type}
                  cx={xScale(pt.timeMinutes) + offset}
                  cy={yScale(pt[type])}
                  fill={dotProps[type].fill}
                  stroke={dotProps[type].stroke}
                  strokeWidth={dotProps[type].strokeWidth}
                  r={isHovered ? dotProps[type].r + 2 : dotProps[type].r}
                  filter={isHovered ? 'url(#dotShadow)' : undefined}
                  onMouseEnter={() =>
                    setHovered({
                      time: pt.timeMinutes,
                      yValue: pt[type],
                      x: xScale(pt.timeMinutes) + offset,
                      y: yScale(pt[type])
                    })
                  }
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
            {tooltip}
          </React.Fragment>
        );
      })}
    </g>
  );
}
