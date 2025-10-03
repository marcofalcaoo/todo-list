export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface UpdateRoleRequest {
  role: string;
}
