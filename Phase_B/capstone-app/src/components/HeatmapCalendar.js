import React, { useState, useEffect } from 'react';
import './HeatmapCalendar.css';
import TriangularHeatmapCell from './TriangularHeatmapCell';
import LegendSampleBox from './LegendSampleBox';
import NavBarHeatMap from './NavBarHeatMap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

export default function HeatmapCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rawEntries, setRawEntries] = useState([]);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const key = `heatmap-${year}-${month}`;

    const savedData = localStorage.getItem(key);
    if (savedData) {
      setRawEntries(JSON.parse(savedData));
    } else {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const entries = [];

      const maybeNull = (value) => (Math.random() < 0.2 ? null : value);

      for (let day = 1; day <= daysInMonth; day++) {
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

  const averagedScores = aggregateData();
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const monthName = selectedDate.toLocaleString('en-US', { month: 'long' });
  const fullTitle = `${monthName} ${selectedYear}`;

  const getColor = (value) => {
    if (value == null) return '#ccc';
    if (value <= 1.5) return '#00cc66';
    if (value <= 2.5) return '#66e695';
    if (value <= 3.5) return '#ffd966';
    if (value <= 4.5) return '#f6b26b';
    return '#e06666';
  };

  return (
    <>
      <NavBarHeatMap />

      <div className="calendar-container">
        <div className="monthly-heatmap-title">{fullTitle}</div>

        <div className="datepicker-label-group">
          <div className="heatmap-datepicker-label">Choose Month And Year:</div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              if (date) setSelectedDate(date);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            maxDate={new Date()}
          />
        </div>

        <div className="calendar-content-wrapper">
          <div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-header">{day}</div>
              ))}

              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="calendar-cell empty-cell" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const score = averagedScores[dateStr] || {};

                return (
                  <div key={dateStr} className="calendar-cell">
                    <Link
                      to={`/dashboard?date=${dateStr}`}
                      state={{
                        mood: score.mood,
                        parkinson: score.parkinson,
                        physical: score.physical
                      }}
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
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="legend-column-wrapper">
            <div className="heatmap-legend-container">
              <div className="heatmap-legend-bar-vertical">
                <div className="scale-level level-5"></div>
                <div className="scale-level level-4"></div>
                <div className="scale-level level-3"></div>
                <div className="scale-level level-2"></div>
                <div className="scale-level level-1"></div>
              </div>
              <div className="scale-labels">
                <div className="scale-label">5 (Worse)</div>
                <div className="scale-label">4</div>
                <div className="scale-label">3</div>
                <div className="scale-label">2</div>
                <div className="scale-label">1 (Best)</div>
              </div>
            </div>
            <LegendSampleBox />
          </div>
        </div>

        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Parkinson Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
