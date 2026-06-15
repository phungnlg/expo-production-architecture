import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useSignIn } from '@/features/auth/hooks';
import { AppError, messageFor } from '@/lib/result';
import { colors, spacing, typography } from '@/theme/tokens';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

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
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.flex}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoMark}>◆</Text>
            </View>
            <Text style={styles.title}>TaskFlow</Text>
            <Text style={styles.subtitle}>
              Reference React Native architecture
            </Text>
          </View>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@studio.app"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            error={error ? messageFor(error) : undefined}
          />

          <Button
            label="Sign in"
            loading={signIn.isPending}
            onPress={() => signIn.mutate({ email, password })}
          />
          <Text style={styles.hint}>
            Demo credentials are pre-filled. Tap Sign in.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoMark: { color: colors.primaryText, fontSize: 30, fontWeight: '800' },
  title: { ...typography.title, fontSize: 30 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 4 },
  hint: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
