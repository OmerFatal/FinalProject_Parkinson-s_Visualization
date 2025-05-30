import React, { useState, useEffect } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillColors } from './PillTypes';
import useMedicationData from './useMedicationData';

import './MedicationGraph.css'; 

export default function MedicationChart({ entries, date }) {
  const isMobile = window.innerWidth <= 768;
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  const { medicationData, usedPillTypes } = useMedicationData(entries, date);

  const allTypes = Object.keys(usedPillTypes);
  const [visibleTypes, setVisibleTypes] = useState([]);

  useEffect(() => {
    if (allTypes.length > 0) {
      setVisibleTypes(allTypes);
    } else {
      setVisibleTypes([]);
    }
  }, [allTypes]);

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
