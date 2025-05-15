import { create } from 'zustand';
import { Transaction, PaymentMethod } from '../types';
import { server, account } from '../lib/passkey';
import { supabase } from '../lib/supabase';

interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addFunds: (amount: number, method: PaymentMethod, phone?: string) => Promise<void>;
  withdraw: (amount: number, address: string) => Promise<void>;
  sendMoney: (amount: number, recipientAddress: string, note?: string) => Promise<void>;
  getTransaction: (id: string) => Transaction | undefined;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  currency: 'USDC',
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const contractId = localStorage.getItem('snapchain:contractId');
      if (!contractId) throw new Error('Wallet not connected');

      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, currency')
        .eq('user_id', contractId)
        .single();

      if (!wallet) throw new Error('Wallet not found');
      
      set(state => ({
        ...state,
        balance: wallet.balance,
        currency: wallet.currency,
        isLoading: false 
      }));

    } catch (error) {
      set(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Failed to fetch balance',
        isLoading: false 
      }));
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const contractId = localStorage.getItem('snapchain:contractId');
      if (!contractId) throw new Error('Wallet not connected');

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', contractId)
        .order('created_at', { ascending: false });

      set(state => ({
        ...state,
        transactions: transactions || [],
        isLoading: false 
      }));

    } catch (error) {
      set(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
        isLoading: false 
      }));
    }
  },

  addFunds: async (amount: number, method: PaymentMethod, phone?: string) => {
    set({ isLoading: true, error: null });
    try {
      const contractId = localStorage.getItem('snapchain:contractId');
      const keyId = localStorage.getItem('snapchain:keyId');
      if (!contractId || !keyId) throw new Error('Wallet not connected');

      const transaction = await account.createPaymentTransaction({
        sendAsset: method === 'EcoCash' ? 'XOF' : 'XAF',
        sendAmount: amount.toString(),
        destination: contractId,
        destAsset: 'USDC',
        destAmount: amount.toString(),
        contractId,
        keyId
      });

      await server.send(transaction.signedTx);

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: contractId,
          type: 'deposit',
          amount,
          currency: 'USDC',
          status: 'completed',
          payment_method: method,
          recipient_account: contractId,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      set(state => ({
        ...state,
        balance: state.balance + amount,
        transactions: [{
          id: transaction.txHash,
          user_id: contractId,
          type: 'deposit',
          amount,
          fee: 0, // Explicitly set fee for deposits
          currency: 'USDC',
          status: 'completed',
          payment_method: method,
          recipient_account: contractId,
          created_at: new Date().toISOString()
        }, ...state.transactions],
        isLoading: false
      }));

    } catch (error) {
      set(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Deposit failed',
        isLoading: false 
      }));
      throw error;
    }
  },

  withdraw: async (amount: number, address: string) => {
    set({ isLoading: true, error: null });
    try {
      const contractId = localStorage.getItem('snapchain:contractId');
      const keyId = localStorage.getItem('snapchain:keyId');
      if (!contractId || !keyId) throw new Error('Wallet not connected');

      if (!/^G[A-Z0-9]{55}$/.test(address)) {
        throw new Error('Invalid Stellar address');
      }

      const transaction = await account.createPaymentTransaction({
        destination: address,
        destAmount: amount.toString(),
        destAsset: 'USDC',
        contractId,
        keyId
      });

      await server.send(transaction.signedTx);

      const fee = Number(transaction.fee);
      const totalAmount = amount + fee;

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: contractId,
          type: 'withdrawal',
          amount,
          fee,
          currency: 'USDC',
          status: 'completed',
          recipient_account: address,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      set(state => ({
        ...state,
        balance: state.balance - totalAmount,
        transactions: [{
          id: transaction.txHash,
          user_id: contractId,
          type: 'withdrawal',
          amount,
          fee,
          currency: 'USDC',
          status: 'completed',
          recipient_account: address,
          created_at: new Date().toISOString()
        }, ...state.transactions],
        isLoading: false
      }));

    } catch (error) {
      set(state => ({
        ...state,
        error: error instanceof Error ? error.message : 'Withdrawal failed',
        isLoading: false 
      }));
      throw error;
    }
  },

sendMoney: async (amount: number, recipientAddress: string, note?: string) => {
  set({ isLoading: true, error: null });
  try {
    const contractId = localStorage.getItem('snapchain:contractId');
    const keyId = localStorage.getItem('snapchain:keyId');
    if (!contractId || !keyId) throw new Error('Wallet not connected');

    if (!/^G[A-Z0-9]{55}$/.test(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    // Fixed: Changed 'address' to 'recipientAddress'
    const transaction = await account.createPaymentTransaction({
      destination: recipientAddress,  // Correct variable name here
      destAmount: amount.toString(),
      destAsset: 'USDC',
      contractId,
      keyId
    });

    await server.send(transaction.signedTx);

    const fee = Number(transaction.fee);
    const totalAmount = amount + fee;

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: contractId,
        type: 'transfer',
        amount,
        fee,
        currency: 'USDC',
        status: 'completed',
        recipient_account: recipientAddress,
        description: note,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    set(state => ({
      ...state,
      balance: state.balance - totalAmount,
      transactions: [{
        id: transaction.txHash,
        user_id: contractId,
        type: 'transfer',
        amount,
        fee,
        currency: 'USDC',
        status: 'completed',
        recipient_account: recipientAddress,
        description: note,
        created_at: new Date().toISOString()
      }, ...state.transactions],
      isLoading: false
    }));

  } catch (error) {
    set(state => ({
      ...state,
      error: error instanceof Error ? error.message : 'Transfer failed',
      isLoading: false 
    }));
    throw error;
  }
},

  getTransaction: (id: string) => {
    return get().transactions.find(tx => tx.id === id);
  }
}));