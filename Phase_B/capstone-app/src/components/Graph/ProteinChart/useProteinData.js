import { useMemo } from 'react';

export default function useProteinData(entries, date) {
  return useMemo(() => {
    // Return empty array if no entries provided
    if (!entries || entries.length === 0) return [];

    return entries
      .filter(row =>
        row.Report === 'Nutrition' && // Ensure report is food-related
        row.Date === date &&          // Same selected day
        row.Time && row.Type && row.Notes
      )
      .map(row => {
        // Extract protein value from notes (e.g., "Proteins: 15g")
        const match = row.Notes.match(/Proteins:\s*(\d+)g/i);
        const proteinValue = match ? Number(match[1]) : 0;

        return {
          time: row.Time.slice(0, 5), // Format time as HH:mm
          protein: proteinValue,
          food: row.Type,
          notes: row.Notes.trim()
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time
  }, [entries, date]);
}
