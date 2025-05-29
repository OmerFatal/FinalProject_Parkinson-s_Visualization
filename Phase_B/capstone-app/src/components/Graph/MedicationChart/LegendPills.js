import React from 'react';

export default function LegendPills({ pillTypes, pillColors, visibleTypes, onToggle }) {
  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px',
      justifyContent: 'center',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
      width: 'calc(100% / 8 - 16px)',
      minWidth: '140px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    colorBox: (color) => ({
      width: '16px',
      height: '16px',
      backgroundColor: color,
      borderRadius: '4px',
      display: 'inline-block'
    }),
    labelText: {
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      {Object.entries(pillTypes).map(([type]) => {
        const isChecked = visibleTypes.includes(type);
        const colorKey = pillTypes[type][0];
        return (
          <label key={type} style={styles.item}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(type)}
              style={styles.checkbox}
            />
            <span style={styles.colorBox(pillColors[colorKey] || '#999')} />
            <span style={styles.labelText}>{type}</span>
          </label>
        );
      })}
    </div>
  );
}
