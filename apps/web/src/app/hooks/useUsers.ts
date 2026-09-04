import { useEffect, useState } from 'react';

import { fetchUsers } from '@/app/lib/api';
import type { User } from '@/app/types';

async function fetchUserList() {
  const { users } = await fetchUsers();

  return users;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(
    () => {
      void fetchUserList().then((nextUsers) => {
        const [firstUser] = nextUsers;

        setUsers(nextUsers);
        setUserId(firstUser?.id ?? '');
      });
    }, [],
  );

  return { users, userId, setUserId };
}
