import React, { useState } from 'react';

export default function VerticalLinesWithIcons({ points, yScale, xScale }) {
    // Track hovered icon for tooltip
  const [hovered, setHovered] = useState(null);

  const tooltipWidth = 200;
  const tooltipHeight = 48;

  return (
    <g>
      {points.map((pt, i) => {
        if (!pt.actionIcon) return null;

        const x = xScale(pt.timeMinutes) + (i === 0 ? 12 : 0);
        const y = yScale(3);
        const isHovered = hovered?.index === i;

        return (
          <g key={i}>
            {/* Vertical line */}
            <line
              x1={x}
              y1={yScale.range()[0]}
              x2={x}
              y2={y}
              stroke="#6366f1"
              strokeWidth={3}
              opacity={0.25}
            />
            {/* Emoji icon */}
            <text
              x={x}
              y={y + 6}
              textAnchor="middle"
              fontSize={20}
              filter="url(#shadow)"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() =>
                setHovered({
                  index: i,
                  x,
                  y,
                  text: pt.tooltipText || '',
                })
              }
              onMouseLeave={() => setHovered(null)}
            >
              {pt.actionIcon}
            </text>

            {/* Tooltip on hover */}
            {isHovered && hovered.text && (
              (() => {
                const graphRight = xScale.range()[1];
                const graphLeft = xScale.range()[0];
                let tooltipX = hovered.x - tooltipWidth / 2;

                if (tooltipX + tooltipWidth > graphRight) {
                  tooltipX = graphRight - tooltipWidth - 4;
                }
                if (tooltipX < graphLeft) {
                  tooltipX = graphLeft + 4;
                }

                return (
                  <foreignObject
                    x={tooltipX}
                    y={Math.max(hovered.y - tooltipHeight - 10, 0)}
                    width={tooltipWidth}
                    height={tooltipHeight + 18 * (hovered.text.split('\n').length - 1)}
                    style={{ pointerEvents: 'none' }}
                  >
                    <div style={{
                      background: '#fff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 13,
                      color: '#222',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      fontWeight: 'bold'
                    }}>
                      {hovered.text.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  </foreignObject>
                );
              })()
            )}
          </g>
        );
      })}

      {/* Shadow filter used under emoji icons */}
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#6366f1"
            floodOpacity="0.18"
          />
        </filter>
      </defs>
    </g>
  );
}