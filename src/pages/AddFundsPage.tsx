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
import { sendAddFundsSms, checkVerify, addFundsApi } from '../api/verify.ts';
import { useAuth } from '../contexts/AuthContext';

export default function AddFundsPage() {
  const navigate = useNavigate();
  const { addFunds, isLoading } = useWalletStore();
  const { user } = useAuth();

  const [step, setStep] = useState<'amount' | 'method' | 'phone' | 'verify'>('amount');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

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
      if (method === 'EcoCash' || method === 'M-PESA') {
        setInfo('Sending verification code...');
        setError('');
        await sendAddFundsSms(phoneNumber, amount);
        setInfo('Verification code sent. Please enter the code you received.');
        setStep('verify');
      } else {
        await addFunds(parseFloat(amount), method);
        navigate('/');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add funds. Please try again.');
      setInfo('');
    }
  };

  const handleVerify = async () => {
    try {
      setInfo('Verifying code...');
      setError('');
      await checkVerify(phoneNumber, code);
      setInfo('');
      if (user?.id && method) {
        await addFundsApi(user.id, amount, method);
        navigate('/');
      } else {
        setError('User or payment method not found.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
      setInfo('');
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
      
      {info && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
          {info}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {step === 'amount' && (
          <motion.div>
            <h2 className="text-lg font-semibold mb-4">Enter Amount</h2>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={amount}
                readOnly
                className="pl-10 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
                placeholder="0.00"
              />
            </div>
            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === '⌫') {
                      setAmount((prev) => prev.slice(0, -1));
                    } else if (key === '.' && amount.includes('.')) {
                      return;
                    } else {
                      setAmount((prev) => prev + key);
                    }
                  }}
                  className="aspect-square flex items-center justify-center text-xl font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
            {/* Preset buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[100, 200, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
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
          <motion.div>
            <h2 className="text-lg font-semibold mb-4">Select Deposit Method</h2>
            <PaymentMethodSelector
              onSelect={(m: PaymentMethod) => setMethod(m)}
              selectedMethod={method}
            />
          </motion.div>
        )}
        
        {step === 'phone' && (
          <motion.div>
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

        {step === 'verify' && (
          <motion.div>
            <h2 className="text-lg font-semibold mb-4">Enter Verification Code</h2>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter code"
            />
          </motion.div>
        )}
      </div>
      
      <Button
        variant="primary"
        fullWidth
        onClick={
          step === 'phone'
            ? handleSubmit
            : step === 'verify'
            ? handleVerify
            : handleContinue
        }
        isLoading={isLoading}
        leadingIcon={step === 'phone' || step === 'verify' ? <CreditCard className="w-5 h-5" /> : undefined}
      >
        {step === 'verify'
          ? 'Verify & Add Funds'
          : step === 'phone'
          ? 'Send Code'
          : 'Continue'}
      </Button>
    </motion.div>
  );
}