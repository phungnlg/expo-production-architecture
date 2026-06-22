import { colors, gradient, radius, shadow, spacing } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type IconName = keyof typeof MaterialIcons.glyphMap;

/**
 * Single button primitive. Variants + loading state live here, not per screen.
 * Primary renders the brand gradient (electric blue -> deep violet) per the
 * Lumina Flow design system; secondary is an outlined pill; ghost is text-only.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  iconRight,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  iconRight?: IconName;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const tint =
    variant === 'primary'
      ? colors.primaryText
      : variant === 'danger'
        ? colors.danger
        : colors.primary;

  const content = loading ? (
    <ActivityIndicator color={tint} />
  ) : (
    <View style={styles.inner}>
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      {iconRight ? <MaterialIcons name={iconRight} size={18} color={tint} /> : null}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.shadowWrap,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
          style,
        ]}
      >
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles.gradient]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: { borderRadius: radius.lg, ...shadow.card },
  base: {
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  gradient: { width: '100%' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(186,26,26,0.25)',
  },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  label: { fontSize: 16, fontWeight: '700' },
});
