export interface User {
  id: string;
  email: string;
  name: string;
  preferredLanguage: 'en' | 'ja';
  phoneNumber?: string;
  paymentSettings: {
    defaultMethod: 'bank_account' | 'credit_card' | 'credify_balance';
    transactionLimit: number;
    bankAccount?: {
      isLinked: boolean;
      bankName?: string;
      lastFourDigits?: string;
    };
    creditCard?: {
      isLinked: boolean;
      type?: string;
      lastFourDigits?: string;
    };
    balance: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}