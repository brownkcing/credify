<template>
    <div class="space-y-4">
      <div 
        ref="videoContainer" 
        class="w-full h-64 bg-black rounded-lg overflow-hidden relative"
      >
        <video 
          ref="video"
          class="w-full h-full object-cover"
        ></video>
        <div 
          v-if="!isScanning" 
          class="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <button 
            @click="startScanning"
            class="px-4 py-2 bg-white rounded-md"
          >
            Start Scanner
          </button>
        </div>
      </div>
  
      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>
  
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      >
      
      <button
        @click="fileInput?.click()"
        class="w-full px-4 py-2 border border-gray-300 rounded-md"
      >
        Upload QR Code Image
      </button>
    </div>
  </template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

const emit = defineEmits<{
  (e: 'scanned', result: string): void;
}>();

const video = ref<HTMLVideoElement>();
const videoContainer = ref<HTMLDivElement>();
const fileInput = ref<HTMLInputElement>();
const error = ref('');
const isScanning = ref(false);
const scannerControls = ref<IScannerControls>();

const codeReader = new BrowserQRCodeReader();


const startScanning = async () => {
  try {
    error.value = '';
    isScanning.value = true;
    const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
    const selectedDeviceId = videoInputDevices[0].deviceId;

    scannerControls.value = await codeReader.decodeFromVideoDevice(
      selectedDeviceId, 
      video.value!, 
      (result) => {
        if (result) {
          emit('scanned', result.getText());
        }
      }
    );
  } catch (err) {
    error.value = 'Failed to start camera';
    console.error(err);
  }
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  try {
    error.value = '';
    const imageUrl = URL.createObjectURL(input.files[0]);
    const result = await codeReader.decodeFromImageUrl(imageUrl);
    URL.revokeObjectURL(imageUrl);
    emit('scanned', result.getText());
  } catch (err) {
    error.value = 'Failed to read QR code';
    console.error(err);
  }
};

onUnmounted(() => {
  scannerControls.value?.stop();
});

</script>