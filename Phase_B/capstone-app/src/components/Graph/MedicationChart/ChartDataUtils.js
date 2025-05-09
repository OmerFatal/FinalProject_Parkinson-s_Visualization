import rawMedicationData from './medicationData';
import { pillColors } from './PillTypes';

export function sortByTime(data) {
  return [...data].sort((a, b) => {
    const [h1, m1] = a.time.split(':').map(Number);
    const [h2, m2] = b.time.split(':').map(Number);
    return h1 * 60 + m1 - (h2 * 60 + m2);
  });
}

export const medicationData = sortByTime(
  rawMedicationData.map(entry => {
    const medObject = { time: entry.time };
    entry.medications.forEach(med => {
      medObject[med.pillName] = (medObject[med.pillName] || 0) + med.amount;
    });
    medObject.medications = entry.medications;
    return medObject;
  })
);

export const maxTotal = Math.ceil(
  Math.max(...medicationData.map(entry =>
    Object.keys(entry)
      .filter(key => key !== 'time' && key !== 'medications')
      .reduce((sum, key) => sum + (entry[key] || 0), 0)
  ))
);

export const yTicks = [];
for (let i = 0; i <= maxTotal; i += 0.25) {
  yTicks.push(Number(i.toFixed(2)));
}

export const topPillsPerTime = (() => {
  const renderedPills = Object.keys(pillColors);
  const result = {};
  medicationData.forEach(entry => {
    const present = entry.medications.map(m => m.pillName);
    const last = renderedPills.findLast(p => present.includes(p));
    if (last) result[entry.time] = last;
  });
  return result;
})();
