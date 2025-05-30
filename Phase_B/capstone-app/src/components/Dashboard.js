// Dashboard.js

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import './Dashboard.css';

import DailyAnalysisGraph from './Graph/DailyAnalysisGraph/DailyAnalysisGraph';
import CombinedGraph from './Graph/CombinedGraph';
import ProteinChart from './Graph/ProteinChart/ProteinChart';
import MedicationChart from './Graph/MedicationChart/MedicationChart';
import ActivitySummaryGraph from './Graph/ActivitySummaryGraph/ActivitySummaryGraph';
import CombinedStateTimelineGraph from './Graph/CombinedStateTimelineGraph/CombinedStateTimelineGraph';

export default function Dashboard({ entries = [] }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDate = query.get('date') || new Date().toISOString().slice(0, 10);
  const selectedMonth = query.get('month');
  const selectedYear = query.get('year');

  const rawState = location.state || {};
  const initialAverages = {
    feeling: rawState.mood ?? null,
    parkinson: rawState.parkinson ?? null,
    physical: rawState.physical ?? null
  };

  useEffect(() => {
    if (selectedYear !== null && selectedMonth !== null) {
      localStorage.setItem('heatmap-monthYear', `${selectedYear}-${selectedMonth}`);
    } else if (selectedDate) {
      const d = new Date(selectedDate);
      localStorage.setItem('heatmap-monthYear', `${d.getFullYear()}-${d.getMonth()}`);
    }
  }, [selectedDate, selectedMonth, selectedYear]);

  return (
    <>
      <NavBar />
      <div className="dashboard-wrapper">

        {/* 🔹 גרף מצב כללי תלת-מצבי */}
        <div className="dashboard-card full-width" id="analysis">
          <CombinedStateTimelineGraph
            entries={entries}
            initialAverages={initialAverages}
            date={selectedDate}
          />
        </div>

        {/* 🔹 גרף משולב חזותי נוסף */}
        <div className="dashboard-card full-width" id="combined-graph">
          <CombinedGraph
            date={selectedDate}
            initialAverages={initialAverages}
          />
        </div>

        {/* 🔹 גרף חלבונים */}
        <div className="dashboard-card full-width" id="protein">
          <ProteinChart
            date={selectedDate}
            entries={entries}
          />
        </div>

        {/* 🔹 גרף תרופות */}
        <div className="dashboard-card full-width" id="medication">
          <MedicationChart
            date={selectedDate}
            entries={entries}
          />
        </div>

        {/* 🔹 גרף פעילויות לפי קטגוריה */}
        <div className="dashboard-card full-width" id="activity-summary">
          <ActivitySummaryGraph
            date={selectedDate}
            entries={entries}
          />
        </div>

      </div>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Parkinson Visualization. All rights reserved.</p>
      </footer>
    </>
  );
}
