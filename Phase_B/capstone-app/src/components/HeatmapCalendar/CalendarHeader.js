// src/components/HeatmapCalendar/CalendarHeader.js
import React from 'react';

export default function CalendarHeader() {
  return (
    <>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="calendar-header">{day}</div>
      ))}
    </>
  );
}
