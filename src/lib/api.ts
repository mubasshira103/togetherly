import { authClient } from './auth-client';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Public endpoints must keep working even if the session/token request fails,
  // so a token error only means "send the request unauthenticated".
  let token: string | undefined;
  try {
    const tokenResult = await authClient.token();
    token = tokenResult.data?.token;
  } catch {
    token = undefined;
  }
  const response = await fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({ message: 'Unexpected server response' }));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}
