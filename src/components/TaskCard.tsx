import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/features/tasks/model';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: colors.textMuted,
  in_progress: colors.primary,
  done: colors.success,
};

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: colors.textMuted,
  medium: colors.warning,
  high: colors.danger,
};

/** Presentational task row. Takes a domain Task, renders, bubbles taps up. */
export function TaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Badge label={STATUS_LABEL[task.status]} color={STATUS_COLOR[task.status]} />
        <Badge
          label={PRIORITY_LABEL[task.priority]}
          color={PRIORITY_COLOR[task.priority]}
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {task.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{task.assignee}</Text>
        {task.dueAt ? (
          <Text style={styles.meta}>Due {formatDate(task.dueAt)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.85 },
  topRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  title: { ...typography.heading, marginBottom: spacing.xs },
  desc: { ...typography.body, color: colors.textMuted },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  meta: { ...typography.caption },
});
