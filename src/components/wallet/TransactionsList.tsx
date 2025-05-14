import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import TransactionItem from './TransactionItem';
import { Transaction } from '../../types';
import { useNavigate } from 'react-router-dom';

type TransactionsListProps = {
  transactions: Transaction[];
  title?: string;
  showViewAll?: boolean;
};

export default function TransactionsList({
  transactions,
  title = 'Today',
  showViewAll = true
}: TransactionsListProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  // Show only 5 transactions if not expanded
  const displayedTransactions = expanded 
    ? transactions 
    : transactions.slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg card-shadow">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="font-semibold text-lg">{title}</h2>
        {showViewAll && (
          <button 
            className="text-[#00B2FF] text-sm font-medium flex items-center"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'See All'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      
      <div>
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
            />
          ))
        ) : (
          <div className="py-6 text-center text-gray-500">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}