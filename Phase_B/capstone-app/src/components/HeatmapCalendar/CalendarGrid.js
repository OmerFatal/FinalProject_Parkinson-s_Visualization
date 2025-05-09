// src/components/HeatmapCalendar/CalendarGrid.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import TriangularHeatmapCell from './TriangularHeatmapCell';

export default function CalendarGrid({
  averagedScores,
  selectedYear,
  selectedMonth,
  setFutureDateClicked,
  setShowFutureModal,
  getColor
}) {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const navigate = useNavigate();

  const handleDayClick = (dateStr) => {
    const today = new Date();
    const clicked = new Date(dateStr);
    clicked.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (clicked > today) {
      setFutureDateClicked(clicked);
      setShowFutureModal(true);
    } else {
      const score = averagedScores[dateStr] || {};
      navigate(`/dashboard?date=${dateStr}&month=${selectedMonth}&year=${selectedYear}`, {
        state: {
          mood: score.mood,
          parkinson: score.parkinson,
          physical: score.physical
        }
      });
    }
  };

  return (
    <>
      {/* ריבועים ריקים בתחילת החודש */}
      {Array.from({ length: firstDayOfMonth }, (_, i) => (
        <div key={`empty-${i}`} className="calendar-cell empty-cell" />
      ))}

      {/* ימי החודש בפועל */}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const score = averagedScores[dateStr] || {};

        const isEmptyDay =
          score.mood == null &&
          score.parkinson == null &&
          score.physical == null;

        return (
          <div
            key={dateStr}
            className="calendar-cell"
            onClick={() => handleDayClick(dateStr)}
            style={{ cursor: 'pointer' }}
            title={isEmptyDay ? 'No mood/physical/Parkinson data for this day' : ''}
          >
            <TriangularHeatmapCell
              day={day}
              mood={score.mood}
              parkinson={score.parkinson}
              physical={score.physical}
              moodColor={getColor(score.mood)}
              parkinsonColor={getColor(score.parkinson)}
              physicalColor={getColor(score.physical)}
            />
          </div>
        );
      })}
    </>
  );
}
