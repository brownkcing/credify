<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="error" 
           class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" 
           role="alert">
        {{ error }}
      </div>
  
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :disabled="loading"
          />
        </div>
      </div>
  
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :disabled="loading"
          />
        </div>
      </div>
  
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  import type { LoginCredentials } from '@/types/auth';
  
  const emit = defineEmits<{
    (e: 'success'): void
  }>();
  
  const { login, loading, error } = useAuth();
  
  const form = ref<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const handleSubmit = async () => {
    try {
      await login(form.value);
      emit('success');
    } catch (err) {
      // Error is already handled in useAuth composable
      console.error('Login failed');
    }
  };
  </script>