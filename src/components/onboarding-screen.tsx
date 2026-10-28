import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SiteHeader } from '@/components/site-header';
import { colors, type } from '@/constants/theme';

type OnboardingScreenProps = {
  step?: string;
  title: string;
  titleTestID?: string;
  lede: string;
  children: ReactNode;
};

export function OnboardingScreen({ step, title, titleTestID, lede, children }: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        <SiteHeader />
        <View style={styles.main}>
          {step ? <Text style={[type.labelXs, styles.faint]}>{step}</Text> : null}
          <Text testID={titleTestID} accessibilityRole="header" style={[type.h1, styles.heading]}>
            {title}
          </Text>
          <Text style={[type.body, styles.lede]}>{lede}</Text>
          <View style={styles.body}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Top-aligned, so nothing moves when the keyboard opens.
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  main: { paddingTop: 56 },
  faint: { color: colors.textFaint },
  heading: { marginTop: 12, color: colors.textPrimary },
  lede: { marginTop: 16, color: colors.textSecondary },
  body: { marginTop: 40, gap: 16 },
});
