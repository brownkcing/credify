<template>
  <Modal :is-open="true" @close="$emit('close')">
    <template #title>New Transfer</template>

    <!-- Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in steps" :key="step" 
          class="flex-1 relative"
        >
          <div class="flex items-center">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              :class="[
                currentStep > index 
                  ? 'bg-blue-600 text-white' 
                  : currentStep === index 
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                    : 'bg-gray-100 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div 
              v-if="index < steps.length - 1" 
              class="flex-1 h-0.5 mx-2"
              :class="currentStep > index ? 'bg-blue-600' : 'bg-gray-200'"
            ></div>
          </div>
          <div class="text-xs mt-2">{{ step }}</div>
        </div>
      </div>
    </div>

    <!-- Step 1: Recipient Details -->
    <div v-if="currentStep === 0" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Recipient Type
        </label>
        <div class="mt-2 grid grid-cols-2 gap-3">
          <button
            v-for="type in recipientTypes"
            :key="type.value"
            @click="form.recipientType = type.value"
            class="px-4 py-3 border rounded-lg text-sm font-medium"
            :class="form.recipientType === type.value
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <div v-if="form.recipientType === 'phone'">
        <label class="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          v-model="form.recipient"
          type="tel"
          placeholder="+81 90-1234-5678"
          class="mt-1 block w-full rounded-md border-gray-300"
          :class="{ 'border-red-300': errors.recipient }"
        />
        <p v-if="errors.recipient" class="mt-1 text-sm text-red-600">
          {{ errors.recipient }}
        </p>
      </div>

      <div v-else>
        <label class="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          v-model="form.recipient"
          type="email"
          placeholder="recipient@example.com"
          class="mt-1 block w-full rounded-md border-gray-300"
          :class="{ 'border-red-300': errors.recipient }"
        />
        <p v-if="errors.recipient" class="mt-1 text-sm text-red-600">
          {{ errors.recipient }}
        </p>
      </div>
    </div>

    <!-- Step 2: Amount Details -->
    <div v-else-if="currentStep === 1" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">¥</span>
          </div>
          <input
            v-model="form.amount"
            type="number"
            min="0"
            step="1"
            class="block w-full pl-7 pr-12 rounded-md border-gray-300"
            :class="{ 'border-red-300': errors.amount }"
            placeholder="0"
          />
        </div>
        <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
          {{ errors.amount }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Note (Optional)</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300"
          placeholder="Add a message..."
        ></textarea>
      </div>
    </div>

    <!-- Step 3: Confirmation -->
    <div v-else class="space-y-4">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transfer Summary</h3>
        <dl class="space-y-2">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">To</dt>
            <dd class="text-sm font-medium text-gray-900">{{ form.recipient }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Amount</dt>
            <dd class="text-sm font-medium text-gray-900">¥{{ form.amount }}</dd>
          </div>
          <div class="flex justify-between" v-if="form.note">
            <dt class="text-sm text-gray-500">Note</dt>
            <dd class="text-sm font-medium text-gray-900">{{ form.note }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-6 flex justify-end space-x-3">
      <button
        v-if="currentStep > 0"
        type="button"
        @click="currentStep--"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Back
      </button>
      <button
        v-if="currentStep < steps.length - 1"
        type="button"
        @click="handleNext"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Continue
      </button>
      <button
        v-else
        type="button"
        @click="handleSubmit"
        :disabled="isSubmitting"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Processing...' : 'Confirm Transfer' }}
      </button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/common/Modal.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'transfer-complete', data: any): void;
}>();

const steps = ['Recipient', 'Amount', 'Confirm'];
const currentStep = ref(0);
const isSubmitting = ref(false);

const recipientTypes = [
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' }
];

const form = ref({
  recipientType: 'phone',
  recipient: '',
  amount: '',
  note: ''
});

const errors = ref({
  recipient: '',
  amount: ''
});

const validateStep = () => {
  errors.value = {
    recipient: '',
    amount: ''
  };

  if (currentStep.value === 0) {
    if (!form.value.recipient) {
      errors.value.recipient = 'Recipient is required';
      return false;
    }
    
    if (form.value.recipientType === 'phone') {
      const phoneRegex = /^\+81\s\d{2}-\d{4}-\d{4}$/;
      if (!phoneRegex.test(form.value.recipient)) {
        errors.value.recipient = 'Invalid phone format';
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.value.recipient)) {
        errors.value.recipient = 'Invalid email format';
        return false;
      }
    }
  }

  if (currentStep.value === 1) {
    if (!form.value.amount) {
      errors.value.amount = 'Amount is required';
      return false;
    }
    
    const amount = Number(form.value.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.value.amount = 'Invalid amount';
      return false;
    }
  }

  return true;
};

const handleNext = () => {
  if (validateStep()) {
    currentStep.value++;
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    emit('transfer-complete', {
      recipient: form.value.recipient,
      amount: form.value.amount,
      note: form.value.note
    });
    emit('close');
  } catch (error) {
    console.error('Transfer failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>