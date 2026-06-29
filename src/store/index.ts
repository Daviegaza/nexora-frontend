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

interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  currentRole: Role;
  currentUser: User;
  notifications: Notification[];
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  currentBranch: string;
  toasts: Toast[];
  isAuthenticated: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setRole: (role: Role) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setNotificationPanelOpen: (v: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  setCurrentBranch: (branch: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  signOut: () => void;
}

const defaultUser: User = {
  id: 'u1',
  name: 'James Mwangi',
  email: 'james.mwangi@nexora.co.ke',
  role: 'owner',
  branch: 'Nairobi HQ',
  department: 'Executive',
  joinDate: '2019-01-15',
  status: 'active',
  phone: '+254 722 123456',
  salary: 450000,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      currentRole: 'owner',
      currentUser: defaultUser,
      notifications: mockNotifications,
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      currentBranch: 'All Branches',
      isAuthenticated: false,

      toasts: [],
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setRole: (role) => set({ currentRole: role }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      setNotificationPanelOpen: (v) => set({ notificationPanelOpen: v }),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      setCurrentBranch: (branch) => set({ currentBranch: branch }),
      addToast: (toast) =>
        set((s) => ({
          toasts: [...s.toasts, { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }],
        })),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      signOut: () =>
        set({
          isAuthenticated: false,
          currentRole: 'owner',
          currentUser: defaultUser,
          currentBranch: 'All Branches',
        }),
    }),
    {
      name: 'nexora-store',
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        currentRole: s.currentRole,
        currentUser: s.currentUser,
        currentBranch: s.currentBranch,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
