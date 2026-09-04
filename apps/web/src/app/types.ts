import type { OperationKind as Operation } from '@banking-ledger/shared';

export type { Operation };

export type User = {
  id: string;
  name: string;
};

export type Account = {
  balance: number;
};

export type RunEntry = {
  label: string;
  outcome: string;
  ms: number;
};
