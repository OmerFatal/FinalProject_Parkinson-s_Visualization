import React from 'react';

export default function HeatmapCalendarFooter() {
  return (
    <footer className="dashboard-footer">
      <p>© {new Date().getFullYear()} Parkinson Dashboard. All rights reserved.</p>
    </footer>
  );
}
