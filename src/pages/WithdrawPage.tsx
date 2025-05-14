import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWalletStore } from '../store/walletStore';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import NotificationBell from '../components/common/NotificationBell';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, withdraw, isLoading } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  
  const calculatedAmount = parseFloat(amount || '0');
  const fee = calculatedAmount * 0.002; // 0.2% fee
  const receiveAmount = calculatedAmount > 0 ? (calculatedAmount - fee).toFixed(2) : '0.00';
  
  const handleSubmit = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      if (!address) {
        setError('Please enter a valid USDC address');
        return;
      }
      
      const amountValue = parseFloat(amount);
      if (amountValue + fee > balance.total) {
        setError('Insufficient funds');
        return;
      }
      
      await withdraw(amountValue, address);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to process withdrawal. Please try again.');
      }
    }
  };
  
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
          <h1 className="text-xl font-semibold">Withdraw Money</h1>
        </div>
        <NotificationBell />
      </div>
      
      <div className="text-center mb-2 text-sm text-gray-500">
        ACC: {user?.accountNumber}
      </div>
      
      {user?.avatar && (
        <div className="flex justify-center mb-6">
          <img 
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      )}
      
      <div className="relative mb-6">
        <div className="text-center mb-1 text-gray-500 text-sm">Amount</div>
        <div className="flex justify-center items-center mb-6">
          <DollarSign className="text-3xl" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-5xl font-bold text-center bg-transparent border-none focus:outline-none w-40"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500">You will Receive</div>
          <div className="font-semibold">{receiveAmount}</div>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
          <img 
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
            alt="USDC" 
            className="w-5 h-5 mr-1"
          />
          USDC
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="usdc-address" className="block text-sm font-medium text-gray-700 mb-1">
          Enter USDC address
        </label>
        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="usdc-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0x..."
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {/* Paste from clipboard functionality */}}
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key) => (
          <button
            key={key}
            className="aspect-square flex items-center justify-center text-xl font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => {
              if (key === '⌫') {
                setAmount(prev => prev.slice(0, -1));
              } else if (key === '.' && amount.includes('.')) {
                // Prevent multiple decimal points
                return;
              } else {
                setAmount(prev => prev + key);
              }
            }}
          >
            {key}
          </button>
        ))}
      </div>
      
      <Button
        variant="primary"
        fullWidth
        onClick={handleSubmit}
        isLoading={isLoading}
        leadingIcon={<Wallet className="w-5 h-5" />}
      >
        Withdraw
      </Button>
    </motion.div>
  );
}