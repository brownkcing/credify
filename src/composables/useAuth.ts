import { ref } from 'vue';
import { authService } from '@/services/api/auth.service';
import type { User, LoginCredentials } from '@/types/auth';

export function useAuth() {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(credentials);
      user.value = response.user;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    if (!localStorage.getItem('token')) {
      user.value = null;
      return null;
    }

    loading.value = true;
    error.value = null;
    
    try {
      const currentUser = await authService.getCurrentUser();
      user.value = currentUser;
      return currentUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  };
}