import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  requestAmbulanceDispatch,
  verifyHealthIdentity
} from '../services/integrationAdapters.js';
import { audit } from '../store/memoryStore.js';

export const integrationsRouter = express.Router();

integrationsRouter.use(requireAuth);

integrationsRouter.get('/abdm/verify/:identityNumber', (req, res) => {
  const result = verifyHealthIdentity(req.params.identityNumber);

  audit(req.user.id, 'identity.verified.demo', 'integration', result.referenceId, {
    verified: result.verified
  });

  res.json(result);
});

integrationsRouter.post(
  '/ambulance/request',
  requireRole('doctor', 'health_worker', 'admin'),
  (req, res) => {
    const result = requestAmbulanceDispatch(req.body);

    audit(req.user.id, 'ambulance.requested.demo', 'integration', result.dispatchId, {
      priority: result.priority
    });

    res.status(202).json(result);
  }
);

