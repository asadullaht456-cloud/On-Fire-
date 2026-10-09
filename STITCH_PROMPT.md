# STITCH_PROMPT.md: "On Fire" Restaurant Companion UI

Paste the prompt below into Stitch. Generate all screens in one project so every dev uses the same design.

---

## Prompt

Design a mobile app (390 x 844, iOS and Android style) called **On Fire**, tagline **"Taste the heat"**, for a single restaurant. The brand is bold, fiery, and modern, based on a black circular logo with a red flame outline, a terracotta "on Fire" wordmark, and a golden-yellow handwritten tagline.

### Color Palette (strict, use only these)
| Token | Hex | Use |
|---|---|---|
| background | #0B0B0B | App background (black, from logo) |
| surface | #161616 | Cards, sheets |
| surfaceAlt | #1F1F1F | Inputs, chips, nested cards |
| primary | #E10F0F | Flame red: buttons, active tab, ring/borders, price highlights |
| primaryDark | #A80B0B | Pressed buttons, gradients |
| secondary | #B5523B | Terracotta: headings, wordmark, category accents |
| accent | #F7C948 | Golden yellow: tagline, ratings, badges, highlights |
| textPrimary | #FFFFFF | Main text |
| textMuted | #A8A8A8 | Secondary text |
| border | #2A2A2A | Dividers and outlines |
| success | #3DDC84 | Ready / completed status only |
| danger | #FF4D4D | Errors, cancel, unavailable |

Light mode variant (for the dark mode toggle): background #FFF8F0, surface #FFFFFF, same primary, secondary, and accent.

### Style
- Dark, premium, high contrast, with red glow on active elements
- Flame icon motif for logo, loading, and empty states
- Rounded corners (16 px cards, 12 px buttons, full pill for chips)
- Thin red outline on selected items (echoing the logo ring)
- Large food photos with dark gradient overlay for text
- Buttons: solid red, white bold text; secondary: red outline
- Prices in golden yellow; currency format "Rs. 1,460"
- Typography: bold rounded display font for headings (e.g., Poppins or Baloo), clean sans-serif (Inter) for body; handwritten style (e.g., Caveat) only for the tagline
- 8 px spacing grid, bottom tab bar with 4 tabs: Menu, Cart, Orders, Kitchen

### Screens to Generate

1. **Splash:** black screen with flame logo, "on Fire" in terracotta, "Taste the heat" in yellow
2. **Menu (Home):** header with logo and dark-mode toggle, search bar, category tabs (Starters, Mains, Desserts, Drinks), dietary tag chips (Veg, Spicy, Nut-Free, Gluten-Free, Dairy-Free), dish cards with image, name, price, prep time, tags. Show one unavailable dish (greyed, "Unavailable" badge) and one limited-stock dish ("Only 3 left"). Cart badge on tab icon
3. **Dish Details:** large image, name, description, tags, prep time, price, option groups, "Customize and Add" button
4. **Customize Meal:** add-ons with prices (e.g., extra cheese + Rs. 80), spice level selector, note field, quantity stepper, live total on sticky bottom button (e.g., "Add to cart, Rs. 730")
5. **Cart:** item cards with customization labels, quantity stepper, remove, "Edit" link, coupon code field with Apply button, price breakdown (subtotal, discount, service charge, total), "Place Order" button; also an empty cart state
6. **Order Confirmation:** flame animation placeholder, "Order placed", order ID, items, total, "Pay at counter" note, "Track Order" button
7. **Order Progress:** vertical stepper (Placed, Accepted, Preparing, Ready, Completed) with completed in red, current in glowing yellow, next in grey; wait estimate with revised-delay label; per-dish status chips; Cancel button (only early stages); dine-in request buttons (Water, Assistance, Bill); demo control button labelled "Demo: Advance Kitchen Status"; rating prompt (5 stars in yellow) after completion
8. **Order Details:** items with customizations, total, status badge, coupon used, Reorder button
9. **Orders List:** Active order card on top, completed and cancelled orders below with status badges
10. **Kitchen View (demo):** list of order cards with buttons Accept, Start Preparing, Mark Ready, Complete; per-dish toggles; delay simulation button; dine-in requests with Resolve button
11. **Dine-in Requests:** three large buttons with request history and status
12. **Light mode:** Menu and Cart in light variant

### Components to Include (reusable)
Primary button, outline button, category chip, tag chip, dish card, cart item card, quantity stepper, status badge, stepper step, price row, search bar, bottom tab bar, rating stars, empty state, toast.

### Rules
- Use only the palette above
- Keep consistent spacing, radius, and typography across all screens
- Show realistic sample content (dishes such as Fire Wings, Inferno Burger, Spicy Ramen, Molten Lava Cake, with prices like Rs. 650)
- Show states: selected, disabled, unavailable, loading, empty
- Export a design system (colors, type, components) so developers can copy tokens

---

## Theme Tokens for Devs (`/theme/dark.ts`, Dev 1)
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
All devs must read colors from `useTheme()`, never hardcode hex values.
