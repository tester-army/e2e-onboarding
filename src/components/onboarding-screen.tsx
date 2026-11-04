import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SiteHeader } from '@/components/site-header';
import { colors, space, type } from '@/constants/theme';

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
          {step ? <Text style={[type.caption, styles.eyebrow]}>{step}</Text> : null}
          <Text testID={titleTestID} accessibilityRole="header" style={[type.h1, styles.heading]}>
            {title}
          </Text>
          <Text style={[type.bodyL, styles.lede]}>{lede}</Text>
          <View style={styles.body}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Top-aligned, so nothing moves when the keyboard opens.
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.black },
  content: { paddingHorizontal: space(3), paddingBottom: space(4) },
  main: { paddingTop: space(7) },
  eyebrow: { color: colors.mint },
  heading: { marginTop: space(2), color: colors.offWhite },
  lede: { marginTop: space(2), color: colors.neutral400 },
  body: { marginTop: space(5), gap: space(2) },
});
