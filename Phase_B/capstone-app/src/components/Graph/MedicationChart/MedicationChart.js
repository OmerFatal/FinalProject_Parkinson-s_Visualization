import React, { useState, useEffect } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillColors } from './PillTypes';
import useMedicationData from './useMedicationData';

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
  }, [allTypes]); // <-- כאן התיקון: הוספנו allTypes במערך התלויות

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
    <div style={{ width: '100%', padding: '0 24px' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Medication Intake Summary – {formattedDate}
      </h2>

      <ChartCore
        isMobile={isMobile}
        visibleTypes={visibleTypes}
        medicationData={medicationData}
      />

      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <button
            onClick={handleToggleAll}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
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
