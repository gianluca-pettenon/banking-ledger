import { ACCOUNT } from '@banking-ledger/terms';
import { formatUsd } from '@/shared/lib/format';

type BalanceCardProps = {
  balance: number | null;
};

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <aside className="balance-card balance-card-sticky order-1 lg:order-2">
      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {ACCOUNT.BALANCE_LABEL}
      </p>
      <p className="mt-3 font-mono text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
        {balance === null ? '—' : formatUsd(balance)}
      </p>
    </aside>
  );
}
