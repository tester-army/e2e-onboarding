import { AndroidImportance, requestPermissionsAsync, setNotificationChannelAsync } from 'expo-notifications';
import { Platform } from 'react-native';

export async function askForNotifications() {
  // Android 13+ shows no prompt before the app has a notification channel.
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', { name: 'Default', importance: AndroidImportance.DEFAULT });
  }
  const { granted } = await requestPermissionsAsync();
  return granted;
}
