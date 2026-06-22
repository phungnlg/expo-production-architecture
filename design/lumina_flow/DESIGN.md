---
name: Lumina Flow
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424754'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 40px
---

## Brand & Style

The design system is centered on a **Modern Corporate** aesthetic with a vibrant, high-energy twist. It moves away from the heavy, dark interface of the original app toward a "productive and airy" environment. 

The brand personality is efficient yet approachable, utilizing a **Minimalist** foundation that prioritizes clarity and focus. By leveraging generous whitespace and soft, layered depth, the system evokes a sense of calm control over complex task management. The emotional response is one of clarity and professional optimism, ensuring users feel capable and motivated as they navigate their workflows.

## Colors

The palette is anchored by a clean off-white background (`#F8FAFC`) to maximize contrast and perceived "airiness." 

- **Primary & Secondary:** An energetic pairing of Electric Blue and Deep Violet creates a sophisticated, modern gradient for high-impact actions and brand moments.
- **Neutrals:** We use a Slate-based scale for text and iconography to maintain warmth and readability without the harshness of pure black.
- **Semantic Colors:** Success, Warning, and Error colors are saturated and vibrant. They are designed to "pop" against the light background to provide immediate visual feedback for task statuses and system alerts.

## Typography

This design system utilizes **Inter** exclusively for its highly legible, systematic, and utilitarian qualities. 

The type hierarchy is structured to create clear "entry points" for the eye. Headlines use tight letter spacing and heavier weights to feel grounded and authoritative. Body copy is set with generous line heights to facilitate long-form reading of task descriptions. Labels are occasionally uppercase with slight tracking to differentiate them from interactive body text. For mobile devices, large headlines scale down slightly to prevent awkward line breaks while maintaining visual impact.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on generous internal padding. 

- **Mobile:** A single-column layout with 24px side margins ensures content doesn't feel cramped. 
- **Tablet/Desktop:** Content is centered within a 12-column grid. Elements like task cards typically span 4-6 columns on desktop to maintain readability.
- **Rhythm:** An 8px base spacing system is used throughout. This ensures that the "airy" feel is maintained consistently—if in doubt, favor more whitespace over less to keep the interface feeling productive and light.

## Elevation & Depth

Visual hierarchy is achieved through **Ambient Shadows** and **Tonal Layers**. Instead of borders, we use depth to define containers.

- **Level 0 (Background):** The off-white base layer (`#F8FAFC`).
- **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (Blur: 15px, Opacity: 4%, Color: Neutral-Dark). This creates a subtle lift that distinguishes tasks from the background.
- **Level 2 (Modals/Overlays):** Elevated surfaces with a more pronounced shadow (Blur: 30px, Opacity: 8%) to draw focus during task creation or editing.

We avoid heavy borders; where separation is needed without shadow, use a thin 1px stroke in a light neutral (`#E2E8F0`).

## Shapes

The shape language is consistently **Rounded**, moving away from the sharp or industrial corners found in older enterprise software.

A base radius of 0.5rem (8px) is used for small components like inputs. However, larger containers like task cards and primary action buttons utilize `rounded-lg` (16px) or `rounded-xl` (24px) to emphasize the friendly and modern nature of the product. Interactive elements like status chips use a full pill-shape (circular ends) to distinguish them from structural components.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Blue to Deep Violet), 16px corner radius, bold white text. Use a subtle shadow to make it feel "pressable."
- **Secondary:** Transparent background with a 1px stroke in Primary Blue.
- **Ghost:** No background or border, Blue text, used for low-emphasis actions like "Cancel."

### Input Fields
- Background is white with a light gray border. On focus, the border transitions to Primary Blue with a soft blue glow (outer shadow). Corner radius is 12px.

### Chips & Badges
- **Status Chips:** High-vibe background colors (e.g., light emerald for "Done") with dark green text. These should be pill-shaped.
- **Priority Badges:** Use a small colored dot alongside the text label for a cleaner, more sophisticated look.

### Cards
- Task cards are the primary data container. They must have 20px of internal padding, 16px corner radius, and the Level 1 shadow. Grouped information (e.g., "Assignee," "Due Date") should be separated by whitespace rather than lines.

### Navigation
- Bottom navigation (mobile) uses a blurred "Glassmorphism" effect with a high backdrop-filter (blur: 20px) and 80% opacity white background, keeping the UI light even when scrolling.