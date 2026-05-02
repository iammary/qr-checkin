import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex w-fit items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold leading-none', {
  variants: {
    status: {
      default: 'border-primary/25 bg-primary/10 text-primary',
      neutral: 'border-border bg-muted text-foreground',
      info: 'border-info/25 bg-info/10 text-info',
      success: 'border-success/25 bg-success/10 text-success',
      warning: 'border-warning/35 bg-warning/10 text-warning',
      danger: 'border-destructive/25 bg-destructive/10 text-destructive',
    },
    size: {
      sm: 'px-2 py-0.5 text-[0.7rem]',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
    status: 'default',
  },
});

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

const Badge = ({ className, size, status, ...props }: BadgeProps) => (
  <span data-slot="badge" className={cn(badgeVariants({ size, status }), className)} {...props} />
);

export { Badge, badgeVariants };
