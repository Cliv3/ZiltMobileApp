import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#00B2FF] animate-spin" />
        <p className="text-lg font-medium text-[#000B21]">Loading...</p>
      </div>
    </div>
  );
}