import { createRoute, z } from "@hono/zod-openapi";
import { errorResponseSchema } from "../../lib/errors";

export const periodSchema = z
  .enum(["daily", "weekly"])
  .default("daily")
  .openapi({
    example: "daily",
    description: "Trend aggregation period.",
  });

export const trendingRepositoriesQuerySchema = z.object({
  language: z
    .string()
    .optional()
    .openapi({
      param: {
        name: "language",
        in: "query",
      },
      example: "TypeScript,Rust",
      description:
        "Optional language filter. Multiple values can be passed as a comma-separated string.",
    }),
  period: periodSchema.openapi({
    param: {
      name: "period",
      in: "query",
    },
  }),
});

export const trendingRepositorySchema = z
  .object({
    name: z.string().openapi({ example: "example-repo" }),
    owner: z.string().openapi({ example: "example-user" }),
    description: z.string().nullable(),
    language: z.string().nullable().openapi({ example: "TypeScript" }),
    languageColor: z.string().nullable().openapi({ example: "#3178c6" }),
    stars: z.number().int().openapi({ example: 12345 }),
    forks: z.number().int().openapi({ example: 678 }),
    url: z.string().url(),
    trendScore: z.number().openapi({ example: 95.2 }),
  })
  .openapi("TrendingRepository");

export const trendingRepositoriesResponseSchema = z
  .object({
    repositories: z.array(trendingRepositorySchema),
    period: periodSchema,
    fetchedAt: z.string().datetime(),
  })
  .openapi("TrendingRepositoriesResponse");

export const trendingLanguageSchema = z
  .object({
    name: z.string().openapi({ example: "TypeScript" }),
    color: z.string().nullable().openapi({ example: "#3178c6" }),
  })
  .openapi("TrendingLanguage");

export const trendingLanguagesResponseSchema = z
  .object({
    languages: z.array(trendingLanguageSchema),
  })
  .openapi("TrendingLanguagesResponse");

export const getTrendingRepositoriesRoute = createRoute({
  operationId: "getTrendingRepositories",
  method: "get",
  path: "/repositories",
  tags: ["GitHub Trending"],
  summary: "Get trending GitHub repositories",
  request: {
    query: trendingRepositoriesQuerySchema,
  },
  responses: {
    200: {
      description: "Trending repositories",
      content: {
        "application/json": {
          schema: trendingRepositoriesResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    429: {
      description: "Rate limit exceeded",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "External API error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: "Internal error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

export const getTrendingLanguagesRoute = createRoute({
  operationId: "getTrendingLanguages",
  method: "get",
  path: "/languages",
  tags: ["GitHub Trending"],
  summary: "Get languages included in trending results",
  request: {
    query: z.object({
      period: periodSchema.openapi({
        param: {
          name: "period",
          in: "query",
        },
      }),
    }),
  },
  responses: {
    200: {
      description: "Trending languages",
      content: {
        "application/json": {
          schema: trendingLanguagesResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    429: {
      description: "Rate limit exceeded",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    502: {
      description: "External API error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: "Internal error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
