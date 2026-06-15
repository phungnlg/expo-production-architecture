import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateView';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
} from '@/features/tasks/model';
import { useTask } from '@/features/tasks/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Task detail. Reads the typed route param, fetches via React Query (served
 * from cache instantly after the list load), and renders the same three async
 * states through the shared StateView components.
 */
export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isPending, error, refetch } = useTask(id);

  if (isPending) return <LoadingState label="Loading task..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.metaRow}>
          <Pill label={STATUS_LABEL[task.status]} />
          <Pill label={`${PRIORITY_LABEL[task.priority]} priority`} />
        </View>

        <Section heading="Description">
          <Text style={styles.body}>
            {task.description || 'No description provided.'}
          </Text>
        </Section>

        <Section heading="Details">
          <Detail label="Assignee" value={task.assignee} />
          <Detail label="Created" value={task.createdAt.toDateString()} />
          <Detail
            label="Due"
            value={task.dueAt ? task.dueAt.toDateString() : 'No due date'}
          />
          <Detail label="ID" value={task.id} />
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {children}
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  pill: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  pillText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  section: { marginTop: spacing.xl },
  sectionHeading: { ...typography.label, marginBottom: spacing.sm },
  body: { ...typography.body, lineHeight: 22 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: { ...typography.body, color: colors.textMuted },
  detailValue: { ...typography.body, fontWeight: '600' },
});
