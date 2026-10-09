import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useOrderStore } from '../../store/orderStore';
import { OrderStatus } from '../../types';

const STATUS_FLOW: OrderStatus[] = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed'];

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const getOrderById = useOrderStore(state => state.getOrderById);
  const getRevisedEstimate = useOrderStore(state => state.getRevisedEstimate);
  const advanceStatus = useOrderStore(state => state.advanceStatus);
  const cancelOrder = useOrderStore(state => state.cancelOrder);
  const submitRating = useOrderStore(state => state.submitRating);
  
  const order = getOrderById(orderId as string);
  const [rating, setRating] = useState(0);

  if (!order) return null;

  const estimate = getRevisedEstimate(order.id);
  const currentIndex = STATUS_FLOW.indexOf(order.status);

  const handleRating = (stars: number) => {
    setRating(stars);
    submitRating(order.id, stars);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary },
    estimateCard: { backgroundColor: theme.surfaceAlt, padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.border },
    estimateTitle: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted },
    estimateTime: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: theme.accent, marginVertical: 8 },
    delayText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.danger },
    stepper: { padding: 24 },
    step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
    stepDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 16, zIndex: 2, backgroundColor: theme.background },
    stepLine: { position: 'absolute', left: 9, top: 20, width: 2, height: '150%', backgroundColor: theme.border, zIndex: 1 },
    stepLabel: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16 },
    ratingCard: { backgroundColor: theme.surface, padding: 24, margin: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    ratingTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary, marginBottom: 16 },
    stars: { flexDirection: 'row', gap: 8 },
    actions: { padding: 24, gap: 16 },
    btn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    btnPrimary: { backgroundColor: theme.primary },
    btnPrimaryText: { color: '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
    btnOutline: { borderWidth: 1, borderColor: theme.border },
    btnOutlineText: { color: theme.textPrimary, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16 },
    btnDanger: { backgroundColor: 'rgba(255, 77, 77, 0.1)', borderWidth: 1, borderColor: theme.danger },
    btnDangerText: { color: theme.danger, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/orders')} style={{ padding: 8 }}>
          <MaterialIcons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order {order.id}</Text>
        <TouchableOpacity onPress={() => router.push(`/order/${order.id}`)} style={{ padding: 8 }}>
          <MaterialIcons name="receipt" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
          <View style={styles.estimateCard}>
            <Text style={styles.estimateTitle}>Estimated Wait Time</Text>
            <Text style={styles.estimateTime}>{estimate} mins</Text>
            {order.delayMinutes > 0 && (
              <Text style={styles.delayText}>Delayed by {order.delayMinutes} min</Text>
            )}
          </View>
        )}

        <View style={styles.stepper}>
          {STATUS_FLOW.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            let dotColor = theme.border;
            let textColor = theme.textMuted;
            
            if (isCompleted) {
              dotColor = theme.primary;
              textColor = theme.textPrimary;
            } else if (isCurrent) {
              dotColor = theme.accent;
              textColor = theme.accent;
            }

            return (
              <View key={status} style={styles.step}>
                <View style={[styles.stepDot, { borderColor: dotColor, backgroundColor: isCompleted || isCurrent ? dotColor : theme.background }]} />
                {index < STATUS_FLOW.length - 1 && <View style={[styles.stepLine, { backgroundColor: isCompleted ? theme.primary : theme.border }]} />}
                <Text style={[styles.stepLabel, { color: textColor }]}>{status}</Text>
              </View>
            );
          })}
        </View>

        {order.status === 'Completed' && (
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>Rate your meal</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                  <MaterialIcons 
                    name={star <= (order.rating?.stars || rating) ? "star" : "star-border"} 
                    size={32} 
                    color={theme.accent} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {(order.status === 'Placed' || order.status === 'Accepted') && (
            <TouchableOpacity 
              style={[styles.btn, styles.btnDanger]}
              onPress={() => {
                cancelOrder(order.id);
                router.replace('/(tabs)/orders');
              }}
            >
              <Text style={styles.btnDangerText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
            <TouchableOpacity 
              style={[styles.btn, styles.btnOutline, { borderColor: theme.accent }]}
              onPress={() => router.push(`/requests/${order.id}`)}
            >
              <Text style={[styles.btnOutlineText, { color: theme.accent }]}>Dine-in Requests</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.btn, styles.btnOutline]}
            onPress={() => advanceStatus(order.id)}
          >
            <Text style={styles.btnOutlineText}>Demo: Advance Kitchen Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
