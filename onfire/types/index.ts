export type Category = 'Starters' | 'Mains' | 'Desserts' | 'Drinks';
export type DietTag = 'Veg' | 'Spicy' | 'Nut-Free' | 'Gluten-Free' | 'Dairy-Free';

export interface AddOn { id: string; name: string; price: number; }
export interface OptionGroup { id: string; name: string; choices: { id: string; name: string; price: number }[]; }

export interface Dish {
  id: string; name: string; category: Category; description: string;
  price: number; image: string; prepTimeMin: number; available: boolean;
  addOns: AddOn[]; optionGroups: OptionGroup[];
  tags: DietTag[]; stock?: number;
}

export interface Customization {
  addOnIds: string[];
  options: Record<string, string>;   // groupId -> choiceId
  note?: string;
}

export interface CartItem {
  lineId: string;                    // dishId + signature of customization
  dishId: string; name: string; basePrice: number;
  customization: Customization; customizationLabels: string[];
  unitPrice: number; quantity: number;
}

export type OrderStatus = 'Placed' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type DishStatus = 'Pending' | 'Preparing' | 'Ready';

export interface Coupon { code: string; type: 'percent' | 'flat'; value: number; description: string; }
export interface DineInRequest { id: string; type: 'Water' | 'Assistance' | 'Bill'; createdAt: number; resolved: boolean; }

export interface Order {
  id: string;
  items: CartItem[];                 // deep copy
  subtotal: number;
  charges: { label: string; amount: number }[];
  total: number;
  status: OrderStatus;
  placedAt: number;
  estimatedMinutes: number;
  delayMinutes: number;
  itemProgress: Record<string, DishStatus>;
  appliedCoupon?: string;
  cancelledAt?: number;
  reorderedFrom?: string;
  dineInRequests: DineInRequest[];
  rating?: { stars: number; comment?: string };
}
