import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeatmapCalendar from './components/HeatmapCalendar/HeatmapCalendar';
import Dashboard from './components/Dashboard';
import { loadCSVData } from './utils/loadCSV';

function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadCSVData('/data/daily_data.csv')
      .then((result) => {
        const mapped = result.map((r) => {
          let isoDate = r.Date;

          if (typeof r.Date === 'string' && r.Date.includes('/')) {
            const [day, month, year] = r.Date.split('/');
            isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }

          return {
            ...r,
            Date: isoDate,
            moodOriginal: r.Type === 'My Mood' ? Number(r.Intensity) : null,
            mood: r.Type === 'My Mood' ? 6 - Number(r.Intensity) : null,
            parkinson: r.Type === "Parkinson's State" ? Number(r.Intensity) : null,
            physical: r.Type === 'Physical Difficulty' ? Number(r.Intensity) : null
          };
        });

        setEntries(mapped);
      })
      .catch((err) => console.error('CSV Load Error:', err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeatmapCalendar entries={entries} />} />
        <Route path="/dashboard" element={<Dashboard entries={entries} />} />
      </Routes>
    </Router>
  );
}

export default App;