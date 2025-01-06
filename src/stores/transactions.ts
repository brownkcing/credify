import { defineStore } from 'pinia';

interface Transaction {
  id: string;
  type: any;
  description: string;
  amount: number;
  date: Date;
  status: string;
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [] as Transaction[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTransactions() {
      this.loading = true;
      try {
        // API call here
        this.transactions = mockTransactions;
      } catch (error) {
        this.error = 'Failed to load transactions';
      } finally {
        this.loading = false;
      }
    },

    addTransaction(transaction: Transaction) {
      this.transactions.unshift(transaction);
    }
  }
});

const mockTransactions = [
  {
    id: '1',
    type: 'transfer',
    description: 'Transfer to John Doe',
    amount: -500,
    date: new Date('2024-01-05'),
    status: 'Completed'
  },
  // Add more mock data
];