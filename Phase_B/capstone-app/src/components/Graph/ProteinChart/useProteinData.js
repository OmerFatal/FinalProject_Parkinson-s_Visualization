import { useMemo } from 'react';

export default function UseProteinData(entries, date) {
  return useMemo(() => {
    if (!entries || entries.length === 0) return [];

    return entries
      .filter(row =>
        row.Report === 'Nutrition' &&
        row.Date === date &&
        row.Time &&
        row.Type &&
        row.Notes
      )
      .map(row => {
        const match = row.Notes.match(/Proteins:\s*(\d+)g/i);
        const proteinValue = match ? Number(match[1]) : 0;

        return {
          time: row.Time.slice(0, 5),
          protein: proteinValue,
          food: row.Type,
          notes: row.Notes.trim()
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [entries, date]);
}