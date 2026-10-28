import { defineTool } from 'e2e/agent';
import { tool } from 'ai';
import { z } from 'zod';

// Mailpit's REST API: https://mailpit.axllent.org/docs/api-v1/
export const MAILPIT = 'http://127.0.0.1:8025';

type Email = { ID: string; To: { Address: string }[]; Subject: string; Created: string };

export async function mailpitIsUp() {
  return fetch(`${MAILPIT}/api/v1/info`)
    .then((r) => r.ok)
    .catch(() => false);
}

/** Emails to exactly this address, newest first. */
export async function emailsTo(address: string): Promise<Email[]> {
  const query = new URLSearchParams({ query: `to:"${address}"` });
  const { messages } = await (await fetch(`${MAILPIT}/api/v1/search?${query}`)).json();
  return (messages as Email[])
    .filter((m) => m.To.some((to) => to.Address.toLowerCase() === address.toLowerCase()))
    .sort((a, b) => b.Created.localeCompare(a.Created));
}

export async function emailText(id: string): Promise<string> {
  return (await (await fetch(`${MAILPIT}/api/v1/message/${id}`)).json()).Text;
}

export async function codeIn(id: string) {
  const code = /\b(\d{6})\b/.exec(await emailText(id))?.[1];
  if (!code) throw new Error(`No 6-digit code in email ${id}`);
  return code;
}

export async function deleteEmailsTo(address: string) {
  const IDs = (await emailsTo(address)).map((m) => m.ID);
  if (!IDs.length) return;
  await fetch(`${MAILPIT}/api/v1/messages`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ IDs }),
  });
}

// Declared mutating though it only reads: the replay cache can't tell a code came from a tool, so a read-only tool
// would let a replay type last run's code. A mutating call is never replayed, so the agent reads the inbox every run.
export const readInbox = defineTool(
  tool({
    description: 'Read the test inbox (Mailpit): the newest emails sent to an address, newest first.',
    inputSchema: z.object({ to: z.string().describe('The email address the app sent the email to') }),
    execute: async ({ to }) => {
      const emails = (await emailsTo(to)).slice(0, 5);
      if (!emails.length) return `No email to ${to} yet.`;
      return Promise.all(
        emails.map(async (m) => ({ received: m.Created, subject: m.Subject, text: await emailText(m.ID) })),
      );
    },
  }),
  { mutates: true },
);
