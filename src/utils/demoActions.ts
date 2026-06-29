/**
 * Demo-mode action helpers. Call these from onClick handlers.
 * Replace with real implementations when backend is ready.
 */
import { useAppStore } from '../store';

export function demoToast(title: string, message?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  useAppStore.getState().addToast({ type, title, message });
}

export function demoExport(entity: string) {
  demoToast('Export Started', `${entity} data downloading as CSV.`, 'success');
}

export function demoAdd(entity: string) {
  demoToast('Add New', `${entity} creation form coming soon.`, 'info');
}

export function demoView(entity: string, name?: string) {
  demoToast(name || entity, `Viewing ${entity} details.`, 'info');
}

export function demoEdit(entity: string, name?: string) {
  demoToast('Edit Mode', `Editing ${name || entity}.`, 'info');
}

export function demoAction(label: string, message?: string) {
  demoToast(label, message || 'This feature is coming soon.', 'info');
}

export function demoRefresh() {
  demoToast('Refreshed', 'Data has been updated.', 'success');
}

export function demoNavigate(path: string) {
  window.location.assign(path);
}
