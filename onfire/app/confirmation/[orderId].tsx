import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';
import { formatRs } from '../../utils/price';

export default function ConfirmationScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const getOrderById = useOrderStore(state => state.getOrderById);
  const order = getOrderById(orderId as string);

  if (!order) return null;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
    iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(225, 15, 15, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: theme.textPrimary, marginBottom: 8 },
    orderId: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 18, color: theme.accent, marginBottom: 32 },
    card: { backgroundColor: theme.surface, padding: 24, borderRadius: 16, width: '100%', borderWidth: 1, borderColor: theme.border, marginBottom: 32 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted },
    value: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.textPrimary },
    divider: { height: 1, backgroundColor: theme.border, marginVertical: 16 },
    totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.textPrimary },
    totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.accent },
    note: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, textAlign: 'center', marginTop: 16 },
    btn: { backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
    btnText: { color: '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="local-fire-department" size={60} color={theme.primary} />
        </View>
        
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.orderId}>{order.id}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Items</Text>
            <Text style={styles.value}>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRs(order.total)}</Text>
          </View>
          <Text style={styles.note}>Please pay at the counter.</Text>
        </View>

        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => {
            router.replace('/(tabs)/tracking');
          }}
        >
          <Text style={styles.btnText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
