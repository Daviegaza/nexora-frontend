import ky, { HTTPError } from 'ky';
import { useAuthStore } from '../store';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000);

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = ky.create({
  prefixUrl: BASE,
  timeout: TIMEOUT,
  retry: { limit: 1, methods: ['get'] },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().accessToken;
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
        request.headers.set('Accept-Language', document.documentElement.lang || 'en-KE');
      },
    ],
    afterResponse: [
      async (_req, _opts, response) => {
        if (response.status === 401) {
          useAuthStore.getState().clearSession();
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.assign('/login');
          }
        }
        return response;
      },
    ],
    beforeError: [
      async (error: HTTPError) => {
        let data: unknown = null;
        try {
          data = await error.response.json();
        } catch {
          /* not JSON */
        }
        const msg = (data as { message?: string } | null)?.message ?? error.message;
        return new ApiError(msg, error.response.status, data) as unknown as HTTPError;
      },
    ],
  },
});

export const json = <T>(path: string, init?: Parameters<typeof api.get>[1]) =>
  api.get(path, init).json<T>();
export const post = <T>(path: string, body?: unknown) => api.post(path, { json: body }).json<T>();
export const put = <T>(path: string, body?: unknown) => api.put(path, { json: body }).json<T>();
export const del = <T>(path: string) => api.delete(path).json<T>();
