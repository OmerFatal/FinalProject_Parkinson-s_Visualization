import React, { useEffect, useState } from 'react';
import './HeatmapCalendar.css';
import NavBarHeatMap from './NavBarHeatMap';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import FutureDateModal from './FutureDateModal';
import LegendSampleBox from './LegendSampleBox';
import HeatmapLegend from './HeatmapLegend';
import MonthYearPicker from './MonthYearPicker';
import NoDataModal from './NoDataModal';

export default function HeatmapCalendar({ entries }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [futureDateClicked, setFutureDateClicked] = useState(null);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [noDataClicked, setNoDataClicked] = useState(null);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [monthData, setMonthData] = useState({});
  const [averagedScores, setAveragedScores] = useState({});

  useEffect(() => {
    if (!entries || entries.length === 0) {
      setMonthData({});
      setAveragedScores({});
      return;
    }

    const filteredEntries = entries.filter((entry) => {
      const date = new Date(entry.Date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      );
    });

    if (filteredEntries.length === 0) {
      setMonthData({});
      setAveragedScores({});
      return;
    }

    const groupedByDate = {};
    filteredEntries.forEach((entry) => {
      const dateStr = entry.Date;
      if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
      groupedByDate[dateStr].push(entry);
    });

    setMonthData(groupedByDate);

    const newAveragedScores = {};
    Object.entries(groupedByDate).forEach(([date, dayEntries]) => {
      newAveragedScores[date] = {
        mood: average(dayEntries.map((e) => e.mood).filter((v) => v != null)),
        parkinson: average(dayEntries.map((e) => e.parkinson).filter((v) => v != null)),
        physical: average(dayEntries.map((e) => e.physical).filter((v) => v != null))
      };
    });

    setAveragedScores(newAveragedScores);
  }, [entries, selectedYear, selectedMonth]);

  const average = (arr) =>
    arr.length === 0
      ? null
      : Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  const getColor = (score) => {
    if (!score) return '#e0e0e0';
    const rounded = Math.round(score);
    const colors = {
      1: '#00cc66',
      2: '#66e695',
      3: '#ffd966',
      4: '#f6b26b',
      5: '#e06666'
    };
    return colors[rounded] || '#e0e0e0';
  };

  // ✅ בדיקה אם כל הימים אפורים לגמרי
  const allDaysAreEmpty = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const score = averagedScores[dateStr];

      if (score) {
        if (score.mood != null || score.parkinson != null || score.physical != null) {
          return false;
        }
      }
    }

    return true;
  };

  return (
    <>
      <NavBarHeatMap />
      <div className="calendar-container">
        <div className="monthly-heatmap-title">
          Welcome, Michael – Here's Your Personal Health Calendar
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

{allDaysAreEmpty() && (
  <div
    style={{
      textAlign: 'center',
      color: '#000000',
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '1.2rem'
    }}
  >
    No Data Available For{' '}
    {new Date(selectedYear, selectedMonth).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric'
    })}
    . Please Select Different Month.
  </div>
)}


        <div className="calendar-content-wrapper">
          <div className="calendar-grid">
            <CalendarHeader />
            <CalendarGrid
              averagedScores={averagedScores}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setFutureDateClicked={setFutureDateClicked}
              setShowFutureModal={setShowFutureModal}
              setNoDataClicked={setNoDataClicked}
              setShowNoDataModal={setShowNoDataModal}
              getColor={getColor}
            />
          </div>
          <div className="legend-column-wrapper">
            <HeatmapLegend />
            <LegendSampleBox />
          </div>
        </div>

        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Parkinson Dashboard. All rights reserved.</p>
        </footer>
      </div>

      {showFutureModal && (
        <FutureDateModal
          clickedDate={futureDateClicked}
          onClose={() => setShowFutureModal(false)}
        />
      )}

      {showNoDataModal && (
        <NoDataModal
          clickedDate={noDataClicked}
          onClose={() => setShowNoDataModal(false)}
        />
      )}
    </>
  );
}
