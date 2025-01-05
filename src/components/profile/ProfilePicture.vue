<template>
  <div class="relative">
    <!-- Profile Picture -->
    <div class="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow">
      <img 
        v-if="imageUrl"
        :src="imageUrl"
        :alt="userName"
        class="h-full w-full object-cover"
      />
      <div 
        v-else 
        class="h-full w-full flex items-center justify-center bg-blue-50 text-blue-600 text-2xl font-semibold"
      >
        {{ initials }}
      </div>
    </div>

    <!-- Upload Button -->
    <button
      @click="triggerFileInput"
      class="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  userName: string;
  imageUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'update', file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const initials = computed(() => {
  return props.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    emit('update', input.files[0]);
  }
};
</script>