import nodemailer from 'nodemailer';

// Mailpit by default. 127.0.0.1, not localhost: nodemailer resolves hosts through DNS, which skips /etc/hosts.
const transport = nodemailer.createTransport(process.env.SMTP_URL || 'smtp://127.0.0.1:1025');

export async function sendCode(to: string, code: string) {
  await transport.sendMail({
    from: 'e2e Onboarding <onboarding@example.com>',
    to,
    subject: 'Your e2e code',
    text: `Your e2e code is ${code}.`,
  });
}
