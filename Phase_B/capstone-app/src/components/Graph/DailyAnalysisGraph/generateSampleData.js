export const toMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const generateSampleData = () => {
  return [
    { time: "06:15", timeMinutes: toMinutes("06:15"), icon: "sleep", feeling: 4, feelingTime: "07:00", parkinson: 3, parkinsonTime: "07:00", physical: 4, physicalTime: "07:00" },
    { time: "08:30", timeMinutes: toMinutes("08:30"), icon: "nutrition", feeling: 3, feelingTime: "09:00", parkinson: 2, parkinsonTime: "09:00", physical: 3, physicalTime: "09:00" },
    { time: "09:10", timeMinutes: toMinutes("09:10"), icon: "activity", feeling: 3, feelingTime: "10:00", parkinson: 2, parkinsonTime: "10:00", physical: 2, physicalTime: "10:00" },
    { time: "11:45", timeMinutes: toMinutes("11:45"), icon: "activity", feeling: 2, feelingTime: "12:00", parkinson: 2, parkinsonTime: "12:00", physical: 3, physicalTime: "12:00" }, // 🔥 הוספה חדשה
    { time: "14:00", timeMinutes: toMinutes("14:00"), icon: "sleep", feeling: 2, feelingTime: "14:30", parkinson: 2, parkinsonTime: "14:30", physical: 2, physicalTime: "14:30" },
    { time: "16:00", timeMinutes: toMinutes("16:00"), icon: "nutrition", feeling: 1, feelingTime: "15:00", parkinson: 3, parkinsonTime: "15:00", physical: 4, physicalTime: "15:00" },
    { time: "17:20", timeMinutes: toMinutes("17:20"), icon: "medication", feeling: 2, feelingTime: "18:00", parkinson: 2, parkinsonTime: "18:00", physical: 2, physicalTime: "18:00" },
    { time: "18:50", timeMinutes: toMinutes("18:50"), icon: "activity", feeling: 2, feelingTime: "19:30", parkinson: 3, parkinsonTime: "19:30", physical: 2, physicalTime: "19:30" }, // 🔥 הוספה חדשה
    { time: "20:15", timeMinutes: toMinutes("20:15"), icon: "nutrition", feeling: 2, feelingTime: "20:30", parkinson: 2, parkinsonTime: "20:30", physical: 2, physicalTime: "20:30" }, // 🔥 הוספה חדשה
    { time: "22:45", timeMinutes: toMinutes("22:45"), icon: "sleep", feeling: 1, feelingTime: "23:30", parkinson: 1, parkinsonTime: "23:30", physical: 1, physicalTime: "23:30" }
  ];
};
