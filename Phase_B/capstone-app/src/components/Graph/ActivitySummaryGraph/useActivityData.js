import { useMemo } from 'react';

{/* Convert HH:mm:ss to float hour format */}
function parseTimeToFloat(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [h = '0', m = '0', s = '0'] = timeStr.trim().split(':');
  return parseInt(h) + parseInt(m) / 60 + parseInt(s || 0) / 3600;
}

export default function useActivityData(entries, date) {
  return useMemo(() => {
    // Filter only valid activity rows from the selected date
    return entries
      .filter(row =>
        row.Report === 'Activity' &&
        ['Home activities', 'Cognitive activities', 'Sports activities'].includes(row.Type) &&
        row.Date === date
      )
      // Map to structured format for graph use
      .map(row => ({
        name: row.Name,
        time: row.Time?.trim(),
        timeMinutes: parseTimeToFloat(row.Time),
        duration: parseInt(row.Duration),
        intensity: row.Intensity,
        category:
          row.Type.includes('Home') ? 'Household' :
          row.Type.includes('Cognitive') ? 'Cognitive' :
          'Sport'
      }));
  }, [entries, date]);
}