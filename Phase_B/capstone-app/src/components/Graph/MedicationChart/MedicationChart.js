import React, { useState, useMemo } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillTypes, pillColors } from './PillTypes';
import { sortByTime } from './ChartDataUtils';

import './MedicationChart.css';

export default function MedicationChart({ entries, date }) {
  const isMobile = window.innerWidth <= 768;
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  const filtered = useMemo(() => {
    return entries.filter(
      (e) => e.Date === date && e.Report === 'Medicine' && e.Type && e.Notes
    );
  }, [entries, date]);

  const medicationData = useMemo(() => {
    const grouped = {};
    filtered.forEach((entry) => {
      const pillName = entry.Type?.trim();
      const time = entry.Time?.trim().slice(0, 5);
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

  const usedPills = new Set();
  medicationData.forEach((entry) => {
    entry.medications.forEach((m) => usedPills.add(m.pillName.trim()));
  });

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

  const handleToggle = (type) => {
    setVisibleTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleToggleAll = () => {
    setVisibleTypes((prev) =>
      prev.length === allTypes.length ? [] : allTypes
    );
  };

  return (
    <div className="medication-chart-wrapper">
      <h2 className="medication-chart-title">
        Medication Intake Summary – {formattedDate}
      </h2>

      <ChartCore
        isMobile={isMobile}
        visibleTypes={visibleTypes}
        medicationData={medicationData}
      />

      <div className="medication-controls-container">
        <div className="medication-controls-button-wrapper">
          <button
            onClick={handleToggleAll}
            className="medication-controls-button"
          >
            {visibleTypes.length === allTypes.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

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
