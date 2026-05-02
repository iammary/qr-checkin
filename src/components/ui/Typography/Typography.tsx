import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    scale: {
      body: 'text-base leading-7',
      bodySm: 'text-sm leading-6',
      label: 'text-sm font-semibold leading-5',
      title: 'text-2xl leading-8 font-semibold sm:text-3xl sm:leading-10',
      section: 'text-lg leading-7 font-semibold',
      value: 'font-mono text-xl leading-7 font-semibold',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-destructive',
      inverse: 'text-primary-foreground',
    },
  },
  defaultVariants: {
    scale: 'body',
    tone: 'default',
  },
});

const fallbackElements = {
  body: 'p',
  bodySm: 'p',
  label: 'p',
  title: 'h1',
  section: 'h2',
  value: 'p',
} as const;

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType;
  };

const Typography = ({ as, className, scale = 'body', tone = 'default', ...props }: TypographyProps) => {
  const Component = as ?? fallbackElements[scale ?? 'body'];

  return <Component className={cn(typographyVariants({ scale, tone }), className)} {...props} />;
};

export { Typography, typographyVariants };
