import crypto from 'crypto';

const users = [
  {
    id: 'u-doctor-1',
    name: 'Dr. Asha Kulkarni',
    email: 'doctor@medibridge.test',
    password: 'demo123',
    role: 'doctor'
  },
  {
    id: 'u-worker-1',
    name: 'Ravi Patil',
    email: 'worker@medibridge.test',
    password: 'demo123',
    role: 'health_worker'
  },
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'admin@medibridge.test',
    password: 'demo123',
    role: 'admin'
  }
];

const patients = [
  {
    id: 'p-1001',
    abhaNumber: '91-2847-5501-2390',
    fullName: 'Meera Jadhav',
    age: 42,
    gender: 'Female',
    phone: '+91-9000000011',
    district: 'Pune',
    bloodGroup: 'B+',
    allergies: ['Penicillin']
  },
  {
    id: 'p-1002',
    abhaNumber: '91-4810-2209-1182',
    fullName: 'Arjun Sharma',
    age: 58,
    gender: 'Male',
    phone: '+91-9000000022',
    district: 'Hyderabad',
    bloodGroup: 'O+',
    allergies: []
  }
];

const records = [
  {
    id: 'r-9001',
    patientId: 'p-1001',
    title: 'Diabetes follow-up',
    recordType: 'visit',
    diagnosis: 'Type 2 diabetes under review',
    summary: 'Fasting glucose elevated. Diet counselling and medication adherence discussed.',
    medications: ['Metformin 500mg'],
    vitals: { glucose: 168, bp: '132/86' },
    createdAt: '2026-02-12T10:30:00.000Z'
  },
  {
    id: 'r-9002',
    patientId: 'p-1002',
    title: 'Hypertension review',
    recordType: 'visit',
    diagnosis: 'Hypertension',
    summary: 'BP remains above target. Follow-up advised in two weeks.',
    medications: ['Amlodipine 5mg'],
    vitals: { bp: '148/92', spo2: 97 },
    createdAt: '2026-03-04T09:15:00.000Z'
  }
];

const reportAnalyses = [];
const auditLogs = [];

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email || '').toLowerCase());
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function searchPatients(query) {
  const normalized = String(query).trim().toLowerCase();

  if (!normalized) {
    return patients;
  }

  return patients.filter((patient) =>
    [patient.fullName, patient.abhaNumber, patient.district, patient.phone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  );
}

export function findPatientById(id) {
  return patients.find((patient) => patient.id === id);
}

export function addPatient(payload) {
  const required = ['fullName', 'age', 'gender'];
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === '');

  if (missing.length) {
    const err = new Error(`Missing patient fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const patient = {
    id: crypto.randomUUID(),
    abhaNumber: payload.abhaNumber || null,
    fullName: payload.fullName,
    age: Number(payload.age),
    gender: payload.gender,
    phone: payload.phone || null,
    district: payload.district || null,
    bloodGroup: payload.bloodGroup || null,
    allergies: Array.isArray(payload.allergies) ? payload.allergies : []
  };

  patients.unshift(patient);
  return patient;
}

export function getPatientRecords(patientId) {
  return records
    .filter((record) => record.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addRecord(patientId, payload) {
  const record = {
    id: crypto.randomUUID(),
    patientId,
    title: payload.title || 'Clinical encounter',
    recordType: payload.recordType || 'visit',
    diagnosis: payload.diagnosis || 'Pending diagnosis',
    summary: payload.summary || '',
    medications: payload.medications || [],
    vitals: payload.vitals || {},
    doctorId: payload.doctorId,
    createdAt: new Date().toISOString()
  };

  records.unshift(record);
  return record;
}

export function addReportAnalysis(payload) {
  const analysis = {
    id: crypto.randomUUID(),
    patientId: payload.patientId,
    sourceText: payload.sourceText,
    extractedVitals: payload.extractedVitals,
    detectedConditions: payload.detectedConditions,
    medicationMentions: payload.medicationMentions,
    riskLevel: payload.riskLevel,
    summary: payload.summary,
    language: payload.language,
    createdAt: new Date().toISOString()
  };

  reportAnalyses.unshift(analysis);
  return analysis;
}

export function audit(actorId, action, entityType, entityId, metadata = {}) {
  auditLogs.unshift({
    id: crypto.randomUUID(),
    actorId,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: new Date().toISOString()
  });
}

export function getDashboardMetrics() {
  const highRiskReports = reportAnalyses.filter((analysis) => analysis.riskLevel === 'high').length;

  return {
    patientCount: patients.length,
    recordCount: records.length,
    reportAnalysisCount: reportAnalyses.length,
    highRiskReports,
    districtsCovered: [...new Set(patients.map((patient) => patient.district).filter(Boolean))],
    recentAuditEvents: auditLogs.slice(0, 5)
  };
}

