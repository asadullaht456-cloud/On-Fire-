import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Dish, Customization, Coupon, Order } from '../types';
import { calcUnitPrice } from '../utils/price';
import couponsData from '../data/coupons.json';
import { useMenuStore } from './menuStore';

interface CartState {
  items: CartItem[];
  appliedCoupon?: Coupon;
  addItem: (dish: Dish, customization: Customization, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  updateCustomization: (lineId: string, dish: Dish, customization: Customization) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getCharges: () => { label: string; amount: number }[];
  getTotal: () => number;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  reorder: (order: Order) => { added: number; skipped: string[] };
}

const generateLineId = (dishId: string, customization: Customization) => {
  const customStr = JSON.stringify({ a: customization.addOnIds.sort(), o: customization.options });
  return `${dishId}-${customStr}`;
};

const getCustomizationLabels = (dish: Dish, customization: Customization) => {
  const labels: string[] = [];
  customization.addOnIds.forEach(id => {
    const addon = dish.addOns.find(a => a.id === id);
    if (addon) labels.push(addon.name);
  });
  Object.keys(customization.options).forEach(groupId => {
    const group = dish.optionGroups.find(g => g.id === groupId);
    if (group) {
      const choiceId = customization.options[groupId];
      const choice = group.choices.find(c => c.id === choiceId);
      if (choice) labels.push(choice.name);
    }
  });
  if (customization.note) labels.push(`Note: ${customization.note}`);
  return labels;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: undefined,

      addItem: (dish, customization, quantity = 1) => {
        const lineId = generateLineId(dish.id, customization);
        const unitPrice = calcUnitPrice(dish, customization);
        const labels = getCustomizationLabels(dish, customization);
        
        set((state) => {
          const existing = state.items.find(i => i.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map(i => i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i)
            };
          }
          return {
            items: [...state.items, {
              lineId, dishId: dish.id, name: dish.name, basePrice: dish.price,
              customization, customizationLabels: labels, unitPrice, quantity
            }]
          };
        });
      },

      updateQuantity: (lineId, quantity) => set((state) => ({
        items: state.items.map(i => i.lineId === lineId ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),

      removeItem: (lineId) => set((state) => ({
        items: state.items.filter(i => i.lineId !== lineId)
      })),

      updateCustomization: (lineId, dish, customization) => {
        const newLineId = generateLineId(dish.id, customization);
        const unitPrice = calcUnitPrice(dish, customization);
        const labels = getCustomizationLabels(dish, customization);
        
        set((state) => {
          const item = state.items.find(i => i.lineId === lineId);
          if (!item) return state;
          
          const filtered = state.items.filter(i => i.lineId !== lineId);
          const existingTarget = filtered.find(i => i.lineId === newLineId);
          
          if (existingTarget) {
            return {
              items: filtered.map(i => i.lineId === newLineId ? { ...i, quantity: i.quantity + item.quantity } : i)
            };
          }
          
          return {
            items: [...filtered, {
              ...item, lineId: newLineId, customization, customizationLabels: labels, unitPrice
            }]
          };
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: undefined }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),

      getCharges: () => {
        const subtotal = get().getSubtotal();
        const charges = [];
        
        // Service Charge (example 5%)
        const serviceCharge = Math.round(subtotal * 0.05);
        if (serviceCharge > 0) {
          charges.push({ label: 'Service Charge (5%)', amount: serviceCharge });
        }
        
        // Coupon discount
        const coupon = get().appliedCoupon;
        if (coupon) {
          const discount = coupon.type === 'percent' 
            ? Math.round(subtotal * (coupon.value / 100))
            : coupon.value;
          charges.push({ label: `Discount (${coupon.code})`, amount: -discount });
        }
        
        return charges;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const charges = get().getCharges().reduce((sum, c) => sum + c.amount, 0);
        return Math.max(0, subtotal + charges);
      },

      applyCoupon: (code) => {
        if (get().appliedCoupon) {
          return { ok: false, message: 'A coupon is already applied.' };
        }
        const coupons = couponsData as Coupon[];
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
          set({ appliedCoupon: coupon });
          return { ok: true, message: 'Coupon applied!' };
        }
        return { ok: false, message: 'Invalid coupon code.' };
      },

      removeCoupon: () => set({ appliedCoupon: undefined }),

      reorder: (order) => {
        const menuDishes = useMenuStore.getState().dishes;
        let added = 0;
        const skipped: string[] = [];
        
        const newItems: CartItem[] = [];
        order.items.forEach(item => {
          const dish = menuDishes.find(d => d.id === item.dishId);
          if (dish && dish.available && (dish.stock === undefined || dish.stock >= item.quantity)) {
            newItems.push(item);
            added++;
          } else {
            skipped.push(item.name);
          }
        });
        
        set({ items: newItems, appliedCoupon: undefined });
        return { added, skipped };
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
