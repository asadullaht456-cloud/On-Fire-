import Toast from 'react-native-root-toast';
import { Platform } from 'react-native';

let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  console.warn('expo-notifications could not be loaded, using toast fallback only.');
}

export const notify = async (title: string, body: string) => {
  // Show an in-app toast banner
  Toast.show(`${title}\n${body}`, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: '#3DDC84',
    textColor: '#000',
    opacity: 1,
  });

  // Also try to schedule a local notification if library is available
  if (Notifications) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // trigger immediately
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }
};
