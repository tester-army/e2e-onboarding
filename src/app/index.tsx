import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { LightButton } from '@/components/light-button';
import { OnboardingScreen } from '@/components/onboarding-screen';
import { TextField } from '@/components/text-field';
import { colors, type } from '@/constants/theme';
import { post } from '@/lib/api';
import { saveProgress, useProgress } from '@/lib/progress';

export default function EmailScreen() {
  const progress = useProgress();
  if (!progress) return null;
  // A restart opens here: go back to the saved step.
  if (progress.step !== 'email') return <Redirect href={`/${progress.step}`} />;
  return <EmailStep />;
}

function EmailStep() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setSending(true);
    setError(null);
    const address = email.trim();
    const result = await post('/api/send-code', { email: address });
    if (!result.ok) {
      setError(result.error);
      setSending(false);
      return;
    }
    await saveProgress({ step: 'code', email: address, token: result.data.token });
    router.replace('/code');
  }

  return (
    <OnboardingScreen step="1 of 3" title="What's your email?" lede="We'll email you a 6-digit code.">
      <TextField
        testID="email"
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="ada@example.com"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      {error ? (
        <Text testID="email-error" accessibilityRole="alert" style={[type.bodyS, styles.error]}>
          {error}
        </Text>
      ) : null}
      <LightButton
        testID="send-code"
        label={sending ? 'Sending…' : 'Send code'}
        disabled={sending || email.trim() === ''}
        onPress={sendCode}
      />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.accentOrange },
});
