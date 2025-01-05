export interface User {
  id: string;
  email: string;
  name: string;
  preferredLanguage: 'en' | 'ja';
  phoneNumber?: string;  // Added phoneNumber as optional property
}

export interface LoginCredentials {
  email: string;
  password: string;
}