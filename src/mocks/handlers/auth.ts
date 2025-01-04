// src/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw'
import type { User, LoginCredentials } from '@/types/auth'

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  preferredLanguage: 'en'
}

export const authHandlers = [
  // Login handler
  http.post('/api/auth/login', async ({ request }) => {
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

  // Add the GET /api/auth/me handler
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Simple token validation (in real app would verify JWT)
    const token = authHeader.split('Bearer ')[1]
    if (token !== 'mock-jwt-token') {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    return HttpResponse.json({ user: mockUser }, { status: 200 })
  })
]
