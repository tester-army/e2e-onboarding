import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

// A test fixture: codes never expire and attempts aren't counted.
const secret = process.env.CODE_SECRET || 'e2e-onboarding-dev-secret';

export function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

// The device keeps this token, so checking a code needs no database.
export function signCode(email: string, code: string) {
  return createHmac('sha256', secret).update(`${email}\n${code}`).digest('base64url');
}

export function checkCode(email: string, code: string, token: string) {
  const expected = Buffer.from(signCode(email, code));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
