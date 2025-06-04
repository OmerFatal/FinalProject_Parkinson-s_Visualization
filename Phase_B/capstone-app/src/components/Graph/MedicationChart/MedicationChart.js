// MedicationChart.js

import React, { useState, useMemo, useEffect } from 'react';
import ChartCore from './ChartCore';
import LegendPills from './LegendPills';
import { pillTypes, pillColors } from './PillTypes';
import { sortByTime } from './ChartDataUtils';

export default function MedicationChart({ entries, date }) {
  const isMobile = window.innerWidth <= 768;
  const formattedDate = new Date(date).toLocaleDateString('en-GB');

  // 1. סינון לפי תאריך וסוג
  const filtered = useMemo(() => {
    return entries.filter(
      (e) => e.Date === date && e.Report === 'Medicine' && e.Type && e.Notes
    );
  }, [entries, date]);

  // 2. בניית medicationData לפי שעות
  const medicationData = useMemo(() => {
    const grouped = {};

    filtered.forEach((entry) => {
      const pillName = entry.Type?.trim();
      const time = entry.Time?.trim().slice(0, 5);
      const amountMatch = entry.Notes?.trim().match(/([0-9.]+)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;

      if (!grouped[time]) {
        grouped[time] = { time, medications: [] };
      }

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

  // 3. זיהוי קבוצות שהופיעו בפועל
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
    if (matched.length > 0) {
      usedPillTypes[type] = matched;
    }
  });

  const allTypes = Object.keys(usedPillTypes);
  const [visibleTypes, setVisibleTypes] = useState([]);

  // ✅ עובד כמו בגרסה הישנה – מתרחש רק כשהמספר של הסוגים משתנה
  useEffect(() => {
    setVisibleTypes(allTypes);
  }, [allTypes.length]);

  // 4. שליטה על checkbox
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
