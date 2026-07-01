export const demoPatients = [
  {
    id: 'p-1001',
    name: 'Meera Jadhav',
    age: 42,
    gender: 'Female',
    bloodGroup: 'B+',
    district: 'Pune',
    abhaNumber: '91-2847-5501-2390'
  },
  {
    id: 'p-1002',
    name: 'Arjun Sharma',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    district: 'Hyderabad',
    abhaNumber: '91-4810-2209-1182'
  }
];

export const demoRecords = [
  {
    id: 'r-9001',
    patientId: 'p-1001',
    date: '12 Feb 2026',
    title: 'Diabetes follow-up',
    summary: 'Fasting glucose elevated. Diet counselling and medication adherence discussed.'
  },
  {
    id: 'r-9002',
    patientId: 'p-1001',
    date: '03 Jan 2026',
    title: 'Lab report uploaded',
    summary: 'Hb and glucose values extracted from uploaded report for doctor review.'
  },
  {
    id: 'r-9003',
    patientId: 'p-1002',
    date: '04 Mar 2026',
    title: 'Hypertension review',
    summary: 'BP remains above target. Follow-up advised in two weeks.'
  },
  {
    id: 'r-9004',
    patientId: 'p-1002',
    date: '21 Feb 2026',
    title: 'Emergency triage',
    summary: 'Symptoms reviewed and ambulance referral workflow prepared.'
  }
];

