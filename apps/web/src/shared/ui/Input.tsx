import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

type InputProps = ComponentProps<'input'>;

export function Input({
  className,
  autoComplete = 'off',
  ...props
}: InputProps) {
  return (
    <input
      autoComplete={autoComplete}
      className={cn('input', className)}
      {...props}
    />
  );
}
