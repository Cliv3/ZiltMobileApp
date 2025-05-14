import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign } from 'lucide-react';
import { PaymentMethod } from '../types';
import { useWalletStore } from '../store/walletStore';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import PaymentMethodSelector from '../components/wallet/PaymentMethodSelector';
import NotificationBell from '../components/common/NotificationBell';

export default function AddFundsPage() {
  const navigate = useNavigate();
  const { addFunds, isLoading } = useWalletStore();
  
  const [step, setStep] = useState<'amount' | 'method' | 'phone'>('amount');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  
  const handleContinue = () => {
    if (step === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      setError('');
      setStep('method');
    } else if (step === 'method') {
      if (!method) {
        setError('Please select a payment method');
        return;
      }
      setError('');
      if (method === 'EcoCash' || method === 'M-PESA') {
        setStep('phone');
      } else {
        handleSubmit();
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (!amount || !method) return;
      
      const amountValue = parseFloat(amount);
      await addFunds(amountValue, method);
      navigate('/');
    } catch (error) {
      setError('Failed to add funds. Please try again.');
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
          <h1 className="text-xl font-semibold">Add Funds</h1>
        </div>
        <NotificationBell />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {step === 'amount' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4">Enter Amount</h2>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[100, 200, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {step === 'method' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4">Select Deposit Method</h2>
            
            <PaymentMethodSelector
              onSelect={setMethod}
              selectedMethod={method}
            />
          </motion.div>
        )}
        
        {step === 'phone' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4">Enter Phone Number</h2>
            
            <div className="mb-6">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
          </motion.div>
        )}
      </div>
      
      <Button
        variant="primary"
        fullWidth
        onClick={step === 'phone' ? handleSubmit : handleContinue}
        isLoading={isLoading}
        leadingIcon={step === 'phone' ? <CreditCard className="w-5 h-5" /> : undefined}
      >
        {step === 'phone' ? 'Add Funds' : 'Continue'}
      </Button>
    </motion.div>
  );
}