import { create } from 'zustand';
import { Balance, Transaction, PaymentMethod } from '../types';

interface WalletState {
  balance: Balance;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addFunds: (amount: number, method: PaymentMethod) => Promise<void>;
  withdraw: (amount: number, address: string) => Promise<void>;
  sendMoney: (amount: number, recipientId: string, note?: string) => Promise<void>;
  getTransaction: (id: string) => Transaction | undefined;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'transfer',
    amount: 300,
    currency: 'USDC',
    date: '2025-04-24T10:30:00Z',
    status: 'completed',
    recipientName: 'Michelle R. Singh',
    recipientAccount: '...3456',
    description: 'Transfer'
  },
  {
    id: '2',
    type: 'deposit',
    amount: 1200,
    currency: 'USDC',
    date: '2025-04-23T14:20:00Z',
    status: 'completed',
    method: 'EcoCash',
    description: 'Deposit'
  },
  {
    id: '3',
    type: 'transfer',
    amount: 700,
    currency: 'USDC',
    date: '2025-04-22T09:15:00Z',
    status: 'completed',
    recipientName: 'Mary-Anne Lithli',
    recipientAccount: '...7890',
    description: 'Transfer'
  },
  {
    id: '4',
    type: 'subscription',
    amount: 20,
    currency: 'USDC',
    date: '2025-04-21T00:00:00Z',
    status: 'completed',
    recipientName: 'Dribbble',
    description: 'Subscription'
  },
  {
    id: '5',
    type: 'subscription',
    amount: 25,
    currency: 'USDC',
    date: '2025-04-20T00:00:00Z',
    status: 'completed',
    recipientName: 'Figma',
    description: 'Subscription'
  },
  {
    id: '6',
    type: 'subscription',
    amount: 25,
    currency: 'USDC',
    date: '2025-03-20T00:00:00Z',
    status: 'completed',
    recipientName: 'Figma',
    description: 'Subscription'
  }
];

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: { total: 3550.60, currency: 'USDC' },
  transactions: mockTransactions,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ balance: { total: 3550.60, currency: 'USDC' }, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch balance', isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ transactions: mockTransactions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },

  addFunds: async (amount: number, method: PaymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        currency: 'USDC',
        date: new Date().toISOString(),
        status: 'completed',
        method: method,
        description: 'Deposit'
      };
      
      set(state => ({
        balance: { ...state.balance, total: state.balance.total + amount },
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }));
      
      return;
    } catch (error) {
      set({ error: 'Failed to add funds', isLoading: false });
      throw new Error('Failed to add funds');
    }
  },

  withdraw: async (amount: number, address: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fee = amount * 0.002; // 0.2% fee
      const totalDeduction = amount + fee;
      
      if (get().balance.total < totalDeduction) {
        throw new Error('Insufficient funds');
      }
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: amount,
        fee: fee,
        currency: 'USDC',
        date: new Date().toISOString(),
        status: 'completed',
        recipientAccount: address,
        method: 'Crypto Wallet',
        description: 'Withdrawal'
      };
      
      set(state => ({
        balance: { ...state.balance, total: state.balance.total - totalDeduction },
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }));
      
      return;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process withdrawal', 
        isLoading: false 
      });
      throw error;
    }
  },

  sendMoney: async (amount: number, recipientId: string, note?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fee = amount * 0.001; // 0.1% fee
      const totalDeduction = amount + fee;
      
      if (get().balance.total < totalDeduction) {
        throw new Error('Insufficient funds');
      }
      
      // Mock recipient data
      const mockRecipient = {
        name: 'Kane Terrel',
        account: '+233 000 111 2222'
      };
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount: amount,
        fee: fee,
        currency: 'USDC',
        date: new Date().toISOString(),
        status: 'completed',
        recipientName: mockRecipient.name,
        recipientAccount: mockRecipient.account,
        description: note || 'Transfer'
      };
      
      set(state => ({
        balance: { ...state.balance, total: state.balance.total - totalDeduction },
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }));
      
      return;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send money', 
        isLoading: false 
      });
      throw error;
    }
  },

  getTransaction: (id: string) => {
    return get().transactions.find(tx => tx.id === id);
  }
}));