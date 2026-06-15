import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/StateView';
import { TaskCard } from '@/components/TaskCard';
import { countByStatus } from '@/features/tasks/model';
import { useTasks } from '@/features/tasks/hooks';
import { colors, radius, spacing, typography } from '@/theme/tokens';
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
      title="Tasks"
      subtitle="Team backlog"
      right={
        <Button
          label="+ New"
          variant="secondary"
          onPress={() => router.push('/new-task')}
          style={{ height: 40, paddingHorizontal: spacing.md }}
        />
      }
    >
      {counts ? (
        <View style={styles.summary}>
          <Stat label="To do" value={counts.todo} />
          <Stat label="In progress" value={counts.in_progress} />
          <Stat label="Done" value={counts.done} />
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
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { ...typography.caption, marginTop: 2 },
});
