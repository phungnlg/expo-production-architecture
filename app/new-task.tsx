import { Button } from '@/components/Button';
import { NavBar, Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useCreateTask } from '@/features/tasks/hooks';
import { PRIORITY_LABEL, TaskPriority } from '@/features/tasks/model';
import { AppError, messageFor } from '@/lib/result';
import { colors, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Create-task form (modal). Local form state is component-scoped useState;
 * persistence goes through the create mutation, which invalidates the list
 * query so the new task shows up on the previous screen. Validation errors from
 * the API layer (AppError 'validation') surface inline.
 */
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export default function NewTask() {
  const router = useRouter();
  const create = useCreateTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const error = create.error as AppError | null;

  const submit = () => {
    create.mutate(
      { title, description, priority },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <Screen
      header={
        <NavBar icon="close" onLeading={() => router.back()} title="New Task" />
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What needs doing?"
          error={error?.kind === 'validation' ? messageFor(error) : undefined}
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add detail (optional)"
          multiline
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.segment}>
          {PRIORITIES.map((p) => {
            const active = priority === p;
            return (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.segItem, active && styles.segItemActive]}
              >
                <Text style={[styles.segText, active && styles.segTextActive]}>
                  {PRIORITY_LABEL[p]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.contextCard}>
          <View style={styles.contextIcon}>
            <MaterialIcons name="calendar-today" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contextTitle}>Set Due Date</Text>
            <Text style={styles.contextSub}>Add a deadline for this task</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Create task" loading={create.isPending} onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
  label: { ...typography.label, marginBottom: spacing.sm, marginLeft: 2 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(194,198,214,0.3)',
    marginBottom: spacing.xl,
  },
  segItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  segItemActive: { backgroundColor: colors.surface, ...shadow.card },
  segText: { ...typography.label, color: colors.textMuted },
  segTextActive: { color: colors.primary },
  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.card,
  },
  contextIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(33,112,228,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextTitle: { ...typography.label, color: colors.text },
  contextSub: { ...typography.caption, marginTop: 2 },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(194,198,214,0.25)',
  },
});
