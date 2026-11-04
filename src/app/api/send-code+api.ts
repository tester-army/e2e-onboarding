import { newCode, signCode } from '@/server/code';
import { sendCode } from '@/server/mailer';

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: unknown };
  if (typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'enter an email address.' }, { status: 400 });
  }

  const code = newCode();
  try {
    await sendCode(email, code);
  } catch (e) {
    return Response.json({ error: `couldn't send the email: ${e instanceof Error ? e.message : e}` }, { status: 502 });
  }
  return Response.json({ token: signCode(email, code) });
}
