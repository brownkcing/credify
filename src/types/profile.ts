export interface ProfileUpdateData {
    name?: string;
    email?: string;
    preferredLanguage?: 'en' | 'ja';
    phoneNumber?: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    email: string;
    preferredLanguage: 'en' | 'ja';
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
  }