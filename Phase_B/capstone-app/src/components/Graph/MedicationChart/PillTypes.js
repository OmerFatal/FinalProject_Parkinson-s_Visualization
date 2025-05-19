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

const dashboardThemeColors = [
  '#2563eb', // 1. כחול – My Mood
  '#22c55e', // 2. ירוק – Physical Difficulty
  '#dc2626', // 3. אדום – Parkinson State
  '#facc15', // 4. כתום-צהוב – Moderate activity
  '#16a34a', // 5. ירוק כהה – High activity
  '#a855f7', // 6. סגול
  '#0ea5e9', // 7. טורקיז
  '#f97316', // 8. כתום חזק
  '#10b981', // 9. טורקיז ירקרק
  '#8b5cf6', // 10. אינדיגו
  '#ef4444', // 11. אדום-ורוד
  '#3b82f6', // 12. כחול בהיר
  '#eab308', // 13. זהוב
  '#14b8a6', // 14. טורקיז עמוק
  '#e11d48', // 15. אדום כהה
  '#6b7280'  // 16. אפור כהה – קבוצה ניטרלית
];


// מיפוי תרופה → צבע לפי קבוצה
export const pillColors = {};
Object.entries(pillTypes).forEach(([group, pills], index) => {
  const groupColor = dashboardThemeColors[index % dashboardThemeColors.length];
  pills.forEach(pillName => {
    pillColors[pillName] = groupColor;
  });
});