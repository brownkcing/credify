<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
        <div class="space-x-3">
          <button 
            v-if="!isEditing"
            @click="isEditing = true" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
          <button 
            @click="handleLogout" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing && user" class="mt-6">
        <ProfileEditForm
          :initial-data="user"
          @saved="handleSaved"
          @cancel="isEditing = false"
        />
      </div>
      
      <!-- Profile Display -->
      <div v-else-if="user && !isEditing" class="mt-6 bg-white shadow rounded-lg p-6">
        <!-- ... existing profile display code ... -->
      </div>

      <!-- Loading and error states remain the same -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue';

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();
const isEditing = ref(false);

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

const handleSaved = async () => {
  isEditing.value = false;
  await checkAuth(); // Refresh user data
};
</script>