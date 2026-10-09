# REQUIREMENTS.md: On Fire Restaurant Companion (Single Developer + Agent + Stitch MCP)

## Project
- App: **On Fire**, tagline **"Taste the heat"**
- Event: Loopverse 3.0, App Development, Track B (Restaurant Companion)
- Team: 1 developer working with an AI agent
- Rule: finish all 7 core features first, then special features in priority order

## Stack
- Expo (managed) + React Native + TypeScript
- Expo Router (bottom tabs + stack)
- Zustand (+ persist with AsyncStorage)
- react-native-reanimated, lottie-react-native, expo-image
- expo-haptics, expo-notifications
- Local mock JSON data, no backend, no database

## Stitch MCP (Design Source of Truth)
The agent has the Stitch MCP connected. Use it for all UI.

1. List the available Stitch MCP tools before starting.
2. If no On Fire project exists in Stitch, generate one from `STITCH_PROMPT.md` (all 12 screens plus design system).
3. If it exists, fetch the project, its screens, and its design system.
4. Before building each screen, fetch that screen's design from Stitch and match it: layout, spacing, radius, typography, colors, states.
5. Extract colors, typography, and radius from the Stitch design system into `/theme`. If Stitch differs from the tokens below, Stitch wins; update `/theme`.
6. If a screen is missing in Stitch, generate it with Stitch first, then build it.
7. If the Stitch MCP is unavailable, build from `STITCH_PROMPT.md` and the tokens below, and tell the developer.
8. Never hardcode colors; always read from `useTheme()`.

## Brand Theme (default tokens)
```ts
export const darkTheme = {
  background: '#0B0B0B', surface: '#161616', surfaceAlt: '#1F1F1F',
  primary: '#E10F0F', primaryDark: '#A80B0B',
  secondary: '#B5523B', accent: '#F7C948',
  textPrimary: '#FFFFFF', textMuted: '#A8A8A8',
  border: '#2A2A2A', success: '#3DDC84', danger: '#FF4D4D',
};
export const lightTheme = {
  ...darkTheme, background: '#FFF8F0', surface: '#FFFFFF', surfaceAlt: '#F3E9DD',
  textPrimary: '#1A1A1A', textMuted: '#6B6B6B', border: '#E5D8C8',
};
```
Style: dark premium, flame motif, red outline on selected items, golden yellow prices and ratings, 16 px card radius, Rs. currency format.

## Folder Structure
```
/app
  _layout.tsx
  (tabs)/_layout.tsx
  (tabs)/index.tsx            Menu
  (tabs)/cart.tsx             Cart
  (tabs)/orders.tsx           Orders list
  (tabs)/kitchen.tsx          Kitchen view
  dish/[id].tsx
  customize/[id].tsx
  confirmation/[orderId].tsx
  tracking/[orderId].tsx
  order/[orderId].tsx
  requests/[orderId].tsx
/components   common/ menu/ cart/ order/ kitchen/
/store        menuStore.ts cartStore.ts orderStore.ts settingsStore.ts
/theme        dark.ts light.ts useTheme.ts
/types        index.ts
/utils        price.ts time.ts format.ts notify.ts
/data         menu.json coupons.json
/assets       images/ lottie/
```

## Shared Types (`/types/index.ts`)
```ts
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
```

## Store Contracts

### menuStore
```ts
dishes: Dish[]; categories: Category[];
searchQuery: string; selectedCategory: Category | 'All'; selectedTags: DietTag[];
setSearch(q: string): void; setCategory(c: Category | 'All'): void; toggleTag(t: DietTag): void;
getDishById(id: string): Dish | undefined;
getFilteredDishes(): Dish[];
getStockLeft(dishId: string): number | undefined;
decrementStock(dishId: string, qty: number): void;
restoreStock(dishId: string, qty: number): void;
```

### cartStore
```ts
items: CartItem[]; appliedCoupon?: Coupon;
addItem(dish: Dish, customization: Customization, quantity?: number): void;
updateQuantity(lineId: string, quantity: number): void;
removeItem(lineId: string): void;
updateCustomization(lineId: string, dish: Dish, customization: Customization): void;
clearCart(): void;
getItemCount(): number; getSubtotal(): number;
getCharges(): { label: string; amount: number }[];
getTotal(): number;
applyCoupon(code: string): { ok: boolean; message: string };
removeCoupon(): void;
reorder(order: Order): { added: number; skipped: string[] };
```

### orderStore
```ts
orders: Order[];
placeOrder(items, subtotal, charges, total, appliedCoupon?, reorderedFrom?): string;  // guards duplicates
advanceStatus(orderId: string): void;
getOrderById(id: string): Order | undefined;
getActiveOrder(): Order | undefined;
getCompletedOrders(): Order[];
submitRating(orderId: string, stars: number, comment?: string): void;
cancelOrder(orderId: string): boolean;                 // only Placed or Accepted
simulateDelay(orderId: string, minutes: number): void;
setItemProgress(orderId: string, lineId: string, status: DishStatus): void;
addDineInRequest(orderId: string, type: DineInRequest['type']): void;
resolveDineInRequest(orderId: string, requestId: string): void;
getRevisedEstimate(orderId: string): number;           // computed from placedAt + delay
getAvailableActions(orderId: string): ('cancel' | 'advance' | 'rate' | 'request')[];
```

### settingsStore (persisted)
```ts
theme: 'light' | 'dark'; toggleTheme(): void;
```

### Utils
```ts
calcUnitPrice(dish: Dish, customization: Customization): number;
formatRs(amount: number): string;    // "Rs. 1,460"
```

## Routes
`/`, `/cart`, `/orders`, `/kitchen`, `/dish/[id]`, `/customize/[id]?lineId=`, `/confirmation/[orderId]`, `/tracking/[orderId]`, `/order/[orderId]`, `/requests/[orderId]`

## Mock Data
- 4 categories, at least 12 dishes with images
- At least 2 unavailable dishes
- At least 3 dishes with paid add-ons
- One dish at Rs. 650 with an Rs. 80 add-on
- Every dish has `tags`; at least 2 have small `stock` (e.g., 3)
- At least 2 coupons (e.g., `SAVE10` = 10 percent, `FLAT100` = Rs. 100)

## Mandatory Core Features

| # | Feature | Requirements |
|---|---|---|
| 1 | Menu | Categories, search and filter, dish cards, unavailable dishes marked and blocked, cart badge updates everywhere |
| 2 | Dish Details | Image, description, choices, prep time, shows the selected dish, path to customize |
| 3 | Customize Meal | Paid add-on, spice or variation choice, live price, choices visible in cart and order, two customizations of one dish stay separate |
| 4 | Smart Cart | Quantity change, remove, edit customization, exact totals, charges explained, empty cart cannot order |
| 5 | Order Confirmation | Simulated pay-at-counter, meals and total preserved, no duplicate orders on repeated taps, new cart never alters a confirmed order |
| 6 | Order Progress | Placed, Accepted, Preparing, Ready, Completed; completed, current, next distinct; estimate from `placedAt` and not restarted on re-entry; labelled demo control; rating after completion |
| 7 | Order Details | Return to active order, review completed orders, meals, customizations, total, status always matching tracking |

## Business Rules
- Rs. 650 + Rs. 80 topping = Rs. 730; two portions = Rs. 1,460
- Different customizations of the same dish are separate cart lines
- Unavailable or zero-stock dishes cannot be added
- Empty cart cannot place an order
- Place button locks after first tap; order ID generated once
- Orders are deep copies; later cart changes never affect them
- Tracking and Order Details read status from the same `orderStore`
- Cancelled and completed orders cannot be advanced

## Special Features (only after all 7 core features work)

| # | Feature | Priority | Key rules |
|---|---|---|---|
| S1 | Kitchen View | High | Accept, Start Preparing, Mark Ready, Complete; updates customer tracking instantly; labelled demo screen |
| S2 | Cancel before preparation | High | Visible only at Placed or Accepted; restores stock; status Cancelled |
| S3 | Reorder past meal | High | Copies items into a new cart; skips unavailable dishes and reports them; old receipt unchanged; stores `reorderedFrom` |
| S4 | Allergy and dietary filter | High | Tag chips; multiple tags combine; works with search and category |
| S5 | Local notification on Ready | High | `expo-notifications`; permission handled gracefully; tap opens tracking |
| S6 | Smart delay simulation | Medium | Adds minutes; shows revised estimate and "Delayed by X min"; estimate still from `placedAt` |
| S7 | Coupon code | Medium | One coupon per cart; never applied twice; own line in charges; total never below zero; saved in order |
| S8 | Limited stock | Medium | "Only X left"; quantity capped at stock; decrement on order, restore on cancel |
| S9 | Dine-in requests | Medium | Water, Assistance, Bill; active orders only; no duplicate unresolved request of same type; kitchen can resolve |
| S10 | Per-dish progress | Medium | Each item Pending, Preparing, Ready; overall Ready when all items Ready |
| S11 | Haptics | Easy | On status change and order confirmation |
| S12 | Local persistence | Easy | Persist cart, orders, settings |
| S13 | Dark mode | Easy | Toggle in Menu header; all colors from `useTheme()` |
| S14 | 3D dish preview | Skip | Only if everything else is done |

## Build Order for the Agent

1. **Phase 0:** Connect Stitch MCP, fetch or generate design, scaffold Expo project, folders, `/types`, `/theme`, stores, routes (stub screens), mock data
2. **Phase 1:** Shared components (button, chip, card, badge, stepper, empty state), cart badge
3. **Phase 2:** Core 1 to 2 (Menu, Dish Details)
4. **Phase 3:** Core 3 to 4 (Customize, Cart, price utils with unit tests)
5. **Phase 4:** Core 5 to 7 (Confirmation, Progress, Order Details, Orders list, rating)
6. **Phase 5:** Core QA with the test checklist below
7. **Phase 6:** Special features S1 to S13 in priority order
8. **Phase 7:** Animations (Reanimated, Lottie), polish, dark and light check
9. **Phase 8:** README, asset credits, demo script, final test

Commit after each phase with `feat(scope): message`.

## Test Checklist
1. Search, category, and tag filters work together; unavailable dish cannot be added
2. Customization with paid add-on updates price live
3. Two customizations of one dish create two cart lines
4. Edit, quantity change, and remove keep totals exact
5. Rs. 650 + Rs. 80 = Rs. 730; two = Rs. 1,460
6. Empty cart cannot place an order
7. Repeated taps on Place Order create one order
8. Demo control advances status; leaving and re-entering does not restart the estimate
9. Order Details status matches tracking at all times
10. New cart does not change a confirmed order
11. Rating saved after completion
12. Cancel only at Placed or Accepted; stock restored
13. Coupon applies once
14. Kitchen view updates customer tracking
15. Delay shows revised estimate
16. Notification fires on Ready
17. Reorder keeps old receipt unchanged
18. Dine-in duplicates blocked
19. Dark and light mode work; data persists after restart

## Submission Checklist
- GitHub repo link, accessible, with README (how to run, features, credits)
- Demo video of 3 to 5 minutes: core journey, connected behavior, special features
- Third-party assets credited and licensed

## Out of Scope
Real payments, separate staff app, backend, database, creating 3D models.

## Agent Rules
- Follow the types, store contracts, and routes exactly
- Read design from Stitch before building each screen
- Core before special features; special features never replace core work
- No hardcoded colors; no duplicated state
- Handle edge cases listed above before moving to the next phase
- After each phase, report: done, next, issues
