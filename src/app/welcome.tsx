import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '@/components/onboarding-screen';
import { colors, type } from '@/constants/theme';
import { useProgress } from '@/lib/progress';

export default function WelcomeScreen() {
  const progress = useProgress();
  if (!progress) return null;
  if (progress.step !== 'welcome') return <Redirect href="/" />;

  return (
    <OnboardingScreen title={`Welcome, ${progress.email}`} titleTestID="welcome-title" lede="You're all set.">
      <View style={styles.panel}>
        <Text style={[type.bodyS, styles.soft]}>Notifications</Text>
        <Text testID="notifications-status" style={[type.bodyS, styles.bright]}>
          {progress.notifications ? 'On' : 'Off'}
        </Text>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.panel,
  },
  soft: { color: colors.textSoft },
  bright: { color: colors.textBright, fontWeight: '500' },
});
