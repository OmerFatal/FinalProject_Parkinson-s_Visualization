// src/components/HeatmapCalendar/MonthYearPicker.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MonthYearPicker({ selectedDate, setSelectedDate }) {
  return (
    <div className="datepicker-label-group">
      <div className="heatmap-datepicker-label">Choose Month And Year:</div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => date && setSelectedDate(date)}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        maxDate={new Date()}
      />
    </div>
  );
}
