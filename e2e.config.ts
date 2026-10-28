import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';
import { gateway } from 'ai';

import { readInbox } from './tests/mailpit';

// e2e loads no .env file itself.
try {
  process.loadEnvFile(new URL('.env.local', import.meta.url));
} catch {}

// Metro serves the Debug builds' JavaScript and the API routes. The runner starts it, or reuses a running one.
const metro = {
  command: { executable: 'npx', args: ['expo', 'start', '--port', '8081'], reuseExisting: true, log: '.e2e/logs/metro.log' },
  readyUrl: 'http://localhost:8081/status',
};
const bundleId = 'dev.e2e.onboarding';

export default {
  agents: {
    default: {
      // The Vercel AI Gateway reads AI_GATEWAY_API_KEY.
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
      context:
        "The app emails a 6-digit code to the address its code screen shows. The email goes to Mailpit, a local test inbox that isn't on the screen: read it with the read_inbox tool. Verify submits the code.",
      tools: { read_inbox: readInbox },
    },
  },
  targets: [
    {
      name: 'ios',
      engine: mobile({ platform: 'ios' }),
      // appPath is the build npm run ios copies, for the reinstall; the launch arguments keep the prompt in English.
      app: { bundleId, appPath: 'build/ios/e2eOnboarding.app', launchArguments: ['-AppleLocale', 'en_US', '-AppleLanguages', '(en)'], ...metro },
    },
    { name: 'android', engine: mobile({ platform: 'android' }), app: { bundleId, ...metro } },
  ],
  workers: 1,
} satisfies E2EConfig;
