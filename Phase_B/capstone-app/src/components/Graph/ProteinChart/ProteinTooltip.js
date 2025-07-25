import React from 'react';

export default function ProteinTooltip({ active, payload }) {
  // Show tooltip only if valid payload exists
  if (active && payload && payload.length) {
    const entry = payload[0].payload;

    // Extract protein value from notes (e.g., "Proteins: 20g")
    const match = entry.notes.match(/Proteins:\s*(\d+g)/i);
    const proteinValue = match ? match[1] : null;

    // Remove protein text from notes for cleaner display
    const notesWithoutProtein = entry.notes
      .replace(/Proteins:\s*\d+g\s*/i, '')
      .trim();

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #94a3b8',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 16,
        maxWidth: 280,
        whiteSpace: 'pre-line',
        fontWeight: 800
      }}>
        <div><strong>{entry.food}</strong></div>

        <hr style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />

        <div style={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>
          Proteins:{' '}
          <span style={{
            backgroundColor: '#d1fae5',
            color: '#111827',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '6px'
          }}>
            {proteinValue}
          </span>
          {notesWithoutProtein && `\n${notesWithoutProtein}`}
        </div>
      </div>
    );
  }

  return null;
}
