import dailyEntries from './dailyEntries';

// קולט זמן התחלה בדקות, ומחזיר ממוצעים + זמני מדידה ראשונים לכל מדד
export function calculateAverageState(startMinutes) {
  const endMinutes = startMinutes + 180; // טווח של 3 שעות קדימה

  const relevantEntries = dailyEntries.filter(entry =>
    entry.timeMinutes >= startMinutes && entry.timeMinutes <= endMinutes
  );

  if (relevantEntries.length === 0) {
    return {
      feeling: null, feelingTime: null,
      physical: null, physicalTime: null,
      parkinson: null, parkinsonTime: null
    };
  }

  // מוצאים את הדיווח הראשון של כל מדד
  const firstFeeling = relevantEntries.find(e => e.feeling != null);
  const firstPhysical = relevantEntries.find(e => e.physical != null);
  const firstParkinson = relevantEntries.find(e => e.parkinson != null);

  const count = relevantEntries.length;

  const sum = relevantEntries.reduce((acc, entry) => {
    acc.feeling += entry.feeling ?? 0;
    acc.physical += entry.physical ?? 0;
    acc.parkinson += entry.parkinson ?? 0;
    return acc;
  }, { feeling: 0, physical: 0, parkinson: 0 });

  return {
    feeling: parseFloat((sum.feeling / count).toFixed(2)),
    feelingTime: firstFeeling?.time ?? null,

    physical: parseFloat((sum.physical / count).toFixed(2)),
    physicalTime: firstPhysical?.time ?? null,

    parkinson: parseFloat((sum.parkinson / count).toFixed(2)),
    parkinsonTime: firstParkinson?.time ?? null
  };
}
