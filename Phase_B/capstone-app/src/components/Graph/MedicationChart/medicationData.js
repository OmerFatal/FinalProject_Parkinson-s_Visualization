const medicationData = [
  {
    time: '07:00',
    medications: [{ pillName: 'Dopicar 250 mg', amount: 1 }]
  },
  {
    time: '10:00',
    medications: [
      { pillName: 'Sinemet CR 200 mg', amount: 1 },
      { pillName: 'Dopicar 250 mg', amount: 0.5 }
    ]
  },
  {
    time: '12:30',
    medications: [
      { pillName: 'Dopicar 250 mg', amount: 1 },
      { pillName: 'Levodopa 125 mg', amount: 0.5 }
    ]
  },
  {
    time: '14:00',
    medications: [
      { pillName: 'Dopicar 250 mg', amount: 0.75 },
      { pillName: 'Sinemet CR 200 mg', amount: 0.5 }
    ]
  },
  {
    time: '16:00',
    medications: [
      { pillName: 'Levodopa 125 mg', amount: 1 },
      { pillName: 'Dopicar 250 mg', amount: 0.5 },
      { pillName: 'Jumex', amount: 1 } // חדש במקום Stalevo
    ]
  },
  {
    time: '18:30',
    medications: [
      { pillName: 'Requip 2 mg', amount: 0.5 },   // חדש במקום Kemadrin
      { pillName: 'Dopicar 250 mg', amount: 0.5 }
    ]
  },
  {
    time: '20:30',
    medications: [
      { pillName: 'Levodopa 250 mg', amount: 0.5 },
      { pillName: 'Paritrel 0.25 mg', amount: 1 } // חדש במקום Azilect
    ]
  },
  {
    time: '22:00',
    medications: [{ pillName: 'Dopicar 250 mg', amount: 1 }]
  }
];

export default medicationData;
