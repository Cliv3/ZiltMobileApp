import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleDollarSign, CreditCard, Banknote, RefreshCw } from 'lucide-react';
import { Transaction } from '../../types';

type TransactionItemProps = {
  transaction: Transaction;
};

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <CircleDollarSign className="w-10 h-10 bg-blue-100 text-blue-500 p-2 rounded-full" />;
      case 'withdrawal':
        return <Banknote className="w-10 h-10 bg-orange-100 text-orange-500 p-2 rounded-full" />;
      case 'transfer':
        return <RefreshCw className="w-10 h-10 bg-green-100 text-green-500 p-2 rounded-full" />;
      case 'subscription':
        return <CreditCard className="w-10 h-10 bg-purple-100 text-purple-500 p-2 rounded-full" />;
      default:
        return <CheckCircle className="w-10 h-10 bg-gray-100 text-gray-500 p-2 rounded-full" />;
    }
  };
  
  const getName = () => {
    if (transaction.type === 'deposit') {
      return transaction.method || 'Deposit';
    } else if (transaction.type === 'withdrawal') {
      return 'Withdrawal';
    } else {
      return transaction.recipientName || 'Unknown';
    }
  };
  
  const getTransactionDate = () => {
    const date = new Date(transaction.date);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getAmount = () => {
    const prefix = transaction.type === 'deposit' ? '+' : '-';
    const color = transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500';
    
    return (
      <span className={`font-medium ${color}`}>
        {prefix}${Math.abs(transaction.amount).toLocaleString('en-US')}
      </span>
    );
  };
  
  return (
    <div 
      className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 transition-colors"
      onClick={() => navigate(`/transaction/${transaction.id}`)}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <div>
          <h3 className="font-medium">{getName()}</h3>
          <p className="text-sm text-gray-500">{transaction.description}</p>
        </div>
      </div>
      <div className="text-right">
        {getAmount()}
        <p className="text-xs text-gray-500">{getTransactionDate()}</p>
      </div>
    </div>
  );
}