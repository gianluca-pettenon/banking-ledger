import {
  CONCURRENCY_DEMO,
  OperationKind,
  OPERATION_KINDS,
} from '@banking-ledger/shared';
import type { OperationKind as Operation } from '@banking-ledger/shared';
import { ACCOUNT, CONCURRENCY, OPERATION } from '@banking-ledger/terms';
import { useEffect, useState } from 'react';
import { formatUsd } from '@/shared/lib/format';
import { Button, Input, Select, type ButtonVariant } from '@/shared/ui';

type User = { id: string; name: string };
type Entry = { label: string; outcome: string; ms: number };

const OPERATION_BUTTON_VARIANT = {
  [OperationKind.Deposit]: 'primary',
  [OperationKind.Withdraw]: 'danger',
  [OperationKind.Transfer]: 'info',
} as const satisfies Record<Operation, ButtonVariant>;

function demoHeaders(idempotencyKey?: string) {
  return {
    'Content-Type': 'application/json',
    ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
  };
}

export function App() {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(OperationKind.Deposit);
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState(String(CONCURRENCY_DEMO.DEFAULT_AMOUNT));
  const [running, setRunning] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  const recipients = users.filter((user) => user.id !== userId);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data: { users: User[] }) => {
        setUsers(data.users);
        if (data.users[0]) setUserId(data.users[0].id);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/accounts/${userId}`)
      .then((response) => response.json())
      .then((data: { account: { balance: number } }) => setBalance(data.account.balance));
  }, [userId]);

  async function run(withKey: boolean) {
    if (!userId || running) return;

    setRunning(true);
    setEntries([]);

    const value = Number(amount) || CONCURRENCY_DEMO.DEFAULT_AMOUNT;
    const to = toUserId || recipients[0]?.id || '';
    const idempotencyKey = withKey
      ? await fetch('/api/id')
          .then((response) => response.json())
          .then((data: { id: string }) => data.id)
      : undefined;

    const results = await Promise.all(
      Array.from({ length: CONCURRENCY_DEMO.REQUEST_COUNT }, async (_, index) => {
        const label = `#${index + 1}`;
        const start = Date.now();

        try {
          const response = await fetch(
            operation === OperationKind.Transfer
              ? '/api/transfers'
              : `/api/accounts/${userId}/transactions`,
            {
              method: 'POST',
              headers: demoHeaders(idempotencyKey),
              body: JSON.stringify(
                operation === OperationKind.Transfer
                  ? { fromUserId: userId, toUserId: to, amount: value }
                  : { type: operation, amount: value },
              ),
            },
          );
          const data = await response.json();

          return { label, outcome: data.meta.outcome, ms: Date.now() - start };
        } catch {
          return { label, outcome: 'failed', ms: Date.now() - start };
        }
      }),
    );

    setEntries(results);
    fetch(`/api/accounts/${userId}`)
      .then((response) => response.json())
      .then((data: { account: { balance: number } }) => setBalance(data.account.balance));
    setRunning(false);
  }

  return (
    <>
      <header className="sticky top-0 z-10 overflow-visible border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container flex min-h-[var(--height-topbar)] items-center">
          <label className="flex w-full flex-col gap-1.5 text-sm sm:ml-auto sm:w-auto sm:min-w-[12rem]">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {ACCOUNT.LABEL}
            </span>
            <Select
              value={userId}
              onChange={setUserId}
              options={users.map((user) => ({ value: user.id, label: user.name }))}
            />
          </label>
        </div>
      </header>

      <main className="container py-6 sm:py-8">
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {CONCURRENCY.DRAWER.TITLE}
            </p>
            <p className="text-sm text-muted-foreground">{CONCURRENCY.DRAWER.DESCRIPTION}</p>
          </div>

          <div className="split-layout">
            <div className="order-2 space-y-5 lg:order-1">
              <p className="text-sm text-muted-foreground">{CONCURRENCY.COMPARE_NOTE}</p>

              <div className="grid grid-cols-1 gap-2 min-[22rem]:grid-cols-3">
                {OPERATION_KINDS.map((kind) => (
                  <Button
                    key={kind}
                    variant={operation === kind ? OPERATION_BUTTON_VARIANT[kind] : 'outline'}
                    disabled={running}
                    onClick={() => setOperation(kind)}
                    className="w-full px-3 py-2"
                  >
                    {OPERATION[kind].label}
                  </Button>
                ))}
              </div>

              {operation === OperationKind.Transfer ? (
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-muted-foreground">To</span>
                  <Select
                    value={toUserId}
                    onChange={setToUserId}
                    options={recipients.map((user) => ({ value: user.id, label: user.name }))}
                  />
                </label>
              ) : null}

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">Amount per request</span>
                <Input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="font-mono tabular-nums"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  variant={OPERATION_BUTTON_VARIANT[operation]}
                  disabled={running}
                  onClick={() => run(true)}
                  className="w-full"
                >
                  {running ? CONCURRENCY.RUNNING : CONCURRENCY.WITH_IDEMPOTENCY}
                </Button>
                <Button disabled={running} onClick={() => run(false)} className="w-full">
                  {running ? CONCURRENCY.RUNNING : CONCURRENCY.WITHOUT_PROTECTION}
                </Button>
              </div>

              <div className="min-h-32 rounded-xl border border-dashed border-border/80 bg-background/40 p-4 font-mono text-xs text-muted-foreground">
                {entries.length === 0 ? (
                  <p className="text-center text-sm">{CONCURRENCY.RUN_SCENARIO_HINT}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {entries.map((entry) => (
                      <li key={entry.label}>
                        {entry.label} · {entry.outcome} · {entry.ms}ms
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <aside className="balance-card balance-card-sticky order-1 lg:order-2">
              <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {ACCOUNT.BALANCE_LABEL}
              </p>
              <p className="mt-3 font-mono text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
                {balance === null ? '—' : formatUsd(balance)}
              </p>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
