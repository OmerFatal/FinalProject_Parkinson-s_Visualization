import React from 'react';

export default function HeatmapCalendarFooter() {
  return (
    <footer className="dashboard-footer">
      {/* Display the current year dynamically in the footer */}
      <p>© {new Date().getFullYear()} Parkinson Dashboard. All rights reserved.</p>
    </footer>
  );
}
