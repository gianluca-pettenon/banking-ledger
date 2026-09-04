import { users } from "@banking-ledger/ledger";
import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";

const port = Number(Bun.env.API_PORT);

function readRequestMeta({ headers }: Request) {
	const idempotencyKey = headers.get("Idempotency-Key")?.trim() || null;
	const requestId = headers.get("X-Request-Id")?.trim() || Bun.randomUUIDv7();

	return {
		idempotencyKey,
		requestId,
	};
}

const app = new Elysia({ prefix: "/api" })
	.use(openapi({ path: "/docs" }))
	.get(
		"/health",
		() => ({ success: true }),
		{
			detail: {
				summary: "Check API availability",
				tags: ["health"],
			},
		},
	)
	.get(
		"/users",
		() => ({ success: true, users: [...users] }),
		{
			detail: {
				summary: "List users",
				tags: ["users"],
			},
		},
	)
	.get(
		"/accounts/:userId",
		({ params }) => ({ success: true, ...params }),
		{
			detail: {
				summary: "Get account snapshot",
				tags: ["accounts"],
			},
		},
	)
	.post(
		"/accounts/:userId/transactions",
		({ body, params, request }) => ({
			success: true,
			...params,
			body,
			meta: readRequestMeta(request),
		}),
		{
			detail: {
				summary: "Create an account transaction",
				tags: ["accounts"],
			},
		},
	)
	.post(
		"/transfers",
		({ body, request }) => ({
			success: true,
			body,
			meta: readRequestMeta(request),
		}),
		{
			detail: {
				summary: "Create a transfer",
				tags: ["transfers"],
			},
		},
	);

app.listen(port);

console.log(`API ready at http://localhost:${port}`);
