export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  accountNumber: string;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'subscription';
  amount: number;
  fee?: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  recipientName?: string;
  recipientAccount?: string;
  senderName?: string;
  senderAccount?: string;
  method?: 'EcoCash' | 'M-PESA' | 'Crypto Wallet';
  description?: string;
};

export type Balance = {
  total: number;
  currency: string;
  available?: number;
  pending?: number;
};

export type PaymentMethod = 'EcoCash' | 'M-PESA' | 'Crypto Wallet';

export type WithdrawalRequest = {
  amount: number;
  address: string;
  method: PaymentMethod;
};

export type SendMoneyRequest = {
  amount: number;
  recipientId: string;
  note?: string;
};

export type DepositRequest = {
  amount: number;
  method: PaymentMethod;
  phoneNumber?: string;
};