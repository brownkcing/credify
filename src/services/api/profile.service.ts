import api from './config';
import type { User } from '@/types/auth';

interface UpdateProfileData {
  name?: string;
  preferredLanguage?: 'en' | 'ja';
  phoneNumber?: string;
}

export const profileService = {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const { data: responseData } = await api.patch<User>('/profile', data);
    return responseData;
  }
};