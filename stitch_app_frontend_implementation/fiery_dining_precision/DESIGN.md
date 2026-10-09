---
name: Fiery Dining Precision
colors:
  surface: '#161616'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e8bcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8782'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a9'
  primary: '#ffb4a9'
  on-primary: '#690001'
  primary-container: '#e10f0f'
  on-primary-container: '#fff4f2'
  inverse-primary: '#c00006'
  secondary: '#ffb4a3'
  on-secondary: '#601403'
  secondary-container: '#7f2a17'
  on-secondary-container: '#ff9b83'
  tertiary: '#eec140'
  on-tertiary: '#3e2e00'
  tertiary-container: '#8c6c00'
  on-tertiary-container: '#fff4e3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930003'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#7f2a17'
  tertiary-fixed: '#ffdf92'
  tertiary-fixed-dim: '#eec140'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  primary-dark: '#A80B0B'
  surface-alt: '#1F1F1F'
  text-primary: '#FFFFFF'
  text-muted: '#A8A8A8'
  border-dark: '#2A2A2A'
  success: '#3DDC84'
  danger: '#FF4D4D'
  light-background: '#FFF8F0'
  light-surface: '#FFFFFF'
  light-surface-alt: '#F3E9DD'
  light-text-primary: '#1A1A1A'
  light-text-muted: '#6B6B6B'
  light-border: '#E5D8C8'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  display-tagline:
    fontFamily: Caveat
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  price-lg:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  price-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses high-energy, modern hospitality rooted in fire, charcoal, and warm ember tones. Built for a high-intensity single-restaurant companion app, the aesthetic blends dark-mode dominance with high-contrast culinary focus. The visual atmosphere captures the raw power of open-flame cooking while maintaining structured digital clarity.

The aesthetic fuses **Tactile High-Contrast Minimalism** with **Atmospheric Ember Glow**. Visual weight is created through pitch-dark backdrops (`#0B0B0B`), crisp layered charcoal tiers, and focused chromatic heat: searing flame red (`#E10F0F`), earthy terracotta (`#B5523B`), and radiant golden embers (`#F7C948`).

Selected states mirror the circular flame emblem via razor-thin crimson rings and atmospheric diffuse glows. Food imagery commands the foreground through dark gradient masks, ensuring that typography and action controls stay immediate, readable, and tactile.

## Colors

The palette establishes an aggressive visual hierarchy built around heat intensity.

### Dark Mode (Default)
- **Primary (`#E10F0F`)**: Core brand accent, key action triggers, selected state halos, and active navigation indicators.
- **Primary Dark (`#A80B0B`)**: Pressed and active button states, gradient terminations, and low-key flame borders.
- **Secondary Terracotta (`#B5523B`)**: Section eyebrow labels, brand wordmarks, and contextual warmth.
- **Tertiary Gold (`#F7C948`)**: Monospaced and display pricing, numeric emphasis, star ratings, and limited-stock badges.
- **Background (`#0B0B0B`)**: Pitch obsidian base echoing the core circular mark.
- **Surfaces (`#161616` / `#1F1F1F`)**: Structured container layers and elevated inputs with subtle separation.
- **Functional Semantics**: `#3DDC84` indicates order readiness and confirmed states; `#FF4D4D` highlights immediate errors, stock depletion, or cancellation.

### Light Mode Variant
For bright ambient dining environments, the canvas shifts to warm cream (`#FFF8F0`) with crisp card surfaces (`#FFFFFF`), muted sandstone inputs (`#F3E9DD`), and charcoal typography (`#1A1A1A`). The core brand red, terracotta, and gold retain identical values across both modes.

## Typography

The typographic hierarchy balances modern geometric impact with clean reading utility:
- **Headlines & Labels (`Space Grotesk`)**: Provides punchy geometry, confident stance, and structural precision across titles, dish names, buttons, and prices.
- **Body & Metadata (`Inter`)**: Delivers neutral, highly legible reading for ingredient notes, customization groups, and order timelines.
- **Accent Tagline (`Caveat`)**: Reserved strictly for the brand signature line (*"Taste the heat"*), delivering handcrafted artisanal personality without polluting structured interface labels.

### Currency Formatting
Prices are consistently formatted with the golden yellow accent (`#F7C948`) using the pattern `Rs. X,XXX` (e.g., `Rs. 1,460`).

## Layout & Spacing

The layout operates on a strict **8px base grid** optimized for compact handheld operations (390 x 844 target canvas). 

- **Outer Margins**: Constant `16px` (`margin`) across mobile portrait screens, expanding to `24px` on tablet breakpoints.
- **Internal Column Gutters**: `16px` (`gutter`) for split columns such as two-wide category tiles or kitchen orders.
- **Rhythm Multiples**:
  - `4px` (`space-xs`): Micro tag padding and inline badge gaps.
  - `8px` (`space-sm`): Card element stacking and icon-to-label separation.
  - `16px` (`space-md`): Interior card padding and list spacing.
  - `24px` (`space-lg`): Section transitions and modal bottom cushions.
  - `32px` (`space-xl`): Separation between primary screen groups.

Fixed bottom anchors (tab bar and sticky CTA checkout bars) maintain a consistent `72px` minimum touch height with a frosted overlay effect above the scrolling list viewport.

## Elevation & Depth

Visual depth avoids generic grey drop shadows, utilizing low-key surface stacking combined with dynamic red ember glows.

- **Level 0 (Canvas Base)**: Deep `#0B0B0B`.
- **Level 1 (Card & Section Containers)**: `#161616` with a crisp `1px solid #2A2A2A` boundary.
- **Level 2 (Interactive Chips, Inputs, Elevated Modals)**: `#1F1F1F` background with subtle edge definition (`#2A2A2A`).
- **Fiery Glow Elevation**: Active tabs, selected modifier cards, and primary action triggers utilize an intense crimson halo:
  `box-shadow: 0px 4px 20px rgba(225, 15, 15, 0.35);`
- **Focus Glow State**: Inputs and active order step nodes utilize a tightened ring glow:
  `box-shadow: 0px 0px 10px rgba(247, 201, 72, 0.40);`
- **Surface Gradients**: Food imagery banners incorporate an upward gradient (`linear-gradient(180deg, rgba(11,11,11,0) 40%, rgba(11,11,11,0.95) 100%)`) to guarantee immediate typographic readability over photography.

## Shapes

The design system applies a disciplined geometric profile:
- **Cards & Modal Sheets**: Structured with a uniform `16px` border-radius (`rounded-lg`), establishing tactile card containment.
- **Interactive Action Buttons**: Sculpted with `12px` roundedness to provide responsive touch targets without fully turning into pills.
- **Chips, Category Selectors & Tag Badges**: Built with complete full-pill geometry (`rounded-full` / `9999px`) to immediately distinguish auxiliary attributes from primary structural cards.
- **Selected Element Outline**: Directly reflects the circular logo's external halo via a razor-sharp `1.5px solid #E10F0F` outline.

## Components

### Buttons
- **Primary Button**: Solid `#E10F0F` background, white bold Space Grotesk text, `12px` corner radius, `48px` minimum height. Pressed state transitions to `#A80B0B` with an ambient crimson shadow.
- **Secondary / Outline Button**: Transparent or `#161616` surface, `1.5px` border in `#E10F0F`, white or terracotta label.
- **Sticky Cart Action Bar**: Docked to canvas bottom, `#161616` background with `#2A2A2A` top border, housing total price in `#F7C948` and full-width primary button.

### Chips & Tags
- **Dietary Badges (Veg, Spicy, Nut-Free, Gluten-Free)**: Full pill geometry, `#1F1F1F` background, `1px solid #2A2A2A` border, `11px` uppercase label with compact icon prefix.
- **Category Filter Tabs**: Pill shape. Inactive uses `#161616` background with `#A8A8A8` text; active state switches to solid `#E10F0F` with white text and a diffuse red glow.

### Cards & Dish Presentation
- **Dish Card**: `16px` radius, `#161616` background, `1px solid #2A2A2A` outline. Features a 16:9 imagery cap with dark vignette gradient, Space Grotesk title, prep time badge, and prominent `#F7C948` price label.
- **Limited Stock Badge**: Nested chip inside dish image showing `"Only 3 left"` with `#F7C948` text on semi-translucent black overlay.
- **Unavailable State**: Low opacity (`0.45`), grayscale image filter, `#FF4D4D` badge reading `"Unavailable"`, disable touch action.

### Steppers & Quantity Controls
- **Counter Stepper**: Segmented capsule with `#1F1F1F` background, containing minus/plus controls framing bold white count values.
- **Vertical Order Progress Stepper**: Continuous connecting trail. Completed nodes show solid red with flame tick; active step shows glowing amber (`#F7C948`) with pulsating beacon; forthcoming stages remain muted grey (`#2A2A2A`).

### Inputs & Modifiers
- **Search Bar**: `#1F1F1F` fill, `12px` border radius, `#2A2A2A` border, magnifying glass icon in `#A8A8A8`, placeholder text in `#A8A8A8`. Active state adds a `1px` ring in `#E10F0F`.
- **Modifier Option Row**: Surface `#161616` with interior `#1F1F1F` checkbox/radio. Selection displays `#E10F0F` fill with checkmark and dynamic modifier price in `#F7C948`.

### Navigation
- **Bottom Tab Bar**: 4 fixed items (*Menu*, *Cart*, *Orders*, *Kitchen*), `#0B0B0B` background with frosted backdrop blur, active tab highlighted with flame red icon and glowing indicator dot; Cart tab supports numeric red badge.