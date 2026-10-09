import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useMenuStore } from '../../store/menuStore';
import { useCartStore } from '../../store/cartStore';
import { calcUnitPrice, formatRs } from '../../utils/price';
import { Customization } from '../../types';

export default function CustomizeScreen() {
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
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (dish && lineId) {
      const existingItem = cartItems.find(i => i.lineId === lineId);
      if (existingItem) {
        setSelectedAddOns(existingItem.customization.addOnIds);
        setSelectedOptions(existingItem.customization.options);
        setNote(existingItem.customization.note || '');
        setQuantity(existingItem.quantity);
      }
    }
  }, [dish, lineId, cartItems]);

  useEffect(() => {
    if (dish) {
      const custom: Customization = { addOnIds: selectedAddOns, options: selectedOptions, note };
      const unitPrice = calcUnitPrice(dish, custom);
      setTotalPrice(unitPrice * quantity);
    }
  }, [selectedAddOns, selectedOptions, quantity, dish, note]);

  if (!dish) return null;

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

  const handleSave = () => {
    const custom: Customization = { addOnIds: selectedAddOns, options: selectedOptions, note };
    if (lineId) {
      updateCustomization(lineId as string, dish, custom);
    } else {
      addItem(dish, custom, quantity);
    }
    router.back();
    if (!lineId) {
      router.back();
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 16, paddingBottom: 16,
      backgroundColor: theme.surface,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary },
    section: { padding: 24, borderBottomWidth: 1, borderBottomColor: theme.border },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.secondary, marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    rowText: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textPrimary },
    rowPrice: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 16, color: theme.accent },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: theme.primary },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary },
    noteInput: {
      backgroundColor: theme.surfaceAlt, color: theme.textPrimary,
      fontFamily: 'Inter-Regular', fontSize: 16, padding: 16,
      borderRadius: 12, borderWidth: 1, borderColor: theme.border,
      minHeight: 100, textAlignVertical: 'top',
    },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceAlt, borderRadius: 24, padding: 4 },
    stepperBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center' },
    stepperText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary, paddingHorizontal: 20 },
    bottomBar: {
      padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    },
    saveBtn: {
      backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
    },
    saveBtnText: { color: '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <MaterialIcons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {dish.addOns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add-Ons</Text>
            {dish.addOns.map(addon => {
              const isSelected = selectedAddOns.includes(addon.id);
              return (
                <TouchableOpacity key={addon.id} style={styles.row} onPress={() => toggleAddOn(addon.id)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <MaterialIcons name="check" size={16} color="#FFF" />}
                    </View>
                    <Text style={[styles.rowText, { marginLeft: 12 }]}>{addon.name}</Text>
                  </View>
                  <Text style={styles.rowPrice}>+ {formatRs(addon.price)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {dish.optionGroups.map(group => (
          <View key={group.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.name}</Text>
            {group.choices.map(choice => {
              const isSelected = selectedOptions[group.id] === choice.id;
              return (
                <TouchableOpacity key={choice.id} style={styles.row} onPress={() => selectOption(group.id, choice.id)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.rowText, { marginLeft: 12 }]}>{choice.name}</Text>
                  </View>
                  <Text style={styles.rowPrice}>
                    {choice.price > 0 ? `+ ${formatRs(choice.price)}` : 'Free'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Any allergies or preferences?"
            placeholderTextColor={theme.textMuted}
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        {!lineId && (
          <View style={[styles.section, { borderBottomWidth: 0, alignItems: 'center', paddingVertical: 32 }]}>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <MaterialIcons name="remove" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.stepperBtn} 
                onPress={() => {
                  const max = dish.stock !== undefined ? dish.stock : 99;
                  setQuantity(Math.min(max, quantity + 1));
                }}
              >
                <MaterialIcons name="add" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>
            {lineId ? 'Save Changes' : `Add to Cart - ${formatRs(totalPrice)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
