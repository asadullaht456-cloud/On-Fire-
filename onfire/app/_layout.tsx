import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/useTheme';
import { StatusBar } from 'expo-status-bar';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Toast from 'react-native-root-toast';

const originalConsoleError = console.error;
console.error = (...args) => {
  // Try to prevent messy redbox by suppressing or showing a clean toast
  Toast.show('Service Not Available', {
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: '#FF3B30',
    textColor: '#FFFFFF',
  });
  // Log locally but avoid breaking Expo Go
  originalConsoleError(...args);
};

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <RootSiblingParent>
      <ErrorBoundary>
        <StatusBar style={theme.background === '#0B0B0B' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dish/[id]" />
        <Stack.Screen name="confirmation/[orderId]" />
        <Stack.Screen name="order/[orderId]" />
        <Stack.Screen name="requests/[orderId]" />
        </Stack>
      </ErrorBoundary>
    </RootSiblingParent>
  );
}
