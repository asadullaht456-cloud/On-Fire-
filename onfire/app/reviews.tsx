import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Header } from '../components/Header';

export default function ReviewsScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Reviews" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.textMuted, fontFamily: 'Inter-Regular' }}>Coming soon...</Text>
      </View>
    </View>
  );
}
