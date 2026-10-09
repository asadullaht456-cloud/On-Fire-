import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus, DishStatus, DineInRequest } from '../types';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

interface OrderState {
  orders: Order[];
  placeOrder: (items: any[], subtotal: number, charges: any[], total: number, appliedCoupon?: string, reorderedFrom?: string) => string;
  advanceStatus: (orderId: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getActiveOrder: () => Order | undefined;
  getCompletedOrders: () => Order[];
  submitRating: (orderId: string, stars: number, comment?: string) => void;
  cancelOrder: (orderId: string) => boolean;
  simulateDelay: (orderId: string, minutes: number) => void;
  setItemProgress: (orderId: string, lineId: string, status: DishStatus) => void;
  addDineInRequest: (orderId: string, type: DineInRequest['type']) => void;
  resolveDineInRequest: (orderId: string, requestId: string) => void;
  getRevisedEstimate: (orderId: string) => number;
  getAvailableActions: (orderId: string) => ('cancel' | 'advance' | 'rate' | 'request')[];
}

const STATUS_FLOW: OrderStatus[] = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed'];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [] as Order[],

      placeOrder: (items, subtotal, charges, total, appliedCoupon, reorderedFrom) => {
        const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const placedAt = Date.now();
        // Calculate max prep time from items
        const maxPrepTime = items.reduce((max, item) => Math.max(max, 15), 0); // fallback 15m if not populated
        const estimatedMinutes = maxPrepTime;

        const itemProgress: Record<string, DishStatus> = {};
        items.forEach(item => {
          itemProgress[item.lineId] = 'Pending';
        });

        const newOrder: Order = {
          id, items: JSON.parse(JSON.stringify(items)), subtotal, charges, total,
          status: 'Placed', placedAt, estimatedMinutes, delayMinutes: 0,
          itemProgress, appliedCoupon, reorderedFrom, dineInRequests: []
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        return id;
      },

      advanceStatus: (orderId) => {
        set((state) => {
          const order = state.orders.find(o => o.id === orderId);
          if (!order || order.status === 'Completed' || order.status === 'Cancelled') return state;
          const nextIndex = STATUS_FLOW.indexOf(order.status) + 1;
          if (nextIndex >= STATUS_FLOW.length) return state;
          
          const newStatus = STATUS_FLOW[nextIndex];
          
          if (newStatus === 'Ready') {
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Order Ready!',
                body: `Your order ${order.id} is ready for pickup.`,
              },
              trigger: null,
            }).catch(() => {});
          }
          
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          
          return {
            orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
          };
        });
      },

      getOrderById: (id) => get().orders.find(o => o.id === id),

      getActiveOrder: () => get().orders.find(o => o.status !== 'Completed' && o.status !== 'Cancelled'),

      getCompletedOrders: () => get().orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled'),

      submitRating: (orderId, stars, comment) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, rating: { stars, comment } } : o)
      })),

      cancelOrder: (orderId) => {
        let success = false;
        set((state) => {
          const order = state.orders.find(o => o.id === orderId);
          if (order && (order.status === 'Placed' || order.status === 'Accepted')) {
            success = true;
            return {
              orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelledAt: Date.now() } : o)
            };
          }
          return state;
        });
        return success;
      },

      simulateDelay: (orderId, minutes) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, delayMinutes: o.delayMinutes + minutes } : o)
      })),

      setItemProgress: (orderId, lineId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? {
          ...o, 
          itemProgress: { ...o.itemProgress, [lineId]: status }
        } : o)
      })),

      addDineInRequest: (orderId, type) => set((state) => {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return state;
        const exists = order.dineInRequests.some(r => r.type === type && !r.resolved);
        if (exists) return state;
        
        const newRequest: DineInRequest = {
          id: Math.random().toString(36).substr(2, 9),
          type, createdAt: Date.now(), resolved: false
        };
        return {
          orders: state.orders.map(o => o.id === orderId ? { ...o, dineInRequests: [...o.dineInRequests, newRequest] } : o)
        };
      }),

      resolveDineInRequest: (orderId, requestId) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? {
          ...o,
          dineInRequests: o.dineInRequests.map(r => r.id === requestId ? { ...r, resolved: true } : r)
        } : o)
      })),

      getRevisedEstimate: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order) return 0;
        return order.estimatedMinutes + order.delayMinutes;
      },

      getAvailableActions: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order) return [];
        const actions: ('cancel' | 'advance' | 'rate' | 'request')[] = [];
        
        if (order.status === 'Placed' || order.status === 'Accepted') actions.push('cancel');
        if (order.status !== 'Completed' && order.status !== 'Cancelled') {
          actions.push('advance');
          actions.push('request');
        }
        if (order.status === 'Completed' && !order.rating) actions.push('rate');
        
        return actions;
      }
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
