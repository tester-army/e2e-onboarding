import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { OnboardingScreen } from '@/components/onboarding-screen';
import { TextField } from '@/components/text-field';
import { colors, space, type } from '@/constants/theme';
import { post } from '@/lib/api';
import { saveProgress, useProgress } from '@/lib/progress';

export default function CodeScreen() {
  const progress = useProgress();
  if (!progress) return null;
  if (progress.step !== 'code') return <Redirect href="/" />;
  return <CodeStep email={progress.email} firstToken={progress.token} />;
}

function CodeStep({ email, firstToken }: { email: string; firstToken: string }) {
  const [code, setCode] = useState('');
  // A resend replaces the token, so the first code stops working.
  const [token, setToken] = useState(firstToken);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    setBusy(true);
    setError(null);
    const result = await post('/api/verify-code', { email, code: code.trim(), token });
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    await saveProgress({ step: 'notifications', email });
    router.replace('/notifications');
  }

  async function resend() {
    setBusy(true);
    setError(null);
    setCode('');
    const result = await post('/api/send-code', { email });
    if (result.ok) {
      await saveProgress({ step: 'code', email, token: result.data.token });
      setToken(result.data.token);
    } else {
      setError(result.error);
    }
    setBusy(false);
  }

  return (
    <OnboardingScreen step="2 of 3" title="check your email" lede="enter the 6-digit code we sent to">
      <Text testID="code-email" style={[type.codeM, styles.email]}>
        {email}
      </Text>
      <TextField
        testID="code"
        label="code"
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        maxLength={6}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        invalid={error !== null}
      />
      {error ? (
        <Text testID="code-error" accessibilityRole="alert" style={[type.bodyS, styles.error]}>
          {error}
        </Text>
      ) : null}
      <Button testID="verify" label="verify" disabled={busy || code.trim().length !== 6} onPress={verify} />
      <Pressable
        testID="resend"
        accessibilityRole="button"
        accessibilityLabel="resend code"
        accessibilityState={{ disabled: busy }}
        disabled={busy}
        onPress={resend}
        style={({ pressed }) => [styles.resend, (pressed || busy) && styles.dimmed]}>
        <Text style={[type.caption, styles.resendLabel]}>[ resend code ]</Text>
      </Pressable>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  email: { marginTop: -space(3), color: colors.offWhite },
  error: { color: colors.mint },
  resend: { height: space(6), alignItems: 'center', justifyContent: 'center' },
  dimmed: { opacity: 0.5 },
  resendLabel: { color: colors.blue400 },
});
