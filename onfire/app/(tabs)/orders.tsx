import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';
import { formatRs } from '../../utils/price';
import { Order } from '../../types';

export default function OrdersScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const getActiveOrder = useOrderStore(state => state.getActiveOrder);
  const getCompletedOrders = useOrderStore(state => state.getCompletedOrders);
  
  const activeOrder = getActiveOrder();
  const completedOrders = getCompletedOrders();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    section: { padding: 16 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textMuted, marginBottom: 12, marginLeft: 8 },
    card: {
      backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 12,
      borderWidth: 1, borderColor: theme.border,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    orderId: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: theme.textPrimary },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: theme.surfaceAlt },
    statusText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, textTransform: 'uppercase' },
    itemText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, marginBottom: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border },
    total: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: theme.accent },
    trackText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: theme.primary },
    emptyState: { padding: 32, alignItems: 'center' },
    emptyText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted },
  });

  const renderOrderCard = (order: Order, isActive: boolean) => {
    let statusColor = theme.textPrimary;
    if (order.status === 'Completed') statusColor = theme.success;
    if (order.status === 'Cancelled') statusColor = theme.danger;
    if (isActive) statusColor = theme.accent;

    return (
      <TouchableOpacity 
        key={order.id} 
        style={styles.card}
        onPress={() => router.push(isActive ? '/(tabs)/tracking' : `/order/${order.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
          </View>
        </View>
        
        {order.items.slice(0, 2).map((item, i) => (
          <Text key={i} style={styles.itemText}>{item.quantity}x {item.name}</Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.itemText}>+ {order.items.length - 2} more items</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.total}>{formatRs(order.total)}</Text>
          <Text style={styles.trackText}>{isActive ? 'Track Order →' : 'View Receipt →'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Order</Text>
            {renderOrderCard(activeOrder, true)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orders</Text>
          {completedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No past orders.</Text>
            </View>
          ) : (
            completedOrders.map(order => renderOrderCard(order, false))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
