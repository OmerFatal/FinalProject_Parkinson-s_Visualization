import React from 'react';

export default function NoDataModal({ clickedDate, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal title */}
        <h3>No data available for this day</h3>
        {/* Show clicked date */}
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
        {/* Suggest user try another date */}
        <p>Please choose a day with recorded data.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
