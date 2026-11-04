import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding-screen';
import { colors, space, type } from '@/constants/theme';
import { useProgress } from '@/lib/progress';

export default function WelcomeScreen() {
  const progress = useProgress();
  if (!progress) return null;
  if (progress.step !== 'welcome') return <Redirect href="/" />;

  return (
    <OnboardingScreen title={`welcome, ${progress.email}`} titleTestID="welcome-title" lede="you're all set.">
      <View style={styles.panel}>
        <Text style={[type.caption, styles.muted]}>notifications</Text>
        <Text testID="notifications-status" style={[type.caption, progress.notifications ? styles.on : styles.off]}>
          {progress.notifications ? 'on' : 'off'}
        </Text>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: space(3),
    borderWidth: 1,
    borderColor: colors.neutral800,
    backgroundColor: colors.panel,
  },
  muted: { color: colors.neutral500 },
  on: { color: colors.green },
  off: { color: colors.offWhite },
});
