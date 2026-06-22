/**
 * Design tokens - the single source of truth for color, spacing, radius and
 * type. Components consume tokens, never raw hex/number literals, so a design
 * system change (here: the "Lumina Flow" light system from Stitch) is a
 * one-file edit, not a hunt across screens.
 */
export const colors = {
  // Surfaces - off-white, airy, layered tonal depth instead of borders.
  bg: '#f9f9ff',
  surface: '#ffffff',
  surfaceAlt: '#f0f3ff',
  surfaceHigh: '#dee8ff',
  surfaceHighest: '#d8e3fb',

  // Outlines - prefer tonal layers; outline used only where a line is needed.
  border: '#c2c6d6',
  outline: '#727785',

  // Brand - electric blue paired with deep violet for gradients and accents.
  primary: '#0058be',
  primaryContainer: '#2170e4',
  secondary: '#6b38d4',
  primaryText: '#ffffff',

  // Text - slate-based for warmth and readability.
  text: '#111c2d',
  textMuted: '#424754',

  // Semantic - saturated so statuses pop against the light background.
  success: '#047857',
  successSurface: '#d1fae5',
  warning: '#2170e4',
  danger: '#ba1a1a',
  dangerSurface: '#ffdad6',
  onDangerSurface: '#93000a',
} as const;

/** Primary action gradient: electric blue -> deep violet. */
export const gradient = ['#0058be', '#6b38d4'] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Side margin for screen content - the design's "airy" 24px gutter. */
export const screenPadding = 24;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.4 },
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text },
  bodySm: { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
} as const;

/** Ambient shadows define containers (Level 1 cards) instead of heavy borders. */
export const shadow = {
  card: {
    shadowColor: '#0b1220',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0b1220',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;
