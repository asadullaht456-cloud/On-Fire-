import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';
import { useCartStore } from '../../store/cartStore';
import { formatRs } from '../../utils/price';

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const getOrderById = useOrderStore(state => state.getOrderById);
  const reorder = useCartStore(state => state.reorder);
  const order = getOrderById(orderId as string);

  if (!order) return null;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary },
    section: { padding: 24, borderBottomWidth: 1, borderBottomColor: theme.border },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted },
    value: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.textPrimary },
    statusBadge: { backgroundColor: theme.surfaceAlt, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: theme.accent, textTransform: 'uppercase' },
    itemRow: { marginBottom: 16 },
    itemNameRow: { flexDirection: 'row', justifyContent: 'space-between' },
    itemName: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.textPrimary },
    itemPrice: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.textPrimary },
    itemCustom: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, marginTop: 4 },
    totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.textPrimary },
    totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.accent },
    reorderBtn: { margin: 24, backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    reorderBtnText: { color: '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.placedAt).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.headerTitle, { marginBottom: 16 }]}>Items</Text>
          {order.items.map(item => (
            <View key={item.lineId} style={styles.itemRow}>
              <View style={styles.itemNameRow}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.itemPrice}>{formatRs(item.unitPrice * item.quantity)}</Text>
              </View>
              {item.customizationLabels.length > 0 && (
                <Text style={styles.itemCustom}>{item.customizationLabels.join(' • ')}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatRs(order.subtotal)}</Text>
          </View>
          {order.charges.map((charge, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>{charge.label}</Text>
              <Text style={styles.value}>{formatRs(charge.amount)}</Text>
            </View>
          ))}
          <View style={[styles.row, { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRs(order.total)}</Text>
          </View>
        </View>

        {order.status === 'Completed' && (
          <TouchableOpacity 
            style={styles.reorderBtn} 
            onPress={() => {
              const result = reorder(order);
              if (result.skipped.length > 0) {
                alert(`${result.skipped.length} items were unavailable and skipped.`);
              }
              router.push('/(tabs)/cart');
            }}
          >
            <Text style={styles.reorderBtnText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
