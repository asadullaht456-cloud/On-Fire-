import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/useTheme';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const theme = useTheme();

  const handleSignup = () => {
    if (name && email && password) {
      login(email);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: 24 },
    brandTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 36, color: theme.secondary, textAlign: 'center', marginBottom: 8 },
    tagline: { fontFamily: 'Caveat-SemiBold', fontSize: 26, color: theme.accent, textAlign: 'center', marginBottom: 40 },
    input: {
      backgroundColor: theme.surfaceAlt,
      color: theme.textPrimary,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#FFF' },
    linkText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, textAlign: 'center', marginTop: 24 },
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.brandTitle}>On Fire</Text>
      <Text style={styles.tagline}>Taste the heat</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={theme.textMuted}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
