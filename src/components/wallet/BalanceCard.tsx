import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Balance } from '../../types';

type BalanceCardProps = {
  balance: Balance;
  accountNumber: string;
};

export default function BalanceCard({ balance, accountNumber }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  return (
    <div className="w-full bg-white rounded-lg card-shadow p-6 mb-8 fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">ACC : {accountNumber}</span>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="text-sm flex items-center gap-1 text-gray-500"
        >
          {showBalance ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-2 transition-all duration-300">
        {showBalance ? (
          <>$<span className="transition-all">{balance.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></>
        ) : (
          '••••••'
        )}
      </h1>
    </div>
  );
}