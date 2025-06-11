import { useMemo } from 'react';
import { buildActionTimeline, buildFullTimeline, buildLineData, toMinutes } from './utils';
import { mapReportToIcon } from './mapReportToIcon';

export default function useFilteredEntries(entries, date, visibleLines) {
  return useMemo(() => {
    const filtered = entries.filter(r => r.Date === date && r.Time);

    const mapped = filtered.map((r) => ({
      time: r.Time,
      timeMinutes: toMinutes(r.Time),
      report: r.Report,
      name: r.Name,
      type: r.Type,
      tooltipText: r.Type,
      icon: mapReportToIcon(r.Report, r.Type),
      feeling: r.Type === 'My Mood' ? 6 - Number(r.Intensity) : null,
      parkinson: r.Type === "Parkinson's State" ? Number(r.Intensity) : null,
      physical: r.Type === 'Physical Difficulty' ? Number(r.Intensity) : null,
      feelingTime: r.Type === 'My Mood' ? r.Time : null,
      parkinsonTime: r.Type === "Parkinson's State" ? r.Time : null,
      physicalTime: r.Type === 'Physical Difficulty' ? r.Time : null
    }));

    const groupedByTime = {};
    mapped.forEach((entry) => {
      const t = entry.time;
      if (!groupedByTime[t]) groupedByTime[t] = [];
      groupedByTime[t].push(entry);
    });

    const merged = Object.entries(groupedByTime).map(([time, group]) => {
      const base = group[0];
      const tooltipTexts = group
        .map((e) => {
          if (e.report?.toLowerCase().includes('activity')) return e.name;
          return e.type || e.name;
        })
        .filter(Boolean);

      return {
        ...base,
        tooltipTexts
      };
    });

    const actionTimeline = buildActionTimeline(merged);
    const lastActionTime = actionTimeline[actionTimeline.length - 1];
    const fullTimeline = buildFullTimeline(merged);
    const data = buildLineData(merged, fullTimeline);

    return {
      data,
      actionTimeline,
      lastActionTime
    };
  }, [entries, date]);
}