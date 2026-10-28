import { expect, test } from 'e2e';

// Locators only: no model, no Mailpit.
test('a fresh install opens on the email step', async ({ app, screen }) => {
  await app.clearState();

  // The first launch waits for Metro to bundle the app.
  await expect(screen.getByText("What's your email?")).toBeVisible({ timeout: 60_000 });
  await expect(screen.getByTestId('email')).toBeVisible();
  await expect(screen.getByTestId('send-code')).toBeVisible();
});
