import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '../../types';

type PaymentMethodSelectorProps = {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
};

export default function PaymentMethodSelector({
  onSelect,
  selectedMethod
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod);
  
  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    onSelect(method);
  };
  
  const methods: { id: PaymentMethod; label: string; logo: string }[] = [
    {
      id: 'EcoCash',
      label: 'EcoCash',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/54/EcoCash.png'
    },
    {
      id: 'M-PESA',
      label: 'M-PESA',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMPGxi5WoE0uLWHpT-C-km3qDaueN7WpTVlQ&s'
    },
    {
      id: 'Crypto Wallet',
      label: 'Crypto Wallet',
      logo: ''
    }
  ];
  
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => handleSelect(method.id)}
          className={`w-full p-4 rounded-lg flex items-center justify-between ${
            selected === method.id
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-gray-100 hover:bg-gray-200 transition-colors'
          }`}
        >
          <div className="flex items-center gap-3">
            {method.logo ? (
              <img src={method.logo} alt={method.label} className="w-6 h-6 object-contain" />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs">CW</span>
              </div>
            )}
            <span className="font-medium">{method.label}</span>
          </div>
          
          {selected === method.id && (
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}