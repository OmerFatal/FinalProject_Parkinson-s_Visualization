import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Customized
} from 'recharts';
import Papa from 'papaparse';
import LegendBox from './LegendBox';
import CustomBars from './CustomBars';
import ActivityTooltip from './ActivityTooltip';

const categories = ['Sport', 'Cognitive', 'Household'];

// 🕒 ממיר זמן בפורמט HH:MM או HH:MM:SS למספר עשרוני
function parseTimeToFloat(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [h = '0', m = '0', s = '0'] = timeStr.trim().split(':');
  return parseInt(h) + parseInt(m) / 60 + parseInt(s || 0) / 3600;
}

// 📆 ממיר תאריך בפורמט DD/MM/YYYY ל-YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export default function ActivitySummaryGraph({ date }) {
  const [activityData, setActivityData] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const graphRef = useRef(null);

  useEffect(() => {
    fetch('/data/combined_daily_view_activities_fixed_final_with_intensity.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const mapped = results.data
              .filter(row =>
                row.Report === 'Activity' &&
                ['Home activities', 'Cognitive activities', 'Sports activities'].includes(row.Type) &&
                formatDate(row.Date?.trim()) === date // ✅ התאמה לפי תאריך
              )
              .map(row => ({
                name: row.Name,
                time: row.Time?.trim(),
                timeMinutes: parseTimeToFloat(row.Time),
                duration: parseInt(row.Duration),
                intensity: row.Intensity,
                category: row.Type.includes('Home') ? 'Household'
                         : row.Type.includes('Cognitive') ? 'Cognitive'
                         : 'Sport'
              }));
            setActivityData(mapped);
          }
        });
      });
  }, [date]);

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
            dataKey="timeMinutes"
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
            tick={{ fontSize: isMobile ? 12 : 16, fontWeight: 'bold', fill: '#000' }}
          />
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

      <ActivityTooltip tooltip={tooltip} isMobile={isMobile} />
    </div>
  );
}
