import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/useTheme';
import { StatusBar } from 'expo-status-bar';

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
    <>
      <StatusBar style={theme.background === '#0B0B0B' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dish/[id]" />
        <Stack.Screen name="customize/[id]" />
        <Stack.Screen name="confirmation/[orderId]" />
        <Stack.Screen name="tracking/[orderId]" />
        <Stack.Screen name="order/[orderId]" />
        <Stack.Screen name="requests/[orderId]" />
      </Stack>
    </>
  );
}
