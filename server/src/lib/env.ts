import { AppError } from "./errors";

type RuntimeEnv = {
  GITHUB_TOKEN?: string;
};

export const getGithubToken = (env: RuntimeEnv) => {
  const token = env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;

  if (!token) {
    throw new AppError(
      "INTERNAL_ERROR",
      "GitHub API token is not configured",
      500,
    );
  }

  return token;
};
