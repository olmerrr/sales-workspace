export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface User {
  id: number;
  email: string;
  name: string;
  bio: string;
}

export interface Lead {
  id: number;
  name: string;
  company: string;
  status: LeadStatus;
  value: number;
  source: string;
  createdAt?: string;
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
