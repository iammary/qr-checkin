import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6', {
  variants: {
    tone: {
      danger: 'border-destructive/25 bg-destructive/8 text-foreground',
      info: 'border-info/25 bg-info/8 text-foreground',
      success: 'border-success/25 bg-success/8 text-foreground',
      warning: 'border-warning/30 bg-warning/10 text-foreground',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

const toneIcons = {
  danger: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
};

const toneIconColors = {
  danger: 'text-destructive',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
};

type AlertProps = React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    showIcon?: boolean;
  };

const Alert = ({ children, className, showIcon = true, tone = 'info', ...props }: AlertProps) => {
  const Icon = toneIcons[tone ?? 'info'];

  return (
    <div role="alert" className={cn(alertVariants({ tone }), className)} {...props}>
      {showIcon ? <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', toneIconColors[tone ?? 'info'])} /> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export { Alert };
