---
name: Eco-Adventure Wellness
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#414844'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#00677d'
  on-secondary: '#ffffff'
  secondary-container: '#72ddfd'
  on-secondary-container: '#006075'
  tertiary: '#3f1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f2f00'
  on-tertiary-container: '#ea9147'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#b2ebff'
  secondary-fixed-dim: '#69d4f4'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin: 32px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 80px
---

## Brand & Style

This design system is built to balance the high-energy pulse of river adventures with the restorative stillness of rural wellness. The brand personality is "Grounded Vitality"—it feels rooted in the earth of Tampirkulon but energized by its flowing waters. 

The UI style follows a **Modern / Organic** approach. It utilizes a clean, card-based architecture that prioritizes high-resolution photography of lush landscapes and river activities. By combining generous whitespace with tactile, rounded elements, the interface evokes a sense of premium hospitality that remains approachable and unpretentious. The emotional response should be one of "invigorated calm," where users feel safe to explore both physical adventure and mental rejuvenation.

## Colors

The color palette is derived directly from the natural environment of Tampirkulon.
- **Primary (Jungle Green):** A deep, saturated green used for primary actions, navigation, and core branding elements to represent the dense Indonesian canopy.
- **Secondary (River Blue):** A clear, refreshing blue used for interactive highlights, adventure-related icons, and links, reflecting the vitality of the river.
- **Tertiary (Earthy Terracotta):** Used sparingly for accents, notifications, and wellness-related highlights to provide a warm, grounded contrast to the cool greens and blues.
- **Neutral (Clean White & Stone):** The primary background color is a crisp white to ensure the photography "pops," supported by soft grey-stones for subtle section backgrounds and borders.

## Typography

This design system uses a pairing of two modern sans-serifs to achieve a balance of professionalism and warmth. **Plus Jakarta Sans** is used for headlines and labels; its soft curves and optimistic character feel welcoming and contemporary. **Be Vietnam Pro** is used for body copy; its casual and warm rhythm ensures high readability for long-form content about wellness services and local history.

Editorial-style sizing is encouraged, with significant contrast between large headlines and functional body text to guide the user’s eye through the "Eco-Adventure" narrative.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop, transitioning to a fluid model for mobile devices. A 12-column grid is standard, with generous 24px gutters to allow the "Eco-Adventure" photography to breathe. 

The spacing rhythm is built on an 8px base unit. Vertical rhythm should be expansive, using `stack-lg` and `stack-xl` between major sections to mimic the openness of a rural landscape. Elements within cards should use `stack-sm` to maintain a tight, organized relationship between text and imagery.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Surfaces are never truly flat; they sit on subtle layers to suggest physical presence.

- **Level 1 (Cards):** Low-offset, high-blur shadows with a subtle green tint (`rgba(27, 67, 50, 0.08)`) are used for primary content cards.
- **Level 2 (Interactive/Hover):** When a user interacts with a card, the shadow depth increases slightly to suggest lift.
- **Level 3 (Modals/Overlays):** Deep, diffused shadows are used to separate critical information from the background photography.
- **Overlays:** Text placed over photography must use a soft linear gradient (bottom-to-top, black-to-transparent) to ensure legibility without obscuring the natural beauty of the images.

## Shapes

The shape language is consistently **Rounded**, avoiding harsh 90-degree angles to reflect the organic forms found in nature (river stones, leaves, rolling hills). 
- **Standard Elements:** Buttons and small inputs use a 0.5rem (8px) radius.
- **Feature Cards:** Large layout blocks use a 1rem (16px) radius to feel substantial yet soft.
- **Images:** Photography should always feature rounded corners to match the UI, reinforcing the "Wellness" aspect of the brand.

## Components

- **Buttons:** Primary buttons use the Jungle Green background with white text, utilizing a slight 1px inner-border for tactile definition. Secondary buttons use the River Blue to distinguish adventure-based actions.
- **Cards:** The core of the system. Cards must lead with high-quality imagery. Content should be padded by 24px, using soft shadows for depth.
- **Chips:** Small, pill-shaped tags used for categories (e.g., "Moderate Intensity," "Relaxation"). These use a low-opacity background of the category color (e.g., 10% Terracotta) with high-contrast text.
- **Input Fields:** Clean, white backgrounds with a subtle grey border that transitions to Jungle Green on focus.
- **Lists:** Icon-led lists are preferred, using organic, custom line-art icons that feel hand-drawn but clean.
- **Weather/River Status Widget:** A specialized component unique to this system, using live data and icons to show tubing conditions, grounded in the Earthy Terracotta palette for visibility.