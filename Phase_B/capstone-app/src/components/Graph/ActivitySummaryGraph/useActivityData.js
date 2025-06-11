import { useMemo } from 'react';

function parseTimeToFloat(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [h = '0', m = '0', s = '0'] = timeStr.trim().split(':');
  return parseInt(h) + parseInt(m) / 60 + parseInt(s || 0) / 3600;
}

export default function useActivityData(entries, date) {
  return useMemo(() => {
    return entries
      .filter(row =>
        row.Report === 'Activity' &&
        ['Home activities', 'Cognitive activities', 'Sports activities'].includes(row.Type) &&
        row.Date === date
      )
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