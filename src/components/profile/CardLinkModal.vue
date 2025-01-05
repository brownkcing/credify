// src/components/profile/CardLinkModal.vue
<template>
  <Modal :is-open="isOpen" @close="$emit('close')">
    <template #title>Link Credit Card</template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Card Number</label>
        <input
          type="text"
          v-model="form.cardNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="\d{16}"
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="text"
            v-model="form.expiry"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="MM/YY"
            pattern="\d{2}/\d{2}"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input
            type="text"
            v-model="form.cvv"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            pattern="\d{3,4}"
            placeholder="123"
          />
        </div>
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
          {{ isSubmitting ? 'Linking...' : 'Link Card' }}
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
  (e: 'linked', cardInfo: { type: string; lastFourDigits: string }): void;
}>();

const isSubmitting = ref(false);
const form = ref({
  cardNumber: '',
  expiry: '',
  cvv: ''
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine card type based on first digit
    const cardType = form.value.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
    
    emit('linked', {
      type: cardType,
      lastFourDigits: form.value.cardNumber.slice(-4)
    });
    emit('close');
  } finally {
    isSubmitting.value = false;
  }
};
</script>