import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import { createErrorResponse } from "@/lib/error-utils";
import { authMiddleware, json } from "@/lib/middleware/auth";

export const Route = createFileRoute("/api/rate-limits")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ context }) => {
        try {
          const { client } = context;
          const rateLimitStatus = await client.query(api.users.getRateLimitStatus, {});

          return json(rateLimitStatus);
        } catch (err: unknown) {
          return createErrorResponse(err);
        }
      },
    },
  },
});
