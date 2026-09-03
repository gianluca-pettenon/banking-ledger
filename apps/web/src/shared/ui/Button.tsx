import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'info'
  | 'ghost'
  | 'outline';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'rounded-lg border border-transparent bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:brightness-105',
  secondary:
    'rounded-lg border border-border bg-muted px-4 py-2.5 font-medium text-foreground hover:border-ring',
  danger:
    'rounded-lg border border-transparent bg-danger px-4 py-2.5 font-medium text-danger-foreground hover:brightness-105',
  info:
    'rounded-lg border border-transparent bg-info px-4 py-2.5 font-medium text-info-foreground hover:brightness-105',
  outline:
    'rounded-lg border border-border bg-background/50 px-4 py-2.5 font-medium text-muted-foreground hover:border-ring hover:text-foreground',
  ghost:
    'h-auto w-full justify-start rounded-md border-0 bg-transparent px-3 py-2 font-normal text-left text-foreground hover:bg-muted/80',
};

export function Button({
  className,
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'text-sm transition disabled:cursor-not-allowed disabled:opacity-40',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
