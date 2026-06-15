/**
 * Design tokens - the single source of truth for color, spacing, radius and
 * type. Components consume tokens, never raw hex/number literals, so a Figma
 * design-system change is a one-file edit, not a hunt across screens.
 */
export const colors = {
  bg: '#0B1220',
  surface: '#141E33',
  surfaceAlt: '#1C2942',
  border: '#26334D',
  primary: '#4F8CFF',
  primaryText: '#FFFFFF',
  text: '#EAF0FB',
  textMuted: '#93A1BD',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 26, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
} as const;
