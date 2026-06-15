import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useCreateTask } from '@/features/tasks/hooks';
import { TaskPriority, PRIORITY_LABEL } from '@/features/tasks/model';
import { AppError, messageFor } from '@/lib/result';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    <Screen>
      <View style={styles.flex}>
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What needs doing?"
          error={
            error?.kind === 'validation' ? messageFor(error) : undefined
          }
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add detail (optional)"
          multiline
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityChip,
                priority === p && styles.priorityChipActive,
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === p && styles.priorityTextActive,
                ]}
              >
                {PRIORITY_LABEL[p]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button
          label="Create task"
          loading={create.isPending}
          onPress={submit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingTop: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.sm },
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  priorityText: { ...typography.body, color: colors.textMuted },
  priorityTextActive: { color: colors.text, fontWeight: '700' },
});
