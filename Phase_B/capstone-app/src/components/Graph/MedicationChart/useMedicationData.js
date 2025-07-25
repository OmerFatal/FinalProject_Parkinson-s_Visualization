import { useMemo } from 'react';
import { sortByTime } from './ChartDataUtils';
import { pillTypes } from './PillTypes';

export default function useMedicationData(entries, date) {
  // Filter medication records by selected date and required fields
  const filtered = useMemo(() => {
    return entries.filter(
      (e) => e.Date === date && e.Report === 'Medicine' && e.Type && e.Notes
    );
  }, [entries, date]);

  // Transform and group medication entries for charting
  const medicationData = useMemo(() => {
    const grouped = {};

    filtered.forEach((entry) => {
      const pillName = entry.Type?.trim();
      const time = entry.Time?.trim().slice(0, 5); // HH:mm
      const amountMatch = entry.Notes?.trim().match(/([0-9.]+)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;

      if (!grouped[time]) {
        grouped[time] = { time, medications: [] };
      }

      grouped[time].medications.push({ pillName, amount });
    });

    // Convert grouped format into array format for Recharts
    const mapped = Object.values(grouped).map((entry) => {
      const obj = { time: entry.time };
      entry.medications.forEach((med) => {
        const name = med.pillName?.trim();
        obj[name] = (obj[name] || 0) + med.amount;
      });
      obj.medications = entry.medications;
      return obj;
    });

    return sortByTime(mapped);
  }, [filtered]);

  // Extract all pills used in the current day
  const usedPills = useMemo(() => {
    const set = new Set();
    medicationData.forEach((entry) => {
      entry.medications.forEach((m) => set.add(m.pillName.trim()));
    });
    return set;
  }, [medicationData]);

  // Determine which pill categories were used today
  const usedPillTypes = useMemo(() => {
    const result = {};
    Object.entries(pillTypes).forEach(([type, pills]) => {
      const matched = pills.filter((p) =>
        Array.from(usedPills).some(up =>
          up.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(up.toLowerCase())
        )
      );
      if (matched.length > 0) result[type] = matched;
    });
    return result;
  }, [usedPills]);

  return { medicationData, usedPillTypes };
}
