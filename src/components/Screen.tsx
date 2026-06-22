import { colors, gradient, radius, screenPadding, shadow, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconName = keyof typeof MaterialIcons.glyphMap;

/**
 * Screen scaffold - consistent safe-area, light background and optional chrome
 * across every route. One place owns page chrome, so screens render only
 * content. Pass `brand` for the TaskFlow app bar, or `header` for a custom nav
 * bar (back/close flows).
 */
export function Screen({
  brand,
  title,
  subtitle,
  right,
  header,
  children,
}: {
  brand?: boolean;
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {header}
      {brand ? (
        <View style={styles.brandBar}>
          <BrandLogo />
          {right}
        </View>
      ) : null}
      {title ? (
        <View style={styles.welcome}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {!brand ? right : null}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

/** The TaskFlow wordmark with its gradient grid glyph. */
export function BrandLogo() {
  return (
    <View style={styles.brand}>
      <LinearGradient
        colors={[...gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.brandMark}
      >
        <MaterialIcons name="grid-view" size={18} color={colors.primaryText} />
      </LinearGradient>
      <Text style={styles.brandText}>TaskFlow</Text>
    </View>
  );
}

/** Small gradient "+ New" pill used in the app bar. */
export function NewButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
      <LinearGradient
        colors={[...gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.newBtn}
      >
        <MaterialIcons name="add" size={16} color={colors.primaryText} />
        <Text style={styles.newBtnText}>New</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Top nav bar for detail/modal screens: leading icon button + title + trailing. */
export function NavBar({
  icon = 'arrow-back',
  onLeading,
  title,
  right,
}: {
  icon?: IconName;
  onLeading: () => void;
  title: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.navBar}>
      <View style={styles.navLeft}>
        <Pressable
          onPress={onLeading}
          hitSlop={10}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <MaterialIcons name={icon} size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.navTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.md,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  brandText: { fontSize: 20, fontWeight: '700', color: colors.text },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.md,
    ...shadow.card,
  },
  newBtnText: { color: colors.primaryText, fontWeight: '700', fontSize: 14 },
  welcome: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: { ...typography.display },
  subtitle: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.md,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  navTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  body: { flex: 1, paddingHorizontal: screenPadding },
});
