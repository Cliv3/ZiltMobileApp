export type User = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'subscription';
  amount: number;
  fee: number | null;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: 'EcoCash' | 'M-PESA' | 'Crypto Wallet' | null;
  recipient_name?: string | null;
  recipient_account?: string | null;
  description?: string | null;
  created_at: string;
};

export type Balance = {
  balance: number;
  currency: string;
};

export type PaymentMethod = 'EcoCash' | 'M-PESA' | 'Crypto Wallet';

// Request types
export type WithdrawalRequest = {
  amount: number;
  address: string;
  currency?: string;
};

export type SendMoneyRequest = {
  amount: number;
  recipient_address: string;
  note?: string;
  currency?: string;
};

export type DepositRequest = {
  amount: number;
  method: PaymentMethod;
  phone_number?: string;
  currency?: string;
};