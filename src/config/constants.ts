export const APP_CONFIG = {
    name: 'Credify',
    apiUrl: import.meta.env.VITE_API_URL,
    supportedLocales: ['en', 'ja'] as const,
    defaultLocale: 'en',
  } as const;
  
  // src/types/auth.ts
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