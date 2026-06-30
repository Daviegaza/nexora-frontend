import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBarcodeScanner } from './useBarcodeScanner';

function dispatch(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('useBarcodeScanner', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('fires onScan after fast keystrokes ended by Enter', () => {
    const onScan = vi.fn();
    renderHook(() => useBarcodeScanner({ onScan }));
    for (const k of ['6', '1', '6', '1', '1', '0', '2', '0', '0', '0']) {
      dispatch(k);
    }
    dispatch('Enter');
    expect(onScan).toHaveBeenCalledWith('6161102000');
  });

  it('ignores slow typing (human input)', async () => {
    const onScan = vi.fn();
    renderHook(() => useBarcodeScanner({ onScan, gap: 30 }));
    dispatch('6');
    await new Promise((r) => setTimeout(r, 60));
    dispatch('1');
    dispatch('Enter');
    expect(onScan).not.toHaveBeenCalled();
  });
});
