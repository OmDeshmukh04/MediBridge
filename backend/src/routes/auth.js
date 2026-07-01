import express from 'express';
import { requireAuth, signUserToken } from '../middleware/auth.js';
import { findUserByEmail, publicUser } from '../store/memoryStore.js';

export const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || password !== user.password) {
    return res.status(401).json({ error: 'Invalid demo credentials' });
  }

  return res.json({
    token: signUserToken(user),
    user: publicUser(user)
  });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

