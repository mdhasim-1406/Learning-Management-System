import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  animate = false,
  delay = 0,
  variant = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardVariants = {
    default: 'bg-white border-stone-200/80',
    glass: 'glass-card',
    elevated: 'bg-white shadow-luxury border-transparent',
    outline: 'bg-transparent border-stone-300 border-dashed',
  };

  const Component = hover || animate ? motion.div : 'div';

  const motionProps = {
    ...(hover && {
      whileHover: {
        y: -4,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      },
    }),
    ...(animate && {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <Component
      {...motionProps}
      className={cn(
        'rounded-2xl border',
        cardVariants[variant],
        hover && 'cursor-pointer transition-shadow duration-300',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('border-b border-stone-100 pb-4 mb-5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as: Tag = 'h3' }) {
  return (
    <Tag className={cn('text-lg font-bold text-stone-900 tracking-tight', className)}>
      {children}
    </Tag>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={cn('text-sm text-stone-500 mt-1.5 leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('border-t border-stone-100 pt-5 mt-5', className)}>
      {children}
    </div>
  );
}
