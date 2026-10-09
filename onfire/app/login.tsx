import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/useTheme';
import { authService } from '../utils/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setCurrentUser = useAuthStore(state => state.setCurrentUser);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const users = await authService.loadUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        setError('Unknown email or incorrect password.');
        setLoading(false);
        return;
      }
      
      const hashedAttempt = await authService.hashPassword(password);
      if (user.passwordHash !== hashedAttempt) {
        setError('Unknown email or incorrect password.');
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      // The _layout will automatically redirect because isAuthenticated changed
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
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
      
      {error ? <Text style={{ color: theme.danger, fontFamily: 'Inter-Regular', marginBottom: 16, textAlign: 'center' }}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
