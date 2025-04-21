import React from 'react';
import { useLocation } from 'react-router-dom';
import DailyAnalysisGraph from './DailyAnalysisGraph';
import SleepExerciseChart from './SleepExerciseChart';
import NutritionChart from './NutritionChart';
import NavBar from './NavBar';
import './Dashboard.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Dashboard() {
  const query = useQuery();
  const selectedDate = query.get('date'); // תאריך מה-URL

  return (
    <>
      <NavBar />
      <div className="dashboard-wrapper">
        <div className="dashboard-card full-width" id="analysis">
          <DailyAnalysisGraph date={selectedDate} />
        </div>
        <div className="dashboard-row-two-columns">
          <div className="dashboard-card half-width" id="exercise">
            <SleepExerciseChart date={selectedDate} />
          </div>
          <div className="dashboard-card half-width" id="nutrition">
            <NutritionChart date={selectedDate} />
          </div>
        </div>
      </div>
      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Parkinson Visualization. All rights reserved.</p>
      </footer>
    </>
  );
}
