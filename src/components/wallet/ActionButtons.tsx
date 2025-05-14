import { PlusCircle, ArrowUpRight, SendIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionButtons() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <button 
        onClick={() => navigate('/add-funds')}
        className="bg-[#000B21] text-white p-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-transform hover:transform hover:scale-105"
      >
        <PlusCircle className="w-6 h-6 mb-1" />
        <span className="text-sm font-medium">Add Funds</span>
      </button>
      
      <button 
        onClick={() => navigate('/withdraw')}
        className="bg-[#000B21] text-white p-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-transform hover:transform hover:scale-105"
      >
        <ArrowUpRight className="w-6 h-6 mb-1" />
        <span className="text-sm font-medium">Withdraw</span>
      </button>
      
      <button 
        onClick={() => navigate('/send')}
        className="bg-gray-100 text-[#000B21] p-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-transform hover:transform hover:scale-105"
      >
        <SendIcon className="w-6 h-6 mb-1" />
        <span className="text-sm font-medium">Send</span>
      </button>
    </div>
  );
}