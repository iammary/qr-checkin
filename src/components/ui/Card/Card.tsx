import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg border text-card-foreground shadow-sm transition-colors', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    },
    tone: {
      panel: 'border-border bg-card',
      muted: 'border-border bg-muted/45',
      info: 'border-info/25 bg-info/8',
      success: 'border-success/25 bg-success/8',
      warning: 'border-warning/30 bg-warning/10',
      danger: 'border-destructive/25 bg-destructive/8',
    },
  },
  defaultVariants: {
    padding: 'md',
    tone: 'panel',
  },
});

type CardProps<T extends React.ElementType = 'div'> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'> &
  VariantProps<typeof cardVariants>;

const Card = <T extends React.ElementType = 'div'>({ as, className, padding, tone, ...props }: CardProps<T>) => {
  const Component = as ?? 'div';

  return <Component data-slot="card" className={cn(cardVariants({ padding, tone }), className)} {...props} />;
};

const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div data-slot="card-header" className={cn('grid gap-1', className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.ComponentProps<'h2'>) => (
  <h2 data-slot="card-title" className={cn('text-lg leading-7 font-semibold', className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.ComponentProps<'p'>) => (
  <p data-slot="card-description" className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />
);

const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => <div data-slot="card-content" className={cn(className)} {...props} />;

const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div data-slot="card-footer" className={cn('flex items-center gap-3 border-t border-border pt-4', className)} {...props} />
);

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
