import { Button } from '@/components/Button';
import { BrandLogo } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useSignIn } from '@/features/auth/hooks';
import { AppError, messageFor } from '@/lib/result';
import { colors, gradient, radius, screenPadding, shadow, spacing, typography } from '@/theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Sign-in screen. Pre-filled demo credentials so the flow is one tap on a
 * simulator. The mutation writes the session; the root auth gate handles the
 * redirect - this screen never navigates manually.
 */
export default function SignIn() {
  const [email, setEmail] = useState('demo@studio.app');
  const [password, setPassword] = useState('password');
  const signIn = useSignIn();
  const error = signIn.error as AppError | null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.brand}>
            <LinearGradient
              colors={[...gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <BrandGlyph />
            </LinearGradient>
            <Text style={styles.title}>TaskFlow</Text>
            <Text style={styles.subtitle}>Reference React Native architecture</Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
            />
            <TextField
              label="Password"
              icon="lock-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="********"
              error={error ? messageFor(error) : undefined}
            />

            <Button
              label="Sign in"
              iconRight="arrow-forward"
              loading={signIn.isPending}
              onPress={() => signIn.mutate({ email, password })}
            />

            <View style={styles.hintRow}>
              <View style={styles.pulse} />
              <Text style={styles.hint}>Demo credentials are pre-filled. Tap Sign in.</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** A four-cell grid glyph echoing the Material grid_view mark, in white. */
function BrandGlyph() {
  return (
    <View style={styles.glyph}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.glyphCell} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: screenPadding,
  },
  brand: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    transform: [{ rotate: '12deg' }],
    ...shadow.raised,
  },
  glyph: { width: 34, height: 34, flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  glyphCell: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: colors.primaryText,
  },
  title: { ...typography.display, marginBottom: 4 },
  subtitle: { ...typography.label, color: colors.textMuted, opacity: 0.7 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.card,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  pulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  hint: { ...typography.caption, fontStyle: 'italic' },
});
