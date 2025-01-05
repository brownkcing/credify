import { http, HttpResponse } from 'msw'
import type { Profile, ProfileUpdateData } from '@/types/profile'

export const profileHandlers = [
  http.patch('http://localhost:5173/api/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    try {
      const updateData = await request.json() as ProfileUpdateData;
      
      return HttpResponse.json({
        id: '1',
        ...updateData,
        updatedAt: new Date().toISOString(),
        createdAt: '2024-01-05T00:00:00.000Z'
      })
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      )
    }
  })
]