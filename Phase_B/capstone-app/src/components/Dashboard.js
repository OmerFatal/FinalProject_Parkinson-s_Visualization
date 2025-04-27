import React from 'react';
import { useLocation } from 'react-router-dom';
import DailyAnalysisGraph from './Graph/DailyAnalysisGraph/DailyAnalysisGraph';
import NavBar from './NavBar';
import './Dashboard.css';
import ProteinChart from './Graph/ProteinChart/ProteinChart';
import MedicationChart from './Graph/MedicationChart/MedicationChart';
import ActivitySummaryGraph from './Graph/ActivitySummaryGraph/ActivitySummaryGraph'; // ✅ ייבוא הגרף החדש

export default function Dashboard() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDate = query.get('date');

  const rawState = location.state || {};
  const initialAverages = {
    feeling: rawState.mood ?? null,
    parkinson: rawState.parkinson ?? null,
    physical: rawState.physical ?? null
  };

  return (
    <>
      <NavBar />
      <div className="dashboard-wrapper">

        {/* גרף ניתוח יומי */}
        <div className="dashboard-card full-width" id="analysis">
          <DailyAnalysisGraph date={selectedDate} initialAverages={initialAverages} />
        </div>

        {/* גרף חלבון */}
        <div className="dashboard-card full-width" id="protein">
          <ProteinChart />
        </div>

        {/* גרף תרופות */}
        <div className="dashboard-card full-width" id="medication">
          <MedicationChart />
        </div>

        {/* גרף פעילות יומית לפי קטגוריה */}
        <div className="dashboard-card full-width" id="activity-summary">
          <ActivitySummaryGraph />
        </div>

      </div>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Parkinson Visualization. All rights reserved.</p>
      </footer>
    </>
  );
}
