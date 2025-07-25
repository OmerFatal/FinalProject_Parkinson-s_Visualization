import { useState, useEffect } from 'react';

export default function useHeatmapCalendarState(entries) {

  {/* Load previously selected month/year from localStorage if available */}
  const storedMonthYear = localStorage.getItem('heatmap-monthYear');
  const defaultDate = storedMonthYear
    ? (() => {
        const [year, month] = storedMonthYear.split('-').map(Number);
        return { year, month };
      })()
    : { year: new Date().getFullYear(), month: new Date().getMonth() };

  {/* Main state variables for calendar and modal logic */}
  const [selectedYear, setSelectedYear] = useState(defaultDate.year);
  const [selectedMonth, setSelectedMonth] = useState(defaultDate.month);
  const [futureDateClicked, setFutureDateClicked] = useState(null);
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [noDataClicked, setNoDataClicked] = useState(null);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [averagedScores, setAveragedScores] = useState({});

  {/* Recalculate averaged scores whenever entries or selected date changes */}
  useEffect(() => {
    if (!entries || entries.length === 0) {
      setAveragedScores({});
      return;
    }

    {/* Filter entries to include only those from the selected month/year */}
    const filteredEntries = entries.filter((entry) => {
      const date = new Date(entry.Date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      );
    });

    if (filteredEntries.length === 0) {
      setAveragedScores({});
      return;
    }

    {/* Group entries by date */}
    const groupedByDate = {};
    filteredEntries.forEach((entry) => {
      const dateStr = entry.Date;
      if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
      groupedByDate[dateStr].push(entry);
    });

    {/* Helper function to average values and round to 1 decimal */}
    const average = (arr) =>
      arr.length === 0
        ? null
        : Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

    {/* Calculate averaged mood, parkinson, and physical scores for each day */}
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

  {/* Return all states and setters for use in the main component */}
  return {
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
  };
}
