export interface User {
    id: string;
    email: string;
    name: string;
    preferredLanguage: 'en' | 'ja';
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface ProfileUpdateData {
    name?: string;
    preferredLanguage?: 'en' | 'ja';
    theme?: 'light' | 'dark';
    phoneNumber?: string;
    notificationSettings?: {
      email?: boolean;
      push?: boolean;
    };
  }