// src/services/api/profile.service.ts
import api from './config';
import type { User } from '@/types/auth';

interface ProfileUpdateData {
  name?: string;
  preferredLanguage?: 'en' | 'ja';
}

export const profileService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get('/profile');
    return data;
  },

  async updateProfile(updateData: ProfileUpdateData): Promise<User> {
    const { data } = await api.patch('/profile', updateData);
    return data;
  }
};