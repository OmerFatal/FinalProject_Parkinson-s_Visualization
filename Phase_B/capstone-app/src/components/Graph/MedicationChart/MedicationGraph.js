import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ChartCore from './ChartCore';
import { pillTypes } from './PillTypes';

export default function MedicationGraph({ date = '2025-05-24', isMobile = false }) {
  const [medicationData, setMedicationData] = useState([]);
  const [visibleTypes, setVisibleTypes] = useState(Object.keys(pillTypes));

  useEffect(() => {
    // טוען תרופות מה־CSV
    Papa.parse('/data/combined_daily_view_activities_fixed_final.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const filtered = result.data.filter((row) => {
          if (!row.Date || !row.Time || !row.Report) return false;

          // המרת תאריך לפורמט אחיד
          let isoDate = row.Date;
          if (row.Date.includes('/')) {
            const [day, month, year] = row.Date.split('/');
            isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }

          return isoDate === date && row.Report.toLowerCase().includes('medic');
        });

        // מיפוי תרופות לפי שעות
        const byTime = {};
        filtered.forEach((row) => {
          const time = row.Time;
          if (!byTime[time]) byTime[time] = [];

          byTime[time].push({
            pillName: row.Name || row.Type || 'Unknown',
            amount: Number(row.Intensity) || 1
          });
        });

        // בניית מערך לתרשים
        const structuredData = Object.entries(byTime).map(([time, medications]) => ({
          time,
          medications
        }));

        setMedicationData(structuredData);
      },
      error: (err) => {
        console.error('❌ Error loading medication CSV:', err);
      }
    });
  }, [date]);

  return (
    <div>
      <h2 className="graph-title">💊 Medication Overview - {date}</h2>
      <ChartCore
        isMobile={isMobile}
        visibleTypes={visibleTypes}
        medicationData={medicationData}
      />
    </div>
  );
}
