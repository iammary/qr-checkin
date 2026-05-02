import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      contrast: {
        solid: '',
        outline: 'bg-background',
        ghost: 'border-transparent bg-transparent',
      },
      size: {
        sm: 'min-h-10 px-3',
        md: 'min-h-11 px-4',
        lg: 'min-h-12 px-5 text-base',
        icon: 'size-11 p-0',
      },
      tone: {
        default: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
    },
    compoundVariants: [
      { contrast: 'solid', tone: 'default', className: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90' },
      { contrast: 'outline', tone: 'default', className: 'border-primary/35 text-primary hover:bg-primary/10' },
      { contrast: 'ghost', tone: 'default', className: 'text-primary hover:bg-primary/10' },
      { contrast: 'solid', tone: 'secondary', className: 'border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80' },
      { contrast: 'outline', tone: 'secondary', className: 'border-border text-foreground hover:bg-muted' },
      { contrast: 'ghost', tone: 'secondary', className: 'text-foreground hover:bg-muted' },
      { contrast: 'solid', tone: 'success', className: 'border-success bg-success text-success-foreground hover:bg-success/90' },
      { contrast: 'outline', tone: 'success', className: 'border-success/35 text-success hover:bg-success/10' },
      { contrast: 'ghost', tone: 'success', className: 'text-success hover:bg-success/10' },
      { contrast: 'solid', tone: 'warning', className: 'border-warning bg-warning text-warning-foreground hover:bg-warning/90' },
      { contrast: 'outline', tone: 'warning', className: 'border-warning/35 text-warning hover:bg-warning/10' },
      { contrast: 'ghost', tone: 'warning', className: 'text-warning hover:bg-warning/10' },
      { contrast: 'solid', tone: 'danger', className: 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90' },
      { contrast: 'outline', tone: 'danger', className: 'border-destructive/35 text-destructive hover:bg-destructive/10' },
      { contrast: 'ghost', tone: 'danger', className: 'text-destructive hover:bg-destructive/10' },
      { contrast: 'solid', tone: 'info', className: 'border-info bg-info text-info-foreground hover:bg-info/90' },
      { contrast: 'outline', tone: 'info', className: 'border-info/35 text-info hover:bg-info/10' },
      { contrast: 'ghost', tone: 'info', className: 'text-info hover:bg-info/10' },
    ],
    defaultVariants: {
      contrast: 'solid',
      size: 'md',
      tone: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = ({ asChild = false, className, contrast, size, tone, ...props }: ButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return <Component data-slot="button" className={cn(buttonVariants({ contrast, size, tone }), className)} {...props} />;
};

export { Button, buttonVariants };
