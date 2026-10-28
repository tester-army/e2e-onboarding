import { describe } from '@e2e-dev/mobile';
import type { Screen } from 'e2e';
import { expect } from 'e2e';

import { newestCode, skipAgent, skipMailpit, test, waitForEmails } from './fixtures';
import { codeIn, emailsTo } from './mailpit';

const WRONG_CODE = "That code isn't right.";

async function sendCode(screen: Screen, email: string) {
  await screen.getByTestId('email').fill(email);
  await screen.getByTestId('send-code').tap();
  await expect(screen.getByTestId('code-email')).toHaveText(email, { timeout: 30_000 });
}

async function enterCode(screen: Screen, code: string) {
  await screen.getByTestId('code').fill(code);
  await screen.getByTestId('verify').tap();
}

// The OS's notification prompt isn't the app's own screen, so these retry.
describe('onboarding', { tags: ['onboarding'], skip: skipMailpit, retries: 2, timeout: 180_000 }, () => {
  test('finishes onboarding with the code from the email', { skip: skipAgent }, async ({ agent, screen, email, turnOnNotifications }) => {
    await sendCode(screen, email);
    await waitForEmails(email, 1);

    // The agent finds the code with the read_inbox tool.
    await agent.act('verify the email address with the code from the email');
    await expect(screen.getByTestId('notifications-on')).toBeVisible();

    await turnOnNotifications('allow');
    await expect(screen.getByTestId('welcome-title')).toHaveText(`Welcome, ${email}`);
    await expect(screen.getByTestId('notifications-status')).toHaveText('On');
    expect(await emailsTo(email)).toHaveLength(1);
  });

  test('a wrong code shows an error', async ({ screen, email }) => {
    await sendCode(screen, email);
    await waitForEmails(email, 1);
    const code = await newestCode(email);

    await enterCode(screen, String((Number(code) + 1) % 1_000_000).padStart(6, '0'));
    await expect(screen.getByTestId('code-error')).toHaveText(WRONG_CODE);
    await expect(screen.getByTestId('code-email')).toHaveText(email);
    expect(await emailsTo(email)).toHaveLength(1);
  });

  test('resending replaces the first code', { skip: skipAgent }, async ({ agent, screen, email }) => {
    await sendCode(screen, email);
    const [first] = await waitForEmails(email, 1);
    const firstCode = await codeIn(first!.ID);

    await screen.getByTestId('resend').tap();
    const [newest] = await waitForEmails(email, 2);
    expect(await codeIn(newest!.ID)).not.toBe(firstCode);

    await enterCode(screen, firstCode);
    await expect(screen.getByTestId('code-error')).toHaveText(WRONG_CODE);

    await agent.act('verify the email address with the code from the newest email');
    await expect(screen.getByTestId('notifications-on')).toBeVisible();
  });

  test('denying notifications still finishes', async ({ screen, email, turnOnNotifications }) => {
    await sendCode(screen, email);
    await waitForEmails(email, 1);
    await enterCode(screen, await newestCode(email));
    await expect(screen.getByTestId('notifications-on')).toBeVisible();

    await turnOnNotifications('deny');
    await expect(screen.getByTestId('welcome-title')).toHaveText(`Welcome, ${email}`);
    await expect(screen.getByTestId('notifications-status')).toHaveText('Off');
  });

  test('closing the app on the code step picks up there', async ({ app, screen, email }) => {
    await sendCode(screen, email);
    await waitForEmails(email, 1);

    // A cold launch; the saved progress survives.
    await app.restart();
    await expect(screen.getByTestId('code-email')).toHaveText(email, { timeout: 30_000 });

    await enterCode(screen, await newestCode(email));
    await expect(screen.getByTestId('notifications-on')).toBeVisible();
    expect(await emailsTo(email)).toHaveLength(1);
  });
});
