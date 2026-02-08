import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-500 shadow-md hover:shadow-lg',
  secondary: 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 focus:ring-stone-400',
  outline: 'bg-transparent text-stone-700 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 focus:ring-emerald-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md hover:shadow-lg',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-300',
  luxury: 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white hover:from-emerald-800 hover:to-teal-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl',
  gold: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-400 shadow-md hover:shadow-lg',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1',
  sm: 'px-3 py-2 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
  xl: 'px-6 py-3.5 text-base gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  animate = true,
  ...props
}) {
  const Component = animate ? motion.button : 'button';

  const motionProps = animate
    ? {
      whileHover: { scale: disabled ? 1 : 1.02 },
      whileTap: { scale: disabled ? 1 : 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 17 },
    }
    : {};

  return (
    <Component
      {...motionProps}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !loading && iconPosition === 'left' && <Icon className="h-4 w-4 flex-shrink-0" />}
      {children}
      {Icon && !loading && iconPosition === 'right' && <Icon className="h-4 w-4 flex-shrink-0" />}
    </Component>
  );
}
