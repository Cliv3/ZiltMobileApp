import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Balance } from '../../types';

type BalanceCardProps = {
  balance: number;
  currency: string;
  walletAddress: string;
};

export default function BalanceCard({ balance, currency, walletAddress }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  return (
    <div className="w-full bg-white rounded-lg card-shadow p-6 mb-8 fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">ACC : {walletAddress}</span>
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
          <>{currency} {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</>
        ) : (
          '••••••'
        )}
      </h1>
    </div>
  );
}