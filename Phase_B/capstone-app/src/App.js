import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeatmapCalendar from './components/HeatmapCalendar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeatmapCalendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
