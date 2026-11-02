import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

export interface OtpProvider {
  readonly name: string;
  /** Must throw when the SMS could not be handed over to the gateway. */
  send(phone: string, code: string): Promise<void>;
}

const smsFailed = (detail: string) =>
  new AppError(502, 'SMS_FAILED', 'Could not send the OTP right now. Please try again in a moment.', { detail });

const text = (code: string) =>
  `${code} is your OTP for Shyam Timber and Plywoods. Valid for 5 minutes. Do not share it with anyone.`;

/** Development only: prints the OTP in the server log instead of sending an SMS. */
export class ConsoleOtpProvider implements OtpProvider {
  readonly name = 'console';
  async send(phone: string, code: string) {
    console.log(`\n==================  OTP  ==================\n  ${phone} -> ${code}\n===========================================\n`);
  }
}

/**
 * MSG91 (recommended in India). Needs an approved DLT template.
 * Dashboard -> Flow/OTP -> template id, and the auth key from Settings -> API.
 */
export class Msg91OtpProvider implements OtpProvider {
  readonly name = 'msg91';
  async send(phone: string, code: string) {
    if (!env.MSG91_AUTH_KEY || !env.MSG91_TEMPLATE_ID) throw smsFailed('MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is missing');
    const mobile = phone.replace('+', ''); // 91XXXXXXXXXX
    let res: Response;
    try {
      res = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authkey: env.MSG91_AUTH_KEY },
        body: JSON.stringify({
          template_id: env.MSG91_TEMPLATE_ID,
          mobile,
          otp: code,
          otp_expiry: 5,
          ...(env.MSG91_SENDER_ID ? { sender: env.MSG91_SENDER_ID } : {}),
        }),
      });
    } catch (e) {
      throw smsFailed(`network error: ${(e as Error).message}`);
    }
    const body = (await res.json().catch(() => ({}))) as { type?: string; message?: unknown };
    if (!res.ok || body.type !== 'success') throw smsFailed(`msg91: ${JSON.stringify(body)}`);
  }
}

/** Twilio (works worldwide, costs more in India). */
export class TwilioOtpProvider implements OtpProvider {
  readonly name = 'twilio';
  async send(phone: string, code: string) {
    if (!env.TWILIO_SID || !env.TWILIO_TOKEN || !env.TWILIO_FROM) throw smsFailed('Twilio credentials are missing');
    const auth = Buffer.from(`${env.TWILIO_SID}:${env.TWILIO_TOKEN}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: phone, From: env.TWILIO_FROM, Body: text(code) }),
    }).catch((e: Error) => { throw smsFailed(`network error: ${e.message}`); });
    if (!res.ok) throw smsFailed(`twilio: ${await res.text()}`);
  }
}

/** Fast2SMS - cheap Indian gateway, OTP route. */
export class Fast2SmsOtpProvider implements OtpProvider {
  readonly name = 'fast2sms';
  async send(phone: string, code: string) {
    if (!env.FAST2SMS_API_KEY) throw smsFailed('FAST2SMS_API_KEY is missing');
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: { authorization: env.FAST2SMS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ route: 'otp', variables_values: code, numbers: phone.replace('+91', '') }),
    }).catch((e: Error) => { throw smsFailed(`network error: ${e.message}`); });
    const body = (await res.json().catch(() => ({}))) as { return?: boolean; message?: unknown };
    if (!res.ok || body.return !== true) throw smsFailed(`fast2sms: ${JSON.stringify(body)}`);
  }
}

function pick(): OtpProvider {
  switch (env.OTP_PROVIDER) {
    case 'msg91': return new Msg91OtpProvider();
    case 'twilio': return new TwilioOtpProvider();
    case 'fast2sms': return new Fast2SmsOtpProvider();
    default: return new ConsoleOtpProvider();
  }
}
export const otpProvider: OtpProvider = pick();
console.log(
  env.OTP_MODE === 'fake'
    ? `[otp] TEST MODE - no SMS sent. Owner ${env.OWNER_PHONE} -> ${env.OWNER_OTP}, everyone else -> ${env.CUSTOMER_OTP}`
    : `[otp] real SMS through provider=${otpProvider.name}`,
);
