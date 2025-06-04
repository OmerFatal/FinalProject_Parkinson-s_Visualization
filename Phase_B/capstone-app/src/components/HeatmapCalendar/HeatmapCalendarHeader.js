import React from 'react';
import MonthYearPicker from './MonthYearPicker';

export default function HeatmapCalendarHeader({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth
}) {
  return (
    <>
      <div className="monthly-heatmap-title">
        Welcome, Michael – Here's Your Heatmap Calendar
      </div>
      <div className="monthly-heatmap-subtitle">
        Click on a date to view detailed information.
      </div>

      <MonthYearPicker
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
      />
    </>
  );
}
