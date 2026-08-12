/* ─────────────────────────────────────────────
   useUserProfile Hook — manages user profile updates,
   passwords, active sessions, and revocations.
   ───────────────────────────────────────────── */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { userService } from '../services/userService';
import type { User, Session } from '../types';
import { useAuthStore } from '../stores/authStore';

export const useUserProfile = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery<User>({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      return userService.getProfile();
    },
    initialData: user || undefined,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (payload) => {
      return userService.updateProfile(payload);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation<void, Error, any>({
    mutationFn: async (payload) => {
      return userService.updatePassword(payload);
    },
  });
};

export const useSessions = () => {
  return useQuery<Session[]>({
    queryKey: queryKeys.user.sessions(),
    queryFn: async () => {
      return userService.getSessions();
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      return userService.revokeSession(id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Session[]>(queryKeys.user.sessions(), (old) => {
        return old ? old.filter((s) => s.id !== id) : [];
      });
    },
  });
};
