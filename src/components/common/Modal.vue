<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="$emit('close')"
    ></div>

    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-lg transform rounded-lg bg-white shadow-xl transition-all">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-lg font-medium">
              <slot name="title"></slot>
            </h3>
            <button 
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>