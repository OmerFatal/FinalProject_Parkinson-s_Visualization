import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Papa from 'papaparse';

import HeatmapCalendar from './components/HeatmapCalendar/HeatmapCalendar';
import Dashboard from './components/Dashboard';

function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    Papa.parse('/data/combined_daily_view_activities_fixed_final_with_intensity.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const mapped = result.data.map((r) => {
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
      }
    });
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
