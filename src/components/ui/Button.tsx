import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600 border border-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2 text-sm",
    lg: "h-11 px-8 text-base"
  };

  return (
    <button 
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
