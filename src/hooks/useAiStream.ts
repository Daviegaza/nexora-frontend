import { useCallback, useRef, useState } from 'react';
import { useAuthStore } from '../store';

/**
 * Server-Sent-Events streamer for AI chat. Backend exposes
 * `POST /api/ai/chat/stream` returning `text/event-stream` chunks shaped
 * `data: { "delta": "..." }\n\n` and `data: [DONE]\n\n`.
 *
 * Cancels prior in-flight stream when send() is called again.
 */
export interface AiTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function useAiStream() {
  const [streaming, setStreaming] = useState(false);
  const [text, setText] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (history: AiTurn[]) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setText('');
    setStreaming(true);
    try {
      const token = useAuthStore.getState().accessToken;
      const resp = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        signal: ac.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
      });
      if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const events = buf.split('\n\n');
        buf = events.pop() ?? '';
        for (const ev of events) {
          const line = ev.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') break;
          try {
            const j = JSON.parse(payload) as { delta?: string };
            if (j.delta) {
              acc += j.delta;
              setText(acc);
            }
          } catch {
            /* ignore parse errs */
          }
        }
      }
      return acc;
    } finally {
      setStreaming(false);
    }
  }, []);

  const cancel = useCallback(() => abortRef.current?.abort(), []);
  return { send, cancel, text, streaming };
}
