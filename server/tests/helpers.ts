import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

export const app = createApp();
export const agent = () => request.agent(app);
export const OTP = '123456'; // fixed OTP when NODE_ENV=development

export async function loginAs(phone: string, profile?: { name: string; area: string; customerType: string; referralCode?: string }) {
  const a = agent();
  await a.post('/api/v1/auth/otp/request').send({ phone }).expect(200);
  const res = await a.post('/api/v1/auth/otp/verify').send({ phone, code: OTP, profile });
  return { a, res };
}

export async function resetDb() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(), prisma.notification.deleteMany(), prisma.reward.deleteMany(),
    prisma.purchaseConfirmation.deleteMany(), prisma.referral.deleteMany(), prisma.comment.deleteMany(),
    prisma.like.deleteMany(), prisma.savedPost.deleteMany(), prisma.postImage.deleteMany(), prisma.post.deleteMany(),
    prisma.refreshToken.deleteMany(), prisma.otp.deleteMany(), prisma.user.deleteMany(),
  ]);
}

export const ensureOwner = () =>
  prisma.user.upsert({
    where: { phone: '+919342194431' }, update: {},
    create: { phone: '+919342194431', name: 'Shyam', role: 'OWNER', referralCode: 'SHYAM-OWNER1' },
  });
