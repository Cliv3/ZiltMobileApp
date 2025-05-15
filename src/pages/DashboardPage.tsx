import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWalletStore } from '../store/walletStore';
import BalanceCard from '../components/wallet/BalanceCard';
import ActionButtons from '../components/wallet/ActionButtons';
import TransactionsList from '../components/wallet/TransactionsList';
import NotificationBell from '../components/common/NotificationBell';
import Button from '../components/common/Button';

export default function DashboardPage() {
  const { user, logout } = useAuth();
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
        
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button
            onClick={logout}
            className="hover:bg-red-50 text-red-600 hover:text-red-700"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
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