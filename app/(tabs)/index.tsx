import { Screen, NewButton } from '@/components/Screen';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/StateView';
import { TaskCard } from '@/components/TaskCard';
import { countByStatus } from '@/features/tasks/model';
import { useTasks } from '@/features/tasks/hooks';
import { colors, radius, shadow, spacing } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

/**
 * Tasks list. A textbook data screen: it only reads `useTasks()` and renders
 * one of loading / error / empty / data. No fetch logic, no error strings, no
 * sorting - all of that lives below the UI in the feature + lib layers.
 */
export default function TasksScreen() {
  const router = useRouter();
  const { data, isPending, error, refetch, isRefetching } = useTasks();

  const counts = data ? countByStatus(data) : null;

  return (
    <Screen
      brand
      title="Tasks"
      subtitle="Team backlog"
      right={<NewButton onPress={() => router.push('/new-task')} />}
    >
      {counts ? (
        <View style={styles.summary}>
          <Stat label="To do" value={counts.todo} color={colors.primary} />
          <Stat label="In progress" value={counts.in_progress} color={colors.secondary} />
          <Stat label="Done" value={counts.done} color={colors.textMuted} />
        </View>
      ) : null}

      {isPending ? (
        <LoadingState label="Loading tasks..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Create your first task to get started."
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => router.push(`/task/${item.id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </Screen>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
