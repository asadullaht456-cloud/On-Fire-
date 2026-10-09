import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useMenuStore } from '../../store/menuStore';
import { formatRs } from '../../utils/price';

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const { 
    items, updateQuantity, removeItem, clearCart,
    getSubtotal, getCharges, getTotal, 
    appliedCoupon, applyCoupon, removeCoupon 
  } = useCartStore();
  
  const placeOrder = useOrderStore(state => state.placeOrder);
  const getDishById = useMenuStore(state => state.getDishById);
  const decrementStock = useMenuStore(state => state.decrementStock);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (!res.ok) setCouponError(res.message);
    else setCouponError('');
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    
    const subtotal = getSubtotal();
    const charges = getCharges();
    const total = getTotal();
    
    // Decrement stock for ordered items
    items.forEach(item => {
      decrementStock(item.dishId, item.quantity);
    });
    
    const orderId = placeOrder(items, subtotal, charges, total, appliedCoupon?.code);
    clearCart();
    
    router.push(`/confirmation/${orderId}`);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.background, flexDirection: 'row', alignItems: 'center',
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.textPrimary, marginLeft: 16 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    emptyText: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted, marginTop: 16 },
    cartItem: {
      backgroundColor: theme.surface, borderRadius: 16, padding: 16,
      marginBottom: 16, marginHorizontal: 16, borderWidth: 1, borderColor: theme.border,
    },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    itemName: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary, flex: 1 },
    itemPrice: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.accent, marginLeft: 16 },
    itemLabels: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, marginTop: 8 },
    itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    editBtn: { flexDirection: 'row', alignItems: 'center' },
    editBtnText: { color: theme.primary, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, marginLeft: 4 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceAlt, borderRadius: 20, padding: 4 },
    stepperBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center' },
    stepperText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: theme.textPrimary, paddingHorizontal: 16 },
    section: { padding: 24, paddingBottom: 16, borderTopWidth: 1, borderTopColor: theme.border, marginTop: 8 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.secondary, marginBottom: 16 },
    couponRow: { flexDirection: 'row', gap: 8 },
    couponInput: {
      flex: 1, backgroundColor: theme.surfaceAlt, color: theme.textPrimary,
      fontFamily: 'Inter-Regular', fontSize: 16, padding: 12,
      borderRadius: 12, borderWidth: 1, borderColor: theme.border,
    },
    couponBtn: { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.primary, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12 },
    couponBtnText: { color: theme.primary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
    appliedCouponRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(61,220,132,0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.success },
    appliedCouponText: { color: theme.success, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16 },
    removeCouponBtn: { color: theme.danger, fontFamily: 'SpaceGrotesk-Bold', fontSize: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted },
    summaryValue: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.textPrimary },
    totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.textPrimary },
    totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.accent },
    bottomBar: {
      padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    },
    checkoutBtn: {
      backgroundColor: items.length === 0 ? theme.surfaceAlt : theme.primary,
      paddingVertical: 16, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
    },
    checkoutBtnText: { color: items.length === 0 ? theme.textMuted : '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="local-mall" size={64} color={theme.surfaceAlt} />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 16 }}>
            {items.map(item => (
              <View key={item.lineId} style={styles.cartItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatRs(item.unitPrice * item.quantity)}</Text>
                </View>
                
                {item.customizationLabels.length > 0 && (
                  <Text style={styles.itemLabels}>{item.customizationLabels.join(' • ')}</Text>
                )}

                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => router.push(`/dish/${item.dishId}?lineId=${item.lineId}`)}
                  >
                    <MaterialIcons name="edit" size={16} color={theme.primary} />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <View style={styles.stepper}>
                    <TouchableOpacity 
                      style={styles.stepperBtn} 
                      onPress={() => {
                        if (item.quantity > 1) updateQuantity(item.lineId, item.quantity - 1);
                        else removeItem(item.lineId);
                      }}
                    >
                      <MaterialIcons name={item.quantity === 1 ? "delete" : "remove"} size={18} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.stepperText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.stepperBtn} 
                      onPress={() => {
                        const dish = getDishById(item.dishId);
                        const max = dish?.stock !== undefined ? dish.stock : 99;
                        if (item.quantity < max) updateQuantity(item.lineId, item.quantity + 1);
                      }}
                    >
                      <MaterialIcons name="add" size={18} color={theme.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coupons & Offers</Text>
            {appliedCoupon ? (
              <View style={styles.appliedCouponRow}>
                <Text style={styles.appliedCouponText}>'{appliedCoupon.code}' applied!</Text>
                <TouchableOpacity onPress={removeCoupon}>
                  <Text style={styles.removeCouponBtn}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={styles.couponRow}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter coupon code"
                    placeholderTextColor={theme.textMuted}
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.couponBtn} onPress={handleApplyCoupon}>
                    <Text style={styles.couponBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {couponError ? <Text style={{ color: theme.danger, marginTop: 8, fontFamily: 'Inter-Regular' }}>{couponError}</Text> : null}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatRs(getSubtotal())}</Text>
            </View>
            {getCharges().map((charge, index) => (
              <View key={index} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{charge.label}</Text>
                <Text style={styles.summaryValue}>{formatRs(charge.amount)}</Text>
              </View>
            ))}
            <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{formatRs(getTotal())}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.checkoutBtn} 
          disabled={items.length === 0}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.checkoutBtnText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
