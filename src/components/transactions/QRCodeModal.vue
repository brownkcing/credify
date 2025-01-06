<template>
  <Modal :is-open="true" @close="$emit('close')">
    <template #title>QR Code Payment</template>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b">
      <nav class="-mb-px flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-4 px-6 text-sm font-medium"
          :class="activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Generate QR -->
    <div v-if="activeTab === 'generate'" class="space-y-6">
      <div v-if="qrCodeData" class="flex justify-center">
        <qrcode-vue
          :value="qrCodeData"
          :size="200"
          level="H"
        />
      </div>

      <form @submit.prevent="generateQR" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Amount</label>
          <input
            v-model.number="form.amount"
            type="number"
            class="mt-1 block w-full rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Note</label>
          <input
            v-model="form.note"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
          :disabled="loading"
        >
          {{ loading ? 'Generating...' : 'Generate QR Code' }}
        </button>
      </form>
    </div>

    <!-- Scan QR -->
    <div v-else>
      <QRScanner @scanned="handleScanned" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import Modal from '@/components/common/Modal.vue';
import QRScanner from './QRScanner.vue';
import { useQRStore } from '@/stores/qr';

const qrStore = useQRStore();
const activeTab = ref('generate');
const loading = ref(false);
const qrCodeData = ref('');

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'scanned', data: any): void;
}>();

const tabs = [
  { id: 'generate', label: 'Generate QR' },
  { id: 'scan', label: 'Scan QR' }
];

const form = ref({
  amount: 0,
  note: ''
});

async function generateQR() {
  loading.value = true;
  try {
    const data = {
      amount: form.value.amount,
      recipientId: 'current-user-id',
      note: form.value.note,
      timestamp: new Date().toISOString()
    };
    await qrStore.generateQR(data);
    qrCodeData.value = JSON.stringify(data);
  } finally {
    loading.value = false;
  }
}

async function handleScanned(result: string) {
  try {
    const data = await qrStore.scanQR(result);
    emit('scanned', data);
    emit('close');
  } catch (error) {
    console.error('Failed to process QR code:', error);
  }
}

</script>