import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-stone-100 text-stone-800',
  primary: 'bg-emerald-100 text-emerald-800',
  secondary: 'bg-stone-100 text-stone-600',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-teal-100 text-teal-800',
  outline: 'bg-transparent border border-gray-300 text-gray-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'primary' && 'bg-emerald-500',
            variant === 'info' && 'bg-teal-500',
            variant === 'default' && 'bg-stone-500'
          )}
        />
      )}
      {children}
    </span>
  );
}
