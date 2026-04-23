import type {
  AuthSession,
  CreateLeadPayload,
  CreateUserPayload,
  Lead,
  LoginPayload,
  Notification,
  RegisterPayload,
  RequestError,
  User,
} from './types';
import { API_URL } from './config';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'authUser';

type ApiMessage = string | string[] | undefined;
type ApiResponse<T> = T | { message?: ApiMessage; users?: T; leads?: T };

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return response.json().catch(() => ({}));
}

function createError(message: string, status?: number): RequestError {
  const error = new Error(message) as RequestError;
  error.status = status;
  return error;
}

function normalizeMessage(message: ApiMessage, fallback: string): string {
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  if (typeof message === 'string' && message.length) {
    return message;
  }
  return fallback;
}

export function getStoredSession(): AuthSession | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);

  if (!accessToken || !refreshToken || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { accessToken, refreshToken, user };
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession(payload: AuthSession): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

async function authRequest(path: string, body: LoginPayload | RegisterPayload): Promise<AuthSession> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await parseResponse<AuthSession>(response)) as AuthSession & { message?: ApiMessage };
  if (!response.ok) {
    throw createError(normalizeMessage(data.message, `Request failed with status ${response.status}`), response.status);
  }

  saveSession(data);
  return data;
}

export function login(credentials: LoginPayload): Promise<AuthSession> {
  return authRequest('/auth/login', credentials);
}

export function register(payload: RegisterPayload): Promise<AuthSession> {
  return authRequest('/auth/register', payload);
}

export async function refreshSession(): Promise<AuthSession> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw createError('No refresh token', 401);
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = (await parseResponse<AuthSession>(response)) as AuthSession & { message?: ApiMessage };
  if (!response.ok) {
    clearSession();
    throw createError(normalizeMessage(data.message, 'Session expired'), response.status);
  }

  saveSession(data);
  return data;
}

async function requestWithAuth<T>(path: string, options: RequestInit = {}, allowRetry = true): Promise<T> {
  const session = getStoredSession();
  if (!session) {
    throw createError('Unauthorized', 401);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && allowRetry) {
    await refreshSession();
    return requestWithAuth<T>(path, options, false);
  }

  const data = await parseResponse<T>(response);
  if (!response.ok) {
    const payload = data as { message?: ApiMessage };
    throw createError(normalizeMessage(payload.message, `Request failed with status ${response.status}`), response.status);
  }

  return data as T;
}

export async function getUsers(): Promise<User[]> {
  const data = await requestWithAuth<User[] | { users?: User[] }>('/users');
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.users)) {
    return data.users;
  }
  return [];
}

export function createUser(user: CreateUserPayload): Promise<User> {
  return requestWithAuth<User>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function getLeads(): Promise<Lead[]> {
  const data = await requestWithAuth<Lead[] | { leads?: Lead[] }>('/leads');
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.leads)) {
    return data.leads;
  }
  return [];
}

export function createLead(lead: CreateLeadPayload): Promise<Lead> {
  return requestWithAuth<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  });
}

export function getNotifications(): Promise<Notification[]> {
  return requestWithAuth<Notification[]>('/notifications');
}

export function markNotificationAsRead(notificationId: string): Promise<{ ok: boolean }> {
  return requestWithAuth<{ ok: boolean }>(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsAsRead(): Promise<{ ok: boolean }> {
  return requestWithAuth<{ ok: boolean }>('/notifications/read-all', {
    method: 'PATCH',
  });
}
