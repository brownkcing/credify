<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Credify
          </h2>
        </div>
        
        <LoginForm @success="handleLoginSuccess" />
        
        <!-- Debug section -->
        <div v-if="isDev" class="mt-8 p-4 bg-gray-100 rounded">
          <h3 class="text-sm font-bold text-gray-700">Debug Info:</h3>
          <p class="text-sm text-gray-600">Test credentials:</p>
          <code class="block mt-2 text-xs bg-white p-2 rounded">
            Email: test@example.com<br>
            Password: password
          </code>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import LoginForm from '@/components/auth/LoginForm.vue';
  
  const router = useRouter();
  const isDev = ref(import.meta.env.DEV);
  
  const handleLoginSuccess = () => {
    router.push('/profile');
  };
  </script>