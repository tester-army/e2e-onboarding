import { test as base } from '@e2e-dev/mobile';
import { expect } from 'e2e';

import { codeIn, deleteEmailsTo, emailsTo, MAILPIT, mailpitIsUp } from './mailpit';

export const skipMailpit = (await mailpitIsUp()) ? false : `start Mailpit to run the email tests (nothing at ${MAILPIT})`;
export const skipAgent = skipMailpit || (process.env.AI_GATEWAY_API_KEY ? false : 'set AI_GATEWAY_API_KEY to run the agent tests');

export const test = base.extend<{ email: string; turnOnNotifications: (answer: 'allow' | 'deny') => Promise<void> }>({
  // A new address on a fresh install, opened on the email step. Its emails are deleted afterwards.
  email: async ({ app, device, platform, screen }, use) => {
    const email = `ada+${platform}-${Math.random().toString(36).slice(2, 8)}@example.com`;
    try {
      if (platform === 'ios') {
        // iOS keeps the notification answer when the data is cleared, so reinstall. A prompt that a failed test left
        // up survives the reinstall, so dismiss it first; usually there's none.
        await device.alert('dismiss').catch(() => {});
        await device.installApp(undefined, { reinstall: true });
        await app.open();
      } else {
        await app.clearState();
      }
      // The first launch waits for Metro to bundle the app.
      await expect(screen.getByTestId('email')).toBeVisible({ timeout: 60_000 });
      await use(email);
    } finally {
      await deleteEmailsTo(email);
    }
  },

  // Answers the OS's prompt by its buttons. (device.alert can press while Android's dialog is still sliding in.)
  turnOnNotifications: async ({ screen }, use) => {
    await use(async (answer) => {
      await screen.getByTestId('notifications-on').tap();
      await expect(screen.getByText(/e2e Onboarding.*notifications/i)).toBeVisible();
      await screen.getByRole('button', { name: answer === 'allow' ? /^allow$/i : /^don.t allow$/i }).tap();
    });
  },
});

export async function waitForEmails(email: string, count: number) {
  await expect.poll(async () => (await emailsTo(email)).length, { timeout: 15_000 }).toBe(count);
  return emailsTo(email);
}

export async function newestCode(email: string) {
  const [newest] = await emailsTo(email);
  return codeIn(newest!.ID);
}
