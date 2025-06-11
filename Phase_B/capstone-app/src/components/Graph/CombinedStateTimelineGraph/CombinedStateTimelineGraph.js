import React, { useState } from 'react';
import ToggleButtons from './ToggleButtons';
import LegendSection from './LegendSection';
import AveragesDisplay from './AveragesDisplay';
import GraphContainer from './GraphContainer';
import useFilteredEntries from './useFilteredEntries';
import './CombinedStateTimelineGraph.css';

export default function CombinedStateTimelineGraph({ entries = [], initialAverages, date }) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  const [visibleLines, setVisibleLines] = useState({
    feeling: initialAverages?.feeling != null,
    parkinson: initialAverages?.parkinson != null,
    physical: initialAverages?.physical != null
  });

  const toggleLine = (key) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { data, actionTimeline, lastActionTime } = useFilteredEntries(entries, date, visibleLines);

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
