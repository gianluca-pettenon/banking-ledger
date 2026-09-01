const port = Number(Bun.env.API_PORT);

Bun.serve({
  port,
  routes: {
    "/api/health": {
      GET: () => Response.json({ success: true }),
    },
    "/api/users": {
      GET: () => Response.json({ success: true }),
    },
    "/api/accounts/:userId": {
      GET: () => Response.json({ success: true }),
    },
    "/api/accounts/:userId/transactions": {
      POST: () => Response.json({ success: true }),
    },
  },
});

console.log(`API ready at http://localhost:${port}`);
