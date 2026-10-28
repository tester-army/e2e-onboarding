import { checkCode } from '@/server/code';

export async function POST(request: Request) {
  const { email, code, token } = (await request.json()) as Record<string, unknown>;
  const valid =
    typeof email === 'string' && typeof code === 'string' && typeof token === 'string' && checkCode(email, code, token);
  if (!valid) return Response.json({ error: "That code isn't right." }, { status: 400 });
  return Response.json({ email });
}
