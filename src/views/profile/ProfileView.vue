<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
        <!-- Add logout button -->
        <button 
          @click="handleLogout" 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <!-- Show user data if available -->
      <div v-if="user" class="mt-6 bg-white shadow rounded-lg p-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Name</label>
            <p class="mt-1 text-lg">{{ user.name }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-500">Email</label>
            <p class="mt-1 text-lg">{{ user.email }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-500">Language</label>
            <p class="mt-1 text-lg capitalize">{{ user.preferredLanguage }}</p>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="mt-6 text-center">
        Loading profile...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="mt-6 text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();

onMounted(async () => {
  try {
    await checkAuth();
  } catch (err) {
    console.error('Failed to load profile:', err);
    router.push('/login');
  }
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>