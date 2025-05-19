// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import './Dashboard.css';

import DailyAnalysisGraph from './Graph/DailyAnalysisGraph/DailyAnalysisGraph';
import CombinedGraph from './Graph/CombinedGraph'; // ✅ גרף משולב חדש
import ProteinChart from './Graph/ProteinChart/ProteinChart';
import MedicationChart from './Graph/MedicationChart/MedicationChart';
import ActivitySummaryGraph from './Graph/ActivitySummaryGraph/ActivitySummaryGraph';
import CombinedStateTimelineGraph from './Graph/CombinedStateTimelineGraph';

export default function Dashboard() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDate = query.get('date');
  const selectedMonth = query.get('month');
  const selectedYear = query.get('year');

  const rawState = location.state || {};
  const initialAverages = {
    feeling: rawState.mood ?? null,
    parkinson: rawState.parkinson ?? null,
    physical: rawState.physical ?? null
  };

  const [dayData, setDayData] = useState(null);

  useEffect(() => {
    if (selectedYear !== null && selectedMonth !== null) {
      localStorage.setItem('heatmap-monthYear', `${selectedYear}-${selectedMonth}`);
    } else if (selectedDate) {
      const d = new Date(selectedDate);
      localStorage.setItem('heatmap-monthYear', `${d.getFullYear()}-${d.getMonth()}`);
    }
  }, [selectedDate, selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchDayData = async () => {
      if (!selectedDate) return;

      try {
        const response = await fetch(`/api/get-day-details?date=${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch day details');
        }

        const data = await response.json();
        console.log('🔥 Fetched nutritions data:', data.nutritions);

        setDayData(data);
      } catch (error) {
        console.error('Error fetching day details:', error);
      }
    };

    fetchDayData();
  }, [selectedDate]);

  return (
    <>
      <NavBar />
      <div className="dashboard-wrapper">
        {/* 🔹 הגרף היומי המקורי */}
        <div className="dashboard-card full-width" id="analysis">
          <DailyAnalysisGraph
            date={selectedDate}
            initialAverages={initialAverages}
            dailyData={dayData}
          />
        </div>

                {/* 🔹 גרף משולב חדש: שלושה קווים + אייקונים */}
                <div className="dashboard-card full-width" id="combined-state-timeline-graph">
          <CombinedStateTimelineGraph initialAverages={initialAverages} date={selectedDate} />
        </div>
      </div>

        {/* 🔹 הגרף המשולב החדש (יומי + פעילויות בציר נוסף) */}
        <div className="dashboard-card full-width" id="combined-graph">
          <CombinedGraph
            date={selectedDate}
            initialAverages={initialAverages}
            dailyData={dayData}
          />
        </div>

        {/* 🔹 גרף חלבון */}
        <div className="dashboard-card full-width" id="protein">
          <ProteinChart />
        </div>

        {/* 🔹 גרף תרופות */}
        <div className="dashboard-card full-width" id="medication">
          <MedicationChart />
        </div>

        {/* 🔹 גרף פעילויות מלא */}
        <div className="dashboard-card full-width" id="activity-summary">
          <ActivitySummaryGraph />
        </div>




      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Parkinson Visualization. All rights reserved.</p>
      </footer>
    </>
  );
}
