import { ACCOUNT } from '@banking-ledger/terms';

import type { User } from '@/app/types';
import { Select } from '@/shared/ui';

type AccountSelectorProps = {
  users: User[];
  userId: string;
  onChange: (id: string) => void;
};

export function AccountSelector({
  users,
  userId,
  onChange,
}: AccountSelectorProps) {
  const options = users.map((user) => ({ value: user.id, label: user.name }));

  return (
    <header className="sticky top-0 z-10 overflow-visible border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container flex min-h-[var(--height-topbar)] items-center">
        <div className="flex w-full flex-col gap-1.5 text-sm sm:ml-auto sm:w-auto sm:min-w-[12rem]">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {ACCOUNT.LABEL}
          </span>
          <Select value={userId} onChange={onChange} options={options} />
        </div>
      </div>
    </header>
  );
}
