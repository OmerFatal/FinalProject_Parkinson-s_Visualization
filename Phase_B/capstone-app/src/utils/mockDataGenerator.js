// src/utils/mockDataGenerator.js

// פונקציה שמייצרת מספר רנדומלי בין min ל-max
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// פונקציה שמייצרת שעה רנדומלית במהלך היום
const getRandomHour = () => {
  const hour = getRandomNumber(0, 23);
  const minute = getRandomNumber(0, 59);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// פונקציה שמייצרת רשומה אחת (entry) עם ערכים רנדומליים
const generateRandomEntry = (date) => {
  return {
    date: date,
    time: getRandomHour(),
    feeling: getRandomNumber(1, 5),
    parkinson: getRandomNumber(1, 5),
    physical: getRandomNumber(1, 5)
  };
};

// פונקציה שמייצרת מספר רשומות רנדומלי ליום מסוים
const generateDayEntries = (date) => {
  const numEntries = getRandomNumber(3, 8); // 3-8 רשומות ליום
  const entries = [];
  
  for (let i = 0; i < numEntries; i++) {
    entries.push(generateRandomEntry(date));
  }
  
  // מיון לפי שעה
  return entries.sort((a, b) => a.time.localeCompare(b.time));
};

// פונקציה שמחשבת ממוצעים ליום מסוים
const calculateAverages = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      feeling: 0,
      parkinson: 0,
      physical: 0
    };
  }

  const sums = entries.reduce((acc, entry) => ({
    feeling: acc.feeling + entry.feeling,
    parkinson: acc.parkinson + entry.parkinson,
    physical: acc.physical + entry.physical
  }), { feeling: 0, parkinson: 0, physical: 0 });

  return {
    feeling: Math.round((sums.feeling / entries.length) * 10) / 10,
    parkinson: Math.round((sums.parkinson / entries.length) * 10) / 10,
    physical: Math.round((sums.physical / entries.length) * 10) / 10
  };
};

// פונקציה שמייצרת נתונים לחודש שלם
const generateMonthData = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthData = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    monthData[date] = generateDayEntries(date);
  }

  return monthData;
};

export {
  generateMonthData,
  calculateAverages,
  generateDayEntries
}; 