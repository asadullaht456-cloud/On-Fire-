import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Header } from '../components/Header';

export default function AboutScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="About Us" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.textPrimary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, marginBottom: 8 }}>On Fire App</Text>
        <Text style={{ color: theme.textMuted, fontFamily: 'Inter-Regular' }}>Version 1.0.0</Text>
      </View>
    </View>
  );
}
