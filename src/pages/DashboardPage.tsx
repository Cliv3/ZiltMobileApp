import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWalletStore } from '../store/walletStore';
import BalanceCard from '../components/wallet/BalanceCard';
import ActionButtons from '../components/wallet/ActionButtons';
import TransactionsList from '../components/wallet/TransactionsList';
import NotificationBell from '../components/common/NotificationBell';

export default function DashboardPage() {
  const { user } = useAuth();
  const { balance, transactions, fetchBalance, fetchTransactions } = useWalletStore();
  
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);
  
  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {user?.avatar && (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}
          <div>
            <h1 className="text-lg font-semibold">Welcome back, {user?.name.split(' ')[0]}</h1>
          </div>
        </div>
        
        <NotificationBell />
      </div>
      
      <BalanceCard 
        balance={balance} 
        accountNumber={user?.accountNumber || ''}
      />
      
      <ActionButtons />
      
      <TransactionsList 
        transactions={transactions}
        title="Today"
      />
    </motion.div>
  );
}