export type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
  amount: number;
  createdAt: string;
  counterpartyUserId?: string;
  counterpartyName?: string;
};

export type Account = {
  userId: string;
  balance: number;
  transactions: Transaction[];
};

export type RequestOutcome = 'processed' | 'duplicate';

export type RequestMeta = {
  requestId: string;
  idempotencyKey: string | null;
  outcome: RequestOutcome;
  message: string;
  queueWaitMs: number;
};

export type TransactionResult = {
  account: Account;
  meta: RequestMeta;
};

export const users = [
  { id: '1', name: 'User A' },
  { id: '2', name: 'User B' },
  { id: '3', name: 'User C' },
  { id: '4', name: 'User D' },
] as const;