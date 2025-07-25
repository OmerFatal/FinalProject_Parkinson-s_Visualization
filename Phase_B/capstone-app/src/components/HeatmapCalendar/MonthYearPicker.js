import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MonthYearPicker({ selectedYear, selectedMonth, setSelectedYear, setSelectedMonth }) {

  {/* Construct a Date object from selected year and month */}
  const selectedDate = new Date(selectedYear, selectedMonth, 1);

  {/* Update selected year and month when user picks a new date */}
  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
  };

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

    {/* Label next to the date picker */}
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

      {/* Month and Year dropdown selector */}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        maxDate={new Date()}
      />
    </div>
  );
}
