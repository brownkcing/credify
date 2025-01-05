// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/api/auth.service';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('@/views/transactions/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
  ]
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        next('/login');
      } else {
        try {
          // Verify token by getting current user
          await authService.getCurrentUser();
          next();
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          next('/login');
        }
      }
    } else if (to.path === '/login' && isAuthenticated) {
      next('/profile');
    } else {
      next();
    }
  });

export default router;