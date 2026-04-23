export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string | null;
  name: string;
  bio: string;
  role?: UserRole;
}

export interface Lead {
  id: number;
  name: string;
  company: string;
  status: LeadStatus;
  value: number;
  source: string;
  createdAt?: string;
  ownerId?: number;
  owner?: User;
}

export interface Notification {
  id: string;
  userId: number;
  type: string;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  bio: string;
}

export interface CreateUserPayload {
  name: string;
  bio: string;
  role?: UserRole;
}

export interface CreateLeadPayload {
  name: string;
  company: string;
  status: LeadStatus;
  value: number;
  source: string;
}

export interface RequestError extends Error {
  status?: number;
}
