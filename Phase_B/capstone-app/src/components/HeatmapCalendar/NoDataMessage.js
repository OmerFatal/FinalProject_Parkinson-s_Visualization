import React from 'react';

export default function NoDataMessage({ selectedYear, selectedMonth }) {
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '1.2rem'
      }}
    >
      {/* Inform the user there's no data for this month */}
      No Data Available For{' '}
      {new Date(selectedYear, selectedMonth).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
      })}
      . Please Select Different Month.
    </div>
  );
}
