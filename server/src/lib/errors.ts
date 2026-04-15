import { z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import type { ZodError } from "zod";

export const errorCodeValues = [
  "RATE_LIMIT_EXCEEDED",
  "EXTERNAL_API_ERROR",
  "VALIDATION_ERROR",
  "INTERNAL_ERROR",
] as const;

export const errorCodeSchema = z.enum(errorCodeValues).openapi("ErrorCode");

export const errorResponseSchema = z
  .object({
    error: z.object({
      code: errorCodeSchema,
      message: z.string(),
    }),
  })
  .openapi("ErrorResponse");

export type ErrorCode = (typeof errorCodeValues)[number];
export type AppErrorStatus = 400 | 429 | 500 | 502;

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: AppErrorStatus;

  constructor(code: ErrorCode, message: string, status: AppErrorStatus = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export const buildErrorResponse = (code: ErrorCode, message: string) => ({
  error: {
    code,
    message,
  },
});

export const formatZodErrorMessage = (error: ZodError) =>
  error.issues.map((issue) => issue.message).join(", ");

export const isRateLimitError = (error: unknown) => {
  if (
    error instanceof HTTPException &&
    (error.status === 403 || error.status === 429)
  ) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("rate limit") ||
    message.includes("secondary rate limit") ||
    message.includes("api rate limit exceeded")
  );
};
