import React from 'react';
import './HeatmapCalendar.css';
import NavBarHeatMap from './NavBarHeatMap';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import HeatmapLegend from './HeatmapLegend';
import LegendSampleBox from './LegendSampleBox';

import useHeatmapCalendarState from './useHeatmapCalendarState';
import HeatmapCalendarHeader from './HeatmapCalendarHeader';
import NoDataMessage from './NoDataMessage';
import HeatmapCalendarFooter from './HeatmapCalendarFooter';
import ModalsContainer from './ModalsContainer';

export default function HeatmapCalendar({ entries }) {
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    futureDateClicked,
    setFutureDateClicked,
    showFutureModal,
    setShowFutureModal,
    noDataClicked,
    setNoDataClicked,
    showNoDataModal,
    setShowNoDataModal,
    averagedScores
  } = useHeatmapCalendarState(entries);

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

  const allDaysAreEmpty = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const score = averagedScores[dateStr];
      if (score && (score.mood != null || score.parkinson != null || score.physical != null)) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <NavBarHeatMap />

      <div className="calendar-container">
        <HeatmapCalendarHeader
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />

        {allDaysAreEmpty() && (
          <NoDataMessage selectedYear={selectedYear} selectedMonth={selectedMonth} />
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

        <HeatmapCalendarFooter />
      </div>

      <ModalsContainer
        showFutureModal={showFutureModal}
        setShowFutureModal={setShowFutureModal}
        futureDateClicked={futureDateClicked}
        showNoDataModal={showNoDataModal}
        setShowNoDataModal={setShowNoDataModal}
        noDataClicked={noDataClicked}
      />
    </>
  );
}
