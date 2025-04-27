// src/components/Graph/calculateAverageState.js

import dailyEntries from './dailyEntries';

export function calculateAverageState(startMinutes) {
  const endMinutes = startMinutes + 180; // טווח עתידי של עד 3 שעות (180 דקות)

  const relevantEntries = dailyEntries.filter(entry =>
    entry.timeMinutes >= startMinutes && entry.timeMinutes <= endMinutes
  );

  if (relevantEntries.length === 0) {
    return { feeling: null, physical: null, parkinson: null };
  }

  const sum = relevantEntries.reduce((acc, entry) => {
    acc.feeling += entry.feeling;
    acc.physical += entry.physical;
    acc.parkinson += entry.parkinson;
    return acc;
  }, { feeling: 0, physical: 0, parkinson: 0 });

  const count = relevantEntries.length;

  return {
    feeling: parseFloat((sum.feeling / count).toFixed(2)),
    physical: parseFloat((sum.physical / count).toFixed(2)),
    parkinson: parseFloat((sum.parkinson / count).toFixed(2))
  };
}
