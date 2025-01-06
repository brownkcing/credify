import { defineStore } from 'pinia';

interface QRData {
  amount: number;
  recipientId: string;
  note?: string;
  timestamp: string;
}

export const useQRStore = defineStore('qr', {
  state: () => ({
    qrData: null as QRData | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async generateQR(data: QRData) {
      this.loading = true;
      try {
        // API call would go here
        this.qrData = {
          ...data,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        this.error = 'Failed to generate QR code';
      } finally {
        this.loading = false;
      }
    },

    async scanQR(qrString: string) {
      this.loading = true;
      try {
        const data = JSON.parse(qrString) as QRData;
        return data;
      } catch (error) {
        this.error = 'Invalid QR code';
      } finally {
        this.loading = false;
      }
    }
  }
});