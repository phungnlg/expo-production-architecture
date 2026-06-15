import { AppError, messageFor } from '@/lib/result';
import { colors, spacing, typography } from '@/theme/tokens';
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
      <Text style={styles.emoji}>📋</Text>
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
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>We hit a snag</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? (
        <Button
          label="Try again"
          variant="secondary"
          onPress={onRetry}
          style={{ marginTop: spacing.lg, minWidth: 160 }}
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
  emoji: { fontSize: 40, marginBottom: spacing.md },
  title: { ...typography.heading, marginBottom: spacing.xs },
  muted: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
