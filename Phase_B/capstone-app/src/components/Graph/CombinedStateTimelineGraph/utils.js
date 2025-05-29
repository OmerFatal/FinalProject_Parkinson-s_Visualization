export function toMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function buildActionTimeline(entries) {
  const times = new Set();
  entries.forEach(e => {
    if (
      e?.timeMinutes !== undefined &&
      !e.feeling && !e.parkinson && !e.physical  // ❌ לא רגשות
    ) {
      times.add(e.timeMinutes);
    }
  });
  return Array.from(times).filter(Boolean).sort((a, b) => a - b);
}

export function buildFullTimeline(entries) {
  const times = new Set();
  entries.forEach(e => {
    if (e?.timeMinutes !== undefined) times.add(e.timeMinutes);
    if (e?.feelingTime) times.add(toMinutes(e.feelingTime));
    if (e?.parkinsonTime) times.add(toMinutes(e.parkinsonTime));
    if (e?.physicalTime) times.add(toMinutes(e.physicalTime));
  });
  return Array.from(times).filter(Boolean).sort((a, b) => a - b);
}

export function buildLineData(entries, timeline) {
  const firstFeeling = entries.find(e => e?.feeling != null);
  const firstParkinson = entries.find(e => e?.parkinson != null);
  const firstPhysical = entries.find(e => e?.physical != null);

  let last = {
    feeling: firstFeeling?.feeling ?? null,
    parkinson: firstParkinson?.parkinson ?? null,
    physical: firstPhysical?.physical ?? null
  };
  let lastTimes = { feeling: null, parkinson: null, physical: null };

  const data = timeline.map(t => {
    entries.forEach(e => {
      if (!e) return;
      if (e.feelingTime && toMinutes(e.feelingTime) === t) {
        last.feeling = e.feeling;
        lastTimes.feeling = t;
      }
      if (e.parkinsonTime && toMinutes(e.parkinsonTime) === t) {
        last.parkinson = e.parkinson;
        lastTimes.parkinson = t;
      }
      if (e.physicalTime && toMinutes(e.physicalTime) === t) {
        last.physical = e.physical;
        lastTimes.physical = t;
      }
    });

    const action = entries.find(e => e?.timeMinutes === t);
    const feelingEntry = entries.find(e => e?.feelingTime && toMinutes(e.feelingTime) === t);
    const parkinsonEntry = entries.find(e => e?.parkinsonTime && toMinutes(e.parkinsonTime) === t);
    const physicalEntry = entries.find(e => e?.physicalTime && toMinutes(e.physicalTime) === t);

    return {
      timeMinutes: t,
      time: formatTime(t),
      feeling: last.feeling ?? null,
      parkinson: last.parkinson ?? null,
      physical: last.physical ?? null,
      actionIcon: action ? iconMap[action.icon] : null,
      actionType: action ? action.icon : null,
tooltipText: (action?.tooltipTexts || []).join('\n'),

      feelingDot: lastTimes.feeling === t ? last.feeling : null,
      parkinsonDot: lastTimes.parkinson === t ? last.parkinson : null,
      physicalDot: lastTimes.physical === t ? last.physical : null,
      feelingDotTime: feelingEntry?.feelingTime ?? null,
      parkinsonDotTime: parkinsonEntry?.parkinsonTime ?? null,
      physicalDotTime: physicalEntry?.physicalTime ?? null
    };
  });

  return data.filter(d => d && d.timeMinutes !== undefined);
}

export const iconMap = {
  sleep: '😴',           // fallback כללי
  sleepStart: '🌙',      // Going to Sleep
  sleepEnd: '🌅',        // Waking Up
  medication: '💊',
  nutrition: '🍽️',
  activity: '🚶‍♂️'
};
