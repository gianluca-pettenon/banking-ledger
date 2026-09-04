import { OPERATION_KINDS, OperationKind } from '@banking-ledger/shared';
import { CONCURRENCY, OPERATION } from '@banking-ledger/terms';

import type { Operation, RunEntry, User } from '@/app/types';
import { Button, type ButtonVariant, Input, Select } from '@/shared/ui';

import { RequestResults } from './RequestResults';

type OperationFormProps = {
  operation: Operation;
  running: boolean;
  amount: string;
  toUserId: string;
  recipients: User[];
  entries: RunEntry[];
  onOperationChange: (operation: Operation) => void;
  onAmountChange: (value: string) => void;
  onToUserIdChange: (userId: string) => void;
  onRun: (withIdempotencyKey: boolean) => void;
};

const operationVariants = {
  [OperationKind.Deposit]: 'primary',
  [OperationKind.Withdraw]: 'danger',
  [OperationKind.Transfer]: 'info',
} as const satisfies Record<Operation, ButtonVariant>;

export function OperationForm({
  operation,
  running,
  amount,
  toUserId,
  recipients,
  entries,
  onOperationChange,
  onAmountChange,
  onToUserIdChange,
  onRun,
}: OperationFormProps) {
  const recipientOptions = recipients.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <div className="order-2 space-y-5 lg:order-1">
      <p className="text-sm text-muted-foreground">
        {CONCURRENCY.COMPARE_NOTE}
      </p>

      <div className="grid grid-cols-1 gap-2 min-[22rem]:grid-cols-3">
        {OPERATION_KINDS.map((kind) => (
          <Button
            key={kind}
            variant={operation === kind ? operationVariants[kind] : 'outline'}
            disabled={running}
            onClick={() => onOperationChange(kind)}
            className="w-full px-3 py-2"
          >
            {OPERATION[kind].label}
          </Button>
        ))}
      </div>

      {operation === OperationKind.Transfer ? (
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">To</span>
          <Select
            value={toUserId}
            onChange={onToUserIdChange}
            options={recipientOptions}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Amount per request</span>
        <Input
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          className="font-mono tabular-nums"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant={operationVariants[operation]}
          disabled={running}
          onClick={() => onRun(true)}
          className="w-full"
        >
          {running ? CONCURRENCY.RUNNING : CONCURRENCY.WITH_IDEMPOTENCY}
        </Button>
        <Button
          disabled={running}
          onClick={() => onRun(false)}
          className="w-full"
        >
          {running ? CONCURRENCY.RUNNING : CONCURRENCY.WITHOUT_PROTECTION}
        </Button>
      </div>

      <RequestResults entries={entries} />
    </div>
  );
}
