// src/views/transactions/TransactionsView.vue
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header with Back Button -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="router.back()"
            class="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Transactions</h1>
        </div>

        <!-- Action Buttons -->
        <div class="space-x-4">
          <button 
            @click="showQRModal = true"
            class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            QR Code
          </button>
          <button 
            @click="showTransferModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Transfer
          </button>
        </div>
      </div>

      <!-- Transaction List -->
      <div class="bg-white shadow rounded-lg">
        <!-- Filters -->
        <div class="p-4 border-b flex items-center justify-between">
          <div class="flex space-x-4">
            <select 
              v-model="filters.type"
              class="rounded-md border-gray-300"
            >
              <option value="all">All Types</option>
              <option value="transfer">Transfers</option>
              <option value="payment">Payments</option>
              <option value="topup">Top Up</option>
            </select>

            <select 
              v-model="filters.period"
              class="rounded-md border-gray-300"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Search transactions..."
              class="pl-10 rounded-md border-gray-300"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="divide-y">
          <div 
            v-for="transaction in filteredTransactions" 
            :key="transaction.id"
            class="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors"
          >
            <div class="flex items-center space-x-4">
              <!-- Transaction Type Icon -->
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getTransactionTypeClass(transaction.type)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    v-if="transaction.type === 'transfer'"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                  <path 
                    v-else-if="transaction.type === 'payment'"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                  <path 
                    v-else
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <div>
                <p class="font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
              </div>
            </div>

            <div class="text-right">
              <p 
                class="font-medium"
                :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatAmount(transaction.amount) }}
              </p>
              <p class="text-sm text-gray-500">{{ transaction.status }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div 
            v-if="filteredTransactions.length === 0" 
            class="p-8 text-center text-gray-500"
          >
            No transactions found
          </div>
        </div>
      </div>

      <!-- Modals -->
      <TransferModal 
        v-if="showTransferModal" 
        @close="showTransferModal = false"
        @transfer-complete="handleTransferComplete"
      />
      <QRCodeModal 
        v-if="showQRModal" 
        @close="showQRModal = false"
        @code-scanned="handleQRScanned"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import TransferModal from '@/components/transactions/TransferModal.vue';
import QRCodeModal from '@/components/transactions/QRCodeModal.vue';

const router = useRouter();
const showTransferModal = ref(false);
const showQRModal = ref(false);

// Filters state
const filters = ref({
  type: 'all',
  period: '30',
  search: ''
});

// Mock transactions data
const transactions = ref([
  {
    id: '1',
    type: 'transfer',
    description: 'Transfer to John Doe',
    amount: -500,
    date: new Date('2024-01-05'),
    status: 'Completed'
  },
  {
    id: '2',
    type: 'payment',
    description: 'Payment for Coffee',
    amount: -75,
    date: new Date('2024-01-04'),
    status: 'Completed'
  },
  {
    id: '3',
    type: 'topup',
    description: 'Top up from Bank Account',
    amount: 1000,
    date: new Date('2024-01-03'),
    status: 'Completed'
  }
]);

// Computed and utility functions
const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  // Filter by type
  if (filters.value.type !== 'all') {
    result = result.filter(t => t.type === filters.value.type);
  }

  // Filter by period
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(filters.value.period));
  result = result.filter(t => t.date > cutoff);

  // Filter by search
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(t => 
      t.description.toLowerCase().includes(searchLower)
    );
  }

  return result;
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount);
};

const getTransactionTypeClass = (type: string) => {
  switch (type) {
    case 'transfer':
      return 'bg-blue-100 text-blue-600';
    case 'payment':
      return 'bg-red-100 text-red-600';
    case 'topup':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Event handlers
const handleTransferComplete = (transferData: any) => {
  // Add new transaction to list
  transactions.value.unshift({
    id: Date.now().toString(),
    type: 'transfer',
    description: `Transfer to ${transferData.recipient}`,
    amount: -transferData.amount,
    date: new Date(),
    status: 'Completed'
  });
  showTransferModal.value = false;
};

const handleQRScanned = (qrData: any) => {
  // Handle QR code scan result
  console.log('QR Code scanned:', qrData);
  showQRModal.value = false;
};
</script>