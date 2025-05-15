import { BatteryFull, Wifi, Signal } from 'lucide-react';

export default function StatusBar() {
  // Get current time in 24-hour format (9:41)
  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="bg-white text-black py-1 flex items-center justify-between px-4 text-sm font-medium w-full sticky top-0 z-10">
      <div>{time}</div>
      <div className="flex items-center space-x-2">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}