// src/components/HeatmapCalendar/MonthYearPicker.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MonthYearPicker({ selectedDate, setSelectedDate }) {
  return (
    <div
      className="datepicker-label-group"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}
    >
      <div
        className="heatmap-datepicker-label"
        style={{
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: '16px',
          color: '#374151',
          whiteSpace: 'nowrap'
        }}
      >
        Choose Month and Year:
      </div>
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
