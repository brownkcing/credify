<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header with Buttons -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
        <div class="space-x-4">
          <button 
            @click="isEditing = !isEditing"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
          </button>
          <button 
            @click="handleLogout" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="user" class="bg-white shadow rounded-lg p-6">
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-4">
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
            <p class="mt-1 text-lg">{{ user.preferredLanguage === 'en' ? 'English' : '日本語' }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-500">Phone Number</label>
            <p class="mt-1 text-lg">{{ user.phoneNumber || 'Not set' }}</p>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="editForm.phoneNumber"
              type="tel"
              placeholder="+81"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Language</label>
            <select
              v-model="editForm.preferredLanguage"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end space-x-4">
            <button
              @click="isEditing = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();
const isEditing = ref(false);

const editForm = ref({
  name: '',
  preferredLanguage: 'en',
  phoneNumber: ''
});

onMounted(async () => {
  try {
    await checkAuth();
    if (user.value) {
      editForm.value = {
        name: user.value.name,
        preferredLanguage: user.value.preferredLanguage,
        phoneNumber: user.value.phoneNumber || ''
      };
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
    router.push('/login');
  }
});

const handleSave = () => {
  console.log('Saving:', editForm.value);
  isEditing.value = false;
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>