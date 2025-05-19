// ActivitySummaryGraph.js

import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Customized
} from 'recharts';
import LegendBox from './LegendBox';
import CustomBars from './CustomBars';
import ActivityTooltip from './ActivityTooltip';

const categories = ['Sport', 'Cognitive', 'Household'];

export default function ActivitySummaryGraph() {
  const [tooltip, setTooltip] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const graphRef = useRef(null);

  // ✅ מסתיר טולטיפ בגלילה או יציאה מהגרף עם העכבר
  useEffect(() => {
    const handleScroll = () => {
      setTooltip(null);
    };

    const handleMouseMove = (e) => {
      if (!graphRef.current) return;
      const bounds = graphRef.current.getBoundingClientRect();
      const inside =
        e.clientX >= bounds.left &&
        e.clientX <= bounds.right &&
        e.clientY >= bounds.top &&
        e.clientY <= bounds.bottom;

      if (!inside) setTooltip(null);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={graphRef} style={{ width: '100%', padding: '0 24px', position: 'relative' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        Activity Summary – Grouped by Category
      </h2>

      <LegendBox />

      <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            domain={[0, 24]}
            tickCount={isMobile ? 7 : 13}
            tickFormatter={(h) => `${Math.floor(h)}:00`}
            xAxisId="x"
            tick={{ fontSize: isMobile ? 10 : 14 }}
          />
          <YAxis
            type="category"
            dataKey="category"
            domain={categories}
            yAxisId="y"
            reversed={true}
            tick={{
              fontSize: isMobile ? 12 : 16,
              fontWeight: 'bold',
              fill: '#000'
            }}
          />
          <Customized
            component={(props) => (
              <CustomBars {...props} xAxisId="x" yAxisId="y" setTooltip={setTooltip} />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <ActivityTooltip tooltip={tooltip} isMobile={isMobile} />
    </div>
  );
}
