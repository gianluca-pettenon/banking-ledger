import { CONCURRENCY_DEMO, OperationKind } from '@banking-ledger/shared';
import { CONCURRENCY } from '@banking-ledger/terms';
import { useState } from 'react';

import { AccountSelector } from '@/app/components/AccountSelector';
import { BalanceCard } from '@/app/components/BalanceCard';
import { OperationForm } from '@/app/components/OperationForm';
import { useAccountBalance } from '@/app/hooks/useAccountBalance';
import { useUsers } from '@/app/hooks/useUsers';
import { runConcurrentRequests } from '@/app/lib/api';
import type { Operation, RunEntry } from '@/app/types';

export function App() {
  const { users, userId, setUserId } = useUsers();
  const { balance, refresh: refreshBalance } = useAccountBalance(userId);

  const [operation, setOperation] = useState<Operation>(OperationKind.Deposit);
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState(String(CONCURRENCY_DEMO.DEFAULT_AMOUNT));
  const [running, setRunning] = useState(false);
  const [entries, setEntries] = useState<RunEntry[]>([]);

  const recipients = users.filter((user) => user.id !== userId);
  const selectedRecipientId = toUserId || recipients[0]?.id || '';
  const parsedAmount = Number(amount) || CONCURRENCY_DEMO.DEFAULT_AMOUNT;

  async function handleRun(withIdempotencyKey: boolean) {
    if (!userId || running) return;

    setRunning(true);
    setEntries([]);

    try {
      const results = await runConcurrentRequests({
        operation,
        userId,
        toUserId: selectedRecipientId,
        amount: parsedAmount,
        withIdempotencyKey,
      });

      setEntries(results);
      refreshBalance();
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <AccountSelector users={users} userId={userId} onChange={setUserId} />

      <main className="container py-6 sm:py-8">
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {CONCURRENCY.DRAWER.TITLE}
            </p>
            <p className="text-sm text-muted-foreground">
              {CONCURRENCY.DRAWER.DESCRIPTION}
            </p>
          </div>

          <div className="split-layout">
            <OperationForm
              operation={operation}
              running={running}
              amount={amount}
              toUserId={toUserId}
              recipients={recipients}
              entries={entries}
              onOperationChange={setOperation}
              onAmountChange={setAmount}
              onToUserIdChange={setToUserId}
              onRun={handleRun}
            />

            <BalanceCard balance={balance} />
          </div>
        </section>
      </main>
    </>
  );
}
