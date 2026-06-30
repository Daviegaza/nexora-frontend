import { registerSW } from 'virtual:pwa-register';
import { useUiStore } from './store';

export function registerSw() {
  if (!('serviceWorker' in navigator)) return;
  registerSW({
    onNeedRefresh() {
      useUiStore.getState().addToast({
        type: 'info',
        title: 'Update available',
        message: 'A new version of NEXORA is ready. Reload to apply.',
      });
    },
    onOfflineReady() {
      useUiStore.getState().addToast({
        type: 'success',
        title: 'Offline ready',
        message: 'NEXORA will continue to work without an internet connection.',
      });
    },
  });
}
