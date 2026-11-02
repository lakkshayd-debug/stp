import { env, isDev } from '../config/env.js';

export interface OtpProvider { send(phone: string, code: string): Promise<void> }

/** Development provider: prints the OTP in the server log. */
export class ConsoleOtpProvider implements OtpProvider {
  async send(phone: string, code: string) {
    console.log(`[OTP] ${phone} -> ${code}${isDev ? '  (development: 123456 is always accepted)' : ''}`);
  }
}

/** Stub for MSG91 OTP API. */
export class Msg91OtpProvider implements OtpProvider {
  async send(phone: string, code: string) {
    if (!env.MSG91_AUTH_KEY) throw new Error('MSG91_AUTH_KEY missing');
    await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: env.MSG91_AUTH_KEY },
      body: JSON.stringify({ template_id: env.MSG91_TEMPLATE_ID, mobile: phone.replace('+', ''), otp: code }),
    });
  }
}

/** Stub for Twilio SMS. */
export class TwilioOtpProvider implements OtpProvider {
  async send(phone: string, code: string) {
    if (!env.TWILIO_SID || !env.TWILIO_TOKEN) throw new Error('Twilio credentials missing');
    const auth = Buffer.from(`${env.TWILIO_SID}:${env.TWILIO_TOKEN}`).toString('base64');
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: phone, From: env.TWILIO_FROM ?? '', Body: `Your Shyam Timber OTP is ${code}. Valid for 5 minutes.` }),
    });
  }
}

export const otpProvider: OtpProvider =
  env.OTP_PROVIDER === 'msg91' ? new Msg91OtpProvider() : env.OTP_PROVIDER === 'twilio' ? new TwilioOtpProvider() : new ConsoleOtpProvider();
