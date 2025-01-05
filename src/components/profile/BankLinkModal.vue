<template>
  <Modal :is-open="isOpen" @close="$emit('close')">
    <template #title>Link Bank Account</template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Bank Name</label>
        <select
          v-model="form.bankName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a bank</option>
          <option v-for="bank in banks" :key="bank" :value="bank">{{ bank }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Account Number</label>
        <input
          type="text"
          v-model="form.accountNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="\d{10,14}"
          placeholder="Enter your account number"
        />
        <p class="mt-1 text-sm text-gray-500">Account number should be 10-14 digits</p>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Linking...' : 'Link Account' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/common/Modal.vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'linked', bankInfo: { bankName: string; lastFourDigits: string }): void;
}>();

const isSubmitting = ref(false);
const form = ref({
  bankName: '',
  accountNumber: ''
});

const banks = [
  'MUFG Bank',
  'Sumitomo Mitsui Banking',
  'Mizuho Bank',
  'Japan Post Bank',
  'Resona Bank'
];

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    emit('linked', {
      bankName: form.value.bankName,
      lastFourDigits: form.value.accountNumber.slice(-4)
    });
    emit('close');
  } finally {
    isSubmitting.value = false;
  }
};
</script>