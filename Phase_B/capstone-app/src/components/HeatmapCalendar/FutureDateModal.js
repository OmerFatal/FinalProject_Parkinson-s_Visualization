import React from 'react';

export default function FutureDateModal({ clickedDate, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>This date hasn't occurred yet</h3>
        {/* Display the selected future date in readable format */}
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
        {/* Instruction to the user */}
        <p>Please choose a past or current date.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
