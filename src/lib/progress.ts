import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type Progress =
  | { step: 'email' }
  | { step: 'code'; email: string; token: string }
  | { step: 'notifications'; email: string }
  | { step: 'welcome'; email: string; notifications: boolean };

const KEY = 'onboarding';

export async function saveProgress(progress: Progress) {
  await AsyncStorage.setItem(KEY, JSON.stringify(progress));
}

// null while it loads.
export function useProgress() {
  const [progress, setProgress] = useState<Progress | null>(null);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => setProgress(saved ? JSON.parse(saved) : { step: 'email' }));
  }, []);
  return progress;
}
