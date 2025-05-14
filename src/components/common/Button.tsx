import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leadingIcon,
  trailingIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-[#000B21] text-white hover:bg-[#001642] active:bg-[#001030]',
    secondary: 'bg-gray-100 text-[#000B21] hover:bg-gray-200 active:bg-gray-300',
    accent: 'bg-[#00B2FF] text-white hover:bg-[#0099E6] active:bg-[#007ACC]',
    outline: 'border border-gray-300 text-[#000B21] hover:bg-gray-50 active:bg-gray-100',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!isLoading && leadingIcon}
      {children}
      {!isLoading && trailingIcon}
    </button>
  );
}