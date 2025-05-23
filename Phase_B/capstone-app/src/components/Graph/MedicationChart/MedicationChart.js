import React, { useState } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillColors } from './PillTypes';
import { getUsedPillTypes } from './ChartDataUtils';

export default function MedicationChart() {
  const isMobile = window.innerWidth <= 768;

  // ✅ לוקח רק את הסוגים שנמצאים בפועל בדאטה
  const usedPillTypes = getUsedPillTypes();
  const allTypes = Object.keys(usedPillTypes);
  const [visibleTypes, setVisibleTypes] = useState(new Set(allTypes));

  const handleToggle = (type) => {
    setVisibleTypes(prev => {
      const newSet = new Set(prev);
      newSet.has(type) ? newSet.delete(type) : newSet.add(type);
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (visibleTypes.size === allTypes.length) {
      setVisibleTypes(new Set());
    } else {
      setVisibleTypes(new Set(allTypes));
    }
  };

  const isAllSelected = visibleTypes.size === allTypes.length;

  return (
    <div style={{ width: '100%', padding: '0 24px' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '20px' : '24px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        Medication Taken Throughout the Day
      </h2>

      <ChartCore isMobile={isMobile} visibleTypes={visibleTypes} />

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
            {isAllSelected ? 'Deselect All' : 'Select All'}
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
