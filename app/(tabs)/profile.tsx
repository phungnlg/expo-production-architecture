import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { selectUser, useAuthStore } from '@/features/auth/authStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Profile + sign-out. Reads the user from the auth store via a selector and
 * clears the session on logout - the root auth gate sends the user back to
 * sign-in. Demonstrates client-state (Zustand) vs server-state (React Query).
 */
export default function ProfileScreen() {
  const user = useAuthStore(selectUser);
  const clear = useAuthStore((s) => s.clear);

  return (
    <Screen title="Profile">
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName ?? 'Guest'}</Text>
        <Text style={styles.role}>{user?.role ?? ''}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <View style={styles.section}>
        <Row label="State management" value="Zustand + React Query" />
        <Row label="Navigation" value="Expo Router (typed routes)" />
        <Row label="Data layer" value="Typed ApiClient + mappers" />
        <Row label="Language" value="TypeScript (strict)" />
      </View>

      <View style={{ flex: 1 }} />
      <Button label="Sign out" variant="secondary" onPress={clear} />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { color: colors.primaryText, fontSize: 30, fontWeight: '800' },
  name: { ...typography.heading, fontSize: 20 },
  role: { ...typography.body, color: colors.primary, marginTop: 2 },
  email: { ...typography.caption, marginTop: 2 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: { ...typography.body, color: colors.textMuted },
  rowValue: { ...typography.body, fontWeight: '600' },
});
