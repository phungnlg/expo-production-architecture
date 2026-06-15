import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Session, User } from './model';

/**
 * Auth store - the app's session source of truth. Persisted to AsyncStorage so
 * a returning user skips the login screen (token rehydrated on boot). The
 * ApiClient reads the token from here via a plain getter, so the network layer
 * stays decoupled from React.
 */
interface AuthState {
  token: string | null;
  user: User | null;
  /** false until persisted state has rehydrated - gates the splash redirect. */
  hydrated: boolean;
  setSession: (session: Session) => void;
  markHydrated: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (session) =>
        set({ token: session.token, user: session.user }),
      markHydrated: () => set({ hydrated: true }),
      clear: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        // Screenshot/demo helper: EXPO_PUBLIC_AUTOLOGIN seeds a session so the
        // authed screens are reachable without a manual sign-in tap. Off by
        // default, so a real user always starts at the sign-in screen.
        if (process.env.EXPO_PUBLIC_AUTOLOGIN === '1' && state) {
          state.setSession({
            token: 'mock-jwt-token',
            user: {
              id: 'u1',
              email: 'demo@studio.app',
              fullName: 'Phung Nguyen',
              role: 'Senior React Native Engineer',
            },
          });
        }
        state?.markHydrated();
      },
    },
  ),
);

/** Selectors - components subscribe to the slice they need, nothing more. */
export const selectIsAuthed = (s: AuthState) => s.token != null;
export const selectUser = (s: AuthState) => s.user;
export const selectHydrated = (s: AuthState) => s.hydrated;

/** Non-React token accessor for the API layer. */
export const getAuthToken = (): string | null => useAuthStore.getState().token;
