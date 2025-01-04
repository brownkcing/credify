import { http, HttpResponse } from 'msw'
import type { User } from '@/types/auth'

export const profileHandlers = [
  http.get('/api/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    const mockUserProfile: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      preferredLanguage: 'en'
    }

    return HttpResponse.json(mockUserProfile)
  })
]