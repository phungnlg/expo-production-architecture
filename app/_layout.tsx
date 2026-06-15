import { LoadingState } from '@/components/StateView';
import {
  selectHydrated,
  selectIsAuthed,
  useAuthStore,
} from '@/features/auth/authStore';
import { colors } from '@/theme/tokens';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root layout = the app shell. It owns the global providers (React Query for
 * server state, gesture handler, safe-area) and the AUTH GATE.
 *
 * The gate is declarative: `Stack.Protected guard={...}` registers a group of
 * routes only when its guard is true. An authed user simply cannot mount the
 * sign-in route, and a signed-out user cannot mount the app routes - Expo
 * Router redirects to the nearest available screen. No imperative navigation in
 * an effect (which races the navigator mount), and auth routing lives in
 * exactly one place instead of being re-checked inside every screen.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 30_000 },
  },
});

function RootNavigator() {
  const isAuthed = useAuthStore(selectIsAuthed);
  const hydrated = useAuthStore(selectHydrated);

  // Mount the navigator only once the persisted session has rehydrated, so the
  // Protected guards are stable on the Stack's first render. Flipping a guard
  // mid-mount (as async rehydration resolves) would race the navigator mount.
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingState label="Starting up..." />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Protected guard={isAuthed}>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: 'Tasks' }}
        />
        <Stack.Screen
          name="new-task"
          options={{ presentation: 'modal', title: 'New Task' }}
        />
        <Stack.Screen
          name="task/[id]"
          options={{ title: 'Task', headerBackButtonDisplayMode: 'minimal' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthed}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
