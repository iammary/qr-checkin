import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'min-h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  {
    variants: {
      size: {
        md: 'min-h-11',
        lg: 'min-h-12 px-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants> & {
    htmlSize?: React.ComponentProps<'input'>['size'];
  };

const Input = ({ className, htmlSize, size, type = 'text', ...props }: InputProps) => (
  <input type={type} size={htmlSize} data-slot="input" className={cn(inputVariants({ size }), className)} {...props} />
);

export { Input, inputVariants };
