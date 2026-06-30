import { post } from './api';
import { useAuthStore } from '../store';
import type { User } from '../types';

export interface LoginResponse {
  accessToken: string;
  user: User & { workspaceId: string; caps: string[] };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const r = await post<LoginResponse>('auth/login', { email, password });
  useAuthStore.getState().setSession({ accessToken: r.accessToken, user: r.user });
  return r;
}

export async function register(input: {
  workspaceName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return post<{
    ok: boolean;
    workspace: { id: string; name: string };
    user: { id: string; email: string };
  }>('auth/register', input);
}

export async function refresh(): Promise<{ accessToken: string }> {
  return post<{ accessToken: string }>('auth/refresh');
}

export async function logout() {
  try {
    await post('auth/logout');
  } catch {
    /* ignore */
  }
  useAuthStore.getState().clearSession();
}

export async function me() {
  return post<User & { workspaceId: string; caps: string[] }>('auth/me');
}
