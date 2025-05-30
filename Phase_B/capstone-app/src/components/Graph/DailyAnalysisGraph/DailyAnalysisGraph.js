import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import './DailyAnalysisGraph.css';
import MyMood from '../../../assets/MyMood.png';
import Parkinson from '../../../assets/Parkinson.png';
import Physical from '../../../assets/Physical.png';
import CustomTooltip from './CustomTooltip';
import CustomXAxisTick from './CustomXAxisTick';
import ToggleButtons from './ToggleButtons';
import GraphSummaryBox from './GraphSummaryBox';
import LegendSection from './LegendSection';
import { generateSampleData } from './generateSampleData';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export default function DailyAnalysisGraph({ date, initialAverages }) {
  const [sampleData, setSampleData] = useState([]);

  const availableLines = {
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  };

  const [visibleLines, setVisibleLines] = useState(() => ({
    feeling: availableLines.feeling,
    parkinson: availableLines.parkinson,
    physical: availableLines.physical
  }));

  useEffect(() => {
    setSampleData(generateSampleData());

    setVisibleLines({
      feeling: availableLines.feeling,
      parkinson: availableLines.parkinson,
      physical: availableLines.physical
    });
  // הוספנו את כל התלויות החסרות כאן:
  }, [date, initialAverages, availableLines.feeling, availableLines.parkinson, availableLines.physical]);

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasVisibleLines = visibleLines.feeling || visibleLines.parkinson || visibleLines.physical;
  const displayDate = date ? formatDate(date) : formatDate(new Date());

  return (
    <div className="graph-wrapper">
      <h1 className="graph-title">📊 Daily Analysis - {displayDate}</h1>

      <ToggleButtons
        visibleLines={visibleLines}
        toggleLine={toggleLine}
        availableLines={availableLines}
      />
      <LegendSection />

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={sampleData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: window.innerWidth < 768 ? 40 : 70
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {hasVisibleLines && (
            <XAxis
              dataKey="timeMinutes"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={sampleData.map((entry) => entry.timeMinutes)}
              tick={(props) => <CustomXAxisTick {...props} sampleData={sampleData} />}
            />
          )}
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{
              fill: '#000',
              fontSize: window.innerWidth < 768 ? 12 : 18,
              fontWeight: 'bold'
            }}

          />
          <Tooltip content={<CustomTooltip visibleLines={visibleLines} />} />

          {visibleLines.feeling && (
            <Line type="linear" dataKey="feeling" stroke="#2563eb" name="My Mood" dot={{ r: 6 }} strokeWidth={3} />
          )}
          {visibleLines.parkinson && (
            <Line type="linear" dataKey="parkinson" stroke="#dc2626" name="Parkinson State" strokeDasharray="5 5" dot={{ r: 6 }} strokeWidth={3} />
          )}
          {visibleLines.physical && (
            <Line type="linear" dataKey="physical" stroke="#22c55e" name="Physical Difficulty" strokeDasharray="4 2" dot={{ r: 6 }} strokeWidth={3} />
          )}
        </LineChart>
      </ResponsiveContainer>

      <GraphSummaryBox
        sampleData={sampleData}
        initialAverages={initialAverages}
        icons={{ MyMood, Parkinson, Physical }}
      />
    </div>
  );
}
