import React from 'react';

export default function FutureDateModal({ clickedDate, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>This date hasn't occurred yet</h3>
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
        <p>Please choose a past or current date.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
