export const pillTypes = {
  Levopar: ['Levodopa 125 mg', 'Levodopa 250 mg'],
  Madopar: ['Madopar 125 mg', 'Madopar 250 mg'],
  Sinemet: ['Sinemet CR 200 mg', 'Sinemet 100 mg'],
  Dopicar: ['Dopicar 250 mg'],
  Stalevo: [
    'Stalevo 50 mg', 'Stalevo 75 mg', 'Stalevo 100 mg',
    'Stalevo 125 mg', 'Stalevo 150 mg', 'Stalevo 175 mg', 'Stalevo 200 mg'
  ],
  Requip: ['Requip 2 mg', 'Requip 4 mg', 'Requip 8 mg'],
  Sifrol: ['Sifrol 1 mg'],
  'PK-Merz': ['PK-Merz 100 mg'],
  Paritrel: ['Paritrel 0.25 mg', 'Paritrel 0.5 mg'],
  'Artane, Partane': ['Artane, Partane 2 mg', 'Artane, Partane 5 mg'],
  Cogentin: ['Cogentin 2 mg'],
  Dekinet: ['Dekinet 2 mg'],
  Kemadrin: ['Kemadrin 5 mg'],
  Jumex: ['Jumex'],
  Azilect: ['Azilect 1 mg', 'Azilect 0.5 mg'],
  Xadago: ['Xadago 50 mg', 'Xadago 100 mg']
};

// פלטת Tableau 20 – צבעים מקצועיים
const tableauColors = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
  '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
  '#bcbd22', '#17becf', '#393b79', '#637939',
  '#8c6d31', '#843c39', '#7b4173', '#3182bd'
];

// מיפוי תרופה → צבע לפי קבוצה
export const pillColors = {};
Object.entries(pillTypes).forEach(([group, pills], index) => {
  const groupColor = tableauColors[index % tableauColors.length];
  pills.forEach(pillName => {
    pillColors[pillName] = groupColor;
  });
});
