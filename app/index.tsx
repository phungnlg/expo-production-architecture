import { LoadingState } from '@/components/StateView';
import {
  selectHydrated,
  selectIsAuthed,
  useAuthStore,
} from '@/features/auth/authStore';
import { colors } from '@/theme/tokens';
import { Redirect, useRootNavigationState } from 'expo-router';
import { View } from 'react-native';

/**
 * Entry route. Holds a splash until two things are true: the persisted session
 * has rehydrated, and the root navigator has mounted (`navState.key`). Only
 * then does it redirect - issuing a redirect on the first commit would race the
 * navigator mount. No flicker into the wrong stack.
 */
export default function Index() {
  const hydrated = useAuthStore(selectHydrated);
  const isAuthed = useAuthStore(selectIsAuthed);
  const navReady = !!useRootNavigationState()?.key;

  if (!hydrated || !navReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingState label="Starting up..." />
      </View>
    );
  }
  return <Redirect href={isAuthed ? '/(tabs)' : '/sign-in'} />;
}
