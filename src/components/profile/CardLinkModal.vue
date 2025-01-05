<template>
  <Modal :is-open="isOpen" @close="handleClose">
    <template #title>Link Credit Card</template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Card Number</label>
        <input
          type="text"
          v-model="form.cardNumber"
          @input="handleCardNumberInput"
          @blur="validateField('cardNumber')"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-300': errors.cardNumber }"
          maxlength="19"
          placeholder="1234 5678 9012 3456"
        />
        <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">
          {{ errors.cardNumber }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="text"
            v-model="form.expiry"
            @input="handleExpiryInput"
            @blur="validateField('expiry')"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-300': errors.expiry }"
            maxlength="5"
            placeholder="MM/YY"
          />
          <p v-if="errors.expiry" class="mt-1 text-sm text-red-600">
            {{ errors.expiry }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input
            type="text"
            v-model="form.cvv"
            @input="handleCvvInput"
            @blur="validateField('cvv')"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-300': errors.cvv }"
            maxlength="4"
            placeholder="123"
          />
          <p v-if="errors.cvv" class="mt-1 text-sm text-red-600">
            {{ errors.cvv }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isSubmitting ? 'Linking...' : 'Link Card' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Modal from '@/components/common/Modal.vue';
import { financeValidation, formatters } from '@/utils/validation-finance';

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

const errors = ref({
  cardNumber: '',
  expiry: '',
  cvv: ''
});

// Input handlers with formatting
const handleCardNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  form.value.cardNumber = formatters.creditCard.number(input.value);
  if (errors.value.cardNumber) validateField('cardNumber');
};

const handleExpiryInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  form.value.expiry = formatters.creditCard.expiry(input.value);
  if (errors.value.expiry) validateField('expiry');
};

const handleCvvInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  form.value.cvv = input.value.replace(/\D/g, '');
  if (errors.value.cvv) validateField('cvv');
};

// Validation
const validateField = (field: keyof typeof form.value) => {
  errors.value[field] = '';
  
  if (field === 'cardNumber') {
    const result = financeValidation.creditCard.number(form.value.cardNumber);
    if (typeof result === 'string') errors.value.cardNumber = result;
  }
  
  if (field === 'expiry') {
    const result = financeValidation.creditCard.expiry(form.value.expiry);
    if (typeof result === 'string') errors.value.expiry = result;
  }
  
  if (field === 'cvv') {
    const result = financeValidation.creditCard.cvv(form.value.cvv);
    if (typeof result === 'string') errors.value.cvv = result;
  }
};

const validateForm = () => {
  validateField('cardNumber');
  validateField('expiry');
  validateField('cvv');
};

const isFormValid = computed(() => {
  return !Object.values(errors.value).some(error => error) &&
    Object.values(form.value).every(value => value.trim());
});

const handleClose = () => {
  form.value = { cardNumber: '', expiry: '', cvv: '' };
  errors.value = { cardNumber: '', expiry: '', cvv: '' };
  emit('close');
};

const handleSubmit = async () => {
  validateForm();
  if (!isFormValid.value) return;

  try {
    isSubmitting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cardType = form.value.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
    emit('linked', {
      type: cardType,
      lastFourDigits: form.value.cardNumber.slice(-4)
    });
    handleClose();
  } finally {
    isSubmitting.value = false;
  }
};
</script>