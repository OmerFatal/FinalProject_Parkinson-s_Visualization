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
import useActivityData from './useActivityData';
import './ActivitySummaryGraph.css';

const categories = ['Sport', 'Cognitive', 'Household'];

export default function ActivitySummaryGraph({ entries, date }) {
  {/* Store tooltip info for hovered activity */}
  const [tooltip, setTooltip] = useState(null);
  const isMobile = window.innerWidth <= 768;
  {/* Ref to the graph container for boundary checks */}

  const graphRef = useRef(null);

  {/* Get parsed and structured activity data for the selected date */}
  const activityData = useActivityData(entries, date);

  {/* Hide tooltip on scroll or when mouse moves outside the graph */}
  useEffect(() => {
    const handleScroll = () => setTooltip(null);
    const handleMouseMove = (e) => {
      if (!graphRef.current) return;
      const bounds = graphRef.current.getBoundingClientRect();
      if (
        e.clientX < bounds.left || e.clientX > bounds.right ||
        e.clientY < bounds.top || e.clientY > bounds.bottom
      ) setTooltip(null);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={graphRef} className="activity-graph-wrapper">
    {/* Title with formatted date */}
    <h2 style={{
      textAlign: 'center',
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 'bold',
      marginBottom: '16px'
    }}>
  Daily Activities – {new Date(date).toLocaleDateString('en-GB')}
</h2>
      {/* Legend for activity types */}
      <LegendBox />

      <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-axis for time (0–24 hours) */}
          <XAxis
            type="number"
            dataKey="timeMinutes"
            domain={[0, 24]}
            tickCount={isMobile ? 7 : 13}
            tickFormatter={(h) => `${Math.floor(h)}:00`}
            xAxisId="x"
            tick={{ fontSize: isMobile ? 10 : 14 }}
          />
          {/* Y-axis for activity categories */}
          <YAxis
            type="category"
            dataKey="category"
            domain={categories}
            yAxisId="y"
            reversed={true}
            tick={{ fontSize: isMobile ? 12 : 16, fontWeight: 'bold', fill: '#000' }}
          />
          {/* Custom rendered bars representing activities */}
          <Customized
            component={(props) => (
              <CustomBars
                {...props}
                xAxisId="x"
                yAxisId="y"
                setTooltip={setTooltip}
                data={activityData}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Tooltip showing activity details */}
      <ActivityTooltip tooltip={tooltip} isMobile={isMobile} />
    </div>
  );
}