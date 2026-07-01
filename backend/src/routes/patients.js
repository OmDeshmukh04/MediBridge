import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  addPatient,
  addRecord,
  audit,
  findPatientById,
  getPatientRecords,
  searchPatients
} from '../store/memoryStore.js';

export const patientsRouter = express.Router();

patientsRouter.use(requireAuth);

patientsRouter.get('/', (req, res) => {
  res.json({ patients: searchPatients(req.query.q || '') });
});

patientsRouter.post('/', requireRole('admin', 'health_worker'), (req, res) => {
  const patient = addPatient(req.body);
  audit(req.user.id, 'patient.created', 'patient', patient.id, { district: patient.district });
  res.status(201).json({ patient });
});

patientsRouter.get('/:patientId', (req, res) => {
  const patient = findPatientById(req.params.patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  audit(req.user.id, 'patient.viewed', 'patient', patient.id);
  return res.json({ patient });
});

patientsRouter.get('/:patientId/records', (req, res) => {
  const patient = findPatientById(req.params.patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  audit(req.user.id, 'records.viewed', 'patient', patient.id);
  return res.json({ patient, records: getPatientRecords(patient.id) });
});

patientsRouter.post('/:patientId/records', requireRole('doctor', 'admin'), (req, res) => {
  const patient = findPatientById(req.params.patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const record = addRecord(patient.id, {
    ...req.body,
    doctorId: req.user.id
  });

  audit(req.user.id, 'record.created', 'medical_record', record.id, { patientId: patient.id });
  return res.status(201).json({ record });
});

