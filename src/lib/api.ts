type ApiResult = { ok: true; data: Record<string, string> } | { ok: false; error: string };

// In development, a relative URL reaches the dev server from iOS and Android.
export async function post(path: string, body: object): Promise<ApiResult> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return response.ok ? { ok: true, data } : { ok: false, error: data.error ?? `HTTP ${response.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
