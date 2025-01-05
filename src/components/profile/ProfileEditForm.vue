<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-md">
      {{ error }}
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        id="phone"
        v-model="form.phoneNumber"
        type="tel"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="language" class="block text-sm font-medium text-gray-700">
        Preferred Language
      </label>
      <select
        id="language"
        v-model="form.preferredLanguage"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProfileUpdateData } from '@/types/profile';
import { profileService } from '@/services/api/profile.service';

const props = defineProps<{
  initialData: ProfileUpdateData;
}>();

const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'cancel'): void;
}>();

const loading = ref(false);
const error = ref<string | null>(null);
const form = ref<ProfileUpdateData>({ ...props.initialData });

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    await profileService.updateProfile(form.value);
    emit('saved');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};
</script>