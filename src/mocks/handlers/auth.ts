import { http, HttpResponse } from 'msw'
import type { User, LoginCredentials } from '@/types/auth'

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  preferredLanguage: 'en',
  phoneNumber: '+81 90-1234-5678',
  paymentSettings: {
    defaultMethod: 'credify_balance',
    transactionLimit: 100000,
    balance: 50000,
    bankAccount: {
      isLinked: true,
      bankName: 'MUFG Bank',
      lastFourDigits: '4321'
    },
    creditCard: {
      isLinked: true,
      type: 'Visa',
      lastFourDigits: '1234'
    }
  }
}

export const authHandlers = [
  http.post('http://localhost:5173/api/auth/login', async ({ request }) => {
    try {
      const credentials = await request.json() as LoginCredentials;
      
      if (!credentials?.email || !credentials?.password) {
        return HttpResponse.json(
          { message: 'Email and password are required' },
          { status: 400 }
        )
      }

      const { email, password } = credentials

      if (email === 'test@example.com' && password === 'password') {
        return HttpResponse.json({
          user: mockUser,
          token: 'mock-jwt-token'
        }, { status: 200 })
      }

      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    } catch (error) {
      console.error('Error parsing login request:', error)
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      )
    }
  }),

  http.get('http://localhost:5173/api/auth/me', ({ request }) => {
    console.log('GET /me handler called');
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({ user: mockUser });
  })
]