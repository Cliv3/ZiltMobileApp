import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SendIcon, DollarSign, User, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWalletStore } from '../store/walletStore';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import NotificationBell from '../components/common/NotificationBell';

// Mock recent recipients for the demo
const recentRecipients = [
  {
    id: 'rec1',
    name: 'Kane Terrel',
    phoneNumber: '+233 000 111 2222',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'rec2',
    name: 'Michelle R. Singh',
    phoneNumber: '+254 111 222 3333',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
  },
  {
    id: 'rec3',
    name: 'Mary-Anne Lithli',
    phoneNumber: '+255 222 333 4444',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  }
];

type SendMoneyStep = 'amount' | 'recipient' | 'note' | 'confirmation';

export default function SendMoneyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, sendMoney, isLoading } = useWalletStore();
  
  const [step, setStep] = useState<SendMoneyStep>('amount');
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [note, setNote] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate fee (0.1%)
  const calculatedAmount = parseFloat(amount || '0');
  const fee = calculatedAmount * 0.001;
  const totalAmount = calculatedAmount + fee;
  
  // Filter recipients based on search query
  const filteredRecipients = recentRecipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.phoneNumber.includes(searchQuery)
  );

  useEffect(() => {
    // Clear any errors when step changes
    setError('');
  }, [step]);

  const handleNext = () => {
    if (step === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      if (parseFloat(amount) + fee > balance) {
        setError('Insufficient funds');
        return;
      }
      
      setError('');
      setStep('recipient');
    } else if (step === 'recipient') {
      if (!selectedRecipient && !recipientPhone) {
        setError('Please select or enter a recipient');
        return;
      }
      
      setError('');
      setStep('note');
    } else if (step === 'note') {
      setStep('confirmation');
    }
  };

  const handlePrevious = () => {
    if (step === 'recipient') {
      setStep('amount');
    } else if (step === 'note') {
      setStep('recipient');
    } else if (step === 'confirmation') {
      setStep('note');
    }
  };
  
  const selectRecipient = (recipient: any) => {
    setSelectedRecipient(recipient);
    setRecipientId(recipient.id);
    setRecipientName(recipient.name);
    setRecipientPhone(recipient.phoneNumber);
  };
  
  // Change handleSendMoney
const handleSendMoney = async () => {
  try {
    if (!amount || !recipientPhone) {
      setError('Invalid transaction details');
      return;
    }
    
    const amountValue = parseFloat(amount);
    await sendMoney(amountValue, recipientPhone, note);
    navigate('/');
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Failed to send money. Please try again.');
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
          <h1 className="text-xl font-semibold">Send Money</h1>
        </div>
        <NotificationBell />
      </div>
      
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      {step === 'amount' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fade-in"
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Enter Amount</h2>
            
            <div className="relative mb-6">
              <div className="text-center mb-1 text-gray-500 text-sm">Amount to Send</div>
              <div className="flex justify-center items-center mb-2">
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
              
              {calculatedAmount > 0 && (
                <div className="text-center text-sm text-gray-500">
                  Fee: ${fee.toFixed(2)} (0.1%)
                </div>
              )}
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
            onClick={handleNext}
            disabled={calculatedAmount <= 0}
          >
            Continue
          </Button>
        </motion.div>
      )}
      
      {step === 'recipient' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fade-in"
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Recipient</h2>
            
            <div className="relative mb-4">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search or enter phone number"
              />
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Recipients</h3>
              <div className="space-y-2">
                {filteredRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => selectRecipient(recipient)}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 ${
                      selectedRecipient?.id === recipient.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <img 
                      src={recipient.avatar} 
                      alt={recipient.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-gray-500">{recipient.phoneNumber}</div>
                    </div>
                    {selectedRecipient?.id === recipient.id && (
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredRecipients.length === 0 && searchQuery && (
              <div className="p-4 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg mb-4">
                <p className="mb-2">No matching recipients found</p>
                <p className="text-sm">Enter a new recipient's phone number</p>
              </div>
            )}
            
            {searchQuery && !selectedRecipient && (
              <button
                onClick={() => {
                  setRecipientPhone(searchQuery);
                  setRecipientName('New Recipient');
                }}
                className="w-full p-3 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Send to <strong>{searchQuery}</strong></span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </button>
            )}
          </div>
          
          <div className="flex gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex-1"
              disabled={!selectedRecipient && !recipientPhone}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
      
      {step === 'note' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fade-in"
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add a Note (Optional)</h2>
            
            <div className="mb-6">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's this for?"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                />
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">
                {note.length}/100 characters
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Sending</span>
                <span className="font-semibold">${calculatedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Fee (0.1%)</span>
                <span className="font-semibold">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
      
      {step === 'confirmation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fade-in"
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Transfer</h2>
            
            <div className="flex items-center justify-center mb-6">
              {selectedRecipient?.avatar ? (
                <img 
                  src={selectedRecipient.avatar} 
                  alt={recipientName} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-500">Sending to</p>
              <h3 className="text-xl font-semibold">{recipientName}</h3>
              <p className="text-gray-500">{recipientPhone}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">${calculatedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Fee</span>
                <span className="font-semibold">${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {note && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Note</p>
                <p className="bg-gray-50 p-3 rounded-lg text-sm">{note}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSendMoney}
              className="flex-1"
              isLoading={isLoading}
              leadingIcon={<SendIcon className="w-5 h-5" />}
            >
              Send Money
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}