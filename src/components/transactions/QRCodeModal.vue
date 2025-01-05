// src/components/transactions/QRCodeModal.vue
<template>
  <Modal :is-open="true" @close="$emit('close')" class="max-w-lg">
    <template #title>QR Code Payment</template>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-4 px-6 text-sm font-medium"
          :class="[
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Generate QR Tab -->
    <div v-if="activeTab === 'generate'" class="space-y-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Amount</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              v-model="generateForm.amount"
              type="number"
              min="0"
              step="1"
              class="block w-full pl-7 pr-12 rounded-md border-gray-300"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Note (Optional)</label>
          <input
            v-model="generateForm.note"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300"
            placeholder="Add a description"
          />
        </div>

        <button
          @click="generateQR"
          :disabled="!generateForm.amount"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Generate QR Code
        </button>
      </div>

      <!-- Generated QR Code -->
      <div v-if="qrCodeData" class="text-center space-y-4">
        <div class="bg-white p-4 inline-block rounded-lg shadow-sm">
          <!-- Replace with actual QR code component -->
          <div class="w-48 h-48 bg-gray-100 flex items-center justify-center">
            <span class="text-gray-500">QR Code Placeholder</span>
          </div>
        </div>
        <button 
          @click="handleShare"
          class="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share QR Code
        </button>
      </div>
    </div>

    <!-- Scan QR Tab -->
    <div v-else class="space-y-6">
      <div class="bg-gray-50 p-4 rounded-lg text-center">
        <!-- Camera/Scanner Component would go here -->
        <div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-gray-500">Camera Preview</span>
        </div>
        
        <p class="mt-4 text-sm text-gray-600">
          Point your camera at a Credify QR code
        </p>
      </div>

      <div class="space-y-2">
        <button
          @click="toggleScanner"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {{ isScanning ? 'Stop Scanning' : 'Start Scanning' }}
        </button>
        
        <button
          @click="handleUpload"
          class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Upload QR Code Image
        </button>
      </div>

      <!-- Hidden file input for QR code upload -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileSelected"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/common/Modal.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'code-scanned', data: any): void;
}>();

const tabs = [
  { id: 'generate', label: 'Generate QR' },
  { id: 'scan', label: 'Scan QR' }
];

const activeTab = ref('generate');
const isScanning = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const qrCodeData = ref<string | null>(null);

const generateForm = ref({
  amount: '',
  note: ''
});

const generateQR = () => {
  // Generate QR code data
  qrCodeData.value = JSON.stringify({
    amount: generateForm.value.amount,
    note: generateForm.value.note,
    timestamp: new Date().toISOString()
  });
};

const handleShare = async () => {
  if (!qrCodeData.value) return;

  try {
    // Implementation would depend on your sharing requirements
    console.log('Sharing QR code:', qrCodeData.value);
  } catch (error) {
    console.error('Failed to share QR code:', error);
  }
};

const toggleScanner = () => {
  isScanning.value = !isScanning.value;
  if (isScanning.value) {
    // Implementation would depend on your QR scanning library
    console.log('Starting scanner...');
  } else {
    console.log('Stopping scanner...');
  }
};

const handleUpload = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    // Implementation would depend on your QR code reading library
    console.log('Processing file:', input.files[0].name);
  }
};
</script>