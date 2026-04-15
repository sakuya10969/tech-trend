import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { githubTrendingRoutes } from "./github/routes/trending";
import { AppError, buildErrorResponse, formatZodErrorMessage, isRateLimitError } from "./lib/errors";
import { openApiDocument } from "./openapi/doc";

const app = new OpenAPIHono<{
  Bindings: {
    GITHUB_TOKEN?: string;
  };
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        buildErrorResponse(
          "VALIDATION_ERROR",
          formatZodErrorMessage(result.error),
        ),
        400,
      );
    }
  },
});

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "OPTIONS"],
  }),
);

app.doc31("/api/v1/doc", (c) => ({
  ...openApiDocument,
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
  ],
}));

app.get("/api/v1/ui", swaggerUI({ url: "/api/v1/doc" }));

app.route("/api/v1/github/trending", githubTrendingRoutes);

app.get("/", (c) =>
  c.json(
    {
      message: "Tech Trend API",
      openapi: "/api/v1/doc",
      swagger: "/api/v1/ui",
    },
    200,
  ),
);

app.onError((error, c) => {
  if (error instanceof AppError) {
    return c.json(buildErrorResponse(error.code, error.message), error.status);
  }

  if (error instanceof ZodError) {
    return c.json(
      buildErrorResponse("VALIDATION_ERROR", formatZodErrorMessage(error)),
      400,
    );
  }

  if (error instanceof HTTPException) {
    return c.json(
      buildErrorResponse("EXTERNAL_API_ERROR", error.message),
      error.status,
    );
  }

  if (isRateLimitError(error)) {
    return c.json(
      buildErrorResponse(
        "RATE_LIMIT_EXCEEDED",
        "GitHub API rate limit exceeded",
      ),
      429,
    );
  }

  console.error(error);

  return c.json(
    buildErrorResponse("INTERNAL_ERROR", "Internal server error"),
    500,
  );
});

export default app;
