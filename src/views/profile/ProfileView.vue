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
              @blur="validateField('name')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="editForm.phoneNumber"
              type="tel"
              @blur="validateField('phoneNumber')"
              placeholder="+81 90-1234-5678"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.phoneNumber }"
            />
            <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">
              {{ errors.phoneNumber }}
            </p>
            <p class="mt-1 text-sm text-gray-500">Format: +81 XX-XXXX-XXXX</p>
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
            <span v-if="saveError" class="text-red-600 mr-auto">{{ saveError }}</span>
            <button
              @click="isEditing = false"
              :disabled="isSaving"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving || hasErrors || !isFormValid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { profileService } from '@/services/api/profile.service';
import { validation } from '@/utils/validation';

const router = useRouter();
const { user, loading, error, checkAuth, logout } = useAuth();
const isEditing = ref(false);
const saveError = ref<string | null>(null);
const isSaving = ref(false);

const editForm = ref({
  name: '',
  preferredLanguage: 'en' as const,
  phoneNumber: ''
});

onMounted(async () => {
  try {
    await checkAuth();
    if (user.value) {
      editForm.value = {
        name: user.value.name,
        preferredLanguage: user.value.preferredLanguage as any,
        phoneNumber: user.value.phoneNumber || ''
      };
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
    router.push('/login');
  }
});

const errors = ref({
  name: '',
  phoneNumber: ''
});

const validateField = (field: 'name' | 'phoneNumber') => {
  errors.value[field] = '';
  
  if (field === 'name') {
    const nameRequired = validation.name.required(editForm.value.name);
    if (typeof nameRequired === 'string') {
      errors.value.name = nameRequired;
      return;
    }

    const nameLength = validation.name.length(editForm.value.name);
    if (typeof nameLength === 'string') {
      errors.value.name = nameLength;
      return;
    }
  }

  if (field === 'phoneNumber') {
    const phoneFormat = validation.phoneNumber.format(editForm.value.phoneNumber);
    if (typeof phoneFormat === 'string') {
      errors.value.phoneNumber = phoneFormat;
      return;
    }
  }
};

const validateForm = () => {
  validateField('name');
  validateField('phoneNumber');
};

const hasErrors = computed(() => 
  Object.values(errors.value).some(error => !!error)
);

const isFormValid = computed(() => 
  editForm.value.name.trim() !== '' && !hasErrors.value
);

const handleSave = async () => {
  validateForm();
  if (hasErrors.value) return;

  try {
    isSaving.value = true;
    saveError.value = null;

    const updatedUser = await profileService.updateProfile(editForm.value);
    user.value = updatedUser;
    isEditing.value = false;
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to save changes';
  } finally {
    isSaving.value = false;
  }
};


const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>