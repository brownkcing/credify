export const APP_CONFIG = {
    name: 'Credify',
    apiUrl: import.meta.env.VITE_API_URL,
    supportedLocales: ['en', 'ja'] as const,
    defaultLocale: 'en',
  } as const;