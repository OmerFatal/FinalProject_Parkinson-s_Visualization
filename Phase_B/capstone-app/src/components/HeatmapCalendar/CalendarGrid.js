import React from 'react';
import { useNavigate } from 'react-router-dom';
import TriangularHeatmapCell from './TriangularHeatmapCell';

export default function CalendarGrid({
  averagedScores,
  selectedYear,
  selectedMonth,
  setFutureDateClicked,
  setShowFutureModal,
  setNoDataClicked,
  setShowNoDataModal,
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

    const score = averagedScores[dateStr] || {};
    const mood = score.mood;
    const parkinson = score.parkinson;
    const physical = score.physical;

    if (clicked > today) {
      setFutureDateClicked(clicked);
      setShowFutureModal(true);
      return;
    }

    if (mood == null && parkinson == null && physical == null) {
      setNoDataClicked(clicked);
      setShowNoDataModal(true);
      return;
    }

    navigate(`/dashboard?date=${dateStr}&month=${selectedMonth}&year=${selectedYear}`, {
      state: { mood, parkinson, physical }
    });
  };

  return (
    <>
      {Array.from({ length: firstDayOfMonth }, (_, i) => (
        <div key={`empty-${i}`} className="calendar-cell empty-cell" />
      ))}

      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const score = averagedScores[dateStr] || {};

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisDate = new Date(dateStr);
        thisDate.setHours(0, 0, 0, 0);
        const isFutureDate = thisDate > today;

        const moodValue = isFutureDate ? null : score.mood;
        const parkinsonValue = isFutureDate ? null : score.parkinson;
        const physicalValue = isFutureDate ? null : score.physical;

        const isEmptyDay =
          moodValue == null &&
          parkinsonValue == null &&
          physicalValue == null;

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
              mood={moodValue}
              parkinson={parkinsonValue}
              physical={physicalValue}
              moodColor={
                isFutureDate || score.mood == null
                  ? '#e0e0e0'
                  : getColor(score.mood)
              }
              parkinsonColor={
                isFutureDate || score.parkinson == null
                  ? '#e0e0e0'
                  : getColor(score.parkinson)
              }
              physicalColor={
                isFutureDate || score.physical == null
                  ? '#e0e0e0'
                  : getColor(score.physical)
              }
            />
          </div>
        );
      })}
    </>
  );
}
