// src/components/Graph/ProteinChart/proteinData.js

import { calculateAverageState } from '../calculateAverageState';

const proteinBaseData = [
  { time: '07:00', protein: 6, food: 'Skyr Yogurt' },
  { time: '08:30', protein: 4, food: 'Boiled Egg' },
  { time: '10:00', protein: 5, food: 'Tuna Sandwich' },
  { time: '12:00', protein: 8, food: 'Grilled Chicken' },
  { time: '14:30', protein: 3, food: 'Protein Shake' },
  { time: '17:00', protein: 6, food: 'Beef Stir Fry' },
  { time: '19:30', protein: 2, food: 'Lentil Soup' },
  { time: '21:00', protein: 3, food: 'Cottage Cheese' }
];

// פונקציה להמיר שעת טקסט (כגון "07:00") לדקות ביום
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// יוצרים את המערך החדש כולל מצבים מחושבים
const proteinData = proteinBaseData.map(item => {
  const minutes = timeToMinutes(item.time);
  const averages = calculateAverageState(minutes);
  return { ...item, ...averages };
});

export default proteinData;
