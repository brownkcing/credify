import api from './config';
import type { LoginCredentials, User } from '@/types/auth';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};