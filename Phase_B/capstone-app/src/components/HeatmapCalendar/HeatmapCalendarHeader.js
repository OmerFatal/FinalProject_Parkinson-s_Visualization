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
      {/* Main title of the calendar view */}
      <div className="monthly-heatmap-title">
        Welcome, Michael – Here's Your Heatmap Calendar
      </div>
      
      {/* Subtitle with usage instruction */}
      <div className="monthly-heatmap-subtitle">
        Click on a date to view detailed information.
      </div>

      {/* Dropdown selectors for month and year */}
      <MonthYearPicker
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
      />
    </>
  );
}
