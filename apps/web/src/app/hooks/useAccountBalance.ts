import { useEffect, useState } from 'react';

import { fetchAccount } from '@/app/lib/api';

async function fetchBalance(userId: string) {
  if (!userId) {
    return null;
  }

  const { account } = await fetchAccount(userId);

  return account.balance;
}

export function useAccountBalance(userId: string) {
  const [balance, setBalance] = useState<number | null>(null);

  async function refresh() {
    const nextBalance = await fetchBalance(userId);

    setBalance(nextBalance);
  }

  useEffect(
    () => {
      void fetchBalance(userId).then(setBalance);
    }, [userId],
  );

  return { balance, refresh };
}
