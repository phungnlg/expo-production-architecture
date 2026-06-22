import { AppError, messageFor } from '@/lib/result';
import { colors, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

/**
 * The one component that renders loading / empty / error. Every data screen
 * funnels its async status through here, so those three states look and behave
 * identically app-wide instead of being re-invented per screen.
 */
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={styles.center}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="assignment" size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const message =
    error instanceof AppError ? messageFor(error) : 'Something went wrong.';
  return (
    <View style={styles.center}>
      <View style={styles.glow}>
        <View style={styles.errorWrap}>
          <MaterialIcons name="warning" size={48} color={colors.danger} />
        </View>
      </View>
      <Text style={styles.title}>We hit a snag</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? (
        <Button
          label="Try again"
          onPress={onRetry}
          style={{ marginTop: spacing.xl, minWidth: 200 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  glow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  errorWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  title: { ...typography.title, marginBottom: spacing.xs, marginTop: spacing.sm },
  muted: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
