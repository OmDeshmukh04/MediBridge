import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDashboardMetrics } from '../store/memoryStore.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/metrics', requireAuth, (req, res) => {
  res.json(getDashboardMetrics(req.user));
});

