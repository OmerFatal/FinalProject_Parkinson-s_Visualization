// ChartDataUtils.js

// ממיין לפי שעה בפורמט 'HH:MM'
export function sortByTime(data) {
  return [...data].sort((a, b) => {
    const [h1, m1] = a.time.split(':').map(Number);
    const [h2, m2] = b.time.split(':').map(Number);
    return h1 * 60 + m1 - (h2 * 60 + m2);
  });
}
