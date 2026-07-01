import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { analyzeMedicalReport } from '../services/reportAnalyzer.js';
import { addReportAnalysis, audit, findPatientById } from '../store/memoryStore.js';

export const reportsRouter = express.Router();

reportsRouter.post('/analyze', requireAuth, (req, res) => {
  const { patientId, reportText, language = 'en' } = req.body;

  if (!reportText || reportText.trim().length < 20) {
    return res.status(400).json({ error: 'reportText must contain at least 20 characters' });
  }

  const patient = patientId ? findPatientById(patientId) : null;
  const analysis = analyzeMedicalReport(reportText, language);
  const saved = addReportAnalysis({
    patientId: patient?.id || null,
    sourceText: reportText,
    language,
    ...analysis
  });

  audit(req.user.id, 'report.analyzed', 'report_analysis', saved.id, {
    patientId: patient?.id || null,
    riskLevel: saved.riskLevel
  });

  res.status(201).json({ patient, analysis: saved });
});

