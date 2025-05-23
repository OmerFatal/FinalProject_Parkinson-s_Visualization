// src/components/HeatmapCalendar/HeatmapCalendar.js
import React, { useState, useEffect } from 'react';
import './HeatmapCalendar.css';
import NavBarHeatMap from './NavBarHeatMap';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import FutureDateModal from './FutureDateModal';
import LegendSampleBox from './LegendSampleBox';
import HeatmapLegend from './HeatmapLegend';
import MonthYearPicker from './MonthYearPicker';

export default function HeatmapCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem('heatmap-monthYear');
    if (saved) {
      const [year, month] = saved.split('-').map(Number);
      return new Date(year, month, 1);
    }
    return new Date();
  });

  const [rawEntries, setRawEntries] = useState([]);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [futureDateClicked, setFutureDateClicked] = useState(null);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const key = `heatmap-${year}-${month}`;

    const savedData = localStorage.getItem(key);
    if (savedData) {
      setRawEntries(JSON.parse(savedData));
    } else {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
      const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
      const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

      const entries = [];
      const maybeNull = (value) => (Math.random() < 0.2 ? null : value);

      for (let day = 1; day <= lastDay; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const recordsCount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < recordsCount; i++) {
          entries.push({
            date: dateStr,
            mood: maybeNull(+(Math.random() * 4 + 1).toFixed(1)),
            parkinson: maybeNull(+(Math.random() * 4 + 1).toFixed(1)),
            physical: maybeNull(+(Math.random() * 4 + 1).toFixed(1))
          });
        }
      }

      localStorage.setItem(key, JSON.stringify(entries));
      setRawEntries(entries);
    }
  }, [selectedDate]);

  const aggregateData = () => {
    const grouped = {};
    rawEntries.forEach(({ date, mood, parkinson, physical }) => {
      if (!grouped[date]) grouped[date] = { mood: [], parkinson: [], physical: [] };
      if (mood != null) grouped[date].mood.push(mood);
      if (parkinson != null) grouped[date].parkinson.push(parkinson);
      if (physical != null) grouped[date].physical.push(physical);
    });

    const average = (arr) =>
      arr.length === 0 ? null : +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

    return Object.fromEntries(
      Object.entries(grouped).map(([date, vals]) => [
        date,
        {
          mood: average(vals.mood),
          parkinson: average(vals.parkinson),
          physical: average(vals.physical)
        }
      ])
    );
  };

  const getColor = (value) => {
    if (value == null) return '#ccc';
    if (value <= 1.5) return '#00cc66';
    if (value <= 2.5) return '#66e695';
    if (value <= 3.5) return '#ffd966';
    if (value <= 4.5) return '#f6b26b';
    return '#e06666';
  };

  const averagedScores = aggregateData();
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();

  return (
    <>
      <NavBarHeatMap />

      <div className="calendar-container">
        <div className="monthly-heatmap-title">
          Welcome, Michael – Here’s Your Personalized Heatmap:
        </div>

        <div className="monthly-heatmap-subtitle">
          Click on a date to view detailed information.
        </div>

        <MonthYearPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="calendar-content-wrapper">
          <div className="calendar-grid">
            <CalendarHeader />
            <CalendarGrid
              averagedScores={averagedScores}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setFutureDateClicked={setFutureDateClicked}
              setShowFutureModal={setShowFutureModal}
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
    </>
  );
}
