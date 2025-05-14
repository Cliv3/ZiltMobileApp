import { ZapIcon } from 'lucide-react';

type ZiltLogoProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
};

export default function ZiltLogo({ size = 'medium', variant = 'full' }: ZiltLogoProps) {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  if (variant === 'icon') {
    return (
      <div className="flex items-center justify-center bg-[#000B21] rounded-full p-1">
        <ZapIcon className={`text-white ${iconSizes[size]}`} />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="bg-[#000B21] p-1 rounded-md mr-2 flex items-center justify-center">
        <ZapIcon className={`text-white ${iconSizes[size]}`} />
      </div>
      <span className={`font-bold ${sizeClasses[size]} text-[#000B21]`}>
        Z<span className="text-[#00B2FF]">I</span>LT
      </span>
    </div>
  );
}