import 'dotenv/config';
import { z } from 'zod';

const bool = (def: boolean) =>
  z.preprocess((v) => (typeof v === 'string' ? ['1', 'true', 'yes', 'on'].includes(v.toLowerCase()) : v), z.boolean()).default(def);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  PUBLIC_URL: z.string().default('http://localhost:4000'),
  COOKIE_SECURE: bool(false),
  UPLOAD_DIR: z.string().default('./uploads'),
  STORAGE_DRIVER: z.enum(['local', 's3', 'db']).default('local'),   // db = images inside Postgres (free hosting)

  /** Only this phone number can ever be the OWNER. Everyone else signs up as CUSTOMER. */
  OWNER_PHONE: z.string().default('+916385340555'),

  /** SMS gateway used to deliver the OTP. `console` only prints it in the server log. */
  OTP_PROVIDER: z.enum(['console', 'msg91', 'twilio', 'fast2sms']).default('msg91'),
  /**
   * fake = no SMS at all. The owner number logs in with OWNER_OTP, every other number with CUSTOMER_OTP.
   * real = a random 6-digit code is generated and sent through OTP_PROVIDER.
   */
  OTP_MODE: z.enum(['fake', 'real']).default('fake'),
  OWNER_OTP: z.string().regex(/^\d{6}$/).default('782751'),
  CUSTOMER_OTP: z.string().regex(/^\d{6}$/).default('123455'),

  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_TEMPLATE_ID: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),
  TWILIO_SID: z.string().optional(),
  TWILIO_TOKEN: z.string().optional(),
  TWILIO_FROM: z.string().optional(),
  FAST2SMS_API_KEY: z.string().optional(),

  REFERRAL_IP_THRESHOLD: z.coerce.number().default(3),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
export const isDev = env.NODE_ENV === 'development';

if (env.NODE_ENV === 'production' && env.OTP_MODE === 'fake') {
  console.warn(
    `[security] OTP_MODE=fake - no SMS is sent. Owner ${env.OWNER_PHONE} logs in with ${env.OWNER_OTP}, ` +
      `every other number with ${env.CUSTOMER_OTP}. Set OTP_MODE=real before handling real customers.`,
  );
}
