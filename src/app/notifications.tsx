import { Redirect, router } from 'expo-router';
import { useState } from 'react';

import { LightButton } from '@/components/light-button';
import { OnboardingScreen } from '@/components/onboarding-screen';
import { askForNotifications } from '@/lib/notifications';
import { saveProgress, useProgress } from '@/lib/progress';

export default function NotificationsScreen() {
  const progress = useProgress();
  if (!progress) return null;
  if (progress.step !== 'notifications') return <Redirect href="/" />;
  return <NotificationsStep email={progress.email} />;
}

function NotificationsStep({ email }: { email: string }) {
  const [asking, setAsking] = useState(false);

  async function turnOn() {
    setAsking(true);
    // Allowed or not, onboarding finishes.
    const notifications = await askForNotifications();
    await saveProgress({ step: 'welcome', email, notifications });
    router.replace('/welcome');
  }

  return (
    <OnboardingScreen step="3 of 3" title="Turn on notifications" lede="Get a ping when your tests finish.">
      <LightButton
        testID="notifications-on"
        label={asking ? 'Asking…' : 'Turn on notifications'}
        disabled={asking}
        onPress={turnOn}
      />
    </OnboardingScreen>
  );
}
