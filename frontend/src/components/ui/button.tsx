import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-[#04121a] font-semibold shadow-[0_8px_30px_-10px_rgba(34,211,238,0.7)] hover:bg-brand-soft hover:-translate-y-px active:translate-y-0',
        safe:
          'bg-safe text-[#052015] font-semibold shadow-[0_8px_30px_-10px_rgba(52,211,153,0.7)] hover:bg-safe-soft hover:-translate-y-px',
        outline:
          'border border-hairline-strong bg-surface-raised/60 text-content hover:border-brand/60 hover:bg-surface-raised hover:text-white',
        ghost: 'text-content-muted hover:text-white hover:bg-white/5',
      },
      size: {
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-[0.95rem]',
        sm: 'h-9 px-3 text-xs',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
