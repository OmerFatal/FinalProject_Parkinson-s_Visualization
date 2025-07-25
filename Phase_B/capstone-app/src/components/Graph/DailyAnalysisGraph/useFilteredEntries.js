import { useMemo } from 'react';
import { buildActionTimeline, buildFullTimeline, buildLineData, toMinutes } from './utils';
import { mapReportToIcon } from './mapReportToIcon';

export default function useFilteredEntries(entries, date, visibleLines) {
  return useMemo(() => {
    // Filter records by selected date and existence of time
    const filtered = entries.filter(r => r.Date === date && r.Time);

    // Map fields and calculate numeric values
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

    // Sort all records by time
    const sorted = mapped.sort((a, b) => a.timeMinutes - b.timeMinutes);

    // Merge records that occur within 1 minute into a group
    const merged = [];
    let currentGroup = [];

    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      if (
        currentGroup.length === 0 ||
        Math.abs(entry.timeMinutes - currentGroup[currentGroup.length - 1].timeMinutes) <= 1
      ) {
        currentGroup.push(entry);
      } else {
        merged.push(mergeGroup(currentGroup));
        currentGroup = [entry];
      }
    }
    if (currentGroup.length > 0) {
      merged.push(mergeGroup(currentGroup));
    }
    // Merge entries in a group into one unified entry with combined tooltip text
    function mergeGroup(group) {
      const base = group[0];
      const tooltipTexts = group
        .map((e) => {
          if (e.report?.toLowerCase().includes('activity')) return e.name;
          return e.type || e.name;
        })
        .filter(Boolean);

      return {
        ...base,
        tooltipText: tooltipTexts.join('\n'),
        actionIcon: base.icon,
        tooltipTexts,
      };
    }
    
    // Generate timelines and formatted data for the graph
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
