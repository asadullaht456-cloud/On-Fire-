import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';

export default function RequestsScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const getOrderById = useOrderStore(state => state.getOrderById);
  const addDineInRequest = useOrderStore(state => state.addDineInRequest);
  
  const order = getOrderById(orderId as string);
  if (!order) return null;

  const handleRequest = (type: 'Water' | 'Assistance' | 'Bill') => {
    addDineInRequest(order.id, type);
    router.back();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary },
    content: { padding: 24, gap: 16 },
    btn: {
      backgroundColor: theme.surfaceAlt, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: theme.border,
      flexDirection: 'row', alignItems: 'center'
    },
    btnText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.textPrimary, marginLeft: 16 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <MaterialIcons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dine-in Requests</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.btn} onPress={() => handleRequest('Water')}>
          <MaterialIcons name="local-drink" size={32} color={theme.accent} />
          <Text style={styles.btnText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleRequest('Assistance')}>
          <MaterialIcons name="room-service" size={32} color={theme.accent} />
          <Text style={styles.btnText}>Assistance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleRequest('Bill')}>
          <MaterialIcons name="receipt" size={32} color={theme.accent} />
          <Text style={styles.btnText}>Bill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
