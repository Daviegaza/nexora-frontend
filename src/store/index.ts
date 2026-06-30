import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Role, User, Notification } from '../types';
import { notifications as mockNotifications } from '../mock/data';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// ── UI store: only client-controlled visuals are persisted ─────────────────
interface UiState {
  theme: Theme;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  currentBranch: string;
  toasts: Toast[];

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setNotificationPanelOpen: (v: boolean) => void;
  setCurrentBranch: (branch: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      currentBranch: 'All Branches',
      toasts: [],
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      setNotificationPanelOpen: (v) => set({ notificationPanelOpen: v }),
      setCurrentBranch: (branch) => set({ currentBranch: branch }),
      addToast: (toast) => set((s) => ({ toasts: [...s.toasts, { ...toast, id: uid() }] })),
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'nexora-ui',
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        currentBranch: s.currentBranch,
      }),
    },
  ),
);

// ── Auth store: token + user. Token in sessionStorage only (no role persist).
// Real session is HttpOnly-cookie owned by backend; this client copy is for
// UI hints (name, avatar, role-driven nav). Role MUST come from server.
interface AuthState {
  accessToken: string | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  setSession: (payload: { accessToken: string; user: User }) => void;
  clearSession: () => void;
  role: () => Role | null;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  currentUser: null,
  isAuthenticated: false,
  setSession: ({ accessToken, user }) => {
    try {
      sessionStorage.setItem('nexora.at', accessToken);
    } catch {
      /* ignore */
    }
    set({ accessToken, currentUser: user, isAuthenticated: true });
  },
  clearSession: () => {
    try {
      sessionStorage.removeItem('nexora.at');
    } catch {
      /* ignore */
    }
    set({ accessToken: null, currentUser: null, isAuthenticated: false });
  },
  role: () => get().currentUser?.role ?? null,
}));

if (typeof window !== 'undefined') {
  try {
    const at = sessionStorage.getItem('nexora.at');
    if (at) useAuthStore.setState({ accessToken: at });
  } catch {
    /* ignore */
  }
}

// ── Notifications store ───────────────────────────────────────────────────
interface NotificationsState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  push: (n: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: mockNotifications,
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  push: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
}));

// ── Legacy compatibility shim — keeps existing imports working ────────────
const defaultUser: User = {
  id: 'demo',
  name: 'Demo User',
  email: 'demo@nexora.co.ke',
  role: 'owner',
  branch: 'Nairobi HQ',
  department: 'Executive',
  joinDate: '2024-01-01',
  status: 'active',
  phone: '+254 700 000000',
};

interface LegacyState extends UiState, NotificationsState {
  currentRole: Role;
  currentUser: User;
  isAuthenticated: boolean;
  markNotificationRead: (id: string) => void;
  setRole: (r: Role) => void;
  signOut: () => void;
}

function legacySnapshot(): LegacyState {
  const ui = useUiStore.getState();
  const auth = useAuthStore.getState();
  const notif = useNotificationsStore.getState();
  return {
    ...ui,
    ...notif,
    currentRole: auth.currentUser?.role ?? 'owner',
    currentUser: auth.currentUser ?? defaultUser,
    isAuthenticated: auth.isAuthenticated,
    markNotificationRead: notif.markRead,
    markAllRead: notif.markAllRead,
    setRole: () => undefined,
    signOut: auth.clearSession,
  };
}

export function useAppStore<T = LegacyState>(selector?: (s: LegacyState) => T): T {
  const ui = useUiStore();
  const auth = useAuthStore();
  const notif = useNotificationsStore();
  const merged: LegacyState = {
    ...ui,
    ...notif,
    currentRole: auth.currentUser?.role ?? 'owner',
    currentUser: auth.currentUser ?? defaultUser,
    isAuthenticated: auth.isAuthenticated,
    markNotificationRead: notif.markRead,
    markAllRead: notif.markAllRead,
    setRole: () => undefined,
    signOut: auth.clearSession,
  };
  return selector ? selector(merged) : (merged as unknown as T);
}

useAppStore.getState = legacySnapshot;
