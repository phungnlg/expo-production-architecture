import { Button } from '@/components/Button';
import { NavBar, Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateView';
import { useTask } from '@/features/tasks/hooks';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  Task,
} from '@/features/tasks/model';
import { colors, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Task detail. Reads the typed route param, fetches via React Query (served
 * from cache instantly after the list load), and renders the same three async
 * states through the shared StateView components.
 */
export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: task, isPending, error, refetch } = useTask(id);

  if (isPending) return <LoadingState label="Loading task..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Screen
      header={
        <NavBar
          onLeading={() => router.back()}
          title="Task Detail"
          right={
            <Pressable style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          }
        />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <View style={styles.metaRow}>
          <Pill
            label={STATUS_LABEL[task.status]}
            bg={colors.surfaceHigh}
            fg={colors.primary}
            dot={colors.primary}
          />
          <Pill
            label={`${PRIORITY_LABEL[task.priority]} priority`}
            bg={colors.dangerSurface}
            fg={colors.onDangerSurface}
            dot={colors.danger}
          />
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.crumb}>
          Task ID: {task.id} - {task.assignee}
        </Text>

        <Card>
          <Label>Description</Label>
          <Text style={styles.body}>
            {task.description || 'No description provided.'}
          </Text>
        </Card>

        <View style={styles.detailCard}>
          <Label>Task Details</Label>
          <Detail label="Assignee" value={task.assignee} />
          <Detail label="Created" value={task.createdAt.toDateString()} />
          <Detail
            label="Due Date"
            value={task.dueAt ? task.dueAt.toDateString() : 'No due date'}
            valueColor={colors.primary}
          />
          <Detail
            label="Priority"
            value={PRIORITY_LABEL[task.priority]}
            valueColor={colors.danger}
            last
          />
          <Button
            label="Complete Task"
            onPress={() => {}}
            style={{ marginTop: spacing.lg }}
          />
        </View>

        <View style={styles.history}>
          <MaterialIcons name="history" size={30} color={colors.outline} />
          <Text style={styles.historyText}>Activity History</Text>
          <Text style={styles.historyLink}>View timeline</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.cardLabel}>{children}</Text>;
}

function Detail({
  label,
  value,
  valueColor,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

function Pill({
  label,
  bg,
  fg,
  dot,
}: {
  label: string;
  bg: string;
  fg: string;
  dot: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <View style={[styles.pillDot, { backgroundColor: dot }]} />
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  editText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 12, fontWeight: '600' },
  title: { ...typography.display, marginTop: spacing.md },
  crumb: { ...typography.bodySm, color: colors.textMuted, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.xl,
    ...shadow.card,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  body: { ...typography.body, color: colors.textMuted, lineHeight: 24 },
  detailCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(194,198,214,0.25)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(194,198,214,0.2)',
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { ...typography.bodySm, color: colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  history: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(194,198,214,0.4)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  historyText: { ...typography.caption, marginTop: spacing.sm },
  historyLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
