import api from './config';
import type { Profile, ProfileUpdateData } from '@/types/profile';

export const profileService = {
  async getProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>('/profile');
    return data;
  },

  async updateProfile(updateData: ProfileUpdateData): Promise<Profile> {
    const { data } = await api.patch<Profile>('/profile', updateData);
    return data;
  }
};