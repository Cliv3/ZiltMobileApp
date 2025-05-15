import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWalletStore } from '../store/walletStore';
import { Transaction } from '../types';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import NotificationBell from '../components/common/NotificationBell';
import ZiltLogo from '../components/common/ZiltLogo';

export default function TransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTransaction } = useWalletStore();
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const tx = getTransaction(id);
      if (tx) {
        setTransaction(tx);
      } else {
        setError('Transaction not found');
      }
    }
  }, [id, getTransaction]);

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">{error}</h1>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Transaction receipt</h1>
        </div>
        <NotificationBell />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <ZiltLogo size="medium" />
          <span className="text-sm text-gray-500">
            {formatDate(transaction.created_at)}
          </span>
        </div>
        
        <h2 className="text-lg font-semibold mb-1">Hi, {user?.full_name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          This is the receipt for your {transaction.type} transaction
        </p>
        
        <div className="space-y-4 mb-6">
          {transaction.type === 'transfer' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">From</span>
                <span className="font-medium">{user?.full_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">To</span>
                <span className="font-medium">{transaction.recipient_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number</span>
                <span className="font-medium">{transaction.recipient_account}</span>
              </div>
            </>
          )}
          
          {transaction.type === 'deposit' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">{transaction.payment_method}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">To Account</span>
                <span className="font-medium">{user?.wallet_address}</span>
              </div>
            </>
          )}
          
          {transaction.type === 'withdrawal' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">From Account</span>
                <span className="font-medium">{user?.wallet_address}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">To Address</span>
                <span className="font-medium">{transaction.recipient_account}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{transaction.payment_method}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">
              {transaction.type === 'withdrawal' ? 'You Withdrew' :
               transaction.type === 'deposit' ? 'You Deposited' :
               'You Sent'}
            </span>
            <span className="font-medium">${Math.abs(transaction.amount).toFixed(2)}</span>
          </div>
          
          {transaction.fee && (
            <div className="flex justify-between">
              <span className="text-gray-500">Fees</span>
              <span className="font-medium">${transaction.fee.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-medium">
              {formatDate(transaction.created_at)}, {formatTime(transaction.created_at)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mb-6">
          <h3 className="font-semibold mb-2">Disclaimer</h3>
          <p className="text-xs text-gray-500">
            This receipt serves as confirmation of your transaction. Please keep it for your records. 
            For inquiries or disputes regarding this transaction, please contact our customer support 
            within 30 days of the transaction date.
          </p>
        </div>
        
        <Button
          variant="primary"
          fullWidth
          leadingIcon={<Download className="w-5 h-5" />}
        >
          Download Receipt
        </Button>
        
        <button className="mt-4 w-full flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Share className="w-4 h-4" />
          Share Receipt
        </button>
      </div>
    </motion.div>
  );
}