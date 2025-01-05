// src/mocks/handlers/profile.ts
import { http, HttpResponse } from 'msw';
import type { User } from '@/types/auth';

export const profileHandlers = [
  http.patch('http://localhost:5173/api/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const updateData = await request.json() as any;
      const updatedUser: User = {
        id: '1',
        email: 'test@example.com',  // Email can't be changed
        ...updateData
      };

      return HttpResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
  })
];