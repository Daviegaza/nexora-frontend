import { useEffect, useRef, useState } from 'react';
import { Camera, X, Keyboard, Zap, ZapOff } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { Button, Input } from '../ui';
import { cn } from '../../utils';
import { playScanBeep } from '../../hooks/useBarcodeScanner';

interface Props {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}

/**
 * Full-screen camera scanner. Falls back to manual entry if no camera or
 * permission denied. Uses ZXing (covers EAN-13, UPC-A/E, Code-128, QR, etc).
 */
export function BarcodeScannerModal({ open, onClose, onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [manual, setManual] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');

  useEffect(() => {
    if (!open || mode !== 'camera') return;
    let cancelled = false;
    const reader = new BrowserMultiFormatReader();

    async function start() {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (cancelled) return;
        if (devices.length === 0) {
          setError('No camera available — use manual entry.');
          setMode('manual');
          return;
        }
        const back =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ??
          devices[devices.length - 1];
        if (!back) {
          setError('No camera available — use manual entry.');
          setMode('manual');
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        const controls = await reader.decodeFromVideoDevice(
          back.deviceId,
          video,
          (result, err, ctrl) => {
            if (cancelled) {
              ctrl.stop();
              return;
            }
            if (result) {
              playScanBeep(true);
              onDetected(result.getText());
              ctrl.stop();
            }
          },
        );
        controlsRef.current = controls;

        // Torch detection (Chromium-only)
        const track = (video.srcObject as MediaStream | null)?.getVideoTracks()[0];
        const caps = (track?.getCapabilities?.() ?? {}) as MediaTrackCapabilities & {
          torch?: boolean;
        };
        if (caps.torch) setHasTorch(true);
      } catch (e) {
        setError((e as Error).message || 'Camera access denied.');
        setMode('manual');
      }
    }

    void start();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, mode, onDetected]);

  async function toggleTorch() {
    const track = (videoRef.current?.srcObject as MediaStream | null)?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet & { torch: boolean }],
      });
      setTorchOn((v) => !v);
    } catch {
      /* unsupported */
    }
  }

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (manual.trim().length >= 4) {
      playScanBeep(true);
      onDetected(manual.trim());
      setManual('');
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Barcode scanner"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-modal overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-100 dark:border-surface-800">
          <h3 className="font-semibold text-sm text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Camera size={16} className="text-nexora-500" /> Scan Barcode
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode(mode === 'camera' ? 'manual' : 'camera')}
              className="h-8 px-2 text-xs text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center gap-1.5"
            >
              {mode === 'camera' ? (
                <>
                  <Keyboard size={12} /> Manual
                </>
              ) : (
                <>
                  <Camera size={12} /> Camera
                </>
              )}
            </button>
            <button
              onClick={onClose}
              aria-label="Close scanner"
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {mode === 'camera' ? (
          <div className="relative bg-black aspect-[4/3] overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/3 border-2 border-emerald-400/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={cn(
                  'absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur',
                  torchOn ? 'bg-amber-400 text-white' : 'bg-black/40 text-white',
                )}
              >
                {torchOn ? <Zap size={16} /> : <ZapOff size={16} />}
              </button>
            )}
            {error && (
              <div className="absolute inset-x-0 bottom-0 bg-rose-500/90 text-white text-xs px-4 py-2 text-center">
                {error}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={submitManual} className="p-5 space-y-4">
            <Input
              label="Enter barcode / SKU manually"
              autoFocus
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="e.g. 6161102000123"
              icon={<Keyboard size={14} />}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={manual.trim().length < 4}
            >
              Add to cart
            </Button>
            {error && <p className="text-xs text-rose-500 text-center">{error}</p>}
          </form>
        )}

        <div className="px-5 py-2.5 text-[10px] text-surface-400 border-t border-surface-100 dark:border-surface-800 text-center">
          Tip: USB and Bluetooth scanners work automatically anywhere on the POS page.
        </div>
      </div>
    </div>
  );
}
