import React, { useState } from 'react';
import ToggleButtons from './ToggleButtons';
import LegendSection from './LegendSection';
import AveragesDisplay from './AveragesDisplay';
import GraphContainer from './GraphContainer';
import useFilteredEntries from './useFilteredEntries';
import './DailyAnalysisGraph.css';

export default function CombinedStateTimelineGraph({ entries = [], initialAverages, date }) {
  // Format the date as DD/MM/YYYY
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  // Track which lines are currently visible on the graph
  const [visibleLines, setVisibleLines] = useState({
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  });

  // Toggle visibility of each graph line
  const toggleLine = (key) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Extract relevant data for rendering the graph
  const { data, actionTimeline, lastActionTime } = useFilteredEntries(entries, date, visibleLines);

  // Determine which lines are available based on initialAverages
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

      <GraphContainer
        data={data}
        visibleLines={visibleLines}
        actionTimeline={actionTimeline}
        lastActionTime={lastActionTime}
      />

      <AveragesDisplay averages={initialAverages || {}} />
    </div>
  );
}
