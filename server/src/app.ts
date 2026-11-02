import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { optionalAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { postsRouter } from './routes/posts.js';
import { meRouter, referralsRouter, rewardsRouter, notificationsRouter } from './routes/me.js';
import { adminRouter } from './routes/admin.js';
import { shareRouter } from './routes/share.js';
import { getShopSettings, getRewardSettings } from './services/settings.service.js';
import { asyncH } from './lib/validate.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
  app.use(cors({ origin: [env.CLIENT_URL, 'http://localhost:4173'], credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR), { maxAge: '30d', immutable: true }));
  app.use(shareRouter); // /p/:id

  const api = express.Router();
  api.use(apiLimiter, optionalAuth);
  api.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  api.get('/public/settings', asyncH(async (_req, res) => {
    const [shop, rewards] = await Promise.all([getShopSettings(), getRewardSettings()]);
    res.json({ shop, rewards });
  }));
  api.use('/auth', authRouter);
  api.use('/posts', postsRouter);
  api.use('/me', meRouter);
  api.use('/referrals', referralsRouter);
  api.use('/rewards', rewardsRouter);
  api.use('/notifications', notificationsRouter);
  api.use('/admin', adminRouter);
  app.use('/api/v1', api);

  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }));
  app.use(errorHandler);
  return app;
}
