import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  Task,
  TaskPriority,
  TaskStatus,
} from '@/features/tasks/model';
import { colors, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Tone = { bg: string; fg: string; dot: string };

const STATUS_TONE: Record<TaskStatus, Tone> = {
  todo: { bg: 'rgba(114,119,133,0.12)', fg: colors.textMuted, dot: colors.outline },
  in_progress: { bg: 'rgba(107,56,212,0.12)', fg: colors.secondary, dot: colors.secondary },
  done: { bg: colors.successSurface, fg: colors.success, dot: colors.success },
};

const PRIORITY_TONE: Record<TaskPriority, Tone> = {
  high: { bg: 'rgba(186,26,26,0.10)', fg: colors.danger, dot: colors.danger },
  medium: { bg: 'rgba(33,112,228,0.10)', fg: colors.primaryContainer, dot: colors.primaryContainer },
  low: { bg: 'rgba(114,119,133,0.12)', fg: colors.textMuted, dot: colors.outline },
};

/** Presentational task row. Takes a domain Task, renders, bubbles taps up. */
export function TaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  const done = task.status === 'done';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        done && styles.cardDone,
        pressed && !done && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Chip label={STATUS_LABEL[task.status]} tone={STATUS_TONE[task.status]} />
        {!done ? (
          <Chip label={PRIORITY_LABEL[task.priority]} tone={PRIORITY_TONE[task.priority]} />
        ) : null}
      </View>

      <Text style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
        {task.title}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {task.description}
      </Text>

      {!done ? (
        <View style={styles.footer}>
          <View style={styles.assignee}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(task.assignee)}</Text>
            </View>
            <Text style={styles.assigneeName}>{task.assignee}</Text>
          </View>
          {task.dueAt ? (
            <View style={styles.due}>
              <MaterialIcons name="calendar-today" size={14} color={colors.textMuted} />
              <Text style={styles.meta}>Due {formatDate(task.dueAt)}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function Chip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <View style={[styles.chip, { backgroundColor: tone.bg }]}>
      <View style={[styles.dot, { backgroundColor: tone.dot }]} />
      <Text style={[styles.chipText, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  cardDone: { backgroundColor: 'rgba(231,238,255,0.5)', opacity: 0.7 },
  pressed: { transform: [{ scale: 0.99 }] },
  topRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, fontWeight: '600' },
  title: { ...typography.heading, marginBottom: spacing.xs },
  titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  desc: { ...typography.bodySm, color: colors.textMuted, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(194,198,214,0.3)',
  },
  assignee: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 10, fontWeight: '700', color: colors.text },
  assigneeName: { fontSize: 13, fontWeight: '600', color: colors.text },
  due: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { ...typography.caption },
});
