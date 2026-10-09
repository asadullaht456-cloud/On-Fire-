import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextInput, ToastAndroid } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useMenuStore } from '../../store/menuStore';
import { useCartStore } from '../../store/cartStore';
import { calcUnitPrice, formatRs } from '../../utils/price';
import { Customization } from '../../types';

export default function DishDetailsScreen() {
  const { id, lineId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  
  const getDishById = useMenuStore(state => state.getDishById);
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateCustomization = useCartStore(state => state.updateCustomization);
  
  const dish = getDishById(id as string);
  
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const singleLineId = Array.isArray(lineId) ? lineId[0] : lineId;
    if (dish && singleLineId) {
      const existingItem = cartItems.find(i => i.lineId === singleLineId);
      if (existingItem) {
        setSelectedAddOns(existingItem.customization.addOnIds);
        setSelectedOptions(existingItem.customization.options);
        setNote(existingItem.customization.note || '');
        setQuantity(existingItem.quantity);
      }
    }
  }, [dish, lineId, cartItems]);

  const custom: Customization = { addOnIds: selectedAddOns, options: selectedOptions, note };
  const unitPrice = dish ? calcUnitPrice(dish, custom) : 0;
  const totalPrice = unitPrice * quantity;

  if (!dish) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.textPrimary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 }}>Dish not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: theme.primary, fontFamily: 'SpaceGrotesk-SemiBold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleAddOn = (addonId: string) => {
    if (selectedAddOns.includes(addonId)) {
      setSelectedAddOns(prev => prev.filter(a => a !== addonId));
    } else {
      setSelectedAddOns(prev => [...prev, addonId]);
    }
  };

  const selectOption = (groupId: string, choiceId: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: choiceId }));
  };

  // Check if all required option groups are selected
  const isRequiredOptionsSelected = dish.optionGroups.every(group => selectedOptions[group.id]);
  const canAddToCart = dish.available && isRequiredOptionsSelected;

  const handleSave = () => {
    if (!canAddToCart) return;
    
    const singleLineId = Array.isArray(lineId) ? lineId[0] : lineId;
    if (singleLineId) {
      updateCustomization(singleLineId, dish, custom);
      if (Platform.OS === 'android') ToastAndroid.show('Cart updated', ToastAndroid.SHORT);
    } else {
      addItem(dish, custom, quantity);
      if (Platform.OS === 'android') ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
    }
    router.replace('/');
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    imageContainer: { width: '100%', height: 350, backgroundColor: theme.surfaceAlt, position: 'relative' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    gradient: {
      ...StyleSheet.absoluteFill as any,
      backgroundColor: 'rgba(11,11,11,0.6)',
      top: '50%',
    },
    backBtn: {
      position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 16,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    },
    favBtn: {
      position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 16,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    },
    chefTag: {
      position: 'absolute', top: Platform.OS === 'ios' ? 64 : 44, left: 64,
      backgroundColor: theme.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
      zIndex: 10,
    },
    chefTagText: { color: '#000', fontFamily: 'SpaceGrotesk-Bold', fontSize: 12 },
    tagsTopLeft: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', gap: 8 },
    badge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    badgeText: { color: '#FFF', fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12 },
    content: { padding: 24, paddingBottom: 100 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: theme.textPrimary, flex: 1 },
    price: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.accent, marginLeft: 16 },
    desc: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted, lineHeight: 24, marginBottom: 24 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    dietTag: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: theme.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: theme.border,
    },
    dietTagText: { color: theme.textMuted, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, textTransform: 'uppercase' },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.secondary, marginBottom: 16, marginTop: 16 },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    optionCard: {
      flex: 1, minWidth: '30%', backgroundColor: theme.surfaceAlt,
      paddingVertical: 12, borderRadius: 12, alignItems: 'center',
      borderWidth: 2, borderColor: 'transparent',
    },
    optionCardActive: { borderColor: theme.primary, backgroundColor: 'rgba(225, 15, 15, 0.1)' },
    optionCardText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: theme.textPrimary },
    addonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
    addonRowText: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textPrimary },
    addonRowPrice: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.accent },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    noteInput: {
      backgroundColor: theme.surfaceAlt, color: theme.textPrimary,
      fontFamily: 'Inter-Regular', fontSize: 16, padding: 16,
      borderRadius: 12, borderWidth: 1, borderColor: theme.border,
      minHeight: 100, textAlignVertical: 'top', marginTop: 8,
    },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 16 },
    stepperBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
    stepperText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.textPrimary, paddingHorizontal: 32 },
    bottomBar: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    totalLabel: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted },
    totalPriceText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.textPrimary },
    saveBtn: {
      backgroundColor: canAddToCart ? theme.primary : theme.surfaceAlt,
      paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 16,
    },
    saveBtnText: { color: canAddToCart ? '#FFF' : theme.textMuted, fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image }} style={styles.image} />
          <View style={styles.gradient} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.chefTag}>
            <Text style={styles.chefTagText}>Chef's Signature</Text>
          </View>
          
          <TouchableOpacity style={styles.favBtn}>
            <MaterialIcons name="favorite-border" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.tagsTopLeft}>
            <View style={styles.badge}>
              <MaterialIcons name="timer" size={14} color={theme.accent} />
              <Text style={styles.badgeText}>{dish.prepTimeMin}m</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="local-fire-department" size={14} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.accent }]}>650 kcal</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{dish.name}</Text>
            <Text style={styles.price}>{formatRs(dish.price)}</Text>
          </View>
          
          <Text style={styles.desc}>{dish.description}</Text>
          
          <View style={styles.tagsRow}>
            {dish.tags.map(tag => (
              <View key={tag} style={styles.dietTag}>
                <Text style={styles.dietTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Options (e.g. Heat Level) */}
          {dish.optionGroups.map(group => (
            <View key={group.id}>
              <Text style={styles.sectionTitle}>{group.name} (Required)</Text>
              <View style={styles.optionsContainer}>
                {group.choices.map(choice => {
                  const isSelected = selectedOptions[group.id] === choice.id;
                  return (
                    <TouchableOpacity 
                      key={choice.id} 
                      style={[styles.optionCard, isSelected && styles.optionCardActive]}
                      onPress={() => selectOption(group.id, choice.id)}
                    >
                      <Text style={styles.optionCardText}>{choice.name}</Text>
                      {choice.price > 0 && <Text style={{ color: theme.accent, fontSize: 12, marginTop: 4 }}>+{formatRs(choice.price)}</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Add Ons */}
          {dish.addOns.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Customize Add-ons (Optional)</Text>
              {dish.addOns.map(addon => {
                const isSelected = selectedAddOns.includes(addon.id);
                return (
                  <TouchableOpacity key={addon.id} style={styles.addonRow} onPress={() => toggleAddOn(addon.id)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                        {isSelected && <MaterialIcons name="check" size={16} color="#FFF" />}
                      </View>
                      <Text style={[styles.addonRowText, { marginLeft: 12 }]}>{addon.name}</Text>
                    </View>
                    <Text style={styles.addonRowPrice}>+ {formatRs(addon.price)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Special Notes */}
          <Text style={styles.sectionTitle}>Special Cooking Notes</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Any allergies or preferences?"
            placeholderTextColor={theme.textMuted}
            multiline
            value={note}
            onChangeText={setNote}
          />

          {/* Quantity */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <MaterialIcons name="remove" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepperText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.stepperBtn} 
              onPress={() => {
                const max = dish.stock !== undefined ? dish.stock : 99;
                setQuantity(Math.min(max, quantity + 1));
              }}
            >
              <MaterialIcons name="add" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPriceText}>{formatRs(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={!canAddToCart}>
          <Text style={styles.saveBtnText}>
            {!dish.available ? 'Sold Out' : lineId ? 'Update Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
