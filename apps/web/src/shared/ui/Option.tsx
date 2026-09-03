import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

export type SelectOption = {
  value: string;
  label: string;
};

type OptionProps = SelectOption & {
  selected?: boolean;
  onSelect: () => void;
};

export function Option({ label, selected, onSelect }: OptionProps) {
  return (
    <li role="option" aria-selected={selected}>
      <Button
        variant="ghost"
        onClick={onSelect}
        className={cn(selected && 'select-option-selected')}
      >
        {label}
      </Button>
    </li>
  );
}
