import { Button } from '@/components/Button';
import { NewButton, Screen } from '@/components/Screen';
import { selectUser, useAuthStore } from '@/features/auth/authStore';
import { colors, gradient, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Profile + sign-out. Reads the user from the auth store via a selector and
 * clears the session on logout - the root auth gate sends the user back to
 * sign-in. Demonstrates client-state (Zustand) vs server-state (React Query).
 */
const CHART = [0.5, 0.75, 0.33, 0.85, 0.5, 0.66, 0.25];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const clear = useAuthStore((s) => s.clear);

  return (
    <Screen brand right={<NewButton onPress={() => router.push('/new-task')} />}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <View style={styles.header}>
          <View>
            <LinearGradient
              colors={[...gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {user?.fullName?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </LinearGradient>
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={16} color={colors.textMuted} />
            </View>
          </View>
          <Text style={styles.name}>{user?.fullName ?? 'Guest'}</Text>
          <Text style={styles.role}>{user?.role ?? ''}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.card}>
          <CardHeader icon="settings-input-component" label="Tech Stack Details" />
          <Row label="State management" value="Zustand + React Query" />
          <Row label="Navigation" value="Expo Router" />
          <Row label="Data layer" value="Typed ApiClient" />
          <Row label="Language" value="TypeScript (strict)" highlight />
        </View>

        <View style={styles.card}>
          <CardHeader icon="bar-chart" label="Activity Overview" />
          <View style={styles.chart}>
            {CHART.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { height: `${h * 100}%`, opacity: 0.25 + h * 0.7 },
                ]}
              />
            ))}
          </View>
        </View>

        <Button
          label="Sign out"
          variant="danger"
          iconRight="logout"
          onPress={clear}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

function CardHeader({
  icon,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.cardHeader}>
      <MaterialIcons name={icon} size={20} color={colors.textMuted} />
      <Text style={styles.cardHeaderText}>{label}</Text>
    </View>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHi]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  avatarText: { color: colors.primaryText, fontSize: 40, fontWeight: '700' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.surfaceHighest,
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  name: { ...typography.title, marginTop: spacing.md },
  role: { ...typography.label, color: colors.primary, marginTop: 2 },
  email: { ...typography.caption, marginTop: 2 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(194,198,214,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardHeaderText: { ...typography.label, color: colors.textMuted },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowLabel: { ...typography.bodySm, color: colors.textMuted },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  rowValueHi: { backgroundColor: colors.successSurface, color: colors.success },
  chart: {
    height: 128,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  bar: {
    flex: 1,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
