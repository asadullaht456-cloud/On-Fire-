import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';
import { DishStatus } from '../../types';

export default function KitchenScreen() {
  const theme = useTheme();
  const orders = useOrderStore(state => state.orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled'));
  const advanceStatus = useOrderStore(state => state.advanceStatus);
  const setItemProgress = useOrderStore(state => state.setItemProgress);
  const simulateDelay = useOrderStore(state => state.simulateDelay);
  const resolveDineInRequest = useOrderStore(state => state.resolveDineInRequest);

  const handleDishToggle = (orderId: string, lineId: string, currentStatus: DishStatus) => {
    const next: Record<DishStatus, DishStatus> = {
      'Pending': 'Preparing',
      'Preparing': 'Ready',
      'Ready': 'Pending'
    };
    setItemProgress(orderId, lineId, next[currentStatus]);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.textPrimary },
    orderCard: {
      backgroundColor: theme.surface, borderRadius: 16, padding: 16,
      marginBottom: 16, marginHorizontal: 16, borderWidth: 1, borderColor: theme.border,
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    orderId: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.accent },
    statusBadge: { backgroundColor: theme.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, color: theme.textPrimary, textTransform: 'uppercase' },
    dishRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border },
    dishName: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textPrimary, flex: 1 },
    dishQty: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: theme.textMuted, width: 30 },
    dishStatusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    dishStatusText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, textTransform: 'uppercase' },
    actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    actionBtn: { flex: 1, backgroundColor: theme.surfaceAlt, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    actionBtnPrimary: { backgroundColor: theme.primary },
    actionBtnText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: theme.textPrimary },
    actionBtnTextPrimary: { color: '#FFF' },
    requestCard: { backgroundColor: 'rgba(247, 201, 72, 0.1)', borderColor: theme.accent, borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    requestText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.accent },
  });

  const getDishStatusColor = (status: DishStatus) => {
    if (status === 'Ready') return theme.success;
    if (status === 'Preparing') return theme.accent;
    return theme.textMuted;
  };

  const getNextOrderAction = (status: string) => {
    if (status === 'Placed') return 'Accept';
    if (status === 'Accepted') return 'Start Preparing';
    if (status === 'Preparing') return 'Mark Ready';
    if (status === 'Ready') return 'Complete';
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitchen Demo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontFamily: 'Inter-Regular' }}>No active orders.</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              {order.items.map(item => {
                const status = order.itemProgress[item.lineId] || 'Pending';
                const color = getDishStatusColor(status);
                return (
                  <View key={item.lineId} style={styles.dishRow}>
                    <Text style={styles.dishQty}>{item.quantity}x</Text>
                    <Text style={styles.dishName}>{item.name}</Text>
                    <TouchableOpacity 
                      style={[styles.dishStatusBtn, { borderColor: color, backgroundColor: status === 'Ready' ? 'rgba(61,220,132,0.1)' : 'transparent' }]}
                      onPress={() => handleDishToggle(order.id, item.lineId, status)}
                    >
                      <Text style={[styles.dishStatusText, { color }]}>{status}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {order.dineInRequests.filter(r => !r.resolved).map(req => (
                <View key={req.id} style={styles.requestCard}>
                  <Text style={styles.requestText}>Request: {req.type}</Text>
                  <TouchableOpacity onPress={() => resolveDineInRequest(order.id, req.id)}>
                    <MaterialIcons name="check-circle" size={20} color={theme.accent} />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => simulateDelay(order.id, 5)}
                >
                  <Text style={styles.actionBtnText}>+5m Delay</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnPrimary]} 
                  onPress={() => advanceStatus(order.id)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
                    {getNextOrderAction(order.status)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
