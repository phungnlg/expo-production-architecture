import { services } from '@/api/services';
import { AppError } from '@/lib/result';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './authStore';

/**
 * Sign-in mutation. On success it writes the session into the auth store, which
 * flips the root layout's auth gate and routes the user into the app.
 */
export function useSignIn() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const res = await services.auth.login(vars.email, vars.password);
      if (!res.ok) throw res.error;
      return res.value;
    },
    onSuccess: (session) => setSession(session),
  });
}

export type SignInError = AppError;
