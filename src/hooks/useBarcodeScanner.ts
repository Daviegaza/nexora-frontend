import { useEffect, useRef } from 'react';

/**
 * Keyboard-wedge barcode scanner: USB/Bluetooth scanners emulate fast keystrokes
 * ended by Enter. We capture sequences with inter-key gap < `gap` ms.
 *
 * Works alongside any focused input — only fires when the typed sequence is
 * fast enough to be a scanner, not human typing.
 */
export interface UseBarcodeScannerOptions {
  onScan: (code: string) => void;
  enabled?: boolean;
  minLength?: number;
  gap?: number; // ms between keys to still be considered scanner input
  endKey?: string; // suffix character the scanner sends (usually Enter)
}

export function useBarcodeScanner({
  onScan,
  enabled = true,
  minLength = 4,
  gap = 50,
  endKey = 'Enter',
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyAt = useRef<number>(0);
  const handlerRef = useRef(onScan);
  handlerRef.current = onScan;

  useEffect(() => {
    if (!enabled) return;

    function onKey(e: KeyboardEvent) {
      const now = Date.now();
      const dt = now - lastKeyAt.current;
      lastKeyAt.current = now;

      // Reset buffer if too slow (= human typing)
      if (dt > gap && bufferRef.current.length > 0) bufferRef.current = '';

      // End-of-scan: emit and clear
      if (e.key === endKey) {
        const code = bufferRef.current;
        bufferRef.current = '';
        if (code.length >= minLength) {
          e.preventDefault();
          handlerRef.current(code);
        }
        return;
      }

      // Only printable single chars
      if (e.key.length === 1) bufferRef.current += e.key;
    }

    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [enabled, minLength, gap, endKey]);
}

/** Brief beep on scan via WebAudio (no asset needed). */
export function playScanBeep(ok: boolean = true) {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = ok ? 1175 : 350;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    setTimeout(() => ctx.close(), 250);
  } catch {
    /* audio unavailable */
  }
}
