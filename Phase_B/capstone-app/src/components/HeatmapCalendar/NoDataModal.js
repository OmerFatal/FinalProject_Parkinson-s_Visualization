// src/components/HeatmapCalendar/NoDataModal.js
import React from 'react';

export default function NoDataModal({ clickedDate, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>No data available for this day</h3>
        <p>
          📅 You clicked on:{' '}
          <strong>
            {clickedDate?.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </strong>
        </p>
        <p>Please choose a day with recorded data.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
