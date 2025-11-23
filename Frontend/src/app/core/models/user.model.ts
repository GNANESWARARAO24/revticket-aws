export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}