import { users } from '@banking-ledger/ledger';

const port = Number(Bun.env.API_PORT);

function readHeaders(request: Request) {
  const idempotencyKey = request.headers.get('Idempotency-Key')?.trim();
  const requestId = request.headers.get('X-Request-Id')?.trim();

  return {
    idempotencyKey: idempotencyKey || null,
    requestId: requestId || Bun.randomUUIDv7(),
  };
}

Bun.serve({
  port,
  routes: {
    '/api/health': {
      GET: () => Response.json({ success: true }),
    },
    '/api/id': {
      GET: () => Response.json({ id: Bun.randomUUIDv7() }),
    },
    '/api/users': {
      GET: () => Response.json({ success: true, users }),
    },
    '/api/accounts/:userId': {
      GET: ({ params }) => Response.json({ success: true, ...params }),
    },
    '/api/accounts/:userId/transactions': {
      POST: async ({ params }) => Response.json({ success: true, ...params }),
    },
    '/api/transfers': {
      POST: async ({ request }) => Response.json({ success: true, ...request }),
    },
  },
});

console.log(`API ready at http://localhost:${port}`);
