const medicationData = [
  {
    time: '07:00', // ← נשאר עם תרופה אחת בלבד
    medications: [{ pillName: 'Dopicar 250 mg', amount: 1 }]
  },
 
  
  {
    time: '10:45',
    medications: [
      { pillName: 'Sinemet CR 200 mg', amount: 1 },
      { pillName: 'Dopicar 250 mg', amount: 0.5 }
    ]
  },
  {
    time: '12:00',
    medications: [
      { pillName: 'Dopicar 250 mg', amount: 1 },
      { pillName: 'Levodopa 125 mg', amount: 0.5 } // ← תוספת
    ]
  },
  {
    time: '13:15',
    medications: [
      { pillName: 'Madopar 250 mg', amount: 1 },
      { pillName: 'Dopicar 250 mg', amount: 0.75 },
      { pillName: 'Azilect 1 mg', amount: 0.5 }
    ]
  },
  {
    time: '14:30',
    medications: [
      { pillName: 'Requip 4 mg', amount: 1 },
      { pillName: 'Kemadrin 5 mg', amount: 0.5 } // ← תוספת
    ]
  },
  {
    time: '16:00',
    medications: [
      { pillName: 'Levodopa 125 mg', amount: 1 },
      { pillName: 'Dopicar 250 mg', amount: 0.5 },
      { pillName: 'Azilect 0.5 mg', amount: 0.5 } // ← תוספת
    ]
  },
  
  {
    time: '18:00',
    medications: [
      { pillName: 'Stalevo 100 mg', amount: 0.5 },
      { pillName: 'Azilect 1 mg', amount: 0.5 },
      { pillName: 'Dopicar 250 mg', amount: 0.5 }
    ]
  },
  {
    time: '20:00',
    medications: [
      { pillName: 'Dopicar 250 mg', amount: 1.5 },
      { pillName: 'Levodopa 250 mg', amount: 0.5 } // ← תוספת
    ]
  },
  {
    time: '22:00', // ← נשאר עם תרופה אחת בלבד
    medications: [{ pillName: 'Levodopa 125 mg', amount: 0.5 }]
  }
];

export default medicationData;
