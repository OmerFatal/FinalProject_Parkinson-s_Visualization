import React, { useState, useMemo } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillTypes, pillColors } from './PillTypes';
import { sortByTime } from './ChartDataUtils';
import './MedicationChart.css';

export default function MedicationChart({ entries, date }) {
  const isMobile = window.innerWidth <= 768;
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  // Filter only medication entries for the selected date
  const filtered = useMemo(() => {
    return entries.filter(
      (e) => e.Date === date && e.Report === 'Medicine' && e.Type && e.Notes
    );
  }, [entries, date]);

    // Process data to create chart-friendly structure
  const medicationData = useMemo(() => {
    const grouped = {};
    filtered.forEach((entry) => {
      const pillName = entry.Type?.trim();
      const time = entry.Time?.trim().slice(0, 5); // HH:mm
      const amountMatch = entry.Notes?.trim().match(/([0-9.]+)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;

      if (!grouped[time]) grouped[time] = { time, medications: [] };
      grouped[time].medications.push({ pillName, amount });
    });

    const mapped = Object.values(grouped).map((entry) => {
      const obj = { time: entry.time };
      entry.medications.forEach((med) => {
        const name = med.pillName?.trim();
        obj[name] = (obj[name] || 0) + med.amount;
      });
      obj.medications = entry.medications;
      return obj;
    });

    return sortByTime(mapped);
  }, [filtered]);

  // Identify all pills used in the chart
  const usedPills = new Set();
  medicationData.forEach((entry) => {
    entry.medications.forEach((m) => usedPills.add(m.pillName.trim()));
  });

  // Map pills to their types using the predefined pillTypes object
  const usedPillTypes = {};
  Object.entries(pillTypes).forEach(([type, pills]) => {
    const matched = pills.filter((p) =>
      Array.from(usedPills).some(up =>
        up.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(up.toLowerCase())
      )
    );
    if (matched.length > 0) usedPillTypes[type] = matched;
  });

  const allTypes = Object.keys(usedPillTypes);
  const [visibleTypes, setVisibleTypes] = useState(allTypes);

  // Toggle a specific pill type on/off
  const handleToggle = (type) => {
    setVisibleTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  // Toggle all pill types on/off
  const handleToggleAll = () => {
    setVisibleTypes((prev) =>
      prev.length === allTypes.length ? [] : allTypes
    );
  };

  return (
    <div className="medication-chart-wrapper">
      {/* Chart title with formatted date */}
      <h2 className="medication-chart-title">
        Medication Intake Summary – {formattedDate}
      </h2>

      {/* Main chart displaying the medication data */}
      <ChartCore
        isMobile={isMobile}
        visibleTypes={visibleTypes}
        medicationData={medicationData}
      />
      {/* Controls for selecting/deselecting pills */}
      <div className="medication-controls-container">
        <div className="medication-controls-button-wrapper">
          <button
            onClick={handleToggleAll}
            className="medication-controls-button"
          >
            {visibleTypes.length === allTypes.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        {/* Legend showing pill categories with toggle buttons */}
        <LegendPills
          pillTypes={usedPillTypes}
          pillColors={pillColors}
          visibleTypes={visibleTypes}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
